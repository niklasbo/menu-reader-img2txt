module.exports = {
    Week: class Week {
        constructor(weeknum, days) {
            this.weeknum = weeknum
            this.days = days
        }
    },
    Day: class Day {
        constructor(day, date, meals) {
            this.day = day
            this.date = date
            this.meals = meals
        }
    },
    Meal: class Meal {
        constructor(title, price, furtherInformation, types) {
            this.title = title
            this.price = price
            this.furtherInformation = furtherInformation
            this.types = types
        }
    }
} 