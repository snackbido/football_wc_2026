import React, { useState, useMemo } from 'react';
import { X, Search, Calendar } from 'lucide-react';
import { STAGES, MOCK_MATCHES, TEAMS } from '../data';
import MatchCard from './MatchCard';

export default function ScheduleModal({ isOpen, onClose, realToday, predictions = {}, onMatchClick }) {
  const [activeStage, setActiveStage] = useState(STAGES.GROUP);
  const [searchQuery, setSearchQuery] = useState('');

  // Get list of unique stages including Round of 32
  const stageList = [
    STAGES.GROUP,
    STAGES.ROUND_32,
    STAGES.ROUND_16,
    STAGES.QUARTER,
    STAGES.SEMI,
    STAGES.FINAL
  ];

  // Filter matches based on stage and search query
  const filteredMatches = useMemo(() => {
    return MOCK_MATCHES.filter((match) => {
      const matchesStage = match.stage === activeStage;
      if (!matchesStage) return false;

      if (!searchQuery) return true;

      const q = searchQuery.toLowerCase().trim();
      const home = TEAMS[match.homeTeam]?.name.toLowerCase() || match.homeTeam.toLowerCase();
      const away = TEAMS[match.awayTeam]?.name.toLowerCase() || match.awayTeam.toLowerCase();
      const grp = match.group?.toLowerCase() || '';
      
      return home.includes(q) || away.includes(q) || grp.includes(q);
    });
  }, [activeStage, searchQuery]);

  // Group matches by Date for cleaner presentation
  const groupedMatches = useMemo(() => {
    const groups = {};
    filteredMatches.forEach((match) => {
      if (!groups[match.date]) {
        groups[match.date] = [];
      }
      groups[match.date].push(match);
    });
    return groups;
  }, [filteredMatches]);

  const formatDateHeader = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    const weekdays = [
      'Chủ Nhật',
      'Thứ Hai',
      'Thứ Ba',
      'Thứ Tư',
      'Thứ Năm',
      'Thứ Sáu',
      'Thứ Bảy'
    ];
    const weekday = weekdays[dateObj.getDay()];
    
    return `${weekday}, Ngày ${day.toString().padStart(2, '0')} Tháng ${month.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-stone-950/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in">
      {/* Backdrop closer */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Content container */}
      <div className="relative w-full h-full md:h-[90vh] md:max-w-5xl bg-stone-50 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-slide-in border border-stone-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#2d382e] text-stone-100 border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="bg-[#c29b38] p-2 rounded-lg text-stone-950">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white font-display">Lịch Thi Đấu Toàn Giải</h2>
              <p className="text-xs text-stone-300">FIFA World Cup 2026 • Mexico, Mỹ & Canada</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors duration-150"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search toolbar */}
        <div className="p-4 md:p-6 bg-white border-b border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Horizontal Stage Tabs */}
          <div className="flex space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none scroll-smooth -mx-4 px-4 md:mx-0 md:px-0">
            {stageList.map((stage) => (
              <button
                key={stage}
                onClick={() => {
                  setActiveStage(stage);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-200 font-display ${
                  activeStage === stage
                    ? 'bg-[#2d382e] text-[#c29b38] shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm bảng đấu, đội tuyển..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-stone-100 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d382e] focus:bg-white transition-all font-medium text-stone-800 placeholder-stone-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        {/* Matches list container (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-stone-50/50">
          {filteredMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400 text-center">
              <Calendar className="w-12 h-12 stroke-[1.25] mb-3 text-stone-300" />
              <p className="text-base font-semibold">Không tìm thấy trận đấu nào</p>
              <p className="text-xs mt-1">Thử thay đổi từ khóa tìm kiếm hoặc lọc vòng đấu khác</p>
            </div>
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto">
              {Object.keys(groupedMatches).sort().map((dateStr) => {
                const dayMatches = groupedMatches[dateStr];
                
                return (
                  <div key={dateStr} className="space-y-3">
                    {/* Date Header */}
                    <div className="flex items-center space-x-2 text-stone-600 font-semibold text-sm pl-1 font-display">
                      <span className="w-1.5 h-3 rounded-full bg-[#c29b38]"></span>
                      <span>{formatDateHeader(dateStr)}</span>
                    </div>

                    {/* Double-column match grid matching the image layout style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 bg-wc-cream rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm md:divide-x divide-stone-200/60">
                      {dayMatches.map((match) => (
                        <MatchCard
                          key={match.id}
                          match={match}
                          realToday={realToday}
                          prediction={predictions[match.id]}
                          onClick={() => onMatchClick(match.id)}
                        />
                      ))}
                      {/* Placeholder cell if odd number of matches on desktop to preserve border styling */}
                      {dayMatches.length % 2 !== 0 && (
                        <div className="hidden md:flex bg-wc-cream/40 items-center justify-center p-5 border-l-0 text-stone-300 text-xs italic">
                          Hết trận đấu trong ngày
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3.5 bg-stone-100 border-t border-stone-200/60 text-center text-[11px] font-medium text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>* Giờ thi đấu được tính theo múi giờ Việt Nam (GMT+7)</span>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-wc-cream border border-stone-300"></span> Chưa đấu
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-stone-200"></span> Đã kết thúc
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
