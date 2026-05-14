import React from 'react'
import { STEPS, TODAY } from './data'
import { Avatar } from './components'
import { Sidebar, AdminDashboard, TraineeDashboard, StepListScreen, TaskListScreen, TaskDetailScreen, TaskEditScreen, TraineeManagementScreen, TraineeDetailView } from './screens'
import { FAMapScreen } from './famap'
import { AIGenerateScreen } from './aigenerate'
import { LoginScreen } from './LoginScreen'
import { supabase } from './lib/supabase'
import * as db from './lib/db'


export default function App() {
  const [session, setSession] = React.useState(undefined) // undefined = loading
  const [profile, setProfile] = React.useState(null)
  const [traineeData, setTraineeData] = React.useState([])
  const [notifications, setNotifications] = React.useState([])
  const [dataLoading, setDataLoading] = React.useState(false)

  const [steps, setSteps] = React.useState(STEPS)
  const [screen, setScreenRaw] = React.useState('dashboard')
  const [selectedStep, setSelectedStep] = React.useState(STEPS[0])
  const [selectedTask, setSelectedTask] = React.useState(null)
  const [editTask, setEditTask] = React.useState(null)
  const [selectedTrainee, setSelectedTrainee] = React.useState(null)
  const [taskComments, setTaskComments] = React.useState([])

  // ── Auth ──────────────────────────────────────────────────────────────────

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Load user profile + app data when session changes
  React.useEffect(() => {
    if (!session) {
      setProfile(null)
      setTraineeData([])
      return
    }
    loadAll(session.user.id)
  }, [session?.user?.id])

  async function loadAll(userId) {
    setDataLoading(true)
    try {
      const [profileData, profiles, allProgress, taskEdits, adminComments] = await Promise.all([
        db.fetchProfile(userId),
        db.fetchAllProfiles(),
        db.fetchAllProgress(),
        db.fetchTaskEdits(),
        db.fetchRecentAdminComments(),
      ])
      setProfile(profileData)
      const mergedSteps = db.mergeTaskEdits(STEPS, taskEdits)
      setSteps(mergedSteps)
      setNotifications(adminComments)
      setTraineeData(db.buildTraineeData(profiles, allProgress))
    } catch (e) {
      console.error('データ読み込みエラー:', e)
    } finally {
      setDataLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  function setScreen(s) {
    setScreenRaw(s)
    localStorage.setItem('edutrack-screen', s)
    window.history.pushState({ screen: s }, '', '')
  }

  // Restore screen from localStorage on mount, and set initial history state
  React.useEffect(() => {
    const saved = localStorage.getItem('edutrack-screen')
    if (saved) setScreenRaw(saved)
    window.history.replaceState({ screen: saved || 'dashboard' }, '', '')
  }, [])

  // Handle browser back/forward buttons
  React.useEffect(() => {
    function onPopState(e) {
      const s = e.state?.screen || 'dashboard'
      setScreenRaw(s)
      localStorage.setItem('edutrack-screen', s)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // ── Task Progress Persistence ─────────────────────────────────────────────

  // Wraps setTrainee to also persist changes to DB
  function makeSetTrainee(traineeId) {
    return async (newTrainee) => {
      // Update local state immediately
      setTraineeData(d => d.map(t => t.id === newTrainee.id ? newTrainee : t))
      if (traineeId !== session?.user?.id) return // only trainee can change own progress

      const oldTrainee = traineeData.find(t => t.id === traineeId) || newTrainee
      for (const stepId of Object.keys(newTrainee.checked)) {
        const oldChecked = oldTrainee.checked?.[stepId] || {}
        const newChecked = newTrainee.checked[stepId] || {}
        for (const taskId of Object.keys(newChecked)) {
          if (!oldChecked[taskId]) {
            await db.addProgress(traineeId, stepId, parseInt(taskId), newChecked[taskId]).catch(console.error)
          }
        }
        for (const taskId of Object.keys(oldChecked)) {
          if (!newChecked[taskId]) {
            await db.removeProgress(traineeId, stepId, parseInt(taskId)).catch(console.error)
          }
        }
      }
    }
  }

  // ── Comments ──────────────────────────────────────────────────────────────

  // Load comments when selected task changes
  React.useEffect(() => {
    if (!selectedTask || !selectedStep) { setTaskComments([]); return }
    db.fetchComments(selectedStep.id, selectedTask.id)
      .then(setTaskComments)
      .catch(console.error)
  }, [selectedTask?.id, selectedStep?.id])

  async function handleAddComment(text) {
    if (!session || !selectedTask || !selectedStep) return null
    const comment = await db.addComment(selectedStep.id, selectedTask.id, session.user.id, text)
    return comment
  }

  // ── Task Edit Save ───────────────────────────────────────────────────────

  async function handleSaveTask(form) {
    if (!session) return
    await db.upsertTaskEdit({
      stepId: form.stepId,
      taskId: form.id || form.no,
      title: form.title,
      tag: form.tag,
      desc: form.desc,
      links: form.links,
      criteria: form.criteria,
      criteriaImage: form.criteriaImage,
      userId: session.user.id,
    })
    // Reload task edits and merge
    const taskEdits = await db.fetchTaskEdits()
    const mergedSteps = db.mergeTaskEdits(STEPS, taskEdits)
    setSteps(mergedSteps)
    // Update selectedStep to reflect changes
    const updated = mergedSteps.find(s => s.id === form.stepId)
    if (updated) setSelectedStep(updated)
    setScreen('tasks')
  }

  // ── Derived state ─────────────────────────────────────────────────────────

  const role = profile?.role || 'trainee'
  const currentUser = profile ? { name: profile.name } : { name: '読込中...' }

  const myTrainee = traineeData.find(t => t.id === session?.user?.id)
    || { id: session?.user?.id, name: profile?.name || '', joined: '', checked: {} }

  const liveSelectedTrainee = traineeData.find(t => t.id === selectedTrainee?.id) || traineeData[0] || myTrainee

  // Keep selectedStep in sync with merged steps
  const liveSelectedStep = steps.find(s => s.id === selectedStep?.id) || selectedStep

  const traineeForTasks = role === 'admin' ? liveSelectedTrainee : myTrainee
  const setTraineeForTasks = makeSetTrainee(traineeForTasks?.id)

  // ── Render ────────────────────────────────────────────────────────────────

  // Still determining auth state
  if (session === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' }}>
        <div style={{ fontSize: 14, color: '#888' }}>読込中...</div>
      </div>
    )
  }

  // Not authenticated
  if (!session) return <LoginScreen />

  // Authenticated but profile not loaded yet
  if (dataLoading && !profile) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' }}>
        <div style={{ fontSize: 14, color: '#888' }}>データを読み込んでいます...</div>
      </div>
    )
  }

  function renderScreen() {
    switch (screen) {
      case 'dashboard':
        return role === 'admin'
          ? <AdminDashboard trainees={traineeData} steps={steps} setScreen={setScreen} setSelectedTrainee={setSelectedTrainee} setSelectedStep={setSelectedStep} currentUser={currentUser} />
          : <TraineeDashboard trainee={myTrainee} steps={steps} notifications={notifications} setScreen={setScreen} setSelectedStep={setSelectedStep} setSelectedTask={setSelectedTask} />
      case 'dashboard-trainee-view':
        return <TraineeDetailView trainee={liveSelectedTrainee} steps={steps} setScreen={setScreen} setSelectedStep={setSelectedStep} />
      case 'curriculum':
        return <StepListScreen trainee={traineeForTasks} steps={steps} role={role} setScreen={setScreen} setSelectedStep={setSelectedStep} setEditTask={setEditTask} />
      case 'famap':
        return <FAMapScreen role={role} />
      case 'aigenerate':
        return <AIGenerateScreen role={role} userId={session.user.id} />
      case 'tasks':
        return <TaskListScreen trainee={traineeForTasks} setTrainee={setTraineeForTasks} selectedStep={liveSelectedStep} role={role} setScreen={setScreen} setSelectedTask={setSelectedTask} setEditTask={setEditTask} />
      case 'detail':
        return selectedTask
          ? <TaskDetailScreen
              task={selectedTask}
              trainee={traineeForTasks}
              setTrainee={setTraineeForTasks}
              selectedStep={liveSelectedStep}
              role={role}
              setScreen={setScreen}
              setEditTask={setEditTask}
              comments={taskComments}
              onAddComment={handleAddComment}
              currentUser={currentUser}
            />
          : <div style={{ padding: 40, color: '#888' }}>課題が選択されていません</div>
      case 'edit':
        return editTask && role === 'admin'
          ? <TaskEditScreen editTask={editTask} steps={steps} setScreen={setScreen} onSave={handleSaveTask} />
          : <div style={{ padding: 40, color: '#888' }}>権限がありません</div>
      case 'trainees':
        return role === 'admin'
          ? <TraineeManagementScreen trainees={traineeData} steps={steps} setScreen={setScreen} setSelectedTrainee={t => { setSelectedTrainee(t); setScreen('dashboard-trainee-view') }} />
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
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      }}>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 6, background: '#f0f0f0', border: '1px solid rgba(0,0,0,0.07)' }}>
          <Avatar name={currentUser.name} size={20} />
          <span style={{ fontSize: 13, color: '#666' }}>{currentUser.name}</span>
          <span style={{ fontSize: 11, color: '#bbb' }}>·</span>
          <span style={{ fontSize: 11, color: '#999' }}>{role === 'admin' ? '管理者' : '新人'}</span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(0,0,0,0.1)',
            background: 'transparent', color: '#888', fontSize: 12, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.15s',
          }}
        >
          ログアウト
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar screen={screen} setScreen={setScreen} role={role} user={currentUser} />
        <main style={{ flex: 1, overflow: 'auto', background: '#f4f4f4' }}>
          {renderScreen()}
        </main>
      </div>
    </div>
  )
}
