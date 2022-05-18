const express = require('express')
const cors = require('cors')
const fs = require('fs')
require('dotenv').config()
const server = express()
server.use(cors())
server.use(express.json())

const DIR = '/surveys'

const BASE_PATH = process.env.BASE_PATH || '.'
const PORT = process.env.PORT || 3000
if (!fs.existsSync(BASE_PATH + DIR)) {
    fs.mkdirSync(BASE_PATH + DIR)
}
// Status route to check if server is running and responding to requests.
server.get('/api/status', (req, res) => {
    res.send({
        status: 'ok'
    })
})

// File upload
// Upload json body to the server and store in directory /surveys as uuid.json where uuid is a property in the uploaded json
server.post('/api/surveys', (req, res) => {
    const { body, headers } = req
    if (!headers.authorization || headers.authorization !== process.env.MASTER_PASSWORD) {
        res.status(401).send({
            message: 'Unauthorized'
        })
        return
    }
    if (!body) {
        res.status(400).send({
            message: 'No body found in request'
        })
        return
    }

    if (!headers || !headers['content-type'] || headers['content-type'] !== 'application/json') {
        res.status(400).send({
            message: 'No json content-type found in request'
        })
        return
    }

    if (!body.properties || !body.properties.study_id) {
        res.status(400).send({
            message: 'No study_id found in request'
        })
        return
    }

    console.log(body)
    const uuid = body.properties.study_id + '_' + new Date().getTime()
    const filePath = BASE_PATH + DIR + `/${uuid}.json`
    const file = JSON.stringify(body)
    fs.writeFile(filePath, file, (err) => {
        if (err) {
            console.log(err)
            res.status(500).send({
                error: 'Error writing file'
            })
        } else {
            res.send({
                status: 'ok',
                uri: `https://tuspl22-momentum.srv.mwn.de/api/surveys/${uuid}`,
                uuid: uuid

            })
        }
    })
})

// File download
// Download the file from the server and return it as a json object
server.get('/api/surveys/:uuid', (req, res) => {
    const { uuid } = req.params
    const filePath = BASE_PATH + `/surveys/${uuid}.json`
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(400).send({
                error: 'Survey not found'
            })
        } else {
            res.send(JSON.parse(data))
        }
    })
})

// Start server
server.listen(PORT, () => {
    console.log('Server started on port ' + PORT)
})
