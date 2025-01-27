import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: true
  },
  LikeUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesNumber: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
})

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)
export default Comment;