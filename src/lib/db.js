import { supabase } from './supabase'
import { STEPS } from '../data'

// Build checked map { stepId: { taskId: dateString } } from progress rows
export function buildCheckedMap(progressRows) {
  const checked = {}
  STEPS.forEach(s => { checked[s.id] = {} })
  progressRows.forEach(r => {
    if (!checked[r.step_id]) checked[r.step_id] = {}
    checked[r.step_id][String(r.task_id)] = r.completed_at
  })
  return checked
}

// Build trainee objects from profiles + all progress rows
export function buildTraineeData(profiles, allProgress) {
  return profiles
    .filter(p => p.role === 'trainee')
    .map(p => {
      const myProgress = allProgress.filter(r => r.user_id === p.id)
      const d = p.joined_at ? new Date(p.joined_at) : null
      const joined = d ? `${d.getFullYear()}年${d.getMonth() + 1}月` : '不明'
      return { id: p.id, name: p.name, joined, checked: buildCheckedMap(myProgress) }
    })
}

// ── Profiles ─────────────────────────────────────────────────────────────────

export async function fetchAllProfiles() {
  const { data, error } = await supabase.from('profiles').select('*')
  if (error) throw error
  return data || []
}

export async function fetchProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw error
  return data
}

// ── Task Progress ─────────────────────────────────────────────────────────────

export async function fetchAllProgress() {
  const { data, error } = await supabase.from('task_progress').select('*')
  if (error) throw error
  return data || []
}

export async function fetchMyProgress(userId) {
  const { data, error } = await supabase.from('task_progress').select('*').eq('user_id', userId)
  if (error) throw error
  return data || []
}

export async function addProgress(userId, stepId, taskId, completedAt) {
  const { error } = await supabase.from('task_progress').insert({
    user_id: userId, step_id: stepId, task_id: taskId, completed_at: completedAt,
  })
  if (error) throw error
}

export async function removeProgress(userId, stepId, taskId) {
  const { error } = await supabase.from('task_progress')
    .delete()
    .eq('user_id', userId)
    .eq('step_id', stepId)
    .eq('task_id', taskId)
  if (error) throw error
}

// ── Comments ──────────────────────────────────────────────────────────────────

export async function fetchComments(stepId, taskId) {
  const { data, error } = await supabase
    .from('task_comments')
    .select('*, profiles(name, role)')
    .eq('step_id', stepId)
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data || []).map(c => ({
    id: c.id,
    who: c.profiles?.name || '不明',
    role: c.profiles?.role || 'trainee',
    date: c.created_at.split('T')[0],
    text: c.text,
  }))
}

export async function addComment(stepId, taskId, userId, text) {
  const { data, error } = await supabase
    .from('task_comments')
    .insert({ step_id: stepId, task_id: taskId, user_id: userId, text })
    .select('*, profiles(name, role)')
    .single()
  if (error) throw error
  return {
    id: data.id,
    who: data.profiles?.name || '不明',
    role: data.profiles?.role || 'trainee',
    date: data.created_at.split('T')[0],
    text: data.text,
  }
}

// ── Notifications (recent admin comments) ─────────────────────────────────────

export async function fetchRecentAdminComments(limit = 10) {
  const { data, error } = await supabase
    .from('task_comments')
    .select('*, profiles(name, role)')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) throw error
  return (data || [])
    .filter(c => c.profiles?.role === 'admin')
    .slice(0, limit)
    .map(c => ({
      id: c.id,
      stepId: c.step_id,
      taskId: c.task_id,
      who: c.profiles?.name || '不明',
      role: c.profiles?.role,
      date: c.created_at.split('T')[0],
      text: c.text,
    }))
}

// ── Task Edits ────────────────────────────────────────────────────────────────

export async function fetchTaskEdits() {
  const { data, error } = await supabase.from('task_edits').select('*')
  if (error) throw error
  return data || []
}

export async function upsertTaskEdit({ stepId, taskId, title, tag, desc, links, userId }) {
  const { data, error } = await supabase
    .from('task_edits')
    .upsert(
      { step_id: stepId, task_id: taskId, title, tag, description: desc, links: links?.filter(u => u.trim()) || [], updated_by: userId },
      { onConflict: 'step_id,task_id' }
    )
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTaskEdit(stepId, taskId) {
  const { error } = await supabase
    .from('task_edits')
    .delete()
    .eq('step_id', stepId)
    .eq('task_id', taskId)
  if (error) throw error
}

// Merge edits on top of base STEPS data
export function mergeTaskEdits(steps, edits) {
  return steps.map(step => {
    const stepEdits = edits.filter(e => e.step_id === step.id)
    if (stepEdits.length === 0) return step

    const updatedTasks = step.tasks.map(task => {
      const edit = stepEdits.find(e => e.task_id === task.id)
      if (!edit) return task
      return {
        ...task,
        title: edit.title,
        tag: edit.tag || task.tag,
        desc: edit.description || task.desc,
        links: edit.links || task.links,
      }
    })

    // New tasks (task_id not in original)
    const existingIds = step.tasks.map(t => t.id)
    const newTasks = stepEdits
      .filter(e => !existingIds.includes(e.task_id))
      .map(e => ({
        id: e.task_id,
        no: e.task_id,
        title: e.title,
        tag: e.tag || '課題',
        desc: e.description || '',
        links: e.links || [],
        comments: [],
      }))

    return { ...step, tasks: [...updatedTasks, ...newTasks] }
  })
}

// ── AI Tasks ──────────────────────────────────────────────────────────────────

export async function fetchAiTasks() {
  const { data, error } = await supabase
    .from('ai_tasks')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createAiTask({ lang, tag, title, description, links, checkpoints, userId }) {
  const { data, error } = await supabase
    .from('ai_tasks')
    .insert({ lang, tag, title, description, links: links || [], checkpoints: checkpoints || [], status: 'pending', created_by: userId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateAiTaskStatus(id, status, userId) {
  const update = { status }
  if (status === 'approved') {
    update.approved_by = userId
    update.approved_at = new Date().toISOString()
  }
  const { error } = await supabase.from('ai_tasks').update(update).eq('id', id)
  if (error) throw error
}
