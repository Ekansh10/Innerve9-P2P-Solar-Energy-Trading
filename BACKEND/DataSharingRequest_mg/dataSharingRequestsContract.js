'use strict'
const { Contract, Context } = require('fabric-contract-api')
const DataSharingRequestRecord = require('./dataSharingRequestRecord.js')
const Utils = require('./utils.js')
const DataSharingRequestsRecordList = require('./dataSharingRequestsRecordList.js')
const shim = require('fabric-shim');
const ClientIdentity = shim.ClientIdentity;

class DataSharingRequestContext extends Context {

    constructor() {
        super()
        this.dataSharingRequestsRecordList = new DataSharingRequestsRecordList(this)
    }

}

/**
 * Smart contract in charge of data sharing requests management.
 *
 */
class DataSharingRequestsContract extends Contract {

    constructor() {
        super('org.p2pflex.dataSharingRequestContract')
    }

    createContext() {
        return new DataSharingRequestContext()
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
     * Create a new data sharing request.
     *
     * @param {Context} ctx the transaction context
     * @param {String} requesterID the ID of the entity requesting data
     * @param {String} requestedDataDescription the description of what data is requested
     *
     * @returns {JSON} the created record
     * @throws {shim.error} transaction execution failure
     */
    async createDataSharingRequestRecord(ctx,requesterID, requestedDataDescription) {
        try {

            if (ctx.mspID !== Utils.externalActorsMSP)
                return shim.error(`Function private to ${Utils.externalActorsMSP}.`)

            let record = DataSharingRequestRecord.createInstance(requesterID, requestedDataDescription)
            await ctx.dataSharingRequestsRecordList.addRecord(record)
            console.log(`Created dataSharingRequest record: ${JSON.stringify(record)}`)
            return record
        } catch (e) {
            let message = `Error in createDataSharingRequestRecord function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Accept a new data sharing request and provide data.
     *
     * @param {Context} ctx the transaction context
     * @param {String} dataSharingID the ID of the data sharing request
     * @param {String} providerID the ID of entity responding to request
     * @param {String} data the data being shared

     * @returns {JSON}  the data sharing record that is being updated
     * @throws {shim.error} transaction execution failure
     */
    async acceptDataSharingRequest(ctx, dataSharingID, providerID, data) {
        try {
            if (ctx.mspID === Utils.externalActorsMSP)
                return shim.error(`Function forbidden for  ${Utils.externalActorsMSP}.`)

            let record
            try {
                let key = DataSharingRequestRecord.makeKey([dataSharingID])
                record = await ctx.dataSharingRequestsRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`DataSharingRequest record not found`)
            }

            if (record.getStatus() === 'rejected'){
                return shim.error(`Data sharing request already rejected.`)
            }

            console.log(`DataSharingRequest by partial key found: ${JSON.stringify(record)}`)
            record.provideData(providerID, data)
            await ctx.dataSharingRequestsRecordList.updateRecord(record)
            console.log(`DataSharingRequest updated: ${JSON.stringify(record)}`)
            return record
        } catch (e) {
            let message = `Error in acceptDataSharingRequest function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Update data of created data sharing request.
     *
     * @param {Context} ctx the transaction context
     * @param {String} dataSharingID the ID of the data sharing request
     * @param {String} data the data being shared
     *
     * @returns {JSON}  the data sharing record that is being updated
     * @throws {shim.error} transaction execution failure
     */
    async updateDataSharingRequest(ctx, dataSharingID, data) {
        try {
            if (ctx.mspID === Utils.externalActorsMSP)
                return shim.error(`Function forbidden for  ${Utils.externalActorsMSP}.`)

            let record
            try {
                let key = DataSharingRequestRecord.makeKey([dataSharingID])
                record = await ctx.dataSharingRequestsRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`DataSharingRequest record not found`)
            }

            console.log(`DataSharingRequest by partial key found: ${JSON.stringify(record)}`)
            record.updateRequestedData(data)
            await ctx.dataSharingRequestsRecordList.updateRecord(record)
            console.log(`DataSharingRequest updated: ${JSON.stringify(record)}`)
            return record
        } catch (e) {
            let message = `Error in updateDataSharingRequest function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Reject data sharing request.
     *
     * @param {Context} ctx the transaction context
     * @param {String} dataSharingID the ID of the data sharing request
     *
     * @returns {JSON}  the data sharing record that is being updated
     * @throws {shim.error} transaction execution failure
     */
    async rejectDataSharingRequest(ctx, dataSharingID) {
        try {
            if (ctx.mspID === Utils.externalActorsMSP)
                return shim.error(`Function forbidden for  ${Utils.externalActorsMSP}.`)

            let record
            try {
                let key = DataSharingRequestRecord.makeKey([dataSharingID])
                record = await ctx.dataSharingRequestsRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`DataSharingRequest record not found`)
            }

            console.log(`DataSharingRequest by partial key found: ${JSON.stringify(record)}`)
            record.reject()
            await ctx.dataSharingRequestsRecordList.updateRecord(record)
            console.log(`DataSharingRequest updated: ${JSON.stringify(record)}`)
            return record
        } catch (e) {
            let message = `Error in rejectDataSharingRequest function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Read data from a sharing request.
     *
     * @param {Context} ctx the transaction context
     * @param {String} dataSharingID the ID of the data sharing request
     * @param {String} requesterID the ID of the entity requesting data

     * @returns {JSON}  the data that has been shared
     * @throws {shim.error} transaction execution failure
     */
    async readDataFromRequest(ctx, requesterID, dataSharingID) {
        try {
            if (ctx.mspID !== Utils.externalActorsMSP)
                return shim.error(`Function private to ${Utils.externalActorsMSP}.`)

            let record
            try {
                let key = DataSharingRequestRecord.makeKey([dataSharingID])
                record = await ctx.dataSharingRequestsRecordList.getRecord(key)
            } catch (e) {
                return shim.error(`DataSharingRequest record not found`)
            }

            if (record.getRequesterID() !== requesterID)
                return shim.error(`Calling entity is not the original data requester.`)

            if (record.getStatus() === 'rejected')
                return shim.error(`This request was rejected.`)

            console.log(`DataSharingRequest found: ${JSON.stringify(record)}`)
            return {'data': record.getData()}
        } catch (e) {
            let message = `Error in readDataFromRequest function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }

    /**
     * Evaluate a queryString.
     *
     * @param {Context} ctx the transaction context
     * @param {String} queryString the query string to be evaluated
     *
     * @returns {JSON} the query results
     * @throws {shim.error} transaction execution failure
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
     * Read all data sharing requests.
     *
     * @param {Context} ctx the transaction context
     *
     * @returns {JSON} the query results
     * @throws {shim.error} transaction execution failure
     */
    async getAllDataSharingRequests(ctx) {
        try {
            let queryString = {
                "selector": {
                    "recordType": 'datasharingrequest'
                }
            }
            let queryResults = await this.queryWithQueryString(ctx, JSON.stringify(queryString));
            return queryResults
        } catch (e) {
            let message = `Error in getDataSharingRequests function: ${e}`
            Utils.dumpError(e);
            return shim.error(message)
        }
    }
}

module.exports = DataSharingRequestsContract