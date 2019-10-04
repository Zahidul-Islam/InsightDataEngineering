exports.handler = (event, context) => {
  console.log(event);
  const number = event.number;
  const result = Math.random();
  console.log("==> result: ", result, number + result);
  context.succeed(JSON.stringify(number + result));
};
