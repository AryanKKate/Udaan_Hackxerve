const mongoose = require('mongoose');

const txnSchema = new mongoose.Schema({
  amount: Number,
  from: {
    type: String,
    required: true,
  },
  signatures: {
    type: [ {address: String, signature: String} ]
  },
  requiredSignatures: {
    type: Number,
    required: true
  },
  to: {
    type: String,
    required: true,
  },
  txHash: {
    type: String,
    default: false
  },
  executed: {
    type: Boolean,
  },
  status: { type: String, enum: ["Pending", "Complete"], default: "Pending" },
})

const Transaction= mongoose.model("Transaction", txnSchema);
module.export=Transaction