'use strict'

const StateList = require('./ledger-api/statelist.js')

const submittedOrderRecord = require('./submittedOrderRecord.js')

class SubmittedOrdersRecordList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.energy-trading.submittedOrdersrecordlist')
        this.use(submittedOrderRecord)
    }

    async addRecord(record) {
        return this.addState(record)
    }

    async getRecord(key) {
        return this.getState(key)
    }

    async updateRecord(record) {
        return this.updateState(record)
    }


}

module.exports = SubmittedOrdersRecordList