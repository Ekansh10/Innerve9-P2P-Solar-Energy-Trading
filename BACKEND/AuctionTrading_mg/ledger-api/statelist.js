/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const State = require('./state.js');

class StateList {

    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = {};

    }

    async addState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    async getState(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        let data = await this.ctx.stub.getState(ledgerKey);
        let state = State.deserialize(data, this.supportedClasses);
        return state;
    }

    async getStateByRange(start, end) {
        let iterator = await this.ctx.stub.getStateByRange(start, end);
        let allResults = [];

        while (true) {
            let res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                jsonRes.Key = res.value.key;
                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                await iterator.close();
                return allResults;
            }
        }
    }

    async getStateByPartialCompositeKey(key) {
        const iterator = await this.ctx.stub.getStateByPartialCompositeKey(key, []);
        return iterator;
    }

    async updateState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    use(stateClass) {
        this.supportedClasses[stateClass.getClass()] = stateClass;
    }

    async getAllKeysForRecordType(recordType) {
        const iterator = await this.ctx.stub.getStateByRange('', '');
        const allkeys = [];

        while (true) {
            const res = await iterator.next();
            if (res.done) {
                await iterator.close();
                return allkeys;
            }
            let record;
            try {
                record = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
                record = res.value.value.toString('utf8');
            }
            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                if (record['recordType'] == recordType){
                    allkeys.push(Key);
                }
            }
        }
    }

    async getAllStatesForRecordType(recordType) {
        const iterator = await this.ctx.stub.getStateByRange('', '');

        const allResults = [];
        while (true) {
            const res = await iterator.next();
            if (res.done) {
                await iterator.close();
                return JSON.stringify(allResults);
            }
            if (res.value && res.value.value.toString()) {
                const Key = res.value.key;
                let record;
                try {
                    record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    record = res.value.value.toString('utf8');
                }
                if (record['recordType'] == recordType) {
                    allResults.push({Key, record});
                }
            }

        }
    }
}

module.exports = StateList;