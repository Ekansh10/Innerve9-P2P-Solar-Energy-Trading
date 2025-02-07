'use strict'

const StateList = require('./ledger-api/statelist.js')

const endUserRecord = require('./endUserRecord.js')

class EndUsersRecordList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.p2penergy.enduserrecordlist')
        this.use(endUserRecord)
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

module.exports = EndUsersRecordList