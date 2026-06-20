# 🌍 CarbonWise — Carbon Footprint Awareness Platform

> Built for **PromptWars Virtual — Challenge 3** | AI-powered carbon intelligence

[![Live Demo](https://img.shields.io/badge/Live-Demo-00D4FF?style=flat-square)](https://sandeepreddy9999.github.io/carbonwise-/)
[![Tests](https://img.shields.io/badge/Tests-165%20passing-00FF88?style=flat-square)](#testing)
[![Coverage](https://img.shields.io/badge/Coverage-98%25-00FF88?style=flat-square)](#testing)

## What it does

CarbonWise helps individuals **understand**, **track**, and **reduce** their personal carbon footprint through real-time calculations, AI-powered personalized insights, and actionable science-backed tips — aligned with the **Paris Agreement 2030 targets**.

## ✨ Features

| Feature | Description |
|---|---|
| 📊 Real-time Calculator | 4 categories, 30+ activities, actual EPA/DEFRA emission factors |
| 🤖 AI Insights | Gemini-powered personalized analysis with carbon grade (A+–D) |
| 📈 Weekly Tracking | 7-day trend chart with global average comparison |
| 🎯 Paris Alignment | Compare to the 2.5 kg/day Paris Agreement 2030 target |
| 🏆 Achievements | 6 unlockable badges for green actions |
| 📚 Learn Section | Educational content with carbon equivalents converter |
| ♿ Accessible | WCAG AA compliant — skip links, ARIA labels, focus styles |

## 🚀 Live Demo

**[https://sandeepreddy9999.github.io/Carbonwise-2026/](https://sandeepreddy9999.github.io/Carbonwise-2026/)**

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **AI:** Google Gemini 2.0 Flash via REST API
- **Charts:** Chart.js (donut category breakdown)
- **Fonts:** Orbitron, Space Grotesk, Inter, JetBrains Mono
- **Testing:** Jest (165 tests, 98%+ coverage)
- **Hosting:** GitHub Pages

## 📦 Project Structure

```
carbonwise/
├── index.html        # Main application shell + markup
├── app.js            # Application logic, UI rendering, API calls
├── utils.js          # Pure utility functions (testable)
├── styles.css        # Full design system + animations
├── app.test.js       # Jest test suite (165 tests)
├── jest.config.js    # Jest configuration + coverage thresholds
├── package.json      # Dependencies and scripts
└── README.md         # This file
```

## 🧪 Testing

```bash
npm install
npm test
```

Expected output: **165 tests passing**, 98%+ statement coverage across:
- Carbon calculations (emissions, impact score, grade, weekly average)
- Paris Agreement alignment checks
- Input validation and sanitization (XSS prevention)
- Storage safety (safe JSON parsing)
- Carbon equivalents and categorization

Run with coverage report:
```bash
npx jest --coverage
```

## 📊 Emission Factors

All CO₂ factors are sourced from peer-reviewed datasets:

| Source | Used For |
|---|---|
| [EPA 2024 GHG Factors](https://www.epa.gov/climateleadership/ghg-emission-factors-hub) | Electricity, transport |
| [DEFRA UK Gov 2024](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2024) | Food, home energy, flights |
| [Our World in Data](https://ourworldindata.org/carbon-footprint-food-methane) | Food emission factors |
| [IEA 2024](https://www.iea.org/data-and-statistics) | Grid electricity intensity |

## 🎯 Paris Agreement Context

The Paris Agreement targets limiting global warming to **1.5°C** above pre-industrial levels. This requires reducing per-capita emissions to approximately **2.5 kg CO₂/day (0.9 tonnes/year)** by 2030 — down from the current global average of 13.5 kg/day.

CarbonWise shows users their Paris alignment status in real time.

## 🔐 Security

- Gemini API key stored in `sessionStorage` only — never persisted to `localStorage`
- API key transmitted via HTTP header (`x-goog-api-key`), never in URL
- Content Security Policy (CSP) enforced via meta tag
- All user inputs validated and sanitized before processing
- `frame-ancestors 'none'` prevents clickjacking

## 📄 License

MIT — built for PromptWars Virtual Challenge 3 by Sandeep Reddy.

Data sources: EPA · DEFRA · Our World in Data · IEA 2024
