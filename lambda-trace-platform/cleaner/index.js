const lib = require("../lib/index");
const powerValues = process.env.MEMORY_ALLOCATION.split(",");

const validateInput = lambdaARN => {
  if (!lambdaARN) {
    throw new Error("Missing or empty lambdaARN");
  }
  if (!powerValues.length) {
    throw new Error("Missing or empty env.powerValues");
  }
};

const cleanup = async (lambdaARN, alias) => {
  try {
    const { FunctionVersion } = await lib.checkLambdaAlias(lambdaARN, alias);
    console.log(`==> ${lambdaARN} - ${FunctionVersion}`);
    // delete both alias and version (could be done in parallel!)
    await lib.deleteLambdaAlias(lambdaARN, alias);
    await lib.deleteLambdaVersion(lambdaARN, FunctionVersion);
  } catch (error) {
    if (error.code === "ResourceNotFoundException") {
      console.error("OK, even if version/alias was not found");
      console.error(error);
    } else {
      console.error(error);
      throw error;
    }
  }
};

/**
 * Delete aliases and versions.
 */
module.exports.handler = async event => {
  const { lambdaARN } = JSON.parse(event.body);

  validateInput(lambdaARN); // may throw

  const ops = powerValues.map(async value => {
    const alias = "RAM" + value;
    await cleanup(lambdaARN, alias); // may throw
  });

  try {
    await Promise.all(ops);

    return {
      stattusCode: 200
    };
  } catch (err) {
    return {
      stattusCode: 500
    };
  }
};
