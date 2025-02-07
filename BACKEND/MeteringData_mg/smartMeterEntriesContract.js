'use strict'

const SmartMeterEntryRecord = require('./smartMeterEntryRecord.js')
const SmartMeterEntriesRecordList = require('./smartMeterEntriesRecordList.js')

const { Contract, Context } = require('fabric-contract-api')
const Utils = require('./utils.js')

const shim = require('fabric-shim');
const ClientIdentity = shim.ClientIdentity;

class SmartMeterEntryContext extends Context {

    constructor() {
        super()
        this.smartMeterEntriesRecordList = new SmartMeterEntriesRecordList(this)
    }

}

/**
 * Smart contract managing smart metering data entries
 *
 */
class SmartMeterEntriesContract extends Contract {

    constructor() {
        super('org.EnergyTrading.smartmeterentrycontract')
    }

    createContext() {
        return new SmartMeterEntryContext()
    }

    async init(ctx) {
        console.log('Successfully instantiated the org.p2penergy.smartmeterentrycontract smart contract.');
    }

    async unknownTransaction(ctx) {
        throw new Error('Function name is missing.')
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
     * Create a new direct contract.
     *
     * @param {Context} ctx the transaction context
     * @param {String} EANNumber the ID of the smart meter
     * @param {String} kWhIN the amount of the consumed energy
     * @param {String} kWhOUT the amount of the produced energy
     * @param {String} timeFromEpoch the begin time of measurement
     * @param {String} timeToEpoch the end time of measurement
     *
     * @returns {JSON} the created record
     * @throws {shim.error} transaction execution failure
     */
    async createSmartMeterEntryRecord(ctx, EANNumber, kWhIN, kWhOUT, timeFromEpoch, timeToEpoch) {
        try {

            if (ctx.mspID !== Utils.dsoMSP) {
                return shim.error(`Function private to ${Utils.dsoMSP}.`)
            }

            let record = SmartMeterEntryRecord.createInstance(EANNumber, kWhIN, kWhOUT, timeFromEpoch, timeToEpoch)
            await ctx.smartMeterEntriesRecordList.addRecord(record)
            console.log(`Created smartMeterEntry record: ${JSON.stringify(record)}`)
            return record
        } catch (e) {
            let message = `Error in createSmartMeterEntryRecord function: ${e}`
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
     * Getting all smart meter entries.
     *
     * @param {Context} ctx the transaction context
     *
     * @returns {JSON} the required records
     * @throws {shim.error} transaction execution failure
     */
    async getAllSmartMeterEntries(ctx) {
        try {

            if (!(ctx.mspID === Utils.retailerMSP || ctx.mspID === Utils.dsoMSP)) {
                return shim.error(`Function private to ${Utils.retailerMSP} or ${Utils.dsoMSP}.`)
            }

            let queryString = {
                "selector": {
                    "recordType": 'smartmeterentry'
                }
            }
            let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
            return queryResults
        } catch (e) {
            let message = `Error in getAllSmartMeterEntries function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Getting all smart meter entries by EAN number.
     *
     * @param {Context} ctx the transaction context
     * @param {String} EANNumber the ID of the smart meter (EAN number)
     *
     * @returns {JSON} the required records
     * @throws {shim.error} transaction execution failure
     */
    async getSMEntriesByEANNumber(ctx, EANNumber) {
        try {
            if (!(ctx.mspID === Utils.retailerMSP || ctx.mspID === Utils.dsoMSP)) {
                return shim.error(`Function private to ${Utils.retailerMSP} or ${Utils.dsoMSP}.`)
            }
            
            let queryString = {
                "selector": {
                    "recordType": 'smartmeterentry',
                    "EANNumber": EANNumber
                }
            }
            let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
            return queryResults
        } catch (e) {
            let message = `Error in getSMEntriesByEANNumber function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Getting last k smart meter entries.
     *
     * @param {Context} ctx the transaction context
     * @param {String} k the number of wanted smart meter entries
     *
     * @returns {JSON} the required records
     * @throws {shim.error} transaction execution failure
     */
    async getLastKSMEntries(ctx, k) {
        try {
            if (!(ctx.mspID === Utils.retailerMSP || ctx.mspID === Utils.dsoMSP)) {
                return shim.error(`Function private to ${Utils.retailerMSP} or ${Utils.dsoMSP}.`)
            }


            let queryString = {
                "selector": {"recordType": 'smartmeterentry'},
                "sort": [{"createdAt": "desc"}],
                "limit": parseInt(k)
            }
            return await this.queryWithQueryString(ctx, JSON.stringify(queryString))
        } catch (e) {
            let message = `Error in getLastKSMEntries function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Getting all smart meter entries in specified time interval.
     *
     * @param {Context} ctx the transaction context
     * @param {String} x the start of the interval in epoch
     * @param {String} y the end of the interval in epoch
     *
     * @returns {JSON} the required records
     * @throws {shim.error} transaction execution failure
     */
    async getSMfromXtoY(ctx, x, y) {
        try {
              if (!(ctx.mspID === Utils.retailerMSP || ctx.mspID === Utils.dsoMSP)) {
                return shim.error(`Function private to ${Utils.retailerMSP} or ${Utils.dsoMSP}.`)
            }
            
            let queryString = {
                "selector": {
                    "recordType": 'smartmeterentry',
                    "$and": [
                        {
                            "createdAt": {
                                "$gt": parseInt(x)
                            }
                        },
                        {
                            "createdAt": {
                                "$lt": parseInt(y)
                            }
                        }
                    ]
                }
            }
            return await this.queryWithQueryString(ctx, JSON.stringify(queryString))
        } catch (e) {
            let message = `Error in getSMfromXtoY function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }



    /**
     * Getting all smart meter entries by EAN number.
     *
     * @param {Context} ctx the transaction context
     * @param {String} userID the ID of the user
     *
     ** @param {String} queryUserType is the user Queried buyer or seller

     * @returns {JSON} the required records
     * @throws {shim.error} transaction execution failure
     */
    async getSMEntriesByUser(ctx, userID, queryUserType) {
        try {
            console.log("Funciton called")
            // Retrieve info about user who is calling the function
            let args = ['getMyself']
            let result = await ctx.stub.invokeChaincode(Utils.usersMG, args, Utils.usersChannel)
            let functionCallerUserRecord = JSON.parse(result.payload.toString('utf8'));

            if (typeof functionCallerUserRecord === 'undefined'){
                return shim.error(`User Record is missing.`)
            }
            console.log("MySelf Done")

            // Retrieve info about user for which function is queried
            args = ['getEndUserById', userID]
            result = await ctx.stub.invokeChaincode(Utils.usersMG, args, Utils.usersChannel)
            let userQueryRecord = JSON.parse(result.payload.toString('utf8'));

            if (typeof userQueryRecord === 'undefined'){
                return shim.error(`User Record is missing.`)
            }
            console.log("getEndUserById Done")

            let userInfoSend1 = functionCallerUserRecord.Record.owner;
            let userInfoSend2 = userQueryRecord.Record.ID
            if (queryUserType === "seller"){
                userInfoSend1 = functionCallerUserRecord.Record.ID;
                userInfoSend2 = userQueryRecord.Record.owner;
            }

            args = ['checkUsersEnrolledInAcceptedOffer', userInfoSend1, userInfoSend2, queryUserType]
            result = await ctx.stub.invokeChaincode(Utils.contractsMG, args, Utils.tradingChannel)
            let offersCheck = JSON.parse(result.payload.toString('utf8'));

            if (typeof offersCheck === 'undefined'){
                return shim.error(`Offer Record is missing.`)
            }
            console.log("offersCheck Done")

            if (!offersCheck.connected){
                return []
            }


            let queryString = {
                "selector": {
                    "recordType": 'smartmeterentry',
                    "EANNumber": userQueryRecord.Record.EANNumber
                }
            }
            return await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        } catch (e) {
            let message = `Error in getSMEntriesByEANNumber function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }    /**
     * Getting all smart meter entries for user caller.
     *
     * @param {Context} ctx the transaction context
     *
     * @returns {JSON} the required records
     * @throws {shim.error} transaction execution failure
     */
    async getMySMEntries(ctx) {
        try {
            console.log("Funciton called")
            // Retrieve info about user who is calling the function
            let args = ['getMyself']
            let result = await ctx.stub.invokeChaincode(Utils.usersMG, args, Utils.usersChannel)
            let functionCallerUserRecord = JSON.parse(result.payload.toString('utf8'));

            if (typeof functionCallerUserRecord === 'undefined'){
                return shim.error(`User Record is missing.`)
            }
            console.log("MySelf Done")


            let queryString = {
                "selector": {
                    "recordType": 'smartmeterentry',
                    "EANNumber": functionCallerUserRecord.Record.EANNumber
                }
            }
            return await this.queryWithQueryString(ctx, JSON.stringify(queryString));
        } catch (e) {
            let message = `Error in getMySMEntries function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }



}

module.exports = SmartMeterEntriesContract