const mongoose = require('mongoose');

const imageSubSchema = new mongoose.Schema({
  url: { type: String, required: true },
  fileId: { type: String },
  name: { type: String },
  thumbnailUrl: { type: String },
});

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: [imageSubSchema],
    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);
