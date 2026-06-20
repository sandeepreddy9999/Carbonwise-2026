const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');

const styleRegex = /<style>([\s\S]*?)<\/style>/;
const scriptRegex = /<script>([\s\S]*?)<\/script>/;

const styleMatch = html.match(styleRegex);
const scriptMatch = html.match(scriptRegex);

if (styleMatch) {
    fs.writeFileSync('styles.css', styleMatch[1].trim());
    console.log('Created styles.css');
}

if (scriptMatch) {
    fs.writeFileSync('app.js', scriptMatch[1].trim());
    console.log('Created app.js');
}

let newHtml = html;
if (styleMatch) {
    newHtml = newHtml.replace(styleRegex, '<link rel="stylesheet" href="styles.css">');
}
if (scriptMatch) {
    newHtml = newHtml.replace(scriptRegex, '<script src="app.js" defer></script>');
}

fs.writeFileSync('index.html', newHtml);
console.log('Updated index.html');
