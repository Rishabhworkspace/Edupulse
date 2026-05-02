import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';

export default function MockPaymentPopup({ isOpen, onClose, amount, courseTitle, onSuccess }) {
  const [step, setStep] = useState('form'); // form, processing, success, failed
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv || !name) {
      setError('Please fill all fields');
      return;
    }
    if (cardNumber.length < 16) {
      setError('Invalid card number');
      return;
    }
    setError('');
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2500);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Secure Payment</h3>
                    <p className="text-xs text-white/60">Powered by EduPulse</p>
                  </div>
                </div>
                <button onClick={onClose} className="text-white/60 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'form' && (
                <>
                  <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-600">Course</span>
                      <span className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{courseTitle}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Amount to pay</span>
                      <span className="text-xl font-bold text-primary">₹{amount}</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1.5 block">Cardholder Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs font-medium text-slate-600 mb-1.5 block">Card Number</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          <span className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></span>
                          <span className="w-8 h-5 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded"></span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1.5 block">Expiry Date</label>
                        <input 
                          type="text" 
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1.5 block">CVV</label>
                        <input 
                          type="password" 
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-4">
                      <Lock className="w-4 h-4" />
                      <span>Your payment is secured with 256-bit SSL encryption</span>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-primary to-[#e87652] hover:from-[#e87652] hover:to-primary text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/25"
                    >
                      Pay ₹{amount}
                    </button>
                  </form>

                  <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
                    <span>🔒 100% Secure</span>
                    <span>✓ Verified</span>
                  </div>
                </>
              )}

              {step === 'processing' && (
                <div className="py-12 text-center">
                  <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Processing Payment</h3>
                  <p className="text-sm text-slate-500">Please wait while we verify your payment...</p>
                  <div className="mt-6 flex justify-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Successful!</h3>
                  <p className="text-sm text-slate-500">Your enrollment is confirmed</p>
                </div>
              )}

              {step === 'failed' && (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Payment Failed</h3>
                  <p className="text-sm text-slate-500 mb-4">{error}</p>
                  <button 
                    onClick={() => setStep('form')}
                    className="px-6 py-2 bg-primary text-white rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {step === 'form' && (
              <div className="px-6 pb-6">
                <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/64px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6 opacity-50" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/64px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6 opacity-50" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/64px-American_Express_logo_%282018%29.svg.png" alt="Amex" className="h-6 opacity-50" />
                  <span className="text-slate-300">|</span>
                  <span>UPI</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}