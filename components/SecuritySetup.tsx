
import React, { useState, useRef } from 'react';
import { Student } from '../types';

interface SecuritySetupProps {
  user: Student;
  onComplete: (user: Student) => void;
}

const SecuritySetup: React.FC<SecuritySetupProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      if (newPassword.length < 6) return;
      setStep(2);
    } else if (step === 2) {
      if (pin.length !== 4) return;
      setStep(3);
      startCamera();
    } else if (step === 3) {
      setIsProcessing(true);
      setTimeout(() => {
        stopCamera();
        const updatedUser: Student = {
          ...user,
          password: newPassword,
          pin: pin,
          isBiometricEnrolled: true,
          setupComplete: true
        };
        localStorage.setItem(`lasusphere_user_${user.matricNo}`, JSON.stringify(updatedUser));
        onComplete(updatedUser);
      }, 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 transition-colors font-sans">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[30px] sm:rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-fadeIn">
        <div className="p-8 md:p-14">
          <div className="flex justify-between items-center mb-10 md:mb-12">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-black transition-all ${
                  step === s ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 
                  step > s ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'}`}></div>}
              </div>
            ))}
          </div>

          <div className="min-h-[340px] flex flex-col justify-center">
            {step === 1 && (
              <div className="animate-slideUp space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Securing Your Identity</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Please replace your temporary credentials with a permanent password.</p>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-5 py-3 md:px-6 md:py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 font-bold dark:text-white outline-none text-base md:text-lg"
                      placeholder="Min. 6 characters"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-slideUp space-y-6">
                <div className="space-y-2 text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Security PIN</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Set a 4-digit PIN for instant verification and academic sign-offs.</p>
                </div>
                <div className="space-y-6 pt-2">
                  <div className="flex justify-center gap-3 md:gap-4">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className={`w-12 h-14 md:w-14 md:h-16 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-black border-2 transition-all ${
                        pin.length > i ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'border-slate-100 dark:border-slate-800 text-slate-300'
                      }`}>
                        {pin.length > i ? '●' : ''}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto pt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '⌫'].map(num => (
                      <button
                        key={num}
                        onClick={() => {
                          if (num === 'C') setPin('');
                          else if (num === '⌫') setPin(pin.slice(0, -1));
                          else if (pin.length < 4) setPin(pin + num);
                        }}
                        className="h-12 md:h-14 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 font-black text-slate-700 dark:text-white transition-all active:scale-90 text-sm md:text-base"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-slideUp space-y-6 text-center">
                <div className="space-y-2">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Biometric Link</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Finalize your profile by enrolling in our mock biometric identity vault.</p>
                </div>
                <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden border-4 border-indigo-100 dark:border-slate-800 shadow-inner mt-4">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale brightness-110" />
                  <div className="absolute inset-0 border-[15px] md:border-[20px] border-white/10 pointer-events-none"></div>
                  {isProcessing && (
                    <div className="absolute inset-0 bg-indigo-600/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
                      <svg className="animate-spin h-6 w-6 md:h-8 md:w-8 mb-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="font-black uppercase tracking-widest text-[8px] md:text-[10px]">Processing Scan</span>
                    </div>
                  )}
                  <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,1)] animate-scan"></div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-10 md:pt-12">
            <button
              onClick={handleNext}
              disabled={isProcessing || (step === 1 && newPassword.length < 6) || (step === 2 && pin.length !== 4)}
              className="w-full py-4 md:py-5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] text-sm md:text-base"
            >
              {isProcessing ? 'Saving Security Profile...' : step === 3 ? 'Complete Enrollment' : 'Continue'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySetup;
