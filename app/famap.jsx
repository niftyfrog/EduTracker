// ─── FA System Map ────────────────────────────────────────────────────────────

const FA_NODES = [
  {
    id: 'sensor', label: 'センサー層', icon: '📡',
    tech: ['SQL', 'Oracle'], color: '#5b8dee',
    x: 110, y: 180, deps: [],
    desc: '現場センサーからリアルタイムデータを収集。SQL/Oracleで生データを蓄積・管理する。',
    tasks: [
      { id: 'fa1', no: 1, title: 'センサーデータのSELECT基礎', tag: '基礎', done: false },
      { id: 'fa2', no: 2, title: 'Oracle接続・クエリ実行', tag: '基礎', done: false },
      { id: 'fa3', no: 3, title: '時系列データのWHERE・ORDER BY', tag: '基礎', done: false },
      { id: 'fa4', no: 4, title: 'リアルタイム集計（GROUP BY）', tag: '実案件', done: false },
      { id: 'fa5', no: 5, title: 'センサー異常検知クエリ設計', tag: '実案件', done: false },
    ],
  },
  {
    id: 'plc', label: 'PLC制御', icon: '⚙️',
    tech: ['C#'], color: '#911619',
    x: 330, y: 80, deps: ['sensor'],
    desc: 'PLC（プログラマブルロジックコントローラ）をC#で制御。センサー値に基づき機械動作を命令する。',
    tasks: [
      { id: 'fa6',  no: 1, title: 'C#基礎文法・型システム', tag: '基礎', done: false },
      { id: 'fa7',  no: 2, title: '非同期処理（async/await）', tag: '基礎', done: false },
      { id: 'fa8',  no: 3, title: 'シリアル通信ライブラリ実装', tag: '実案件', done: false },
      { id: 'fa9',  no: 4, title: 'PLCプロトコル（Modbus）実装', tag: '実案件', done: false },
      { id: 'fa10', no: 5, title: '制御ループ・インターロック設計', tag: '実案件', done: false },
    ],
  },
  {
    id: 'scada', label: 'SCADA監視', icon: '🖥️',
    tech: ['VB.NET'], color: '#2d7a4f',
    x: 560, y: 60, deps: ['plc'],
    desc: 'SCADAシステムをVB.NETで構築。FA全体を監視・操作するHMI（Human Machine Interface）を提供する。',
    tasks: [
      { id: 'fa11', no: 1, title: 'VB.NET基礎・Windowsフォーム', tag: '基礎', done: false },
      { id: 'fa12', no: 2, title: 'タイマー・イベント駆動UI', tag: '基礎', done: false },
      { id: 'fa13', no: 3, title: 'リアルタイムグラフ描画', tag: '実案件', done: false },
      { id: 'fa14', no: 4, title: 'アラーム管理システム実装', tag: '実案件', done: false },
      { id: 'fa15', no: 5, title: '画面遷移・状態管理設計', tag: '実案件', done: false },
    ],
  },
  {
    id: 'db', label: 'データベース', icon: '🗄️',
    tech: ['SQL', 'Oracle'], color: '#b45309',
    x: 330, y: 300, deps: ['sensor'],
    desc: '生産データの永続化・管理。トランザクション・インデックス最適化でFA環境の高速クエリを実現。',
    tasks: [
      { id: 'fa16', no: 1, title: 'テーブル設計・正規化', tag: '基礎', done: false },
      { id: 'fa17', no: 2, title: 'Oracle固有機能（ROWNUM等）', tag: '基礎', done: false },
      { id: 'fa18', no: 3, title: 'インデックス設計・チューニング', tag: '実案件', done: false },
      { id: 'fa19', no: 4, title: 'ストアドプロシージャ実装', tag: '実案件', done: false },
      { id: 'fa20', no: 5, title: 'バックアップ・リカバリ設計', tag: '実案件', done: false },
    ],
  },
  {
    id: 'report', label: 'レポート生成', icon: '📊',
    tech: ['Java', 'SQL', 'Oracle'], color: '#6d28d9',
    x: 560, y: 310, deps: ['db'],
    desc: 'Javaで生産レポートを自動生成。DBから集計したデータをPDF・Excelとして出力する。',
    tasks: [
      { id: 'fa21', no: 1, title: 'Java + JDBC接続', tag: '基礎', done: false },
      { id: 'fa22', no: 2, title: 'SQL集計結果のJavaへのマッピング', tag: '基礎', done: false },
      { id: 'fa23', no: 3, title: 'JasperReportsでPDF生成', tag: '実案件', done: false },
      { id: 'fa24', no: 4, title: 'Apache POIでExcel出力', tag: '実案件', done: false },
      { id: 'fa25', no: 5, title: '定期レポートスケジューラ実装', tag: '実案件', done: false },
    ],
  },
  {
    id: 'api', label: '外部API連携', icon: '🔌',
    tech: ['C#'], color: '#0891b2',
    x: 760, y: 185, deps: ['plc', 'db'],
    desc: 'C#でERPや在庫システムと連携。生産データをリアルタイムに外部システムへ同期する。',
    tasks: [
      { id: 'fa26', no: 1, title: 'REST API呼び出し（HttpClient）', tag: '基礎', done: false },
      { id: 'fa27', no: 2, title: 'JSON/XMLシリアライズ', tag: '基礎', done: false },
      { id: 'fa28', no: 3, title: 'OAuth2認証実装', tag: '実案件', done: false },
      { id: 'fa29', no: 4, title: 'Webhookサーバー実装', tag: '実案件', done: false },
      { id: 'fa30', no: 5, title: 'エラーハンドリング・リトライ設計', tag: '実案件', done: false },
    ],
  },
];

// Edge definitions
const FA_EDGES = [
  { from: 'sensor', to: 'plc' },
  { from: 'sensor', to: 'db' },
  { from: 'plc',    to: 'scada' },
  { from: 'plc',    to: 'api' },
  { from: 'db',     to: 'report' },
  { from: 'db',     to: 'api' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function isUnlocked(nodeId, nodeStates) {
  const node = FA_NODES.find(n => n.id === nodeId);
  if (!node.deps.length) return true;
  return node.deps.every(dep => {
    const depNode = FA_NODES.find(n => n.id === dep);
    const depState = nodeStates[dep] || {};
    const depDone = depNode.tasks.filter(t => depState[t.id]).length;
    return depDone === depNode.tasks.length;
  });
}

function getNodeProgress(nodeId, nodeStates) {
  const node = FA_NODES.find(n => n.id === nodeId);
  const state = nodeStates[nodeId] || {};
  const done = node.tasks.filter(t => state[t.id]).length;
  return { done, total: node.tasks.length, pct: Math.round((done / node.tasks.length) * 100) };
}

// ── Node component (SVG) ──────────────────────────────────────────────────────
function FANode({ node, selected, unlocked, progress, onClick, justUnlocked }) {
  const { done, total, pct } = progress;
  const complete = done === total;
  const [pulse, setPulse] = React.useState(justUnlocked);

  React.useEffect(() => {
    if (justUnlocked) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 1200);
      return () => clearTimeout(t);
    }
  }, [justUnlocked]);

  const W = 130, H = 72, R = 10;
  const cx = node.x + W / 2;
  const cy = node.y + H / 2;

  // Arc for progress ring
  const ringR = 22;
  const circ = 2 * Math.PI * ringR;
  const offset = circ - (pct / 100) * circ;

  return (
    <g onClick={unlocked ? onClick : undefined} style={{ cursor: unlocked ? 'pointer' : 'default' }}>
      {/* Pulse ring on unlock */}
      {pulse && (
        <circle cx={cx} cy={cy} r={50} fill="none" stroke={node.color} strokeWidth={2} opacity={0.5}
          style={{ animation: 'fa-pulse 1.2s ease-out forwards' }} />
      )}

      {/* Drop shadow */}
      <rect x={node.x + 2} y={node.y + 3} width={W} height={H} rx={R} fill="rgba(0,0,0,0.08)" />

      {/* Card bg */}
      <rect x={node.x} y={node.y} width={W} height={H} rx={R}
        fill={unlocked ? '#fff' : '#f3f3f3'}
        stroke={selected ? node.color : unlocked ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.06)'}
        strokeWidth={selected ? 2.5 : 1.5}
      />

      {/* Complete glow overlay */}
      {complete && (
        <rect x={node.x} y={node.y} width={W} height={H} rx={R}
          fill={node.color} fillOpacity={0.07}
          stroke={node.color} strokeWidth={2}
        />
      )}

      {/* Top accent bar */}
      <rect x={node.x} y={node.y} width={W} height={4} rx={2}
        fill={unlocked ? node.color : '#ccc'} opacity={unlocked ? 1 : 0.5} />

      {/* Icon + Label */}
      <text x={node.x + 12} y={node.y + 26} fontSize={16} dominantBaseline="middle"
        style={{ userSelect: 'none' }}>{node.icon}</text>
      <text x={node.x + 34} y={node.y + 26} fontSize={12} fontWeight={600}
        fill={unlocked ? '#1a1a1a' : '#aaa'} dominantBaseline="middle"
        fontFamily="inherit" style={{ userSelect: 'none' }}>{node.label}</text>

      {/* Tech tags */}
      {node.tech.slice(0, 2).map((t, i) => (
        <g key={t}>
          <rect x={node.x + 10 + i * 50} y={node.y + 42} width={44} height={16} rx={4}
            fill={unlocked ? node.color + '18' : '#eee'} />
          <text x={node.x + 32 + i * 50} y={node.y + 50} fontSize={9} textAnchor="middle"
            fill={unlocked ? node.color : '#bbb'} fontFamily="inherit" fontWeight={500}
            dominantBaseline="middle" style={{ userSelect: 'none' }}>{t}</text>
        </g>
      ))}

      {/* Progress ring */}
      <circle cx={node.x + W - 22} cy={node.y + H - 20} r={ringR}
        fill="none" stroke="#f0f0f0" strokeWidth={4} />
      <circle cx={node.x + W - 22} cy={node.y + H - 20} r={ringR}
        fill="none" stroke={unlocked ? node.color : '#ddd'} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: `rotate(-90deg)`, transformOrigin: `${node.x + W - 22}px ${node.y + H - 20}px`, transition: 'stroke-dashoffset 0.5s ease' }}
      />
      <text x={node.x + W - 22} y={node.y + H - 20} fontSize={9} textAnchor="middle"
        fill={unlocked ? node.color : '#ccc'} fontWeight={700} dominantBaseline="middle"
        fontFamily="inherit" style={{ userSelect: 'none' }}>{pct}%</text>

      {/* Lock icon */}
      {!unlocked && (
        <text x={cx} y={node.y + H + 14} fontSize={11} textAnchor="middle"
          fill="#bbb" fontFamily="inherit" style={{ userSelect: 'none' }}>🔒 ロック中</text>
      )}
      {complete && (
        <text x={cx} y={node.y + H + 14} fontSize={11} textAnchor="middle"
          fill={node.color} fontWeight={600} fontFamily="inherit" style={{ userSelect: 'none' }}>✦ 完成</text>
      )}
    </g>
  );
}

// ── Right Panel ───────────────────────────────────────────────────────────────
function FAPanel({ node, nodeStates, setNodeStates, role }) {
  if (!node) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#bbb', gap: 12 }}>
      <div style={{ fontSize: 48 }}>🏭</div>
      <div style={{ fontSize: 14 }}>コンポーネントをクリックして詳細を表示</div>
    </div>
  );

  const state = nodeStates[node.id] || {};
  const { done, total, pct } = getNodeProgress(node.id, nodeStates);
  const complete = done === total;

  function toggleTask(taskId) {
    const next = { ...state, [taskId]: !state[taskId] };
    setNodeStates(prev => ({ ...prev, [node.id]: next }));
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>{node.icon}</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{node.label}</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
              {node.tech.map(t => (
                <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: node.color + '15', color: node.color, border: `1px solid ${node.color}30` }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#666', lineHeight: 1.7 }}>{node.desc}</p>
      </div>

      {/* Progress */}
      <div style={{ background: '#f8f8f8', borderRadius: 10, padding: '14px 16px', border: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'baseline' }}>
          <span style={{ fontSize: 12, color: '#888' }}>完了進捗</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: complete ? node.color : '#1a1a1a', letterSpacing: '-0.03em' }}>
            {done}<span style={{ fontSize: 13, color: '#999', fontWeight: 400 }}> / {total}</span>
          </span>
        </div>
        <div style={{ background: '#e8e8e8', borderRadius: 99, height: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: node.color, borderRadius: 99, transition: 'width 0.5s ease', boxShadow: `0 0 8px ${node.color}55` }} />
        </div>
        {complete && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: node.color + '12', border: `1px solid ${node.color}30`, borderRadius: 8, fontSize: 12, color: node.color, fontWeight: 600, textAlign: 'center' }}>
            ✦ このコンポーネント完成！次のコンポーネントがロック解除されます
          </div>
        )}
      </div>

      {/* Task list */}
      <div>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>課題リスト</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {node.tasks.map(task => {
            const isDone = !!state[task.id];
            return (
              <div key={task.id} onClick={() => toggleTask(task.id)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 8,
                background: isDone ? node.color + '08' : '#fff',
                border: `1px solid ${isDone ? node.color + '25' : 'rgba(0,0,0,0.07)'}`,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${isDone ? node.color : '#ccc'}`,
                  background: isDone ? node.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#fff', fontWeight: 800,
                  transition: 'all 0.2s',
                }}>{isDone && '✓'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: isDone ? '#888' : '#1a1a1a', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {task.no}. {task.title}
                  </div>
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
                  background: task.tag === '実案件' ? '#fdf0f0' : '#f0f0f0',
                  color: task.tag === '実案件' ? '#911619' : '#888',
                }}>{task.tag}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Complete Banner ───────────────────────────────────────────────────────────
function FACompleteBanner() {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)', zIndex: 10,
      flexDirection: 'column', gap: 16,
      animation: 'reveal 0.6s cubic-bezier(0.22,1,0.36,1) both',
    }}>
      <div style={{ fontSize: 64 }}>🏭</div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: '#911619' }}>FAシステム完全稼働！</div>
      <div style={{ fontSize: 14, color: '#666' }}>すべてのコンポーネントが完成しました</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {FA_NODES.map(n => <span key={n.id} style={{ fontSize: 24 }}>{n.icon}</span>)}
      </div>
    </div>
  );
}

// ── Main FA Map Screen ────────────────────────────────────────────────────────
function FAMapScreen({ role }) {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('fa-node-states') || '{}'); } catch { return {}; } })();
  const [nodeStates, setNodeStatesRaw] = React.useState(saved);
  const [selected, setSelected] = React.useState(null);
  const [prevUnlocked, setPrevUnlocked] = React.useState(() => FA_NODES.filter(n => isUnlocked(n.id, saved)).map(n => n.id));
  const [justUnlocked, setJustUnlocked] = React.useState([]);
  const [showComplete, setShowComplete] = React.useState(false);

  function setNodeStates(fn) {
    setNodeStatesRaw(prev => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      localStorage.setItem('fa-node-states', JSON.stringify(next));

      // Detect newly unlocked nodes
      const nowUnlocked = FA_NODES.filter(n => isUnlocked(n.id, next)).map(n => n.id);
      const newlyUnlocked = nowUnlocked.filter(id => !prevUnlocked.includes(id));
      if (newlyUnlocked.length) {
        setJustUnlocked(newlyUnlocked);
        setPrevUnlocked(nowUnlocked);
        setTimeout(() => setJustUnlocked([]), 1500);
      }

      // Check all complete
      const allDone = FA_NODES.every(n => {
        const state = next[n.id] || {};
        return n.tasks.every(t => state[t.id]);
      });
      if (allDone) setTimeout(() => setShowComplete(true), 600);

      return next;
    });
  }

  const selectedNode = FA_NODES.find(n => n.id === selected) || null;
  const SVG_W = 920, SVG_H = 420;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '20px 28px 14px', borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fff', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>FAシステムマップ</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>工場自動化システム 構成図</h1>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 24 }}>
          {FA_NODES.map(n => {
            const { pct } = getNodeProgress(n.id, nodeStates);
            const unlocked = isUnlocked(n.id, nodeStates);
            return (
              <div key={n.id} style={{ textAlign: 'center', opacity: unlocked ? 1 : 0.35 }}>
                <div style={{ fontSize: 11, color: n.color, fontWeight: 700 }}>{pct}%</div>
                <div style={{ fontSize: 10, color: '#aaa' }}>{n.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Map */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px', position: 'relative', background: '#fafafa' }}>
          {showComplete && <FACompleteBanner />}

          {/* Grid background */}
          <svg width={SVG_W} height={SVG_H} style={{ display: 'block', minWidth: SVG_W }}>
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1"/>
              </pattern>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#ccc" />
              </marker>
              <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#911619" />
              </marker>
              <style>{`
                @keyframes fa-pulse {
                  0%   { r: 50; opacity: 0.6; }
                  100% { r: 90; opacity: 0; }
                }
                @keyframes reveal {
                  from { opacity: 0; filter: blur(10px); transform: translateY(7px); }
                  to   { opacity: 1; filter: blur(0);    transform: translateY(0); }
                }
                @keyframes dash-flow {
                  to { stroke-dashoffset: -20; }
                }
              `}</style>
            </defs>

            <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

            {/* Edges */}
            {FA_EDGES.map(edge => {
              const from = FA_NODES.find(n => n.id === edge.from);
              const to   = FA_NODES.find(n => n.id === edge.to);
              const { done: fromDone, total: fromTotal } = getNodeProgress(from.id, nodeStates);
              const active = fromDone === fromTotal;
              const x1 = from.x + 130, y1 = from.y + 36;
              const x2 = to.x,         y2 = to.y + 36;
              const mx = (x1 + x2) / 2;
              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <path d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                    fill="none" stroke={active ? '#911619' : '#ddd'} strokeWidth={active ? 2 : 1.5}
                    strokeDasharray={active ? '6 4' : 'none'}
                    markerEnd={active ? 'url(#arrow-active)' : 'url(#arrow)'}
                    style={active ? { animation: 'dash-flow 1s linear infinite' } : {}}
                    opacity={active ? 0.7 : 0.6}
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {FA_NODES.map(node => {
              const unlocked = isUnlocked(node.id, nodeStates);
              const progress = getNodeProgress(node.id, nodeStates);
              return (
                <FANode
                  key={node.id}
                  node={node}
                  selected={selected === node.id}
                  unlocked={unlocked}
                  progress={progress}
                  justUnlocked={justUnlocked.includes(node.id)}
                  onClick={() => setSelected(selected === node.id ? null : node.id)}
                />
              );
            })}
          </svg>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: 11, color: '#999', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 24, height: 2, background: '#ccc', borderRadius: 1 }} />
              <span>ロック中</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 24, height: 2, background: '#911619', borderRadius: 1, opacity: 0.6 }} />
              <span>接続済み（解除）</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, border: '2px solid #911619' }} />
              <span>選択中</span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          width: 320, borderLeft: '1px solid rgba(0,0,0,0.07)', background: '#fff',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '-2px 0 12px rgba(0,0,0,0.04)',
        }}>
          <FAPanel
            node={selectedNode}
            nodeStates={nodeStates}
            setNodeStates={setNodeStates}
            role={role}
          />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FAMapScreen, FA_NODES, FA_EDGES, isUnlocked, getNodeProgress });
