import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, History, AlertCircle, Search, Wallet, CheckCircle } from 'lucide-react';
import { getVnDateTime } from '../data';

// Helper component to render flag or soccer ball placeholder
const FlagDisplay = ({ src, name, sizeClass = "w-6 h-4" }) => {
  if (!src) {
    return (
      <div className={`${sizeClass} rounded bg-stone-200 border border-stone-300 flex items-center justify-center flex-shrink-0 shadow-sm`} title={name}>
        <span className="text-[9px] leading-none" role="img" aria-label="football">⚽</span>
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

export default function VoteHistoryModal({ isOpen, onClose, predictions = {}, matches = [], onMatchClick }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'upcoming' | 'finished'

  // Combine predictions and matches, sorted by votedAt descending (newest first)
  const fullHistoryList = useMemo(() => {
    const list = [];
    Object.entries(predictions).forEach(([matchIdStr, pred]) => {
      const matchId = parseInt(matchIdStr, 10);
      const match = matches.find(m => m.id === matchId);
      if (match) {
        // Calculate prediction correctness if finished
        const isFinished = match.status === 'FINISHED';
        const actualHome = match.score?.fullTime?.home;
        const actualAway = match.score?.fullTime?.away;
        let isCorrect = false;
        
        if (isFinished && actualHome !== null && actualAway !== null) {
          const actualWinner = actualHome > actualAway ? 'home' : actualHome < actualAway ? 'away' : 'draw';
          isCorrect = pred.supportedTeam === actualWinner;
        }

        list.push({
          match,
          prediction: pred,
          votedAt: pred.votedAt ? new Date(pred.votedAt) : new Date(0),
          isFinished,
          isCorrect
        });
      }
    });
    // Sort by time (newest first)
    return list.sort((a, b) => b.votedAt - a.votedAt);
  }, [predictions, matches]);

  // Calculate stats summary
  const stats = useMemo(() => {
    let totalBets = fullHistoryList.length;
    let totalAmount = 0;
    let correctCount = 0;
    let finishedCount = 0;

    fullHistoryList.forEach(item => {
      totalAmount += item.prediction.amount || 0;
      if (item.isFinished) {
        finishedCount++;
        if (item.isCorrect) {
          correctCount++;
        }
      }
    });

    return {
      totalBets,
      totalAmount,
      correctCount,
      finishedCount,
      accuracyRate: finishedCount > 0 ? Math.round((correctCount / finishedCount) * 100) : 0
    };
  }, [fullHistoryList]);

  // Apply search and filter
  const filteredHistoryList = useMemo(() => {
    return fullHistoryList.filter(item => {
      // 1. Status Filter
      if (statusFilter === 'upcoming' && item.isFinished) return false;
      if (statusFilter === 'finished' && !item.isFinished) return false;

      // 2. Search Filter (by home or away team names)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const homeName = (item.match.homeTeam?.name || '').toLowerCase();
        const awayName = (item.match.awayTeam?.name || '').toLowerCase();
        if (!homeName.includes(query) && !awayName.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [fullHistoryList, searchTerm, statusFilter]);

  if (!isOpen) return null;

  // Format date-time for display
  const formatDateTime = (dateObj) => {
    if (isNaN(dateObj.getTime())) return 'N/A';
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    const hh = String(dateObj.getHours()).padStart(2, '0');
    const min = String(dateObj.getMinutes()).padStart(2, '0');
    return `${hh}:${min} - ${dd}/${mm}/${yyyy}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-stone-50 rounded-3xl shadow-2xl overflow-hidden z-10 animate-slide-in border border-stone-200 flex flex-col h-[90vh] max-h-[720px]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#2d382e] text-white border-b border-stone-800 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <History className="w-5 h-5 text-[#c29b38]" />
            <span className="text-sm font-bold font-display uppercase tracking-wider">Lịch Sử Bình Chọn của Bạn</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#242d25] hover:bg-[#343e35] text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Stats Dashboard Bar (Sticky/Static at top) */}
        {fullHistoryList.length > 0 && (
          <div className="bg-white border-b border-stone-200/80 px-6 py-4 grid grid-cols-3 gap-3 text-center flex-shrink-0">
            <div className="bg-[#f7f5f0] border border-stone-200/50 p-2 rounded-2xl">
              <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Tổng trận cược</div>
              <div className="text-lg font-black text-stone-850 font-display mt-0.5">{stats.totalBets}</div>
            </div>
            <div className="bg-[#f7f5f0] border border-stone-200/50 p-2 rounded-2xl">
              <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center justify-center gap-0.5">
                <Wallet className="w-3 h-3 text-emerald-600" /> Tổng tiền cược
              </div>
              <div className="text-lg font-black text-stone-850 font-display mt-0.5">
                {stats.totalAmount >= 1000 ? `${stats.totalAmount / 1000}kđ` : `${stats.totalAmount}đ`}
              </div>
            </div>
            <div className="bg-[#f7f5f0] border border-stone-200/50 p-2 rounded-2xl">
              <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center justify-center gap-0.5">
                <CheckCircle className="w-3 h-3 text-emerald-500" /> Tỷ lệ đoán đúng
              </div>
              <div className="text-lg font-black text-emerald-600 font-display mt-0.5">
                {stats.finishedCount > 0 ? `${stats.accuracyRate}%` : '--'}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters Controller (Sticky/Static at top) */}
        {fullHistoryList.length > 0 && (
          <div className="bg-white px-6 py-3 border-b border-stone-200/60 flex flex-col sm:flex-row gap-2.5 items-center justify-between flex-shrink-0">
            {/* Search Input */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Tìm kiếm đội tuyển..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#2d382e] focus:bg-white transition-all"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-stone-100 p-1 rounded-xl w-full sm:w-auto">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'upcoming', label: 'Sắp đấu' },
                { id: 'finished', label: 'Kết quả' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`flex-1 sm:flex-none px-4 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-white text-stone-850 shadow-sm'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0 bg-stone-50/40">
          {fullHistoryList.length === 0 ? (
            <div className="text-center py-12 space-y-3.5 bg-white rounded-2xl border border-stone-250/60 shadow-inner p-6">
              <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-stone-900 font-display uppercase tracking-wide">Chưa có bình chọn</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  Bạn chưa thực hiện bình chọn cho trận đấu nào. Hãy chọn một trận đấu để đưa ra dự đoán của mình nhé!
                </p>
              </div>
            </div>
          ) : filteredHistoryList.length === 0 ? (
            <div className="text-center py-12 text-stone-450 italic text-xs">
              Không tìm thấy trận đấu nào khớp với bộ lọc hoặc từ khóa tìm kiếm.
            </div>
          ) : (
            /* Optimized Responsive Grid for Desktop (2-cols) and Mobile (1-col) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredHistoryList.map(({ match, prediction, votedAt, isFinished, isCorrect }) => {
                const home = match.homeTeam || { name: 'Chưa xác định', crest: '' };
                const away = match.awayTeam || { name: 'Chưa xác định', crest: '' };
                const { date: matchDate, time: matchTime } = getVnDateTime(match.utcDate);
                const actualHome = match.score?.fullTime?.home;
                const actualAway = match.score?.fullTime?.away;

                return (
                  <div 
                    key={match.id}
                    onClick={() => {
                      onClose();
                      onMatchClick(match.id);
                    }}
                    className="bg-white rounded-2xl border border-stone-200/80 p-3.5 shadow-sm hover:border-[#c29b38] hover:shadow-md transition-all duration-200 cursor-pointer text-left space-y-2.5 flex flex-col justify-between group"
                  >
                    {/* Header info of match */}
                    <div className="flex justify-between items-center text-[9px] text-stone-400 font-bold border-b border-stone-100 pb-1.5 flex-shrink-0">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-stone-450" />
                        <span>{matchTime} - {matchDate.split('-').reverse().join('/')}</span>
                      </div>
                      
                      {isFinished ? (
                        <span className={`px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-[8px] ${
                          isCorrect 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' 
                            : 'bg-stone-100 text-stone-550 border border-stone-200'
                        }`}>
                          {isCorrect ? 'Đoán Trúng' : 'Đã Kết Thúc'}
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100 font-bold uppercase tracking-wider text-[8px] animate-pulse">
                          Sắp diễn ra
                        </span>
                      )}
                    </div>

                    {/* Match Versus Display */}
                    <div className="flex items-center justify-between py-0.5 flex-grow">
                      {/* Home Team */}
                      <div className="flex items-center space-x-1.5 w-5/12 min-w-0">
                        <FlagDisplay src={home.crest} name={home.name} />
                        <span className="text-[11px] font-bold text-stone-850 font-display truncate group-hover:text-[#2d382e] transition-colors">
                          {home.name}
                        </span>
                      </div>

                      {/* Score or VS */}
                      <div className="text-center w-2/12 flex flex-col justify-center items-center flex-shrink-0">
                        {isFinished ? (
                          <span className="text-[10px] font-black text-stone-900 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200/40">
                            {actualHome} - {actualAway}
                          </span>
                        ) : (
                          <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider bg-stone-50 px-1 py-0.5 rounded">
                            VS
                          </span>
                        )}
                      </div>

                      {/* Away Team */}
                      <div className="flex items-center justify-end space-x-1.5 w-5/12 text-right min-w-0">
                        <span className="text-[11px] font-bold text-stone-850 font-display truncate group-hover:text-[#2d382e] transition-colors">
                          {away.name}
                        </span>
                        <FlagDisplay src={away.crest} name={away.name} />
                      </div>
                    </div>

                    {/* User Prediction display details */}
                    <div className="bg-stone-50/60 rounded-xl p-2.5 border border-stone-150/40 space-y-1 text-[10px] font-medium flex-shrink-0">
                      <div className="flex justify-between items-center text-stone-600">
                        <span className="flex items-center gap-0.5">
                          Ủng hộ:
                        </span>
                        <span className="font-bold text-stone-900 font-display flex items-center gap-1">
                          <FlagDisplay 
                            src={prediction.supportedTeam === 'home' ? home.crest : away.crest} 
                            name={prediction.supportedTeam === 'home' ? home.name : away.name}
                            sizeClass="w-3.5 h-2.5"
                          />
                          {prediction.supportedTeam === 'home' ? home.name : away.name}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-stone-600">
                        <span>Dự đoán tỷ số:</span>
                        <span className="font-extrabold text-stone-900 bg-white px-1.5 py-0.5 rounded border border-stone-200/40 font-display text-[11px]">
                          {prediction.homeScore} - {prediction.awayScore}
                        </span>
                      </div>

                      {prediction.amount && (
                        <div className="flex justify-between items-center text-stone-600">
                          <span>Số tiền đặt:</span>
                          <span className="font-extrabold text-[#2d382e] font-display">
                            {prediction.amount.toLocaleString('vi-VN')} VND
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer - voted at time */}
                    <div className="flex items-center justify-end space-x-1 text-[8px] text-stone-400 font-bold pt-1 border-t border-stone-100 flex-shrink-0">
                      <Clock className="w-2.5 h-2.5 text-stone-405" />
                      <span>{formatDateTime(votedAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info warning */}
        <div className="p-3.5 bg-stone-100 border-t border-stone-200 text-center text-[10px] text-stone-400 font-semibold flex-shrink-0">
          Nhấp vào mỗi trận đấu để mở chi tiết và phân tích AI.
        </div>
      </div>
    </div>
  );
}
