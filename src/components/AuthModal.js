import React, { useState, useEffect } from 'react';
import { X, UserPlus, Key, Upload, UserCheck } from 'lucide-react';
import { registerOrLoginUser } from '../services/userService';

// Base64 converter helper
const convertToBase64 = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
};

export default function AuthModal({ isOpen, onClose, onVerifySuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login states
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginToken, setLoginToken] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Register states
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);


  // Success screen
  const [verifiedUser, setVerifiedUser] = useState(null);

  // Sync state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setLoginToken('');
      setLoginError('');
      setVerifiedUser(null);
      setActiveTab('login');
    }
  }, [isOpen]);

  // Handle avatar file selection preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginName || !loginEmail || !loginToken) return;

    setLoginError('');
    setIsVerifying(true);

    try {
      const response = await registerOrLoginUser(
        loginName.trim(),
        loginEmail.trim(),
        loginToken.trim()
      );
      
      if (response.status === 'success' && response.data?.type === 'token_match') {
        const user = response.data.user;
        setVerifiedUser(user);
        
        // Sync local storage for persistent logged-in state if needed
        localStorage.setItem('wc2026_current_user', JSON.stringify(user));
        
        setTimeout(() => {
          onVerifySuccess(user);
        }, 1500);
      } else {
        setLoginError(response.message || 'Mã Token không chính xác. Vui lòng kiểm tra lại!');
      }
    } catch (err) {
      setLoginError(err.message || 'Xác thực thất bại. Vui lòng kiểm tra thông tin hoặc thử lại!');
    } finally {
      setIsVerifying(false);
    }
  };

  // Register handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerName || !registerEmail) return;

    setIsUploading(true);
    
    let avatarUrl = '';
    try {
      if (avatarFile) {
        avatarUrl = await convertToBase64(avatarFile);
      } else {
        // Default initial placeholder avatar
        avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(registerName)}`;
      }

      // Call the register service (sending name, email, and avatar)
      const response = await registerOrLoginUser(
        registerName.trim(),
        registerEmail.trim(),
        undefined, // Undefined token triggers registration & token email sending
        avatarUrl
      );

      if (response.status === 'success' && response.data?.type === 'registered') {
        // Pre-fill the login fields for the user
        setLoginName(registerName);
        setLoginEmail(registerEmail);
        setLoginToken('');
        
        // Reset register fields
        setRegisterName('');
        setRegisterEmail('');
        setAvatarFile(null);
        setAvatarPreview(null);
        
        // Automatically switch to login tab
        setActiveTab('login');
        
        alert(`Đăng ký thành công! Token xác thực đã được gửi tới email ${registerEmail.trim()}.\nHãy copy mã token đó và dán vào phần đăng nhập.`);
      } else {
        alert(response.message || 'Đăng ký thất bại. Vui lòng thử lại!');
      }
    } catch (err) {
      alert(err.message || 'Đăng ký thất bại. Email có thể đã tồn tại hoặc có lỗi kết nối!');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={verifiedUser ? undefined : onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-stone-50 rounded-3xl shadow-2xl overflow-hidden z-10 animate-slide-in border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-[#2d382e] text-white border-b border-stone-800">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-[#c29b38]" />
            <span className="text-sm font-bold font-display uppercase tracking-wider">Xác Thực Tài Khoản</span>
          </div>
          {!verifiedUser && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Success Screen */}
        {verifiedUser ? (
          <div className="p-8 text-center space-y-5 animate-fade-in bg-white">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200/30 animate-bounce">
              <UserCheck className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-stone-950 font-display">Xác Thực Thành Công!</h4>
              <p className="text-sm text-stone-500 font-medium">
                Chào mừng <span className="text-[#2d382e] font-bold">{verifiedUser.name}</span>. Bạn đã được mở khóa quyền bình chọn các trận đấu!
              </p>
            </div>
          </div>
        ) : (
          /* Normal Flow tabs */
          <div className="flex flex-col">
            {/* Tabs Header */}
            <div className="flex border-b border-stone-200 bg-white">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setLoginError('');
                }}
                className={`flex-1 py-3 text-sm font-bold font-display border-b-2 transition-all ${
                  activeTab === 'login'
                    ? 'border-[#2d382e] text-[#2d382e] bg-stone-50/50'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                Xác thực bằng Token
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setLoginError('');
                }}
                className={`flex-1 py-3 text-sm font-bold font-display border-b-2 transition-all ${
                  activeTab === 'register'
                    ? 'border-[#2d382e] text-[#2d382e] bg-stone-50/50'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                Đăng ký mới
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6">
              
              {/* TAB 1: LOGIN / PASS TOKEN */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider pl-0.5">
                      Họ và tên tài khoản
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập họ tên đăng ký của bạn"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      required
                      className="w-full px-4 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] font-semibold text-stone-850 placeholder-stone-400"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider pl-0.5">
                      Địa chỉ Email đăng ký
                    </label>
                    <input
                      type="email"
                      placeholder="vi_du@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] font-semibold text-stone-850 placeholder-stone-400"
                    />
                  </div>

                  {/* Token Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider pl-0.5">
                      Mã Token xác thực (WC2026-XXXXXX)
                    </label>
                    <input
                      type="text"
                      placeholder="Dán mã token được gửi qua email"
                      value={loginToken}
                      onChange={(e) => setLoginToken(e.target.value)}
                      required
                      className="w-full px-4 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] font-bold text-stone-800 placeholder-stone-400"
                    />
                  </div>

                  {/* Error Indicator */}
                  {loginError && (
                    <p className="text-xs font-bold text-red-500 bg-red-50 border border-red-200/50 p-2.5 rounded-xl text-center">
                      {loginError}
                    </p>
                  )}

                  {/* Hint warning */}
                  <p className="text-[10px] text-stone-400 leading-relaxed text-center font-medium">
                    * Token xác thực được cấp một lần duy nhất và tồn tại vĩnh viễn giúp bạn đăng nhập bất cứ khi nào.
                  </p>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-2.5 px-4 bg-[#2d382e] text-[#c29b38] hover:bg-[#1f2720] disabled:bg-stone-200 disabled:text-stone-400 font-bold rounded-2xl shadow transition-colors font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-850 rounded-full animate-spin"></div>
                        <span>Đang xác thực...</span>
                      </>
                    ) : (
                      <span>Xác nhận đăng nhập</span>
                    )}
                  </button>
                </form>
              )}

              {/* TAB 2: REGISTER */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fade-in">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider pl-0.5">
                      Họ và tên của bạn
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập đầy đủ họ tên"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      className="w-full px-4 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] font-semibold text-stone-800 placeholder-stone-400"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider pl-0.5">
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      placeholder="vi_du@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] font-semibold text-stone-800 placeholder-stone-400"
                    />
                  </div>

                  {/* Avatar Upload with preview */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider pl-0.5">
                      Ảnh đại diện (Avatar)
                    </label>
                    <div className="flex items-center space-x-4 bg-white p-3 rounded-xl border border-stone-200/80">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center flex-shrink-0">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Upload className="w-5 h-5 text-stone-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="inline-flex items-center justify-center px-4 py-1.5 border border-stone-200 rounded-lg text-xs font-bold text-stone-600 bg-stone-50 hover:bg-stone-100 cursor-pointer transition-colors">
                          <span>Tải ảnh lên</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="hidden" 
                          />
                        </label>
                        <p className="text-[9px] text-stone-400 mt-1 font-semibold">Định dạng JPG, PNG. Ảnh thật upload Cloudinary.</p>
                      </div>
                    </div>
                  </div>



                  {/* Submit / Loading */}
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-2.5 px-4 bg-[#2d382e] text-[#c29b38] hover:bg-[#1f2720] disabled:bg-stone-200 disabled:text-stone-400 font-bold rounded-2xl shadow transition-colors font-display text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin"></div>
                        <span>Đang tải ảnh & đăng ký...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Đăng ký & Nhận Token</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
