'use strict'

const StateList = require('./ledger-api/statelist.js')

const offerRecord = require('./offerRecord.js')

class OffersRecordList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.p2penergy.offersrecordlist')
        this.use(offerRecord)
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

module.exports = OffersRecordList