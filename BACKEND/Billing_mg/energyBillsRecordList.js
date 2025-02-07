'use strict'

const StateList = require('./ledger-api/statelist.js')

const energyBillRecord = require('./energyBillRecord.js')

class EnergyBillsRecordList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.EnergyTrading.energyBillsrecordlist')
        this.use(energyBillRecord)
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

module.exports = EnergyBillsRecordList