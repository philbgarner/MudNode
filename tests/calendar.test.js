import { calendar } from '../lib/mudnode.js'

test('Calendar date for ordinal 0 is year 0 and day 0.', () => {
    expect(calendar.getCurrentYear()).toBe(0)
    expect(calendar.getCurrentDay()).toBe(0)
})

test('Number of days in the year.', () => {
    expect(calendar.getDaysInYear()).toBe(365)
})

test('Number of days to end of first month is 31.', () => {
    expect(calendar.getDayOrdinalToEndOfMonth(0)).toBe(31)
})

test(`Current month's day number is 1 if ordinal day is 0.`, () => {
    calendar.setCurrentDay(0)
    expect(calendar.getCurrentMonthDay()).toBe(1)
})

test(`Current month's day number is 1 if ordinal day is 31.`, () => {
    calendar.setCurrentDay(31)
    expect(calendar.getCurrentMonthDay()).toBe(1)
})

test('Calendar date for ordinal 0 is "January 1, year 0".', () => {
    calendar.setCurrentDay(0)
    expect(calendar.getDate()).toBe('January 1, year 0')
})

test('Calendar date for ordinal 30 is "January 31, year 0".', () => {
    calendar.setCurrentDay(30)
    expect(calendar.getDate()).toBe('January 1, year 0')
})

test('Calendar date for ordinal 31 is "February 1, year 0".', () => {
    calendar.setCurrentDay(31)
    expect(calendar.getDate()).toBe('February 1, year 0')
})

test('Calendar date for ordinal 365 is "January 1, year 1".', () => {
    calendar.setCurrentDay(365)
    expect(calendar.getCurrentMonthNumber()).toBe(0)
    expect(calendar.getDate()).toBe('January 1, year 1')
})

test('Calendar date for ordinal 730 is "January 1, year 2".', () => {
    calendar.setCurrentDay(730)
    expect(calendar.getCurrentMonthNumber()).toBe(0)
    expect(calendar.getDate()).toBe('January 1, year 2')
})
