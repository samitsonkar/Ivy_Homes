const words = require('./wordv1.json');
const request = require('./reqv1.json');
let totalRequests = 0;
let ans = 0;
for(let i = 0; i<words.length; i++) {
    ans += words[i].length;
}
for(let i = 0; i<request.length; i++) {
    totalRequests += request[i];
}
console.log("ans = " + ans);
console.log("totalRequests = " + totalRequests);