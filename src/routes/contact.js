import express from 'express';
import { ContactForm } from '../models/index.js';

const router = express.Router();

router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, company, services, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !company || !services || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Create new contact form entry
    const contact = new ContactForm({
      name,
      email,
      phone,
      company,
      services,
      message
    });

    // Save to database
    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contact
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting contact form'
    });
  }
});

export default router;