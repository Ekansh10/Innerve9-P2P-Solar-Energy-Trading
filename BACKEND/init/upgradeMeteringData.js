import got from 'got';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const upgradeMetering = async function (url, version, operation, contractsLocation) {

    // Register Dso user
    let tokenRes = await got.post(`${url}/users/register`, {
        json: {
            "username": "Dso",
            "orgName": "Dso",
            "role": "client",
            "secret": "47e8813eda0fede830017845fe336173"
        },
        responseType: 'json'
    });
    let token = tokenRes.body.token
    // install contract on Dso peers
    await got.post(`${url}/chaincodes`, {
        json: {
            "peers": ['peer0.machine1.dso.com'],
            "chaincodeName": "smdatamg",
            "chaincodePath": `${contractsLocation}/MeteringData_mg`,
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "metadataPath": `${contractsLocation}/MeteringData_mg/META-INF`
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
            "chaincodeName": "smdatamg",
            "chaincodePath": `${contractsLocation}/MeteringData_mg`,
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "metadataPath": `${contractsLocation}/MeteringData_mg/META-INF`
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
            "peers":["peer0.machine1.retailers.com", "peer0.machine1.dso.com"],
            "chaincodeName": "smdatamg",
            "chaincodeType": "node",
            "chaincodeVersion": version,
            "args": [],
            "policy": {
                "identities": [
                    { "role": { "name": "member", "mspId": "RetailerMSP" } },
                    { "role": { "name": "member", "mspId": "DsoMSP" } },
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
upgradeMetering(url, version, operation, location).then(res => {
    console.log('done')
})