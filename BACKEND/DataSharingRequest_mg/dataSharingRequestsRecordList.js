'use strict'

const StateList = require('./ledger-api/statelist.js')

const dataSharingRequestRecord = require('./dataSharingRequestRecord.js')

class DataSharingRequestsRecordList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.p2pflex.dataSharingRequestsrecordlist')
        this.use(dataSharingRequestRecord)
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

module.exports = DataSharingRequestsRecordList