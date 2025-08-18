# Traffic Frnd Backend - Twilio OTP Integration

This backend server provides OTP verification functionality using Twilio SMS API for the Traffic Frnd vendor registration form.

## Features

- ✅ Send OTP via Twilio SMS
- ✅ Verify OTP with expiry (5 minutes)
- ✅ Demo mode when Twilio not configured
- ✅ CORS enabled for frontend integration
- ✅ Health check endpoint
- ✅ Error handling and validation

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Twilio Account Setup

1. **Sign up** at [twilio.com](https://twilio.com)
2. **Get free trial** (includes $15-20 credit)
3. **Get credentials** from Twilio Console:
   - Go to [Console](https://console.twilio.com/)
   - Copy your **Account SID**
   - Copy your **Auth Token**
   - Get a **Phone Number** (free with trial)

### 3. Environment Configuration

1. **Copy environment file**:
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file** with your Twilio credentials:
   ```env
   TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+1234567890
   PORT=3001
   NODE_ENV=development
   OTP_EXPIRY_MINUTES=5
   ```

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Send OTP
```
POST /api/send-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "demoOtp": "1234" // Only in development mode
}
```

### Verify OTP
```
POST /api/verify-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "otp": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

### Health Check
```
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "twilioConfigured": true
}
```

## Demo Mode

If Twilio credentials are not configured, the server runs in demo mode:
- OTPs are generated but not sent via SMS
- OTP is returned in the response for testing
- All other functionality works normally

## Frontend Integration

Update your React form to use these endpoints:

```javascript
// Send OTP
const sendOTP = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: formData.contactNumber })
    });
    
    const data = await response.json();
    if (data.success) {
      // Show OTP modal
      setShowOtpVerification(true);
      if (data.demoOtp) {
        alert(`Demo OTP: ${data.demoOtp}`);
      }
    }
  } catch (error) {
    alert('Failed to send OTP');
  }
};

// Verify OTP
const verifyOTP = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phoneNumber: formData.contactNumber,
        otp: otp.join('')
      })
    });
    
    const data = await response.json();
    if (data.success) {
      alert('Mobile number verified successfully!');
      setShowOtpVerification(false);
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Failed to verify OTP');
  }
};
```

## Troubleshooting

### Common Issues:

1. **CORS Error**: Make sure the server is running on port 3001
2. **Twilio Error**: Check your credentials and phone number format
3. **OTP Not Received**: Check Twilio console for delivery status
4. **Server Not Starting**: Check if port 3001 is available

### Twilio Console:
- Monitor SMS delivery at [Twilio Console](https://console.twilio.com/)
- Check logs for any delivery failures
- Verify phone number is in correct format (+91XXXXXXXXXX)

## Production Deployment

For production:
1. Use environment variables for all sensitive data
2. Implement rate limiting
3. Use Redis or database for OTP storage
4. Add proper logging and monitoring
5. Set up SSL/TLS certificates
6. Configure proper CORS origins

## Support

For Twilio support:
- [Twilio Documentation](https://www.twilio.com/docs)
- [Twilio Support](https://support.twilio.com/)
- [Twilio Community](https://community.twilio.com/) 