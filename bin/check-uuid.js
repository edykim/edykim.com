import { glob } from 'glob'
import { readFile, writeFile } from 'fs'
import { v4 as uuid } from 'uuid'
import config from '../config/config.js'

const markdowns = await glob(config.contentGlob)

markdowns.forEach(file => {
    readFile(file, 'utf8', (err, data) => {
        const hasUuid = data.includes('\nuuid: ')

        if (!hasUuid) {
            writeFile(file, data.replace("\ntype: ", `\nuuid: "${uuid()}"\ntype: `), (err) => {
                if (err) {
                    console.error(file, err)
                } else {
                    console.log(`Added uuid to ${file}`)
                }
            })
        }
    })
})
