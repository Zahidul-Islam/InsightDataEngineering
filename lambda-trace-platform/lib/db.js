const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const mongodbUrl = process.env.MONGODB_URL;
let isConnected = null;

module.exports = connectToDatabase = () => {
  if (isConnected) {
    console.log("=> using existing database connection");
    return Promise.resolve();
  }
  console.log("=> using new database connection");
  return mongoose
    .connect(mongodbUrl, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(db => {
      isConnected = db.connections[0].readyState;
    });
};
