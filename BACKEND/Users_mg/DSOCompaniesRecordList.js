'use strict'

const StateList = require('./ledger-api/statelist.js')

const DSOCompanyRecord = require('./DSOCompanyRecord.js')

class DSOCompaniesRecordList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.p2penergy.dsorecordlist')
        this.use(DSOCompanyRecord)
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

module.exports = DSOCompaniesRecordList