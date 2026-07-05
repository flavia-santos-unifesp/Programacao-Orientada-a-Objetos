const path = require("path");
const filePath = path.join(__dirname, "PetSystemAnalytics/backend/dist/src/index.js");
console.log("Loading app from:", filePath);
require(filePath);
