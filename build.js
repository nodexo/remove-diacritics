
'use strict'

const fs = require('fs')
const https = require('https')

const config = {
  options: {
    hostname: 'raw.githubusercontent.com',
    port: 443,
    path: '/WordPress/WordPress/master/wp-includes/formatting.php',
    method: 'GET'
  },
  template: './templates/index.js'
}

downloadFile(config.options)
  .then((result) => {
    fs.writeFileSync('./cache/' + result.filename, result.data)
    const functionSrc = extractRemoveAccentsFunction(result.data)
    fs.writeFileSync('./cache/remove_accents.php', functionSrc)
    const jsSrc = parseTemplate(config.template, {chars: getChars(functionSrc), conditions: getConditions(functionSrc)})
    fs.writeFileSync('./' + config.template.split('/').slice(-1)[0], jsSrc)
  })
  .catch((reason) => {
    console.log(reason)
  })

function downloadFile (options) {
  return new Promise((resolve, reject) => {
    https.request(options, (res) => {
      if (res.statusCode !== 200) {
        resolve(`Wrong status code: ${res.statusCode}`)
      }
      const filename = options.path.split('/').slice(-1)[0]
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => { rawData += chunk })

      res.on('end', () => {
        resolve({
          filename: filename,
          data: rawData
        })
      })
    }).on('error', (e) => {
      resolve(e.message)
    }).end()
  })
}

function extractRemoveAccentsFunction (str) {
  const regex = /function remove_accents\( \$string \) \{(\n|.)*?\n\}/
  return regex.exec(str)[0]
}

function getChars (str) {
  const regex = /\$chars = array\(((\n|.)*?)\);/g
  let chars = regex.exec(str)[1]
  return chars
    .replace(/\/\/.*\n/g, '')
    .replace(/[\t\n]/g, '')
    .replace(/\s\=>/g, ':')
    .replace(/ ?, ?/g, ', ')
    .trim()
    .replace(/,+$/g, '')
}

function getConditions (str) {
  const regex = /\$locale = get_locale\(\);((\n|.)*?)\$string = strtr\(\$string, \$chars\);/g
  let conditions = regex.exec(str)[1]
  return conditions
    .replace(/\/\/.*\n/g, '')
    .replace(/\t+/g, '  ')
    .replace(/[$;]/g, '')
    .replace(/[^=]==[^=]/g, '===')
    .replace(/elseif/g, 'else if')
    .trim()
}

function parseTemplate (tpl, repl, encoding = 'utf8') {
  let jsSrc = fs.readFileSync(tpl, encoding)
  for (const key of Object.keys(repl)) {
    const regex = new RegExp('\\/\\*\\s*\\$\\{' + key + '\\}\\s*\\*\\/', 'g')
    jsSrc = jsSrc.replace(regex, repl[key])
  }
  return jsSrc
}
