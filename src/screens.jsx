import React from 'react'
import { STEPS, getProgress, getOverallProgress, getCompletionDates, getRecentCompletions, getTraineeNotifications, relativeDate, getTotalDone, TODAY } from './data'
import { N, ProgressBar, Badge, Card, Btn, Input, Select, Textarea, Avatar, SectionTitle, Divider, StatCard } from './components'

// ── Sidebar ──────────────────────────────────────────────────────────────────
export function Sidebar({ screen, setScreen, role, user }) {
  const adminNav = [
    { id: 'dashboard',  label: 'ダッシュボード' },
    { id: 'famap',      label: 'FAシステムマップ', highlight: true },
    { id: 'curriculum', label: 'カリキュラム' },
    { id: 'aigenerate', label: 'AI課題生成' },
    { id: 'trainees',   label: '新人管理' },
  ]
  const traineeNav = [
    { id: 'dashboard',  label: 'ダッシュボード' },
    { id: 'famap',      label: 'FAシステムマップ', highlight: true },
    { id: 'curriculum', label: 'カリキュラム' },
    { id: 'aigenerate', label: 'AI課題生成' },
  ]
  const nav = role === 'admin' ? adminNav : traineeNav

  return (
    <div style={{
      width: 220, flexShrink: 0, height: '100%',
      background: '#ffffff', borderRight: '1px solid rgba(0,0,0,0.07)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: 'rgba(145,22,25,0.15)', border: '1px solid rgba(145,22,25,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: '#911619',
          }}>✦</div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em', color: '#1a1a1a' }}>EduTrack</span>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '10px 8px', overflow: 'auto' }}>
        <div style={{ fontSize: 10, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0 10px', marginBottom: 8, marginTop: 4 }}>
          {role === 'admin' ? '管理メニュー' : 'メニュー'}
        </div>
        {nav.map(item => {
          const active = screen === item.id
          return (
            <div key={item.id} onClick={() => setScreen(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 6, marginBottom: 1,
              cursor: 'pointer', transition: 'all 0.12s',
              background: active ? 'rgba(145,22,25,0.1)' : 'transparent',
              color: active ? '#911619' : '#777',
              fontSize: 13.5, fontWeight: active ? 600 : 400,
            }}>
              {item.label}
              {active && <div style={{ marginLeft: 'auto', width: 3, height: 3, borderRadius: 99, background: '#911619' }} />}
            </div>
          )
        })}
      </nav>

      <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name={user.name} size={26} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#555' }}>{user.name}</div>
            <div style={{ fontSize: 10.5, color: '#888' }}>{role === 'admin' ? '管理者' : '新人'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────
export function AdminDashboard({ trainees, setScreen, setSelectedTrainee, setSelectedStep }) {
  const recentCompletions = getRecentCompletions(trainees, 7)
  const totalTasks = STEPS.reduce((a, s) => a + s.tasks.length, 0)

  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>管理者ダッシュボード</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>おはようございます、田中さん</h1>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <StatCard label="担当新人" value={trainees.length} suffix="名" />
        <StatCard label="課題総数" value={totalTasks} suffix="件" />
        <StatCard label="平均完了率"
          value={Math.round(trainees.reduce((a, t) => a + getOverallProgress(t), 0) / trainees.length)}
          suffix="%" color="#911619" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ fontSize: 13, fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>レビュー待ち · 今週の達成</h2>
        {recentCompletions.length > 0 && (
          <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: '#911619', borderRadius: 99, padding: '1px 7px' }}>{recentCompletions.length}</span>
        )}
      </div>
      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 28 }}>
        {recentCompletions.length === 0 && (
          <div style={{ padding: '16px 20px', fontSize: 13, color: '#bbb' }}>今週の達成はまだありません</div>
        )}
        {recentCompletions.slice(0, 8).map(({ trainee, task, step, date }, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px',
            borderBottom: i < Math.min(recentCompletions.length, 8) - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
          }}>
            <Avatar name={trainee.name} size={26} />
            <div style={{ flex: 1, fontSize: 13 }}>
              <span style={{ fontWeight: 500 }}>{trainee.name}</span>
              <span style={{ color: '#888' }}> が </span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: 'rgba(0,0,0,0.05)', color: step.color }}>{step.label}</span>
              <span style={{ color: '#888' }}> {task.title}</span>
              <span style={{ color: '#888' }}> を完了</span>
            </div>
            {task.tag && <Badge color={task.tag === '課題' ? 'default' : 'yellow'}>{task.tag}</Badge>}
            <span style={{ fontSize: 12, color: '#bbb', flexShrink: 0 }}>{relativeDate(date)}</span>
          </div>
        ))}
      </Card>

      <SectionTitle>担当新人の進捗</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {trainees.map(t => {
          const overall = getOverallProgress(t)
          return (
            <Card key={t.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <Avatar name={t.name} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>入社 {t.joined} · {t.id}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#911619', lineHeight: 1 }}>{overall}<span style={{ fontSize: 13, color: '#888' }}>%</span></div>
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>全体完了率</div>
                  </div>
                  <Btn size="sm" onClick={() => { setSelectedTrainee(t); setScreen('dashboard-trainee-view') }}>詳細 →</Btn>
                </div>
                <ProgressBar value={overall} />
                <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                  {STEPS.filter(s => s.tasks.length > 0).map(s => {
                    const p = getProgress(t, s.id)
                    return (
                      <div key={s.id} onClick={() => { setSelectedTrainee(t); setSelectedStep(s); setScreen('tasks') }}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                          padding: '3px 8px', borderRadius: 4, background: '#f0f0f0', border: '1px solid rgba(0,0,0,0.07)',
                          fontSize: 12, color: '#666' }}>
                        <span style={{ fontWeight: 700, color: s.color, fontSize: 11 }}>{s.label}</span>
                        <span style={{ color: p === 100 ? '#911619' : '#888' }}>{p}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ── Heat Map ──────────────────────────────────────────────────────────────────
function HeatMap({ trainee }) {
  const completionDates = getCompletionDates(trainee)
  const todayDate = new Date(TODAY + 'T12:00:00')
  const dow = todayDate.getDay()
  const toMonday = dow === 0 ? -6 : 1 - dow
  const startDate = new Date(todayDate)
  startDate.setDate(todayDate.getDate() + toMonday - 28)

  const weeks = []
  for (let w = 0; w < 5; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + w * 7 + d)
      const str = date.toISOString().split('T')[0]
      const isFuture = str > TODAY
      week.push({ date: str, count: isFuture ? null : (completionDates[str] || 0) })
    }
    weeks.push(week)
  }

  const maxCount = Math.max(...Object.values(completionDates).filter(n => n > 0), 1)
  const thisWeekTotal = weeks[4].reduce((a, { count }) => a + (count || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: '#911619', lineHeight: 1 }}>{thisWeekTotal}</span>
        <span style={{ fontSize: 14, color: '#888' }}>件 今週達成</span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {['月','火','水','木','金','土','日'].map(d => (
          <div key={d} style={{ width: 22, textAlign: 'center', fontSize: 11, color: '#bbb' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', gap: 4 }}>
            {week.map(({ date, count }) => {
              const isToday = date === TODAY
              const intensity = count && count > 0 ? Math.min(count / maxCount, 1) : 0
              const bg = count === null ? 'rgba(0,0,0,0.03)' : count === 0 ? '#ebebeb' : `rgba(145,22,25,${0.2 + intensity * 0.8})`
              return (
                <div key={date}
                  title={count !== null ? `${date.slice(5).replace('-','/')} — ${count}件` : ''}
                  style={{
                    width: 22, height: 22, borderRadius: 4, background: bg, boxSizing: 'border-box',
                    border: isToday ? '2px solid #911619' : '1px solid rgba(0,0,0,0.06)',
                  }} />
              )
            })}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 10 }}>
        <span style={{ fontSize: 11, color: '#555' }}>少</span>
        {[0, 0.35, 0.65, 1].map((i, idx) => (
          <div key={idx} style={{ width: 14, height: 14, borderRadius: 2, background: i === 0 ? '#ebebeb' : `rgba(145,22,25,${0.2 + i * 0.8})` }} />
        ))}
        <span style={{ fontSize: 11, color: '#555' }}>多</span>
      </div>
    </div>
  )
}

// ── Trainee Dashboard ─────────────────────────────────────────────────────────
export function TraineeDashboard({ trainee, setScreen, setSelectedStep, setSelectedTask }) {
  const overall = getOverallProgress(trainee)
  const notifications = getTraineeNotifications()
  const totalTasks = STEPS.reduce((a, s) => a + s.tasks.length, 0)

  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>マイダッシュボード</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>こんにちは、{trainee.name.split(' ')[0]}さん</h1>
      </div>

      <Card style={{ marginBottom: 20, padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>全体完了率</div>
            <div style={{ fontSize: 52, fontWeight: 700, color: '#911619', lineHeight: 1, letterSpacing: '-0.04em' }}>
              {overall}<span style={{ fontSize: 20, color: '#888' }}>%</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', color: '#888', fontSize: 13 }}>
            {getTotalDone(trainee)} / {totalTasks} 課題完了
          </div>
        </div>
        <ProgressBar value={overall} height={6} />
      </Card>

      <SectionTitle>ステップごとの完了率</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STEPS.map(s => {
          const p = s.tasks.length ? getProgress(trainee, s.id) : null
          const done = Object.keys(trainee.checked[s.id] || {}).length
          return (
            <Card key={s.id} onClick={() => { setSelectedStep(s); setScreen('tasks') }} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: '-0.01em' }}>{s.label}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: s.tasks.length ? 6 : 0 }}>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{s.title}</span>
                    {s.tasks.length > 0 && (
                      <span style={{ fontSize: 13, color: p === 100 ? '#911619' : '#666' }}>
                        {done} / {s.tasks.length} {p === 100 && '✓'}
                      </span>
                    )}
                    {s.tasks.length === 0 && (
                      <span style={{ fontSize: 12, color: '#bbb' }}>案件による</span>
                    )}
                  </div>
                  {s.tasks.length > 0 && <ProgressBar value={p} color={p === 100 ? '#911619' : s.color} height={4} />}
                </div>
                {p !== null && (
                  <div style={{ fontSize: 16, fontWeight: 700, color: p === 100 ? '#911619' : '#1a1a1a', width: 44, textAlign: 'right' }}>{p}%</div>
                )}
                <span style={{ color: '#999', fontSize: 13 }}>→</span>
              </div>
            </Card>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
        <Card style={{ padding: '20px 22px' }}>
          <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>達成ヒートマップ</div>
          <HeatMap trainee={trainee} />
        </Card>

        <Card style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>通知</div>
            {notifications.length > 0 && (
              <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', background: '#911619', borderRadius: 99, padding: '1px 7px' }}>{notifications.length}</span>
            )}
          </div>
          {notifications.length === 0 && <div style={{ fontSize: 13, color: '#bbb' }}>新しい通知はありません</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.map(({ task, step, comment }) => (
              <div key={task.id}
                onClick={() => { setSelectedTask(task); setSelectedStep(step); setScreen('detail') }}
                style={{ cursor: 'pointer', padding: '10px 12px', borderRadius: 8, background: '#fdf5f5', border: '1px solid rgba(145,22,25,0.1)', transition: 'background 0.12s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#911619', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#911619' }}>{comment.who}</span>
                  <span style={{ fontSize: 12, color: '#888' }}>がコメント</span>
                  <span style={{ fontSize: 11, color: '#bbb', marginLeft: 'auto' }}>{relativeDate(comment.date)}</span>
                </div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: step.color }}>{step.label}</span>
                  <span style={{ marginLeft: 4 }}>{task.title}</span>
                </div>
                <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{comment.text}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ── Step List (Curriculum) Screen ─────────────────────────────────────────────
export function StepListScreen({ trainee, role, setScreen, setSelectedStep, setEditTask }) {
  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>カリキュラム</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>学習ステップ</h1>
          {role === 'admin' && (
            <Btn variant="primary" size="sm" onClick={() => { setEditTask({ id: null, stepId: 'step1', no: '', title: '', tag: '課題', desc: '', links: [''] }); setScreen('edit') }}>
              ＋ 課題を追加
            </Btn>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {STEPS.map((s, idx) => {
          const p = s.tasks.length ? getProgress(trainee, s.id) : null
          const done = Object.keys(trainee.checked[s.id] || {}).length
          const isLast = idx === STEPS.length - 1

          return (
            <div key={s.id}>
              <div
                onClick={() => { setSelectedStep(s); setScreen('tasks') }}
                style={{
                  display: 'flex', gap: 18, cursor: 'pointer',
                  padding: '18px 22px', borderRadius: 12,
                  background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)',
                  transition: 'box-shadow 0.15s, border-color 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.14)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}
              >
                {/* Step badge */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${s.color}18`, border: `2px solid ${s.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, color: s.color,
                  }}>
                    {s.type === 'checklist' ? '☑' : s.type === 'project' ? '🏢' : <i className={s.icon} />}
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: '0.02em' }}>{s.label}</span>
                    {s.type === 'checklist' && <Badge color="blue">チェックリスト</Badge>}
                    {s.type === 'project' && <Badge color="yellow">実案件</Badge>}
                    {p === 100 && <Badge color="green">完了</Badge>}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 8 }}>{s.title}</div>

                  {/* Topics */}
                  {s.topics.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                      {s.topics.map((t, i) => (
                        <span key={i} style={{ fontSize: 12, color: '#666', padding: '2px 8px', borderRadius: 4, background: '#f0f0f0', border: '1px solid rgba(0,0,0,0.06)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Submission & Criteria */}
                  {s.submission && (
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#888', marginBottom: 8 }}>
                      <span><span style={{ color: '#bbb' }}>提出：</span>{s.submission}</span>
                      <span><span style={{ color: '#bbb' }}>合否：</span>{s.criteria}</span>
                    </div>
                  )}

                  {/* Progress */}
                  {s.tasks.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, maxWidth: 200 }}><ProgressBar value={p} color={p === 100 ? '#911619' : s.color} height={4} /></div>
                      <span style={{ fontSize: 12, color: '#888' }}>{done} / {s.tasks.length} 課題</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: p === 100 ? '#911619' : '#1a1a1a' }}>{p}%</span>
                    </div>
                  )}
                  {s.tasks.length === 0 && (
                    <div style={{ fontSize: 12, color: '#bbb' }}>案件ごとに設定</div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', color: '#999', fontSize: 16 }}>→</div>
              </div>

              {/* Arrow between steps */}
              {!isLast && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0', color: '#555', fontSize: 18 }}>↓</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Task List ─────────────────────────────────────────────────────────────────
export function TaskListScreen({ trainee, setTrainee, selectedStep, role, setScreen, setSelectedTask, setEditTask }) {
  const [filter, setFilter] = React.useState('all')
  const tasks = selectedStep?.tasks || []
  const checkedMap = trainee.checked[selectedStep?.id] || {}
  const isChecklist = selectedStep?.type === 'checklist'

  const filtered = tasks.filter(t => {
    if (filter === 'done') return String(t.id) in checkedMap
    if (filter === 'undone') return !(String(t.id) in checkedMap)
    return true
  })

  function toggleCheck(taskId) {
    const cur = trainee.checked[selectedStep.id] || {}
    const key = String(taskId)
    const next = key in cur
      ? Object.fromEntries(Object.entries(cur).filter(([k]) => k !== key))
      : { ...cur, [key]: TODAY }
    setTrainee({ ...trainee, checked: { ...trainee.checked, [selectedStep.id]: next } })
  }

  const done = Object.keys(checkedMap).length
  const total = tasks.length
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 860, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: '#888' }}>
        <span onClick={() => setScreen('curriculum')} style={{ cursor: 'pointer', color: '#666' }}>カリキュラム</span>
        <span>›</span>
        <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{selectedStep?.label}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: selectedStep?.color }}>{selectedStep?.label}</span>
            {isChecklist && <Badge color="blue">チェックリスト</Badge>}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>
            {selectedStep?.title}
          </h1>
          {total > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 200 }}><ProgressBar value={pct} color={selectedStep?.color || '#911619'} height={4} /></div>
              <span style={{ fontSize: 13, color: '#666' }}>{done} / {total} 完了</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#911619' }}>{pct}%</span>
            </div>
          )}
        </div>
        {role === 'admin' && (
          <Btn variant="primary" size="sm" onClick={() => { setEditTask({ id: null, stepId: selectedStep.id, no: tasks.length + 1, title: '', tag: '課題', desc: '', links: [''] }); setScreen('edit') }}>
            ＋ 課題追加
          </Btn>
        )}
      </div>

      {/* Step info panel for assignment/project steps */}
      {!isChecklist && (selectedStep?.topics?.length > 0 || selectedStep?.submission) && (
        <div style={{ marginBottom: 20, padding: '14px 18px', borderRadius: 10, background: `${selectedStep.color}0a`, border: `1px solid ${selectedStep.color}25` }}>
          {selectedStep.topics.length > 0 && (
            <div style={{ marginBottom: selectedStep.submission ? 10 : 0 }}>
              <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>学習内容</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedStep.topics.map((t, i) => (
                  <span key={i} style={{ fontSize: 13, color: '#888', padding: '3px 10px', borderRadius: 5, background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)' }}>{t}</span>
                ))}
              </div>
            </div>
          )}
          {selectedStep.submission && (
            <div style={{ display: 'flex', gap: 24, marginTop: selectedStep.topics.length ? 10 : 0, fontSize: 13 }}>
              <div>
                <span style={{ color: '#999', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>提出方法　</span>
                <span style={{ color: '#bbb', fontWeight: 500 }}>{selectedStep.submission}</span>
              </div>
              <div>
                <span style={{ color: '#999', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>合否基準　</span>
                <span style={{ color: '#bbb', fontWeight: 500 }}>{selectedStep.criteria}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter */}
      {total > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
          {['all','done','undone'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 12px', borderRadius: 6,
              border: `1px solid ${filter===f ? 'rgba(145,22,25,0.35)' : 'rgba(0,0,0,0.09)'}`,
              background: filter===f ? 'rgba(145,22,25,0.09)' : 'transparent',
              color: filter===f ? '#911619' : '#666', fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all 0.12s',
            }}>
              {{ all:'すべて', done:'完了', undone:'未着手' }[f]}
            </button>
          ))}
        </div>
      )}

      {tasks.length === 0 && (
        <div style={{ padding: '48px 24px', textAlign: 'center', color: '#bbb', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: 12 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏢</div>
          <div style={{ fontSize: 14 }}>実案件ごとに課題が設定されます</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.map(task => {
          const isDone = String(task.id) in checkedMap
          const doneDate = checkedMap[String(task.id)]
          return (
            <div key={task.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 16px', borderRadius: 12,
              background: isDone ? 'rgba(145,22,25,0.04)' : '#ffffff',
              border: `1px solid ${isDone ? 'rgba(145,22,25,0.09)' : 'rgba(0,0,0,0.07)'}`,
              transition: 'all 0.12s',
            }}>
              <div onClick={() => toggleCheck(task.id)} style={{
                width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                border: `2px solid ${isDone ? '#911619' : '#bbb'}`,
                background: isDone ? '#911619' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.15s',
                fontSize: 12, color: '#fff', fontWeight: 700,
              }}>{isDone && '✓'}</div>
              <span style={{ fontSize: 12, color: '#999', width: 20, textAlign: 'right', flexShrink: 0 }}>{task.no}</span>
              <div
                onClick={isChecklist ? () => toggleCheck(task.id) : () => { setSelectedTask(task); setScreen('detail') }}
                style={{ flex: 1, cursor: 'pointer' }}
              >
                <div style={{ color: isDone ? '#666' : '#1a1a1a', textDecoration: isDone ? 'line-through' : 'none', fontSize: 14, fontWeight: 500 }}>{task.title}</div>
                {doneDate && <div style={{ fontSize: 12, color: '#bbb', marginTop: 1 }}>達成日 {doneDate}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!isChecklist && task.links?.length > 0 && <span style={{ fontSize: 11, color: '#999' }}>🔗 {task.links.length}</span>}
                {!isChecklist && task.comments?.length > 0 && <span style={{ fontSize: 11, color: '#999' }}>💬 {task.comments.length}</span>}
              </div>
              {!isChecklist && (
                <div style={{ display: 'flex', gap: 4 }}>
                  <Btn size="sm" variant="ghost" onClick={() => { setSelectedTask(task); setScreen('detail') }}>詳細</Btn>
                  {role === 'admin' && (
                    <Btn size="sm" variant="ghost" onClick={() => { setEditTask({ ...task, stepId: selectedStep.id, links: task.links?.length ? task.links : [''] }); setScreen('edit') }}>編集</Btn>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Task Detail ───────────────────────────────────────────────────────────────
export function TaskDetailScreen({ task, trainee, setTrainee, selectedStep, role, setScreen, setEditTask }) {
  const [newComment, setNewComment] = React.useState('')
  const [localTask, setLocalTask] = React.useState(task)
  const checkedMap = trainee.checked[selectedStep?.id] || {}
  const checked = String(task.id) in checkedMap
  const doneDate = checkedMap[String(task.id)]

  function toggleCheck() {
    const cur = trainee.checked[selectedStep.id] || {}
    const key = String(task.id)
    const next = key in cur
      ? Object.fromEntries(Object.entries(cur).filter(([k]) => k !== key))
      : { ...cur, [key]: TODAY }
    setTrainee({ ...trainee, checked: { ...trainee.checked, [selectedStep.id]: next } })
  }

  function submitComment() {
    if (!newComment.trim()) return
    const comment = { who: role === 'admin' ? '田中 先輩' : trainee.name, role, date: TODAY, text: newComment.trim() }
    setLocalTask({ ...localTask, comments: [...(localTask.comments || []), comment] })
    setNewComment('')
  }

  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 780, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: '#888' }}>
        <span onClick={() => setScreen('curriculum')} style={{ cursor: 'pointer', color: '#666' }}>カリキュラム</span>
        <span>›</span>
        <span onClick={() => setScreen('tasks')} style={{ cursor: 'pointer', color: '#666' }}>{selectedStep?.label}</span>
        <span>›</span>
        <span style={{ color: '#1a1a1a' }}>課題 {task.no}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 28 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
            <Badge>{selectedStep?.label}</Badge>
            {task.tag && <Badge color="default">{task.tag}</Badge>}
            <span style={{ fontSize: 12, color: '#999' }}>#{task.no}</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{task.title}</h1>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          {role === 'admin' && (
            <Btn size="sm" onClick={() => { setEditTask({ ...task, stepId: selectedStep.id, links: task.links?.length ? task.links : [''] }); setScreen('edit') }}>✏️ 編集</Btn>
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
              fontSize: 12, color: '#fff', fontWeight: 700, transition: 'all 0.15s',
            }}>{checked && '✓'}</div>
            <div>
              <span style={{ fontSize: 13, color: checked ? '#911619' : '#666' }}>{checked ? '完了済み' : '未着手'}</span>
              {doneDate && <div style={{ fontSize: 11, color: '#888', marginTop: 1 }}>{doneDate}</div>}
            </div>
          </div>
        </div>
      </div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>説明</div>
        <p style={{ color: '#bbb', lineHeight: 1.8, fontSize: 15 }}>{localTask.desc || '（説明なし）'}</p>
      </Card>

      {localTask.links?.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>参考リンク</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {localTask.links.map((url, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f0f0f0', borderRadius: 6, border: '1px solid rgba(0,0,0,0.07)' }}>
                <span style={{ fontSize: 12, color: '#999' }}>0{i+1}</span>
                <a href={url} target="_blank" rel="noopener" style={{ fontSize: 14, color: '#911619', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</a>
                <span style={{ fontSize: 11, color: '#999' }}>↗</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>コメント（{(localTask.comments || []).length}）</div>
        {(!localTask.comments || localTask.comments.length === 0) && <div style={{ color: '#999', fontSize: 14, marginBottom: 16 }}>コメントはまだありません</div>}
        {(localTask.comments || []).map((c, i) => (
          <div key={i} style={{ marginBottom: 12, padding: '12px 14px', background: '#f0f0f0', borderRadius: 12, border: '1px solid rgba(0,0,0,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Avatar name={c.who} size={22} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{c.who}</span>
              <Badge color={c.role === 'admin' ? 'blue' : 'default'}>{c.role === 'admin' ? '管理者' : '新人'}</Badge>
              <span style={{ fontSize: 12, color: '#999', marginLeft: 'auto' }}>{relativeDate(c.date)}</span>
            </div>
            <p style={{ fontSize: 14, color: '#bbb', lineHeight: 1.6 }}>{c.text}</p>
          </div>
        ))}
        <Divider style={{ margin: '14px 0' }} />
        <Textarea value={newComment} onChange={setNewComment} placeholder="コメントを入力..." rows={3} style={{ marginBottom: 8 }} />
        <Btn variant="primary" size="sm" onClick={submitComment} disabled={!newComment.trim()}>送信</Btn>
      </Card>
    </div>
  )
}

// ── Task Edit ─────────────────────────────────────────────────────────────────
export function TaskEditScreen({ editTask, setScreen }) {
  const isNew = !editTask.id
  const [form, setForm] = React.useState(editTask)
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>管理者専用</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{isNew ? '課題を追加' : '課題を編集'}</h1>
      </div>

      <Card style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 2 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>ステップ</div>
            <Select value={form.stepId} onChange={v => f('stepId', v)} options={STEPS.map(s => ({ value: s.id, label: `${s.label}: ${s.title}` }))} />
          </div>
          <div style={{ width: 80 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>番号</div>
            <Input type="number" value={form.no} onChange={v => f('no', v)} />
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>タイトル <span style={{ color: '#ff6b6b' }}>*</span></div>
          <Input value={form.title} onChange={v => f('title', v)} placeholder="課題のタイトルを入力..." />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>説明文</div>
          <Textarea value={form.desc} onChange={v => f('desc', v)} placeholder="課題の詳細説明を入力..." rows={4} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>参考リンク</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {form.links.map((url, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <Input value={url} onChange={v => { const links = [...form.links]; links[i] = v; f('links', links) }} placeholder="https://..." />
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
  )
}

// ── Trainee Management ────────────────────────────────────────────────────────
export function TraineeManagementScreen({ trainees, setScreen, setSelectedTrainee }) {
  const [expanded, setExpanded] = React.useState(trainees[0]?.id)
  const [newName, setNewName] = React.useState('')

  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>管理者専用</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em' }}>新人管理</h1>
          <Btn variant="primary" size="sm">＋ 新人を追加</Btn>
        </div>
      </div>

      <SectionTitle>担当新人一覧</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {trainees.map(t => {
          const overall = getOverallProgress(t)
          const isExp = expanded === t.id
          return (
            <div key={t.id} style={{ borderRadius: 12, border: `1px solid ${isExp ? 'rgba(145,22,25,0.18)' : 'rgba(0,0,0,0.07)'}`, overflow: 'hidden', background: '#ffffff', transition: 'border-color 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', cursor: 'pointer' }} onClick={() => setExpanded(isExp ? null : t.id)}>
                <Avatar name={t.name} size={36} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>入社 {t.joined} · {t.id}</div>
                </div>
                <div style={{ width: 120 }}>
                  <ProgressBar value={overall} height={4} />
                  <div style={{ fontSize: 12, color: '#888', marginTop: 3, textAlign: 'right' }}>{overall}%</div>
                </div>
                <Btn size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setSelectedTrainee(t); setScreen('dashboard-trainee-view') }}>進捗詳細 →</Btn>
                <span style={{ color: '#999', transition: 'transform 0.2s', display: 'inline-block', transform: isExp ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>
              {isExp && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                  <div style={{ marginTop: 14, marginBottom: 10, fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ステップ別進捗</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {STEPS.map(s => {
                      const p = s.tasks.length ? getProgress(t, s.id) : null
                      return (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, background: '#f0f0f0', border: '1px solid rgba(0,0,0,0.07)' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.label}</span>
                          {p !== null
                            ? <span style={{ fontSize: 13, color: p === 100 ? '#911619' : '#666', fontWeight: 600 }}>{p}%</span>
                            : <span style={{ fontSize: 12, color: '#bbb' }}>-</span>
                          }
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                    <Btn size="sm">✏️ 情報を編集</Btn>
                    <Btn size="sm" variant="danger">担当を解除</Btn>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <SectionTitle>新人を追加・紐づけ</SectionTitle>
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>名前</div>
            <Input value={newName} onChange={setNewName} placeholder="例：佐藤 次郎" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>社員ID</div>
            <Input placeholder="例：trainee_004" />
          </div>
        </div>
        <div>
          <Btn variant="primary" size="sm" disabled={!newName.trim()}>登録する</Btn>
        </div>
      </Card>
    </div>
  )
}

// ── Trainee Detail View ───────────────────────────────────────────────────────
export function TraineeDetailView({ trainee, setScreen, setSelectedStep }) {
  const overall = getOverallProgress(trainee)
  const totalTasks = STEPS.reduce((a, s) => a + s.tasks.length, 0)
  return (
    <div className="reveal" style={{ padding: '32px 40px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: '#888' }}>
        <span onClick={() => setScreen('dashboard')} style={{ cursor: 'pointer', color: '#666' }}>ダッシュボード</span>
        <span>›</span>
        <span style={{ color: '#1a1a1a' }}>{trainee.name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <Avatar name={trainee.name} size={48} />
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>{trainee.name}</h1>
          <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>入社 {trainee.joined} · {trainee.id}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#911619', lineHeight: 1 }}>{overall}<span style={{ fontSize: 16, color: '#888' }}>%</span></div>
          <div style={{ fontSize: 12, color: '#888' }}>全体完了率</div>
        </div>
      </div>
      <Card style={{ marginBottom: 16, padding: '18px 20px' }}>
        <ProgressBar value={overall} height={6} />
        <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>
          {getTotalDone(trainee)} / {totalTasks} 課題完了
        </div>
      </Card>
      <SectionTitle>ステップごとの完了率</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STEPS.map(s => {
          const p = s.tasks.length ? getProgress(trainee, s.id) : null
          const done = Object.keys(trainee.checked[s.id] || {}).length
          return (
            <Card key={s.id} onClick={() => { setSelectedStep(s); setScreen('tasks') }} style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flexShrink: 0, width: 52 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: s.color }}>{s.label}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: p !== null ? 6 : 0 }}>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{s.title}</span>
                    {p !== null && <span style={{ fontSize: 13, color: p === 100 ? '#911619' : '#666' }}>{done} / {s.tasks.length}</span>}
                    {p === null && <span style={{ fontSize: 12, color: '#bbb' }}>案件による</span>}
                  </div>
                  {p !== null && <ProgressBar value={p} color={p === 100 ? '#911619' : s.color} height={4} />}
                </div>
                {p !== null && (
                  <div style={{ fontSize: 16, fontWeight: 700, color: p === 100 ? '#911619' : '#1a1a1a', width: 44, textAlign: 'right' }}>{p}%</div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
