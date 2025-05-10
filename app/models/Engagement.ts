import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'sales'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const suggestionSchema = new mongoose.Schema({
  stage: {
    type: String,
    enum: ['initial', 'requirements', 'proposal', 'closing'],
    required: true
  },
  suggestions: [{
    type: String,
    required: true
  }]
});

const engagementSchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  messages: {
    type: [messageSchema],
    default: []
  },
  context: {
    type: String,
    enum: ['commercial', 'industrial', 'manufacturing', 'residential'],
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  currentStage: {
    type: String,
    enum: ['initial', 'requirements', 'proposal', 'closing'],
    default: 'initial'
  },
  suggestions: {
    type: [suggestionSchema],
    default: []
  }
}, {
  timestamps: true
});

// Force model recreation
delete mongoose.models.Engagement;
const Engagement = mongoose.model('Engagement', engagementSchema);

export default Engagement; 