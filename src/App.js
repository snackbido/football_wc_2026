import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Trophy, Calendar, Sparkles, ChevronLeft, ChevronRight, ListOrdered, RotateCcw, LogOut } from 'lucide-react';
import { MOCK_MATCHES, TEAMS, GROUPS, STAGES } from './data';
import MatchCard from './components/MatchCard';
import ScheduleModal from './components/ScheduleModal';
import PredictionModal from './components/PredictionModal';
import AuthModal from './components/AuthModal';
import MockEmailInbox from './components/MockEmailInbox';

export default function App() {
  const [matches] = useState(MOCK_MATCHES);
  const [selectedDate, setSelectedDate] = useState('2026-06-12'); // Start directly on June 12, 2026
  const scrollContainerRef = useRef(null);

  // Modal visibility states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activePredictMatchId, setActivePredictMatchId] = useState(null);
  const [pendingMatchId, setPendingMatchId] = useState(null); // Stores match card clicked before verification

  const [selectedGroupStandings, setSelectedGroupStandings] = useState('Bảng A');

  // Get the actual system date formatted as YYYY-MM-DD
  const realToday = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null); // verified user for active session (starts as Guest/null on reload)
  
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('wc2026_registered_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [emails, setEmails] = useState(() => {
    const saved = localStorage.getItem('wc2026_emails');
    return saved ? JSON.parse(saved) : [];
  });

  // Load predictions from localStorage
  const [predictions, setPredictions] = useState(() => {
    const saved = localStorage.getItem('wc2026_predictions');
    return saved ? JSON.parse(saved) : {};
  });

  // Load or initialize match vote counts for statistics (simulated vote pool)
  const [matchVotes, setMatchVotes] = useState(() => {
    const saved = localStorage.getItem('wc2026_match_votes');
    if (saved) return JSON.parse(saved);

    const initialVotes = {};
    MOCK_MATCHES.forEach(m => {
      const homeBase = Math.floor(Math.random() * 190) + 60;
      const awayBase = Math.floor(Math.random() * 190) + 60;
      initialVotes[m.id] = {
        homeVotes: homeBase,
        awayVotes: awayBase
      };
    });
    localStorage.setItem('wc2026_match_votes', JSON.stringify(initialVotes));
    return initialVotes;
  });

  // Programmatically generate dates from June 12, 2026, to July 20, 2026
  const availableDates = useMemo(() => {
    const start = new Date(2026, 5, 12);
    const end = new Date(2026, 6, 20);
    const list = [];
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const value = `${yyyy}-${mm}-${dd}`;
      const label = `${dd}/${mm}`;
      
      const weekdays = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
      const desc = weekdays[d.getDay()];
      
      list.push({ label, value, desc });
    }
    return list;
  }, []);

  // Scroll active date button to center
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeBtn = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedDate]);

  // Handle date navigation
  const handlePrevDate = () => {
    const currentIndex = availableDates.findIndex(d => d.value === selectedDate);
    if (currentIndex > 0) {
      setSelectedDate(availableDates[currentIndex - 1].value);
    }
  };

  const handleNextDate = () => {
    const currentIndex = availableDates.findIndex(d => d.value === selectedDate);
    if (currentIndex < availableDates.length - 1) {
      setSelectedDate(availableDates[currentIndex + 1].value);
    }
  };

  // Get matches for the selected date on the homepage
  const todayMatches = useMemo(() => {
    return matches.filter(m => m.date === selectedDate);
  }, [matches, selectedDate]);

  // Format date display for empty state
  const formattedSelectedDate = useMemo(() => {
    const [year, month, day] = selectedDate.split('-').map(Number);
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
    return `${weekdays[dateObj.getDay()]} - Ngày ${day}/${month}/${year}`;
  }, [selectedDate]);

  // Click on a MatchCard on the homepage
  const handleMatchCardClick = (matchId) => {
    if (currentUser) {
      // If already verified, allow voting/predicting
      setActivePredictMatchId(matchId);
    } else {
      // If Guest, prompt verification popup first
      setPendingMatchId(matchId);
      setIsAuthModalOpen(true);
    }
  };

  // Callback when a user registers from AuthModal
  const handleRegisterNewUser = (newUser) => {
    const updatedUsers = [...registeredUsers.filter(u => u.email !== newUser.email), newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('wc2026_registered_users', JSON.stringify(updatedUsers));

    // Send mock email with token
    const newEmail = {
      id: Date.now(),
      to: newUser.email,
      name: newUser.name,
      token: newUser.token,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedEmails = [newEmail, ...emails];
    setEmails(updatedEmails);
    localStorage.setItem('wc2026_emails', JSON.stringify(updatedEmails));
  };

  // Callback when user successfully verifies their token in AuthModal
  const handleVerifySuccess = (user) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);

    // If there was a pending match selection, immediately trigger prediction modal for it
    if (pendingMatchId) {
      setActivePredictMatchId(pendingMatchId);
      setPendingMatchId(null);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Clear simulated email inbox
  const handleClearEmails = () => {
    setEmails([]);
    localStorage.removeItem('wc2026_emails');
  };

  // Handle predictions submitted from the modal
  const handleVoteSubmit = (matchId, supportedTeam, homeScore, awayScore) => {
    const newPrediction = {
      supportedTeam,
      homeScore,
      awayScore,
      votedAt: new Date().toISOString()
    };
    const updatedPredictions = {
      ...predictions,
      [matchId]: newPrediction
    };
    setPredictions(updatedPredictions);
    localStorage.setItem('wc2026_predictions', JSON.stringify(updatedPredictions));

    const currentVotes = matchVotes[matchId] || { homeVotes: 100, awayVotes: 100 };
    const updatedVotes = {
      ...matchVotes,
      [matchId]: {
        homeVotes: supportedTeam === 'home' ? currentVotes.homeVotes + 1 : currentVotes.homeVotes,
        awayVotes: supportedTeam === 'away' ? currentVotes.awayVotes + 1 : currentVotes.awayVotes
      }
    };
    setMatchVotes(updatedVotes);
    localStorage.setItem('wc2026_match_votes', JSON.stringify(updatedVotes));
  };

  // Reset predictions and vote pool to default state
  const handleResetSimulation = () => {
    setPredictions({});
    localStorage.removeItem('wc2026_predictions');

    const initialVotes = {};
    MOCK_MATCHES.forEach(m => {
      const homeBase = Math.floor(Math.random() * 190) + 60;
      const awayBase = Math.floor(Math.random() * 190) + 60;
      initialVotes[m.id] = {
        homeVotes: homeBase,
        awayVotes: awayBase
      };
    });
    setMatchVotes(initialVotes);
    localStorage.setItem('wc2026_match_votes', JSON.stringify(initialVotes));
  };

  // Currently selected match object for the prediction modal
  const activePredictMatch = useMemo(() => {
    return matches.find(m => m.id === activePredictMatchId) || null;
  }, [matches, activePredictMatchId]);

  // Dynamically calculate standings based ONLY on official finished matches
  // User predictions DO NOT affect group standings anymore
  const groupStandings = useMemo(() => {
    const teamsInGroup = GROUPS[selectedGroupStandings] || [];
    const stats = {};

    teamsInGroup.forEach(teamCode => {
      stats[teamCode] = {
        code: teamCode,
        name: TEAMS[teamCode]?.name || teamCode,
        flagCode: TEAMS[teamCode]?.flagCode || teamCode,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0,
        points: 0
      };
    });

    matches.forEach(match => {
      if (match.stage === STAGES.GROUP && match.group === selectedGroupStandings) {
        const homeCode = match.homeTeam;
        const awayCode = match.awayTeam;

        if (stats[homeCode] && stats[awayCode]) {
          // Calculation strictly isolated to officially finished matches
          if (match.status === 'finished') {
            const hScore = match.homeScore;
            const aScore = match.awayScore;

            stats[homeCode].played += 1;
            stats[awayCode].played += 1;
            stats[homeCode].goalsFor += hScore;
            stats[homeCode].goalsAgainst += aScore;
            stats[awayCode].goalsFor += aScore;
            stats[awayCode].goalsAgainst += hScore;

            if (hScore > aScore) {
              stats[homeCode].won += 1;
              stats[homeCode].points += 3;
              stats[awayCode].lost += 1;
            } else if (hScore < aScore) {
              stats[awayCode].won += 1;
              stats[awayCode].points += 3;
              stats[homeCode].lost += 1;
            } else {
              stats[homeCode].drawn += 1;
              stats[homeCode].points += 1;
              stats[awayCode].drawn += 1;
              stats[awayCode].points += 1;
            }
          }
        }
      }
    });

    const standingsList = Object.values(stats).map(team => {
      team.goalDiff = team.goalsFor - team.goalsAgainst;
      return team;
    });

    return standingsList.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.name.localeCompare(b.name);
    });
  }, [matches, selectedGroupStandings]);

  return (
    <div className="min-h-screen flex flex-col pb-12">
      {/* Premium Header */}
      <header className="bg-[#2d382e] text-white py-6 md:py-8 px-6 border-b border-[#3e4d3f] shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="bg-[#c29b38] p-2.5 rounded-2xl text-stone-950 shadow-md transform rotate-3">
              <Trophy className="w-7 h-7 stroke-[1.75]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-stone-100 to-[#c29b38] bg-clip-text text-transparent">
                  WORLD CUP 2026
                </h1>
                <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#c29b38]/20 text-[#c29b38] border border-[#c29b38]/30 uppercase">
                  Mùa hè 2026
                </span>
              </div>
              <p className="text-xs text-stone-300 font-medium">Bảng bình chọn tỷ số & Cập nhật thứ hạng giải đấu</p>
            </div>
          </div>

          {/* User profile / Guest Indicator */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="flex items-center bg-[#212921] rounded-2xl px-3.5 py-1.5 border border-stone-700/60 shadow-inner">
              {currentUser ? (
                <div className="flex items-center space-x-2.5">
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-7 h-7 rounded-full object-cover border border-[#c29b38] shadow-sm bg-stone-100" 
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white font-display truncate max-w-[100px]">
                      {currentUser.name}
                    </span>
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-none mt-0.5">
                      Đã xác thực
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-1 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors ml-1.5"
                    title="Đăng xuất khỏi phiên"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-stone-300 font-display">
                      Chế độ: Khách
                    </span>
                    <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest leading-none mt-0.5">
                      Chỉ được xem
                    </span>
                  </div>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="px-3 py-1 bg-[#c29b38] hover:bg-[#d4ac4b] text-stone-950 text-[10px] font-black uppercase rounded-lg transition-colors font-display"
                  >
                    Xác thực để bầu
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleResetSimulation}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-700 bg-[#242d25] text-stone-300 hover:text-white hover:bg-stone-800 transition-all duration-200"
              title="Khôi phục trạng thái mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đặt lại dự đoán</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 text-stone-800 hover:bg-stone-200 hover:text-stone-900 font-bold rounded-xl shadow-md transition-all duration-200 font-display text-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              Xem Lịch Giải
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 mt-8 flex-grow w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column: Date Slider & Daily Matches */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2 font-display">
                <span className="w-2.5 h-2.5 rounded bg-[#2d382e]"></span>
                Lịch đấu theo ngày
              </h2>
              <span className="text-xs text-stone-400 font-medium">{formattedSelectedDate}</span>
            </div>

            {/* Programmatic Dates Slider starting from June 12 */}
            <div className="flex items-center justify-between gap-2 bg-stone-50 p-2 rounded-2xl border border-stone-200/40">
              <button
                onClick={handlePrevDate}
                disabled={selectedDate === availableDates[0].value}
                className="p-2.5 rounded-xl hover:bg-stone-200 text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all flex-shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div 
                ref={scrollContainerRef}
                className="flex-1 flex overflow-x-auto scrollbar-none gap-2 px-2 scroll-smooth py-1"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {availableDates.map((d) => {
                  const isActive = selectedDate === d.value;
                  return (
                    <button
                      key={d.value}
                      data-active={isActive ? "true" : "false"}
                      onClick={() => setSelectedDate(d.value)}
                      className={`flex-shrink-0 w-16 flex flex-col items-center py-2 px-1 rounded-xl transition-all duration-200 scroll-snap-align-start ${
                        isActive
                          ? 'bg-[#2d382e] text-[#c29b38] shadow-sm font-semibold scale-105'
                          : 'text-stone-500 hover:bg-stone-200/50 hover:text-stone-800'
                      }`}
                    >
                      <span className="text-xs font-bold font-display">{d.label}</span>
                      <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-80">{d.desc}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextDate}
                disabled={selectedDate === availableDates[availableDates.length - 1].value}
                className="p-2.5 rounded-xl hover:bg-stone-200 text-stone-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all flex-shrink-0"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Matches Panel / Empty State */}
          <div className="space-y-4">
            {todayMatches.length === 0 ? (
              <div className="bg-wc-cream rounded-3xl p-16 border border-stone-200/80 shadow-inner text-center animate-fade-in flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-stone-200/60 border border-stone-300 flex items-center justify-center text-3xl mb-4 text-stone-400">
                  ⚽
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-display mb-1 uppercase tracking-tight">Chưa có</h3>
                <p className="text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
                  Không có trận đấu nào diễn ra vào ngày này. Hãy bấm sang ngày khác trên thanh trượt để xem lịch.
                </p>
                <button
                  onClick={() => setSelectedDate('2026-06-12')}
                  className="mt-6 px-4 py-2 bg-[#2d382e] hover:bg-stone-800 text-white text-xs font-bold rounded-xl shadow transition-colors"
                >
                  Quay lại ngày thi đấu đầu tiên (12/06)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual grid matching the user's template */}
                <div className="bg-wc-cream rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm divide-y md:divide-y-0 md:divide-x divide-stone-200/60 grid grid-cols-1 md:grid-cols-2">
                  {todayMatches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      realToday={realToday}
                      prediction={predictions[match.id]}
                      onClick={() => handleMatchCardClick(match.id)}
                    />
                  ))}
                  {/* Fill empty grid element on desktop */}
                  {todayMatches.length % 2 !== 0 && (
                    <div className="hidden md:flex bg-wc-cream/40 items-center justify-center p-5 text-stone-400 text-xs italic">
                      Hết lịch thi đấu trong ngày
                    </div>
                  )}
                </div>

                {/* Simulation Prompt */}
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200/60 rounded-2xl text-emerald-800 text-xs">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Quyền hạn xác thực: </span> 
                    Để bảo vệ tính minh bạch, chỉ tài khoản thành viên **Đã xác thực** (qua mã Token nhận được từ Email) mới được tham gia bình chọn dự đoán tỷ số. Thành viên chưa đăng nhập chỉ được quyền xem thông tin.
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Group Standings Widget */}
        <section className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2 font-display">
                <ListOrdered className="w-4 h-4 text-[#2d382e]" />
                Bảng xếp hạng
              </h2>
              <select
                value={selectedGroupStandings}
                onChange={(e) => setSelectedGroupStandings(e.target.value)}
                className="text-xs font-bold bg-stone-100 border border-stone-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2d382e] text-stone-700"
              >
                {Object.keys(GROUPS).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Standings Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 pl-1 text-center w-8">#</th>
                    <th className="py-2.5">Đội tuyển</th>
                    <th className="py-2.5 text-center w-8">Tr</th>
                    <th className="py-2.5 text-center w-8">HS</th>
                    <th className="py-2.5 text-center w-8 font-extrabold text-[#2d382e]">Đ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {groupStandings.map((team, index) => {
                    const isTopTwo = index < 2;
                    return (
                      <tr key={team.code} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3 pl-1 text-center font-bold">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                            isTopTwo ? 'bg-emerald-50 text-emerald-700 text-[10px]' : 'text-stone-400'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-3 font-semibold text-stone-800 font-display flex items-center space-x-2">
                          <img 
                            src={`https://flagcdn.com/w40/${team.flagCode.toLowerCase()}.png`} 
                            alt={team.name} 
                            className="w-5 h-3.5 object-cover rounded-sm border border-stone-100 shadow-sm flex-shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://flagcdn.com/w40/un.png';
                            }}
                          />
                          <span className="truncate max-w-[100px] sm:max-w-none">{team.name}</span>
                        </td>
                        <td className="py-3 text-center text-stone-600 font-medium">{team.played}</td>
                        <td className={`py-3 text-center font-medium ${
                          team.goalDiff > 0 ? 'text-emerald-600' : team.goalDiff < 0 ? 'text-red-500' : 'text-stone-500'
                        }`}>
                          {team.goalDiff > 0 ? `+${team.goalDiff}` : team.goalDiff}
                        </td>
                        <td className="py-3 text-center font-bold text-stone-900 text-sm">{team.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3.5 border-t border-stone-100 text-[10px] text-stone-400 font-medium leading-relaxed">
              <div className="flex items-center gap-1.5 text-emerald-700 mb-1 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Top 2 đi tiếp vào Vòng 32 đội
              </div>
              Bảng xếp hạng chỉ phản ánh điểm số từ các trận đấu chính thức đã kết thúc. Các phiếu dự đoán tỷ số cá nhân không tác động đến điểm số này.
            </div>
          </div>

          <div className="bg-[#2d382e] text-stone-200 p-5 rounded-3xl border border-[#3e4d3f] shadow-sm relative overflow-hidden">
            <div className="absolute right-0 bottom-0 translate-y-6 translate-x-6 opacity-5 pointer-events-none">
              <Trophy className="w-44 h-44" />
            </div>

            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider font-display">Thông tin VCK 2026</h3>
            <p className="text-xs text-stone-300 leading-relaxed font-medium">
              Vòng chung kết FIFA World Cup 2026 có sự tham dự của <strong>48 đội tuyển</strong>, chia thành <strong>12 bảng đấu</strong> (từ A đến L). Giải đấu được đồng tổ chức bởi 3 nước: <strong>Mexico, Hoa Kỳ và Canada</strong> từ ngày 11/06/2026 đến 19/07/2026.
            </p>
            <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-[#c29b38]">
              <span>48 ĐỘI • 104 TRẬN ĐẤU</span>
              <span>16 THÀNH PHỐ</span>
            </div>
          </div>
        </section>

      </main>

      {/* Schedule Modal Popup */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        realToday={realToday}
        predictions={predictions}
        onMatchClick={handleMatchCardClick}
      />

      {/* Interactive Prediction Modal Popup */}
      <PredictionModal
        isOpen={activePredictMatchId !== null}
        onClose={() => setActivePredictMatchId(null)}
        match={activePredictMatch}
        prediction={predictions[activePredictMatchId]}
        votes={matchVotes[activePredictMatchId]}
        onVote={handleVoteSubmit}
      />

      {/* Authentication / Register Modal Popup */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingMatchId(null);
        }}
        registeredUsers={registeredUsers}
        onVerifySuccess={handleVerifySuccess}
        onRegisterNewUser={handleRegisterNewUser}
      />

      {/* Floating Simulated Email Client Box */}
      <MockEmailInbox
        emails={emails}
        onClear={handleClearEmails}
      />
    </div>
  );
}
