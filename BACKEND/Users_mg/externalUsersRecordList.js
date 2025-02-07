'use strict';

const StateList = require('./ledger-api/statelist.js');

const externalUserRecord = require('./externalUserRecord.js');

class ExternalUsersRecordList extends StateList {
    constructor(ctx) {
        super(ctx, 'org.p2pdata.externalusersrecordList');
        this.use(externalUserRecord);
    }

    async addRecord(record) {
        return this.addState(record);
    }

    async getRecord(key) {
        return this.getState(key);
    }

    async updateRecord(record) {
        return this.updateState(record);
    }

}

module.exports = ExternalUsersRecordList;