let currentDay = 0

let daysPerWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
let monthsPerYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

/**
 * Returns the number of days in the year based on the number of days for each month in the days per month settings.
 */
const getDaysInYear = () => {
    return daysPerMonth.reduce((prev, curr) => prev + curr)
}

/**
 * The number of days up until the end of the specified month.
 * @param {int} monthNumber 
 * @returns {int} Number of days.
 */
const getDayOrdinalToEndOfMonth = (monthNumber) => {
    let amt = 0
    for (let c = 0; c <= monthNumber; c++) {
        amt += daysPerMonth[c]
    }
    return amt
}

/**
 * Month number for the specified ordinal day.
 * @param {int} day Ordinal day number.
 * @returns {int} Month number.
 */
const getMonthNumber = (day) => {
    let days = 0
    for (let c = 0; c < monthsPerYear.length; c++) {
        
        if (day >= days && day < days + daysPerMonth[c]) {
            return c
        }
        days += daysPerMonth[c]
    }
}
/**
 * Month name for the specified month number.
 * @param {int} monthNumber 
 * @returns {string} Month name.
 */
const getMonth = (monthNumber) => {
    return monthsPerYear[monthNumber]
}

/**
 * Current month number based on current day.
 * @returns {int} Current month number.
 */
 const getCurrentMonthNumber = () => {
    let day = currentDay
    if (day >= getDaysInYear()) {
        let years = parseInt(day / getDaysInYear())
        day -= years * getDaysInYear()
        return getMonthNumber(day)
    }
    return getMonthNumber(day)
}

/**
 * Current month name based on current day.
 * @returns {string} Current month name.
 */
 const getCurrentMonth = () => {
    return getMonth(getCurrentMonthNumber())
}

/**
 * Get current day number in the year.
 * @returns {int} Day number.
 */
const getCurrentDay = () => {
    return currentDay
}

/**
 * Sets the current day.
 * @param {int} dayOrdinal 
 */
const setCurrentDay = (dayOrdinal) => {
    currentDay = dayOrdinal
}

/**
 * Get current year.
 * @returns {int} Year number.
 */
const getCurrentYear = () => {
    return parseInt(currentDay / getDaysInYear())
}

/**
 * Get the day number of the month the current date would fall on.
 * @returns {int} Day number in the current month.
 */
const getCurrentMonthDay = () => {
    let month = getCurrentMonthNumber()
    let daysToMonth = getDayOrdinalToEndOfMonth(month - 1 < 0 ? 0 : month - 1)
    return (month - 1 < 0 ? 0 : currentDay - daysToMonth) + 1
}

/**
 * Get a text representation of the current date.
 * @param {string} format option. Default is "Month Day, Year".
 * @returns {string} Current date.
 */
const getDate = (format) => {
    if (!format) {
        return `${getCurrentMonth()} ${getCurrentMonthDay()}, year ${getCurrentYear()}`
    }
}

export { getDate, getCurrentDay, setCurrentDay, getCurrentYear, getDayOrdinalToEndOfMonth, getCurrentMonthDay, getDaysInYear, getCurrentMonthNumber }