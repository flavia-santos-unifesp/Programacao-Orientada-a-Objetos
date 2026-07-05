const path = require("path");
const filePath = path.join(__dirname, "PetSystemAnalytics/backend/dist/index.js");
console.log("Loading app from:", filePath);
require(filePath);
