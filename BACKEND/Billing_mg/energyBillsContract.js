'use strict'
const { Contract, Context } = require('fabric-contract-api')
const EnergyBillRecord = require('./energyBillRecord.js')
const Utils = require('./utils.js')
const EnergyBillsRecordList = require('./energyBillsRecordList.js')
const shim = require('fabric-shim');
const ClientIdentity = shim.ClientIdentity;

class EnergyBillContext extends Context {

    constructor() {
        super()
        this.energyBillsRecordList = new EnergyBillsRecordList(this)
    }

}

/**
 * Smart contract managing energy bill
 *
 */
class EnergyBillsContract extends Contract {

    constructor() {
        super('org.EnergyTrading.energybillcontract')
    }

    createContext() {
        return new EnergyBillContext()
    }

    async init(ctx) {
        console.log('Instantiated the org.EnergyTrading.energybillcontract smart contract.')

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
     * Create a new energy bill record contract.
     *
     * @param {Context} ctx the transaction context
     * @param {String} amountToPay the amount of bill
     * @param {String} paymentItems the items to be paid
     *
     * @returns {JSON} the created record
     * @throws {shim.error} transaction execution failure
     */
    async createEnergyBillRecord(ctx, endUserId, amountToPay, paymentItems, paymentPeriodStart, paymentPeriodEnd) {
        try {
            if (ctx.mspID !== Utils.retailerMSP) {
                return shim.error(`Function private to ${Utils.retailerMSP}.`)
            }
            let record = EnergyBillRecord.createInstance(ctx.enrollmentID, endUserId, amountToPay, paymentItems, paymentPeriodStart, paymentPeriodEnd)
            await ctx.energyBillsRecordList.addRecord(record)
            console.log(`Created energyBill record: ${JSON.stringify(record)}`)
            return record
        } catch (e) {
            let message = `Error in createEnergyBillRecord function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
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
     * Getting all energy bills.
     *
     * @param {Context} ctx the transaction context
     *
     * @returns {JSON} the required records
     * @throws {shim.error} transaction execution fsailure
     */
    async getAllEnergyBills(ctx) {
        try {

            if (ctx.mspID !== Utils.retailerMSP) {
                return shim.error(`Function private to ${Utils.retailerMSP}.`)
            }
            let queryString = {
                "selector": {
                    "recordType": 'energybill'
                }
            }
            let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
            return queryResults
        } catch (e) {
            let message = `Error in getEnergyBills function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

      /**
     * Getting my energy bills.
     *
     * @param {Context} ctx the transaction context
     * @param {String} endUserId the ID of the user bill is for
     *
     * @returns {JSON} the required records
     * @throws {shim.error} transaction execution failure
     */
       async getEndUserEnergyBills(ctx, endUserId) {
        try {

            if (ctx.mspID !== Utils.endUserMSP) {
                return shim.error(`Function private to ${Utils.endUserMSP}.`)
            }
            let queryString = {
                "selector": {
                    "recordType": 'energybill',
                    "endUserId": endUserId
                }
            }
            let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
            return queryResults
        } catch (e) {
            let message = `Error in getEnergyBills function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }
}

module.exports = EnergyBillsContract