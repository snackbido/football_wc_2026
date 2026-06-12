import React, { useState, useEffect } from 'react';
import { X, UserPlus, ShieldAlert, Key, Upload, Settings2, UserCheck } from 'lucide-react';

// Cloudinary upload helper with local base64 fallback
const uploadToCloudinary = async (file) => {
  const cloudName = localStorage.getItem('wc_cloudinary_cloud_name') || '';
  const uploadPreset = localStorage.getItem('wc_cloudinary_preset') || '';
  
  // If credentials aren't configured, fall back to base64 immediately for testing ease
  if (!cloudName || !uploadPreset) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      const data = await response.json();
      return data.secure_url;
    }
    throw new Error('Upload to Cloudinary failed');
  } catch (err) {
    console.warn('Cloudinary upload error, using local base64 instead:', err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }
};

export default function AuthModal({ isOpen, onClose, registeredUsers, onVerifySuccess, onRegisterNewUser }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login states
  const [selectedUserEmail, setSelectedUserEmail] = useState('');
  const [loginToken, setLoginToken] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [cloudName, setCloudName] = useState(localStorage.getItem('wc_cloudinary_cloud_name') || '');
  const [uploadPreset, setUploadPreset] = useState(localStorage.getItem('wc_cloudinary_preset') || '');

  // Success screen
  const [verifiedUser, setVerifiedUser] = useState(null);

  // Sync state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setLoginToken('');
      setLoginError('');
      setVerifiedUser(null);
      if (registeredUsers.length > 0) {
        setSelectedUserEmail(registeredUsers[0].email);
        setActiveTab('login');
      } else {
        setActiveTab('register');
      }
    }
  }, [isOpen, registeredUsers]);

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
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    const user = registeredUsers.find(u => u.email === selectedUserEmail);
    if (!user) {
      setLoginError('Không tìm thấy tài khoản.');
      return;
    }

    if (user.token.trim().toLowerCase() === loginToken.trim().toLowerCase()) {
      setVerifiedUser(user);
      setTimeout(() => {
        onVerifySuccess(user);
      }, 1500);
    } else {
      setLoginError('Mã Token không chính xác. Vui lòng kiểm tra lại!');
    }
  };

  // Register handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsUploading(true);
    
    // Save Cloudinary settings if entered
    localStorage.setItem('wc_cloudinary_cloud_name', cloudName);
    localStorage.setItem('wc_cloudinary_preset', uploadPreset);

    let avatarUrl = '';
    if (avatarFile) {
      avatarUrl = await uploadToCloudinary(avatarFile);
    } else {
      // Default initial placeholder avatar
      avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
    }

    // Generate random token
    const generatedToken = `WC26-${Math.floor(1000 + Math.random() * 9000)}`;

    onRegisterNewUser({
      name,
      email,
      avatarUrl,
      token: generatedToken
    });

    setIsUploading(false);
    
    // Reset fields
    setName('');
    setEmail('');
    setAvatarFile(null);
    setAvatarPreview(null);
    
    // Automatically switch to login tab and select the newly registered user
    setSelectedUserEmail(email);
    setActiveTab('login');
    
    // Alert user that token has been sent
    alert(`Đăng ký thành công! Token xác thực đã được gửi tới email ${email}.\nHộp thư giả lập ở góc dưới màn hình đã nhận được token: ${generatedToken}`);
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
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 text-sm font-bold font-display border-b-2 transition-all ${
                  activeTab === 'login'
                    ? 'border-[#2d382e] text-[#2d382e] bg-stone-50/50'
                    : 'border-transparent text-stone-400 hover:text-stone-600'
                }`}
              >
                Xác thực bằng Token
              </button>
              <button
                onClick={() => setActiveTab('register')}
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
                <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fade-in">
                  
                  {registeredUsers.length === 0 ? (
                    <div className="text-center py-6 text-stone-400 space-y-3">
                      <ShieldAlert className="w-12 h-12 stroke-[1.25] text-stone-300 mx-auto" />
                      <p className="text-xs font-semibold">Chưa có tài khoản nào trên hệ thống.</p>
                      <button
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className="text-xs font-bold text-[#c29b38] underline hover:text-[#d4ac4b]"
                      >
                        Đăng ký tài khoản ngay
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Select User Dropdown */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider pl-0.5">
                          Chọn tên tài khoản của bạn
                        </label>
                        <select
                          value={selectedUserEmail}
                          onChange={(e) => setSelectedUserEmail(e.target.value)}
                          className="w-full px-3 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] font-bold text-stone-850"
                        >
                          {registeredUsers.map((u) => (
                            <option key={u.email} value={u.email}>
                              {u.name} ({u.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Token Input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider pl-0.5">
                          Nhập mã Token xác thực
                        </label>
                        <input
                          type="text"
                          placeholder="Mã token (VD: WC26-1234)"
                          value={loginToken}
                          onChange={(e) => setLoginToken(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] font-semibold text-stone-800 placeholder-stone-400"
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
                        * Bạn chỉ cần nhập mã token được gửi qua email ở lần đăng ký đầu tiên để xác thực và tiến hành bình chọn.
                      </p>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="w-full py-2.5 px-4 bg-[#2d382e] text-[#c29b38] hover:bg-[#1f2720] font-bold rounded-2xl shadow transition-colors font-display text-xs uppercase tracking-wider"
                      >
                        Xác nhận xác thực
                      </button>
                    </>
                  )}
                </form>
              )}

              {/* TAB 2: REGISTER */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4.5 animate-fade-in">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider pl-0.5">
                      Họ và tên của bạn
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập đầy đủ họ tên"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] font-semibold text-stone-800"
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] font-semibold text-stone-800"
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

                  {/* Collapsible Cloudinary Configuration */}
                  <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setShowConfig(!showConfig)}
                      className="w-full flex items-center justify-between px-3 py-2 bg-stone-50 text-stone-600 hover:text-stone-800 text-[10px] font-bold uppercase tracking-wider border-b border-stone-100"
                    >
                      <span className="flex items-center gap-1.5">
                        <Settings2 className="w-3.5 h-3.5 text-stone-400" />
                        Cấu hình Cloudinary (Tùy chọn)
                      </span>
                      <span>{showConfig ? 'Ẩn' : 'Hiện'}</span>
                    </button>
                    {showConfig && (
                      <div className="p-3 space-y-2.5 animate-fade-in bg-stone-50/30">
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-stone-400 uppercase">Cloud Name</span>
                          <input
                            type="text"
                            placeholder="Nhập Cloud Name"
                            value={cloudName}
                            onChange={(e) => setCloudName(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-stone-400 uppercase">Upload Preset (Unsigned)</span>
                          <input
                            type="text"
                            placeholder="Nhập Upload Preset"
                            value={uploadPreset}
                            onChange={(e) => setUploadPreset(e.target.value)}
                            className="w-full px-2.5 py-1 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none"
                          />
                        </div>
                        <p className="text-[9px] text-stone-400 leading-normal font-medium">
                          * Để trống để sử dụng chế độ local fallback lưu trực tiếp avatar base64 trong trình duyệt (khuyên dùng để thử nghiệm nhanh).
                        </p>
                      </div>
                    )}
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
