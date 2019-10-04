const Function = require("../schemas/functionSchema");
const connectToDatabase = require("../lib/db");

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const functionId = event.pathParameters.id;
  return connectToDatabase().then(async () => {
    const func = await Function.findById(functionId);
    return {
      statusCode: 200,
      body: JSON.stringify(func)
    };
  });
};
