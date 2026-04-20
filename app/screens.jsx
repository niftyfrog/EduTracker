// ─── All Screens ─────────────────────────────────────────────────────────────

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ screen, setScreen, role, user }) {
  const adminNav = [
    { id: 'dashboard',  icon: '▣',  label: 'ダッシュボード' },
    { id: 'famap',      icon: '🏭', label: 'FAシステムマップ', highlight: true },
    { id: 'languages',  icon: '◈',  label: '言語・課題' },
    { id: 'aigenerate', icon: '✨', label: 'AI課題生成' },
    { id: 'trainees',   icon: '◉',  label: '新人管理' },
  ];
  const traineeNav = [
    { id: 'dashboard', icon: '▣',  label: 'ダッシュボード' },
    { id: 'famap',     icon: '🏭', label: 'FAシステムマップ', highlight: true },
    { id: 'languages', icon: '◈',  label: '言語・課題' },
    { id: 'aigenerate',icon: '✨', label: 'AI課題生成' },
  ];
  const nav = role === 'admin' ? adminNav : traineeNav;

  return (
    <div style={{
      width: 240, flexShrink: 0, height: '100%',
      background: '#ffffff', borderRight: '1px solid rgba(0,0,0,0.07)',
      boxShadow: '2px 0 12px rgba(0,0,0,0.04)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'rgba(145,22,25,0.12)', border: '1px solid rgba(145,22,25,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: '#911619',
          }}>✦</div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>EduTrack</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflow: 'auto' }}>
        <div style={{ fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 10px', marginBottom: 6 }}>
          {role === 'admin' ? '管理メニュー' : 'メニュー'}
        </div>
        {nav.map(item => {
          const active = screen === item.id;
          return (
            <div key={item.id} onClick={() => setScreen(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 6, marginBottom: 2,
              cursor: 'pointer', transition: 'all 0.12s',
              background: active ? 'rgba(145,22,25,0.08)' : item.highlight && !active ? 'rgba(145,22,25,0.03)' : 'transparent',
              color: active ? '#911619' : '#666',
              fontSize: 13, fontWeight: active ? 500 : 400,
              border: item.highlight && !active ? '1px solid rgba(145,22,25,0.1)' : '1px solid transparent',
            }}>
              <span style={{ fontSize: 12, opacity: 0.8 }}>{item.icon}</span>
              {item.label}
              {active && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: 99, background: '#911619' }} />}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={user.name} size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
            <div style={{ fontSize: 10, color: '#999' }}>{role === 'admin' ? '管理者' : '新人'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard (Admin) ─────────────────────────────────────────────────────────
function AdminDashboard({ trainees, setScreen, setSelectedTrainee, setSelectedLang }) {
  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>管理者ダッシュボード</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>おはようございます、田中さん</h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <StatCard label="担当新人" value={trainees.length} suffix="名" />
        <StatCard label="課題総数" value={Object.values(TASKS_DATA).reduce((a, b) => a + b.length, 0)} suffix="件" />
        <StatCard label="平均完了率"
          value={Math.round(trainees.reduce((a, t) => a + getOverallProgress(t), 0) / trainees.length)}
          suffix="%" color="#911619" />
      </div>

      {/* Trainee list */}
      <SectionTitle>担当新人の進捗</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {trainees.map(t => {
          const overall = getOverallProgress(t);
          return (
            <Card key={t.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <Avatar name={t.name} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>入社 {t.joined} · {t.id}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#911619', lineHeight: 1 }}>{overall}<span style={{ fontSize: 12, color: '#888' }}>%</span></div>
                    <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>全体完了率</div>
                  </div>
                  <Btn size="sm" onClick={() => { setSelectedTrainee(t); setScreen('dashboard-trainee-view'); }}>詳細 →</Btn>
                </div>
                <ProgressBar value={overall} />
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {LANGUAGES.map(l => {
                    const p = getProgress(t, l.id);
                    return (
                      <div key={l.id} onClick={() => { setSelectedTrainee(t); setSelectedLang(l); setScreen('tasks'); }}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                          padding: '3px 8px', borderRadius: 4, background: '#f0f0f0', border: '1px solid rgba(0,0,0,0.07)',
                          fontSize: 11, color: '#666', transition: 'border-color 0.12s' }}>
                        <span>{l.icon}</span>
                        <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{l.name}</span>
                        <span style={{ color: p === 100 ? '#911619' : '#888' }}>{p}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── Dashboard (Trainee) ───────────────────────────────────────────────────────
function TraineeDashboard({ trainee, setScreen, setSelectedLang }) {
  const overall = getOverallProgress(trainee);
  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>マイダッシュボード</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>こんにちは、{trainee.name.split(' ')[0]}さん</h1>
      </div>

      {/* Overall */}
      <Card style={{ marginBottom: 20, padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>全体完了率</div>
            <div style={{ fontSize: 52, fontWeight: 700, color: '#911619', lineHeight: 1, letterSpacing: '-0.04em' }}>
              {overall}<span style={{ fontSize: 20, color: '#888' }}>%</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', color: '#888', fontSize: 12 }}>
            {Object.values(trainee.checked).flat().length} / {Object.values(TASKS_DATA).reduce((a,b)=>a+b.length,0)} 課題完了
          </div>
        </div>
        <ProgressBar value={overall} height={6} />
      </Card>

      {/* Per language */}
      <SectionTitle>言語ごとの完了率</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {LANGUAGES.map(l => {
          const p = getProgress(trainee, l.id);
          const tasks = TASKS_DATA[l.id] || [];
          const done = (trainee.checked[l.id] || []).length;
          return (
            <Card key={l.id} onClick={() => { setSelectedLang(l); setScreen('tasks'); }} style={{ padding: '14px 18px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 20, width: 32, textAlign: 'center' }}>{l.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 500 }}>{l.name}</span>
                    <span style={{ fontSize: 12, color: p === 100 ? '#911619' : '#666' }}>
                      {done} / {tasks.length} {p === 100 && '✓'}
                    </span>
                  </div>
                  <ProgressBar value={p} color={p === 100 ? '#911619' : l.color} height={4} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: p === 100 ? '#911619' : '#1a1a1a', width: 44, textAlign: 'right' }}>{p}%</div>
                <span style={{ color: '#999', fontSize: 12 }}>→</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── Language List ─────────────────────────────────────────────────────────────
function LanguageScreen({ trainee, role, setScreen, setSelectedLang, setEditTask }) {
  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>言語・課題</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>学習言語を選択</h1>
          {role === 'admin' && (
            <Btn variant="primary" size="sm" onClick={() => { setEditTask({ id: null, langId: 'java', no: '', title: '', tag: '基礎', desc: '', links: [''] }); setScreen('edit'); }}>
              ＋ 課題を追加
            </Btn>
          )}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {LANGUAGES.map(l => {
          const p = getProgress(trainee, l.id);
          const tasks = TASKS_DATA[l.id] || [];
          const done = (trainee.checked[l.id] || []).length;
          return (
            <Card key={l.id} onClick={() => { setSelectedLang(l); setScreen('tasks'); }} style={{ padding: '20px 22px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ fontSize: 24 }}>{l.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{l.name}</div>
                {p === 100 && <Badge color="green">完了</Badge>}
              </div>
              <ProgressBar value={p} color={p === 100 ? '#911619' : l.color} height={4} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#888' }}>
                <span>{done} / {tasks.length} 課題完了</span>
                <span style={{ fontWeight: 600, color: p === 100 ? '#911619' : '#666' }}>{p}%</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ── Task List ─────────────────────────────────────────────────────────────────
function TaskListScreen({ trainee, setTrainee, selectedLang, role, setScreen, setSelectedTask, setEditTask, setSelectedLang }) {
  const [filter, setFilter] = React.useState('all');
  const tasks = TASKS_DATA[selectedLang?.id] || [];
  const checked = trainee.checked[selectedLang?.id] || [];

  const filtered = tasks.filter(t => {
    if (filter === 'done') return checked.includes(t.id);
    if (filter === 'undone') return !checked.includes(t.id);
    if (filter === '基礎') return t.tag === '基礎';
    if (filter === '実案件') return t.tag === '実案件';
    return true;
  });

  function toggleCheck(taskId) {
    const cur = trainee.checked[selectedLang.id] || [];
    const next = cur.includes(taskId) ? cur.filter(x => x !== taskId) : [...cur, taskId];
    setTrainee({ ...trainee, checked: { ...trainee.checked, [selectedLang.id]: next } });
  }

  const done = checked.length;
  const total = tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 860, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 12, color: '#888' }}>
        <span onClick={() => setScreen('languages')} style={{ cursor: 'pointer', color: '#666' }}>言語選択</span>
        <span>›</span>
        <span style={{ color: '#1a1a1a' }}>{selectedLang?.icon} {selectedLang?.name}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
            {selectedLang?.icon} {selectedLang?.name} 課題一覧
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 200 }}><ProgressBar value={pct} color={selectedLang?.color || '#911619'} height={4} /></div>
            <span style={{ fontSize: 12, color: '#666' }}>{done} / {total} 完了</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#911619' }}>{pct}%</span>
          </div>
        </div>
        {role === 'admin' && (
          <Btn variant="primary" size="sm" onClick={() => { setEditTask({ id: null, langId: selectedLang.id, no: tasks.length + 1, title: '', tag: '基礎', desc: '', links: [''] }); setScreen('edit'); }}>
            ＋ 課題追加
          </Btn>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {['all','done','undone','基礎','実案件'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '5px 12px', borderRadius: 6, border: `1px solid ${filter===f ? 'rgba(145,22,25,0.35)' : 'rgba(0,0,0,0.09)'}`,
            background: filter===f ? 'rgba(145,22,25,0.09)' : 'transparent',
            color: filter===f ? '#911619' : '#666', fontSize: 12, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.12s',
          }}>
            {{ all:'すべて', done:'完了', undone:'未着手', '基礎':'基礎', '実案件':'実案件' }[f]}
          </button>
        ))}
      </div>

      {/* Task rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map(task => {
          const isDone = checked.includes(task.id);
          return (
            <div key={task.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', borderRadius: 12,
              background: isDone ? 'rgba(145,22,25,0.03)' : '#ffffff',
              border: `1px solid ${isDone ? 'rgba(145,22,25,0.09)' : 'rgba(0,0,0,0.07)'}`,
              transition: 'all 0.12s',
            }}>
              {/* Checkbox */}
              <div onClick={() => toggleCheck(task.id)} style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                border: `2px solid ${isDone ? '#911619' : '#bbb'}`,
                background: isDone ? '#911619' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.15s',
                fontSize: 11, color: '#fff', fontWeight: 700,
              }}>{isDone && '✓'}</div>

              {/* Number */}
              <span style={{ fontSize: 11, color: '#999', width: 20, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{task.no}</span>

              {/* Title */}
              <div onClick={() => { setSelectedTask(task); setScreen('detail'); }} style={{
                flex: 1, cursor: 'pointer',
                color: isDone ? '#888' : '#1a1a1a',
                textDecoration: isDone ? 'line-through' : 'none',
                fontSize: 13, fontWeight: 500,
              }}>{task.title}</div>

              {/* Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Badge color={task.tag === '基礎' ? 'default' : 'yellow'}>{task.tag}</Badge>
                {task.links.length > 0 && <span style={{ fontSize: 10, color: '#999' }}>🔗 {task.links.length}</span>}
                {task.comments.length > 0 && <span style={{ fontSize: 10, color: '#999' }}>💬 {task.comments.length}</span>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 4 }}>
                <Btn size="sm" variant="ghost" onClick={() => { setSelectedTask(task); setScreen('detail'); }}>詳細</Btn>
                {role === 'admin' && (
                  <Btn size="sm" variant="ghost" onClick={() => { setEditTask({ ...task, langId: selectedLang.id, links: task.links.length ? task.links : [''] }); setScreen('edit'); }}>編集</Btn>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Task Detail ───────────────────────────────────────────────────────────────
function TaskDetailScreen({ task, trainee, setTrainee, selectedLang, role, setScreen, setEditTask }) {
  const [newComment, setNewComment] = React.useState('');
  const [localTask, setLocalTask] = React.useState(task);
  const checked = (trainee.checked[selectedLang?.id] || []).includes(task.id);

  function toggleCheck() {
    const cur = trainee.checked[selectedLang.id] || [];
    const next = cur.includes(task.id) ? cur.filter(x => x !== task.id) : [...cur, task.id];
    setTrainee({ ...trainee, checked: { ...trainee.checked, [selectedLang.id]: next } });
  }

  function submitComment() {
    if (!newComment.trim()) return;
    const comment = { who: role === 'admin' ? '田中 先輩' : trainee.name, role, time: 'たった今', text: newComment.trim() };
    setLocalTask({ ...localTask, comments: [...localTask.comments, comment] });
    setNewComment('');
  }

  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 780, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 12, color: '#888' }}>
        <span onClick={() => setScreen('languages')} style={{ cursor: 'pointer', color: '#666' }}>言語選択</span>
        <span>›</span>
        <span onClick={() => setScreen('tasks')} style={{ cursor: 'pointer', color: '#666' }}>{selectedLang?.name}</span>
        <span>›</span>
        <span style={{ color: '#1a1a1a' }}>課題 {task.no}</span>
      </div>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
            <Badge>{selectedLang?.name}</Badge>
            <Badge color={task.tag === '基礎' ? 'default' : 'yellow'}>{task.tag}</Badge>
            <span style={{ fontSize: 11, color: '#999' }}>#{task.no}</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{task.title}</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          {role === 'admin' && (
            <Btn size="sm" onClick={() => { setEditTask({ ...task, langId: selectedLang.id, links: task.links.length ? task.links : [''] }); setScreen('edit'); }}>✏️ 編集</Btn>
          )}
          <div onClick={toggleCheck} style={{
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer',
            padding: '7px 14px', borderRadius: 12,
            background: checked ? 'rgba(145,22,25,0.09)' : '#f0f0f0',
            border: `1px solid ${checked ? 'rgba(145,22,25,0.28)' : 'rgba(0,0,0,0.09)'}`,
            transition: 'all 0.15s',
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 4,
              background: checked ? '#911619' : 'transparent',
              border: `2px solid ${checked ? '#911619' : '#999'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: '#fff', fontWeight: 700, transition: 'all 0.15s',
            }}>{checked && '✓'}</div>
            <span style={{ fontSize: 12, color: checked ? '#911619' : '#666' }}>{checked ? '完了済み' : '未着手'}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>説明</div>
        <p style={{ color: '#444', lineHeight: 1.8, fontSize: 14 }}>{localTask.desc || '（説明なし）'}</p>
      </Card>

      {/* Links */}
      {localTask.links.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>参考リンク</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {localTask.links.map((url, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f0f0f0', borderRadius: 6, border: '1px solid rgba(0,0,0,0.07)' }}>
                <span style={{ fontSize: 11, color: '#999', fontVariantNumeric: 'tabular-nums' }}>0{i+1}</span>
                <a href={url} target="_blank" rel="noopener" style={{ fontSize: 13, color: '#911619', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</a>
                <span style={{ fontSize: 10, color: '#999' }}>↗</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Comments */}
      <Card>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>コメント（{localTask.comments.length}）</div>
        {localTask.comments.length === 0 && <div style={{ color: '#999', fontSize: 13, marginBottom: 16 }}>コメントはまだありません</div>}
        {localTask.comments.map((c, i) => (
          <div key={i} style={{ marginBottom: 12, padding: '12px 14px', background: '#f0f0f0', borderRadius: 12, border: '1px solid rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Avatar name={c.who} size={22} />
              <span style={{ fontSize: 12, fontWeight: 500 }}>{c.who}</span>
              <Badge color={c.role === 'admin' ? 'blue' : 'default'}>{c.role === 'admin' ? '管理者' : '新人'}</Badge>
              <span style={{ fontSize: 11, color: '#999', marginLeft: 'auto' }}>{c.time}</span>
            </div>
            <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>{c.text}</p>
          </div>
        ))}
        <Divider style={{ margin: '14px 0' }} />
        <Textarea value={newComment} onChange={setNewComment} placeholder="コメントを入力..." rows={3} style={{ marginBottom: 8 }} />
        <Btn variant="primary" size="sm" onClick={submitComment} disabled={!newComment.trim()}>送信</Btn>
      </Card>
    </div>
  );
}

// ── Task Edit ─────────────────────────────────────────────────────────────────
function TaskEditScreen({ editTask, setEditTask, setScreen }) {
  const isNew = !editTask.id;
  const [form, setForm] = React.useState(editTask);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>管理者専用</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{isNew ? '課題を追加' : '課題を編集'}</h1>
      </div>

      <Card style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Row: lang + tag + no */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 2 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>言語カテゴリ</div>
            <Select value={form.langId} onChange={v => f('langId', v)} options={LANGUAGES.map(l => ({ value: l.id, label: `${l.icon} ${l.name}` }))} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>タグ</div>
            <Select value={form.tag} onChange={v => f('tag', v)} options={[{ value: '基礎', label: '基礎' }, { value: '実案件', label: '実案件' }]} />
          </div>
          <div style={{ width: 80 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>番号</div>
            <Input type="number" value={form.no} onChange={v => f('no', v)} />
          </div>
        </div>

        {/* Title */}
        <div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>タイトル <span style={{ color: '#ff6b6b' }}>*</span></div>
          <Input value={form.title} onChange={v => f('title', v)} placeholder="課題のタイトルを入力..." />
        </div>

        {/* Desc */}
        <div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>説明文</div>
          <Textarea value={form.desc} onChange={v => f('desc', v)} placeholder="課題の詳細説明を入力..." rows={4} />
        </div>

        {/* Links */}
        <div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>参考リンク</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {form.links.map((url, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <Input value={url} onChange={v => { const links = [...form.links]; links[i] = v; f('links', links); }} placeholder="https://..." />
                <Btn size="sm" variant="danger" onClick={() => f('links', form.links.filter((_, j) => j !== i))}>✕</Btn>
              </div>
            ))}
            <Btn size="sm" variant="ghost" onClick={() => f('links', [...form.links, ''])} style={{ alignSelf: 'flex-start' }}>＋ リンクを追加</Btn>
          </div>
        </div>

        <Divider />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Btn onClick={() => setScreen('tasks')}>キャンセル</Btn>
          <Btn variant="primary" disabled={!form.title.trim()}>💾 {isNew ? '追加する' : '保存する'}</Btn>
        </div>
      </Card>
    </div>
  );
}

// ── Trainee Management ────────────────────────────────────────────────────────
function TraineeManagementScreen({ trainees, setScreen, setSelectedTrainee }) {
  const [expanded, setExpanded] = React.useState(trainees[0]?.id);
  const [newName, setNewName] = React.useState('');

  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>管理者専用</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>新人管理</h1>
          <Btn variant="primary" size="sm">＋ 新人を追加</Btn>
        </div>
      </div>

      {/* Trainee cards */}
      <SectionTitle>担当新人一覧</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {trainees.map(t => {
          const overall = getOverallProgress(t);
          const isExp = expanded === t.id;
          return (
            <div key={t.id} style={{ borderRadius: 12, border: `1px solid ${isExp ? 'rgba(145,22,25,0.18)' : 'rgba(0,0,0,0.07)'}`, overflow: 'hidden', background: '#ffffff', transition: 'border-color 0.15s' }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer' }} onClick={() => setExpanded(isExp ? null : t.id)}>
                <Avatar name={t.name} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>入社 {t.joined} · {t.id}</div>
                </div>
                <div style={{ width: 120 }}>
                  <ProgressBar value={overall} height={4} />
                  <div style={{ fontSize: 11, color: '#888', marginTop: 3, textAlign: 'right' }}>{overall}%</div>
                </div>
                <Btn size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setSelectedTrainee(t); setScreen('dashboard-trainee-view'); }}>進捗詳細 →</Btn>
                <span style={{ color: '#999', transition: 'transform 0.2s', display: 'inline-block', transform: isExp ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>

              {/* Expanded */}
              {isExp && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                  <div style={{ marginTop: 14, marginBottom: 10, fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>割り当て言語 · 完了率</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {LANGUAGES.map(l => {
                      const p = getProgress(t, l.id);
                      return (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, background: '#f0f0f0', border: '1px solid rgba(0,0,0,0.07)' }}>
                          <span>{l.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{l.name}</span>
                          <span style={{ fontSize: 12, color: p === 100 ? '#911619' : '#666', fontWeight: 600 }}>{p}%</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <Btn size="sm">✏️ 情報を編集</Btn>
                    <Btn size="sm" variant="danger">担当を解除</Btn>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add form */}
      <SectionTitle>新人を追加・紐づけ</SectionTitle>
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>名前</div>
            <Input value={newName} onChange={setNewName} placeholder="例：佐藤 次郎" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>社員ID</div>
            <Input placeholder="例：trainee_004" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>割り当て言語</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LANGUAGES.map(l => (
              <label key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, background: '#f0f0f0', border: '1px solid rgba(0,0,0,0.07)', cursor: 'pointer', fontSize: 12 }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#911619' }} />
                <span>{l.icon} {l.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <Btn variant="primary" size="sm" disabled={!newName.trim()}>登録する</Btn>
        </div>
      </Card>
    </div>
  );
}

// Trainee view from admin dashboard
function TraineeDetailView({ trainee, setScreen, setSelectedLang }) {
  const overall = getOverallProgress(trainee);
  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 12, color: '#888' }}>
        <span onClick={() => setScreen('dashboard')} style={{ cursor: 'pointer', color: '#666' }}>ダッシュボード</span>
        <span>›</span>
        <span style={{ color: '#1a1a1a' }}>{trainee.name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <Avatar name={trainee.name} size={48} />
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{trainee.name}</h1>
          <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>入社 {trainee.joined} · {trainee.id}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#911619', lineHeight: 1 }}>{overall}<span style={{ fontSize: 16, color: '#888' }}>%</span></div>
          <div style={{ fontSize: 11, color: '#888' }}>全体完了率</div>
        </div>
      </div>
      <Card style={{ marginBottom: 16, padding: '18px 20px' }}>
        <ProgressBar value={overall} height={6} />
        <div style={{ fontSize: 11, color: '#888', marginTop: 6 }}>
          {Object.values(trainee.checked).flat().length} / {Object.values(TASKS_DATA).reduce((a,b)=>a+b.length,0)} 課題完了
        </div>
      </Card>
      <SectionTitle>言語ごとの完了率</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {LANGUAGES.map(l => {
          const p = getProgress(trainee, l.id);
          const tasks = TASKS_DATA[l.id] || [];
          const done = (trainee.checked[l.id] || []).length;
          return (
            <Card key={l.id} onClick={() => { setSelectedLang(l); setScreen('tasks'); }} style={{ padding: '14px 18px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 20, width: 32, textAlign: 'center' }}>{l.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 500 }}>{l.name}</span>
                    <span style={{ fontSize: 12, color: p === 100 ? '#911619' : '#666' }}>{done} / {tasks.length}</span>
                  </div>
                  <ProgressBar value={p} color={p === 100 ? '#911619' : l.color} height={4} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: p === 100 ? '#911619' : '#1a1a1a', width: 44, textAlign: 'right' }}>{p}%</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, {
  Sidebar, AdminDashboard, TraineeDashboard, LanguageScreen,
  TaskListScreen, TaskDetailScreen, TaskEditScreen,
  TraineeManagementScreen, TraineeDetailView,
});
