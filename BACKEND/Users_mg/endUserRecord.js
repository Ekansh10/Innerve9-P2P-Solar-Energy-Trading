'use strict'
const State = require('./ledger-api/state.js')
const { v4: uuidv4 } = require('uuid');

class EndUserRecord extends State {

    constructor(obj) {
        super(EndUserRecord.getClass(), [obj.ID])
        Object.assign(this, obj)
    }

    getUniqueBlockchainID() { return this.ID }
    getFullName() { return this.fullName }
    getEANNumber() { return this.EANNumber }
    getRole() { return this.role }
    getCreatedAt() { return this.createdAt }
    getUpdatedAt() { return this.updatedAt }

    setFullName(fullName) {
        this.fullName = fullName
        this.updating()
    }
    setEANNumber(EANNumber) {
        this.EANNumber = EANNumber
        this.updating()
    }
    setRole(role) {
        this.role = role
        this.updating()
    }

    updating() {
        let now = new Date()
        this.updatedAt = Math.round(now.getTime() / 1000)
    }

    static fromBuffer(buffer) {
        return EndUserRecord.deserialize(Buffer.from(JSON.parse(buffer)))
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this))
    }

    static deserialize(data) {
        return State.deserializeClass(data, EndUserRecord)
    }

    static createInstance(owner, fullName, EANNumber, role) {
        let ID = uuidv4()
        let recordType = 'enduser'
        let now = new Date()
        const createdAt = Math.round(now.getTime() / 1000)
        const updatedAt = createdAt
        return new EndUserRecord({ ID, owner, fullName, EANNumber, role, recordType, createdAt, updatedAt })
    }

    static getClass() {
        return 'org.p2penergy.enduserrecord'
    }

}

module.exports = EndUserRecord