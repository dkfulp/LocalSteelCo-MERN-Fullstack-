const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
  customer: { type: mongoose.Types.ObjectId, required: true, ref: 'Customer' },
  submitted: { type: Date, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Question', questionSchema);