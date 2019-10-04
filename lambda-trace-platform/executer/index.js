const lib = require("../lib/index");

const minRAM = parseInt(process.env.MIN_RAM, 10);
const minCost = parseFloat(process.env.MIN_COST);
const powerValues = process.env.MEMORY_ALLOCATION.split(",");

const validateInput = (lambdaARN, value, num) => {
  if (!lambdaARN) {
    throw new Error("Missing or empty lambdaARN");
  }
  if (!value || isNaN(value)) {
    throw new Error("Invalid value: " + value);
  }
  if (!num || isNaN(num)) {
    throw new Error("Invalid num: " + num);
  }
};

const extractDataFromInput = event => {
  const body = JSON.parse(event.body);
  return {
    lambdaARN: body.lambdaARN,
    value: parseInt(body.value, 10),
    num: parseInt(body.num, 10),
    enableParallel: !!body.parallelInvocation,
    payload: convertPayload(body.payload)
  };
};

const convertPayload = payload => {
  if (typeof payload !== "string" && typeof payload !== "undefined") {
    console.log("Converting payload to string from ", typeof payload);
    payload = JSON.stringify(payload);
  }
  return payload;
};

const runInParallel = async (num, lambdaARN, lambdaAlias, payload) => {
  const results = [];
  // run all invocations in parallel ...
  const invocations = lib.range(num).map(async () => {
    const data = await lib.invokeLambda(lambdaARN, lambdaAlias, payload);
    console.log("==> running in parallel", data);
    // invocation errors return 200 and contain FunctionError and Payload
    if (data.FunctionError) {
      throw new Error("Invocation error: " + data.Payload);
    }
    results.push(data);
  });
  // ... and wait for results
  await Promise.all(invocations);
  return results;
};

const runInSeries = async (num, lambdaARN, lambdaAlias, payload) => {
  const results = [];
  for (let i = 0; i < num; i++) {
    // run invocations in series
    const data = await lib.invokeLambda(lambdaARN, lambdaAlias, payload);
    // invocation errors return 200 and contain FunctionError and Payload
    if (data.FunctionError) {
      throw new Error("Invocation error: " + data.Payload);
    }
    results.push(data);
  }
  return results;
};

const computeStatistics = (results, value) => {
  // use results (which include logs) to compute average duration ...

  const durations = lib.parseLogAndExtractDurations(results);

  const averageDuration = lib.computeAverageDuration(durations);
  console.log("Average duration: ", averageDuration);

  // ... and overall statistics
  const averagePrice = lib.computePrice(
    minCost,
    minRAM,
    value,
    averageDuration
  );

  // .. and total cost (exact $)
  const totalCost = lib.computeTotalCost(minCost, minRAM, value, durations);

  const stats = {
    averagePrice,
    averageDuration,
    totalCost
  };

  console.log("Stats: ", stats);
  return stats;
};

exports.handler = async event => {
  const {
    lambdaARN,
    value,
    num,
    enableParallel,
    payload
  } = extractDataFromInput(event);

  validateInput(lambdaARN, value, num); // may throw

  if (powerValues.indexOf("" + value) === -1) {
    console.log("Not executing for " + value);
    return "Not executing for " + value;
  }

  const lambdaAlias = "RAM" + value;
  let results;

  if (enableParallel) {
    results = await runInParallel(num, lambdaARN, lambdaAlias, payload);
  } else {
    results = await runInSeries(num, lambdaARN, lambdaAlias, payload);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(computeStatistics(results, value))
  };
};
