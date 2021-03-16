const test = require('ava')
const { getMondayPlusXDateOfWeeknum } = require('./date-utils')

test('test-getMondayPlusXDateOfWeeknum', t => {
    t.deepEqual(getMondayPlusXDateOfWeeknum(50, 0), { day: 'Montag', date: '13.12.2021' })
    t.deepEqual(getMondayPlusXDateOfWeeknum(50, 1), { day: 'Dienstag', date: '14.12.2021' })
    t.deepEqual(getMondayPlusXDateOfWeeknum(50, 2), { day: 'Mittwoch', date: '15.12.2021' })
    t.deepEqual(getMondayPlusXDateOfWeeknum(50, 6), { day: 'Sonntag', date: '19.12.2021' })
})