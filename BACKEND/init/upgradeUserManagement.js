import got from 'got';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const upgradeUsersManagement = async function (url, version, operation, contractsLocation) {
    
    // Register EndUser
    let tokenRes = await got.post(`${url}/users/register`, {
        json: {
            "username": "EndUser",
            "orgName": "EndUser",
            "role": "client",
            "secret": "cd0cba19a323000a47612c7badc85c9e"
        },
        responseType: 'json'
    });
    let token = tokenRes.body.token
    
    
    // install contract on EndUser peers
    await got.post(`${url}/chaincodes`, {
        json: {
            "peers": ['peer0.machine1.endusers.com'],
            "chaincodeName": "usersmg",
            "chaincodePath": `${contractsLocation}/Users_mg`,
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "metadataPath": `${contractsLocation}/Users_mg/META-INF`
        },
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });


    // Register ExternalActor user
    tokenRes = await got.post(`${url}/users/register`, {
        json: {
            "username": "ExternalActor",
            "orgName": "ExternalActor",
            "role": "client",
            "secret": "ac536125384bfa8411658034b7a5d2da"
        },
        responseType: 'json'
    });
    token = tokenRes.body.token
    
    
    // install contract on ExternalActor peers
    await got.post(`${url}/chaincodes`, {
        json: {
            "peers": ['peer0.machine1.externals.com'],
            "chaincodeName": "usersmg",
            "chaincodePath": `${contractsLocation}/Users_mg`,
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "metadataPath": `${contractsLocation}/Users_mg/META-INF`

        },
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });


     // Register MarketplaceOperator user
     tokenRes = await got.post(`${url}/users/register`, {
        json: {
            "username": "MarketplaceOperator",
            "orgName": "MarketplaceOperator",
            "role": "client",
            "secret": "c3697b1c8025195fb460c684a2ad6122"
        },
        responseType: 'json'
    });
    token = tokenRes.body.token
    
    
    // install contract on MPO peers
    await got.post(`${url}/chaincodes`, {
        json: {
            "peers": ['peer0.machine1.operator.com'],
            "chaincodeName": "usersmg",
            "chaincodePath": `${contractsLocation}/Users_mg`,
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "metadataPath": `${contractsLocation}/Users_mg/META-INF`

        },
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });


    // Register Dso user
    tokenRes = await got.post(`${url}/users/register`, {
        json: {
            "username": "Dso",
            "orgName": "Dso",
            "role": "client",
            "secret": "47e8813eda0fede830017845fe336173"
        },
        responseType: 'json'
    });
    token = tokenRes.body.token
    
    
    // install contract on Dso peers
    await got.post(`${url}/chaincodes`, {
        json: {
            "peers": ['peer0.machine1.dso.com'],
            "chaincodeName": "usersmg",
            "chaincodePath": `${contractsLocation}/Users_mg`,
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "metadataPath": `${contractsLocation}/Users_mg/META-INF`

        },
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

     // Register Retailer user
     tokenRes = await got.post(`${url}/users/register`, {
        json: {
            "username": "Retailer",
            "orgName": "Retailer",
            "role": "client",
            "secret": "bb057a5b683b5f31f89fa647baaeaadb"
        },
        responseType: 'json'
    });
    token = tokenRes.body.token


    // install contract on Retailer peers
    await got.post(`${url}/chaincodes`, {
        json: {
            "peers": ['peer0.machine1.retailers.com'],
            "chaincodeName": "usersmg",
            "chaincodePath": `${contractsLocation}/Users_mg`,
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "metadataPath": `${contractsLocation}/Users_mg/META-INF`

        },
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });


    // instantiate usersmg
    await got.post(`${url}/channels/usermanagement/chaincodes${operation}`, {
        json: {
            "chaincodeName": "usersmg",
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "args": [],
            "policy": {
                "identities": [
                    { "role": { "name": "member", "mspId": "EndUserMSP" } },
                    { "role": { "name": "member", "mspId": "ExternalActorMSP" } },
                    { "role": { "name": "member", "mspId": "RetailerMSP" } },
                    { "role": { "name": "member", "mspId": "DsoMSP" } },
                    { "role": { "name": "member", "mspId": "MarketplaceOperatorMSP" } },

                ],
                "policy": { "1-of": [{ "signed-by": 0 }, { "signed-by": 1 }, { "signed-by": 2}, { "signed-by": 3 }, { "signed-by": 4 }] }
            }
        },
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
}

let url = 'http://localhost:4000'
let version = 'v0'
let operation = ''
// let operation = '-upgrade'

const __filename = fileURLToPath(import.meta.url);
let dirLocation =  dirname(__filename);
let location =  resolve(dirLocation, '..')

upgradeUsersManagement(url, version, operation, location).then(res => {
    console.log('done')
})