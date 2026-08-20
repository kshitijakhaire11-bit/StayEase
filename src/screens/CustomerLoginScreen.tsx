import React, { useState, useEffect, useRef } from 'react';
import { Hotel, Screen } from '../types';

export interface CustomerUser {
  name: string;
  email: string;
  phone: string;
  tier: string;
  avatar?: string;
  isRegistered?: boolean;
}

interface CustomerLoginScreenProps {
  onLoginSuccess: (user: CustomerUser) => void;
  onCancel: () => void;
  previousScreen?: Screen;
  searchContext?: {
    destination: string;
    dates: string;
    guests: string;
    hotel?: Hotel;
  };
}

type AuthMode = 
  | 'login' 
  | 'otp_verify' 
  | 'register' 
  | 'forgot_step1' 
  | 'forgot_step2' 
  | 'forgot_step3' 
  | 'success';

type LoginTab = 'mobile' | 'email';

const INDIAN_LANGUAGES = [
  'English (India)',
  'हिन्दी (Hindi)',
  'मराठी (Marathi)',
  'বাংলা (Bengali)',
  'தமிழ் (Tamil)',
  'తెలుగు (Telugu)',
  'ગુજરાતી (Gujarati)',
  'ಕನ್ನಡ (Kannada)',
  'മലയാളം (Malayalam)',
];

export const CustomerLoginScreen: React.FC<CustomerLoginScreenProps> = ({
  onLoginSuccess,
  onCancel,
  previousScreen = 'home',
  searchContext,
}) => {
  // Navigation & Mode
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loginTab, setLoginTab] = useState<LoginTab>('mobile');

  // Input states for Login
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useEmailOtp, setUseEmailOtp] = useState(false);

  // OTP Verification state
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCountdown, setResendCountdown] = useState(29);
  const [isOtpTimerActive, setIsOtpTimerActive] = useState(false);
  const [otpTargetDisplay, setOtpTargetDisplay] = useState('');
  const [otpFailedAttempts, setOtpFailedAttempts] = useState(0);

  // Registration states
  const [regFullName, setRegFullName] = useState('Kshitija Khaire');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regLanguage, setRegLanguage] = useState('English (India)');
  const [regAgreedTerms, setRegAgreedTerms] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Forgot Password states
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Errors & Loading
  const [errorMessage, setErrorMessage] = useState('');
  const [inlineMobileError, setInlineMobileError] = useState('');
  const [inlineEmailError, setInlineEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successUser, setSuccessUser] = useState<CustomerUser | null>(null);
  const [showEdgeCaseHelper, setShowEdgeCaseHelper] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if (isOtpTimerActive && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0) {
      setIsOtpTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isOtpTimerActive, resendCountdown]);

  // Mobile Validation helper
  const cleanMobile = (val: string) => val.replace(/\D/g, '').slice(0, 10);
  const isIndianMobileValid = (num: string) => {
    const cleaned = cleanMobile(num);
    return cleaned.length === 10 && /^[6-9]/.test(cleaned);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = cleanMobile(raw);
    setMobileNumber(cleaned);
    setErrorMessage('');

    if (cleaned.length === 0) {
      setInlineMobileError('');
    } else if (cleaned.length > 0 && !/^[6-9]/.test(cleaned)) {
      setInlineMobileError('Indian mobile numbers must start with 6, 7, 8, or 9');
    } else if (cleaned.length < 10) {
      setInlineMobileError('Please enter a 10-digit mobile number');
    } else {
      setInlineMobileError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setErrorMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val.length === 0) {
      setInlineEmailError('');
    } else if (!emailRegex.test(val)) {
      setInlineEmailError('Please enter a valid email address (e.g. name@domain.com)');
    } else {
      setInlineEmailError('');
    }
  };

  // Trigger OTP sending
  const startOtpFlow = (target: string, isFromForgot = false) => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      setOtpValues(['', '', '', '', '', '']);
      setOtpTargetDisplay(target);
      setResendCountdown(29);
      setIsOtpTimerActive(true);
      setOtpFailedAttempts(0);
      setAuthMode(isFromForgot ? 'forgot_step2' : 'otp_verify');

      // Autofocus first box
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }, 600);
  };

  // OTP input handler
  const handleOtpBoxChange = (index: number, val: string) => {
    setErrorMessage('');
    const char = val.replace(/\D/g, '').slice(-1);
    const newArr = [...otpValues];
    newArr[index] = char;
    setOtpValues(newArr);

    // If typed a digit, jump to next box
    if (char && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newArr = [...otpValues];
      for (let i = 0; i < 6; i++) {
        newArr[i] = pasted[i] || '';
      }
      setOtpValues(newArr);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputsRef.current[nextFocus]?.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendCountdown > 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setResendCountdown(29);
      setIsOtpTimerActive(true);
      setOtpValues(['', '', '', '', '', '']);
      otpInputsRef.current[0]?.focus();
      setErrorMessage('');
    }, 500);
  };

  // Auto-fill test demo OTP
  const handleAutoFillDemoOtp = (valid = true) => {
    if (valid) {
      setOtpValues(['4', '8', '2', '9', '1', '0']);
    } else {
      setOtpValues(['0', '0', '0', '0', '0', '0']);
    }
  };

  // Verify OTP submission
  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpValues.join('');
    
    if (fullCode.length < 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    // Check expired condition
    if (resendCountdown === 0 && !isOtpTimerActive && fullCode === '999999') {
      setErrorMessage('This code has expired. Request a new OTP.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsLoading(false);
      if (fullCode === '000000') {
        const nextAttempts = otpFailedAttempts + 1;
        setOtpFailedAttempts(nextAttempts);
        if (nextAttempts >= 3) {
          setErrorMessage('Too many failed attempts. Please wait 2 minutes before requesting a new OTP.');
        } else {
          setErrorMessage('The verification code is incorrect. Please try again.');
        }
        return;
      }

      // Success
      completeCustomerAuth({
        name: 'Kshitija Khaire',
        email: email || 'kshitijakhaire11@gmail.com',
        phone: mobileNumber ? `+91 ${mobileNumber}` : '+91 98765 43210',
        tier: 'StayEase Gold Member',
        avatar: '👩‍💼',
      });
    }, 700);
  };

  // Email + Password or Email OTP submit
  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (inlineEmailError) {
      setErrorMessage(inlineEmailError);
      return;
    }

    if (useEmailOtp) {
      startOtpFlow(email);
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password === 'wrong') {
      setErrorMessage('The password you entered is incorrect. Please try again.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      completeCustomerAuth({
        name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()) || 'Kshitija Khaire',
        email: email,
        phone: '+91 98201 54321',
        tier: 'StayEase Elite Privilege',
        avatar: '✨',
      });
    }, 700);
  };

  // Mobile Submit
  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isIndianMobileValid(mobileNumber)) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    startOtpFlow(`+91 ${mobileNumber}`);
  };

  // Social Login handler
  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    setIsLoading(true);
    setErrorMessage('');
    setTimeout(() => {
      setIsLoading(false);
      completeCustomerAuth({
        name: provider === 'Google' ? 'Kshitija Khaire' : 'Kshitija K.',
        email: provider === 'Google' ? 'kshitijakhaire11@gmail.com' : 'kshitija.apple@icloud.com',
        phone: '+91 98765 43210',
        tier: 'StayEase Gold Member',
        avatar: provider === 'Google' ? '🌐' : '🍏',
      });
    }, 800);
  };

  // Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regFullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!isIndianMobileValid(regMobile)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (regPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!regAgreedTerms) {
      setErrorMessage('Please accept the Terms & Conditions and Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      completeCustomerAuth({
        name: regFullName,
        email: regEmail,
        phone: `+91 ${regMobile}`,
        tier: 'StayEase Welcome Member (5% Off)',
        avatar: '🎉',
        isRegistered: true,
      });
    }, 800);
  };

  // Forgot Password Steps
  const handleForgotStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setErrorMessage('Please enter your registered mobile number or email address.');
      return;
    }
    startOtpFlow(forgotIdentifier, true);
  };

  const handleForgotStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpValues.join('');
    if (fullCode.length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthMode('forgot_step3');
    }, 600);
  };

  const handleForgotStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthMode('login');
      setErrorMessage('');
      alert('Password reset successfully. You can now sign in to StayEase.');
    }, 700);
  };

  // Complete customer authentication & trigger success state with context preservation
  const completeCustomerAuth = (user: CustomerUser) => {
    setSuccessUser(user);
    setAuthMode('success');
    
    setTimeout(() => {
      onLoginSuccess(user);
    }, 1600);
  };

  // Password strength checker helper
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-[#333]' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
  };

  const pwdStrength = getPasswordStrength(authMode === 'register' ? regPassword : newPassword);

  return (
    <div className="min-h-screen bg-[#070707] text-[#f5f5f5] flex flex-col justify-between selection:bg-[#c5a059]/30 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#181818_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-amber-950/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 w-full px-6 md:px-12 py-4 flex items-center justify-between border-b border-[#1c1c1c] bg-[#0c0c0c]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] shadow-xs">
            <span className="material-symbols-outlined filled text-[18px]">hotel</span>
          </div>
          <div>
            <span className="font-playfair text-[20px] font-bold text-white tracking-wide">StayEase</span>
            <span className="text-[10px] text-[#c5a059] font-mono ml-2 uppercase tracking-wider hidden sm:inline">India</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowEdgeCaseHelper(!showEdgeCaseHelper)}
            className="text-[11px] text-[#8e8e93] hover:text-[#c5a059] bg-[#141414] border border-[#262626] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Toggle interactive error states and validation helper"
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            <span className="hidden sm:inline">Validation Helper</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 text-[12px] font-medium text-[#8e8e93] hover:text-white bg-[#141414] hover:bg-[#1f1f1f] border border-[#262626] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
            <span>Return to Stays</span>
          </button>
        </div>
      </header>

      {/* Edge Case & Error Simulation Toolbar */}
      {showEdgeCaseHelper && (
        <div className="relative z-20 bg-[#121212] border-b border-[#262626] px-6 py-2.5 text-[12px] flex flex-wrap items-center gap-2 text-[#8e8e93]">
          <span className="font-bold text-[#c5a059] flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">bug_report</span> Quick Test Scenarios:
          </span>
          <button
            onClick={() => { setMobileNumber('9876543210'); setInlineMobileError(''); setErrorMessage(''); }}
            className="bg-[#1c1c1c] hover:bg-[#252525] text-white px-2.5 py-1 rounded border border-[#333] cursor-pointer"
          >
            Valid Indian Mobile (98765 43210)
          </button>
          <button
            onClick={() => { setMobileNumber('12345'); setInlineMobileError('Indian mobile numbers must start with 6, 7, 8, or 9'); }}
            className="bg-[#1c1c1c] hover:bg-[#252525] text-rose-300 px-2.5 py-1 rounded border border-[#333] cursor-pointer"
          >
            Invalid Mobile Error
          </button>
          <button
            onClick={() => { setEmail('kshitijakhaire11@gmail.com'); setInlineEmailError(''); }}
            className="bg-[#1c1c1c] hover:bg-[#252525] text-white px-2.5 py-1 rounded border border-[#333] cursor-pointer"
          >
            Valid Email
          </button>
          <button
            onClick={() => setErrorMessage('The password you entered is incorrect. Please try again.')}
            className="bg-[#1c1c1c] hover:bg-[#252525] text-rose-300 px-2.5 py-1 rounded border border-[#333] cursor-pointer"
          >
            Incorrect Password
          </button>
          <button
            onClick={() => setErrorMessage('Account temporarily locked for security. Please reset password or contact support.')}
            className="bg-[#1c1c1c] hover:bg-[#252525] text-amber-300 px-2.5 py-1 rounded border border-[#333] cursor-pointer"
          >
            Locked Account Error
          </button>
          <button
            onClick={() => setErrorMessage('Something went wrong due to a network timeout. Please try again.')}
            className="bg-[#1c1c1c] hover:bg-[#252525] text-rose-300 px-2.5 py-1 rounded border border-[#333] cursor-pointer"
          >
            Network Timeout
          </button>
        </div>
      )}

      {/* Main Split-Screen Container */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-[#262626] bg-[#111111] shadow-2xl min-h-[620px]">
          
          {/* LEFT SIDE — Travel Experience Banner (Visible on lg screens) */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 bg-cover bg-center overflow-hidden"
               style={{
                 backgroundImage: `linear-gradient(180deg, rgba(7,7,7,0.5) 0%, rgba(7,7,7,0.85) 60%, #0c0c0c 100%), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80')`
               }}>
            
            {/* Top Tagline */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#0c0c0c]/80 border border-[#c5a059]/40 px-3.5 py-1.5 rounded-full mb-4 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-[#c5a059]">India-First Luxury Booking</span>
              </div>
              <h2 className="font-playfair text-[32px] font-bold text-white leading-tight tracking-tight">
                Find your perfect stay with StayEase
              </h2>
              <p className="text-[14px] text-[#cfcfcf] mt-3 leading-relaxed">
                “Search, compare, and book comfortable stays with transparent pricing and secure booking.”
              </p>
            </div>

            {/* Highlights Grid */}
            <div className="relative z-10 space-y-3 my-8">
              <div className="flex items-center gap-3 bg-[#141414]/90 border border-[#2a2a2a] p-3 rounded-xl backdrop-blur-md transition-all hover:border-[#c5a059]/40">
                <div className="w-9 h-9 rounded-lg bg-[#1e1e1e] flex items-center justify-center text-[18px]">
                  🏨
                </div>
                <div>
                  <div className="text-[13px] font-bold text-white">Verified stays</div>
                  <div className="text-[11px] text-[#999]">Every property hand-inspected for luxury standards</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#141414]/90 border border-[#2a2a2a] p-3 rounded-xl backdrop-blur-md transition-all hover:border-[#c5a059]/40">
                <div className="w-9 h-9 rounded-lg bg-[#1e1e1e] flex items-center justify-center text-[18px]">
                  🔒
                </div>
                <div>
                  <div className="text-[13px] font-bold text-white">Secure payments</div>
                  <div className="text-[11px] text-[#999]">UPI, NetBanking & Cards with 256-bit encryption</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#141414]/90 border border-[#2a2a2a] p-3 rounded-xl backdrop-blur-md transition-all hover:border-[#c5a059]/40">
                <div className="w-9 h-9 rounded-lg bg-[#1e1e1e] flex items-center justify-center text-[18px]">
                  ⭐
                </div>
                <div>
                  <div className="text-[13px] font-bold text-white">Trusted reviews</div>
                  <div className="text-[11px] text-[#999]">100% verified guest ratings with real photos</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#141414]/90 border border-[#2a2a2a] p-3 rounded-xl backdrop-blur-md transition-all hover:border-[#c5a059]/40">
                <div className="w-9 h-9 rounded-lg bg-[#1e1e1e] flex items-center justify-center text-[18px]">
                  📍
                </div>
                <div>
                  <div className="text-[13px] font-bold text-white">Hotels across India</div>
                  <div className="text-[11px] text-[#999]">Mumbai, Jaipur, Goa, Kerala, Udaipur & Bengaluru</div>
                </div>
              </div>
            </div>

            {/* Bottom Loyalty Badge */}
            <div className="relative z-10 pt-4 border-t border-[#333]/50 flex items-center justify-between text-[12px] text-[#aaa]">
              <span className="flex items-center gap-1.5 text-[#c5a059] font-medium">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Over 120,000+ Happy Guests
              </span>
              <span className="font-mono text-[11px]">GST Compliant</span>
            </div>
          </div>

          {/* RIGHT SIDE — Authentication Card & Interactive Forms */}
          <div className="lg:col-span-7 p-6 sm:p-10 md:p-12 flex flex-col justify-between bg-[#111111] relative">
            
            {/* Global Error Banner */}
            {errorMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-[13px] flex items-center gap-3 animate-in fade-in duration-200 shadow-md">
                <span className="material-symbols-outlined text-[20px] text-rose-400 shrink-0">error</span>
                <span className="flex-1">{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage('')}
                  className="text-rose-400 hover:text-white p-0.5"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}

            {/* 1. SUCCESS STATE WITH CONTEXT PRESERVATION */}
            {authMode === 'success' && successUser && (
              <div className="my-auto py-8 text-center animate-in zoom-in-95 fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-lg shadow-emerald-950/50">
                  <span className="material-symbols-outlined text-[36px]">check_circle</span>
                </div>
                <h3 className="font-playfair text-[28px] font-bold text-white">
                  Welcome back, {successUser.name.split(' ')[0]}!
                </h3>
                <p className="text-[14px] text-[#8e8e93] mt-2">
                  Authenticated as <strong className="text-white">{successUser.email}</strong> • <span className="text-[#c5a059]">{successUser.tier}</span>
                </p>

                {/* Preserved Search & Booking Context Card */}
                {searchContext && (
                  <div className="mt-6 p-4 rounded-xl bg-[#181818] border border-[#2a2a2a] text-left max-w-md mx-auto">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#c5a059] mb-2 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">travel_explore</span>
                      Active Travel Context Restored
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      <div>
                        <span className="text-[#737373]">Destination:</span>
                        <div className="font-medium text-white">{searchContext.destination}</div>
                      </div>
                      <div>
                        <span className="text-[#737373]">Dates:</span>
                        <div className="font-medium text-white">{searchContext.dates || 'Selected dates'}</div>
                      </div>
                      <div>
                        <span className="text-[#737373]">Guests:</span>
                        <div className="font-medium text-white">{searchContext.guests || '2 Guests, 1 Room'}</div>
                      </div>
                      {searchContext.hotel && (
                        <div>
                          <span className="text-[#737373]">Selected Hotel:</span>
                          <div className="font-medium text-white truncate">{searchContext.hotel.name}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-center gap-2 text-[13px] text-[#8e8e93]">
                  <span className="material-symbols-outlined animate-spin text-[18px] text-[#c5a059]">progress_activity</span>
                  <span>Redirecting you back to your journey...</span>
                </div>
              </div>
            )}

            {/* 2. REGULAR LOGIN FLOW (Mobile vs Email) */}
            {authMode === 'login' && (
              <div>
                {/* Header Title */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-md bg-[#181818] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
                      <span className="material-symbols-outlined text-[16px]">key</span>
                    </div>
                    <span className="text-[12px] font-bold tracking-widest text-[#c5a059] uppercase">StayEase Member Login</span>
                  </div>
                  <h1 className="font-playfair text-[26px] sm:text-[28px] font-bold text-white">
                    Welcome back to StayEase
                  </h1>
                  <p className="text-[13px] sm:text-[14px] text-[#8e8e93] mt-1">
                    Sign in to manage your bookings and discover your next stay.
                  </p>
                </div>

                {/* Segmented Selector: Mobile Number | Email */}
                <div className="flex bg-[#181818] p-1 rounded-xl mb-6 border border-[#2a2a2a]">
                  <button
                    type="button"
                    onClick={() => { setLoginTab('mobile'); setErrorMessage(''); }}
                    className={`flex-1 py-2.5 text-[13px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      loginTab === 'mobile'
                        ? 'bg-[#c5a059] text-black shadow-md font-bold'
                        : 'text-[#8e8e93] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">smartphone</span>
                    <span>Mobile Number</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginTab('email'); setErrorMessage(''); }}
                    className={`flex-1 py-2.5 text-[13px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      loginTab === 'email'
                        ? 'bg-[#c5a059] text-black shadow-md font-bold'
                        : 'text-[#8e8e93] hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    <span>Email Address</span>
                  </button>
                </div>

                {/* TAB A: Mobile Number Login */}
                {loginTab === 'mobile' && (
                  <form onSubmit={handleMobileSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1.5">
                        Mobile Number
                      </label>
                      <div className="flex gap-2">
                        {/* Country selector */}
                        <div className="flex items-center gap-1.5 bg-[#181818] border border-[#333] px-3 py-2.5 rounded-xl text-[14px] font-mono text-white shrink-0">
                          <span className="text-[18px]">🇮🇳</span>
                          <span className="font-semibold">+91</span>
                        </div>

                        {/* Input */}
                        <div className="relative flex-1">
                          <input
                            type="tel"
                            maxLength={10}
                            autoFocus
                            value={mobileNumber}
                            onChange={handleMobileChange}
                            placeholder="Enter 10-digit mobile number (e.g. 98765 43210)"
                            className={`w-full bg-[#181818] border ${
                              inlineMobileError ? 'border-rose-500' : 'border-[#333] focus:border-[#c5a059]'
                            } text-white pl-4 pr-10 py-2.5 rounded-xl text-[15px] font-mono outline-hidden transition-colors placeholder-[#555]`}
                          />
                          {mobileNumber && (
                            <button
                              type="button"
                              onClick={() => { setMobileNumber(''); setInlineMobileError(''); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                            >
                              <span className="material-symbols-outlined text-[16px]">cancel</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inline Error or Hint */}
                      {inlineMobileError ? (
                        <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 animate-in fade-in">
                          <span className="material-symbols-outlined text-[14px]">error</span>
                          {inlineMobileError}
                        </p>
                      ) : (
                        <p className="text-[11px] text-[#737373] mt-1.5">
                          We will send a 6-digit OTP to verify your Indian mobile number.
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!isIndianMobileValid(mobileNumber) || isLoading}
                      className="w-full bg-[#c5a059] hover:bg-[#dfba73] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold uppercase tracking-wider py-3.5 rounded-xl text-[13px] transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                          <span>Sending One-Time Passcode...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue with Mobile</span>
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* TAB B: Email Login (Password or Email OTP) */}
                {loginTab === 'email' && (
                  <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#737373]">
                          mail
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="Enter your email address (e.g. guest@example.com)"
                          className={`w-full bg-[#181818] border ${
                            inlineEmailError ? 'border-rose-500' : 'border-[#333] focus:border-[#c5a059]'
                          } text-white pl-10 pr-4 py-2.5 rounded-xl text-[14px] outline-hidden transition-colors placeholder-[#555]`}
                        />
                      </div>
                      {inlineEmailError && (
                        <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">error</span>
                          {inlineEmailError}
                        </p>
                      )}
                    </div>

                    {!useEmailOtp ? (
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-[12px] font-semibold text-[#a3a3a3] uppercase tracking-wider">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => { setAuthMode('forgot_step1'); setForgotIdentifier(email); setErrorMessage(''); }}
                            className="text-[11px] text-[#c5a059] hover:underline cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-[#737373]">
                            lock
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full bg-[#181818] border border-[#333] focus:border-[#c5a059] text-white pl-10 pr-10 py-2.5 rounded-xl text-[14px] outline-hidden transition-colors placeholder-[#555]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#181818] border border-[#2a2a2a] rounded-xl text-[12px] text-[#8e8e93]">
                        An instant 6-digit login OTP will be sent to your email address.
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[12px] pt-1">
                      <button
                        type="button"
                        onClick={() => setUseEmailOtp(!useEmailOtp)}
                        className="text-[#c5a059] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {useEmailOtp ? 'key' : 'pin'}
                        </span>
                        <span>{useEmailOtp ? 'Use Password instead' : 'Sign in with OTP'}</span>
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !email.trim() || !!inlineEmailError}
                      className="w-full bg-[#c5a059] hover:bg-[#dfba73] disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold uppercase tracking-wider py-3.5 rounded-xl text-[13px] transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <span>{useEmailOtp ? 'Continue with Email' : 'Sign In'}</span>
                      )}
                    </button>
                  </form>
                )}

                {/* 5. SOCIAL LOGIN SECTION */}
                <div className="mt-8">
                  <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-[#262626] w-full" />
                    <span className="bg-[#111111] px-4 text-[11px] font-bold uppercase tracking-widest text-[#737373]">
                      OR CONTINUE WITH
                    </span>
                    <div className="border-t border-[#262626] w-full" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('Google')}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2.5 bg-[#181818] hover:bg-[#202020] text-white border border-[#2e2e2e] hover:border-[#444] py-2.5 px-4 rounded-xl text-[13px] font-medium transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z" />
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" />
                        <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-6.1z" />
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin('Apple')}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2.5 bg-[#181818] hover:bg-[#202020] text-white border border-[#2e2e2e] hover:border-[#444] py-2.5 px-4 rounded-xl text-[13px] font-medium transition-all cursor-pointer shadow-xs active:scale-98"
                    >
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.43-5.74-8.7-10.22-18.7-13.43-30.01-3.21-11.31-4.82-22.38-4.82-33.22 0-14.1 3.59-25.75 10.77-34.95 7.18-9.2 16.27-13.9 27.27-14.1 4.58 0 9.77 1.18 15.58 3.55 5.81 2.37 9.5 3.63 11.08 3.79 1.25-.16 5.16-1.52 11.73-4.08 6.57-2.56 12.04-3.69 16.42-3.39 12.35.66 22.06 5.11 29.13 13.35-10.66 6.45-15.89 15.35-15.69 26.7.2 9.06 3.64 16.71 10.33 22.95 6.69 6.24 14.64 9.71 23.86 10.42-2.14 6.33-4.63 12.44-7.46 18.33zM119.22 33.56c0-6.72 2.45-13.2 7.35-19.44 4.9-6.24 11.05-10.59 18.45-13.06-.82 6.72-3.4 13.1-7.75 19.14-4.35 6.04-10.39 10.49-18.05 13.36z" />
                      </svg>
                      <span>Continue with Apple</span>
                    </button>
                  </div>
                </div>

                {/* 6. NEW CUSTOMER REGISTRATION ENTRY */}
                <div className="mt-8 pt-4 border-t border-[#222] text-center">
                  <span className="text-[13px] text-[#8e8e93]">
                    New to StayEase?{' '}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
                    className="text-[13px] font-bold text-[#c5a059] hover:underline cursor-pointer ml-1"
                  >
                    Create an account
                  </button>
                </div>
              </div>
            )}

            {/* 3. OTP AUTHENTICATION SCREEN */}
            {authMode === 'otp_verify' && (
              <div className="animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="inline-flex items-center gap-1.5 text-[12px] text-[#8e8e93] hover:text-[#c5a059] mb-4 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to login</span>
                </button>

                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#1c1c1c] border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] mx-auto mb-3 shadow-inner">
                    <span className="material-symbols-outlined text-[28px]">phonelink_ring</span>
                  </div>
                  <h2 className="font-playfair text-[24px] font-bold text-white">
                    Verify your mobile number
                  </h2>
                  <p className="text-[13px] text-[#8e8e93] mt-1.5">
                    We've sent a 6-digit verification code to{' '}
                    <strong className="text-white font-mono">{otpTargetDisplay || `+91 ${mobileNumber}`}</strong>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
                  {/* 6 OTP Input Boxes */}
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-13 sm:w-13 sm:h-15 bg-[#181818] border-2 border-[#333] focus:border-[#c5a059] rounded-xl text-center font-mono text-[22px] sm:text-[24px] font-bold text-white outline-hidden focus:ring-2 focus:ring-[#c5a059]/30 transition-all"
                      />
                    ))}
                  </div>

                  {/* Resend OTP & Countdown */}
                  <div className="flex items-center justify-between text-[12px] px-1">
                    <div className="text-[#8e8e93]">
                      {isOtpTimerActive ? (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#c5a059]">schedule</span>
                          Resend in <strong className="text-white font-mono">00:{resendCountdown.toString().padStart(2, '0')}</strong>
                        </span>
                      ) : (
                        <span>Didn't receive the code?</span>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isOtpTimerActive}
                      onClick={handleResendOtp}
                      className="text-[#c5a059] hover:underline font-semibold disabled:opacity-40 disabled:no-underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  </div>

                  {/* Simulated Auto-Detection Bar */}
                  <div className="bg-[#161616] border border-[#262626] rounded-xl p-3 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-[#8e8e93]">
                      <span className="material-symbols-outlined text-[16px] text-emerald-400">sms</span>
                      <span>WebOTP Auto-detection ready:</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAutoFillDemoOtp(true)}
                      className="text-[#c5a059] bg-[#222] hover:bg-[#2a2a2a] px-2.5 py-1 rounded border border-[#3a3a3a] font-mono font-bold cursor-pointer"
                    >
                      Auto-fill: 482910
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#c5a059] hover:bg-[#dfba73] disabled:opacity-50 text-black font-bold uppercase tracking-wider py-3.5 rounded-xl text-[13px] transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                          <span>Verifying OTP...</span>
                        </>
                      ) : (
                        <span>Verify & Continue</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                      className="w-full text-center text-[12px] text-[#8e8e93] hover:text-white transition-colors cursor-pointer py-1"
                    >
                      Change Mobile Number
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 6. REGISTRATION FLOW */}
            {authMode === 'register' && (
              <div className="animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="inline-flex items-center gap-1.5 text-[12px] text-[#8e8e93] hover:text-[#c5a059] mb-3 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Sign In</span>
                </button>

                <div className="mb-4">
                  <h2 className="font-playfair text-[24px] font-bold text-white">
                    Create your StayEase Account
                  </h2>
                  <p className="text-[12px] text-[#8e8e93] mt-1">
                    Join India's premier hospitality club and unlock 5% member tariffs.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[440px] overflow-y-auto pr-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="Enter your full name (e.g. Kshitija Khaire)"
                      className="w-full bg-[#181818] border border-[#333] focus:border-[#c5a059] text-white px-3.5 py-2 rounded-xl text-[13px] outline-hidden placeholder-[#555]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1">
                        Mobile Number
                      </label>
                      <div className="flex">
                        <span className="bg-[#202020] border border-r-0 border-[#333] px-2.5 py-2 rounded-l-xl text-[13px] font-mono text-white flex items-center gap-1">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          value={regMobile}
                          onChange={(e) => setRegMobile(cleanMobile(e.target.value))}
                          placeholder="98765 43210"
                          className="w-full bg-[#181818] border border-[#333] focus:border-[#c5a059] text-white px-3 py-2 rounded-r-xl text-[13px] font-mono outline-hidden placeholder-[#555]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="kshitija@example.com"
                        className="w-full bg-[#181818] border border-[#333] focus:border-[#c5a059] text-white px-3.5 py-2 rounded-xl text-[13px] outline-hidden placeholder-[#555]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Create a password"
                          className="w-full bg-[#181818] border border-[#333] focus:border-[#c5a059] text-white pl-3 pr-8 py-2 rounded-xl text-[13px] outline-hidden placeholder-[#555]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {showRegPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showRegConfirmPassword ? 'text' : 'password'}
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full bg-[#181818] border border-[#333] focus:border-[#c5a059] text-white pl-3 pr-8 py-2 rounded-xl text-[13px] outline-hidden placeholder-[#555]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {showRegConfirmPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {regPassword && (
                    <div className="bg-[#181818] p-2.5 rounded-lg border border-[#282828] text-[11px]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#8e8e93]">Password Strength:</span>
                        <span className="font-bold text-white">{pwdStrength.label}</span>
                      </div>
                      <div className="w-full bg-[#2a2a2a] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${pwdStrength.color} transition-all duration-300`}
                          style={{ width: `${(pwdStrength.score / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1">
                        Date of Birth <span className="text-[#666] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="date"
                        value={regDob}
                        onChange={(e) => setRegDob(e.target.value)}
                        className="w-full bg-[#181818] border border-[#333] focus:border-[#c5a059] text-white px-3 py-2 rounded-xl text-[13px] outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1">
                        Preferred Language <span className="text-[#666] font-normal">(Optional)</span>
                      </label>
                      <select
                        value={regLanguage}
                        onChange={(e) => setRegLanguage(e.target.value)}
                        className="w-full bg-[#181818] border border-[#333] focus:border-[#c5a059] text-white px-3 py-2 rounded-xl text-[13px] outline-hidden cursor-pointer"
                      >
                        {INDIAN_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-2 pt-1 text-[12px] text-[#8e8e93] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regAgreedTerms}
                      onChange={(e) => setRegAgreedTerms(e.target.checked)}
                      className="mt-0.5 rounded bg-[#181818] border-[#444] text-[#c5a059] focus:ring-[#c5a059] accent-[#c5a059]"
                    />
                    <span>
                      I agree to the <a href="#terms" className="text-[#c5a059] hover:underline">Terms & Conditions</a> and <a href="#privacy" className="text-[#c5a059] hover:underline">Privacy Policy</a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#c5a059] hover:bg-[#dfba73] text-black font-bold uppercase tracking-wider py-3 rounded-xl text-[13px] transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[12px] text-[#8e8e93]">Already have an account? </span>
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-[12px] font-bold text-[#c5a059] hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 7. FORGOT PASSWORD FLOW (Step 1, 2, 3) */}
            {authMode === 'forgot_step1' && (
              <div className="animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="inline-flex items-center gap-1.5 text-[12px] text-[#8e8e93] hover:text-[#c5a059] mb-4 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Back to Sign In</span>
                </button>

                <div className="mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#c5a059]">Account Recovery • Step 1 of 3</span>
                  <h2 className="font-playfair text-[24px] font-bold text-white mt-1">
                    Reset your password
                  </h2>
                  <p className="text-[13px] text-[#8e8e93] mt-1">
                    Enter your registered mobile number or email address to receive an account verification code.
                  </p>
                </div>

                <form onSubmit={handleForgotStep1Submit} className="space-y-4">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1.5">
                      Mobile number or email
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="Enter mobile (e.g. 9876543210) or email"
                      className="w-full bg-[#181818] border border-[#333] focus:border-[#c5a059] text-white px-4 py-2.5 rounded-xl text-[14px] outline-hidden placeholder-[#555]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#c5a059] hover:bg-[#dfba73] text-black font-bold uppercase tracking-wider py-3.5 rounded-xl text-[13px] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                        <span>Finding Account...</span>
                      </>
                    ) : (
                      <span>Continue</span>
                    )}
                  </button>
                </form>
              </div>
            )}

            {authMode === 'forgot_step2' && (
              <div className="animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot_step1')}
                  className="inline-flex items-center gap-1.5 text-[12px] text-[#8e8e93] hover:text-[#c5a059] mb-4 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Change Contact</span>
                </button>

                <div className="mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#c5a059]">Account Recovery • Step 2 of 3</span>
                  <h2 className="font-playfair text-[24px] font-bold text-white mt-1">
                    Verify your account
                  </h2>
                  <p className="text-[13px] text-[#8e8e93] mt-1">
                    Enter the 6-digit security code sent to <strong className="text-white font-mono">{otpTargetDisplay}</strong>
                  </p>
                </div>

                <form onSubmit={handleForgotStep2Submit} className="space-y-5">
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-11 h-13 sm:w-13 sm:h-15 bg-[#181818] border-2 border-[#333] focus:border-[#c5a059] rounded-xl text-center font-mono text-[22px] font-bold text-white outline-hidden"
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-[#8e8e93]">
                      Resend in <strong className="text-white font-mono">00:{resendCountdown.toString().padStart(2, '0')}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAutoFillDemoOtp(true)}
                      className="text-[#c5a059] font-mono text-[11px] underline"
                    >
                      Autofill 482910
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#c5a059] hover:bg-[#dfba73] text-black font-bold uppercase tracking-wider py-3.5 rounded-xl text-[13px] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Verify Code</span>
                  </button>
                </form>
              </div>
            )}

            {authMode === 'forgot_step3' && (
              <div className="animate-in fade-in duration-200">
                <div className="mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#c5a059]">Account Recovery • Step 3 of 3</span>
                  <h2 className="font-playfair text-[24px] font-bold text-white mt-1">
                    Create a new password
                  </h2>
                  <p className="text-[13px] text-[#8e8e93] mt-1">
                    Choose a strong, unique password for your StayEase account.
                  </p>
                </div>

                <form onSubmit={handleForgotStep3Submit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full bg-[#181818] border border-[#333] focus:border-[#c5a059] text-white px-3.5 py-2.5 rounded-xl text-[14px] outline-hidden placeholder-[#555]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showNewPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        required
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        className="w-full bg-[#181818] border border-[#333] focus:border-[#c5a059] text-white px-3.5 py-2.5 rounded-xl text-[14px] outline-hidden placeholder-[#555]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737373] hover:text-white"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showConfirmNewPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Requirements Checklist */}
                  <div className="bg-[#181818] p-3 rounded-xl border border-[#282828] text-[12px] space-y-1.5">
                    <div className="text-[11px] font-bold text-[#8e8e93] uppercase">Password requirements:</div>
                    <div className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? 'text-emerald-400' : 'text-[#737373]'}`}>
                      <span className="material-symbols-outlined text-[15px]">
                        {newPassword.length >= 8 ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>Minimum 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'text-emerald-400' : 'text-[#737373]'}`}>
                      <span className="material-symbols-outlined text-[15px]">
                        {/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>At least one uppercase and lowercase letter</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${/\d/.test(newPassword) ? 'text-emerald-400' : 'text-[#737373]'}`}>
                      <span className="material-symbols-outlined text-[15px]">
                        {/\d/.test(newPassword) ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>At least one number</span>
                    </div>
                    <div className={`flex items-center gap-1.5 ${newPassword && !newPassword.includes('123456') ? 'text-emerald-400' : 'text-[#737373]'}`}>
                      <span className="material-symbols-outlined text-[15px]">
                        {newPassword && !newPassword.includes('123456') ? 'check_circle' : 'radio_button_unchecked'}
                      </span>
                      <span>Avoid commonly used passwords</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || newPassword.length < 8 || newPassword !== confirmNewPassword}
                    className="w-full bg-[#c5a059] hover:bg-[#dfba73] disabled:opacity-40 text-black font-bold uppercase tracking-wider py-3.5 rounded-xl text-[13px] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Update Password & Sign In</span>
                  </button>
                </form>
              </div>
            )}

            {/* Bottom Security Footer */}
            <div className="mt-8 pt-4 border-t border-[#1c1c1c] text-center text-[#555] text-[11px] flex items-center justify-between">
              <span>Encrypted with TLS 1.3</span>
              <span className="flex items-center gap-1 text-[#8e8e93]">
                <span className="material-symbols-outlined text-[13px] text-[#c5a059]">lock</span>
                PCI-DSS Level 1 Compliant
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 w-full px-6 py-4 border-t border-[#181818] text-center text-[#666] text-[12px] flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
        <span>© 2026 StayEase Luxury Hospitality India • Customer Privileges</span>
        <div className="flex gap-4 mt-2 sm:mt-0 text-[#8e8e93]">
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Help Desk</span>
        </div>
      </footer>
    </div>
  );
};
