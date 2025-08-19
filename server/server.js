const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure JSON errors return JSON (not HTML)
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON body' });
  }
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON body' });
  }
  next(err);
});

// In-memory storage for OTPs (in production, use Redis or database)
const otpStore = new Map();

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
let twilioClient;
if (accountSid && authToken) {
  const twilio = require('twilio');
  twilioClient = twilio(accountSid, authToken);
} else {
  console.warn('Twilio credentials not found. Using demo mode.');
}

// Email support removed

// Generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { phoneNumber: inputPhone } = req.body;

    // Normalize phone number: remove spaces and optional +91 country code
    const phoneNumber = String(inputPhone || '')
      .replace(/\s+/g, '')
      .replace(/^\+?91/, '');

    // Validate phone number
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + (5 * 60 * 1000); // 5 minutes

    // Store OTP with expiry
    otpStore.set(phoneNumber, {
      otp,
      expiry: expiryTime
    });

    // Send SMS via Twilio
    if (twilioClient) {
      try {
        await twilioClient.messages.create({
          body: `Your Traffic Frnd verification code is: ${otp}. Valid for 5 minutes.`,
          from: twilioPhoneNumber,
          to: `+91${phoneNumber}`
        });

        console.log(`OTP sent to ${phoneNumber}: ${otp}`);
        
        res.json({
          success: true,
          message: 'OTP sent successfully'
        });
      } catch (twilioError) {
        console.error('Twilio error:', twilioError);
        res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again.'
        });
      }
    } else {
      // Demo mode - just log the OTP for development
      console.log(`Demo OTP for ${phoneNumber}: ${otp}`);
      res.json({
        success: true,
        message: 'OTP sent successfully'
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { phoneNumber: inputPhone, otp } = req.body;

    const phoneNumber = String(inputPhone || '')
      .replace(/\s+/g, '')
      .replace(/^\+?91/, '');

    // Validate inputs
    if (!/^\d{10}$/.test(phoneNumber) || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    // Check if OTP exists and is not expired
    const storedData = otpStore.get(phoneNumber);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new OTP.'
      });
    }

    if (Date.now() > storedData.expiry) {
      otpStore.delete(phoneNumber);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      });
    }

    // OTP is valid - remove it from store
    otpStore.delete(phoneNumber);

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Email OTP endpoints removed

// MongoDB connection
if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not set. MongoDB features will be disabled.');
} else {
  const mongoUri = process.env.MONGODB_URI;
  const mongoDb = process.env.MONGODB_DB;
  console.log(`🔌 Connecting to MongoDB URI: ${mongoUri}${mongoDb ? ` (dbName override: ${mongoDb})` : ''}`);
  const connectOptions = {};
  // Prefer full URI; avoid dbName override to prevent case-mismatch issues
  mongoose
    .connect(mongoUri, connectOptions)
    .then(() => console.log('🗄️  MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

// Models
let Registration;
try {
  Registration = require('./models/Registration');
} catch (e) {
  console.error('Failed to load Registration model:', e);
}

// Save registration endpoint
// File storage config
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
// Multer: in-memory storage so we can push to Google Drive
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Google Drive integration removed

// GridFS (optional, stores files in MongoDB)
let gridFsBucket = null;
mongoose.connection.on('connected', () => {
  try {
    gridFsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    console.log('🗂️  GridFS bucket ready');
  } catch (e) {
    console.warn('GridFS init failed:', e.message);
  }
});

app.post('/api/registrations', upload.fields([
  { name: 'gstCertificate', maxCount: 1 },
  { name: 'fssaiLicense', maxCount: 1 },
  { name: 'agreement', maxCount: 1 },
  { name: 'aadhaarCard', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
]), async (req, res) => {
  try {
    if (!Registration) {
      return res.status(500).json({ success: false, message: 'Model not initialized' });
    }
    const {
      businessName,
      ownerName,
      contactNumber,
      email,
      storeAddress,
      pinCode,
      productType,
      bankAccountNumber,
      ifscCode,
      accountHolderName,
      aadhaarNumber,
      panNumber,
      employeeReferral,
      agreeToTerms,
    } = req.body;

    // Basic validation
    if (
      !businessName ||
      !ownerName ||
      !contactNumber || contactNumber.length !== 10 ||
      !email || !String(email).includes('@') ||
      !storeAddress ||
      !pinCode || pinCode.length !== 6 ||
      !productType ||
      !bankAccountNumber ||
      !ifscCode ||
      !accountHolderName ||
      !aadhaarNumber || aadhaarNumber.length < 12 ||
      !panNumber || panNumber.length < 10 ||
      !agreeToTerms
    ) {
      return res.status(400).json({ success: false, message: 'Invalid input' });
    }

    const files = req.files || {};

    // Helper: upload a buffer to Drive or fall back to disk
    const handleFile = async (fileField) => {
      const f = files[fileField]?.[0];
      if (!f) return undefined;
      const safeName = (f.originalname || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
      const meta = {
        originalName: f.originalname,
        mimeType: f.mimetype,
        size: f.size,
      };
      // Priority 1: GridFS (MongoDB) if enabled
      if (process.env.USE_GRIDFS === 'true' && gridFsBucket) {
        const uploadBufferToGridFS = (name, mimeType, buffer) =>
          new Promise((resolve, reject) => {
            try {
              const uploadStream = gridFsBucket.openUploadStream(name, { contentType: mimeType });
              uploadStream.on('finish', () => resolve(uploadStream.id));
              uploadStream.on('error', reject);
              uploadStream.end(Buffer.from(buffer));
            } catch (err) {
              reject(err);
            }
          });
        const fileId = await uploadBufferToGridFS(`${Date.now()}-${safeName}`, f.mimetype, f.buffer);
        const idStr = String(fileId);
        return { ...meta, gridFsFileId: idStr, fileUrl: `/files/${idStr}`, path: undefined };
      }
      // Google Drive upload removed

      // Fallback: write to local disk
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const diskName = `${unique}-${safeName}`;
      const fullPath = path.join(uploadsDir, diskName);
      fs.writeFileSync(fullPath, Buffer.from(f.buffer));
      return { ...meta, path: `/uploads/${diskName}` };
    };
    const doc = await Registration.create({
      businessName,
      ownerName,
      contactNumber,
      email,
      storeAddress,
      pinCode,
      productType,
      bankAccountNumber,
      ifscCode,
      accountHolderName,
      aadhaarNumber,
      panNumber,
      employeeReferral,
      agreeToTerms,
      documents: {
        gstCertificate: await handleFile('gstCertificate'),
        fssaiLicense: await handleFile('fssaiLicense'),
        agreement: await handleFile('agreement'),
        aadhaarCard: await handleFile('aadhaarCard'),
        panCard: await handleFile('panCard'),
      },
    });

    res.json({ success: true, data: { id: doc._id } });
  } catch (error) {
    console.error('Registration save error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Stream file by GridFS id
app.get('/files/:id', async (req, res) => {
  try {
    if (!gridFsBucket) {
      return res.status(503).json({ success: false, message: 'File storage not available' });
    }
    const id = req.params.id;
    const objectId = new mongoose.Types.ObjectId(id);
    const files = await gridFsBucket.find({ _id: objectId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    const file = files[0];
    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    gridFsBucket.openDownloadStream(objectId).pipe(res);
  } catch (error) {
    console.error('File fetch error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Fetch recent registrations (for verification)
app.get('/api/registrations', async (req, res) => {
  try {
    if (!Registration) {
      return res.status(500).json({ success: false, message: 'Model not initialized' });
    }
    const docs = await Registration.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    res.json({ success: true, data: docs });
  } catch (error) {
    console.error('Registration fetch error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Count registrations
app.get('/api/registrations/count', async (req, res) => {
  try {
    if (!Registration) {
      return res.status(500).json({ success: false, message: 'Model not initialized' });
    }
    const count = await Registration.countDocuments();
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('Registration count error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    twilioConfigured: !!twilioClient
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Twilio ${twilioClient ? 'configured' : 'not configured (demo mode)'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
}); 