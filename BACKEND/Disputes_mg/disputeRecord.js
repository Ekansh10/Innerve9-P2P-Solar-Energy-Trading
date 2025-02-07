'use strict'
const State = require('./ledger-api/state.js')
const { v4: uuidv4 } = require('uuid');

class DisputeRecord extends State {

    constructor(obj) {
        super(DisputeRecord.getClass(), [obj.ID])
        Object.assign(this, obj)
    }

    getID() { return this.ID }
    getOwner() { return this.owner }
    getDescription() { return this.description }
    getResolverID() { return this.resolverID }
    getResolutionDescription() { return this.resolutionDescription }
    getCreatedAt() { return this.createdAt }


    setResolver(resolverID){
        this.resolverID = resolverID
        this.update()
    }
    setResolutionDescription(description){
        this.resolutionDescription = description
        this.update()
    }
    static fromBuffer(buffer) {
        return DisputeRecord.deserialize(Buffer.from(JSON.parse(buffer)))
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this))
    }

    static deserialize(data) {
        return State.deserializeClass(data, DisputeRecord)
    }
    
    update(){
        let now = new Date()
        this.updatedAt = Math.round(now.getTime() / 1000)
    }

    static createInstance(creatorID, description) {
        let ID = uuidv4()
        let recordType = 'dispute'
        let now = new Date()
        const createdAt = Math.round(now.getTime() / 1000)
        let updatedAt = createdAt
        return new DisputeRecord({ ID, recordType, createdAt, creatorID, description, updatedAt })
    }

    static getClass() {
        return 'org.p2pflex.disputerecord'
    }

}

module.exports = DisputeRecord
