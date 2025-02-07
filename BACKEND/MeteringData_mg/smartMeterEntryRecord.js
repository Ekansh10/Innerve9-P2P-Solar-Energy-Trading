'use strict'
const State = require('./ledger-api/state.js')
const { v4: uuidv4 } = require('uuid');

class SmartMeterEntryRecord extends State {

    constructor(obj) {
        super(SmartMeterEntryRecord.getClass(), [obj.ID])
        Object.assign(this, obj)
    }


    getEANNumber() { return this.EANNumber }
    getEntryTimestamp() { return this.entryTimestamp }
    getKWhIN() { return this.kWhIN }
    getKWhOUT() { return this.kWhOUT }
    getCreatedAt() { return this.createdAt }
    getUpdatedAT() { return this.updatedAt }


    static fromBuffer(buffer) {
        return SmartMeterEntryRecord.deserialize(Buffer.from(JSON.parse(buffer)))
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this))
    }

    static deserialize(data) {
        return State.deserializeClass(data, SmartMeterEntryRecord)
    }

    static createInstance(EANNumber, kWhIN, kWhOUT, timeFromEpoch, timeToEpoch) {
        let ID = uuidv4()
        let recordType = 'smartmeterentry'
        let now = new Date()
        const createdAt = Math.round(now.getTime() / 1000)
        const updatedAt = createdAt
        return new SmartMeterEntryRecord({ ID, EANNumber, kWhIN, kWhOUT, recordType, createdAt, updatedAt, timeFromEpoch, timeToEpoch })
    }

    static getClass() {
        return 'org.p2penergy.smartmeterentryrecord'
    }

}

module.exports = SmartMeterEntryRecord