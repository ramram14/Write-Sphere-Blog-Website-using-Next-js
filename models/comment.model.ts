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
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment', // Self-referencing to Comment model
    default: null
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

commentSchema.index({ blog: 1, author: 1, parentComment: 1 });

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema)
export default Comment;