const express = require('express')
const cors = require('cors')
const fs = require('fs')
const JSZip = require('jszip')
require('dotenv').config()
const server = express()
server.use(cors())
server.use(express.json())

const DIR = '/surveys'

const BASE_PATH = process.env.BASE_PATH || "/home/constantin/momenTUM-json-maker/server"
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

function sendSurvey(req, res) {
    const { uuid } = req.params
    const filePath = BASE_PATH + (uuid.endsWith(".json") ? `/surveys/${uuid}` : `/surveys/${uuid}.json`)
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(400).send({
                error: 'Survey not found'
            })
        } else {
            res.send(JSON.parse(data))
        }
    })
}

// File download
// Download the file from the server and return it as a json object
server.get('/api/surveys/:uuid', (req, res) => {
    sendSurvey(req, res)
})
server.post('/api/surveys/:uuid', (req, res) => {
    sendSurvey(req, res)
})

// Start server
server.listen(PORT, () => {
    console.log('Server started on port ' + PORT)
})

server.get("/api/dictionary/:uuid", (req, res) => {
    try {
        let { uuid } = req.params
        const regenerate = req.query.regenerate
        uuid = uuid.endsWith(".json") ? uuid.replace(".json", "") : uuid
        console.log(regenerate)
        if (!regenerate && fs.existsSync(BASE_PATH + `/surveys/${uuid}/module.zip`)) {
            res.download(BASE_PATH + `/surveys/${uuid}/module.zip`)
        } else {
            const filePath = BASE_PATH + (uuid.endsWith(".json") ? `/surveys/${uuid}` : `/surveys/${uuid}.json`)
            const file = fs.readFileSync(filePath, { encoding: "utf-8" })
            const modules = JSON.parse(file).modules
            let csvString = `"Variable / Field Name","Form Name","Section Header","Field Type","Field Label","Choices, Calculations, OR Slider Labels","Field Note","Text Validation Type OR Show Slider Number","Text Validation Min","Text Validation Max",Identifier?,"Branching Logic (Show field only if...)","Required Field?","Custom Alignment","Question Number (surveys only)","Matrix Group Name","Matrix Ranking?","Field Annotation"\n`
            for (const module of modules) {
                for (const section of module.sections) {
                    for (const question of section.questions) {
                        csvString += `${question.id},${module.uuid},,text,${question.text},,,,,,,,,,,,,\n`
                    }
                }
            }
            console.log(csvString)

            fs.existsSync(`${BASE_PATH}/surveys/${uuid}/`) || fs.mkdirSync(`${BASE_PATH}/surveys/${uuid}/`)
            fs.writeFileSync(`${BASE_PATH}/surveys/${uuid}/instrument.csv`, csvString)
            fs.writeFileSync(`${BASE_PATH}/surveys/${uuid}/Origin.txt`, "Created by MomenTUM")

            const zip = new JSZip()
            zip.file(`instrument.csv`, csvString)
            zip.file("Origin.txt", "Created by MomenTUM")
            zip.generateAsync({ type: "nodebuffer" }).then((content) => {
                console.log(content)
                fs.writeFileSync(`${BASE_PATH}/surveys/${uuid}/module.zip`, content)
                res.download(BASE_PATH + `/surveys/${uuid}/module.zip`)

            })
        }

    } catch (err) {
        res.status(400).send({
            error: 'Error when building document: ' + err
        })
    }
})



