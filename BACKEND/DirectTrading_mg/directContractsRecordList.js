'use strict'

const StateList = require('./ledger-api/statelist.js')

const directContractRecord = require('./directContractRecord.js')

class DirectContractsRecordList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.p2penergy.directcontractrecordlist')
        this.use(directContractRecord)
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

module.exports = DirectContractsRecordList