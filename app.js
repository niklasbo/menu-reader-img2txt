const express = require('express')
const fs = require('fs')
const stream = require('stream')
const tmp = require('tmp');
const ocr = require('./ocr')
const { ocrResultsToWeekDayMeal } = require('./ocr-converter');
const { getImageOfWeeknum, saveWeekDayMeal, getWeekDayMealOfWeeknum } = require('./database');
const { getCurrentWeeknumPlusXWeeks } = require('./date-utils');

const app = express()
const port = process.env.PORT || 6000

app.get('/', (req, res) => {
    res.send('online')
})

app.get('/ocr', async (req, res) => {
    const alreadyConverted = await hasWeekAlreadyConverted()
    if (alreadyConverted) {
        res.status(208).send('Already converted!')
    } else {
        try {
            resultObject = await handleOcr()
            res.status(200).send(resultObject)
        } catch (err) {
            console.log(err)
            res.status(500).send(err.message)
        }
    }
})

app.get('/ocr-full', async (req, res) => {
    const thisWeeknum = getCurrentWeeknumPlusXWeeks()
    const nextWeeknum = getCurrentWeeknumPlusXWeeks(1)
    const thisWeeknumAlreadyConverted = await hasWeekAlreadyConverted(thisWeeknum)
    const nextWeeknumAlreadyConverted = await hasWeekAlreadyConverted(nextWeeknum)
    if (thisWeeknumAlreadyConverted && nextWeeknumAlreadyConverted) {
        res.status(208).send(`Week ${thisWeeknum} and ${nextWeeknum} are already converted!`)
        return
    }
    if (thisWeeknumAlreadyConverted && !nextWeeknumAlreadyConverted) {
        handleOcr(nextWeeknum).catch((err) => {
            console.log('Converting failed of week ' + nextWeeknum + ' failed. Reason: ' + err)
        })
        res.status(290).send(`Week ${thisWeeknum} is already converted and converting for week ${nextWeeknum} started!`)
        return
    }
    if (!thisWeeknumAlreadyConverted && nextWeeknumAlreadyConverted) {
        handleOcr(thisWeeknum).catch((err) => {
            console.log('Converting failed of week ' + thisWeeknum + ' failed. Reason: ' + err)
        })
        res.status(291).send(`Week ${nextWeeknum} is already converted and converting for week ${thisWeeknum} started!`)
        return
    }

    res.status(292).send(`Converting of week ${thisWeeknum} and ${nextWeeknum} started!`)
    handleOcr(thisWeeknum)
        .catch((err) => {
            console.log('Converting failed of week ' + thisWeeknum + ' failed. Reason: ' + err)})
        .then(() => {
            handleOcr(nextWeeknum).catch((err) => {
                console.log('Converting failed of week ' + nextWeeknum + ' failed. Reason: ' + err)
            })
        })
})

app.get('/ocr/:weeknum', async (req, res) => {
    const weeknum = parseInt(req.params.weeknum)
    if (isNaN(weeknum)) {
        res.status(400).send('Path parameter weeknum is not a number. Given: "' + req.params.weeknum + '" Type: ' + typeof req.params.weeknum)
        return
    }
    if (weeknum < 1 || weeknum > 53) {
        res.status(400).send('Path parameter weeknum is out of range, legal values: 1-53')
        return
    }
    const alreadyConverted = await hasWeekAlreadyConverted(weeknum)
    if (alreadyConverted) {
        res.status(208).send('Already converted!')
    } else {
        try {
            resultObject = await handleOcr(weeknum)
            res.status(200).send(resultObject)
        } catch (err) {
            console.log(err)
            res.status(500).send(err.message)
        }
    }
})

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})

async function hasWeekAlreadyConverted(weeknum = getCurrentWeeknumPlusXWeeks()) {
    try {
        await getWeekDayMealOfWeeknum(weeknum);
        return true
    } catch (err) {
        // console.log(err)
        // no data found in database, start ocr
        return false
    }
}

async function handleOcr(weeknum = getCurrentWeeknumPlusXWeeks()) {
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
