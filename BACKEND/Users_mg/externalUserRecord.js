'use strict';

const State = require('./ledger-api/state.js');
const { v4: uuidv4 } = require('uuid');

class ExternalUserRecord extends State {

    constructor(obj) {
        super(ExternalUserRecord.getClass(), [obj.ID]);
        Object.assign(this, obj);
    }

    getOwner() { return this.owner }
    getID() { return this.ID }
    getCreatedAt() { return this.createdAt }
    getUpdatedAt() { return this.updatedAt }
    getFullName() { return this.fullName }
    update(){
        let now = new Date()
        this.updatedAt = Math.round(now.getTime() / 1000)
    }
    updateFullName(name){
        this.fullName = name
        this.update()
    }

    static fromBuffer(buffer) {
        return ExternalUserRecord.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, ExternalUserRecord);
    }

    static createInstance(owner, fullName) {
        let recordType = 'externalactor'
        let ID = uuidv4 ()
        let now = new Date()
        const createdAt = Math.round(now.getTime() / 1000)
        let updatedAt = createdAt
        return new ExternalUserRecord({ ID, fullName, recordType, createdAt, updatedAt, owner});
    }

    static getClass() {
        return 'org.p2pdata.externalactor';
    }

}

module.exports = ExternalUserRecord;