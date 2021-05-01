const path = require('path');
const Jimp = require('jimp');
const tmp = require('tmp');
const { createWorker } = require('tesseract.js')

module.exports = {
    imageToText: async function imageToText(filepath) {
        const pathToTrainedData = path.join(__dirname, 'lang-data')
        console.log(pathToTrainedData)

        const worker = createWorker({
            langPath: pathToTrainedData, //set for offline converting
        });
        await worker.load()
        await worker.loadLanguage('deu')
        await worker.initialize('deu')
        await worker.setParameters({
            tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 äöüÄÖÜß-(),&€',
        });
        // load image
        const image = await Jimp.read(filepath)
        const tempFilePath = tmp.dirSync().name + "rotatedImage.jpeg"
        var rotateAngle = 0
        // identify orientation of plan, check 0, 90, 180 and 270 degree
        for (let o = 0; o < 4; o++) {
            if (o != 0) {
                rotateAngle = 90
            }
            try {
                await image.rotate(rotateAngle).writeAsync(tempFilePath)
            } catch(err) {
                console.log(err)
                continue
            }
            // test orientation with headline
            const { data: { text } } = await worker.recognize(tempFilePath, { rectangle: rectangleOrientationTest })
            if (checkOrientation(text)) {
                console.log(`Orientation found, rotated ${o*90} degrees!`)
                break;
            }
        }

        // recognize meals
        const values = []
        for (let i = 0; i < rectangles.length; i++) {
            const { data: { text } } = await worker.recognize(tempFilePath, { rectangle: rectangles[i] })
            values.push(text)
        }
        await worker.terminate()
        return values
    }
}

orientationIdentifierWordList = ["speiseplan", "dienstag", "mittwoch", "donnerstag", "woche", "sodexo"]
function checkOrientation(text) {
    const lowerCaseText = text.toLowerCase()
    for (let i = 0; i < orientationIdentifierWordList.length; i++) {
        if (lowerCaseText.contains(orientationIdentifierWordList[i])) {
            console.log(`Found word ${orientationIdentifierWordList[i]}`)
            return true
        }
    }
    return false
}

const heightStart = process.env.HEIGHT_START || 260
const heightEnd = process.env.HEIGTH_END || 1160

const firstStart = process.env.FIRST_START || 240
const firstEnd = process.env.FIRST_END || 525
const secondStart = process.env.SECOND_START || 570
const secondEnd = process.env.SECOND_END || 845
const thirdStart = process.env.THIRD_START || 890
const thirdEnd = process.env.THIRD_END || 1170
const fourthStart = process.env.FOURTH_START || 1210
const fourthEnd = process.env.FOURTH_END || 1490
const fifthStart = process.env.FIFTH_START || 1535
const fifthEnd = process.env.FIFTH_END || 1785

const rectangleOrientationTest = {
    left: secondStart,
    top: 0,
    width: fourthStart - secondStart,
    height: heightStart,
}

const rectangleHeight = heightEnd - heightStart;
const rectangles = [
    {
        left: firstStart,
        top: heightStart,
        width: firstEnd - firstStart,
        height: rectangleHeight,
    },
    {
        left: secondStart,
        top: heightStart,
        width: secondEnd - secondStart,
        height: rectangleHeight,
    },
    {
        left: thirdStart,
        top: heightStart,
        width: thirdEnd - thirdStart,
        height: rectangleHeight,
    },
    {
        left: fourthStart,
        top: heightStart,
        width: fourthEnd - fourthStart,
        height: rectangleHeight,
    },
    {
        left: fifthStart,
        top: heightStart,
        width: fifthEnd - fifthStart,
        height: rectangleHeight,
    }
];
