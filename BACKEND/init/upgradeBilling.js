import got from 'got';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const upgradeBilling = async function (url, version, operation, contractsLocation) {

    // Register Retailer user
    let tokenRes = await got.post(`${url}/users/register`, {
        json: {
            "username": "Retailer",
            "orgName": "Retailer",
            "role": "client",
            "secret": "bb057a5b683b5f31f89fa647baaeaadb"
        },
        responseType: 'json'
    });
    let token = tokenRes.body.token
    // install contract on Retailer peers
    await got.post(`${url}/chaincodes`, {
        json: {
            "peers": ['peer0.machine1.retailers.com'],
            "chaincodeName": "billingmg",
            "chaincodePath": `${contractsLocation}/Billing_mg`,
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "metadataPath": `${contractsLocation}/Billing_mg/META-INF`
        },
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

     // Register EndUser
     tokenRes = await got.post(`${url}/users/register`, {
        json: {
            "username": "EndUser",
            "orgName": "EndUser",
            "role": "client",
            "secret": "cd0cba19a323000a47612c7badc85c9e"
        },
        responseType: 'json'
    });
    token = tokenRes.body.token
    // install contract on EndUser peers
    await got.post(`${url}/chaincodes`, {
        json: {
            "peers": ['peer0.machine1.endusers.com'],
            "chaincodeName": "billingmg",
            "chaincodePath": `${contractsLocation}/Billing_mg`,
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "metadataPath": `${contractsLocation}/Billing_mg/META-INF`
        },
        responseType: 'json',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    // instantiate smdatamg
    await got.post(`${url}/channels/trading/chaincodes${operation}`, {
        json: {
            "peers":["peer0.machine1.retailers.com", "peer0.machine1.endusers.com"],
            "chaincodeName": "billingmg",
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "args": [],
            "policy": {
                "identities": [
                    { "role": { "name": "member", "mspId": "RetailerMSP" } },
                    { "role": { "name": "member", "mspId": "EndUserMSP" } },
                ],
                "policy": { "1-of": [{ "signed-by": 0 }, { "signed-by": 1 }] }
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

upgradeBilling(url, version, operation, location).then(res => {
    console.log('done')
})