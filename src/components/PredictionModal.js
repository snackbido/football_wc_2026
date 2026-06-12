import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, BarChart3, HelpCircle } from 'lucide-react';
import { TEAMS, getFlagUrl } from '../data';

// Helper component to render flag or soccer ball placeholder
const FlagDisplay = ({ code, name, sizeClass = "w-7 h-5" }) => {
  if (!code) {
    return (
      <div className={`${sizeClass} rounded bg-stone-200 border border-stone-300 flex items-center justify-center flex-shrink-0 shadow-sm`} title={name}>
        <span className="text-[10px] leading-none" role="img" aria-label="football">⚽</span>
      </div>
    );
  }
  return (
    <img 
      src={getFlagUrl(code)} 
      alt={name} 
      className={`${sizeClass} object-cover rounded shadow-sm border border-stone-200 bg-stone-100 flex-shrink-0`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://flagcdn.com/w40/un.png';
      }}
    />
  );
};

export default function PredictionModal({ isOpen, onClose, match, prediction, votes, onVote }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [homeScoreInput, setHomeScoreInput] = useState('0'); // Default to 0
  const [awayScoreInput, setAwayScoreInput] = useState('0'); // Default to 0
  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  // Reset state when modal opens/closes or match changes
  useEffect(() => {
    if (isOpen) {
      setSelectedTeam(null);
      setHomeScoreInput('0'); // Reset default to 0
      setAwayScoreInput('0'); // Reset default to 0
      setShowConfirmOverlay(false);
      setShowSuccessOverlay(false);
    }
  }, [isOpen, match]);

  if (!isOpen || !match) return null;

  const home = TEAMS[match.homeTeam] || { name: match.homeTeam, flagCode: '' };
  const away = TEAMS[match.awayTeam] || { name: match.awayTeam, flagCode: '' };

  // Calculate voting statistics
  const totalVotes = votes ? votes.homeVotes + votes.awayVotes : 0;
  const homePercent = totalVotes > 0 ? Math.round((votes.homeVotes / totalVotes) * 100) : 50;
  const awayPercent = 100 - homePercent;

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (selectedTeam && homeScoreInput !== '' && awayScoreInput !== '') {
      setShowConfirmOverlay(true);
    }
  };

  const handleFinalConfirm = () => {
    onVote(
      match.id,
      selectedTeam,
      parseInt(homeScoreInput, 10),
      parseInt(awayScoreInput, 10)
    );
    setShowConfirmOverlay(false);
    setShowSuccessOverlay(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={showSuccessOverlay ? undefined : onClose}></div>

      {/* Main Container */}
      <div className="relative w-full max-w-lg bg-stone-50 rounded-3xl shadow-2xl overflow-hidden z-10 animate-slide-in border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-[#2d382e] text-white border-b border-stone-800">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c29b38]">
            {match.group ? match.group : match.stage}
          </span>
          <h3 className="text-base font-bold font-display text-white">
            {prediction ? 'Kết Quả Dự Đoán' : 'Dự Đoán Kết Quả'}
          </h3>
          {!showSuccessOverlay && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-850 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Match Info Display */}
          <div className="bg-white p-4.5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center justify-around">
            {/* Home Team */}
            <div className="flex flex-col items-center space-y-2 text-center w-1/3">
              <FlagDisplay code={home.flagCode} name={home.name} sizeClass="w-12 h-8" />
              <span className="text-sm font-bold text-stone-800 font-display line-clamp-2 leading-tight">
                {home.name}
              </span>
            </div>

            {/* VS or Real Score */}
            <div className="flex flex-col items-center justify-center w-1/3">
              {match.status === 'finished' ? (
                <div className="text-2xl font-black text-stone-900 font-display">
                  {match.homeScore} - {match.awayScore}
                </div>
              ) : (
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest bg-stone-100 px-3 py-1 rounded-full border border-stone-200/50">
                  VS
                </div>
              )}
              <span className="text-[10px] text-stone-400 mt-1 font-semibold truncate max-w-[120px]" title={match.stadium}>
                {match.stadium.replace('SVĐ ', '')}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center space-y-2 text-center w-1/3">
              <FlagDisplay code={away.flagCode} name={away.name} sizeClass="w-12 h-8" />
              <span className="text-sm font-bold text-stone-800 font-display line-clamp-2 leading-tight">
                {away.name}
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* CASE 1: ALREADY VOTED (SHOW RESULTS) */}
          {/* ============================================================== */}
          {prediction ? (
            <div className="space-y-6 animate-fade-in">
              {/* User prediction details */}
              <div className="bg-[#f7f5f0] p-4.5 rounded-2xl border border-[#ebdcd0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Lựa chọn của bạn</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> ĐÃ BÌNH CHỌN
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-stone-200/60">
                  <div className="flex items-center space-x-2">
                    <FlagDisplay 
                      code={prediction.supportedTeam === 'home' ? home.flagCode : away.flagCode} 
                      name={prediction.supportedTeam === 'home' ? home.name : away.name}
                    />
                    <span className="text-sm font-bold text-stone-800 font-display">
                      Ủng hộ: {prediction.supportedTeam === 'home' ? home.name : away.name}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-stone-900 font-display">
                    Dự đoán tỷ số: <span className="text-base text-[#2d382e]">{prediction.homeScore} - {prediction.awayScore}</span>
                  </div>
                </div>
              </div>

              {/* Statistics & Progress Bar */}
              <div className="space-y-3.5 bg-white p-4.5 rounded-2xl border border-stone-200/80 shadow-sm">
                <div className="flex items-center space-x-2 text-stone-800 font-bold text-sm">
                  <BarChart3 className="w-4 h-4 text-[#2d382e]" />
                  <span className="font-display">Thống kê bình chọn toàn thế giới</span>
                </div>

                {/* Progress labels */}
                <div className="flex justify-between items-end text-xs font-bold font-display mt-2">
                  <div className="flex items-center space-x-1.5 text-emerald-600">
                    <FlagDisplay code={home.flagCode} name={home.name} sizeClass="w-5 h-3.5" />
                    <span>{home.name}: {homePercent}%</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-amber-500">
                    <span>{awayPercent}%: {away.name}</span>
                    <FlagDisplay code={away.flagCode} name={away.name} sizeClass="w-5 h-3.5" />
                  </div>
                </div>

                {/* Dual-colored progress bar */}
                <div className="w-full h-3.5 bg-stone-100 rounded-full flex overflow-hidden border border-stone-200/40">
                  <div 
                    style={{ width: `${homePercent}%` }}
                    className="bg-emerald-600 transition-all duration-500 h-full relative"
                    title={`${home.name}: ${homePercent}%`}
                  ></div>
                  <div 
                    style={{ width: `${awayPercent}%` }}
                    className="bg-amber-500 transition-all duration-500 h-full relative"
                    title={`${away.name}: ${awayPercent}%`}
                  ></div>
                </div>

                {/* Total votes */}
                <div className="flex justify-between text-[10px] text-stone-400 font-semibold px-0.5">
                  <span>{votes ? votes.homeVotes : 0} lượt bầu</span>
                  <span>Tổng cộng: {totalVotes} lượt bình chọn</span>
                  <span>{votes ? votes.awayVotes : 0} lượt bầu</span>
                </div>
              </div>

              {/* Lock Warning */}
              <p className="text-[10px] text-center text-stone-400 font-medium">
                * Mỗi trận đấu chỉ được phép dự đoán một lần. Ý kiến của bạn đã được ghi nhận vào cơ sở dữ liệu chung.
              </p>
            </div>
          ) : (
            // ==============================================================
            // CASE 2: NOT VOTED YET (SHOW VOTING FORM)
            // ==============================================================
            <form onSubmit={handleOpenConfirm} className="space-y-6 animate-fade-in">
              {/* Select Supported Team */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5 pl-0.5">
                  <HelpCircle className="w-4 h-4 text-stone-400" />
                  Bạn ủng hộ đội tuyển nào thắng?
                </span>

                <div className="grid grid-cols-2 gap-4">
                  {/* Home Team Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedTeam('home')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 bg-white shadow-sm text-center ${
                      selectedTeam === 'home'
                        ? 'border-[#c29b38] bg-[#f7f5f0] ring-4 ring-[#c29b38]/10'
                        : 'border-stone-200/80 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <FlagDisplay code={home.flagCode} name={home.name} sizeClass="w-12 h-8" />
                    <span className="text-sm font-bold text-stone-800 font-display mt-2 leading-tight">
                      {home.name}
                    </span>
                    <span className="text-[10px] text-stone-400 mt-1 uppercase font-bold tracking-wider">Đội nhà</span>
                  </button>

                  {/* Away Team Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedTeam('away')}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 bg-white shadow-sm text-center ${
                      selectedTeam === 'away'
                        ? 'border-[#c29b38] bg-[#f7f5f0] ring-4 ring-[#c29b38]/10'
                        : 'border-stone-200/80 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <FlagDisplay code={away.flagCode} name={away.name} sizeClass="w-12 h-8" />
                    <span className="text-sm font-bold text-stone-800 font-display mt-2 leading-tight">
                      {away.name}
                    </span>
                    <span className="text-[10px] text-stone-400 mt-1 uppercase font-bold tracking-wider">Đội khách</span>
                  </button>
                </div>
              </div>

              {/* Enter Predicted Score (Appears after team selection) */}
              {selectedTeam && (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-0.5">
                    Nhập tỷ số dự đoán của bạn
                  </span>

                  <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex items-center justify-center space-x-6">
                    {/* Home Score Input */}
                    <div className="flex items-center space-x-3">
                      <FlagDisplay code={home.flagCode} name={home.name} sizeClass="w-6 h-4" />
                      <input
                        type="number"
                        min="0"
                        max="99"
                        placeholder="0"
                        value={homeScoreInput}
                        onChange={(e) => setHomeScoreInput(e.target.value.replace(/\D/g, ''))}
                        required
                        className="w-12 h-12 text-center text-xl font-bold bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] focus:bg-white transition-all font-display"
                      />
                    </div>

                    <div className="text-lg font-bold text-stone-400 font-display">:</div>

                    {/* Away Score Input */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="number"
                        min="0"
                        max="99"
                        placeholder="0"
                        value={awayScoreInput}
                        onChange={(e) => setAwayScoreInput(e.target.value.replace(/\D/g, ''))}
                        required
                        className="w-12 h-12 text-center text-xl font-bold bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] focus:bg-white transition-all font-display"
                      />
                      <FlagDisplay code={away.flagCode} name={away.name} sizeClass="w-6 h-4" />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedTeam || homeScoreInput === '' || awayScoreInput === ''}
                className="w-full py-3 px-4 bg-[#2d382e] text-[#c29b38] hover:bg-[#202720] disabled:bg-stone-200 disabled:text-stone-400 font-bold rounded-2xl shadow transition-all duration-200 font-display text-sm uppercase tracking-wider"
              >
                Xác nhận dự đoán
              </button>
            </form>
          )}
        </div>

        {/* ============================================================== */}
        {/* SUB-OVERLAY 1: CONFIRMATION OVERLAY */}
        {/* ============================================================== */}
        {showConfirmOverlay && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm z-20 flex items-center justify-center p-6 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-stone-200 shadow-2xl space-y-5 text-center animate-slide-in">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-stone-900 font-display">Xác Nhận Bình Chọn?</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Bạn đang bình chọn ủng hộ <span className="font-bold text-stone-800">{selectedTeam === 'home' ? home.name : away.name}</span> với tỷ số dự đoán <span className="font-bold text-stone-800">{homeScoreInput} - {awayScoreInput}</span>.
                </p>
                <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200/50 p-2 rounded-xl font-bold uppercase tracking-wide">
                  ⚠️ Sau khi xác nhận, bạn không thể sửa đổi kết quả!
                </p>
              </div>
              <div className="flex gap-3 font-display text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setShowConfirmOverlay(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Hủy quay lại
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  className="flex-1 py-2.5 px-4 bg-[#2d382e] text-white hover:bg-stone-850 rounded-xl shadow transition-colors"
                >
                  Đồng ý, gửi bầu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-OVERLAY 2: SUCCESS OVERLAY */}
        {/* ============================================================== */}
        {showSuccessOverlay && (
          <div className="absolute inset-0 bg-stone-50 z-30 flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-xs w-full text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200/30 animate-bounce">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-bold text-stone-950 font-display">Bình Chọn Thành Công!</h4>
                <p className="text-xs text-stone-400">
                  Dự đoán tỷ số của bạn đã được ghi nhận. Cảm ơn bạn đã tham gia bình chọn!
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-[#2d382e] hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow transition-all duration-200 font-display"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
