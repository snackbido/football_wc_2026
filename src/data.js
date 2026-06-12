export const TEAMS = {
  // Bảng A
  mx: { name: 'Mexico', flagCode: 'mx', group: 'Bảng A' },
  kr: { name: 'Hàn Quốc', flagCode: 'kr', group: 'Bảng A' },
  za: { name: 'Nam Phi', flagCode: 'za', group: 'Bảng A' },
  cz: { name: 'CH Séc', flagCode: 'cz', group: 'Bảng A' },

  // Bảng B
  ca: { name: 'Canada', flagCode: 'ca', group: 'Bảng B' },
  ch: { name: 'Thụy Sĩ', flagCode: 'ch', group: 'Bảng B' },
  qa: { name: 'Qatar', flagCode: 'qa', group: 'Bảng B' },
  ba: { name: 'Bosnia', flagCode: 'ba', group: 'Bảng B' },

  // Bảng C
  br: { name: 'Brazil', flagCode: 'br', group: 'Bảng C' },
  ma: { name: 'Maroc', flagCode: 'ma', group: 'Bảng C' },
  sct: { name: 'Scotland', flagCode: 'gb-sct', group: 'Bảng C' },
  ht: { name: 'Haiti', flagCode: 'ht', group: 'Bảng C' },

  // Bảng D
  us: { name: 'Mỹ', flagCode: 'us', group: 'Bảng D' },
  au: { name: 'Úc', flagCode: 'au', group: 'Bảng D' },
  py: { name: 'Paraguay', flagCode: 'py', group: 'Bảng D' },
  tr: { name: 'Thổ Nhĩ Kỳ', flagCode: 'tr', group: 'Bảng D' },

  // Bảng E
  de: { name: 'Đức', flagCode: 'de', group: 'Bảng E' },
  ec: { name: 'Ecuador', flagCode: 'ec', group: 'Bảng E' },
  ci: { name: 'Bờ Biển Ngà', flagCode: 'ci', group: 'Bảng E' },
  cw: { name: 'Curazao', flagCode: 'cw', group: 'Bảng E' },

  // Bảng F
  nl: { name: 'Hà Lan', flagCode: 'nl', group: 'Bảng F' },
  jp: { name: 'Nhật Bản', flagCode: 'jp', group: 'Bảng F' },
  tn: { name: 'Tunisia', flagCode: 'tn', group: 'Bảng F' },
  se: { name: 'Thụy Điển', flagCode: 'se', group: 'Bảng F' },

  // Bảng G
  be: { name: 'Bỉ', flagCode: 'be', group: 'Bảng G' },
  ir: { name: 'Iran', flagCode: 'ir', group: 'Bảng G' },
  eg: { name: 'Ai Cập', flagCode: 'eg', group: 'Bảng G' },
  nz: { name: 'New Zealand', flagCode: 'nz', group: 'Bảng G' },

  // Bảng H
  es: { name: 'Tây Ban Nha', flagCode: 'es', group: 'Bảng H' },
  uy: { name: 'Uruguay', flagCode: 'uy', group: 'Bảng H' },
  sa: { name: 'Ả Rập Xê Út', flagCode: 'sa', group: 'Bảng H' },
  cv: { name: 'Cape Verde', flagCode: 'cv', group: 'Bảng H' },

  // Bảng I
  fr: { name: 'Pháp', flagCode: 'fr', group: 'Bảng I' },
  sn: { name: 'Senegal', flagCode: 'sn', group: 'Bảng I' },
  no: { name: 'Na Uy', flagCode: 'no', group: 'Bảng I' },
  iq: { name: 'Iraq', flagCode: 'iq', group: 'Bảng I' },

  // Bảng J
  ar: { name: 'Argentina', flagCode: 'ar', group: 'Bảng J' },
  at: { name: 'Áo', flagCode: 'at', group: 'Bảng J' },
  dz: { name: 'Algeria', flagCode: 'dz', group: 'Bảng J' },
  jo: { name: 'Jordan', flagCode: 'jo', group: 'Bảng J' },

  // Bảng K
  pt: { name: 'Bồ Đào Nha', flagCode: 'pt', group: 'Bảng K' },
  co: { name: 'Colombia', flagCode: 'co', group: 'Bảng K' },
  uz: { name: 'Uzbekistan', flagCode: 'uz', group: 'Bảng K' },
  cd: { name: 'CHDC Congo', flagCode: 'cd', group: 'Bảng K' },

  // Bảng L
  eng: { name: 'Anh', flagCode: 'gb-eng', group: 'Bảng L' },
  hr: { name: 'Croatia', flagCode: 'hr', group: 'Bảng L' },
  pa: { name: 'Panama', flagCode: 'pa', group: 'Bảng L' },
  gh: { name: 'Ghana', flagCode: 'gh', group: 'Bảng L' },
};

export const GROUPS = {
  'Bảng A': ['mx', 'kr', 'za', 'cz'],
  'Bảng B': ['ca', 'ch', 'qa', 'ba'],
  'Bảng C': ['br', 'ma', 'sct', 'ht'],
  'Bảng D': ['us', 'au', 'py', 'tr'],
  'Bảng E': ['de', 'ec', 'ci', 'cw'],
  'Bảng F': ['nl', 'jp', 'tn', 'se'],
  'Bảng G': ['be', 'ir', 'eg', 'nz'],
  'Bảng H': ['es', 'uy', 'sa', 'cv'],
  'Bảng I': ['fr', 'sn', 'no', 'iq'],
  'Bảng J': ['ar', 'at', 'dz', 'jo'],
  'Bảng K': ['pt', 'co', 'uz', 'cd'],
  'Bảng L': ['eng', 'hr', 'pa', 'gh'],
};

export const STAGES = {
  GROUP: 'Vòng bảng',
  ROUND_32: 'Vòng 32 đội',
  ROUND_16: 'Vòng 16 đội',
  QUARTER: 'Tứ kết',
  SEMI: 'Bán kết',
  FINAL: 'Chung kết'
};

export const MOCK_MATCHES = [
  // ==========================================
  // NGÀY 12/06/2026
  // ==========================================
  {
    id: 'm1',
    stage: STAGES.GROUP,
    group: 'Bảng A',
    homeTeam: 'mx',
    awayTeam: 'za',
    date: '2026-06-12',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Mexico City'
  },
  {
    id: 'm2',
    stage: STAGES.GROUP,
    group: 'Bảng A',
    homeTeam: 'kr',
    awayTeam: 'cz',
    date: '2026-06-12',
    time: '09:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Guadalajara'
  },

  // ==========================================
  // NGÀY 13/06/2026
  // ==========================================
  {
    id: 'm3',
    stage: STAGES.GROUP,
    group: 'Bảng B',
    homeTeam: 'ca',
    awayTeam: 'ba',
    date: '2026-06-13',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Toronto'
  },
  {
    id: 'm4',
    stage: STAGES.GROUP,
    group: 'Bảng D',
    homeTeam: 'us',
    awayTeam: 'py',
    date: '2026-06-13',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Los Angeles'
  },

  // ==========================================
  // NGÀY 14/06/2026
  // ==========================================
  {
    id: 'm5',
    stage: STAGES.GROUP,
    group: 'Bảng B',
    homeTeam: 'qa',
    awayTeam: 'ch',
    date: '2026-06-14',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ San Francisco Bay Area'
  },
  {
    id: 'm6',
    stage: STAGES.GROUP,
    group: 'Bảng C',
    homeTeam: 'br',
    awayTeam: 'ma',
    date: '2026-06-14',
    time: '05:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ New York New Jersey'
  },
  {
    id: 'm7',
    stage: STAGES.GROUP,
    group: 'Bảng C',
    homeTeam: 'ht',
    awayTeam: 'sct',
    date: '2026-06-14',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Boston'
  },
  {
    id: 'm8',
    stage: STAGES.GROUP,
    group: 'Bảng D',
    homeTeam: 'au',
    awayTeam: 'tr',
    date: '2026-06-14',
    time: '11:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ BC Place Vancouver'
  },

  // ==========================================
  // NGÀY 15/06/2026
  // ==========================================
  {
    id: 'm9',
    stage: STAGES.GROUP,
    group: 'Bảng E',
    homeTeam: 'de',
    awayTeam: 'cw',
    date: '2026-06-15',
    time: '00:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Houston'
  },
  {
    id: 'm10',
    stage: STAGES.GROUP,
    group: 'Bảng F',
    homeTeam: 'nl',
    awayTeam: 'jp',
    date: '2026-06-15',
    time: '03:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Dallas'
  },
  {
    id: 'm11',
    stage: STAGES.GROUP,
    group: 'Bảng E',
    homeTeam: 'ci',
    awayTeam: 'ec',
    date: '2026-06-15',
    time: '06:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Philadelphia'
  },
  {
    id: 'm12',
    stage: STAGES.GROUP,
    group: 'Bảng F',
    homeTeam: 'se',
    awayTeam: 'tn',
    date: '2026-06-15',
    time: '09:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Monterrey'
  },
  {
    id: 'm13',
    stage: STAGES.GROUP,
    group: 'Bảng H',
    homeTeam: 'es',
    awayTeam: 'cv',
    date: '2026-06-15',
    time: '23:00', // Đưa về ngày 15/6 như chú thích 23:00 (15/6)
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Atlanta'
  },

  // ==========================================
  // NGÀY 16/06/2026
  // ==========================================
  {
    id: 'm14',
    stage: STAGES.GROUP,
    group: 'Bảng G',
    homeTeam: 'be',
    awayTeam: 'eg',
    date: '2026-06-16',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Seattle'
  },
  {
    id: 'm15',
    stage: STAGES.GROUP,
    group: 'Bảng H',
    homeTeam: 'sa',
    awayTeam: 'uy',
    date: '2026-06-16',
    time: '05:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Miami'
  },
  {
    id: 'm16',
    stage: STAGES.GROUP,
    group: 'Bảng G',
    homeTeam: 'ir',
    awayTeam: 'nz',
    date: '2026-06-16',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Los Angeles'
  },

  // ==========================================
  // NGÀY 17/06/2026
  // ==========================================
  {
    id: 'm17',
    stage: STAGES.GROUP,
    group: 'Bảng I',
    homeTeam: 'fr',
    awayTeam: 'sn',
    date: '2026-06-17',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ New York New Jersey'
  },
  {
    id: 'm18',
    stage: STAGES.GROUP,
    group: 'Bảng I',
    homeTeam: 'iq',
    awayTeam: 'no',
    date: '2026-06-17',
    time: '05:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Boston'
  },
  {
    id: 'm19',
    stage: STAGES.GROUP,
    group: 'Bảng J',
    homeTeam: 'ar',
    awayTeam: 'dz',
    date: '2026-06-17',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Kansas City'
  },
  {
    id: 'm20',
    stage: STAGES.GROUP,
    group: 'Bảng J',
    homeTeam: 'at',
    awayTeam: 'jo',
    date: '2026-06-17',
    time: '11:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ San Francisco Bay Area'
  },

  // ==========================================
  // NGÀY 18/06/2026
  // ==========================================
  {
    id: 'm21',
    stage: STAGES.GROUP,
    group: 'Bảng K',
    homeTeam: 'pt',
    awayTeam: 'cd',
    date: '2026-06-18',
    time: '00:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Houston'
  },
  {
    id: 'm22',
    stage: STAGES.GROUP,
    group: 'Bảng L',
    homeTeam: 'eng',
    awayTeam: 'hr',
    date: '2026-06-18',
    time: '03:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Dallas'
  },
  {
    id: 'm23',
    stage: STAGES.GROUP,
    group: 'Bảng L',
    homeTeam: 'gh',
    awayTeam: 'pa',
    date: '2026-06-18',
    time: '06:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Toronto'
  },
  {
    id: 'm24',
    stage: STAGES.GROUP,
    group: 'Bảng K',
    homeTeam: 'uz',
    awayTeam: 'co',
    date: '2026-06-18',
    time: '09:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Mexico City'
  },
  {
    id: 'm25',
    stage: STAGES.GROUP,
    group: 'Bảng A',
    homeTeam: 'cz',
    awayTeam: 'za',
    date: '2026-06-18',
    time: '23:00', // Đưa về ngày 18/6 như chú thích 23:00 (18/6)
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Atlanta'
  },

  // ==========================================
  // NGÀY 19/06/2026
  // ==========================================
  {
    id: 'm26',
    stage: STAGES.GROUP,
    group: 'Bảng B',
    homeTeam: 'ch',
    awayTeam: 'ba',
    date: '2026-06-19',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Los Angeles'
  },
  {
    id: 'm27',
    stage: STAGES.GROUP,
    group: 'Bảng B',
    homeTeam: 'ca',
    awayTeam: 'qa',
    date: '2026-06-19',
    time: '05:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ BC Place Vancouver'
  },
  {
    id: 'm28',
    stage: STAGES.GROUP,
    group: 'Bảng A',
    homeTeam: 'mx',
    awayTeam: 'kr',
    date: '2026-06-19',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Guadalajara'
  },

  // ==========================================
  // NGÀY 20/06/2026
  // ==========================================
  {
    id: 'm29',
    stage: STAGES.GROUP,
    group: 'Bảng D',
    homeTeam: 'us',
    awayTeam: 'au',
    date: '2026-06-20',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Seattle'
  },
  {
    id: 'm30',
    stage: STAGES.GROUP,
    group: 'Bảng C',
    homeTeam: 'sct',
    awayTeam: 'ma',
    date: '2026-06-20',
    time: '05:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Boston'
  },
  {
    id: 'm31',
    stage: STAGES.GROUP,
    group: 'Bảng C',
    homeTeam: 'br',
    awayTeam: 'ht',
    date: '2026-06-20',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Philadelphia'
  },
  {
    id: 'm32',
    stage: STAGES.GROUP,
    group: 'Bảng D',
    homeTeam: 'tr',
    awayTeam: 'py',
    date: '2026-06-20',
    time: '11:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ San Francisco Bay Area'
  },

  // ==========================================
  // NGÀY 21/06/2026
  // ==========================================
  {
    id: 'm33',
    stage: STAGES.GROUP,
    group: 'Bảng F',
    homeTeam: 'nl',
    awayTeam: 'se',
    date: '2026-06-21',
    time: '00:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Houston'
  },
  {
    id: 'm34',
    stage: STAGES.GROUP,
    group: 'Bảng E',
    homeTeam: 'de',
    awayTeam: 'ci',
    date: '2026-06-21',
    time: '03:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Toronto'
  },
  {
    id: 'm35',
    stage: STAGES.GROUP,
    group: 'Bảng E',
    homeTeam: 'ec',
    awayTeam: 'cw',
    date: '2026-06-21',
    time: '07:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Kansas City'
  },
  {
    id: 'm36',
    stage: STAGES.GROUP,
    group: 'Bảng F',
    homeTeam: 'tn',
    awayTeam: 'jp',
    date: '2026-06-21',
    time: '11:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Monterrey'
  },
  {
    id: 'm37',
    stage: STAGES.GROUP,
    group: 'Bảng H',
    homeTeam: 'es',
    awayTeam: 'sa',
    date: '2026-06-21',
    time: '23:00', // Đưa về 21/6 theo chú thích 23:00 (21/6)
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Atlanta'
  },

  // ==========================================
  // NGÀY 22/06/2026
  // ==========================================
  {
    id: 'm38',
    stage: STAGES.GROUP,
    group: 'Bảng G',
    homeTeam: 'be',
    awayTeam: 'ir',
    date: '2026-06-22',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Los Angeles'
  },
  {
    id: 'm39',
    stage: STAGES.GROUP,
    group: 'Bảng H',
    homeTeam: 'uy',
    awayTeam: 'cv',
    date: '2026-06-22',
    time: '05:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Miami'
  },
  {
    id: 'm40',
    stage: STAGES.GROUP,
    group: 'Bảng G',
    homeTeam: 'nz',
    awayTeam: 'eg',
    date: '2026-06-22',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ BC Place Vancouver'
  },

  // ==========================================
  // NGÀY 23/06/2026
  // ==========================================
  {
    id: 'm41',
    stage: STAGES.GROUP,
    group: 'Bảng J',
    homeTeam: 'ar',
    awayTeam: 'at',
    date: '2026-06-23',
    time: '00:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Dallas'
  },
  {
    id: 'm42',
    stage: STAGES.GROUP,
    group: 'Bảng I',
    homeTeam: 'fr',
    awayTeam: 'iq',
    date: '2026-06-23',
    time: '04:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Philadelphia'
  },
  {
    id: 'm43',
    stage: STAGES.GROUP,
    group: 'Bảng I',
    homeTeam: 'no',
    awayTeam: 'sn',
    date: '2026-06-23',
    time: '07:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ New York New Jersey'
  },
  {
    id: 'm44',
    stage: STAGES.GROUP,
    group: 'Bảng J',
    homeTeam: 'jo',
    awayTeam: 'dz',
    date: '2026-06-23',
    time: '10:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ San Francisco Bay Area'
  },

  // ==========================================
  // NGÀY 24/06/2026
  // ==========================================
  {
    id: 'm45',
    stage: STAGES.GROUP,
    group: 'Bảng K',
    homeTeam: 'pt',
    awayTeam: 'uz',
    date: '2026-06-24',
    time: '00:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Houston'
  },
  {
    id: 'm46',
    stage: STAGES.GROUP,
    group: 'Bảng L',
    homeTeam: 'eng',
    awayTeam: 'gh',
    date: '2026-06-24',
    time: '03:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Boston'
  },
  {
    id: 'm47',
    stage: STAGES.GROUP,
    group: 'Bảng L',
    homeTeam: 'pa',
    awayTeam: 'hr',
    date: '2026-06-24',
    time: '06:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Toronto'
  },
  {
    id: 'm48',
    stage: STAGES.GROUP,
    group: 'Bảng K',
    homeTeam: 'co',
    awayTeam: 'cd',
    date: '2026-06-24',
    time: '09:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Guadalajara'
  },

  // ==========================================
  // NGÀY 25/06/2026
  // ==========================================
  {
    id: 'm49',
    stage: STAGES.GROUP,
    group: 'Bảng B',
    homeTeam: 'ch',
    awayTeam: 'ca',
    date: '2026-06-25',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ BC Place Vancouver'
  },
  {
    id: 'm50',
    stage: STAGES.GROUP,
    group: 'Bảng B',
    homeTeam: 'ba',
    awayTeam: 'qa',
    date: '2026-06-25',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Seattle'
  },
  {
    id: 'm51',
    stage: STAGES.GROUP,
    group: 'Bảng C',
    homeTeam: 'sct',
    awayTeam: 'br',
    date: '2026-06-25',
    time: '05:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Miami'
  },
  {
    id: 'm52',
    stage: STAGES.GROUP,
    group: 'Bảng C',
    homeTeam: 'ma',
    awayTeam: 'ht',
    date: '2026-06-25',
    time: '05:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Atlanta'
  },
  {
    id: 'm53',
    stage: STAGES.GROUP,
    group: 'Bảng A',
    homeTeam: 'cz',
    awayTeam: 'mx',
    date: '2026-06-25',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Mexico City'
  },
  {
    id: 'm54',
    stage: STAGES.GROUP,
    group: 'Bảng A',
    homeTeam: 'za',
    awayTeam: 'kr',
    date: '2026-06-25',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Monterrey'
  },

  // ==========================================
  // NGÀY 26/06/2026
  // ==========================================
  {
    id: 'm55',
    stage: STAGES.GROUP,
    group: 'Bảng E',
    homeTeam: 'ec',
    awayTeam: 'de',
    date: '2026-06-26',
    time: '03:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ New York New Jersey'
  },
  {
    id: 'm56',
    stage: STAGES.GROUP,
    group: 'Bảng E',
    homeTeam: 'cw',
    awayTeam: 'ci',
    date: '2026-06-26',
    time: '03:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Philadelphia'
  },
  {
    id: 'm57',
    stage: STAGES.GROUP,
    group: 'Bảng F',
    homeTeam: 'tn',
    awayTeam: 'nl',
    date: '2026-06-26',
    time: '06:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Kansas City'
  },
  {
    id: 'm58',
    stage: STAGES.GROUP,
    group: 'Bảng F',
    homeTeam: 'jp',
    awayTeam: 'se',
    date: '2026-06-26',
    time: '06:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Dallas'
  },
  {
    id: 'm59',
    stage: STAGES.GROUP,
    group: 'Bảng D',
    homeTeam: 'tr',
    awayTeam: 'us',
    date: '2026-06-26',
    time: '09:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Los Angeles'
  },
  {
    id: 'm60',
    stage: STAGES.GROUP,
    group: 'Bảng D',
    homeTeam: 'py',
    awayTeam: 'au',
    date: '2026-06-26',
    time: '09:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ San Francisco Bay Area'
  },

  // ==========================================
  // NGÀY 27/06/2026
  // ==========================================
  {
    id: 'm61',
    stage: STAGES.GROUP,
    group: 'Bảng I',
    homeTeam: 'no',
    awayTeam: 'fr',
    date: '2026-06-27',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Boston'
  },
  {
    id: 'm62',
    stage: STAGES.GROUP,
    group: 'Bảng I',
    homeTeam: 'sn',
    awayTeam: 'iq',
    date: '2026-06-27',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Toronto'
  },
  {
    id: 'm63',
    stage: STAGES.GROUP,
    group: 'Bảng H',
    homeTeam: 'uy',
    awayTeam: 'es',
    date: '2026-06-27',
    time: '07:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Guadalajara'
  },
  {
    id: 'm64',
    stage: STAGES.GROUP,
    group: 'Bảng H',
    homeTeam: 'cv',
    awayTeam: 'sa',
    date: '2026-06-27',
    time: '07:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Houston'
  },
  {
    id: 'm65',
    stage: STAGES.GROUP,
    group: 'Bảng G',
    homeTeam: 'nz',
    awayTeam: 'be',
    date: '2026-06-27',
    time: '10:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ BC Place Vancouver'
  },
  {
    id: 'm66',
    stage: STAGES.GROUP,
    group: 'Bảng G',
    homeTeam: 'eg',
    awayTeam: 'ir',
    date: '2026-06-27',
    time: '10:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Seattle'
  },

  // ==========================================
  // NGÀY 28/06/2026
  // ==========================================
  {
    id: 'm67',
    stage: STAGES.GROUP,
    group: 'Bảng L',
    homeTeam: 'pa',
    awayTeam: 'eng',
    date: '2026-06-28',
    time: '04:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ New York New Jersey'
  },
  {
    id: 'm68',
    stage: STAGES.GROUP,
    group: 'Bảng L',
    homeTeam: 'hr',
    awayTeam: 'gh',
    date: '2026-06-28',
    time: '04:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Philadelphia'
  },
  {
    id: 'm69',
    stage: STAGES.GROUP,
    group: 'Bảng K',
    homeTeam: 'co',
    awayTeam: 'pt',
    date: '2026-06-28',
    time: '06:30',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Miami'
  },
  {
    id: 'm70',
    stage: STAGES.GROUP,
    group: 'Bảng K',
    homeTeam: 'cd',
    awayTeam: 'uz',
    date: '2026-06-28',
    time: '06:30',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Atlanta'
  },
  {
    id: 'm71',
    stage: STAGES.GROUP,
    group: 'Bảng J',
    homeTeam: 'jo',
    awayTeam: 'ar',
    date: '2026-06-28',
    time: '09:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Dallas'
  },
  {
    id: 'm72',
    stage: STAGES.GROUP,
    group: 'Bảng J',
    homeTeam: 'dz',
    awayTeam: 'at',
    date: '2026-06-28',
    time: '09:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Kansas City'
  },

  // ==========================================
  // VÒNG 32 ĐỘI (1/16) - 16 trận
  // ==========================================
  {
    id: 'ko32_1',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhì bảng A',
    awayTeam: 'Nhì bảng B',
    date: '2026-06-29',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Los Angeles'
  },
  {
    id: 'ko32_2',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng E',
    awayTeam: 'Nhì bảng F',
    date: '2026-06-30',
    time: '00:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Houston'
  },
  {
    id: 'ko32_3',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng E',
    awayTeam: 'Ba bảng A/B/C/D/F',
    date: '2026-06-30',
    time: '03:30',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Boston'
  },
  {
    id: 'ko32_4',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng F',
    awayTeam: 'Nhì bảng C',
    date: '2026-06-30',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Monterrey'
  },
  {
    id: 'ko32_5',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhì bảng E',
    awayTeam: 'Nhì bảng I',
    date: '2026-07-01',
    time: '00:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Dallas'
  },
  {
    id: 'ko32_6',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng I',
    awayTeam: 'Ba bảng C/D/F/G/H',
    date: '2026-07-01',
    time: '04:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ New York New Jersey'
  },
  {
    id: 'ko32_7',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng A',
    awayTeam: 'Ba bảng C/E/F/H/I',
    date: '2026-07-01',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Mexico City'
  },
  {
    id: 'ko32_8',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng L',
    awayTeam: 'Ba bảng E/H/I/J/K',
    date: '2026-07-01',
    time: '23:00', // Sắp xếp theo ngày 1/7 23:00
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Atlanta'
  },
  {
    id: 'ko32_9',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng G',
    awayTeam: 'Ba bảng A/E/H/I/J',
    date: '2026-07-02',
    time: '03:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Seattle'
  },
  {
    id: 'ko32_10',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng D',
    awayTeam: 'Ba bảng B/E/F/I/J',
    date: '2026-07-02',
    time: '07:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ San Francisco Bay Area'
  },
  {
    id: 'ko32_11',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhì bảng K',
    awayTeam: 'Nhì bảng L',
    date: '2026-07-03',
    time: 'Chưa rõ giờ',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Toronto'
  },
  {
    id: 'ko32_12',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng H',
    awayTeam: 'Nhì bảng J',
    date: '2026-07-03',
    time: 'Chưa rõ giờ',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Los Angeles'
  },
  {
    id: 'ko32_13',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng B',
    awayTeam: 'Ba bảng E/F/G/I/J',
    date: '2026-07-03',
    time: 'Chưa rõ giờ',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ BC Place Vancouver'
  },
  {
    id: 'ko32_14',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhì bảng D',
    awayTeam: 'Nhì bảng G',
    date: '2026-07-04',
    time: '01:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Dallas'
  },
  {
    id: 'ko32_15',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng J',
    awayTeam: 'Nhì bảng H',
    date: '2026-07-04',
    time: '05:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Miami'
  },
  {
    id: 'ko32_16',
    stage: STAGES.ROUND_32,
    group: null,
    homeTeam: 'Nhất bảng K',
    awayTeam: 'Ba bảng D/E/I/J/L',
    date: '2026-07-04',
    time: '08:30',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Kansas City'
  },

  // ==========================================
  // VÒNG 16 ĐỘI (1/8) - 8 trận
  // ==========================================
  {
    id: 'ko16_1',
    stage: STAGES.ROUND_16,
    group: null,
    homeTeam: 'Thắng trận 73',
    awayTeam: 'Thắng trận 74',
    date: '2026-07-05',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Houston'
  },
  {
    id: 'ko16_2',
    stage: STAGES.ROUND_16,
    group: null,
    homeTeam: 'Thắng trận 75',
    awayTeam: 'Thắng trận 76',
    date: '2026-07-05',
    time: '07:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Philadelphia'
  },
  {
    id: 'ko16_3',
    stage: STAGES.ROUND_16,
    group: null,
    homeTeam: 'Thắng trận 77',
    awayTeam: 'Thắng trận 78',
    date: '2026-07-06',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ New York New Jersey'
  },
  {
    id: 'ko16_4',
    stage: STAGES.ROUND_16,
    group: null,
    homeTeam: 'Thắng trận 79',
    awayTeam: 'Thắng trận 80',
    date: '2026-07-06',
    time: '07:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Mexico City'
  },
  {
    id: 'ko16_5',
    stage: STAGES.ROUND_16,
    group: null,
    homeTeam: 'Thắng trận 81',
    awayTeam: 'Thắng trận 82',
    date: '2026-07-07',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Dallas'
  },
  {
    id: 'ko16_6',
    stage: STAGES.ROUND_16,
    group: null,
    homeTeam: 'Thắng trận 83',
    awayTeam: 'Thắng trận 84',
    date: '2026-07-07',
    time: '07:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Seattle'
  },
  {
    id: 'ko16_7',
    stage: STAGES.ROUND_16,
    group: null,
    homeTeam: 'Thắng trận 85',
    awayTeam: 'Thắng trận 86',
    date: '2026-07-08',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Atlanta'
  },
  {
    id: 'ko16_8',
    stage: STAGES.ROUND_16,
    group: null,
    homeTeam: 'Thắng trận 87',
    awayTeam: 'Thắng trận 88',
    date: '2026-07-08',
    time: '07:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ BC Place Vancouver'
  },

  // ==========================================
  // TỨ KẾT - 4 trận
  // ==========================================
  {
    id: 'q1',
    stage: STAGES.QUARTER,
    group: null,
    homeTeam: 'Thắng trận 89',
    awayTeam: 'Thắng trận 90',
    date: '2026-07-10',
    time: '03:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Boston'
  },
  {
    id: 'q2',
    stage: STAGES.QUARTER,
    group: null,
    homeTeam: 'Thắng trận 93',
    awayTeam: 'Thắng trận 94',
    date: '2026-07-11',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Los Angeles'
  },
  {
    id: 'q3',
    stage: STAGES.QUARTER,
    group: null,
    homeTeam: 'Thắng trận 91',
    awayTeam: 'Thắng trận 92',
    date: '2026-07-12',
    time: '04:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Miami'
  },
  {
    id: 'q4',
    stage: STAGES.QUARTER,
    group: null,
    homeTeam: 'Thắng trận 95',
    awayTeam: 'Thắng trận 96',
    date: '2026-07-12',
    time: '08:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Kansas City'
  },

  // ==========================================
  // BÁN KẾT - 2 trận
  // ==========================================
  {
    id: 's1',
    stage: STAGES.SEMI,
    group: null,
    homeTeam: 'Thắng tứ kết 1',
    awayTeam: 'Thắng tứ kết 2',
    date: '2026-07-15',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Dallas'
  },
  {
    id: 's2',
    stage: STAGES.SEMI,
    group: null,
    homeTeam: 'Thắng tứ kết 3',
    awayTeam: 'Thắng tứ kết 4',
    date: '2026-07-16',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Atlanta'
  },

  // ==========================================
  // TRANH HẠNG BA & CHUNG KẾT
  // ==========================================
  {
    id: '3rd_place',
    stage: STAGES.FINAL,
    group: null,
    homeTeam: 'Thua bán kết 1',
    awayTeam: 'Thua bán kết 2',
    date: '2026-07-19',
    time: '04:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ Miami'
  },
  {
    id: 'f1',
    stage: STAGES.FINAL,
    group: null,
    homeTeam: 'Thắng bán kết 1',
    awayTeam: 'Thắng bán kết 2',
    date: '2026-07-20',
    time: '02:00',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    stadium: 'SVĐ New York New Jersey'
  }
];

export const getFlagUrl = (flagCode) => {
  if (!flagCode) return '';
  return `https://flagcdn.com/w40/${flagCode.toLowerCase()}.png`;
};
