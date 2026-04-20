import React from 'react'
import { LANGUAGES, TRAINEES } from './data'
import { Avatar } from './components'
import { Sidebar, AdminDashboard, TraineeDashboard, LanguageScreen, TaskListScreen, TaskDetailScreen, TaskEditScreen, TraineeManagementScreen, TraineeDetailView } from './screens'
import { FAMapScreen } from './famap'
import { AIGenerateScreen } from './aigenerate'

export default function App() {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('edutrack-state') || '{}') } catch { return {} } })()

  const [role, setRole] = React.useState(saved.role || 'admin')
  const [screen, setScreenRaw] = React.useState(saved.screen || 'dashboard')
  const [selectedLang, setSelectedLang] = React.useState(LANGUAGES[0])
  const [selectedTask, setSelectedTask] = React.useState(null)
  const [editTask, setEditTask] = React.useState(null)
  const [selectedTrainee, setSelectedTrainee] = React.useState(TRAINEES[0])
  const [traineeData, setTraineeData] = React.useState(TRAINEES)

  const myTrainee = traineeData[0]
  const setMyTrainee = (t) => setTraineeData(d => d.map((x, i) => i === 0 ? t : x))
  const liveSelectedTrainee = traineeData.find(t => t.id === selectedTrainee?.id) || traineeData[0]

  function setScreen(s) {
    setScreenRaw(s)
    localStorage.setItem('edutrack-state', JSON.stringify({ role, screen: s }))
  }

  function switchRole(r) {
    setRole(r)
    setScreenRaw('dashboard')
    localStorage.setItem('edutrack-state', JSON.stringify({ role: r, screen: 'dashboard' }))
  }

  const currentUser = role === 'admin' ? { name: '田中 先輩' } : { name: myTrainee.name }
  const traineeForTasks = role === 'admin' ? liveSelectedTrainee : myTrainee
  const setTraineeForTasks = role === 'admin'
    ? (t) => setTraineeData(d => d.map(x => x.id === t.id ? t : x))
    : setMyTrainee

  function renderScreen() {
    switch (screen) {
      case 'dashboard':
        return role === 'admin'
          ? <AdminDashboard trainees={traineeData} setScreen={setScreen} setSelectedTrainee={setSelectedTrainee} setSelectedLang={setSelectedLang} />
          : <TraineeDashboard trainee={myTrainee} setScreen={setScreen} setSelectedLang={setSelectedLang} setSelectedTask={setSelectedTask} />
      case 'dashboard-trainee-view':
        return <TraineeDetailView trainee={liveSelectedTrainee} setScreen={setScreen} setSelectedLang={setSelectedLang} />
      case 'languages':
        return <LanguageScreen trainee={traineeForTasks} role={role} setScreen={setScreen} setSelectedLang={setSelectedLang} setEditTask={setEditTask} />
      case 'famap':
        return <FAMapScreen role={role} />
      case 'aigenerate':
        return <AIGenerateScreen role={role} />
      case 'tasks':
        return <TaskListScreen trainee={traineeForTasks} setTrainee={setTraineeForTasks} selectedLang={selectedLang} role={role} setScreen={setScreen} setSelectedTask={setSelectedTask} setEditTask={setEditTask} setSelectedLang={setSelectedLang} />
      case 'detail':
        return selectedTask
          ? <TaskDetailScreen task={selectedTask} trainee={traineeForTasks} setTrainee={setTraineeForTasks} selectedLang={selectedLang} role={role} setScreen={setScreen} setEditTask={setEditTask} />
          : <div style={{ padding: 40, color: '#888' }}>課題が選択されていません</div>
      case 'edit':
        return editTask && role === 'admin'
          ? <TaskEditScreen editTask={editTask} setScreen={setScreen} />
          : <div style={{ padding: 40, color: '#888' }}>権限がありません</div>
      case 'trainees':
        return role === 'admin'
          ? <TraineeManagementScreen trainees={traineeData} setScreen={setScreen} setSelectedTrainee={t => { setSelectedTrainee(t); setScreen('dashboard-trainee-view') }} />
          : <div style={{ padding: 40, color: '#888' }}>権限がありません</div>
      default:
        return null
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{
        height: 48, flexShrink: 0, display: 'flex', alignItems: 'center',
        padding: '0 20px', gap: 12,
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        background: '#ffffff',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#999', textTransform: 'uppercase', letterSpacing: '0.06em' }}>切り替え</span>
          <div style={{ display: 'flex', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, overflow: 'hidden' }}>
            {[{ id: 'admin', label: '管理者' }, { id: 'trainee', label: '新人' }].map(r => (
              <button key={r.id} onClick={() => switchRole(r.id)} style={{
                padding: '5px 14px', border: 'none', cursor: 'pointer',
                background: role === r.id ? '#911619' : 'transparent',
                color: role === r.id ? '#fff' : '#666',
                fontSize: 13, fontWeight: role === r.id ? 600 : 400,
                fontFamily: 'inherit', transition: 'all 0.15s',
              }}>{r.label}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 6, background: '#f0f0f0', border: '1px solid rgba(0,0,0,0.07)' }}>
          <Avatar name={currentUser.name} size={20} />
          <span style={{ fontSize: 13, color: '#666' }}>{currentUser.name}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar screen={screen} setScreen={setScreen} role={role} user={currentUser} />
        <main style={{ flex: 1, overflow: 'auto', background: 'rgb(248, 248, 248)' }}>
          {renderScreen()}
        </main>
      </div>
    </div>
  )
}
