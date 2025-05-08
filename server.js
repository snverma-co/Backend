import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import connectDB from './src/config/db.js';
import { CareerForm, ContactForm, Newsletter, IconContactForm } from './src/models/index.js';
import routes from './src/routes/index.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Increase payload size limit for file uploads
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Mount API routes
app.use('/api', routes);

// Root route handler
app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running' });
});

// Add specific error handling for payload size errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 413) {
    return res.status(413).json({
      success: false,
      message: 'File size too large. Maximum size is 5MB.'
    });
  }
  next(err);
});

// Connect to MongoDB
try {
  await connectDB();
  console.log('Database connection established');
} catch (error) {
  console.error('Failed to connect to MongoDB:', error);
  // Don't exit immediately, allow for connection retries
  setTimeout(() => {
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB connection failed after retry attempts');
      process.exit(1);
    }
  }, 10000);
}

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, services, message } = req.body;
    
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB connection error. Connection state:', mongoose.connection.readyState);
      // Attempt to reconnect
      try {
        await mongoose.connect(process.env.MONGODB_URI);
      } catch (connError) {
        console.error('Reconnection attempt failed:', connError);
        return res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable. Please try again later.'
        });
      }
    }

    const contactForm = new ContactForm({
      name,
      email,
      phone,
      company,
      services,
      message
    });

    await contactForm.save();
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid form data. Please check your inputs.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Career form endpoint
app.post('/api/career', async (req, res) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.status(500).json({ success: false, message: 'Database connection error. Please try again later.' });
    }
    const careerForm = new CareerForm(req.body);
    await careerForm.save();
    res.json({ success: true, message: 'Career form submitted successfully' });
  } catch (error) {
    console.error('Career form submission error:', error);
    const errorMessage = error.name === 'ValidationError' ? 'Please fill all required fields correctly.' : 'Failed to submit career form. Please try again.';
    res.status(500).json({ success: false, message: errorMessage });
  }
});

// News API endpoint
app.get('/api/news', async (req, res) => {
  try {
    const NEWS_API_KEY = process.env.NEWS_API_KEY || '054c906f42244f30ac32cd97a7edff27';
    const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
    
    const response = await axios.get(
      `${NEWS_API_BASE_URL}/everything?q=(finance OR accounting OR GST OR VAT OR "chartered accountant")&language=en&sortBy=publishedAt&pageSize=10`,
      {
        headers: {
          'X-Api-Key': NEWS_API_KEY
        }
      }
    );

    if (!response.data || !response.data.articles) {
      throw new Error('Failed to fetch news');
    }

    const articles = response.data.articles.map(article => ({
      id: article.url,
      title: article.title,
      date: new Date(article.publishedAt).toLocaleDateString(),
      url: article.url
    }));

    res.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Newsletter endpoint
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB connection error. Connection state:', mongoose.connection.readyState);
      // Attempt to reconnect
      try {
        await mongoose.connect(process.env.MONGODB_URI);
      } catch (connError) {
        console.error('Reconnection attempt failed:', connError);
        return res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable. Please try again later.'
        });
      }
    }

    const newsletter = new Newsletter({ email });
    await newsletter.save();
    res.status(201).json({ 
      success: true, 
      message: 'Newsletter subscription successful' 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email already subscribed' 
      });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

// Icon Contact form endpoint
app.post('/api/icon-contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.error('MongoDB connection error. Connection state:', mongoose.connection.readyState);
      try {
        await mongoose.connect(process.env.MONGODB_URI);
      } catch (connError) {
        console.error('Reconnection attempt failed:', connError);
        return res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable. Please try again later.'
        });
      }
    }

    const iconContactForm = new IconContactForm({
      name,
      email,
      message
    });

    await iconContactForm.save();
    res.status(201).json({
      success: true,
      message: 'Icon contact form submitted successfully'
    });
  } catch (error) {
    console.error('Icon contact form submission error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid form data. Please check your inputs.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});