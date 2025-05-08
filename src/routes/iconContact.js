import express from 'express';
import { IconContactForm } from '../models/index.js';

const router = express.Router();

router.post('/icon-contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Create and save the form submission
    const iconForm = new IconContactForm({
      name,
      email,
      message
    });

    await iconForm.save();

    return res.status(201).json({
      success: true,
      message: 'Form submitted successfully'
    });

  } catch (error) {
    console.error('Icon contact form submission error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit form. Please try again.'
    });
  }
});

export default router;