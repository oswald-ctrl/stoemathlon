import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Monitor,
  Settings,
  Edit2,
  Save,
  X,
  Lock,
  Download,
  RefreshCw,
  Key,
} from 'lucide-react';
import { ref, set, onValue } from 'firebase/database';
import { database } from './Firebase';

export default function App() {
  const [view, setView] = useState('home');
  const [tourId, setTourId] = useState(null);
  const [teams, setTeams] = useState(
    Array.from({ length: 16 }, (_, i) => `Équipe ${i + 1}`)
  );
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState([...teams]);
  const [tab, setTab] = useState('pools');
  const [dashTab, setDashTab] = useState('pools');
  const [loading, setLoading] = useState(true);
  const [adminCode, setAdminCode] = useState('Lune');
  const [adminInput, setAdminInput] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [showCodeChange, setShowCodeChange] = useState(false);

  const tours = [
    {
      id: 'billard',
      name: 'Billard',
      icon: '🎱',
      pools: [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
      ],
    },
    {
      id: 'pingpong',
      name: 'Ping Pong',
      icon: '🏓',
      pools: [
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
      ],
    },
    {
      id: 'kicker',
      name: 'Kicker',
      icon: '⚽',
      pools: [
        [0, 5, 10, 15],
        [1, 4, 11, 14],
        [2, 7, 8, 13],
        [3, 6, 9, 12],
      ],
    },
    {
      id: 'flechettes',
      name: 'Fléchettes',
      icon: '🎯',
      pools: [
        [0, 7, 9, 14],
        [3, 4, 10, 13],
        [1, 6, 8, 15],
        [2, 5, 11, 12],
      ],
    },
  ];
  const pts = {
    1: 25,
    2: 21,
    3: 18,
    4: 16,
    5: 11,
    6: 11,
    7: 11,
    8: 11,
    9: 7,
    10: 7,
    11: 7,
    12: 7,
    13: 4,
    14: 4,
    15: 4,
    16: 4,
  };

  const initPools = (poolDef) => {
    return poolDef.map((teams, i) => {
      const m = [];
      for (let x = 0; x < 4; x++)
        for (let y = x + 1; y < 4; y++)
          m.push({
            t1: teams[x],
            t2: teams[y],
            s1: null,
            s2: null,
            done: false,
          });
      return { n: String.fromCharCode(65 + i), teams, matches: m };
    });
  };

  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const teamsRef = ref(database, 'teams');
        onValue(teamsRef, (snapshot) => {
          if (snapshot.exists()) {
            setTeams(snapshot.val());
          }
        });

        const dataRef = ref(database, 'tournamentData');
        onValue(dataRef, (snapshot) => {
          if (snapshot.exists()) {
            setData(snapshot.val());
          } else {
            const d = {};
            tours.forEach(
              (t) =>
                (d[t.id] = {
                  pools: initPools(t.pools),
                  finals: {
                    q: Array(4)
                      .fill(0)
                      .map(() => ({
                        t1: null,
                        t2: null,
                        w1: 0,
                        w2: 0,
                        g: [{ s1: null, s2: null }],
                        win: null,
                        done: false,
                      })),
                    s: Array(2)
                      .fill(0)
                      .map(() => ({
                        t1: null,
                        t2: null,
                        w1: 0,
                        w2: 0,
                        g: [{ s1: null, s2: null }],
                        win: null,
                        done: false,
                      })),
                    f: {
                      t1: null,
                      t2: null,
                      w1: 0,
                      w2: 0,
                      g: [{ s1: null, s2: null }],
                      win: null,
                      done: false,
                    },
                    t: {
                      t1: null,
                      t2: null,
                      w1: 0,
                      w2: 0,
                      g: [{ s1: null, s2: null }],
                      win: null,
                      done: false,
                    },
                  },
                })
            );
            setData(d);
            set(dataRef, d);
          }
        });

        const codeRef = ref(database, 'adminCode');
        onValue(codeRef, (snapshot) => {
          if (snapshot.exists()) {
            setAdminCode(snapshot.val());
          } else {
            set(codeRef, 'Lune');
          }
        });

        setLoading(false);
      } catch (e) {
        console.error('Erreur chargement:', e);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!loading && teams) {
      set(ref(database, 'teams'), teams);
    }
  }, [teams, loading]);

  useEffect(() => {
    if (!loading && data) {
      set(ref(database, 'tournamentData'), data);

      tours.forEach((tour) => {
        const td = data[tour.id];

        const allPoolsDone = td.pools.every((p) =>
          p.matches.every((m) => m.done)
        );
        const qNotSet = td.finals.q.some((m) => m.t1 === null);

        if (allPoolsDone && qNotSet) {
          const qualified = [];
          td.pools.forEach((p) => {
            const st = calcStandings(p);
            qualified.push({ pool: p.n, first: st[0].t, second: st[1].t });
          });
          const nf = { ...td.finals };
          const pA = qualified.find((q) => q.pool === 'A'),
            pB = qualified.find((q) => q.pool === 'B'),
            pC = qualified.find((q) => q.pool === 'C'),
            pD = qualified.find((q) => q.pool === 'D');
          nf.q[0] = {
            t1: pA.first,
            t2: pD.second,
            w1: 0,
            w2: 0,
            g: [{ s1: null, s2: null }],
            win: null,
            done: false,
          };
          nf.q[1] = {
            t1: pB.second,
            t2: pC.first,
            w1: 0,
            w2: 0,
            g: [{ s1: null, s2: null }],
            win: null,
            done: false,
          };
          nf.q[2] = {
            t1: pC.second,
            t2: pD.first,
            w1: 0,
            w2: 0,
            g: [{ s1: null, s2: null }],
            win: null,
            done: false,
          };
          nf.q[3] = {
            t1: pA.second,
            t2: pB.first,
            w1: 0,
            w2: 0,
            g: [{ s1: null, s2: null }],
            win: null,
            done: false,
          };
          setData((d) => ({ ...d, [tour.id]: { ...td, finals: nf } }));
        }

        const qDone = td.finals.q.every((m) => m.done);
        if (qDone && !td.finals.s[0].t1) {
          const nf = { ...td.finals };
          nf.s[0] = {
            t1: nf.q[0].win,
            t2: nf.q[1].win,
            w1: 0,
            w2: 0,
            g: [{ s1: null, s2: null }],
            win: null,
            done: false,
          };
          nf.s[1] = {
            t1: nf.q[2].win,
            t2: nf.q[3].win,
            w1: 0,
            w2: 0,
            g: [{ s1: null, s2: null }],
            win: null,
            done: false,
          };
          setData((d) => ({ ...d, [tour.id]: { ...td, finals: nf } }));
        }
        const sDone = td.finals.s.every((m) => m.done);
        if (sDone && !td.finals.f.t1) {
          const nf = { ...td.finals };
          nf.f = {
            t1: nf.s[0].win,
            t2: nf.s[1].win,
            w1: 0,
            w2: 0,
            g: [{ s1: null, s2: null }],
            win: null,
            done: false,
          };
          nf.t = {
            t1: nf.s[0].win === nf.s[0].t1 ? nf.s[0].t2 : nf.s[0].t1,
            t2: nf.s[1].win === nf.s[1].t1 ? nf.s[1].t2 : nf.s[1].t1,
            w1: 0,
            w2: 0,
            g: [{ s1: null, s2: null }],
            win: null,
            done: false,
          };
          setData((d) => ({ ...d, [tour.id]: { ...td, finals: nf } }));
        }
      });
    }
  }, [data, loading]);

  const calcStandings = (pool) => {
    const st = pool.teams.map((t) => ({ t, w: 0, d: 0, h: {} }));
    pool.matches.forEach((m) => {
      if (!m.done) return;
      const i1 = st.findIndex((s) => s.t === m.t1),
        i2 = st.findIndex((s) => s.t === m.t2);
      if (m.s1 > m.s2) {
        st[i1].w++;
        st[i1].d += m.s1 - m.s2;
        st[i2].d -= m.s1 - m.s2;
        st[i1].h[m.t2] = 1;
        st[i2].h[m.t1] = -1;
      } else {
        st[i2].w++;
        st[i2].d += m.s2 - m.s1;
        st[i1].d -= m.s2 - m.s1;
        st[i2].h[m.t1] = 1;
        st[i1].h[m.t2] = -1;
      }
    });
    st.sort((a, b) => {
      if (b.w !== a.w) return b.w - a.w;
      const h = a.h[b.t];
      if (h !== undefined) return -h;
      return b.d - a.d;
    });
    return st;
  };

  const calcRanking = (td) => {
    const r = Array(16)
      .fill(0)
      .map((_, i) => ({ team: i, rank: null }));
    const hasAnyMatch = td.pools.some((p) => p.matches.some((m) => m.done));
    if (!hasAnyMatch) return r;

    if (td.finals.f.done) {
      r.find((x) => x.team === td.finals.f.win).rank = 1;
      r.find(
        (x) =>
          x.team ===
          (td.finals.f.win === td.finals.f.t1 ? td.finals.f.t2 : td.finals.f.t1)
      ).rank = 2;
    }
    if (td.finals.t.done) {
      r.find((x) => x.team === td.finals.t.win).rank = 3;
      r.find(
        (x) =>
          x.team ===
          (td.finals.t.win === td.finals.t.t1 ? td.finals.t.t2 : td.finals.t.t1)
      ).rank = 4;
    }
    td.finals.s.forEach((m, i) => {
      if (m.done) {
        const l = m.win === m.t1 ? m.t2 : m.t1;
        if (
          r.find((x) => x.team === l).rank === null ||
          r.find((x) => x.team === l).rank > 4
        )
          r.find((x) => x.team === l).rank = 5 + i;
      }
    });
    td.finals.q.forEach((m, i) => {
      if (m.done) {
        const l = m.win === m.t1 ? m.t2 : m.t1;
        if (
          r.find((x) => x.team === l).rank === null ||
          r.find((x) => x.team === l).rank > 7
        )
          r.find((x) => x.team === l).rank = 9 + i;
      }
    });

    const allPoolRanks = [];
    td.pools.forEach((p) => {
      const hasPoolMatches = p.matches.some((m) => m.done);
      if (hasPoolMatches) {
        const st = calcStandings(p);
        st.forEach((s, si) => {
          allPoolRanks.push({
            team: s.t,
            poolRank: si + 1,
            wins: s.w,
            diff: s.d,
          });
        });
      }
    });

    if (allPoolRanks.length > 0) {
      allPoolRanks.sort((a, b) => {
        if (a.poolRank !== b.poolRank) return a.poolRank - b.poolRank;
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.diff - a.diff;
      });
      allPoolRanks.forEach((pr, i) => {
        const team = r.find((x) => x.team === pr.team);
        if (team.rank === null || team.rank > 8) team.rank = 9 + i;
      });
    }

    return r;
  };

  const calcGeneral = () => {
    const s = teams.map((_, i) => ({ team: i, total: 0, details: {} }));
    tours.forEach((t) => {
      const rk = calcRanking(data[t.id]);
      rk.forEach((x) => {
        const p = x.rank !== null ? pts[x.rank] || 0 : 0;
        s[x.team].details[t.id] = p;
        s[x.team].total += p;
      });
    });
    s.sort((a, b) => b.total - a.total);
    return s;
  };

  const exportPDF = () => {
    alert(
      '📄 Utilisez Ctrl+P (ou Cmd+P) pour imprimer/sauvegarder le classement en PDF !'
    );
    window.print();
  };

  const resetAllData = () => {
    if (
      confirm(
        '⚠️ ATTENTION ! Voulez-vous vraiment réinitialiser TOUTES les données ? Cette action est irréversible !'
      )
    ) {
      const d = {};
      tours.forEach(
        (t) =>
          (d[t.id] = {
            pools: initPools(t.pools),
            finals: {
              q: Array(4)
                .fill(0)
                .map(() => ({
                  t1: null,
                  t2: null,
                  w1: 0,
                  w2: 0,
                  g: [{ s1: null, s2: null }],
                  win: null,
                  done: false,
                })),
              s: Array(2)
                .fill(0)
                .map(() => ({
                  t1: null,
                  t2: null,
                  w1: 0,
                  w2: 0,
                  g: [{ s1: null, s2: null }],
                  win: null,
                  done: false,
                })),
              f: {
                t1: null,
                t2: null,
                w1: 0,
                w2: 0,
                g: [{ s1: null, s2: null }],
                win: null,
                done: false,
              },
              t: {
                t1: null,
                t2: null,
                w1: 0,
                w2: 0,
                g: [{ s1: null, s2: null }],
                win: null,
                done: false,
              },
            },
          })
      );
      setData(d);
      alert('✅ Toutes les données ont été réinitialisées !');
    }
  };

  const changeAdminCode = () => {
    if (newCode.trim() === '') {
      alert('❌ Le code ne peut pas être vide !');
      return;
    }
    setAdminCode(newCode);
    set(ref(database, 'adminCode'), newCode);
    setShowCodeChange(false);
    setNewCode('');
    alert('✅ Code admin modifié avec succès !');
  };

  const updMatch = (tid, pn, mi, s1, s2) => {
    const d = { ...data[tid] },
      p = d.pools.find((p) => p.n === pn),
      m = p.matches[mi];
    m.s1 = s1;
    m.s2 = s2;
    m.done = s1 !== null && s2 !== null && s1 !== s2;
    setData({ ...data, [tid]: d });
  };

  const updFinal = (tid, stage, mi, gi, s1, s2) => {
    const d = { ...data[tid] },
      m =
        stage === 'q' || stage === 's' ? d.finals[stage][mi] : d.finals[stage];
    m.g[gi].s1 = s1;
    m.g[gi].s2 = s2;
    if (s1 !== null && s2 !== null && s1 !== s2) {
      if (s1 > s2) m.w1++;
      else m.w2++;
      if (m.w1 === 2 || m.w2 === 2) {
        m.win = m.w1 === 2 ? m.t1 : m.t2;
        m.done = true;
      } else if (m.g.length < 3) m.g.push({ s1: null, s2: null });
    }
    setData({ ...data, [tid]: d });
  };

  const MatchInput = ({ match, tourId, poolName, matchIndex }) => {
    const [s1, setS1] = useState(match.s1 ?? ''),
      [s2, setS2] = useState(match.s2 ?? '');
    const [editing, setEditing] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    useEffect(() => {
      if (!editing) {
        setS1(match.s1 ?? '');
        setS2(match.s2 ?? '');
      }
    }, [match.s1, match.s2, editing]);
    const hasChanges =
      editing && (s1 !== (match.s1 ?? '') || s2 !== (match.s2 ?? ''));
    return (
      <div
        className={`flex items-center justify-between bg-white/5 rounded-lg p-2 mb-2 ${
          match.done ? 'border-2 border-green-500' : ''
        } ${hasChanges ? 'border-2 border-yellow-400' : ''}`}
      >
        <div className="flex-1 text-white font-semibold text-xs truncate">
          {match.done && match.s1 > match.s2 && '🏆'}
          {teams[match.t1]}
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={s1}
            onChange={(e) => {
              setS1(e.target.value);
              setEditing(true);
              setJustSaved(false);
            }}
            onFocus={() => setEditing(true)}
            className="w-12 px-1 py-1 bg-white/10 text-white text-center rounded border border-white/30 font-bold text-sm"
            placeholder="-"
          />
          <span className="text-white font-bold text-sm">VS</span>
          <input
            type="number"
            value={s2}
            onChange={(e) => {
              setS2(e.target.value);
              setEditing(true);
              setJustSaved(false);
            }}
            onFocus={() => setEditing(true)}
            className="w-12 px-1 py-1 bg-white/10 text-white text-center rounded border border-white/30 font-bold text-sm"
            placeholder="-"
          />
          <button
            onClick={() => {
              updMatch(
                tourId,
                poolName,
                matchIndex,
                s1 === '' ? null : parseInt(s1),
                s2 === '' ? null : parseInt(s2)
              );
              setEditing(false);
              setJustSaved(true);
              setTimeout(() => setJustSaved(false), 2000);
            }}
            className={`px-2 py-1 ${
              hasChanges ? 'bg-yellow-500 animate-pulse' : 'bg-blue-600'
            } text-white rounded font-bold text-sm`}
          >
            {justSaved ? '💾' : '✅'}
          </button>
        </div>
        <div className="flex-1 text-right text-white font-semibold text-xs truncate">
          {teams[match.t2]}
          {match.done && match.s2 > match.s1 && '🏆'}
        </div>
      </div>
    );
  };

  const FinalInput = ({ game, tourId, stage, matchIndex, gameIndex }) => {
    const [s1, setS1] = useState(game.s1 ?? ''),
      [s2, setS2] = useState(game.s2 ?? '');
    const [editing, setEditing] = useState(false);
    const [justSaved, setJustSaved] = useState(false);
    useEffect(() => {
      if (!editing) {
        setS1(game.s1 ?? '');
        setS2(game.s2 ?? '');
      }
    }, [game.s1, game.s2, editing]);
    const hasChanges =
      editing && (s1 !== (game.s1 ?? '') || s2 !== (game.s2 ?? ''));
    return (
      <div
        className={`flex justify-between items-center mb-1 bg-white/5 p-1 rounded ${
          hasChanges ? 'border border-yellow-400' : ''
        }`}
      >
        <span className="text-white text-xs">M{gameIndex + 1}</span>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={s1}
            onChange={(e) => {
              setS1(e.target.value);
              setEditing(true);
              setJustSaved(false);
            }}
            onFocus={() => setEditing(true)}
            className="w-10 px-1 py-1 bg-white/10 text-white text-center rounded text-xs"
            placeholder="-"
          />
          <span className="text-white text-xs">:</span>
          <input
            type="number"
            value={s2}
            onChange={(e) => {
              setS2(e.target.value);
              setEditing(true);
              setJustSaved(false);
            }}
            onFocus={() => setEditing(true)}
            className="w-10 px-1 py-1 bg-white/10 text-white text-center rounded text-xs"
            placeholder="-"
          />
          <button
            onClick={() => {
              updFinal(
                tourId,
                stage,
                matchIndex,
                gameIndex,
                s1 === '' ? null : parseInt(s1),
                s2 === '' ? null : parseInt(s2)
              );
              setEditing(false);
              setJustSaved(true);
              setTimeout(() => setJustSaved(false), 2000);
            }}
            className={`px-2 py-1 ${
              hasChanges ? 'bg-yellow-500 animate-pulse' : 'bg-blue-600'
            } text-white rounded text-xs`}
          >
            {justSaved ? '💾' : '✅'}
          </button>
        </div>
      </div>
    );
  };

  if (loading || !data)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🚀</div>
          <div className="text-2xl text-white font-bold">Chargement...</div>
        </div>
      </div>
    );

  if (view === 'home')
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Trophy className="w-12 h-12 text-yellow-400 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                🚀 STOEMATHLON 🚀
              </h1>
              <Trophy className="w-12 h-12 text-yellow-400 animate-pulse" />
            </div>
            <p className="text-sm md:text-xl text-yellow-300 font-semibold">
              ⭐ 32 Sportifs ⭐ 16 équipes ⭐ 2 cuistots ⭐ 4 tournois ⭐ 2
              Champions ⭐
            </p>
            <div className="mt-2 text-green-400 text-sm">
              🔥 Firebase Real-Time Sync ✅
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {tours.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTourId(t.id);
                  setView('tour');
                  setTab('pools');
                }}
                className="bg-white/10 rounded-xl p-6 hover:bg-white/20 border-2 border-white/20 hover:border-yellow-400 transition-all"
              >
                <div className="text-6xl mb-4">{t.icon}</div>
                <h2 className="text-2xl font-bold text-white">{t.name}</h2>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setView('dash')}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-4 flex items-center justify-center gap-2"
            >
              <Monitor className="w-6 h-6" />
              <span className="text-lg font-semibold">Grand Écran</span>
            </button>
            <button
              onClick={() => setView('general')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl p-4 flex items-center justify-center gap-2"
            >
              <Trophy className="w-6 h-6" />
              <span className="text-lg font-semibold">Classement</span>
            </button>
            <button
              onClick={() => {
                setView('settings');
                setIsAdmin(false);
                setAdminInput('');
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl p-4 flex items-center justify-center gap-2"
            >
              <Settings className="w-6 h-6" />
              <span className="text-lg font-semibold">Paramètres</span>
            </button>
          </div>
        </div>
      </div>
    );

  if (view === 'settings') {
    if (!isAdmin)
      return (
        <div className="min-h-screen bg-gray-900 p-4">
          <div className="max-w-md mx-auto mt-20">
            <button
              onClick={() => setView('home')}
              className="mb-4 px-4 py-2 bg-white/10 text-white rounded"
            >
              ← Retour
            </button>
            <div className="bg-white/10 rounded-xl p-8 text-center">
              <Lock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-6">
                🔐 Zone Admin
              </h1>
              <p className="text-white mb-4">Entrez le code administrateur</p>
              <input
                type="password"
                value={adminInput}
                onChange={(e) => setAdminInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && adminInput === adminCode) {
                    setIsAdmin(true);
                    setAdminInput('');
                  }
                }}
                className="w-full px-4 py-3 bg-white/10 text-white rounded-lg border border-white/30 mb-4"
                placeholder="Code"
              />
              <button
                onClick={() => {
                  if (adminInput === adminCode) {
                    setIsAdmin(true);
                    setAdminInput('');
                  } else {
                    alert('❌ Code incorrect !');
                    setAdminInput('');
                  }
                }}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
              >
                Déverrouiller
              </button>
            </div>
          </div>
        </div>
      );

    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setView('home')}
            className="mb-4 px-4 py-2 bg-white/10 text-white rounded"
          >
            ← Retour
          </button>
          <h1 className="text-3xl font-bold text-white mb-6">⚙️ Zone Admin</h1>
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Noms des équipes
                </h2>
                {!editing ? (
                  <button
                    onClick={() => {
                      setTemp([...teams]);
                      setEditing(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setTeams([...temp]);
                        setEditing(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => {
                        setTemp([...teams]);
                        setEditing(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(editing ? temp : teams).map((t, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-white font-bold w-10 flex-shrink-0">
                      {i + 1}.
                    </span>
                    {editing ? (
                      <input
                        type="text"
                        value={temp[i]}
                        onChange={(e) => {
                          const n = [...temp];
                          n[i] = e.target.value;
                          setTemp(n);
                        }}
                        className="flex-1 px-3 py-2 bg-white/10 text-white rounded border border-white/30"
                      />
                    ) : (
                      <span className="text-white flex-1">{t}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <h2 className="text-2xl font-bold text-white mb-4">
                🔑 Changer le code admin
              </h2>
              {!showCodeChange ? (
                <button
                  onClick={() => setShowCodeChange(true)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Modifier le code
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/30"
                    placeholder="Nouveau code"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={changeAdminCode}
                      className="px-4 py-2 bg-green-600 text-white rounded"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => {
                        setShowCodeChange(false);
                        setNewCode('');
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={exportPDF}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xl flex items-center justify-center gap-2"
            >
              <Download className="w-6 h-6" />
              📥 Exporter en PDF
            </button>
            <button
              onClick={resetAllData}
              className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xl flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-6 h-6" />
              🔄 Réinitialiser toutes les données
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'dash')
    return (
      <div className="min-h-screen bg-black p-2">
        <button
          onClick={() => setView('home')}
          className="mb-4 px-4 py-2 bg-gray-800 text-white rounded"
        >
          ← Retour
        </button>
        <h1 className="text-3xl font-bold text-white text-center mb-4">
          📺 STOEMATHLON LIVE 📺
        </h1>
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => setDashTab('pools')}
            className={`px-4 py-2 rounded font-semibold ${
              dashTab === 'pools'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            Poules
          </button>
          <button
            onClick={() => setDashTab('finals')}
            className={`px-4 py-2 rounded font-semibold ${
              dashTab === 'finals'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            Finales
          </button>
        </div>
        {dashTab === 'pools' ? (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {tours.map((t) => {
              const d = data[t.id];
              return (
                <div
                  key={t.id}
                  className="bg-gray-900 rounded p-3 border-2 border-gray-700"
                >
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-2xl mr-2">{t.icon}</span>
                    <h2 className="text-lg font-bold text-white">{t.name}</h2>
                  </div>
                  <div className="space-y-2">
                    {d.pools.map((p) => {
                      const st = calcStandings(p);
                      return (
                        <div key={p.n} className="bg-gray-800 rounded p-2">
                          <div className="text-yellow-400 font-bold text-sm mb-1">
                            Poule {p.n}
                          </div>
                          {st.map((s, i) => (
                            <div
                              key={s.t}
                              className="text-white text-xs flex justify-between"
                            >
                              <span className="truncate">
                                {i + 1}. {teams[s.t]}
                              </span>
                              <span>{s.w}V</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 mb-4">
            {tours.map((t) => {
              const d = data[t.id];
              return (
                <div
                  key={t.id}
                  className="bg-gray-900 rounded p-3 border-2 border-gray-700"
                >
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-2xl mr-2">{t.icon}</span>
                    <h2 className="text-lg font-bold text-white">{t.name}</h2>
                  </div>
                  <div className="space-y-1 text-xs">
                    {d.finals.f.t1 !== null && d.finals.f.t2 !== null && (
                      <>
                        <div className="text-yellow-400 font-bold">
                          🏆 FINALE
                        </div>
                        <div
                          className={`bg-yellow-900/30 rounded p-2 ${
                            d.finals.f.done ? 'border-2 border-yellow-500' : ''
                          }`}
                        >
                          <div className="text-white font-bold truncate">
                            {teams[d.finals.f.t1]}{' '}
                            {d.finals.f.done &&
                              d.finals.f.win === d.finals.f.t1 &&
                              '🏆'}
                          </div>
                          <div className="text-white font-bold truncate">
                            {teams[d.finals.f.t2]}{' '}
                            {d.finals.f.done &&
                              d.finals.f.win === d.finals.f.t2 &&
                              '🏆'}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="bg-gray-900 rounded p-4 border-2 border-yellow-500 overflow-x-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-4">
            👑 CLASSEMENT GÉNÉRAL 👑
          </h2>
          <table className="w-full text-white text-xs">
            <thead>
              <tr className="border-b-2 border-gray-700">
                <th className="text-left p-2">Pos</th>
                <th className="text-left p-2">Équipe</th>
                <th className="text-center p-2 bg-yellow-900/30">TOTAL</th>
                {tours.map((t) => (
                  <th key={t.id} className="text-center p-2">
                    {t.icon}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {calcGeneral().map((s, i) => (
                <tr
                  key={s.team}
                  className={`border-b border-gray-800 ${
                    i < 2 ? 'bg-yellow-600/20' : ''
                  }`}
                >
                  <td className="p-2 font-bold">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i + 1}
                  </td>
                  <td className="p-2 font-semibold truncate">
                    {teams[s.team]}
                  </td>
                  <td className="text-center p-2 font-bold text-yellow-400 bg-yellow-900/30">
                    {s.total}
                  </td>
                  {tours.map((t) => (
                    <td key={t.id} className="text-center p-2">
                      {s.details[t.id] || 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

  if (view === 'general') {
    const r = calcGeneral();
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-900 to-red-900 p-4">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setView('home')}
            className="mb-4 px-4 py-2 bg-white/10 text-white rounded"
          >
            ← Retour
          </button>
          <div className="text-center mb-6">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
            <h1 className="text-4xl font-bold text-white">
              Classement Général 👑
            </h1>
          </div>
          <div className="bg-white/10 rounded-xl p-4 overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b-2 border-white/20">
                  <th className="text-right p-3">Pos</th>
                  <th className="text-left p-3">Équipe</th>
                  <th className="text-center p-3">TOTAL</th>
                  {tours.map((t) => (
                    <th key={t.id} className="text-center p-3">
                      {t.icon}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.map((s, i) => (
                  <tr
                    key={s.team}
                    className={`border-b border-white/10 ${
                      i < 2 ? 'bg-yellow-600/20' : ''
                    }`}
                  >
                    <td className="p-3 font-bold text-xl text-right">
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i + 1}
                    </td>
                    <td className="p-3 font-semibold text-lg">
                      {teams[s.team]}
                    </td>
                    <td className="text-center p-3 font-bold text-yellow-400 text-2xl bg-yellow-600/30">
                      {s.total}
                    </td>
                    {tours.map((t) => (
                      <td key={t.id} className="text-center p-3">
                        {s.details[t.id] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const tour = tours.find((t) => t.id === tourId),
    td = data[tourId],
    pe = ['🔵', '🔴', '🟢', '🟡'];
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => setView('home')}
          className="mb-4 px-4 py-2 bg-white/10 text-white rounded"
        >
          ← Retour
        </button>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{tour.icon}</div>
          <h1 className="text-4xl font-bold text-white">{tour.name}</h1>
        </div>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setTab('pools')}
            className={`flex-1 py-3 rounded-lg font-semibold ${
              tab === 'pools'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white'
            }`}
          >
            Poules
          </button>
          <button
            onClick={() => setTab('finals')}
            className={`flex-1 py-3 rounded-lg font-semibold ${
              tab === 'finals'
                ? 'bg-white text-purple-900'
                : 'bg-white/10 text-white'
            }`}
          >
            Finales
          </button>
        </div>
        {tab === 'pools' ? (
          <div className="space-y-4">
            {td.pools.map((p, pi) => {
              const st = calcStandings(p);
              return (
                <div
                  key={p.n}
                  className="bg-white/10 rounded-xl p-4 border-2 border-white/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{pe[pi]}</span>
                    <h2 className="text-2xl font-bold text-white">
                      Poule {p.n}
                    </h2>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-3">
                      Classement
                    </h3>
                    {st.map((s, i) => (
                      <div
                        key={s.t}
                        className={`flex justify-between p-2 rounded mb-2 ${
                          i < 2
                            ? 'bg-green-600/20 border-2 border-green-400'
                            : 'bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                              i === 0
                                ? 'bg-yellow-500'
                                : i === 1
                                ? 'bg-green-500'
                                : 'bg-gray-600'
                            } text-white`}
                          >
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : i + 1}
                          </span>
                          <span className="text-white font-semibold text-sm truncate">
                            {teams[s.t]}
                          </span>
                        </div>
                        <div className="flex gap-4 text-white text-sm">
                          <span>✅{s.w}V</span>
                          <span
                            className={
                              s.d > 0
                                ? 'text-green-300'
                                : s.d < 0
                                ? 'text-red-300'
                                : ''
                            }
                          >
                            {s.d > 0 ? '+' : ''}
                            {s.d}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Matchs
                  </h3>
                  {p.matches.map((m, mi) => (
                    <MatchInput
                      key={mi}
                      match={m}
                      tourId={tour.id}
                      poolName={p.n}
                      matchIndex={mi}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white/10 rounded-xl p-4 border-2 border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                ⚔️ Quarts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {td.finals.q.map((m, i) =>
                  m.t1 !== null && m.t2 !== null ? (
                    <div key={i} className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between mb-2 bg-purple-600/30 rounded-lg p-2">
                        <div className="flex-1">
                          <div className="text-white font-bold text-sm truncate">
                            {teams[m.t1]}
                          </div>
                          <div className="text-yellow-400 text-xs">
                            ⭐{m.w1}
                          </div>
                        </div>
                        <div className="text-xl px-2">VS</div>
                        <div className="flex-1 text-right">
                          <div className="text-white font-bold text-sm truncate">
                            {teams[m.t2]}
                          </div>
                          <div className="text-yellow-400 text-xs">
                            {m.w2}⭐
                          </div>
                        </div>
                      </div>
                      {m.g.map((g, gi) => (
                        <FinalInput
                          key={gi}
                          game={g}
                          tourId={tour.id}
                          stage="q"
                          matchIndex={i}
                          gameIndex={gi}
                        />
                      ))}
                      {m.done && (
                        <div className="mt-2 text-center bg-green-600 text-white font-bold py-2 rounded text-sm">
                          🏆 {teams[m.win]}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="text-white text-center py-8 text-sm"
                    >
                      ⏳ En attente
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 border-2 border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                🔥 Demis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {td.finals.s.map((m, i) =>
                  m.t1 !== null && m.t2 !== null ? (
                    <div key={i} className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between mb-2 bg-purple-600/30 rounded-lg p-2">
                        <div className="flex-1">
                          <div className="text-white font-bold text-sm truncate">
                            {teams[m.t1]}
                          </div>
                          <div className="text-yellow-400 text-xs">
                            ⭐{m.w1}
                          </div>
                        </div>
                        <div className="text-xl px-2">VS</div>
                        <div className="flex-1 text-right">
                          <div className="text-white font-bold text-sm truncate">
                            {teams[m.t2]}
                          </div>
                          <div className="text-yellow-400 text-xs">
                            {m.w2}⭐
                          </div>
                        </div>
                      </div>
                      {m.g.map((g, gi) => (
                        <FinalInput
                          key={gi}
                          game={g}
                          tourId={tour.id}
                          stage="s"
                          matchIndex={i}
                          gameIndex={gi}
                        />
                      ))}
                      {m.done && (
                        <div className="mt-2 text-center bg-green-600 text-white font-bold py-2 rounded text-sm">
                          🏆 {teams[m.win]}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="text-white text-center py-8 text-sm"
                    >
                      ⏳ En attente
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { m: td.finals.t, title: '🥉 Petite', stage: 't' },
                { m: td.finals.f, title: '🏆 FINALE', stage: 'f' },
              ].map(({ m, title, stage }) => (
                <div
                  key={stage}
                  className="bg-white/10 rounded-xl p-4 border-2 border-yellow-400"
                >
                  <h2 className="text-xl font-bold text-white mb-3 text-center">
                    {title}
                  </h2>
                  {m.t1 !== null && m.t2 !== null ? (
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex justify-between mb-2 bg-purple-600/30 rounded-lg p-2">
                        <div className="flex-1">
                          <div className="text-white font-bold text-sm truncate">
                            {teams[m.t1]}
                          </div>
                          <div className="text-yellow-400 text-xs">
                            ⭐{m.w1}
                          </div>
                        </div>
                        <div className="text-xl px-2">VS</div>
                        <div className="flex-1 text-right">
                          <div className="text-white font-bold text-sm truncate">
                            {teams[m.t2]}
                          </div>
                          <div className="text-yellow-400 text-xs">
                            {m.w2}⭐
                          </div>
                        </div>
                      </div>
                      {m.g.map((g, gi) => (
                        <FinalInput
                          key={gi}
                          game={g}
                          tourId={tour.id}
                          stage={stage}
                          matchIndex={null}
                          gameIndex={gi}
                        />
                      ))}
                      {m.done && (
                        <div className="mt-2 text-center bg-green-600 text-white font-bold py-2 rounded animate-pulse text-sm">
                          🏆 VAINQUEUR: {teams[m.win]} 🎉
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-white text-center py-8 text-sm">
                      ⏳ En attente
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
