import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  region: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: [
      "New Lead",
      "Contacted",
      "Qualified",
      "Proposal Sent",
      "Negotiation",
      "Won",
      "Lost",
      "Nurturing",
      "Follow-up",
      "Hot Lead"
    ],
    default: "New Lead"
  },
  score: { type: Number, required: true, min: 0, max: 100 },
  lastContact: { type: String, required: true },
  industry: { type: String },
  revenue: { type: String },
  tags: [{ type: String }],
  notes: { type: String },
  assignedTo: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  context: {
    type: String,
    enum: ['commercial', 'industrial', 'manufacturing', 'residential'],
    required: true
  },
});

// Update the updatedAt timestamp before saving
leadSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema); 