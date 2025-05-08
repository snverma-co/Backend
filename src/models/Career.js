import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9+\-\s()]{10,}$/, 'Please enter a valid phone number']
  },
  designation: {
    type: String,
    required: [true, 'Designation is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  resume: {
    type: String,
    required: [true, 'Resume is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Career = mongoose.model('Career', careerSchema);
export default Career;