const mongoose = require('mongoose')

const mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING || ''
const mongodbWeeknumImageCollection = process.env.MONGODB_WEEKNUM_IMAGE_COLLECTION || ''
const mongodbWeekDayMealCollection = process.env.MONGODB_WEEKDAYMEAL_COLLECTION || ''

if (mongodbConnectionString.length == 0) {
    throw new Error('Set Environment Variable MONGODB_CONNECTION_STRING')
}
if (mongodbWeeknumImageCollection.length == 0) {
    throw new Error('Set Environment Variable MONGODB_WEEKNUM_IMAGE_COLLECTION')
}
if (mongodbWeekDayMealCollection.length == 0) {
    throw new Error('Set Environment Variable MONGODB_WEEKDAYMEAL_COLLECTION')
}

const WeeknumImageSchema = new mongoose.Schema({
    weeknum: Number,
    jpegImageAsBase64String: String
}, { collection: mongodbWeeknumImageCollection });

const MealSchema = new mongoose.Schema({
    title: String,
    price: String,
    furtherInformation: [String],
    types: [String]
}, { collection: undefined });

const DaySchema = new mongoose.Schema({
    day: String,
    date: String,
    meals: [MealSchema]
}, { collection: undefined });

const WeekDayMealSchema = new mongoose.Schema({
    weeknum: Number,
    days: [DaySchema],
}, { collection: mongodbWeekDayMealCollection });

const WeeknumImage = mongoose.model('WeeknumImage', WeeknumImageSchema)
const Day = mongoose.model('Day', DaySchema)
const Meal = mongoose.model('Meal', MealSchema)
const WeekDayMeal = mongoose.model('WeekDayMeal', WeekDayMealSchema)


mongoose.connect(mongodbConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, function (err) {
    if (err) {
        console.log(err)
        throw err
    }
})

async function getImageOfWeeknum(weeknumToRead) {
    const result = await WeeknumImage.findOne({ weeknum: weeknumToRead }).exec()
    if (result != null) {
        return result.jpegImageAsBase64String
    }
    throw new Error(`No results returned, is this WeeknumImage (weeknum = ${weeknumToRead}) already in database?`)
}

async function saveWeekDayMeal(filledWeek) {
    WeekDayMeal(filledWeek).save(function (err) {
        if (err) {
            throw err
        }
        console.log(`Weeknum ${filledWeek.weeknum} saved!`)
    });
}

async function getWeekDayMealOfWeeknum(weeknumToRead) {
    const result = await WeekDayMeal.findOne({ weeknum: weeknumToRead }).exec()
    if (result != null) {
        return result
    }
    throw new Error(`No results returned, is this WeekDayMeal (weeknum = ${weeknumToRead}) as object in database?`)
}

exports.getImageOfWeeknum = getImageOfWeeknum
exports.saveWeekDayMeal = saveWeekDayMeal
exports.getWeekDayMealOfWeeknum = getWeekDayMealOfWeeknum
exports.WeekDayMeal = WeekDayMeal
exports.Day = Day
exports.Meal = Meal
