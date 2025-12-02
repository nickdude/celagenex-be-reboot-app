// NDPS Payment Gateway Configuration
// Replace these values with your actual NDPS credentials

export const NDPS_CONFIG = {
  // Test Environment (UAT)
  test: {
    merchId: "445842",
    password: "Test@123",
    encryptionKey: "A4476C2062FFA58980DC8F79EB6A799E",
    decryptionKey: "75AEF0FA1B94B3C10D4F5B268F757F11",
    responseHashKey: "KEYRESP123657234",
    payMode: "uat"
  },
  
  // Production Environment
  production: {
    merchId: "YOUR_PRODUCTION_MERCHANT_ID",
    password: "YOUR_PRODUCTION_PASSWORD",
    encryptionKey: "YOUR_PRODUCTION_ENCRYPTION_KEY",
    decryptionKey: "YOUR_PRODUCTION_DECRYPTION_KEY",
    responseHashKey: "YOUR_PRODUCTION_RESPONSE_HASH_KEY",
    payMode: "live"
  }
};

// Get current environment
const isProduction = process.env.NODE_ENV === 'production';

// Export current configuration
export const getNDPSConfig = () => {
  return isProduction ? NDPS_CONFIG.production : NDPS_CONFIG.test;
};

// Helper function to validate NDPS configuration
export const validateNDPSConfig = (config) => {
  const requiredFields = [
    'merchId',
    'password', 
    'encryptionKey',
    'decryptionKey',
    'responseHashKey',
    'payMode'
  ];
  
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    console.error('Missing NDPS configuration fields:', missingFields);
    return false;
  }
  
  return true;
}; 