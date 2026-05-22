import React, { useState, useEffect, useCallback } from 'react';

interface DayData {
  completed: boolean;
  isRest: boolean;
  type: 'input' | 'output' | 'rest';
  pair: string | null;
  topicName: string;
  murphyUnit: string;
  tasks: boolean[];
  vocab: string;
  grammar: string;
  pattern: string;
  speaking: string;
  academicWriting: string;
}

interface WeekState {
  [dayId: string]: DayData;
}

interface GlobalState {
  [weekNumber: number]: WeekState;
}

const TOTAL_WEEKS = 12;
const DAYS = [
  { id: 'Shanba', type: 'input' as const, label: '1-KUN: INPUT & AMALIYOT (Shanba)' },
  { id: 'Yakshanba', type: 'output' as const, label: '2-KUN: OUTPUT & PORTLASH (Yakshanba)', pair: 'Shanba' },
  { id: 'Dushanba', type: 'input' as const, label: '1-KUN: INPUT & AMALIYOT (Dushanba)' },
  { id: 'Seshanba', type: 'output' as const, label: '2-KUN: OUTPUT & PORTLASH (Seshanba)', pair: 'Dushanba' },
  { id: 'Chorshanba', type: 'input' as const, label: '1-KUN: INPUT & AMALIYOT (Chorshanba)' },
  { id: 'Payshanba', type: 'output' as const, label: '2-KUN: OUTPUT & PORTLASH (Payshanba)', pair: 'Chorshanba' },
  { id: 'Juma', type: 'rest' as const, label: '💤 TIKLANISH KUNI (Juma)' }
];

const START_DATE = new Date('2026-05-18');
const TARGET_DEADLINE = new Date('2026-09-01T00:00:00');

const INPUT_TASKS = [
  "📘 1. Murphy Grammar: Yangi qoidani o'rganish va matn bazasida hayotiy gap tuzish",
  "⚡ 2. DEEP READING (20 daqiqa): Transkript 1-yarmini o'qish, struktura tahlili",
  "🔍 3. Pattern Isolation: Matndan yoqqan nutqiy tayyor qoliplarni ajratib olish",
  "🎧 4. Dictation: Matnning 1-yarmini audiodan eshitib yozish",
  "🗣️ 5. Shadowing: Spiker ketidan intonatsiyani baqirib qaytarish",
  "🎤 6. Pyramid Speaking Attack: Savollar asosida nutqni kengaytirish"
];

const OUTPUT_TASKS = [
  "🔄 1. Murphy Review: O'rganilgan yangi elementlarni ko'zdan kechirish",
  "💥 2. READING COMPLETION: Qolgan 2-yarmini o'qish va yangi patternlarni yig'ish",
  "🎧 3. Dictation (2-yarmi): Qolgan qismni eshitib yozishni yakunlash",
  "🚀 4. Full Shadowing: Butun matnni audio bilan to'xtamay qaytarish",
  "🔥 5. pyramid SPEAKING ATTACK: Olingan barcha qiyin iboralarni nutqqa majburlab tiqish",
  "✍️ 6. Academic Writing: Mavzu yuzasidan 1 ta mukammal akademik abzas yozish"
];

export default function App() {
  const [state, setState] = useState<GlobalState>({});
  const [activeWeek, setActiveWeek] = useState(1);
  const [currentReportTab, setCurrentReportTab] = useState<'day' | 'week' | 'month'>('day');
  const [currentSelectedDay, setCurrentSelectedDay] = useState('Shanba');
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, progress: 100 });

  // Initialize state from localStorage or create new
  useEffect(() => {
    const saved = localStorage.getItem('b2HardcoreV6UltimateState');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        initializeState();
      }
    } else {
      initializeState();
    }
  }, []);

  const initializeState = () => {
    const newState: GlobalState = {};
    for (let w = 1; w <= TOTAL_WEEKS; w++) {
      newState[w] = {};
      DAYS.forEach(d => {
        const isRest = d.type === 'rest';
        newState[w][d.id] = {
          completed: isRest,
          isRest: isRest,
          type: d.type,
          pair: d.pair || null,
          topicName: '',
          murphyUnit: '',
          tasks: isRest ? [] : new Array(6).fill(false),
          vocab: '',
          grammar: '',
          pattern: '',
          speaking: '',
          academicWriting: ''
        };
      });
    }
    setState(newState);
    localStorage.setItem('b2HardcoreV6UltimateState', JSON.stringify(newState));
  };

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    if (Object.keys(state).length > 0) {
      localStorage.setItem('b2HardcoreV6UltimateState', JSON.stringify(state));
    }
  }, [state]);

  // Update clock and countdown
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const diff = TARGET_DEADLINE.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, progress: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const maxPeriod = TARGET_DEADLINE.getTime() - START_DATE.getTime();
        const currentPassed = now.getTime() - START_DATE.getTime();
        const progress = 100 - Math.max(0, Math.min(100, (currentPassed / maxPeriod) * 100));

        setCountdown({ days, hours, minutes, seconds, progress });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const countUniqueLines = (text: string) => {
    if (!text) return 0;
    return text.split('\n').map(l => l.trim()).filter(l => l.length > 0).length;
  };

  const getCleanLinesArray = (text: string) => {
    if (!text) return [];
    return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  };

  const getDayDateString = (week: number, dayId: string) => {
    const idx = DAYS.findIndex(d => d.id === dayId);
    const totalDaysOffset = ((week - 1) * 7) + idx - 2;
    const targetDate = new Date(START_DATE);
    targetDate.setDate(START_DATE.getDate() + totalDaysOffset);
    return targetDate.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
  };

  const isToday = (week: number, dayId: string) => {
    const idx = DAYS.findIndex(d => d.id === dayId);
    const totalDaysOffset = ((week - 1) * 7) + idx - 2;
    const d = new Date(START_DATE);
    d.setDate(START_DATE.getDate() + totalDaysOffset);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };

  const calculateTrueMatch = (week: number, secondDayId: string, firstDayId: string) => {
    const day1 = state[week]?.[firstDayId];
    const day2 = state[week]?.[secondDayId];
    if (!day1 || !day2 || (!day1.vocab && !day1.pattern) || !day2.speaking)
      return { percent: 0, matches: [] };

    const words = getCleanLinesArray(day1.vocab).map(l => l.split('-')[0].split(':')[0].trim().toLowerCase());
    const patterns = getCleanLinesArray(day1.pattern).map(l => l.toLowerCase());
    const combinedTargets = [...words, ...patterns];
    const speechText = (day2.speaking.toLowerCase() + ' ' + (day2.academicWriting || '').toLowerCase());

    if (combinedTargets.length === 0) return { percent: 0, matches: [] };

    const matchedItems: string[] = [];
    combinedTargets.forEach(item => {
      if (item && speechText.includes(item) && !matchedItems.includes(item)) {
        matchedItems.push(item);
      }
    });

    const percent = Math.round((matchedItems.length / combinedTargets.length) * 100);
    return { percent, matches: matchedItems };
  };

  const checkDayStatus = (data: DayData) => {
    if (data.isRest) return true;
    return data.tasks.every(Boolean) && data.topicName.trim().length > 1;
  };

  const buildGlobalStats = () => {
    let streak = 0;
    let totalVocab = 0;
    let totalPattern = 0;
    let totalGrammar = 0;
    let totalSpeech = 0;

    for (let w = 1; w <= TOTAL_WEEKS; w++) {
      DAYS.forEach(d => {
        const data = state[w]?.[d.id];
        if (data) {
          totalVocab += countUniqueLines(data.vocab);
          totalPattern += countUniqueLines(data.pattern);
          if (data.grammar && data.grammar.trim().length > 0) totalGrammar++;
          if (data.speaking && data.speaking.trim().length > 0) totalSpeech++;
          if (data.completed && !data.isRest) streak++;
        }
      });
    }

    return { streak, totalVocab, totalPattern, totalGrammar, totalSpeech };
  };

  const updateTask = (dayId: string, taskIndex: number, checked: boolean) => {
    setState(prev => {
      const newState = { ...prev };
      newState[activeWeek][dayId].tasks[taskIndex] = checked;
      newState[activeWeek][dayId].completed = checkDayStatus(newState[activeWeek][dayId]);
      return newState;
    });
  };

  const updateField = (dayId: string, field: keyof DayData, value: string) => {
    setState(prev => {
      const newState = { ...prev };
      (newState[activeWeek][dayId] as any)[field] = value;
      newState[activeWeek][dayId].completed = checkDayStatus(newState[activeWeek][dayId]);
      return newState;
    });
  };

  const toggleDay = (dayId: string) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayId)) {
        newSet.delete(dayId);
      } else {
        newSet.add(dayId);
      }
      return newSet;
    });
  };

  const exportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `B2_Matrix_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported && typeof imported === 'object') {
          setState(imported);
          alert("Ma'lumotlar muvaffaqiyatli tiklandi! 🔥");
        }
      } catch (err) {
        alert("Fayl formatida xatolik!");
      }
    };
    reader.readAsText(file);
  };

  const stats = buildGlobalStats();

  return (
    <div className="min-h-screen bg-[#030712] text-[#f8fafc] p-2 md:p-4">
      <div className="max-w-[1700px] mx-auto">

        {/* Deadline Counter */}
        <div className="bg-gradient-to-b from-[#1e0b0b] to-black border-3 border-[#ef4444] rounded-2xl p-5 md:p-8 mb-4 text-center shadow-[0_0_35px_rgba(239,68,68,0.4)] relative animate-pulse-subtle">
          <div className="text-xs md:text-base font-black uppercase tracking-wider text-[#ff9999] mb-4 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
            🏁 1-SENTYABR MAVSUMIGACHA QOLGAN ANIQ VAQT MATRIXI
          </div>
          <div className="flex justify-center gap-2 md:gap-3 mb-4">
            {[
              { label: 'KUN', value: countdown.days },
              { label: 'SOAT', value: countdown.hours },
              { label: 'MINUT', value: countdown.minutes },
              { label: 'SONIYA', value: countdown.seconds, highlight: true }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`bg-[rgba(15,23,42,0.9)] p-3 md:p-4 rounded-xl flex-1 max-w-[85px] md:max-w-none border-2 ${item.highlight ? 'border-[#f59e0b]' : 'border-[#331010]'} shadow-inner`}
              >
                <div className={`text-2xl md:text-5xl font-black font-mono leading-none ${item.highlight ? 'text-[#f59e0b] drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-white drop-shadow-[0_0_10px_rgba(255,68,68,0.5)]'}`}>
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-[9px] md:text-xs uppercase text-[#94a3b8] font-bold mt-2 tracking-wide">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
          <div className="h-2 bg-[#111827] rounded-full max-w-[500px] mx-auto border border-[#1e293b] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] shadow-[0_0_8px_#ef4444] transition-all duration-1000"
              style={{ width: `${countdown.progress}%` }}
            />
          </div>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-br from-[#1e1b4b] to-[#1e3a8a] p-4 md:p-6 rounded-xl mb-4 border border-[#1e293b] shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg md:text-2xl font-bold tracking-wide text-white mb-1">
                B2 HARDCORE MATRIX v6.0 ⚡
              </h2>
              <p className="text-xs md:text-sm text-[#38bdf8] font-medium">
                {currentTime.toLocaleDateString('uz-UZ', { weekday: 'short', month: 'short', day: 'numeric' })} | {currentTime.toLocaleTimeString('uz-UZ')}
              </p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 w-full md:w-auto">
              {[
                { label: 'Streak 🔥', value: `${stats.streak} kun`, color: 'border-[#2563eb]' },
                { label: "So'z 📚", value: stats.totalVocab, color: 'border-[#10b981]' },
                { label: 'Pattern 🔄', value: stats.totalPattern, color: 'border-[#2563eb]' },
                { label: 'Murphy 📘', value: stats.totalGrammar, color: 'border-[#a855f7]' },
                { label: 'Spontan 🗣️', value: stats.totalSpeech, color: 'border-[#10b981]' }
              ].map((stat, idx) => (
                <div key={idx} className={`bg-[rgba(0,0,0,0.5)] p-2 md:p-3 rounded-lg text-center border-l-4 ${stat.color} backdrop-blur-sm`}>
                  <div className="text-base md:text-2xl font-bold text-[#38bdf8]">{stat.value}</div>
                  <div className="text-[9px] md:text-xs uppercase text-[#94a3b8] font-semibold mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={exportBackup}
                className="flex-1 md:flex-none bg-[#1e293b] border border-[#334155] text-[#cbd5e1] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#334155] transition-all"
              >
                💾 Export
              </button>
              <label className="flex-1 md:flex-none bg-[#1e293b] border border-[#334155] text-[#cbd5e1] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#334155] transition-all cursor-pointer text-center">
                📂 Import
                <input type="file" className="hidden" onChange={importBackup} accept=".json" />
              </label>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1.8fr] gap-4">
          {/* Workspace */}
          <div className="bg-[#0b1329] p-4 md:p-6 rounded-xl border border-[#1e293b] shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-[#1e293b] mb-4">
              <div className="text-sm md:text-base font-bold">Mavjud Konveyer</div>
              <div className="text-[#38bdf8] font-bold text-sm">{activeWeek}-Hafta</div>
            </div>

            {/* Week Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
              {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map(w => (
                <button
                  key={w}
                  onClick={() => setActiveWeek(w)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${w === activeWeek
                      ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-lg scale-105'
                      : 'bg-[#1e293b] text-[#94a3b8] border-[#334155] hover:bg-[#334155]'
                    } border`}
                >
                  {w}-W
                </button>
              ))}
            </div>

            {/* Days */}
            <div className="space-y-3">
              {DAYS.map(day => {
                const data = state[activeWeek]?.[day.id];
                if (!data) return null;

                const dayKey = `${activeWeek}-${day.id}`;
                const isExpanded = expandedDays.has(dayKey);
                const isTodayDay = isToday(activeWeek, day.id);
                const dateStr = getDayDateString(activeWeek, day.id);
                const tasksCompleted = data.tasks.filter(Boolean).length;
                const totalTasks = data.tasks.length;
                const progressPercent = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0;

                return (
                  <div
                    key={dayKey}
                    className={`border rounded-xl overflow-hidden transition-all ${isTodayDay ? 'border-[#38bdf8] shadow-[0_0_20px_rgba(56,189,248,0.3)]' : 'border-[#1e293b]'
                      } ${data.completed ? 'bg-gradient-to-r from-[#0f1c3f] to-[#0a1428]' : 'bg-[#070f21]'}`}
                  >
                    <div
                      className="bg-[#0f1c3f] p-3 md:p-4 flex justify-between items-center cursor-pointer hover:bg-[#1a2847] transition-all"
                      onClick={() => {
                        setCurrentSelectedDay(day.id);
                        toggleDay(dayKey);
                      }}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs md:text-sm font-bold">
                          [{dateStr}] {day.id}
                        </span>
                        <span className={`text-[9px] md:text-xs px-2 py-0.5 rounded font-bold ${day.type === 'input'
                            ? 'bg-[rgba(37,99,235,0.2)] text-[#60a5fa] border border-[rgba(37,99,235,0.4)]'
                            : day.type === 'output'
                              ? 'bg-[rgba(168,85,247,0.2)] text-[#c084fc] border border-[rgba(168,85,247,0.4)]'
                              : 'bg-[#334155] text-[#cbd5e1]'
                          }`}>
                          {day.type.toUpperCase()}
                        </span>
                        {isTodayDay && (
                          <span className="bg-[#0284c7] text-white px-2 py-0.5 rounded text-[9px] font-bold animate-pulse">
                            BUGUN
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {!data.isRest && (
                          <div className="hidden md:flex items-center gap-2 text-xs text-[#94a3b8]">
                            <div className="w-24 h-2 bg-[#1e293b] rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${progressPercent === 100
                                    ? 'bg-gradient-to-r from-[#10b981] to-[#059669]'
                                    : 'bg-gradient-to-r from-[#2563eb] to-[#a855f7]'
                                  }`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <span className="font-bold">{tasksCompleted}/{totalTasks}</span>
                          </div>
                        )}
                        <span className="text-2xl">{data.completed ? '✅' : '⏳'}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 bg-[#040a17] border-t border-[#1e293b] animate-slideDown">
                        {data.isRest ? (
                          <p className="text-[#ef4444] text-sm text-center font-bold py-4">
                            Miyani tiklash kuni. Dam oling! 🛌
                          </p>
                        ) : (
                          <div className="space-y-4">
                            {/* Topic Inputs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div className="bg-[#0f172a] p-3 rounded-lg border border-dashed border-[#334155]">
                                <label className="text-xs font-bold text-[#38bdf8] block mb-2">
                                  🎬 Elllo Audio / Kunlik Mavzu:
                                </label>
                                <input
                                  type="text"
                                  value={data.topicName}
                                  onChange={(e) => updateField(day.id, 'topicName', e.target.value)}
                                  placeholder="Mavzu nomi"
                                  className="w-full bg-[#070a12] border border-[#334155] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#38bdf8] transition-all"
                                />
                              </div>
                              <div className="bg-[#0f172a] p-3 rounded-lg border border-dashed border-[#334155]">
                                <label className="text-xs font-bold text-[#38bdf8] block mb-2">
                                  📘 Murphy Grammar Unit:
                                </label>
                                <input
                                  type="text"
                                  value={data.murphyUnit}
                                  onChange={(e) => updateField(day.id, 'murphyUnit', e.target.value)}
                                  placeholder="Masalan: Unit 32"
                                  className="w-full bg-[#070a12] border border-[#334155] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#38bdf8] transition-all"
                                />
                              </div>
                            </div>

                            {/* Tasks Checklist */}
                            <div className="space-y-2">
                              {(day.type === 'input' ? INPUT_TASKS : OUTPUT_TASKS).map((task, idx) => (
                                <label key={idx} className="flex items-start gap-3 p-3 border-b border-dashed border-[#1e293b] hover:bg-[#0f172a] rounded transition-all cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={data.tasks[idx] || false}
                                    onChange={(e) => updateTask(day.id, idx, e.target.checked)}
                                    className="w-5 h-5 mt-0.5 flex-shrink-0 accent-[#10b981] cursor-pointer"
                                  />
                                  <span className={`text-xs md:text-sm leading-relaxed ${data.tasks[idx] ? 'line-through text-[#64748b]' : 'text-[#cbd5e1] group-hover:text-white'} transition-all`}>
                                    {task}
                                  </span>
                                </label>
                              ))}
                            </div>

                            {/* Text Areas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {day.type === 'input' ? (
                                <>
                                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#1e293b]">
                                    <label className="text-xs font-bold text-[#cbd5e1] block mb-2">
                                      📚 1-KUN LUG'ATI (Har qatorda bittadan):
                                    </label>
                                    <textarea
                                      value={data.vocab}
                                      onChange={(e) => updateField(day.id, 'vocab', e.target.value)}
                                      placeholder="so'z - tarjimasi"
                                      className="w-full min-h-[100px] bg-[#050b14] border border-[#334155] rounded-lg p-3 text-sm text-white resize-vertical outline-none focus:border-[#38bdf8] transition-all"
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                      <span className="text-xs text-[#38bdf8] font-bold">
                                        {countUniqueLines(data.vocab)} ta so'z
                                      </span>
                                      <div className="flex-1 ml-3 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-gradient-to-r from-[#2563eb] to-[#10b981] transition-all duration-300"
                                          style={{ width: `${Math.min(100, (countUniqueLines(data.vocab) / 15) * 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#1e293b]">
                                    <label className="text-xs font-bold text-[#cbd5e1] block mb-2">
                                      🔄 AJRATILGAN PATTERNLAR:
                                    </label>
                                    <textarea
                                      value={data.pattern}
                                      onChange={(e) => updateField(day.id, 'pattern', e.target.value)}
                                      placeholder="In terms of..."
                                      className="w-full min-h-[100px] bg-[#050b14] border border-[#334155] rounded-lg p-3 text-sm text-white resize-vertical outline-none focus:border-[#38bdf8] transition-all"
                                    />
                                    <span className="text-xs text-[#38bdf8] font-bold mt-2 block">
                                      {countUniqueLines(data.pattern)} ta pattern
                                    </span>
                                  </div>
                                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#1e293b] md:col-span-2">
                                    <label className="text-xs font-bold text-[#cbd5e1] block mb-2">
                                      ✍️ Murphy Ovozli Gaplari:
                                    </label>
                                    <textarea
                                      value={data.grammar}
                                      onChange={(e) => updateField(day.id, 'grammar', e.target.value)}
                                      placeholder="Tuzilgan gaplar..."
                                      className="w-full min-h-[100px] bg-[#050b14] border border-[#334155] rounded-lg p-3 text-sm text-white resize-vertical outline-none focus:border-[#38bdf8] transition-all"
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#1e293b]">
                                    <label className="text-xs font-bold text-[#cbd5e1] block mb-2">
                                      🗣️ Spontan Speaking Attack Transkripti:
                                    </label>
                                    <textarea
                                      value={data.speaking}
                                      onChange={(e) => updateField(day.id, 'speaking', e.target.value)}
                                      placeholder="Gapirgan nutqingiz matni..."
                                      className="w-full min-h-[120px] bg-[#050b14] border border-[#334155] rounded-lg p-3 text-sm text-white resize-vertical outline-none focus:border-[#38bdf8] transition-all"
                                    />
                                  </div>
                                  <div className="bg-[#0f172a] p-4 rounded-lg border border-[#1e293b]">
                                    <label className="text-xs font-bold text-[#cbd5e1] block mb-2">
                                      ✍️ Academic Writing (1 abzas xulosa):
                                    </label>
                                    <textarea
                                      value={data.academicWriting}
                                      onChange={(e) => updateField(day.id, 'academicWriting', e.target.value)}
                                      placeholder="Akademik xulosa..."
                                      className="w-full min-h-[120px] bg-[#050b14] border border-[#334155] rounded-lg p-3 text-sm text-white resize-vertical outline-none focus:border-[#38bdf8] transition-all"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analytics Panel */}
          <div className="bg-[#0b1329] p-4 md:p-6 rounded-xl border border-[#1e293b] shadow-2xl xl:sticky xl:top-4 h-fit">
            <div className="text-sm md:text-base font-bold text-[#38bdf8] pb-4 border-b border-[#334155] mb-4">
              📋 STRATEGIK MONITORING PANEL
            </div>

            {/* Analytics Tabs */}
            <div className="flex bg-[#070a12] rounded-lg p-1 mb-4 border border-[#1e293b] gap-1">
              {[
                { id: 'day' as const, label: 'Kunlik Tahlil' },
                { id: 'week' as const, label: 'Haftalik' },
                { id: 'month' as const, label: 'Oylik' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentReportTab(tab.id)}
                  className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-bold transition-all ${currentReportTab === tab.id
                      ? 'bg-[#1e293b] text-[#38bdf8] shadow-lg'
                      : 'text-[#94a3b8] hover:text-white'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Report Content */}
            <div className="space-y-4">
              {currentReportTab === 'day' && (
                <DayReport
                  data={state[activeWeek]?.[currentSelectedDay]}
                  dayId={currentSelectedDay}
                  week={activeWeek}
                  calculateTrueMatch={calculateTrueMatch}
                  countUniqueLines={countUniqueLines}
                />
              )}
              {currentReportTab === 'week' && (
                <WeekReport
                  state={state}
                  week={activeWeek}
                  countUniqueLines={countUniqueLines}
                />
              )}
              {currentReportTab === 'month' && (
                <MonthReport state={state} activeWeek={activeWeek} />
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes pulse-subtle {
          0%, 100% {
            box-shadow: 0 0 35px rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 0 45px rgba(239, 68, 68, 0.6);
          }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function DayReport({ data, dayId, week, calculateTrueMatch, countUniqueLines }: any) {
  if (!data) return <div className="text-[#64748b] text-sm text-center italic py-8">Ma'lumot yuklanmoqda...</div>;

  const getCleanLinesArray = (text: string) => {
    if (!text) return [];
    return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  };

  return (
    <div className="bg-[#070f21] border border-[#1e293b] rounded-lg p-4">
      <h4 className="text-sm font-bold text-[#f59e0b] uppercase border-b border-dashed border-[#334155] pb-2 mb-4">
        KUNLIK TAHLIL: {dayId.toUpperCase()}
      </h4>
      {data.isRest ? (
        <p className="text-[#64748b] text-sm text-center italic py-4">
          Bugun dam olish kuni. Neyronlar yangi ma'lumotlarni tartibga solmoqda. 🧠
        </p>
      ) : (
        <div className="space-y-4">
          {/* Topic and Grammar Header */}
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm bg-[#0f172a] p-2.5 rounded-lg border border-[#334155]">
              <span className="text-[#ef4444]">🎯</span>
              <div className="flex-1">
                <span className="font-bold text-[#cbd5e1]">Mavzu:</span>
                <span className="ml-2 text-[#38bdf8]">{data.topicName || 'Kiritilmagan'}</span>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm bg-[#0f172a] p-2.5 rounded-lg border border-[#334155]">
              <span className="text-[#60a5fa]">📘</span>
              <div className="flex-1">
                <span className="font-bold text-[#cbd5e1]">Grammatika:</span>
                <span className="ml-2 text-[#38bdf8]">{data.murphyUnit || 'Kiritilmagan'}</span>
              </div>
            </div>
          </div>

          {data.type === 'input' ? (
            <>
              {/* Vocabulary Section */}
              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#cbd5e1]">Kiritilgan so'zlar:</span>
                  <span className={`font-bold text-sm ${countUniqueLines(data.vocab) >= 15 ? 'text-[#10b981]' : 'text-[#f59e0b]'}`}>
                    {countUniqueLines(data.vocab)} ta {countUniqueLines(data.vocab) >= 15 ? '✅' : '⚠️'}
                  </span>
                </div>
                <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563eb] to-[#10b981] transition-all"
                    style={{ width: `${Math.min(100, (countUniqueLines(data.vocab) / 15) * 100)}%` }}
                  />
                </div>
                {getCleanLinesArray(data.vocab).length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pt-2 border-t border-[#334155]">
                    {getCleanLinesArray(data.vocab).map((word, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs bg-[#070f21] p-2 rounded border-l-2 border-[#10b981]">
                        <span className="text-[#10b981] font-bold min-w-[20px]">{idx + 1}.</span>
                        <span className="text-[#cbd5e1] flex-1">{word}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Patterns Section */}
              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#cbd5e1]">Kiritilgan qoliplar:</span>
                  <span className="font-bold text-sm text-[#a855f7]">{countUniqueLines(data.pattern)} ta</span>
                </div>
                {getCleanLinesArray(data.pattern).length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pt-2 border-t border-[#334155]">
                    {getCleanLinesArray(data.pattern).map((pattern, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs bg-[#070f21] p-2 rounded border-l-2 border-[#a855f7]">
                        <span className="text-[#a855f7] font-bold min-w-[20px]">{idx + 1}.</span>
                        <span className="text-[#cbd5e1] flex-1 italic">{pattern}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Grammar Section */}
              <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#cbd5e1]">Grammatika amaliyoti:</span>
                  <span className={`font-bold text-sm ${data.grammar.trim() ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                    {data.grammar.trim() ? 'Bajarildi ✅' : 'Bajarilmadi ❌'}
                  </span>
                </div>
                {getCleanLinesArray(data.grammar).length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pt-2 border-t border-[#334155]">
                    {getCleanLinesArray(data.grammar).map((sentence, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs bg-[#070f21] p-2 rounded border-l-2 border-[#60a5fa]">
                        <span className="text-[#60a5fa] font-bold min-w-[20px]">{idx + 1}.</span>
                        <span className="text-[#cbd5e1] flex-1">{sentence}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155] space-y-3">
              {data.pair && (() => {
                const matchInfo = calculateTrueMatch(week, dayId, data.pair);
                const badgeClass = matchInfo.percent >= 50 ? 'bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)]' : 'bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border-[rgba(245,158,11,0.3)]';
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#cbd5e1]">True Match Tahlili:</span>
                      <span className={`px-3 py-1 rounded border text-xs font-bold ${badgeClass}`}>
                        {matchInfo.percent}%
                      </span>
                    </div>
                    {matchInfo.matches.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-xs text-[#94a3b8] border-b border-[#334155] pb-2">Spontan nutqda ishlatilgan elementlar:</p>
                        <div className="max-h-48 overflow-y-auto space-y-1.5">
                          {matchInfo.matches.map((m: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#cbd5e1] bg-[#070f21] p-2 rounded border-l-2 border-[#10b981]">
                              <span className="text-[#10b981]">🔥</span>
                              <span className="flex-1 font-medium">{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-[#64748b] italic text-center py-2">
                        Input kunidagi elementlar transkriptda topilmadi
                      </p>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function WeekReport({ state, week, countUniqueLines }: any) {
  let doneDays = 0;
  let wVocab = 0;
  let wPattern = 0;
  const allVocab: string[] = [];
  const allPatterns: string[] = [];
  const allGrammar: string[] = [];

  const getCleanLinesArray = (text: string) => {
    if (!text) return [];
    return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  };

  DAYS.forEach(d => {
    const data = state[week]?.[d.id];
    if (data?.completed) doneDays++;
    wVocab += countUniqueLines(data?.vocab);
    wPattern += countUniqueLines(data?.pattern);

    if (data) {
      allVocab.push(...getCleanLinesArray(data.vocab));
      allPatterns.push(...getCleanLinesArray(data.pattern));
      allGrammar.push(...getCleanLinesArray(data.grammar));
    }
  });

  const weekProgress = Math.round((doneDays / DAYS.length) * 100);

  return (
    <div className="bg-[#070f21] border border-[#1e293b] rounded-lg p-4">
      <h4 className="text-sm font-bold text-[#f59e0b] uppercase border-b border-dashed border-[#334155] pb-2 mb-4">
        {week}-HAFTALIK MATRIX TAHLILI
      </h4>
      <div className="space-y-4">
        <div className="relative h-6 bg-[#1e293b] rounded-lg overflow-hidden border border-[#334155]">
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#2563eb] to-[#a855f7] transition-all duration-500"
            style={{ width: `${weekProgress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white z-10">
            Haftalik umumiy progress: {weekProgress}%
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] text-center border-l-4 border-l-[#38bdf8]">
            <div className="text-xl font-bold text-[#38bdf8]">{doneDays}/7</div>
            <div className="text-[9px] text-[#94a3b8] mt-1">Kunlar</div>
          </div>
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] text-center border-l-4 border-l-[#10b981]">
            <div className="text-xl font-bold text-[#10b981]">{wVocab}</div>
            <div className="text-[9px] text-[#94a3b8] mt-1">So'zlar</div>
          </div>
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] text-center border-l-4 border-l-[#a855f7]">
            <div className="text-xl font-bold text-[#a855f7]">{wPattern}</div>
            <div className="text-[9px] text-[#94a3b8] mt-1">Patterns</div>
          </div>
        </div>

        {/* All Vocabulary */}
        {allVocab.length > 0 && (
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#10b981]">📚 HAFTALIK LUG'AT</span>
              <span className="text-xs font-bold text-[#94a3b8]">{allVocab.length} ta</span>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {allVocab.map((word, idx) => (
                <div key={idx} className="text-xs bg-[#070f21] p-1.5 rounded border-l-2 border-[#10b981] text-[#cbd5e1] flex items-center gap-2">
                  <span className="text-[#10b981] text-[10px] font-mono min-w-[24px]">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="flex-1">{word}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Patterns */}
        {allPatterns.length > 0 && (
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#a855f7]">🔄 HAFTALIK PATTERNLAR</span>
              <span className="text-xs font-bold text-[#94a3b8]">{allPatterns.length} ta</span>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {allPatterns.map((pattern, idx) => (
                <div key={idx} className="text-xs bg-[#070f21] p-1.5 rounded border-l-2 border-[#a855f7] text-[#cbd5e1] flex items-center gap-2">
                  <span className="text-[#a855f7] text-[10px] font-mono min-w-[24px]">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="flex-1 italic">{pattern}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Grammar */}
        {allGrammar.length > 0 && (
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#60a5fa]">📘 HAFTALIK GRAMMAR</span>
              <span className="text-xs font-bold text-[#94a3b8]">{allGrammar.length} gap</span>
            </div>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {allGrammar.map((sentence, idx) => (
                <div key={idx} className="text-xs bg-[#070f21] p-1.5 rounded border-l-2 border-[#60a5fa] text-[#cbd5e1] flex items-start gap-2">
                  <span className="text-[#60a5fa] text-[10px] font-mono min-w-[24px]">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="flex-1">{sentence}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MonthReport({ state, activeWeek }: any) {
  const getCleanLinesArray = (text: string) => {
    if (!text) return [];
    return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  };

  const countUniqueLines = (text: string) => {
    if (!text) return 0;
    return text.split('\n').map(l => l.trim()).filter(l => l.length > 0).length;
  };

  const allVocab: string[] = [];
  const allPatterns: string[] = [];
  const allGrammar: string[] = [];
  let totalVocabCount = 0;
  let totalPatternCount = 0;
  let totalGrammarCount = 0;

  // Collect all data from all weeks
  Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).forEach(w => {
    DAYS.forEach(d => {
      const data = state[w]?.[d.id];
      if (data) {
        const vocabLines = getCleanLinesArray(data.vocab);
        const patternLines = getCleanLinesArray(data.pattern);
        const grammarLines = getCleanLinesArray(data.grammar);

        totalVocabCount += vocabLines.length;
        totalPatternCount += patternLines.length;
        totalGrammarCount += grammarLines.length;

        allVocab.push(...vocabLines);
        allPatterns.push(...patternLines);
        allGrammar.push(...grammarLines);
      }
    });
  });

  return (
    <div className="bg-[#070f21] border border-[#1e293b] rounded-lg p-4">
      <h4 className="text-sm font-bold text-[#f59e0b] uppercase border-b border-dashed border-[#334155] pb-2 mb-4">
        12 HAFTALIK GLOBAL STRATEGIYA
      </h4>

      {/* Global Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] text-center border-l-4 border-l-[#10b981]">
          <div className="text-2xl font-bold text-[#10b981]">{totalVocabCount}</div>
          <div className="text-[9px] text-[#94a3b8] mt-1">JAMI SO'ZLAR</div>
        </div>
        <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] text-center border-l-4 border-l-[#a855f7]">
          <div className="text-2xl font-bold text-[#a855f7]">{totalPatternCount}</div>
          <div className="text-[9px] text-[#94a3b8] mt-1">JAMI PATTERNS</div>
        </div>
        <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] text-center border-l-4 border-l-[#60a5fa]">
          <div className="text-2xl font-bold text-[#60a5fa]">{totalGrammarCount}</div>
          <div className="text-[9px] text-[#94a3b8] mt-1">JAMI GRAMMAR</div>
        </div>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {/* Week Progress Bars */}
        <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] space-y-2">
          <h5 className="text-xs font-bold text-[#cbd5e1] mb-2 border-b border-[#334155] pb-2">HAFTALIK PROGRESS</h5>
          {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map(w => {
            let dCount = 0;
            let wVocab = 0;
            let wPattern = 0;
            DAYS.forEach(d => {
              const data = state[w]?.[d.id];
              if (data?.completed) dCount++;
              wVocab += countUniqueLines(data?.vocab);
              wPattern += countUniqueLines(data?.pattern);
            });
            const p = Math.round((dCount / DAYS.length) * 100);
            const isActive = w === activeWeek;

            return (
              <div key={w} className={`p-2.5 rounded-lg border transition-all ${isActive ? 'border-[#38bdf8] bg-[#070f21]' : 'border-[#334155] bg-[#050b14]'}`}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${isActive ? 'text-[#38bdf8]' : 'text-[#cbd5e1]'}`}>
                      {w}-Hafta
                    </span>
                    <span className="text-[9px] text-[#94a3b8]">
                      📚 {wVocab} | 🔄 {wPattern}
                    </span>
                  </div>
                  <span className={`text-xs font-bold ${p === 100 ? 'text-[#10b981]' : 'text-[#94a3b8]'}`}>
                    {p}%
                  </span>
                </div>
                <div className="h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${p === 100
                        ? 'bg-gradient-to-r from-[#10b981] to-[#059669]'
                        : 'bg-gradient-to-r from-[#2563eb] to-[#a855f7]'
                      }`}
                    style={{ width: `${p}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* All Vocabulary */}
        {allVocab.length > 0 && (
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#10b981]">📚 BARCHA SO'ZLAR</span>
              <span className="text-xs font-bold text-[#94a3b8]">{allVocab.length} ta</span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {allVocab.map((word, idx) => (
                <div key={idx} className="text-[11px] bg-[#070f21] p-1.5 rounded border-l-2 border-[#10b981] text-[#cbd5e1] flex items-center gap-2">
                  <span className="text-[#10b981] text-[10px] font-mono min-w-[28px]">{String(idx + 1).padStart(3, '0')}</span>
                  <span className="flex-1">{word}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Patterns */}
        {allPatterns.length > 0 && (
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#a855f7]">🔄 BARCHA PATTERNLAR</span>
              <span className="text-xs font-bold text-[#94a3b8]">{allPatterns.length} ta</span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {allPatterns.map((pattern, idx) => (
                <div key={idx} className="text-[11px] bg-[#070f21] p-1.5 rounded border-l-2 border-[#a855f7] text-[#cbd5e1] flex items-center gap-2">
                  <span className="text-[#a855f7] text-[10px] font-mono min-w-[28px]">{String(idx + 1).padStart(3, '0')}</span>
                  <span className="flex-1 italic">{pattern}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Grammar */}
        {allGrammar.length > 0 && (
          <div className="bg-[#0f172a] p-3 rounded-lg border border-[#334155] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#60a5fa]">📘 BARCHA GRAMMAR</span>
              <span className="text-xs font-bold text-[#94a3b8]">{allGrammar.length} gap</span>
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {allGrammar.map((sentence, idx) => (
                <div key={idx} className="text-[11px] bg-[#070f21] p-1.5 rounded border-l-2 border-[#60a5fa] text-[#cbd5e1] flex items-start gap-2">
                  <span className="text-[#60a5fa] text-[10px] font-mono min-w-[28px]">{String(idx + 1).padStart(3, '0')}</span>
                  <span className="flex-1">{sentence}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
