import { useState } from "react";
import axios from "axios";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new pass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`${API_URL}/api/auth/admin/request-otp`, { email });
      setStep(2);
      setSuccess("OTP sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`${API_URL}/api/auth/admin/verify-otp`, { email, otp });
      setStep(3);
      setSuccess("OTP verified. Please enter your new password.");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set new password
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    try {
      await axios.post(`${API_URL}/api/auth/admin/reset-password`, { email, otp, newPassword });
      setSuccess("Password updated! You can now log in.");
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Forgot Password</h1>
        {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="p-3 mb-4 bg-green-100 text-green-700 rounded">{success}</div>}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold">Admin Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border px-4 py-2 rounded" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 rounded font-bold">{isLoading ? "Sending..." : "Send OTP"}</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold">Enter OTP</label>
              <input type="text" value={otp} onChange={e => setOtp(e.target.value)} required className="w-full border px-4 py-2 rounded" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 rounded font-bold">{isLoading ? "Verifying..." : "Verify OTP"}</button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleSetPassword} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold">New Password</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full border px-4 py-2 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full border px-4 py-2 rounded" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 rounded font-bold">{isLoading ? "Updating..." : "Update Password"}</button>
          </form>
        )}
        {step === 4 && (
          <div className="text-center">
            <p className="mb-4 text-green-700 font-semibold">Password updated successfully!</p>
            <Link href="/auth/login" className="text-indigo-600 font-bold">Back to Login</Link>
          </div>
        )}
        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm text-gray-600 hover:text-indigo-600">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
