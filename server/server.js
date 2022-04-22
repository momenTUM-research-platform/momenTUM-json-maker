const express = require('express')
const cors = require('cors')
const fs = require('fs')
require('dotenv').config()
const server = express()
server.use(cors())
server.use(express.json())

const BASE_PATH = process.env.BASE_PATH || '.'
const PORT = process.env.PORT || 3000
// Status route
server.get('/status', (req, res) => {
    res.send({
        status: 'ok'
    })
})

// File upload
// Upload json body to the server and store in directory /surveys as uuid.json where uuid is a property in the uploaded json
server.post('/surveys', (req, res) => {
    const { body } = req
    console.log(body)
    const uuid = body.properties.study_id + '_' + new Date().getTime()
    const filePath = BASE_PATH + `/surveys/${uuid}.json`
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
                uri: `https://tuspl22-momentum.srv.mwn.de/surveys/${uuid}.json`,
                uuid: uuid

            })
        }
    })
})

// File download
// Download the file from the server and return it as a json object
server.get('/surveys/:uuid', (req, res) => {
    const { uuid } = req.params
    const filePath = BASE_PATH + `/surveys/${uuid}.json`
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).send({
                error: 'Error reading file'
            })
        } else {
            res.send(JSON.parse(data))
        }
    })
})

// Start server
server.listen(PORT, () => {
    console.log('Server started on port 3000')
})
