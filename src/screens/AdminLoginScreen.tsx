import React, { useState } from 'react';
import { AdminRole } from '../types/admin';

export interface AdminAuthSession {
  name: string;
  email: string;
  role: AdminRole;
  hotelAccess: string;
  loginTime: string;
  token: string;
}

interface AdminLoginScreenProps {
  onLoginSuccess: (session: AdminAuthSession) => void;
  onCancel: () => void;
}

const AUTHORIZED_ACCOUNTS = [
  {
    role: 'super_admin' as AdminRole,
    name: 'Siddharth Tagore',
    email: 'admin@stayease.in',
    roleLabel: 'Super Administrator',
    badge: 'Full Access & GST',
    defaultPin: '789012',
    avatar: '👑',
  },
  {
    role: 'hotel_owner' as AdminRole,
    name: 'Vikramaditya Oberoi',
    email: 'gm.mumbai@stayease.in',
    roleLabel: 'General Manager / Hotel Owner',
    badge: 'Taj Lands End Portfolio',
    defaultPin: '456789',
    avatar: '🏨',
  },
  {
    role: 'operations' as AdminRole,
    name: 'Priyanka Sharma',
    email: 'ops.frontdesk@stayease.in',
    roleLabel: 'Front Desk & Operations Lead',
    badge: 'Tape Chart & Folios',
    defaultPin: '123456',
    avatar: '🛎️',
  },
  {
    role: 'support_agent' as AdminRole,
    name: 'Arjun Mehta',
    email: 'support.disputes@stayease.in',
    roleLabel: 'Support & Disputes Agent',
    badge: 'Refunds & Escalations',
    defaultPin: '654321',
    avatar: '🎧',
  },
];

export const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState('admin@stayease.in');
  const [password, setPassword] = useState('StayEase@Enterprise2026');
  const [pin, setPin] = useState('789012');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('super_admin');
  const [rememberTerminal, setRememberTerminal] = useState(true);
  const [requires2FA, setRequires2FA] = useState(true);
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSelectPredefined = (account: typeof AUTHORIZED_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword('StayEase@Enterprise2026');
    setPin(account.defaultPin);
    setSelectedRole(account.role);
    setErrorMessage('');
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your corporate email and password.');
      return;
    }

    if (!email.includes('@stayease') && !email.includes('@taj') && !email.includes('@oberoi') && !email.includes('admin')) {
      setErrorMessage('Access Denied: Only authorized StayEase corporate and partner domains are permitted.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (requires2FA) {
        setStep('2fa');
      } else {
        completeLogin();
      }
    }, 600);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (pin.length < 6) {
      setErrorMessage('Please enter the 6-digit hardware security PIN or authenticator code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      completeLogin();
    }, 700);
  };

  const completeLogin = () => {
    const matched = AUTHORIZED_ACCOUNTS.find(a => a.role === selectedRole) || AUTHORIZED_ACCOUNTS[0];
    const session: AdminAuthSession = {
      name: matched.name,
      email: email,
      role: selectedRole,
      hotelAccess: selectedRole === 'hotel_owner' ? 'taj-lands-end' : 'all',
      loginTime: new Date().toISOString(),
      token: `stayease_sec_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`,
    };

    onLoginSuccess(session);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#f5f5f5] flex flex-col justify-between selection:bg-[#c5a059]/30 selection:text-white font-sans relative overflow-hidden">
      {/* Background Decorative Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c5a059]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-950/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full px-6 md:px-12 py-5 flex items-center justify-between border-b border-[#1f1f1f] bg-[#0c0c0c]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#c5a059]/50 flex items-center justify-center text-[#c5a059]">
            <span className="material-symbols-outlined filled text-[18px]">hotel</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-playfair text-[18px] font-bold text-white tracking-wide">StayEase</span>
              <span className="text-[9px] font-mono uppercase bg-red-950/80 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded tracking-wider">
                Restricted Terminal
              </span>
            </div>
            <span className="text-[11px] text-[#8e8e93]">Enterprise Hospitality Control Portal</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-1.5 text-[12px] text-[#8e8e93] hover:text-[#c5a059] bg-[#141414] border border-[#262626] hover:border-[#c5a059]/40 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Return to Guest Website</span>
        </button>
      </header>

      {/* Center Authentication Container */}
      <main className="relative z-10 flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[540px] bg-[#111111] border border-[#262626] rounded-2xl p-6 md:p-10 shadow-2xl backdrop-blur-xl relative">
          {/* Security Badge Header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#222222]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#333333] flex items-center justify-center text-[#c5a059] shadow-inner">
                <span className="material-symbols-outlined text-[26px]">security</span>
              </div>
              <div>
                <h2 className="font-playfair text-[22px] font-bold text-white">
                  {step === 'credentials' ? 'Administrator Login' : 'Two-Factor Authentication'}
                </h2>
                <p className="text-[12px] text-[#8e8e93]">
                  {step === 'credentials' 
                    ? 'Authorized hotel management & staff personnel only'
                    : 'Enter the verification code from your security token'}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                TLS 1.3 / 256-Bit
              </span>
              <span className="text-[10px] text-[#666] font-mono mt-1">PORTAL ID #4409</span>
            </div>
          </div>

          {/* Quick Demo Staff Credentials Selector */}
          <div className="mb-6 bg-[#161616] border border-[#262626] rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#c5a059] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">badge</span>
                Authorized Personnel Accounts:
              </span>
              <span className="text-[10px] text-[#8e8e93]">Click to autofill</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {AUTHORIZED_ACCOUNTS.map((acc) => {
                const isSelected = selectedRole === acc.role;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleSelectPredefined(acc)}
                    className={`text-left p-2 rounded-lg border text-[11px] transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#222222] border-[#c5a059] text-white shadow-xs'
                        : 'bg-[#121212] border-[#262626] text-[#8e8e93] hover:text-white hover:border-[#3a3a3a]'
                    }`}
                  >
                    <span className="text-[16px]">{acc.avatar}</span>
                    <div className="min-w-0">
                      <div className="font-semibold truncate text-white">{acc.name}</div>
                      <div className="text-[10px] text-[#8e8e93] truncate">{acc.roleLabel.split(' ')[0]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-200 text-[12px] flex items-center gap-2.5 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px] text-rose-400 shrink-0">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Step 1: Corporate Credentials */}
          {step === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1.5">
                  Corporate Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8e8e93]">
                    alternate_email
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@stayease.in"
                    className="w-full bg-[#181818] border border-[#2e2e2e] focus:border-[#c5a059] rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-white placeholder-[#555] outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[12px] font-semibold text-[#a3a3a3] uppercase tracking-wider">
                    Staff Passcode
                  </label>
                  <span className="text-[11px] text-[#8e8e93]">Encrypted</span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8e8e93]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full bg-[#181818] border border-[#2e2e2e] focus:border-[#c5a059] rounded-lg pl-10 pr-10 py-2.5 text-[14px] text-white placeholder-[#555] outline-hidden transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e8e93] hover:text-white cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#a3a3a3] uppercase tracking-wider mb-1.5">
                  Access Role & Scope
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#c5a059]">
                    admin_panel_settings
                  </span>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
                    className="w-full bg-[#181818] border border-[#2e2e2e] focus:border-[#c5a059] rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-white outline-hidden cursor-pointer"
                  >
                    <option value="super_admin">Platform Super Administrator (Pan-India)</option>
                    <option value="hotel_owner">General Manager / Hotel Owner (Taj / Oberoi)</option>
                    <option value="operations">Operations & Front Desk Supervisor</option>
                    <option value="support_agent">Support & Instant Refunds Desk</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px] pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-[#8e8e93] hover:text-white">
                  <input
                    type="checkbox"
                    checked={rememberTerminal}
                    onChange={(e) => setRememberTerminal(e.target.checked)}
                    className="rounded bg-[#181818] border-[#333] text-[#c5a059] focus:ring-[#c5a059] accent-[#c5a059]"
                  />
                  <span>Authorize this secure hardware device</span>
                </label>
                <button
                  type="button"
                  onClick={() => setRequires2FA(!requires2FA)}
                  className="text-[#c5a059] hover:underline cursor-pointer text-[11px]"
                >
                  {requires2FA ? '2FA: Mandatory' : '2FA: Optional'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#c5a059] hover:bg-[#dfba73] text-black font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl text-[13px] transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    <span>Authenticating with StayEase Gateway...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">key</span>
                    <span>Verify Credentials & Proceed</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Two-Factor PIN Verification */}
          {step === '2fa' && (
            <form onSubmit={handle2FASubmit} className="space-y-5 animate-in fade-in duration-200">
              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-full bg-[#1c1c1c] border border-[#c5a059]/50 flex items-center justify-center mx-auto text-[#c5a059] mb-3">
                  <span className="material-symbols-outlined text-[28px]">phonelink_lock</span>
                </div>
                <h3 className="text-[16px] font-bold text-white">Security Verification</h3>
                <p className="text-[12px] text-[#8e8e93] mt-1">
                  Enter the 6-digit PIN for <span className="text-[#c5a059] font-mono">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-center text-[#8e8e93] uppercase tracking-wider mb-2">
                  Enter 6-Digit Authenticator PIN / OTP
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="789012"
                    className="w-48 bg-[#181818] border-2 border-[#c5a059] text-center font-mono text-[24px] tracking-[0.4em] text-white py-2 rounded-xl outline-hidden focus:ring-2 focus:ring-[#c5a059]/40"
                  />
                </div>
              </div>

              <div className="bg-[#181818] border border-[#262626] rounded-lg p-3 text-[11px] text-[#8e8e93] text-center">
                <span>Default verification code for demo evaluation: </span>
                <span className="text-[#c5a059] font-mono font-bold">
                  {AUTHORIZED_ACCOUNTS.find(a => a.role === selectedRole)?.defaultPin || '789012'}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="w-1/3 bg-[#181818] hover:bg-[#222222] text-[#8e8e93] hover:text-white border border-[#2e2e2e] font-semibold py-3 rounded-xl text-[12px] transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 bg-[#c5a059] hover:bg-[#dfba73] text-black font-bold uppercase tracking-wider py-3 rounded-xl text-[12px] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      <span>Opening Console...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">login</span>
                      <span>Unlock Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Security Notice Footer */}
          <div className="mt-8 pt-4 border-t border-[#202020] text-center">
            <p className="text-[11px] text-[#666666] leading-relaxed">
              Strictly prohibited for unauthorized users. All actions, IP addresses, and state transactions are cryptographically logged under StayEase Hospitality Security Compliance.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Bottom */}
      <footer className="relative z-10 w-full px-6 py-4 border-t border-[#181818] text-center text-[#555] text-[11px] flex flex-col sm:flex-row items-center justify-between max-w-5xl mx-auto">
        <span>© 2026 StayEase Hospitality Systems Inc. • Private Internal Network</span>
        <span className="text-[#8e8e93] flex items-center gap-1 mt-1 sm:mt-0">
          <span className="material-symbols-outlined text-[13px] text-[#c5a059]">lock</span>
          ISO 27001 & PCI-DSS Level 1 Certified
        </span>
      </footer>
    </div>
  );
};
