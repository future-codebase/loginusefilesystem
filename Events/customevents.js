const EventEmitter = require("events");

myEvent = new EventEmitter();

module.exports.myEventhandler = (data) => {
  console.log(data);
};
module.exports.myEventhandler_2 = (data) => {
  console.log(data);
};
