import express, { json } from 'express'
import cors from 'cors'
import { existsSync, mkdirSync, writeFile, readFile } from 'fs'
import { config } from 'dotenv'
import { populateIds } from './utils'
config()
const server = express()
server.use(cors())
server.use(json())

const DIR = '/surveys'

const BASE_PATH = process.env.BASE_PATH || '.'
const PORT = process.env.PORT || 3000
if (!existsSync(BASE_PATH + DIR)) {
    mkdirSync(BASE_PATH + DIR)
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
    try {
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

        if (!body.properties) {
            res.status(400).send({
                message: 'No properties found in request'
            })
            return
        }
        form = populateIds(body)
        const uuid = body.properties.study_id + '_' + new Date().getTime()
        const filePath = BASE_PATH + DIR + `/${uuid}.json`
        const file = JSON.stringify(body)
        writeFile(filePath, file, (err) => {
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
    } catch (error) {
        res.status(500).send({ error: "Something went wrong when processing the request: " + error })
    }
})

// File download
// Download the file from the server and return it as a json object
server.get('/api/surveys/:uuid', (req, res) => {
    const { uuid } = req.params
    const filePath = BASE_PATH + (uuid.endsWith(".json") ? `/surveys/${uuid}` : `/surveys/${uuid}.json`)
    readFile(filePath, (err, data) => {
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