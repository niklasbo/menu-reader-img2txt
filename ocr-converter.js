const { WeekDayMeal, Meal, Day } = require("./database");
const { getMondayPlusXDateOfWeeknum } = require("./date-utils");

module.exports = {
    ocrResultsToWeekDayMeal: function ocrResultsToWeekDayMeal(weeknum, results) {
        const days = []
        var dayCounter = 0
        results.forEach(day => {
            const meals = []
            const noZeroPrices = removeZeroPrice(day)
            const mealsRaw = splitMultipleMealsOnDay(noZeroPrices)

            mealsRaw.forEach(meal => {
                var m = removeCommonLines(meal)
                m = removeSpaceBetweenNumberAndEuroSign(m)
                m = removeDoubleParenthesis(m)

                const parts = splitIntoParts(m)
                const title = correctTextComma(replaceNewLines(parts.title))
                const price = replaceNewLines(parts.price)
                const middleParts = splitTextInParenthesis(parts.textInParenthesis)
                //console.log('Title: ' + title.trim())
                //console.log('Price: ' + price.trim())
                //console.log('Further: ' + middleParts.furtherInformation)
                //console.log('Type: ' + middleParts.types)
                meals.push(new Meal(
                    {
                        title: title.trim(),
                        price: price.trim(),
                        furtherInformation: middleParts.furtherInformation,
                        types: middleParts.types
                    }))
            });
            const dayDetails = getMondayPlusXDateOfWeeknum(weeknum, dayCounter)
            days.push(new Day({ day: dayDetails.day, date: dayDetails.date, meals: meals }))
            dayCounter++
        });
        return new WeekDayMeal({ weeknum: weeknum, days: days })
    }
}

function removeZeroPrice(text) {
    return text.replace(/ *0,00€| *0,00 €/g, '')
}

function splitMultipleMealsOnDay(text) {
    const splitKey = '<<||>>'
    var t = text.trim()
    t = t.replace(/€\n/g, '€' + splitKey)
    return t.split(splitKey)
}

const commonLines = ['Gutes aus der Region']
function removeCommonLines(text) {
    var textWithoutCommonLines = text
    commonLines.forEach(commonLine => {
        textWithoutCommonLines = textWithoutCommonLines.replace(new RegExp(commonLine, "gi"), '')
    });
    return textWithoutCommonLines
}

function removeSpaceBetweenNumberAndEuroSign(text) {
    return text.replace(/ €/g, '€')
}

function removeDoubleParenthesis(text) {
    const t = text.replace(/\(\(/g, '(')
    return t.replace(/\)\)/g, ')')
}

function replaceNewLines(text) {
    const t = text.replace(/-\n/g, '-')
    return t.replace(/\n/g, ' ')
}

function correctTextComma(text) {
    var t = text.replace(/, /g, ',')
    t = t.replace(/ ,/g, ',')
    return t.replace(/,/g, ', ')
}

function splitIntoParts(text) {
    const indexOfLastOpeningParenthesis = text.lastIndexOf('(')
    const indexOfLastClosingParenthesis = text.lastIndexOf(')')
    return {
        title: text.substring(0, indexOfLastOpeningParenthesis),
        textInParenthesis: text.substring(indexOfLastOpeningParenthesis + 1, indexOfLastClosingParenthesis),
        price: text.substring(indexOfLastClosingParenthesis + 1, text.length)
    }
}

const knownTypes = {
    'S': 'Schwein',
    'R': 'Rind',
    'G': 'Geflügel',
    'F': 'Fisch',
    'V': 'Vegetarisch',
    'VN': 'Vegan',
    'X': 'Anderes Fleisch',
    'Y': 'Fischstücke',
    'Z': 'Fleischstücke',
}
function splitTextInParenthesis(textInParenthesis) {
    const furtherInfo = []
    const types = []
    const p = textInParenthesis.split(',');
    p.forEach(e => {
        const trimmed = e.trim()
        if (trimmed in knownTypes) {
            types.push(knownTypes[trimmed])
        } else {
            furtherInfo.push(trimmed)
        }
    });
    return {
        furtherInformation: furtherInfo,
        types: types
    }
}
