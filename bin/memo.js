import fs from 'fs';

const path = './content/ko/posts';
const now = new Date().toISOString().split(".")[0];
const date = now.substr(0, 10);
const possible = findFileName(date);

const script = process.argv.findIndex(p => p.endsWith('memo.js'));
const body = process.argv.splice(script+1).join(' ');

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

