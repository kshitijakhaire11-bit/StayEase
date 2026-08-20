import React, { useState } from 'react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; email: string; tier: string }) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('+91 98201 54321');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: 'Aarav Singhania',
        email: email || 'aarav.singhania@gmail.com',
        tier: 'StayEase Black Tier Member',
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8e8e93] hover:text-white p-1 rounded-lg hover:bg-[#222] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#1c1c1c] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] mx-auto mb-3">
            <span className="material-symbols-outlined filled text-[24px]">hotel</span>
          </div>
          <h3 className="font-playfair text-[24px] font-bold text-white">
            StayEase Privileges
          </h3>
          <p className="text-[13px] text-[#8e8e93] mt-1">
            Sign in to unlock exclusive member tariffs, suite upgrades & complimentary breakfast.
          </p>
        </div>

        {/* Auth Mode Switch */}
        <div className="flex bg-[#1c1c1c] p-1 rounded-xl mb-6 border border-[#262626]">
          <button
            type="button"
            onClick={() => { setAuthMethod('phone'); setStep('input'); }}
            className={`flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all cursor-pointer ${
              authMethod === 'phone'
                ? 'bg-[#c5a059] text-black shadow-xs'
                : 'text-[#8e8e93] hover:text-white'
            }`}
          >
            Mobile OTP (+91)
          </button>
          <button
            type="button"
            onClick={() => { setAuthMethod('email'); setStep('input'); }}
            className={`flex-1 py-2 text-[12px] font-semibold rounded-lg transition-all cursor-pointer ${
              authMethod === 'email'
                ? 'bg-[#c5a059] text-black shadow-xs'
                : 'text-[#8e8e93] hover:text-white'
            }`}
          >
            Email Login
          </button>
        </div>

        {step === 'input' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {authMethod === 'phone' ? (
              <div>
                <label className="block text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8e8e93]">
                    smartphone
                  </span>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98201 54321"
                    className="w-full bg-[#1c1c1c] border border-[#333] focus:border-[#c5a059] text-white pl-10 pr-4 py-2.5 rounded-lg text-[14px] font-mono outline-hidden"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-semibold text-[#8e8e93] uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8e8e93]">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full bg-[#1c1c1c] border border-[#333] focus:border-[#c5a059] text-white pl-10 pr-4 py-2.5 rounded-lg text-[14px] outline-hidden"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#c5a059] hover:bg-[#dfba73] text-black font-bold uppercase tracking-wider py-3 rounded-xl text-[13px] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <span>Send One-Time Passcode</span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-200">
            <div className="text-center mb-2">
              <span className="text-[12px] text-[#8e8e93]">
                Enter 4-digit code sent to <strong className="text-white">{phoneNumber}</strong>
              </span>
            </div>

            <div className="flex justify-center">
              <input
                type="text"
                maxLength={4}
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="4829"
                className="w-36 bg-[#1c1c1c] border-2 border-[#c5a059] text-center font-mono text-[22px] tracking-[0.3em] text-white py-2 rounded-xl outline-hidden"
              />
            </div>

            <p className="text-[11px] text-[#8e8e93] text-center">
              Demo OTP code: <span className="text-[#c5a059] font-bold">4829</span>
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#c5a059] hover:bg-[#dfba73] text-black font-bold uppercase tracking-wider py-3 rounded-xl text-[13px] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              ) : (
                <span>Verify & Access Privileges</span>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="text-[11px] text-[#8e8e93] hover:text-white underline cursor-pointer"
              >
                Change mobile number
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#222] text-center">
          <p className="text-[11px] text-[#737373]">
            By continuing, you agree to StayEase Luxury Loyalty Membership Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
