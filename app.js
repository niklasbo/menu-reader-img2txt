const express = require('express')
const fs = require('fs')
const stream = require('stream')
const tmp = require('tmp');
const ocr = require('./ocr')
const axios = require('axios');
const { ocrResultsToWeekDayMeal } = require('./ocr-converter');
const { getImageOfWeeknum, saveWeekDayMeal } = require('./database');
const { getCurrentWeeknum } = require('./date-utils');

const app = express()
const port = process.env.PORT || 6000
const restServiceUrl = process.env.REST_SERVICE_URL || 'https://menu-rest-service.herokuapp.com'

app.get('/', (req, res) => {
    res.send('online')
})

app.get('/ocr', async (req, res) => {
    try {
        const restResponse = await axios.get(restServiceUrl + '/current-week')
        if (restResponse.status === 200) {
            res.status(208).send('Already converted!')
            return
        }
    } catch (err) {
        res.status(555).send('Error while requesting the REST service: ' + err.message)
        return
    }
    try {
        resultObject = await handleOcr()
        res.status(200).send(resultObject)
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
})

app.get('/ocr/:weeknum', async (req, res) => {
    const weeknum = parseInt(req.params.weeknum)
    if (isNaN(weeknum)) {
        res.status(400).send('Path parameter weeknum is not a number. Given: "' + req.params.weeknum + '" Type: ' + typeof req.params.weeknum)
    }
    //TODO add already converted check like above
    try {
        resultObject = await handleOcr(weeknum)
        res.status(200).send(resultObject)
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})

async function handleOcr(weeknum = getCurrentWeeknum()) {
    console.log(weeknum)
    try {
        const jpegImageAsBase64String = await getImageOfWeeknum(weeknum)
        console.log(jpegImageAsBase64String.length)

        const filepathOfImage = await base64StringToJpeg(jpegImageAsBase64String)
        console.log(filepathOfImage)

        const values = await ocr.imageToText(filepathOfImage)
        console.log(values.length)

        const weekDayMealObject = ocrResultsToWeekDayMeal(weeknum, values)
        console.log(weekDayMealObject)

        await saveWeekDayMeal(weekDayMealObject)
        return weekDayMealObject
    } catch (err) {
        console.log(err)
    }
}

async function base64StringToJpeg(base64String) {
    return new Promise((resolve, reject) => {
        const tmpobj = tmp.fileSync()
        const filename = tmpobj.name

        const imageBufferData = Buffer.from(String(base64String), 'base64')
        const streamObj = new stream.Readable()
        streamObj.push(imageBufferData)
        streamObj.push(null)
        streamObj.pipe(fs.createWriteStream(filename))

        streamObj.on('end', () => {
            resolve(filename)
        })
        streamObj.on('error', (err) => reject(err))
    })
}
