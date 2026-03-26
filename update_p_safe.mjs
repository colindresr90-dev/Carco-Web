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
  
  const pTagRegex = /<p\b[^>]*>/g;
  content = content.replace(pTagRegex, (match) => {
    let newMatch = match;
    if (newMatch.includes('text-[#A68966]')) {
      newMatch = newMatch.replace(/text-\[#A68966\](\/\d+)?/g, 'text-[#1A1714]');
    }
    if (newMatch.includes('text-[#1C1C1C]/80') || newMatch.includes('text-[#1C1C1C]/70')) {
      newMatch = newMatch.replace(/text-\[#1C1C1C\]\/\d+/g, 'text-[#1C1C1C]');
    }
    return newMatch;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Modified:', file);
    modifiedFiles++;
  }
});

console.log('Total files modified:', modifiedFiles);
