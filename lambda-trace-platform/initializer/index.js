const lib = require("../lib/index");

const powerValues = process.env.MEMORY_ALLOCATION.split(",");

const validateInput = (lambdaARN, num) => {
  if (!lambdaARN) {
    throw new Error("Missing or empty lambdaARN");
  }
  if (!powerValues.length) {
    throw new Error("Missing or empty env.powerValues");
  }
  if (!num || num < 5) {
    throw new Error("Missing num or num below 5");
  }
};

const verifyIfAliasExist = async (lambdaARN, alias) => {
  try {
    await lib.checkLambdaAlias(lambdaARN, alias);
    return true;
  } catch (error) {
    if (error.code === "ResourceNotFoundException") {
      // OK, the alias isn't supposed to exist
      console.log("OK, even if missing alias ");
      return false;
    } else {
      console.log("error during alias check:");
      throw error; // a real error :)
    }
  }
};

const createPowerConfiguration = async (
  lambdaARN,
  value,
  alias,
  aliasExists
) => {
  try {
    await lib.setLambdaPower(lambdaARN, value);
    const { Version } = await lib.publishLambdaVersion(lambdaARN);
    if (aliasExists) {
      await lib.updateLambdaAlias(lambdaARN, alias, Version);
    } else {
      await lib.createLambdaAlias(lambdaARN, alias, Version);
    }
  } catch (error) {
    if (error.message && error.message.includes("Alias already exists")) {
      // shouldn't happen, but nothing we can do in that case
      console.log("OK, even if: ", error);
    } else {
      console.log("error during inizialization for value " + value);
      throw error; // a real error :)
    }
  }
};

exports.handler = async event => {
  const { lambdaARN, num } = JSON.parse(event.body);
  validateInput(lambdaARN, num);
  const lambdas = [];

  for (let i = 0; i < powerValues.length; i++) {
    const value = powerValues[i];
    const alias = `RAM${value}`;
    const aliasExists = await verifyIfAliasExist(lambdaARN, alias);
    console.log(`✅ ${lambdaARN}: ${alias}`);
    await createPowerConfiguration(lambdaARN, value, alias, aliasExists);
    lambdas.push(`${lambdaARN}: ${alias}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "successfully initialized lambdas"
    })
  };
};
