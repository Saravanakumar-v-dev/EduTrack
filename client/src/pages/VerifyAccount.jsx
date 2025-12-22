// src/pages/VerifyAccount.jsx
import React, { useState, useEffect } from 'react';
import authService from '../services/authService'; // ensure path is correct
import { redirectAfterVerification } from '../utils/preloadRoute.js';

export default function VerifyAccount() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Optionally prefill email from query param (if backend redirects user here with ?email=)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const e = params.get('email');
    if (e) setEmail(e);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // call your verify API - adjust function name & payload to match your backend
      const payload = { email, otp };
      const res = await authService.verifyRegistrationOtp(payload);
      // expected: success message or user object; show success & redirect
      setMessage(res?.message || 'Verification successful. Redirecting to login...');
      // Preload login & redirect (helper handles both)
      redirectAfterVerification({ next: '/login' });
    } catch (err) {
      // err may be axios error - extract useful message
      const errMsg = err?.response?.data?.message || err.message || 'Verification failed';
      setMessage(errMsg);
      console.error('VerifyAccount error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', padding: 20, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Account verification</h2>
      <p>Enter the OTP sent to your email to complete verification.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email">Email</label><br />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="otp">OTP</label><br />
          <input
            id="otp"
            type="text"
            required
            value={otp}
            onChange={e => setOtp(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '8px 16px' }}>
          {loading ? 'Verifying...' : 'Verify account'}
        </button>
      </form>

      {message && <div style={{ marginTop: 12, color: message.toLowerCase().includes('success') ? 'green' : 'red' }}>{message}</div>}
    </div>
  );
}
