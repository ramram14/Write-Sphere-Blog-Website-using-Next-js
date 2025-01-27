import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 20
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxLength: 10
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  },
  profileImage: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

}, {
  timestamps: true
})

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
})

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateJWTToken = function () {
  console.log(process.env.JWT_SECRET_KEY);
  console.log('process.env.JWT_SECRET_KEY');
  return jwt.sign({
    _id: this._id
  },
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: '7d'
    }
  )
}

const User = mongoose.models.User || mongoose.model('User', userSchema)
export default User;
