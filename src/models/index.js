import mongoose from 'mongoose';

import Career from './Career.js';
import IconForm from './IconForm.js';

// Contact Form Schema
const contactFormSchema = new mongoose.Schema({
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
  company: { 
    type: String, 
    required: [true, 'Company name is required'],
    trim: true 
  },
  services: { 
    type: String, 
    required: [true, 'Services are required'],
    trim: true 
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

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscriptionDate: { type: Date, default: Date.now }
});

export const CareerForm = Career;
export const ContactForm = mongoose.model('ContactForm', contactFormSchema);
export const Newsletter = mongoose.model('Newsletter', newsletterSchema);
export const IconContactForm = IconForm;