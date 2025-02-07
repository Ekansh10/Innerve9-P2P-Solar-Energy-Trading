'use strict'
const State = require('./ledger-api/state.js')
const { v4: uuidv4 } = require('uuid');

class EnergyBillRecord extends State {

    constructor(obj) {
        super(EnergyBillRecord.getClass(), [obj.ID])
        Object.assign(this, obj)
    }


    getAmoutToPay() { return this.amoutToPay }
    getPaymentItems() { return this.paymentItems }
    getCreatedAt() { return this.createdAt }
    getUpdatedAt() { return this.updatedAt }

    static fromBuffer(buffer) {
        return EnergyBillRecord.deserialize(Buffer.from(JSON.parse(buffer)))
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this))
    }

    static deserialize(data) {
        return State.deserializeClass(data, EnergyBillRecord)
    }

    static createInstance(owner, endUserId, amountToPay, paymentItems, paymentPeriodStart, paymentPeriodEnd) {
        let ID = uuidv4()
        let recordType = 'energybill'
        let now = new Date()
        const createdAt = Math.round(now.getTime() / 1000)
        const updatedAt = createdAt
        return new EnergyBillRecord({ owner, ID, amountToPay, endUserId, paymentItems, recordType, createdAt, updatedAt, paymentPeriodStart, paymentPeriodEnd })
    }

    static getClass() {
        return 'org.EnergyTrading.energybillrecord'
    }

}

module.exports = EnergyBillRecord