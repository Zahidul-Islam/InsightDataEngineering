const Function = require("../schemas/functionSchema");
const connectToDatabase = require("../lib/db");

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase().then(async () => {
    const funcs = await Function.find();
    return {
      statusCode: 200,
      body: JSON.stringify(funcs)
    };
  });
};
