'use strict'
const State = require('./ledger-api/state.js')
const { v4: uuidv4 } = require('uuid');

class MarketplaceRecord extends State {

    constructor(obj) {
        super(MarketplaceRecord.getClass(), [obj.ID])
        Object.assign(this, obj)
    }

    isBiddingOpen() { return this.biddingOpen }

    getBidingCycle() { return this.biddingPeriods[this.biddingCycle]}
    getRetailerId() { return this.retailerID}


    openBidding() {
        this.biddingCycle += 1
        let now = new Date()
        this.biddingPeriods[this.biddingCycle] = {
            'start': Math.round(now.getTime() / 1000),
            'orders': [],
            'end': undefined
        }
        this.updating()
        return this.biddingOpen = true
    }

    closeBidding() {
        let now = new Date()
        this.biddingPeriods[this.biddingCycle]['end'] = Math.round(now.getTime() / 1000)
        this.updating()
        return this.biddingOpen = false
    }

    setRetailerBuyPrice(buyPrice) {
        this.retailerBuyPrice = buyPrice;
    }

    setRetailerSellPrice(sellPrice) {
        this.retailerSellPrice = sellPrice;
    }

    addOrderToBiddingCycle(orderID, issuer, type) {
        let orderObject = { 'ID': orderID, 'issuer': issuer, 'type': type}
        // let noOfOrdersForUser = this.biddingPeriods[this.biddingCycle]['orders'].filter(element => {
        //     return element.issuer === issuer
        // }).length
        // RESTRICT: Only if 1 submitted order per bidding cycle is ALLOWED
        // if (noOfOrdersForUser === 1)
        //     return false

        this.biddingPeriods[this.biddingCycle]['orders'].push(orderObject)
        this.updating()
        return true
    }

    updating() {
        let now = new Date()
        this.updatedAt = Math.round(now.getTime() / 1000)
    }

    static fromBuffer(buffer) {
        return MarketplaceRecord.deserialize(Buffer.from(JSON.parse(buffer)))
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this))
    }

    static deserialize(data) {
        return State.deserializeClass(data, MarketplaceRecord)
    }

    static createInstance(owner, name, retailerID) {
        let ID = uuidv4()
        let recordType = 'marketplace'
        let biddingOpen = false
        let now = new Date()
        const createdAt = Math.round(now.getTime() / 1000)
        let updatedAt = createdAt
        let biddingCycle = 0
        let biddingPeriods = {}

        let retailerBuyPrice = -1;
        let retailerSellPrice = -1;

        return new MarketplaceRecord({ ID, name, owner, retailerID, recordType, biddingOpen, biddingCycle, biddingPeriods, retailerBuyPrice, retailerSellPrice, createdAt, updatedAt })
    }

    static getClass() {
        return 'org.energy-trading.marketplaceRecord'
    }

}

module.exports = MarketplaceRecord