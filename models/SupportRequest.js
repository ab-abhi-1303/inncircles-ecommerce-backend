const mongoose = require('mongoose');

const SupportRequestSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    supportEngineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    issueDescription: { type: String, required: true },
    status: { type: String, enum: ['In Progress', 'Refund Pending', 'Refund Sent', 'Rejected'], default: 'In Progress' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportRequest', SupportRequestSchema);
