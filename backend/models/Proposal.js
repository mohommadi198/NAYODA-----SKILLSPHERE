const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  attachments: [{ type: String }], // Array of file paths or URLs
  deliveryTime: { type: String }, // e.g., "3 Days", "1 Week", etc.
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Proposal', proposalSchema);
