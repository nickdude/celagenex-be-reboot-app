import { useEffect, useState } from 'react';
import { ArrowLeft, CreditCard } from 'lucide-react';

const AtomPayment = () => {
  const [txnId, setTxnId] = useState('');
  const [token, setToken] = useState('');
  const [merchId, setMerchId] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // 1. Load AtomPaynetz script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://pgtest.atomtech.in/staticdata/ots/js/atomcheckout.js?v=${Date.now()}`;
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => console.error('Failed to load AtomPaynetz script');
    document.body.appendChild(script);
  }, []);

  // 2. Fetch token info from backend
  useEffect(() => {
    fetch('http://192.168.1.23:3000', { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        setTxnId(data.txnId);
        setToken(data.token);
        setMerchId(data.merchId);
      })
      .catch(err => console.error('Error fetching token:', err));
  }, []);

  // 3. Open Atom payment
  const openPay = () => {
    const options = {
      atomTokenId: token,
      merchId: merchId,
      custEmail: 'test.user@gmail.com',
      custMobile: '8888888888',
      returnUrl: 'http://192.168.1.23:3000/Response'
    };

    if (window.AtomPaynetz) {
      new window.AtomPaynetz(options, 'uat');
    } else {
      console.error('AtomPaynetz script not loaded');
    }
  };

  return (
    // <div className="container my-5">
    //   <h3>Merchant Shop</h3>
    //   <p>Transaction Id: {txnId}</p>
    //   <p>Atom Token Id: {token}</p>
    //   <p>Pay Rs. 1</p>
    //   <button
    //     className="btn btn-primary"
    //     onClick={openPay}
    //     disabled={!scriptLoaded || !token || !merchId}
    //   >
    //     {scriptLoaded ? 'Pay Now' : 'Loading...'}
    //   </button>
    // </div>

    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Payment Gateway</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="text-center">
        <CreditCard className="w-12 h-12 text-[#F7941C] mx-auto mb-4" />
        <p className="text-gray-700 mb-4">Redirecting to secure payment gateway...</p>
        <p>
          Your Transaction is being processed... with ID {txnId}
        </p>
        <p className="text-sm text-gray-500">Amount: ₹1</p>
          <button
            onClick={openPay}
        disabled={!scriptLoaded || !token || !merchId}
            className="mt-4 bg-[#F7941C] text-white px-4 py-2 rounded-lg text-sm"
          >
             {scriptLoaded ? 'Pay Now' : 'Loading...'}
          </button>
      </div>
    </div>
  </div>
  );
};

export default AtomPayment;
