import React, { useState, useContext } from "react";
import { QRCodeCanvas } from "qrcode.react";
import './PaymentModal.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext'; // Assuming same context as LoginPopup

const PaymentModal = ({ isOpen, onClose, amount, onSuccess }) => {
  if (!isOpen) return null;

  const { url, token } = useContext(StoreContext);
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const upiId = "pravinkumarjha15@okicici";
  const payeeName = "Pravin Kumar Jha";
  const transactionNote = "Order Payment";
  const currency = "INR";

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&tn=${encodeURIComponent(transactionNote)}&am=${amount}&cu=${currency}`;

  const handleFileChange = (event) => {
    setScreenshot(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setError("");
      
      if (!transactionId || !screenshot) {
        setError("Please upload a screenshot and enter the transaction ID.");
        return;
      }

      setIsSubmitting(true);

      // Create form data to upload file
      const formData = new FormData();
      formData.append('transactionId', transactionId);
      formData.append('amount', amount);
      formData.append('screenshot', screenshot);

      // Make API call
      const response = await axios.post(
        `${url}/api/payments/submit`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        if (onSuccess) onSuccess(response.data.payment);
        onClose();
      } else {
        setError(response.data.message || "Payment submission failed");
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='payment-modal'>
      <div className="payment-modal-container">
        <div className="payment-modal-title">
          <h2>Scan & Pay</h2>
          <img onClick={onClose} src={assets.cross_icon} alt="Close" />
        </div>

        <div className="payment-modal-qr-container">
          <QRCodeCanvas value={upiUrl} size={180} />
          <p className="amount-text">Amount: ₹{amount}</p>
        </div>

        <div className="payment-modal-inputs">
          <div className="file-input-container">
            <label htmlFor="payment-screenshot">Upload Payment Screenshot</label>
            <input 
              id="payment-screenshot"
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="file-input" 
            />
          </div>
          <input
            type="text"
            placeholder="Enter Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="text-input"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button 
          onClick={handleSubmit} 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Submit Payment'}
        </button>

        <div className="payment-modal-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the payment terms and conditions.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;