const AWS = require("aws-sdk");
const uuidv4 = require("uuid/v4");
const csv = require("csv-parser");
const fs = require("fs");

require("dotenv").config();

AWS.config.update({
  region: process.env.AWS_REGION
});

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const companyFilePath = process.env.COMPANY_FILE_PATH;

let counter = 0;
let companies = [];

const cleanNaN = value => (value === "nan" ? "" : value);

console.time("csv-parse");
fs.createReadStream(companyFilePath)
  .pipe(csv())
  .on("data", async row => {
    const [city, state, country] = cleanNaN(row["locality"]).split(",");
    const company = {
      id: uuidv4(),
      companyName: row["name"],
      companyDomain: cleanNaN(row["domain"]),
      yearFounded:
        cleanNaN(row["year founded"]) &&
        parseInt(cleanNaN(row["year founded"]).split(".")[0]),
      industry: cleanNaN(row["industry"]),
      sizeRange: cleanNaN(row["size range"]),
      locality: cleanNaN(row["locality"]),
      city: city && city.trim(),
      state: state && state.trim(),
      country: country && country.trim(),
      linkedInUrl: cleanNaN(row["linkedin url"]),
      currentEmployeeEstimate: parseInt(row["current employee estimate"]),
      totalEmployeeEstimate: parseInt(row["total employee estimate"])
    };

    companies.push(company);

    const params = {
      MessageBody: JSON.stringify(company),
      QueueUrl: process.env.SQS_URL,
      DelaySeconds: 0
    };

    sqs.sendMessage(params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("==> sqs: ", data);
      }
    });
  })
  .on("end", () => {
    console.timeEnd("csv-parse");
  });
