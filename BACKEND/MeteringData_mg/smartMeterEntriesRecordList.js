'use strict'

const StateList = require('./ledger-api/statelist.js')

const smartMeterEntryRecord = require('./smartMeterEntryRecord.js')

class SmartMeterEntriesRecordList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.EnergyTrading.smartmeterentryrecordlist')
        this.use(smartMeterEntryRecord)
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

module.exports = SmartMeterEntriesRecordList