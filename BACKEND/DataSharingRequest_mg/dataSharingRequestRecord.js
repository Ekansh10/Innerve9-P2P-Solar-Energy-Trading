'use strict'
const State = require('./ledger-api/state.js')
const { v4: uuidv4 } = require('uuid');

class DataSharingRequestRecord extends State {

    constructor(obj) {
        super(DataSharingRequestRecord.getClass(), [obj.ID])
        Object.assign(this, obj)
    }

    getStatus() { return this.status }
    getID() { return this.ID }
    getRequesterID() { return this.requesterID }
    getRequestedDataDescription() { return this.requestedDataDescription }
    getDataProviderID() {
        if (this.status === 'provided'){
            return this.dataProviderID
        }
    }
    getData() {
        if (this.status === 'provided'){
            return this.data
        }
    }
    getCreatedAt() { return this.createdAt }
    getUpdatedAt() { return this.updatedAt }

    reject(){
        this.status = 'rejected'
        this.update()
    }
    updateRequestedData(data){
        this.data = data
        this.update()
    }

    provideData(dataProviderID, data){
        this.dataProviderID = dataProviderID
        this.data = data
        this.status = 'provided'
        this.update()
    }

    returnData(){
        this.update()
        return this.data
    }
    update(){
        let now = new Date()
        this.updatedAt = Math.round(now.getTime() / 1000)
    }

    static fromBuffer(buffer) {
        return DataSharingRequestRecord.deserialize(Buffer.from(JSON.parse(buffer)))
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this))
    }

    static deserialize(data) {
        return State.deserializeClass(data, DataSharingRequestRecord)
    }

    static createInstance(requesterID, requestedDataDescription) {
        let ID = uuidv4()
        let recordType = 'datasharingrequest'
        let now = new Date()
        const createdAt = Math.round(now.getTime() / 1000)
        let updatedAt = createdAt
        let data = {}
        let status = 'pending'
        return new DataSharingRequestRecord({ ID, recordType, createdAt, updatedAt, requesterID, requestedDataDescription, data, status})
    }

    static getClass() {
        return 'org.p2pflex.datasharingrequestrecord'
    }

}

module.exports = DataSharingRequestRecord