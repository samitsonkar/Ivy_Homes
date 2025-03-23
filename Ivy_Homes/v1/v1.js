const fs = require('fs');
let totalRequests = 0;
let requestCount = 0;

let charactersList = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 
    'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 
    'u', 'v', 'w', 'x', 'y', 'z'
];

function readExistingData() {
    try {
        if (fs.existsSync('wordv1.json')) {
            let fileContent = fs.readFileSync('wordv1.json', 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (error) {
        console.error("Error reading file:", error);
    }
    return [];
}

function readReqData() {
    try {
        if (fs.existsSync('reqv1.json')) {
            let fileContent = fs.readFileSync('reqv1.json', 'utf-8');
            return JSON.parse(fileContent);
        }
    } catch (error) {
        console.error("Error reading file:", error);
    }
    return [];
}

async function processQuery(current, results) {
    for (let i = 0; i < charactersList.length; i++) {
        if (requestCount >= 1) {
            await new Promise(resolve => setTimeout(resolve, 600));
            requestCount = 0;
        }
        let response = await fetch(`http://35.200.185.69:8000/v1/autocomplete?query=${current + charactersList[i]}`);
        let data = await response.json();
        requestCount++;
        totalRequests++;
        console.log(current + charactersList[i]);
        
        try {
            if (data.results.length > 0) {
                console.log(results.length);
                console.log(totalRequests);
            }
            if (data.results.length === 10) {
                if (current + charactersList[i] === data.results[0]) {
                    results.push(data.results[0]);
                }
                await processQuery(current + charactersList[i], results);
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
    let storedData = readExistingData();
    let requestHistory = readReqData();
    for (let i = storedData.length; i < charactersList.length; i++) {
        storedData = readExistingData();
        requestHistory = readReqData();
        let results = [];
        totalRequests = 0;
        await processQuery(charactersList[i], results);
        storedData.push(results);
        requestHistory.push(totalRequests);
        fs.writeFileSync('wordv1.json', JSON.stringify(storedData, null, 2), 'utf-8');
        fs.writeFileSync('reqv1.json', JSON.stringify(requestHistory, null, 2), 'utf-8');
        console.log("Data saved to wordv1.json");
    }
})();
