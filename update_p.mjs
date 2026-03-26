import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    let filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('./app');
let modifiedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // regex to match <p ... className="..." ...> and replace text-[#A68966] with text-[#1A1714]
  const pTagRegex = /<p\b([^>]*)className=(["'])(.*?)\2([^>]*)>/g;
  content = content.replace(pTagRegex, (match, before, quote, classNameStr, after) => {
    // only replace the brown color with the dark text color
    const newClassName = classNameStr.replace(/text-\[#A68966\](\/\d+)?/g, 'text-[#1A1714]');
    if (newClassName !== classNameStr) {
      return `<p${before}className=${quote}${newClassName}${quote}${after}>`;
    }
    return match;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Modified:', file);
    modifiedFiles++;
  }
});
console.log('Total files modified:', modifiedFiles);
