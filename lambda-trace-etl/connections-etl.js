const AWS = require("aws-sdk");
const csv = require("csv-parser");
const parquet = require("parquetjs");
const fs = require("fs");
const _ = require("lodash");
require("dotenv").config();

AWS.config.update({ region: process.env.AWS_REGION });

const client = require("elasticsearch").Client({
  hosts: [process.env.ELASTICSEARCH_DOMAIN],
  connectionClass: require("http-aws-es")
});

const normalizeCompanyName = companyName => {
  if (!companyName) return "";
  companyName = _.trimEnd(companyName, '"');
  companyName = _.trimStart(companyName, '"');
  companyName = _.deburr(companyName);
  companyName = _.replace(companyName, new RegExp("-[0-9]{12}$", "i"), "");
  companyName = _.replace(
    companyName,
    new RegExp("^_(private|public)_", "g"),
    ""
  );
  companyName = _.trimStart(companyName, "_");
  companyName = _.trimStart(companyName, "-");
  companyName = _.trimStart(companyName, ".");
  companyName = _.trimStart(companyName, "1 - ");
  companyName = _.trimStart(companyName, "0");
  companyName = _.trimStart(companyName, "- - ");
  companyName = _.trimEnd(companyName, " -");
  companyName = _.replace(companyName, new RegExp(" - ", "g"), " ");
  companyName = _.replace(companyName, new RegExp("_", "g"), " ");
  companyName = _.trim(companyName);
  companyName = _.lowerCase(companyName);
  companyName = _.replace(companyName, "amazon web services", "amazon");
  companyName = _.replace(companyName, "amazon aws", "amazon");

  return companyName;
};

const normalizeJobTitle = position => {
  if (!position) {
    return "";
  }
  position = _.replace(position, "Founder & CEO", "founder and ceo");
  position = _.replace(position, "Founder and CEO", "founder and ceo");
  position = _.replace(position, "CEO and Co-Founder", "founder and ceo");
  position = _.replace(position, "Co Founder and CEO", "founder and ceo");
  position = _.replace(position, "CEO/Founder", "founder and ceo");
  position = _.replace(position, "CEO and Founder", "founder and ceo");
  position = _.replace(position, "Co-founder & CEO", "founder and ceo");

  position = _.replace(position, "CTO and Co-founder", "founder and cto");
  position = _.replace(position, "CTO and co-founder", "founder and cto");
  position = _.replace(position, "Co-Founder & CTO", "founder and cto");
  position = _.replace(position, "Co-Founder and CTO", "founder and cto");
  position = _.replace(position, "CTO & Co-founder", "founder and ceo");
  position = _.replace(position, "CTO and Founder", "founder and ceo");

  position = _.lowerCase(position);

  return position;
};

const connectionFilePath = process.env.CONNECTION_FILE_PATH;

console.time("timer");
fs.createReadStream(connectionFilePath)
  .pipe(csv())
  .on("data", async row => {
    const connection = {
      firstName: row["First Name"],
      lastName: row["Last Name"],
      originalCompanyName: row["Company"],
      companyName: normalizeCompanyName(row["Company"]),
      jobTitle: normalizeJobTitle(row["Position"])
    };

    if (connection.firstName && connection.lastName) {
      try {
        await client.index({
          index: "lambdatrace-connections-2019-10-21",
          body: connection
        });
        console.log("==> ", connection);
      } catch (err) {
        console.log("err ==>", err);
      }
    }
  })
  .on("end", () => {
    console.timeEnd("timer");
  });
