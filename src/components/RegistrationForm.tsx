import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, Search, Phone, ArrowLeft } from 'lucide-react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    contactNumber: '',
    email: '',
    storeAddress: '',
    pinCode: '',
    productType: '',
    bankAccountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    aadhaarNumber: '',
    panNumber: '',
    employeeReferral: '',
    agreeToTerms: false
  });

  const [files, setFiles] = useState({
    gstCertificate: null,
    fssaiLicense: null,
    agreement: null,
    aadhaarCard: null,
    panCard: null
  });

  const [bankSuggestions, setBankSuggestions] = useState<string[]>([]);
  const [showBankSuggestions, setShowBankSuggestions] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [fileType]: file }));
    }
  };

  // Bank suggestions data
  const bankData = [
    { name: 'State Bank of India', code: 'SBIN' },
    { name: 'HDFC Bank', code: 'HDFC' },
    { name: 'ICICI Bank', code: 'ICIC' },
    { name: 'Punjab National Bank', code: 'PUNB' },
    { name: 'Bank of Baroda', code: 'BARB' },
    { name: 'Canara Bank', code: 'CNRB' },
    { name: 'Union Bank of India', code: 'UBIN' },
    { name: 'Axis Bank', code: 'UTIB' },
    { name: 'Bank of India', code: 'BKID' },
    { name: 'Central Bank of India', code: 'CBIN' },
    { name: 'Indian Bank', code: 'IDIB' },
    { name: 'Kotak Mahindra Bank', code: 'KKBK' },
    { name: 'Yes Bank', code: 'YESB' },
    { name: 'IDBI Bank', code: 'IBKL' },
    { name: 'Federal Bank', code: 'FINO' },
    { name: 'Karnataka Bank', code: 'KARB' },
    { name: 'South Indian Bank', code: 'SIBL' },
    { name: 'Tamilnad Mercantile Bank', code: 'TMBL' },
    { name: 'Karur Vysya Bank', code: 'KVBL' },
    { name: 'City Union Bank', code: 'CIUB' }
  ];

  const handleBankSearch = (searchTerm: string) => {
    if (searchTerm.length >= 3) {
      const filtered = bankData.filter(bank => 
        bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setBankSuggestions(filtered.map(bank => `${bank.name} (${bank.code})`));
      setShowBankSuggestions(true);
    } else {
      setBankSuggestions([]);
      setShowBankSuggestions(false);
    }
  };

  const selectBankSuggestion = (suggestion: string) => {
    const bankName = suggestion.split(' (')[0];
    setFormData(prev => ({ ...prev, accountHolderName: bankName }));
    setShowBankSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.bank-suggestions-container')) {
        setShowBankSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // OTP Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Focus first OTP input when modal opens
  useEffect(() => {
    if (showOtpVerification) {
      setTimeout(() => {
        const firstInput = document.getElementById('otp-0') as HTMLInputElement | null;
        if (firstInput) firstInput.focus();
      }, 0);
    }
  }, [showOtpVerification]);

  // Generate OTP
  const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Send OTP
  const sendOTP = async () => {
    if (formData.contactNumber.length === 10) {
      try {
        const response = await fetch('http://localhost:3001/api/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: formData.contactNumber })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setOtpSent(true);
          setOtpTimer(30);
          setIsResendDisabled(true);
          setShowOtpVerification(true);
          
          // Show success message without revealing OTP
          alert(`OTP sent to ${formData.contactNumber}. Please check your SMS.`);
        } else {
          alert(data.message || 'Failed to send OTP');
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please check your internet connection.');
      }
    } else {
      alert('Please enter a valid 10-digit mobile number');
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Verify OTP
  const verifyOTP = async () => {
    const enteredOTP = otp.join('');
    if (enteredOTP.length === 4) {
      try {
        const response = await fetch('http://localhost:3001/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            phoneNumber: formData.contactNumber,
            otp: enteredOTP
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setShowOtpVerification(false);
          setOtpSent(false);
          setOtp(['', '', '', '']);
          setMobileVerified(true);
          alert('Mobile number verified successfully!');
        } else {
          alert(data.message || 'Invalid OTP');
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        alert('Failed to verify OTP. Please try again.');
      }
    } else {
      alert('Please enter complete 4-digit OTP');
    }
  };

  // Resend OTP
  const resendOTP = async () => {
    if (!isResendDisabled) {
      await sendOTP();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if mobile number is verified
    if (!mobileVerified) {
      alert('Please verify your mobile number before submitting the form.');
      return;
    }
    
    // Check if agreement is uploaded
    if (!files.agreement) {
      alert('Please upload the agreement document. It is mandatory.');
      return;
    }
    
    // Submit to backend
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, String(value));
    });
    if (files.gstCertificate) form.append('gstCertificate', files.gstCertificate as File);
    if (files.fssaiLicense) form.append('fssaiLicense', files.fssaiLicense as File);
    if (files.agreement) form.append('agreement', files.agreement as File);
    if (files.aadhaarCard) form.append('aadhaarCard', files.aadhaarCard as File);
    if (files.panCard) form.append('panCard', files.panCard as File);

    fetch('http://localhost:3001/api/registrations', {
      method: 'POST',
      body: form,
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to save registration');
        }
        alert('Registration submitted successfully! We will contact you within 24-48 hours.');
      })
      .catch((err) => {
        console.error('Submit error:', err);
        alert(err.message || 'Submission failed. Please try again.');
      });
  };

  return (
    <section id="register" className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vendor Registration
          </h2>
          <p className="text-xl text-gray-600">
            Join our network and start earning from traffic-stuck commuters today!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter your business name"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Owner Name *
              </label>
              <input
                type="text"
                name="ownerName"
                required
                value={formData.ownerName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter owner's full name"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Number *
              </label>
              <div className="flex space-x-2">
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors duration-200 ${
                    mobileVerified 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 focus:border-orange-500'
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  disabled={mobileVerified}
                />
                {!mobileVerified ? (
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={formData.contactNumber.length !== 10}
                    className="px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="hidden sm:inline">Send OTP</span>
                  </button>
                ) : (
                  <div className="px-4 py-3 bg-green-500 text-white rounded-xl flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Verified</span>
                  </div>
                )}
              </div>
              {otpSent && !mobileVerified && (
                <div className="mt-2 text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  OTP sent! Check your mobile for verification code.
                </div>
              )}
              {mobileVerified && (
                <div className="mt-2 text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mobile number verified successfully! ✓
                </div>
              )}
            </div>

            
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter your email address"
              />
            </div>


            {/* Pin Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pin Code *
              </label>
              <input
                type="text"
                name="pinCode"
                required
                value={formData.pinCode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter 6-digit pin code"
              />
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type of Products *
              </label>
              <select
                name="productType"
                required
                value={formData.productType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
              >
                <option value="">Select product type</option>
                <option value="all">All Types</option>
                <option value="snacks">Snacks</option>
                <option value="groceries">Groceries</option>
                <option value="beverages">Beverages</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* Aadhaar Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Aadhaar Number *
              </label>
              <input
                type="text"
                name="aadhaarNumber"
                required
                value={formData.aadhaarNumber}
                onChange={handleInputChange}
                maxLength={12}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter 12-digit Aadhaar number"
              />
            </div>

            {/* PAN Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PAN Number *
              </label>
              <input
                type="text"
                name="panNumber"
                required
                value={formData.panNumber}
                onChange={handleInputChange}
                maxLength={10}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200 uppercase"
                placeholder="Enter 10-character PAN"
              />
            </div>

            {/* Employee Referral (optional) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Traffic Frnd Employee Referral (optional)
              </label>
              <input
                type="text"
                name="employeeReferral"
                value={formData.employeeReferral}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                placeholder="Enter employee name or ID who referred you"
              />
            </div>
          </div>

          {/* Store Address */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Store Address *
            </label>
            <textarea
              name="storeAddress"
              required
              value={formData.storeAddress}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
              placeholder="Enter complete store address"
            />
          </div>

          {/* File Uploads */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Upload</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GST Certificate */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GST Certificate
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors duration-200">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'gstCertificate')}
                    className="hidden"
                    id="gst-upload"
                  />
                  <label
                    htmlFor="gst-upload"
                    className="cursor-pointer text-orange-500 hover:text-orange-600 font-medium"
                  >
                    {files.gstCertificate ? files.gstCertificate.name : 'Upload GST Certificate'}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>

              {/* FSSAI License */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  FSSAI License
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors duration-200">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'fssaiLicense')}
                    className="hidden"
                    id="fssai-upload"
                  />
                  <label
                    htmlFor="fssai-upload"
                    className="cursor-pointer text-orange-500 hover:text-orange-600 font-medium"
                  >
                    {files.fssaiLicense ? files.fssaiLicense.name : 'Upload FSSAI License'}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>
              {/* Aadhaar Card */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Aadhaar Card
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors duration-200">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'aadhaarCard')}
                    className="hidden"
                    id="aadhaar-upload"
                  />
                  <label
                    htmlFor="aadhaar-upload"
                    className="cursor-pointer text-orange-500 hover:text-orange-600 font-medium"
                  >
                    {files.aadhaarCard ? (files.aadhaarCard as File).name : 'Upload Aadhaar Card'}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>

              {/* PAN Card */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PAN Card
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors duration-200">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'panCard')}
                    className="hidden"
                    id="pan-upload"
                  />
                  <label
                    htmlFor="pan-upload"
                    className="cursor-pointer text-orange-500 hover:text-orange-600 font-medium"
                  >
                    {files.panCard ? (files.panCard as File).name : 'Upload PAN Card'}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement Upload - Mandatory */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agreement Document *</h3>
            <div className="border-2 border-dashed border-orange-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors duration-200 bg-orange-50">
              <Upload className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'agreement')}
                className="hidden"
                id="agreement-upload"
                required
              />
              <label
                htmlFor="agreement-upload"
                className="cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
              >
                {files.agreement ? files.agreement.name : 'Upload Agreement Document'}
              </label>
              <p className="text-xs text-orange-600 mt-1 font-medium">PDF, JPG, PNG (Max 5MB) - Required</p>
              {files.agreement && (
                <div className="mt-2 flex items-center justify-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm">Agreement uploaded successfully!</span>
                </div>
              )}
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative bank-suggestions-container">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Holder Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="accountHolderName"
                    required
                    value={formData.accountHolderName}
                    onChange={(e) => {
                      handleInputChange(e);
                      handleBankSearch(e.target.value);
                    }}
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                    placeholder="Start typing bank name (min 3 characters)"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
                
                {/* Bank Suggestions Dropdown */}
                {showBankSuggestions && bankSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border-2 border-orange-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {bankSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => selectBankSuggestion(suggestion)}
                        className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                      >
                        <div className="font-medium text-gray-900">{suggestion.split(' (')[0]}</div>
                        <div className="text-sm text-gray-500">{suggestion.split('(')[1].replace(')', '')}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bank Account Number *
                </label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  required
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                  placeholder="Enter account number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  required
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-200"
                  placeholder="Enter IFSC code"
                />
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                required
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 h-5 w-5 text-orange-500 focus:ring-orange-500 border-2 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                I agree to Traffic Frnd's{' '}
                <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                  Vendor Terms & Conditions
                </a>
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Submit Registration</span>
          </button>
        </form>
      </div>

      {/* OTP Verification Modal */}
      {showOtpVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setShowOtpVerification(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-bold text-gray-900">Verify Mobile Number</h3>
                <div className="w-5"></div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Enter the 4-digit code sent to
                </p>
                <p className="font-semibold text-gray-900">
                  +91 {formData.contactNumber}
                </p>
              </div>

              {/* OTP Input Fields */}
              <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-200"
                    placeholder=""
                  />
                ))}
              </div>

              {/* Timer and Resend */}
              <div className="mb-6">
                {otpTimer > 0 ? (
                  <p className="text-sm text-gray-500">
                    Resend OTP in {otpTimer} seconds
                  </p>
                ) : (
                  <button
                    onClick={resendOTP}
                    className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={verifyOTP}
                disabled={otp.join('').length !== 4}
                className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white px-6 py-3 rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300"
              >
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RegistrationForm;