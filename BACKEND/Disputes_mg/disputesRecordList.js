'use strict'

const StateList = require('./ledger-api/statelist.js')

const disputeRecord = require('./disputeRecord.js')

class DisputesRecordList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.p2pflex.disputesrecordlist')
        this.use(disputeRecord)
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

module.exports = DisputesRecordList