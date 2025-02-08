'use strict'
const State = require('./ledger-api/state.js')
const { v4: uuidv4 } = require('uuid');

class SubmittedOrderRecord extends State {

    constructor(obj) {
        super(SubmittedOrderRecord.getClass(), [obj.ID])
        Object.assign(this, obj)
    }

    getPrice() { return this.price }
    getAmount() { return this.amount }
    getIssuer() { return this.issuer }
    getStatus() { return this.status }
    getType() { return this.type }
    getBiddingCycle() { return this.biddingCycle }
    getCreatedAt() { return this.createdAt }
    getUpdatedAt() { return this.updatedAt }

    setPrice(price) { this.price = price }
    setAmount(amount) { this.amount = amount }

    markAsWithdrawn() {
        this.status = "withdrawn"
        this.updating()
    }
    markAsMatched() {
        this.status = "matched"
        this.updating()
    }
    markAsPartiallyFilled() {
        this.status = "partially"
        this.updating()
    }
    markAsRejected() {
        this.status = "rejected"
        this.updating()
    }
    updating() {
        let now = new Date()
        this.updatedAt = Math.round(now.getTime() / 1000)
    }

    static fromBuffer(buffer) {
        return SubmittedOrderRecord.deserialize(Buffer.from(JSON.parse(buffer)))
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this))
    }

    static deserialize(data) {
        return State.deserializeClass(data, SubmittedOrderRecord)
    }

    static createInstance(issuer, endUserId, price, amount, type, biddingCycle) {
        let ID = uuidv4()
        let recordType = 'submittedOrder'
        let status = 'submitted'
        const createdAt = Math.round(new Date().getTime() / 1000)
        let updatedAt = createdAt
        return new SubmittedOrderRecord({ ID, issuer, endUserId, price, amount, type, biddingCycle, status, recordType, createdAt, updatedAt })
    }

    static getClass() {
        return 'org.energy-trading.submittedOrderRecord'
    }

}

module.exports = SubmittedOrderRecord