const fs = require('fs-extra')
const path = require('path')
const glob = require('glob')

glob('./content/**/*.md', {}, (err, files) => {
  if (err) {
    throw new Error(err)
  }
  files.forEach(filePath => {
    const file = fs.readFileSync(filePath)
    const found = file
      .toString()
      .split('\n')
      .find(v => v.startsWith('date:'))
    if (!found) return

    let date = found
      .split(': ')
      .pop()
      .replace(/\"/gi, '')

    console.log(date)
    date = date.substr(0, '2010-10-07T05:28:41'.length)
    date = `"${date}"`

    const newDateLine = `date: ${date}`

    fs.writeFileSync(filePath, file.toString().replace(found, newDateLine))
  })
})
