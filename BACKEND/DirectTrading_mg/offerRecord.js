'use strict'
const State = require('./ledger-api/state.js')
const { v4: uuidv4 } = require('uuid');

class OfferRecord extends State {

    constructor(obj) {
        super(OfferRecord.getClass(), [obj.ID])
        Object.assign(this, obj)
    }

    getContractID() { return this.contractID }
    getOwner() { return this.owner }
    getSellPrice() { return this.sellPrice }
    getStatus() { return this.status }
    getEnergyExchanges() { return this.energyExchanges }
    getAcceptedBuyers() { return this.acceptedBuyers }
    getCreatedAt() { return this.createdAt }
    getUpdatedAt() { return this.updatedAt }

    setSellPrice(sellPrice) {
        this.selPrice = sellPrice
        this.updating()
    }
    revokeOffer() {
        this.status = "revoked"
        this.updating()
    }
    newAccept(buyerID) {
        this.acceptedBuyers[buyerID] = true;
        let all = Object.values(this.acceptedBuyers)
        if(!all.includes(false)) {
            this.acceptOffer()
        }
    }
    acceptOffer() {
        this.status = "accepted"
        this.updating()
    }
    rejectOffer() {
        this.status = "rejected"
        this.updating()
    }
    addEnergyExchange(energyExchange) { //: {timestamp, production, consumption, unused}
        this.energyExchanges = [...this.energyExchanges, energyExchange]
        this.updating()
    }
    updating() {
        let now = new Date()
        this.updatedAt = Math.round(now.getTime() / 1000)
    }


    static fromBuffer(buffer) {
        return OfferRecord.deserialize(Buffer.from(JSON.parse(buffer)))
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this))
    }

    static deserialize(data) {
        return State.deserializeClass(data, OfferRecord)
    }

    static createInstance(owner, contractID, acceptedBuyers, sellPrice) {
        let ID = uuidv4()
        let recordType = 'offer'
        let now = new Date()
        const createdAt = Math.round(now.getTime() / 1000)
        const updatedAt = createdAt
        const status = "created"
        let energyExchanges = []
        return new OfferRecord({ ID, owner, contractID, sellPrice, status, energyExchanges, acceptedBuyers, recordType, createdAt, updatedAt})
    }

    static getClass() {
        return 'org.p2penergy.offerrecord'
    }

}

module.exports = OfferRecord