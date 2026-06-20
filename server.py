"""
CarbonWise API Server
Proxies Gemini API calls so the key never reaches the client.
"""
import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Allow all origins — frontend can be on any domain

GEMINI_KEY = os.environ.get('GEMINI_API_KEY', '')
if GEMINI_KEY:
    genai.configure(api_key=GEMINI_KEY)
    model = genai.GenerativeModel('gemini-2.0-flash')
else:
    model = None
    logger.warning('GEMINI_API_KEY not set — AI features unavailable')

MAX_INPUT_LENGTH = 2000

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/<path:filename>')
def static_files(filename):
    """Serve static assets — app.js, styles.css, utils.js etc."""
    allowed = {'app.js', 'styles.css', 'utils.js', 'app.test.js',
               'jest.config.js', 'package.json', 'README.md'}
    if filename in allowed or filename.endswith(('.js', '.css', '.html', '.md')):
        return app.send_static_file(filename)
    return jsonify({'error': 'Not found'}), 404

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Accepts activity log, calls Gemini, returns carbon analysis.
    The Gemini API key never leaves the server.
    """
    if model is None:
        return jsonify({'error': 'AI service not configured on server'}), 503
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({'error': 'Invalid JSON body'}), 400

        activities = data.get('activities', [])
        total_kg = float(data.get('totalKg', 0))

        if not isinstance(activities, list):
            return jsonify({'error': 'activities must be an array'}), 400
        if total_kg < 0 or total_kg > 10000:
            return jsonify({'error': 'Invalid totalKg value'}), 400

        # Sanitize activity names before sending to AI
        safe_acts = []
        for a in activities[:50]:  # cap at 50 entries
            name = str(a.get('nm', ''))[:100]
            kg = float(a.get('co2', 0))
            qty = float(a.get('qty', 0))
            unit = str(a.get('u', ''))[:20]
            if kg >= 0:
                safe_acts.append(f"{name}: {qty} {unit} = {kg:.2f} kg CO₂")

        activity_text = '; '.join(safe_acts) if safe_acts else 'No activities logged'

        prompt = f"""You are CarbonWise AI, a premium sustainability advisor.
Activities logged today: {activity_text}
Total: {total_kg:.2f} kg CO₂. Global average: 13.5 kg/day.
Paris Agreement target: 2.5 kg/day per person by 2030.

Reply ONLY in this JSON structure, no markdown, no extra text:
{{"score":"A+/A/B/C/D","positive":"specific praise mentioning actual logged items",
"impact":"biggest emission source with brief explanation",
"actions":["specific action 1 tied to logged data","action 2","action 3"],
"parisGap": {{"onTrack": true/false, "kgOverTarget": number, "message": "one sentence on Paris alignment"}},
"summary":"one motivating sentence"}}

Grade: A+=0-6kg, A=6-10kg, B=10-13.5kg, C=13.5-20kg, D=20kg+"""

        # Enforce max prompt length
        if len(prompt) > MAX_INPUT_LENGTH:
            prompt = prompt[:MAX_INPUT_LENGTH]

        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
                max_output_tokens=500,
            )
        )

        raw = response.text.strip()
        # Strip markdown fences if present
        raw = raw.replace('```json', '').replace('```', '').strip()
        parsed = json.loads(raw)

        return jsonify(parsed)

    except json.JSONDecodeError as e:
        logger.error("Gemini response was not valid JSON: %s", e)
        return jsonify({'error': 'AI response parsing failed'}), 502
    except Exception as e:
        logger.error("Analysis error: %s", e)
        return jsonify({'error': 'Analysis failed, please try again'}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint for Cloud Run."""
    return jsonify({'status': 'ok', 'service': 'carbonwise-api'}), 200


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False)