'use strict'

const StateList = require('./ledger-api/statelist.js')

const marketplaceRecord = require('./marketplaceRecord.js')

class MarketplacesRecordList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.energy-trading.marketplacesrecordlist')
        this.use(marketplaceRecord)
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

module.exports = MarketplacesRecordList