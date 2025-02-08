'use strict'
const MarketplaceRecord = require('./marketplaceRecord.js')
const MarketplacesRecordList = require('./marketplacesRecordList.js')

const SubmittedOrderRecord = require('./submittedOrderRecord.js')
const SubmittedOrdersRecordList = require('./submittedOrdersRecordList.js')

const { Contract, Context } = require('fabric-contract-api')
const Utils = require('./utils.js')
const shim = require('fabric-shim');
const ClientIdentity = shim.ClientIdentity;
const marketPricing = require('market-pricing');


class MarketplaceContext extends Context {

    constructor() {
        super()
        this.marketplacesRecordList = new MarketplacesRecordList(this)
        this.submittedOrdersRecordList = new SubmittedOrdersRecordList(this)
    }

}

/**
 * Smart contract managing the auction-based trading marketplace
 *
 */
class AuctionTradingContract extends Contract {

    constructor() {
        super('org.energy-trading.auctiontradingcontract')
    }

    createContext() {
        return new MarketplaceContext()
    }

    async init(ctx) {
        console.log('Instantiated the marketplace smart contract.')

    }

    async unknownTransaction(ctx) {
        return shim.error('Function name missing')
    }

    async beforeTransaction(ctx) {
        console.log('---------------------beforeTransaction-----------------------')
        let func_and_params = ctx.stub.getFunctionAndParameters()
        console.log('---------------------func_and_params-----------------------')
        console.log(func_and_params)
        let cid = new ClientIdentity(ctx.stub);
        console.log('---------------------FUNCTION EXECUTION START-----------------------')
        ctx.enrollmentID = cid.getAttributeValue('hf.EnrollmentID')
        ctx.mspID = cid.getMSPID()
        console.log(`Caller MSP: ${ctx.mspID}, Caller username: ${ctx.enrollmentID}`)
    }

    async afterTransaction(ctx, results) {
        console.log('---------------------afterTransaction-----------------------')
        console.log(results)
    }

    /**
     * Create a new marketplace record (only one can exist).
     *
     * @param {Context} ctx the transaction context
     * @param {String} name the name of marketplace
     * @param {String} retailerID the unique blockchain username of the retailer
     *
     * @returns {JSON} the created record
     * @throws {shim.error} transaction execution failure
     */
    async createMarketplaceRecord(ctx, name, retailerID) {
        try {

            if (ctx.mspID !== Utils.mpoMSP) {
                return shim.error(`Function private to ${Utils.mpoMSP}.`)
            }

            let marketplaceRecord = await this.getMarketplace(ctx)
            if(marketplaceRecord) {
                return shim.error("Marketplace already exists!")
            }

            let record = MarketplaceRecord.createInstance(ctx.enrollmentID, name, retailerID)
            await ctx.marketplacesRecordList.addRecord(record)
            console.log(`Created marketplace record: ${JSON.stringify(record)}`)
            return record
        } catch (e) {
            let message = `Error in createMarketplaceRecord function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }


    }

    /**
     * Submitting new order and adding order to the marketplaces's currently open bidding cycle record.
     *
     * @param {Context} ctx the transaction context
     * @param {String} price the price per kWh
     * @param {String} amount the amount of energy
     * @param {String} endUserId the end user's ID 
     * @param {String} type the type the order (buy or sell)
     *
     * @returns {JSON} the updated record
     * @throws {shim.error} transaction execution failure
     */
    async submitNewOrder(ctx, price, amount, endUserId, type) {
        try {

            if (ctx.mspID !== Utils.endUserMSP) {
                return shim.error(`Function private to ${Utils.endUserMSP}.`)
            }

            let marketplaceRecord = await this.getMarketplace(ctx)

            console.log("marketplaceRecord")
            console.log(marketplaceRecord)
            console.log(marketplaceRecord.Record.ID)
            
            let mpBlockchainRecord
            try{
                let key = MarketplaceRecord.makeKey([marketplaceRecord.Record.ID])
                mpBlockchainRecord = await ctx.marketplacesRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`Marketplace record not found`)
            }


            if(!mpBlockchainRecord.isBiddingOpen()) {
                return shim.error(`Marketplace is closed.`)
            }

            let orderRecord = SubmittedOrderRecord.createInstance(ctx.enrollmentID, endUserId, price, amount, type, marketplaceRecord.Record.biddingCycle)
            await ctx.submittedOrdersRecordList.addRecord(orderRecord)
            console.log(`Created submittedOrder record: ${JSON.stringify(orderRecord)}`)


            mpBlockchainRecord.addOrderToBiddingCycle(orderRecord.ID, ctx.enrollmentID, type)
            await ctx.marketplacesRecordList.updateRecord(mpBlockchainRecord)

            console.log(`Marketplace updated: ${JSON.stringify(mpBlockchainRecord)}`)
            return mpBlockchainRecord

        } catch (e) {
            let message = `Error in submitNewOrder function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Open bidding on the marketplace.
     *
     * @param {Context} ctx the transaction context
     *
     * @returns {JSON} the updated record
     * @throws {shim.error} transaction execution failure
     */
    async openBidding(ctx) {
        try {
            if (ctx.mspID !== Utils.mpoMSP) {
                return shim.error(`Function private to ${Utils.mpoMSP}.`)
            }

            let marketplaceRecord = await this.getMarketplace(ctx)

            console.log("marketplaceRecord")
            console.log(marketplaceRecord)
            console.log(marketplaceRecord.Record.ID)
            
            let record
            try{
                let key = MarketplaceRecord.makeKey([marketplaceRecord.Record.ID])
                record = await ctx.marketplacesRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`Marketplace record not found`)
            }
            
            record.openBidding()
            await ctx.marketplacesRecordList.updateRecord(record)
            return record

        } catch (e) {
            let message = `Error in openBidding function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Close bidding on the marketplace.
     *
     * @param {Context} ctx the transaction context
     *
     * @returns {JSON} the updated record
     * @throws {shim.error} transaction execution failure
     */
    async closeBidding(ctx) {
        try {
            if (ctx.mspID !== Utils.mpoMSP) {
                return shim.error(`Function private to ${Utils.mpoMSP}.`)
            }


            let marketplaceRecord = await this.getMarketplace(ctx)

            console.log("marketplaceRecord")
            console.log(marketplaceRecord)
            console.log(marketplaceRecord.Record.ID)
            
            let record
            try{
                let key = MarketplaceRecord.makeKey([marketplaceRecord.Record.ID])
                record = await ctx.marketplacesRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`Marketplace record not found`)
            }

            record.closeBidding()
            await ctx.marketplacesRecordList.updateRecord(record)
            return record

        } catch (e) {
            let message = `Error in closeBidding function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Set the buy price of the retailer
     *
     * @param {Context} ctx the transaction context
     * @param {String} buyPrice the retailer price for energy buying
     *
     * @returns {JSON} the updated record
     * @throws {shim.error} transaction execution failure
     */
    async setRetailerBuyPrice(ctx, buyPrice) {
        try {
            if (ctx.mspID !== Utils.retailerMSP) {
                return shim.error(`Function private to ${Utils.retailerMSP}.`)
            }

            let marketplaceRecord = await this.getMarketplace(ctx)

            console.log("marketplaceRecord")
            console.log(marketplaceRecord)

            let record
            try{
                let key = MarketplaceRecord.makeKey([marketplaceRecord.Record.ID])
                record = await ctx.marketplacesRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`Marketplace record not found`)
            }

            let args = ['getMyself']
            let result = await ctx.stub.invokeChaincode(Utils.usersMgContract, args, Utils.usersMgChannel)
            let retailerRecord = JSON.parse(result.payload.toString('utf8'));
            
            console.log("retailerRecord")
            console.log(retailerRecord)

            if (retailerRecord.Record.owner !== ctx.enrollmentID)
                return shim.error(`Only assigned retailer entity can update prices.`)

            record.setRetailerBuyPrice(buyPrice);

            await ctx.marketplacesRecordList.updateRecord(record)
            return record

        } catch (e) {
            let message = `Error in setRetailerBuyPrice function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Closing bidding cycle.
     *
     * @param {Context} ctx the transaction context
     * @param {String} sellPrice the retailer price for energy buying
     *
     * @returns {JSON} the updated record
     * @throws {shim.error} transaction execution failure
     */
    async setRetailerSellPrice(ctx, sellPrice) {
        try {

            if (ctx.mspID !== Utils.retailerMSP) {
                return shim.error(`Function private to ${Utils.retailerMSP}.`)
            }

            let marketplaceRecord = await this.getMarketplace(ctx)

            console.log("marketplaceRecord")
            console.log(marketplaceRecord)

            let record
            try{
                let key = MarketplaceRecord.makeKey([marketplaceRecord.Record.ID])
                record = await ctx.marketplacesRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`Marketplace record not found`)
            }

            let args = ['getMyself']
            let result = await ctx.stub.invokeChaincode(Utils.usersMgContract, args, Utils.usersMgChannel)
            let retailerRecord = JSON.parse(result.payload.toString('utf8'));
            
            console.log("retailerRecord")
            console.log(retailerRecord)

            if (retailerRecord.Record.owner !== ctx.enrollmentID)
                return shim.error(`Only assigned retailer entity can update prices.`)


            record.setRetailerSellPrice(sellPrice);

            await ctx.marketplacesRecordList.updateRecord(record)
            return record

        } catch (e) {
            let message = `Error in setRetailerSellPrice function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Check is bidding cycle open.
     *
     * @param {Context} ctx the transaction context
     *
     * @returns {JSON} boolean record
     * @throws {shim.error} transaction execution failure
     */
    async isBiddingOpen(ctx) {
        try {

            if (ctx.mspID === Utils.externalActorsMSP) {
                return shim.error(`Function forbidden for ${Utils.externalActorsMSP}.`)
            }

            let marketplaceRecord = await this.getMarketplace(ctx)
            
            console.log("marketplaceRecord")
            console.log(marketplaceRecord)


            let record
            try{
                let key = MarketplaceRecord.makeKey([marketplaceRecord.Record.ID])
                record = await ctx.marketplacesRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`Marketplace record not found`)
            }

            let res = record.isBiddingOpen()
            return { 'open': res }

        } catch (e) {
            let message = `Error in isBiddingOpen function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Getting data from last bidding cycle.
     *
     * @param {Context} ctx the transaction context
     *
     * @returns {JSON} the requested data
     * @throws {shim.error} transaction execution failure
     */
    async getLastBidingCycleData(ctx) {
        try {

            if (!(ctx.mspID === Utils.mpoMSP || ctx.mspID === Utils.retailerMSP || ctx.mspID === Utils.dsoMSP)) {
                return shim.error(`Function private to ${Utils.mpoMSP}, ${Utils.retailerMSP} or ${Utils.dsoMSP}.`)
            }
            

            let marketplaceRecord = await this.getMarketplace(ctx)
            let record
            try{
                let key = MarketplaceRecord.makeKey([marketplaceRecord.Record.ID])
                record = await ctx.marketplacesRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`Marketplace record not found`)
            }

            let data = record.getBidingCycle()
            return data

        } catch (e) {
            let message = `Error in openBidding function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Function for calculating MCP.
     *
     * @param {Context} ctx the transaction context
     * @param {String} biddingCycle the number of bidding cycle
     *
     * @returns {JSON} price record with marshllianMcp and order lists
     * @throws {shim.error} transaction execution failure
     */
    async marketClearingMechanism(ctx, biddingCycle) {

        if (ctx.mspID !== Utils.mpoMSP) {
            return shim.error(`Function private to ${Utils.mpoMSP}.`)
        }
        
        let queryString = {
            "selector": {
                "recordType": 'submittedOrder',
                "biddingCycle": parseInt(biddingCycle)
            }
        }
        let orders = await this.queryWithQueryString(ctx, JSON.stringify(queryString));

        if (typeof orders === 'undefined' || orders.length === 0) {
            return shim.error("There are no orders for biddingCycle: " + biddingCycle);
        }

        let buyerList = [];
        let sellerList = [];

        for(let order of orders) {
            if(order.Record.type === 'buy') {
                buyerList.push([order.Record.ID, order.Record.amount, order.Record.price])
            }
            else if (order.Record.type === 'sell') {
                sellerList.push([order.Record.ID, order.Record.amount, order.Record.price])
            }
            else {
                return shim.error("Uncategorized order (not buy or sell). Cannot calculate MCP.");
            }
        }

        let sortedSellerList = sellerList.sort(function(a, b) { return a[2] - b[2]; });
        console.log("sortedSellerList")
        console.log(sortedSellerList)

        let sortedBuyerList = buyerList.sort(function(a, b) { return b[2] - a[2] ; });
        console.log("sortedBuyerList")
        console.log(sortedBuyerList)

        let qDFunc = marketPricing.demandFromQueue(
            sortedBuyerList,
            2 /* index for price in each item of buyerList ArrayOfArray */,
            1 /* index for quantity in each item of buyerList ArrayOfArray */);

        var qSFunc = marketPricing.supplyFromQueue(
            sortedSellerList,
            2 /* index for price in each sellerList item */,
            1 /* index for quantity in each sellerList item */);

        
        let ret = {}

        ret['walrasianMcp'] = marketPricing.walrasianCEPriceRange(0,100,1,qDFunc,qSFunc)
        ret['sellerList'] = sellerList
        ret['buyerList'] = buyerList
        ret['sortedSellerList'] = sortedSellerList
        ret['sortedBuyerList'] = sortedBuyerList

        // At this point code can be updated so that the MCP is written on the blockchain as well.

        return ret
    }


    /**
     * Evaluate a queryString
     * This is the helper function for making queries using a query string
     *
     * @param {Context} ctx the transaction context
     * @param {String} queryString the query string to be evaluated
     */
    async queryWithQueryString(ctx, queryString) {
        console.log(`Caller MSP: ${ctx.mspID}, Caller username: ${ctx.enrollmentID}`)

        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        let allResults = [];
        while (true) {
            let res = await resultsIterator.next();
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
                await resultsIterator.close();
                return allResults
            }
        }
        return allResults
    }

    /**
     * Getting marketplace info.
     *
     * @param {Context} ctx the transaction context
     *
     * @returns {JSON} the requested data
     * @throws {shim.error} transaction execution failure
     */
    async getMarketplace(ctx) {
        try {
            if (ctx.mspID === Utils.externalActorsMSP) {
                return shim.error(`Function forbidden for ${Utils.externalActorsMSP}.`)
            }
            
            let queryString = {
                "selector": {
                    "recordType": 'marketplace'
                }
            }
            let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
            if (queryResults.length === 0)
                return false
            else
                return queryResults[0]
        } catch (e) {
            let message = `Error in getMarketplace function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    async getSubmittedOrdersForBiddingCycle(ctx, biddingCycle) {
        try {
            if (ctx.mspID === Utils.externalActorsMSP) {
                return shim.error(`Function forbidden for ${Utils.externalActorsMSP}.`)
            }

            let queryString = {
                "selector": {
                    "recordType": 'submittedOrder',
                    "biddingCycle": parseInt(biddingCycle)
                }
            }
            let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
            return queryResults
        } catch (e) {
            let message = `Error in getSubmittedOrdersForBiddingCycle function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }
}

module.exports = AuctionTradingContract