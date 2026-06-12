import React, { useState } from 'react';
import { Mail, ChevronDown, ChevronUp, Copy, Check, Trash2 } from 'lucide-react';

export default function MockEmailInbox({ emails = [], onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (emails.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-80 sm:w-96 shadow-2xl transition-all duration-300 font-sans">
      
      {/* Collapsed Header / Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#1e293b] text-white rounded-t-2xl shadow-lg border border-slate-700/80 hover:bg-[#334155] transition-colors"
        style={{ borderRadius: isOpen ? '1rem 1rem 0 0' : '1rem' }}
      >
        <div className="flex items-center space-x-2.5">
          <div className="relative">
            <Mail className="w-5 h-5 text-[#c29b38] fill-[#c29b38]/10 animate-pulse" />
            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center px-1.5 py-0.5 rounded-full bg-red-500 text-[8px] font-black text-white border border-[#1e293b]">
              {emails.length}
            </span>
          </div>
          <span className="text-xs font-bold font-display uppercase tracking-wider">
            Mock Email Inbox (FIFA Code)
          </span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-stone-400" /> : <ChevronUp className="w-4 h-4 text-stone-400" />}
      </button>

      {/* Expanded Inbox content list */}
      {isOpen && (
        <div className="bg-[#0f172a] text-stone-200 border-x border-b border-slate-800 rounded-b-2xl max-h-72 overflow-y-auto p-4 space-y-3">
          
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Hộp thư đến mô phỏng</span>
            <button 
              onClick={onClear}
              className="flex items-center gap-1 hover:text-red-400 transition-colors"
              title="Xóa tất cả thư"
            >
              <Trash2 className="w-3 h-3" />
              <span>Dọn sạch</span>
            </button>
          </div>

          <div className="space-y-3.5 divide-y divide-slate-850">
            {emails.map((email) => (
              <div key={email.id} className="pt-3 first:pt-0 space-y-2">
                {/* Mail Header */}
                <div className="flex justify-between items-start text-[10px]">
                  <div className="font-semibold text-slate-300">
                    <span className="text-[#c29b38]">Từ:</span> no-reply@fifa2026.org
                  </div>
                  <span className="text-slate-500 font-medium">{email.date}</span>
                </div>

                <div className="text-[11px] font-bold text-white pl-0.5">
                  [FIFA WC 2026] Mã xác thực tài khoản - {email.name}
                </div>

                {/* Mail Body */}
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-850 text-[10px] text-slate-300 leading-relaxed space-y-2.5">
                  <p>
                    Xin chào <span className="font-bold text-white">{email.name}</span> (gửi tới: {email.to}),
                  </p>
                  <p>
                    Mã Token đăng nhập và kích hoạt quyền bình chọn các trận đấu World Cup 2026 của bạn là:
                  </p>
                  
                  {/* Token Copy Box */}
                  <div className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 mt-1 font-mono">
                    <span className="text-xs font-bold text-[#c29b38] select-all">{email.token}</span>
                    <button
                      onClick={() => handleCopy(email.id, email.token)}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-850 text-stone-400 hover:text-white transition-colors"
                      title="Sao chép Token"
                    >
                      {copiedId === email.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
