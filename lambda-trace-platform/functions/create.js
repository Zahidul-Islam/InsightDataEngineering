const Function = require("../schemas/functionSchema");
const connectToDatabase = require("../lib/db");
const defaultPowerConfiguration = [128, 256, 512, 1024, 1536, 3008];

const createFunc = body => {};

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  return connectToDatabase().then(async () => {
    const body = JSON.parse(event.body);
    const Func = new Function({
      arn: body.lambdaARN,
      numberOfInvocation: body.num,
      enableParallel: body.enableParallel || false,
      strategy: body.strategy || "cost",
      powerConfiguration: body.powerConfiguration || defaultPowerConfiguration,
      payload: JSON.stringify(body.payload),
      isActive: body.isActive || true,
      userId: body.userId
    });

    const result = await Func.save();

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  });
};
