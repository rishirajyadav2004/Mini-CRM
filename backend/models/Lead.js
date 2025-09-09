const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Converted', 'Lost'],
    default: 'New'
  },
  value: {
    type: Number,
    default: 0
  },
  customerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Customer',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lead', leadSchema);