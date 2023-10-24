const mongoose = require('mongoose')
const {Schema, model} = mongoose;

const VisitorSchema = new Schema({
  name: {type: String},
  count: {type: Number},

  
});

const VisitorModel = model('Visitor', VisitorSchema);

module.exports = VisitorModel;