'use strict'
const State = require('./ledger-api/state.js')
const { v4: uuidv4 } = require('uuid');

class DSOCompanyRecord extends State {

    constructor(obj) {
        super(DSOCompanyRecord.getClass(), [obj.ID])
        Object.assign(this, obj)
    }


    getCompanyName() { return this.companyName }
    getCreatedAt() { return this.createdAt }
    getUpdatedAt() { return this.updatedAt }

    setCompanyName(companyName) {
        this.companyName = companyName
        this.updating()
    }
    updating() {
        let now = new Date()
        this.updatedAt = Math.round(now.getTime() / 1000)
    }

    static fromBuffer(buffer) {
        return DSOCompanyRecord.deserialize(Buffer.from(JSON.parse(buffer)))
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this))
    }

    static deserialize(data) {
        return State.deserializeClass(data, DSOCompanyRecord)
    }

    static createInstance(owner, companyName) {
        let ID = uuidv4()
        let recordType = 'dso'
        let now = new Date()
        const createdAt = Math.round(now.getTime() / 1000)
        const updatedAt = createdAt;
        return new DSOCompanyRecord({ ID, owner, companyName, recordType, createdAt, updatedAt })
    }

    static getClass() {
        return 'org.p2penergy.dsorecord'
    }

}

module.exports = DSOCompanyRecord