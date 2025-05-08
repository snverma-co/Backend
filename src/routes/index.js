import express from 'express';
import iconContactRouter from './iconContact.js';

const router = express.Router();

// Mount the icon contact form routes
router.use('/api', iconContactRouter);

export default router;