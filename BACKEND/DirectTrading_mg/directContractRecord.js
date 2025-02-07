'use strict'
const State = require('./ledger-api/state.js')
const { v4: uuidv4 } = require('uuid');

class DirectContractRecord extends State {

    constructor(obj) {
        super(DirectContractRecord.getClass(), [obj.ID])
        Object.assign(this, obj)
    }

    getSellerID() { return this.sellerID }
    getBuyerWeights() { return this.buyerWeights }
    getBuyerIDs() { return Object.keys(this.buyerWeights)}
    getStatus() { return this.status }
    getCreatedAt() { return this.createdAt }
    getUpdatedAt() { return this.updatedAt }
    getOwner() { return this.owner }
    getID() { return this.ID }

    setStatus(status) {
        this.status = status
        this.updating()
    }
    updating() {
        let now = new Date()
        this.updatedAt = Math.round(now.getTime() / 1000)
    }

    setBuyerWeights(buyerWeights) {
        this.buyerWeights = buyerWeights; //buyerWeights => dictionary of key-value pairs (buyerID -> buyerWeight)
    }

    static fromBuffer(buffer) {
        return DirectContractRecord.deserialize(Buffer.from(JSON.parse(buffer)))
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this))
    }

    static deserialize(data) {
        return State.deserializeClass(data, DirectContractRecord)
    }

    static createInstance(owner, sellerID) {
        let ID = uuidv4()
        let recordType = 'contract'
        let now = new Date()
        const createdAt = Math.round(now.getTime() / 1000)
        const updatedAt = createdAt
        let status = "created"
        let buyerWeights = {}
        return new DirectContractRecord({ ID, owner, sellerID, buyerWeights, status, recordType, createdAt, updatedAt })
    }

    static getClass() {
        return 'org.p2penergy.directcontractrecord'
    }

}

module.exports = DirectContractRecord