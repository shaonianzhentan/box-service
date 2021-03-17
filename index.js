const fs = require('fs')
const YAML = require('yaml')
const axios = require('axios')
const express = require('express')
const app = express()
const port = 3000

const data = YAML.parse(fs.readFileSync('./config.yml', 'utf8'))
console.log(data)
function getUrl(deviceId) {
    for (let key of Object.keys(data)) {
        if (data[key].includes(deviceId)) {
            return key
        }
    }
}

function log() {
    console.log(new Date().toLocaleString(), ...arguments)
}

// console.log(getUrl('SztuWCwTVAvMuyI3M/v3Hg=='))

app.get('/', (req, res) => {
    const { body } = req
    log(body)
    let deviceId = ''
    if ('context' in body) {
        // 小爱
        deviceId = body.context.device_id
    } else if ('device' in body) {
        // 天猫
        deviceId = body.device.deviceOpenId
    }
    const apiUrl = getUrl(deviceId)
    log(apiUrl)
    if (apiUrl) {
        // 发起请求
        axios.post(apiUrl, body).then(response => {
            res.json(response.data)
        })
    } else {
        res.json(body)
    }
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})