export const STAGES = {
  GROUP: 'GROUP_STAGE',
  ROUND_32: 'ROUND_OF_32',
  ROUND_16: 'ROUND_OF_16',
  QUARTER: 'QUARTER_FINAL',
  SEMI: 'SEMI_FINAL',
  FINAL: 'FINAL'
};

export const getVnDateTime = (utcDateStr) => {
  if (!utcDateStr) return { date: '', time: '' };
  const dateObj = new Date(utcDateStr);
  const vnDate = new Date(dateObj.getTime() + 7 * 60 * 60 * 1000);
  const yyyy = vnDate.getUTCFullYear();
  const mm = String(vnDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(vnDate.getUTCDate()).padStart(2, '0');
  const hh = String(vnDate.getUTCHours()).padStart(2, '0');
  const min = String(vnDate.getUTCMinutes()).padStart(2, '0');
  return {
    date: `${yyyy}-${mm}-${dd}`,
    time: `${hh}:${min}`
  };
};

export const mapStageToVn = (stage) => {
  const stageMap = {
    'GROUP_STAGE': 'Vòng bảng',
    'ROUND_OF_32': 'Vòng 32 đội',
    'ROUND_OF_16': 'Vòng 16 đội',
    'QUARTER_FINAL': 'Tứ kết',
    'SEMI_FINAL': 'Bán kết',
    'FINAL': 'Chung kết'
  };
  return stageMap[stage] || stage;
};

export const mapGroupToVn = (group) => {
  if (!group) return null;
  const groupMap = {
    'GROUP_A': 'Bảng A',
    'GROUP_B': 'Bảng B',
    'GROUP_C': 'Bảng C',
    'GROUP_D': 'Bảng D',
    'GROUP_E': 'Bảng E',
    'GROUP_F': 'Bảng F',
    'GROUP_G': 'Bảng G',
    'GROUP_H': 'Bảng H',
    'GROUP_I': 'Bảng I',
    'GROUP_J': 'Bảng J',
    'GROUP_K': 'Bảng K',
    'GROUP_L': 'Bảng L'
  };
  return groupMap[group] || group;
};

export const getVotingStatus = (match) => {
  if (!match) return 'locked';
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY' || match.status === 'PAUSED';
  
  if (isFinished || isLive) {
    return 'locked';
  }

  const { date, time } = getVnDateTime(match.utcDate);
  if (!date || !time) return 'locked';
  
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const matchDate = new Date(year, month - 1, day, hour, minute, 0);
  const now = new Date();
  
  const diffMs = matchDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (diffMs <= 2 * 60 * 1000) {
    return 'locked'; // Locked starting 2 minutes before the match
  }
  if (diffHours > 12) {
    return 'not_open'; // Opens only 12 hours before the match
  }
  return 'open';
};
