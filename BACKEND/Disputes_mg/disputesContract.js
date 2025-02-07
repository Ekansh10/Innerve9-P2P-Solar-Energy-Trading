'use strict'
const { Contract, Context } = require('fabric-contract-api')
const DisputeRecord = require('./disputeRecord.js')
const Utils = require('./utils.js')
const DisputesRecordList = require('./disputesRecordList.js')
const shim = require('fabric-shim');
const ClientIdentity = shim.ClientIdentity;

class DisputeContext extends Context {

    constructor() {
        super()
        this.disputesRecordList = new DisputesRecordList(this)
    }

}

/**
 * Smart contract managing disputes.
 *
 */
class DisputesContract extends Contract {

    constructor() {
        super('org.p2pflex.disputeContract')
    }

    createContext() {
        return new DisputeContext()
    }

    async init(ctx) {
        console.log('Successfully instantiated the org.p2pflex.dataSharingRequestContract smart contract.');
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
     * Create a new dispute.
     *
     * @param {Context} ctx the transaction context
     * @param {String} creatorID the ID of the entity creating a dispute
     * @param {String} description the description of the dispute
     *
     * @returns {JSON} the created record
     * @throws {shim.error} transaction execution failure
     */
    async createDisputeRecord(ctx, creatorID, description) {
        try {
            if (ctx.mspID === Utils.externalActorsMSP) {
                return shim.error(`Function forbidden for ${Utils.externalActorsMSP}.`)
            }
            
            let record = DisputeRecord.createInstance(creatorID, description)
            await ctx.disputesRecordList.addRecord(record)
            console.log(`Created dispute record: ${JSON.stringify(record)}`)
            return record
        } catch (e) {
            let message = `Error in createDisputeRecord function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }

    }

    /**
     * Resolve a dispute.
     *
     * @param {Context} ctx the transaction context
     * @param {String} disputeID the ID of dispute
     * @param {String} resolverID the ID od dispute resolver
     * @param {String} resolutionDescription the description of resolution for dispute
     *
     * @returns {JSON} updated dispute record with resolution description and resolver ID
     * @throws {shim.error} transaction execution failure
     */
    async resolveDispute(ctx, disputeID, resolverID, resolutionDescription) {
        try {

            if (ctx.mspID === Utils.externalActorsMSP ) {
                return shim.error(`Function forbidden for ${Utils.externalActorsMSP}.`)
            }

            let record
            try {
                let key = DisputeRecord.makeKey([disputeID])
                record = await ctx.disputesRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`Dispute record not found`)
            }
            console.log(`Dispute by partial key found: ${JSON.stringify(record)}`)
            record.setResolver(resolverID)
            record.setResolutionDescription(resolutionDescription)
            await ctx.disputesRecordList.updateRecord(record)
            console.log(`Dispute updated: ${JSON.stringify(record)}`)
            return record
        } catch (e) {
            let message = `Error in updateDispute function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }


    /**
     * Evaluate a queryString.
     *
     * This is the helper function for making queries using a query string
     *
     * @param {Context} ctx the transaction context
     * @param {String} queryString the query string to be evaluated
     */
    async queryWithQueryString(ctx, queryString) {
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
     * Read all disputes.
     *
     * @param {Context} ctx the transaction context
     *
     * @returns {JSON} the query results
     * @throws {shim.error} transaction execution failure
     */
    async getAllDisputes(ctx) {
        try {

            if (ctx.mspID === Utils.externalActorsMSP) {
                return shim.error(`Function forbidden for ${Utils.externalActorsMSP}.`)
            }
            
            let queryString = {
                "selector": {
                    "recordType": 'dispute'
                }
            }
            let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
            return queryResults
        } catch (e) {
            let message = `Error in getDisputes function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Read dispute record with provided ID.
     *
     * @param {Context} ctx the transaction context
     * @param {String} disputeID the ID of the dispute
     *
     * @returns {JSON} the query result
     * @throws {shim.error} transaction execution failure
     */
    async getDisputeByID(ctx, disputeID) {
        try {
            
            if (ctx.mspID === Utils.externalActorsMSP) {
                return shim.error(`Function forbidden for ${Utils.externalActorsMSP}.`)
            }
            
            let queryString = {
                "selector": {
                    "recordType": 'dispute',
                    "ID": disputeID
                }
            }
            let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
            return queryResults[0]
        } catch (e) {
            let message = `Error in getDisputeByID function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }
}

module.exports = DisputesContract