import express from 'express';
import { Form } from '../models/index.js';

const router = express.Router();

router.post('/form', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }

    // Create new form entry
    const form = new Form({
      name,
      email,
      message
    });

    // Save to database
    await form.save();

    res.status(201).json({
      success: true,
      message: 'Form submitted successfully',
      data: form
    });
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting form'
    });
  }
});

export default router;