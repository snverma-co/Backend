import mongoose from 'mongoose';

const iconFormSchema = new mongoose.Schema({
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
  message: { 
    type: String, 
    required: [true, 'Message is required'],
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const IconForm = mongoose.model('IconForm', iconFormSchema);
export default IconForm;