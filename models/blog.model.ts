import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 5,
  },
  subtitle: {
    type: String,
    required: true,
    minLength: 5,
  },
  image: {
    type: String
  },
  content: {
    type: String,
    required: true,
    minLength: 10
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['Lifestyle', 'Hobby', 'Finance', 'Health', 'Philosophy', 'Technology', 'Self Improvement', 'Food', 'Education', 'Entertainment'],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  likeUser: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema)
export default Blog;