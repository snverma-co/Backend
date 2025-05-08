

import mongoose from 'mongoose';

const contactFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9+\-\s()]{10,}$/, 'Please enter a valid phone number']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    minlength: [2, 'Company name must be at least 2 characters long']
  },
  services: {
    type: String,
    required: [true, 'Services is required'],
    enum: ['Accounting', 'Taxation', 'Audit', 'Advisory', 'Other'],
    default: 'Other'
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ContactForm = mongoose.model('ContactForm', contactFormSchema);

export default ContactForm;