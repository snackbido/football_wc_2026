import React, { useState, useEffect, useMemo } from 'react';
import { X, CheckCircle2, AlertTriangle, BarChart3, HelpCircle, Users, Sparkles } from 'lucide-react';
import { getVotingStatus, getVnDateTime, mapStageToVn, mapGroupToVn } from '../data';
import { getMatchDetails, getAiAnalysis } from '../services/footballService';

// Helper component to render flag or soccer ball placeholder
const FlagDisplay = ({ src, name, sizeClass = "w-7 h-5" }) => {
  if (!src) {
    return (
      <div className={`${sizeClass} rounded bg-stone-200 border border-stone-300 flex items-center justify-center flex-shrink-0 shadow-sm`} title={name}>
        <span className="text-[10px] leading-none" role="img" aria-label="football">⚽</span>
      </div>
    );
  }
  return (
    <img 
      src={src} 
      alt={name} 
      className={`${sizeClass} object-cover rounded shadow-sm border border-stone-200 bg-stone-100 flex-shrink-0`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://flagcdn.com/w40/un.png';
      }}
    />
  );
};

export default function PredictionModal({ isOpen, onClose, match, prediction, votes, onVote, currentUser }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [homeScoreInput, setHomeScoreInput] = useState('0'); // Default to 0
  const [awayScoreInput, setAwayScoreInput] = useState('0'); // Default to 0
  const [voteAmount, setVoteAmount] = useState(10000);
  const [customAmountInput, setCustomAmountInput] = useState('10000');
  const [amountError, setAmountError] = useState('');
  const [showConfirmOverlay, setShowConfirmOverlay] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [showVotersList, setShowVotersList] = useState(false);
  
  const [dbMatchDetails, setDbMatchDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [aiData, setAiData] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState('');

  // Reset state when modal opens/closes or match changes
  useEffect(() => {
    if (isOpen) {
      setSelectedTeam(null);
      setHomeScoreInput('0'); // Reset default to 0
      setAwayScoreInput('0'); // Reset default to 0
      setVoteAmount(10000);
      setCustomAmountInput('10000');
      setAmountError('');
      setShowConfirmOverlay(false);
      setShowSuccessOverlay(false);
      setShowVotersList(false);
      setDbMatchDetails(null);
      setIsSubmitting(false);
      setAiData(null);
      setLoadingAi(false);
      setAiError('');
    }
  }, [isOpen, match]);

  // Fetch match details and voter list from backend
  useEffect(() => {
    const fetchDetails = async () => {
      if (isOpen && match && match.id) {
        setLoadingDetails(true);
        try {
          const response = await getMatchDetails(match.id);
          if (response && response.status === 'success') {
            setDbMatchDetails(response.data);
          }
        } catch (err) {
          console.error("Error fetching match details from backend:", err);
        } finally {
          setLoadingDetails(false);
        }
      }
    };
    fetchDetails();
  }, [isOpen, match]);

  const { homeVoters, awayVoters } = useMemo(() => {
    const hV = [];
    const aV = [];

    if (dbMatchDetails && Array.isArray(dbMatchDetails.bets)) {
      dbMatchDetails.bets.forEach(b => {
        if (b.userId) {
          const isCurrentUser = currentUser && b.userId._id === currentUser._id;
          const userObj = {
            name: b.userId.name + (isCurrentUser ? " (Bạn)" : ""),
            avatar: b.userId.avatar && b.userId.avatar !== 'default-avatar.png'
              ? b.userId.avatar
              : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(b.userId.name)}`,
            amount: b.betAmount
          };
          if (b.predictedWinner === "HOME") {
            hV.push(userObj);
          } else if (b.predictedWinner === "AWAY") {
            aV.push(userObj);
          }
        }
      });
    }

    return { homeVoters: hV, awayVoters: aV };
  }, [dbMatchDetails, currentUser]);

  // Dynamic voting stats
  const { displayHomeVotes, displayAwayVotes, totalVotes, homePercent, awayPercent } = useMemo(() => {
    if (dbMatchDetails) {
      const hV = dbMatchDetails.stats?.totalBetsHome || 0;
      const aV = dbMatchDetails.stats?.totalBetsAway || 0;
      const total = hV + aV;
      const hp = total > 0 ? Math.round((hV / total) * 100) : 50;
      const ap = 100 - hp;
      return { displayHomeVotes: hV, displayAwayVotes: aV, totalVotes: total, homePercent: hp, awayPercent: ap };
    }
    const hV = votes ? votes.homeVotes : 0;
    const aV = votes ? votes.awayVotes : 0;
    const total = hV + aV;
    const hp = total > 0 ? Math.round((hV / total) * 100) : 50;
    const ap = 100 - hp;
    return { displayHomeVotes: hV, displayAwayVotes: aV, totalVotes: total, homePercent: hp, awayPercent: ap };
  }, [dbMatchDetails, votes]);

  if (!isOpen || !match) return null;

  const votingStatus = getVotingStatus(match);

  const home = match.homeTeam || { name: 'Chưa xác định', crest: '' };
  const away = match.awayTeam || { name: 'Chưa xác định', crest: '' };

  const { date: matchDateStr, time: matchTimeStr } = getVnDateTime(match.utcDate);

  const handleAmountChange = (val) => {
    setCustomAmountInput(val);
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      setAmountError('Vui lòng nhập số tiền hợp lệ');
      setVoteAmount(0);
    } else if (parsed < 5000) {
      setAmountError('Số tiền tối thiểu là 5.000đ');
      setVoteAmount(parsed);
    } else if (parsed > 50000) {
      setAmountError('Số tiền tối đa là 50.000đ');
      setVoteAmount(parsed);
    } else {
      setAmountError('');
      setVoteAmount(parsed);
    }
  };

  const handleQuickAmount = (amount) => {
    setVoteAmount(amount);
    setCustomAmountInput(amount.toString());
    setAmountError('');
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    if (
      selectedTeam &&
      homeScoreInput !== '' &&
      awayScoreInput !== '' &&
      !amountError &&
      voteAmount >= 5000 &&
      voteAmount <= 50000
    ) {
      setShowConfirmOverlay(true);
    }
  };

  const handleFinalConfirm = async () => {
    setIsSubmitting(true);
    try {
      const updatedMatch = await onVote(
        match.id,
        selectedTeam,
        parseInt(homeScoreInput, 10),
        parseInt(awayScoreInput, 10),
        voteAmount
      );
      if (updatedMatch) {
        setDbMatchDetails(updatedMatch);
      }
      setShowConfirmOverlay(false);
      setShowSuccessOverlay(true);
    } catch (err) {
      setShowConfirmOverlay(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAiAnalyze = async () => {
    setLoadingAi(true);
    setAiError('');
    try {
      const response = await getAiAnalysis(match.id);
      if (response && response.status === 'success') {
        setAiData(response.data);
      } else {
        setAiError(response?.message || 'Không thể lấy dữ liệu phân tích AI');
      }
    } catch (err) {
      console.error("Error analyzing match with AI:", err);
      setAiError(err.message || 'Đã xảy ra lỗi khi gọi mô hình AI');
    } finally {
      setLoadingAi(false);
    }
  };

  const stadium = 'SVĐ World Cup';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={showSuccessOverlay ? undefined : onClose}></div>

      {/* Main Container */}
      <div className="relative w-full max-w-lg bg-stone-50 rounded-3xl shadow-2xl overflow-hidden z-10 animate-slide-in border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2d382e] text-white border-b border-stone-800">
          <span className="text-xs font-bold uppercase tracking-widest text-[#c29b38]">
            {match.group ? mapGroupToVn(match.group) : mapStageToVn(match.stage)}
          </span>
          <h3 className="text-base font-bold font-display text-white">
            {prediction ? 'Kết Quả Dự Đoán' : 'Dự Đoán Kết Quả'}
          </h3>
          {!showSuccessOverlay && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full bg-[#242d25] hover:bg-[#343e35] text-stone-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Match Info Display */}
          <div className="bg-white p-4.5 rounded-2xl border p-2 border-stone-200/80 shadow-sm flex items-center justify-around">
            {/* Home Team */}
            <div className="flex flex-col items-center space-y-2 text-center w-1/3">
              <FlagDisplay src={home.crest} name={home.name} sizeClass="w-12 h-8" />
              <span className="text-sm font-bold text-stone-800 font-display line-clamp-2 leading-tight">
                {home.name}
              </span>
            </div>

            {/* VS or Real Score */}
            <div className="flex flex-col items-center justify-center w-1/3">
              {match.status === 'FINISHED' ? (
                <div className="text-2xl font-black text-stone-900 font-display">
                  {match.score?.fullTime?.home ?? 0} - {match.score?.fullTime?.away ?? 0}
                </div>
              ) : (
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest bg-stone-100 px-3 py-1 rounded-full border border-stone-200/50">
                  VS
                </div>
              )}
              <span className="text-[10px] text-stone-400 mt-1 font-semibold truncate max-w-[120px]" title={stadium}>
                {stadium.replace('SVĐ ', '')}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center space-y-2 text-center w-1/3">
              <FlagDisplay src={away.crest} name={away.name} sizeClass="w-12 h-8" />
              <span className="text-sm font-bold text-stone-800 font-display line-clamp-2 leading-tight">
                {away.name}
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* VOTING STATISTICS & PROGRESS BAR (ALWAYS VISIBLE) */}
          {/* ============================================================== */}
          <div className="space-y-3.5 bg-white p-4.5 rounded-2xl border border-stone-200/80 shadow-sm p-3">
            <div className="flex items-center space-x-2 text-stone-800 font-bold text-sm">
              <BarChart3 className="w-4 h-4 text-[#2d382e]" />
              <span className="font-display">Thống kê bình chọn toàn giải</span>
            </div>

            {/* Progress labels */}
            <div className="flex justify-between items-end text-xs font-bold font-display mt-2">
              <div className="flex items-center space-x-1.5 text-emerald-600">
                <FlagDisplay src={home.crest} name={home.name} sizeClass="w-5 h-3.5" />
                <span>{home.name}: {homePercent}%</span>
              </div>
              <div className="flex items-center space-x-1.5 text-amber-500">
                <span>{awayPercent}%: {away.name}</span>
                <FlagDisplay src={away.crest} name={away.name} sizeClass="w-5 h-3.5" />
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
            <div className="flex justify-between text-[10px] text-stone-400 font-semibold px-0.5 items-center">
              <span>{displayHomeVotes} lượt bầu</span>
              <span>Tổng cộng: {totalVotes} lượt</span>
              <span>{displayAwayVotes} lượt bầu</span>
            </div>

            {/* View Voter List Button */}
            <button
              type="button"
              onClick={() => setShowVotersList(true)}
              className="mt-2 flex items-center justify-center gap-1.5 w-full py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              Xem danh sách người bình chọn
            </button>
          </div>

          {/* ============================================================== */}
          {/* AI ANALYSIS SECTION */}
          {/* ============================================================== */}
          <div className="space-y-3.5 bg-white p-4.5 rounded-2xl border border-stone-200/80 shadow-sm p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-stone-800 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="font-display">Phân tích trận đấu bằng AI</span>
              </div>
              {aiData && (
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                  Đã phân tích
                </span>
              )}
            </div>

            {!aiData ? (
              <div className="space-y-3">
                <p className="text-[11px] text-stone-550 leading-normal">
                  Sử dụng mô hình trí tuệ nhân tạo để phân tích lịch sử đối đầu và dự đoán xác suất chiến thắng dựa trên phong độ của hai đội tuyển.
                </p>
                {aiError && (
                  <p className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200/40 p-2.5 rounded-xl">
                    ⚠️ {aiError}
                  </p>
                )}
                <button
                  type="button"
                  disabled={loadingAi}
                  onClick={handleAiAnalyze}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-amber-550 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  {loadingAi ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-stone-200 border-t-amber-500 rounded-full animate-spin"></div>
                      <span>Đang phân tích trận đấu...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />
                      <span className="text-amber-400">Xem phân tích & dự đoán của AI</span>
                    </>
                  )}
                </button>
              </div>
            ) : aiData.noH2h ? (
              <div className="space-y-3 animate-fade-in text-center py-4 bg-stone-50 border border-stone-150 rounded-xl">
                <p className="text-xs font-bold text-stone-500 font-display">Chưa có thành tích đối đầu</p>
                <p className="text-[10px] text-stone-400 max-w-[280px] mx-auto leading-relaxed">
                  Hai đội tuyển chưa từng gặp nhau trong lịch sử bóng đá quốc tế chính thức.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* 1. H2H Stats display */}
                {aiData.rawH2hStats && (
                  <div className="bg-stone-50 border border-stone-150 p-3 rounded-xl space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 text-center">
                      Thành tích đối đầu lịch sử
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold font-display text-stone-850">
                      <div className="bg-white p-2 rounded-lg border border-stone-200/60">
                        <div className="text-[10px] text-stone-400 font-medium font-sans mb-0.5">Số trận đấu</div>
                        <div className="text-sm font-black text-stone-900">{aiData.rawH2hStats.numberOfMatches}</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-stone-200/60">
                        <div className="text-[10px] text-stone-400 font-medium font-sans mb-0.5">Tổng bàn thắng</div>
                        <div className="text-sm font-black text-stone-900">{aiData.rawH2hStats.totalGoals}</div>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-stone-200/60">
                        <div className="text-[10px] text-stone-400 font-medium font-sans mb-0.5">Thành tích</div>
                        <div className="text-[10px] font-black text-[#2d382e]">
                          {aiData.rawH2hStats.homeTeam.wins}T - {aiData.rawH2hStats.homeTeam.draws}H - {aiData.rawH2hStats.homeTeam.losses}B
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Winning Chance Progress Bar Chart */}
                {aiData.homeChance > 0 && aiData.awayChance > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs font-bold font-display">
                      <span className="text-emerald-700 flex items-center gap-1">
                        <FlagDisplay src={home.crest} name={home.name} sizeClass="w-5 h-3.5" />
                        {home.name}: {aiData.homeChance}%
                      </span>
                      <span className="text-amber-600 flex items-center gap-1">
                        {aiData.awayChance}%: {away.name}
                        <FlagDisplay src={away.crest} name={away.name} sizeClass="w-5 h-3.5" />
                      </span>
                    </div>

                    {/* Dual-color probability bar */}
                    <div className="w-full h-3 bg-stone-100 rounded-full flex overflow-hidden border border-stone-200/30">
                      <div 
                        style={{ width: `${aiData.homeChance}%` }}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 h-full"
                      ></div>
                      <div 
                        style={{ width: `${aiData.awayChance}%` }}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 h-full"
                      ></div>
                    </div>
                    
                    <div className="text-center text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                      Dự đoán tỷ lệ chiến thắng từ AI
                    </div>
                  </div>
                )}

                {/* 3. AI analysis markdown text display */}
                <div className="bg-emerald-50/40 border border-emerald-100 p-3.5 rounded-xl text-stone-750 text-xs leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                    Đánh giá chi tiết của chuyên gia AI
                  </div>
                  <div className="whitespace-pre-line font-medium text-stone-650 pr-1 max-h-[150px] overflow-y-auto scrollbar-thin">
                    {aiData.aiAnalysis}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* CASE 1: ALREADY VOTED */}
          {/* ============================================================== */}
          {prediction ? (
            <div className="bg-[#f7f5f0] p-4.5 rounded-2xl border border-[#ebdcd0] space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Lựa chọn của bạn</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3 stroke-[2.5]" /> ĐÃ BÌNH CHỌN
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-stone-200/60">
                <div className="flex items-center space-x-2">
                  <FlagDisplay 
                    src={prediction.supportedTeam === 'home' ? home.crest : away.crest} 
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

              {prediction.amount && (
                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-stone-200/60 text-xs font-bold font-display">
                  <span className="text-stone-500 font-medium">Số tiền đã bình chọn:</span>
                  <span className="text-[#2d382e] font-extrabold text-sm">{prediction.amount.toLocaleString('vi-VN')} VND</span>
                </div>
              )}
            </div>
          ) : votingStatus === 'not_open' ? (
            // ==============================================================
            // CASE 2: NOT OPEN YET
            // ==============================================================
            <div className="space-y-4 animate-fade-in text-center py-4 bg-stone-100/50 p-4.5 rounded-2xl border border-stone-200/60">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h4 className="text-sm font-bold text-stone-900 font-display">Bình Chọn Chưa Mở</h4>
                <p className="text-[11px] text-stone-550 leading-relaxed">
                  Bình chọn dự đoán tỷ số và ủng hộ đội tuyển chỉ mở trong vòng <span className="font-bold text-stone-800">24 tiếng</span> trước khi trận đấu diễn ra.
                </p>
                <div className="p-3.5 bg-white border border-stone-200/40 rounded-xl text-[10px] font-bold text-stone-700 font-display flex flex-col gap-0.5 mt-2">
                  <span className="text-stone-400 font-medium">Thời gian thi đấu:</span>
                  <span className="text-stone-800 text-xs font-black">{matchTimeStr} ngày {matchDateStr.split('-').reverse().join('/')}</span>
                </div>
              </div>
            </div>
          ) : votingStatus === 'locked' ? (
            // ==============================================================
            // CASE 3: LOCKED
            // ==============================================================
            <div className="space-y-4 animate-fade-in">
              <div className="bg-red-50/50 p-4 rounded-2xl border border-red-200/50 text-center space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-red-100/60 border border-red-200 text-red-650 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-stone-950 font-display">Bình Chọn Đã Khóa</h4>
                  <p className="text-[11px] text-stone-500 leading-relaxed px-2">
                    Hệ thống tự động đóng cổng bình chọn cho trận đấu này. Bạn vẫn có thể xem các thông số thống kê bình chọn ở trên.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // ==============================================================
            // CASE 4: NOT VOTED YET & OPEN (SHOW VOTING FORM)
            // ==============================================================
            <form onSubmit={handleOpenConfirm} className="space-y-4 animate-fade-in pt-2">
              {/* Select Supported Team */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5 pl-0.5">
                  <HelpCircle className="w-4 h-4 text-stone-400" />
                  Bạn ủng hộ đội tuyển nào thắng?
                </span>

                <div className="grid grid-cols-2 gap-4">
                  {/* Home Team Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedTeam('home')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 bg-white shadow-sm text-center cursor-pointer ${
                      selectedTeam === 'home'
                        ? 'border-[#c29b38] bg-[#f7f5f0] ring-4 ring-[#c29b38]/10'
                        : 'border-stone-200/80 hover:border-stone-300 hover:bg-stone-55'
                    }`}
                  >
                    <FlagDisplay src={home.crest} name={home.name} sizeClass="w-10 h-7" />
                    <span className="text-xs font-bold text-stone-850 font-display mt-1.5 leading-tight">
                      {home.name}
                    </span>
                    <span className="text-[9px] text-stone-400 mt-0.5 uppercase font-bold tracking-wider">Đội nhà</span>
                  </button>

                  {/* Away Team Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedTeam('away')}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 bg-white shadow-sm text-center cursor-pointer ${
                      selectedTeam === 'away'
                        ? 'border-[#c29b38] bg-[#f7f5f0] ring-4 ring-[#c29b38]/10'
                        : 'border-stone-200/80 hover:border-stone-300 hover:bg-stone-55'
                    }`}
                  >
                    <FlagDisplay src={away.crest} name={away.name} sizeClass="w-10 h-7" />
                    <span className="text-xs font-bold text-stone-850 font-display mt-1.5 leading-tight">
                      {away.name}
                    </span>
                     <span className="text-[9px] text-stone-400 mt-0.5 uppercase font-bold tracking-wider">Đội khách</span>
                  </button>
                </div>
              </div>

              {selectedTeam && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-0.5">
                      Nhập tỷ số dự đoán của bạn
                    </span>

                    <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex items-center justify-center space-x-6">
                      {/* Home Score Input */}
                      <div className="flex items-center space-x-2">
                        <FlagDisplay src={home.crest} name={home.name} sizeClass="w-5 h-3.5" />
                        <input
                          type="number"
                          min="0"
                          max="99"
                          placeholder="0"
                          value={homeScoreInput}
                          onChange={(e) => setHomeScoreInput(e.target.value.replace(/\D/g, ''))}
                          required
                          className="w-10 h-10 text-center text-lg font-bold bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] focus:bg-white transition-all font-display"
                        />
                      </div>

                      <div className="text-lg font-bold text-stone-400 font-display">:</div>

                      {/* Away Score Input */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          max="99"
                          placeholder="0"
                          value={awayScoreInput}
                          onChange={(e) => setAwayScoreInput(e.target.value.replace(/\D/g, ''))}
                          required
                          className="w-10 h-10 text-center text-lg font-bold bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] focus:bg-white transition-all font-display"
                        />
                        <FlagDisplay src={away.crest} name={away.name} sizeClass="w-5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Select Voting Amount */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider pl-0.5 flex justify-between items-center">
                      <span>Chọn số tiền bình chọn</span>
                      <span className="text-[9px] text-stone-400 font-semibold normal-case">
                        Giới hạn: 5.000đ - 50.000đ
                      </span>
                    </span>

                    <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
                      {/* Quick select buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        {[5000, 10000, 20000, 50000].map((amt) => {
                          const isSelected = voteAmount === amt && !amountError;
                          return (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => handleQuickAmount(amt)}
                              className={`py-1.5 px-1 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'bg-[#2d382e] text-[#c29b38] border-[#2d382e] ring-2 ring-[#c29b38]/20 shadow-sm'
                                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-850'
                              }`}
                            >
                              {(amt / 1000)}kđ
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom input */}
                      <div className="space-y-1">
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Nhập số tiền..."
                            value={customAmountInput}
                            onChange={(e) => handleAmountChange(e.target.value.replace(/\D/g, ''))}
                            className={`w-full px-3 py-2 bg-stone-50 border rounded-xl font-bold font-display text-xs focus:outline-none focus:bg-white transition-all ${
                              amountError
                                ? 'border-red-350 focus:ring-2 focus:ring-red-200'
                                : 'border-stone-200 focus:ring-2 focus:ring-[#2d382e]/20'
                            }`}
                          />
                          <span className="absolute right-3 font-bold text-[10px] text-stone-400 uppercase">
                            VND
                          </span>
                        </div>
                        {amountError ? (
                          <p className="text-[9px] text-red-500 font-bold flex items-center gap-1 pl-1">
                            ⚠️ {amountError}
                          </p>
                        ) : (
                          <p className="text-[9px] text-stone-400 font-medium pl-1">
                            * Mệnh giá tối thiểu: 5.000 VND, tối đa: 50.000 VND.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedTeam || homeScoreInput === '' || awayScoreInput === '' || !!amountError || voteAmount < 5000 || voteAmount > 50000}
                className="w-full py-2.5 px-4 bg-[#2d382e] text-[#c29b38] hover:bg-[#202720] disabled:bg-stone-200 disabled:text-stone-400 font-bold rounded-2xl shadow transition-all duration-200 font-display text-xs uppercase tracking-wider cursor-pointer"
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
              <div className="space-y-3 text-left">
                <h4 className="text-lg font-bold text-stone-900 font-display text-center">Xác Nhận Bình Chọn?</h4>
                <p className="text-xs text-stone-500 leading-relaxed text-center">
                  Bạn đang bình chọn ủng hộ <span className="font-bold text-stone-850">{selectedTeam === 'home' ? home.name : away.name}</span> với tỷ số dự đoán <span className="font-bold text-stone-850">{homeScoreInput} - {awayScoreInput}</span>.
                </p>
                
                <div className="bg-[#f7f5f0] border border-[#ebdcd0] rounded-xl p-3 flex justify-between items-center text-xs font-bold text-stone-700 font-display">
                  <span className="text-stone-500 font-medium">Số tiền bình chọn:</span>
                  <span className="text-[#2d382e] font-extrabold text-sm">{voteAmount.toLocaleString('vi-VN')} VND</span>
                </div>

                <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200/50 p-2.5 rounded-xl font-bold uppercase tracking-wide text-center">
                  ⚠️ Sau khi xác nhận, bạn không thể sửa đổi kết quả!
                </p>
              </div>
              <div className="flex gap-3 font-display text-xs font-bold">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowConfirmOverlay(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 text-stone-650 hover:bg-stone-55 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy quay lại
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalConfirm}
                  className="flex-1 py-2.5 px-4 bg-[#2d382e] text-white hover:bg-stone-850 rounded-xl shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-stone-300 border-t-white rounded-full animate-spin"></div>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <span>Đồng ý, gửi bầu</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SUB-OVERLAY 2: SUCCESS OVERLAY */}
        {/* ============================================================== */}
        {showSuccessOverlay && (
          <div className="absolute inset-0 bg-stone-55 z-30 flex items-center justify-center p-6 animate-fade-in">
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

        {/* ============================================================== */}
        {/* SUB-OVERLAY 3: VOTER LIST OVERLAY (POPUP TABLE) */}
        {/* ============================================================== */}
        {showVotersList && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm z-30 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-stone-200 shadow-2xl flex flex-col h-[75vh] max-h-[500px] animate-slide-in">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <h4 className="text-base font-bold text-stone-900 font-display">Danh Sách Người Bình Chọn</h4>
                <button 
                  onClick={() => setShowVotersList(false)}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Voter Table (Scrollable Columns) */}
              <div className="flex-1 overflow-y-auto mt-4 grid grid-cols-2 gap-4 divide-x divide-stone-100 min-h-0">
                {/* Home Column */}
                <div className="pr-1.5 space-y-3 overflow-y-auto max-h-[55vh] scrollbar-none">
                  <div className="flex items-center gap-1.5 font-bold text-xs font-display text-emerald-800 bg-emerald-50 px-2 py-1.5 rounded-lg sticky top-0 z-10 shadow-sm border border-emerald-100">
                    <FlagDisplay src={home.crest} name={home.name} sizeClass="w-5 h-3.5" />
                    <span className="truncate">{home.name} ({homeVoters.length})</span>
                  </div>
                  <div className="space-y-2">
                    {loadingDetails ? (
                      <p className="text-[10px] text-stone-400 italic text-center py-6 animate-pulse">Đang tải...</p>
                    ) : homeVoters.length === 0 ? (
                      <p className="text-[10px] text-stone-400 italic text-center py-6">Chưa có bình chọn</p>
                    ) : (
                      homeVoters.map((v, i) => (
                        <div key={i} className="flex items-center justify-between gap-1.5 text-[11px] font-medium text-stone-700 bg-stone-50/50 p-1.5 rounded-lg border border-stone-100/50 animate-fade-in">
                          <div className="flex items-center gap-2 truncate">
                            <img src={v.avatar} alt={v.name} className="w-6 h-6 rounded-full object-cover border border-stone-200 flex-shrink-0" />
                            <span className="truncate">{v.name}</span>
                          </div>
                          {v.amount && (
                            <span className="text-[9px] font-bold text-stone-500 bg-stone-200/50 px-1 py-0.5 rounded flex-shrink-0">
                              {(v.amount / 1000)}kđ
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Away Column */}
                <div className="pl-3 space-y-3 overflow-y-auto max-h-[55vh] scrollbar-none">
                  <div className="flex items-center gap-1.5 font-bold text-xs font-display text-amber-800 bg-amber-50 px-2 py-1.5 rounded-lg sticky top-0 z-10 shadow-sm border border-amber-100">
                    <FlagDisplay src={away.crest} name={away.name} sizeClass="w-5 h-3.5" />
                    <span className="truncate">{away.name} ({awayVoters.length})</span>
                  </div>
                  <div className="space-y-2">
                    {loadingDetails ? (
                      <p className="text-[10px] text-stone-400 italic text-center py-6 animate-pulse">Đang tải...</p>
                    ) : awayVoters.length === 0 ? (
                      <p className="text-[10px] text-stone-400 italic text-center py-6">Chưa có bình chọn</p>
                    ) : (
                      awayVoters.map((v, i) => (
                        <div key={i} className="flex items-center justify-between gap-1.5 text-[11px] font-medium text-stone-700 bg-stone-50/50 p-1.5 rounded-lg border border-stone-100/50 animate-fade-in">
                          <div className="flex items-center gap-2 truncate">
                            <img src={v.avatar} alt={v.name} className="w-6 h-6 rounded-full object-cover border border-stone-200 flex-shrink-0" />
                            <span className="truncate">{v.name}</span>
                          </div>
                          {v.amount && (
                            <span className="text-[9px] font-bold text-stone-500 bg-stone-200/50 px-1 py-0.5 rounded flex-shrink-0">
                              {(v.amount / 1000)}kđ
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              {/* Close Button */}
              <div className="pt-3.5 border-t border-stone-150 mt-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowVotersList(false)}
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors font-display"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
