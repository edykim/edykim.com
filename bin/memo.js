import fs from 'fs';

const path = './content/ko/posts';
const now = new Date().toISOString().split(".")[0];
const date = now.substr(0, 10);
const possible = findFileName(date);

let body = await getStdin();

if (body.length == 0) {
    const script = process.argv.findIndex(p => p.endsWith('memo.js'));
    body = process.argv.splice(script+1).join(' ');
}

if (body.length == 0) {
    console.log("> what you want to memo it?");
    process.exit(-1);
}

const text = `---
type: post
author: haruair
date: "${now}"
lang: ko
slug: "${possible}"
tags:
  - 부스러기
noIndex: true
---

${chunk(body, 80).join('\n')}

`
const filepath = `${path}/${possible}.md`;

fs.writeFileSync(filepath, text);

console.log(`${filepath} is created.`);

function findFileName(date) {
    const filename = (date, idx = 0) => `${date}-memo${idx == 0 ? "" : `-${idx}`}`
    const files = fs.readdirSync(path)
        .filter(file => file.startsWith(date));

    let idx = 0;

    while (true) {
        const name = filename(date, idx++);
        if (! files.includes(name + '.md')) {
            return name;
        }
    }
}

function getStdin(timeout = 10) {
  return new Promise((resolve, reject) => {
    let buffer = '';
    process.stdin.on('data', (d) => (buffer += d.toString()))
    const t = setTimeout(() => {
      process.stdin.destroy()
      resolve('')
    }, timeout)
    process.stdin.on('end', () => {
      clearTimeout(t)
      resolve(buffer.trim())
    })
    process.stdin.on('error', reject)
  })
}

function chunk(str, length) {
    return str.split('\n').map(s => chunkLine(s, length).join('\n'));
}

function chunkLine(str, length) {
    const words = str.split(' ');
    const result = [];
    let currentLine = '';

    words.forEach(word => {
        if (len(currentLine + word) < length) {
            currentLine += (currentLine.length ? ' ' : '') + word;
        } else {
            if (currentLine.length) {
                result.push(currentLine);
            }
            currentLine = word;
        }
    });

    if (currentLine.length) {
        result.push(currentLine);
    }

    return result;
}

function len(str) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
        len += str.charCodeAt(i) >= 1024 ? 2 : 1;
    }
    return len;
}

