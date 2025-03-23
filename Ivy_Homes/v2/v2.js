const fs = require('fs');
let totalRequests = 0;
let requestCount = 0;

let charSet = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
    'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', 
    '4', '5', '6', '7', '8', '9'
];

function readExistingData() {
    try {
        if (fs.existsSync('wordv2.json')) {
            let fileContent = fs.readFileSync('wordv2.json', 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (error) {
        console.error("Error reading file:", error);
    }
    return [];
}

function readReqData() {
    try {
        if (fs.existsSync('reqv2.json')) {
            let fileContent = fs.readFileSync('reqv2.json', 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (error) {
        console.error("Error reading file:", error);
    }
    return [];
}

async function fetchResults(current, results) {
    for (let i = 0; i < charSet.length; i++) {
        if (requestCount >= 1) {
            await new Promise(resolve => setTimeout(resolve, 1300));
            requestCount = 0;
        }
        let response = await fetch(`http://35.200.185.69:8000/v2/autocomplete?query=${current + charSet[i]}`);
        let data = await response.json();
        requestCount++;
        totalRequests++;
        console.log(current + charSet[i]);
        
        try {
            if (data.results.length > 0) {
                console.log(results.length);
                console.log(totalRequests);
            }
            if (data.results.length === 12) {
                if (current + charSet[i] === data.results[0]) {
                    results.push(data.results[0]);
                }
                await fetchResults(current + charSet[i], results);
            } else {
                results.push(...data.results);
            }
        } catch (error) {
            console.log(error);
            i--;
        }
    }
}

(async () => {
    let existingData = readExistingData();
    let requestLog = readReqData();
    for (let i = existingData.length; i < charSet.length; i++) {
        existingData = readExistingData();
        requestLog = readReqData();
        let results = [];
        totalRequests = 0;
        await fetchResults(charSet[i], results);
        existingData.push(results);
        requestLog.push(totalRequests);
        fs.writeFileSync('wordv2.json', JSON.stringify(existingData, null, 2), 'utf-8');
        fs.writeFileSync('reqv2.json', JSON.stringify(requestLog, null, 2), 'utf-8');
        console.log("Data saved to wordv2.json");
    }
})();
