import React from 'react';
import { getVotingStatus, getVnDateTime, mapStageToVn, mapGroupToVn } from '../data';

// Helper component to render flag or soccer ball placeholder
const FlagDisplay = ({ src, name }) => {
  if (!src) {
    return (
      <div className="w-7 h-5 rounded bg-stone-200 border border-stone-300 flex items-center justify-center flex-shrink-0 shadow-sm" title={name}>
        <span className="text-[10px] leading-none" role="img" aria-label="football">⚽</span>
      </div>
    );
  }
  return (
    <img 
      src={src} 
      alt={name} 
      className="w-7 h-5 object-cover rounded shadow-sm border border-stone-200 bg-stone-100 flex-shrink-0"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://flagcdn.com/w40/un.png'; // Fallback
      }}
    />
  );
};

export default function MatchCard({ match, realToday = '2026-06-12', prediction, onClick }) {
  const votingStatus = getVotingStatus(match);
  const home = match.homeTeam || { name: 'Chưa xác định', crest: '' };
  const away = match.awayTeam || { name: 'Chưa xác định', crest: '' };

  const { date: matchDateStr, time: matchTimeStr } = getVnDateTime(match.utcDate);

  const formatMatchDate = (dateString) => {
    if (!dateString) return '';
    if (dateString === realToday) return 'Hôm nay';
    
    // Parse date parts directly to avoid timezone offset issues
    const [year, month, day] = dateString.split('-').map(Number);
    const [curYear, curMonth, curDay] = realToday.split('-').map(Number);
    
    const d1 = new Date(year, month - 1, day);
    const d2 = new Date(curYear, curMonth - 1, curDay);
    const diffTime = d1 - d2;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Ngày mai';
    if (diffDays === -1) return 'Hôm qua';
    
    // Return formatted Vietnamese date, e.g. "15/06"
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`;
  };

  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY' || match.status === 'PAUSED';
  
  const hasPrediction = !!prediction;
  const showScores = isFinished || isLive;
  
  // Get scores from match data
  const homeScore = isFinished || isLive ? (match.score?.fullTime?.home ?? null) : null;
  const awayScore = isFinished || isLive ? (match.score?.fullTime?.away ?? null) : null;

  // Highlight winner style
  const homeWon = showScores && homeScore > awayScore;
  const awayWon = showScores && awayScore > homeScore;

  const stadium = 'SVĐ World Cup';

  return (
    <div 
      onClick={onClick}
      className="flex flex-col justify-between p-5 md:py-8 md:min-h-[160px] bg-wc-cream hover:bg-[#f3eee7] transition-all duration-200 text-wc-charcoal border-b border-stone-200/60 md:border-b-0 last:border-b-0 group relative overflow-hidden cursor-pointer"
    >
      {/* Header: Group or Stage name */}
      <div className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-4 flex items-center justify-between">
        <span>{match.group ? mapGroupToVn(match.group) : mapStageToVn(match.stage)}</span>
        {isLive && (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
            <span className="w-1 h-1 rounded-full bg-white"></span>
            TRỰC TIẾP
          </span>
        )}
        {isFinished && (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-stone-600 text-white text-[10px] font-bold">
            Đã kết thúc
          </span>
        )}
      </div>

      {/* Main Body */}
      <div className="flex items-center justify-between flex-grow">
        {/* Teams and Scores (Left & Center) */}
        <div className="flex items-center justify-between flex-grow mr-4">
          <div className="flex flex-col space-y-3 flex-grow">
            {/* Home Team */}
            <div className="flex items-center justify-between pr-2">
              <div className="flex items-center space-x-3">
                <FlagDisplay src={home.crest} name={home.name} />
                <span className={`text-base font-semibold font-display truncate max-w-[150px] sm:max-w-none ${
                  homeWon ? 'text-stone-900 font-bold' : (isFinished || hasPrediction) ? 'text-stone-400' : 'text-stone-800'
                }`}>
                  {home.name}
                </span>
              </div>
              {showScores && (
                <span className={`text-lg font-bold font-display ml-4 ${
                  homeWon ? 'text-stone-900 font-black' : (isFinished || hasPrediction) ? 'text-stone-400' : 'text-stone-800'
                }`}>
                  {homeScore}
                </span>
              )}
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-between pr-2">
              <div className="flex items-center space-x-3">
                <FlagDisplay src={away.crest} name={away.name} />
                <span className={`text-base font-semibold font-display truncate max-w-[150px] sm:max-w-none ${
                  awayWon ? 'text-stone-900 font-bold' : (isFinished || hasPrediction) ? 'text-stone-400' : 'text-stone-800'
                }`}>
                  {away.name}
                </span>
              </div>
              {showScores && (
                <span className={`text-lg font-bold font-display ml-4 ${
                  awayWon ? 'text-stone-900 font-black' : (isFinished || hasPrediction) ? 'text-stone-400' : 'text-stone-800'
                }`}>
                  {awayScore}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="h-12 w-[1px] bg-stone-300 flex-shrink-0 mx-2 md:mx-4"></div>

        {/* Date / Time / Status (Right Column) */}
        <div className="flex flex-col items-center justify-center text-center min-w-[90px] flex-shrink-0 pl-2">
          {hasPrediction ? (
            <>
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded text-emerald-700 bg-emerald-50 border border-emerald-200/50">
                Đã dự đoán
              </span>
              {prediction.amount && (
                <span className="text-[10px] text-[#2d382e] font-black font-display mb-0.5">
                  {(prediction.amount / 1000)}kđ
                </span>
              )}
              <span className="text-[10px] text-stone-400 font-medium font-display truncate max-w-[85px]" title={stadium}>
                {stadium.replace('SVĐ ', '')}
              </span>
            </>
          ) : isFinished ? (
            <>
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded text-stone-500 bg-stone-200/60">
                Kết thúc
              </span>
              <span className="text-[10px] text-stone-400 font-medium font-display truncate max-w-[85px]" title={stadium}>
                {stadium.replace('SVĐ ', '')}
              </span>
            </>
          ) : isLive ? (
            <>
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded text-red-600 bg-red-50">
                Hiệp 2
              </span>
              <span className="text-[10px] text-stone-400 font-medium font-display truncate max-w-[85px]" title={stadium}>
                {stadium.replace('SVĐ ', '')}
              </span>
            </>
          ) : votingStatus === 'locked' ? (
            <>
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1 px-2 py-0.5 rounded text-stone-600 bg-stone-200/70 border border-stone-300/40">
                Đã khóa bầu
              </span>
              <span className="text-[10px] text-stone-400 font-medium font-display truncate max-w-[85px]" title={stadium}>
                {stadium.replace('SVĐ ', '')}
              </span>
            </>
          ) : votingStatus === 'not_open' ? (
            <>
              <span className="text-xs font-semibold text-stone-500 tracking-wide mb-0.5 font-display">
                {formatMatchDate(matchDateStr)}
              </span>
              <span className="text-sm font-bold text-stone-900 font-display">
                {matchTimeStr}
              </span>
              <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest mt-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/40">
                Mở sau
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-semibold text-stone-500 tracking-wide mb-1 font-display">
                {formatMatchDate(matchDateStr)}
              </span>
              <span className="text-sm font-bold text-stone-950 font-display">
                {matchTimeStr}
              </span>
              <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mt-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-250/30">
                Đang mở
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
