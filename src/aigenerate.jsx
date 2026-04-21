import React from 'react'

const AI_LANGUAGES = ['C#', 'SQL', 'Java']
const AI_TAGS = ['基礎', '実案件']

export function AIGenerateScreen({ role }) {
  const [lang, setLangState] = React.useState('C#')
  const [tag, setTag] = React.useState('基礎')
  const [context, setContext] = React.useState('')
  const [generating, setGenerating] = React.useState(false)
  const [draft, setDraft] = React.useState(null)
  const [editedDraft, setEditedDraft] = React.useState(null)
  const [pendingTasks, setPendingTasks] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('ai-pending-tasks') || '[]') } catch { return [] }
  })
  const [approvedTasks, setApprovedTasks] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('ai-approved-tasks') || '[]') } catch { return [] }
  })
  const [activeTab, setActiveTab] = React.useState('generate')

  function savePending(tasks) { setPendingTasks(tasks); localStorage.setItem('ai-pending-tasks', JSON.stringify(tasks)) }
  function saveApproved(tasks) { setApprovedTasks(tasks); localStorage.setItem('ai-approved-tasks', JSON.stringify(tasks)) }

  async function generate() {
    setGenerating(true)
    setDraft(null)
    try {
      const prompt = `あなたはIT企業の新人教育担当です。以下の条件で課題を1件生成してください。\n\n言語: ${lang}\n種別: ${tag}\n追加コンテキスト: ${context || 'なし'}\n\n以下のJSON形式で回答してください（コードブロックなし、JSONのみ）:\n{\n  "title": "課題のタイトル（30字以内）",\n  "description": "課題の詳細説明（200字程度）。何を学ぶか、どう取り組むかを明確に記述。",\n  "links": ["参考URL1", "参考URL2"],\n  "checkpoints": ["確認ポイント1", "確認ポイント2", "確認ポイント3"]\n}`

      const text = await window.claude?.complete({ messages: [{ role: 'user', content: prompt }] })
      if (!text) throw new Error('Claude API not available')

      let parsed
      try { parsed = JSON.parse(text.trim()) } catch {
        const match = text.match(/\{[\s\S]*\}/)
        parsed = match ? JSON.parse(match[0]) : null
      }
      if (parsed) {
        const d = { ...parsed, lang, tag, id: Date.now(), status: 'draft' }
        setDraft(d)
        setEditedDraft(d)
      }
    } catch (e) {
      console.error(e)
      alert('AI生成はClaude Design環境でのみ動作します。')
    } finally {
      setGenerating(false)
    }
  }

  function submitForApproval() {
    if (!editedDraft) return
    const task = { ...editedDraft, status: 'pending', submittedAt: new Date().toLocaleString('ja-JP') }
    savePending([task, ...pendingTasks])
    setDraft(null); setEditedDraft(null); setContext(''); setActiveTab('pending')
  }
  function approveTask(taskId) {
    const task = pendingTasks.find(t => t.id === taskId)
    if (!task) return
    saveApproved([{ ...task, status: 'approved', approvedAt: new Date().toLocaleString('ja-JP') }, ...approvedTasks])
    savePending(pendingTasks.filter(t => t.id !== taskId))
  }
  function rejectTask(taskId) { savePending(pendingTasks.filter(t => t.id !== taskId)) }

  const tabStyle = (id) => ({
    padding: '8px 16px', border: 'none', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 13, fontWeight: activeTab === id ? 600 : 400,
    color: activeTab === id ? '#911619' : '#888',
    borderBottom: `2px solid ${activeTab === id ? '#911619' : 'transparent'}`,
    background: 'transparent', transition: 'all 0.15s',
  })

  return (
    <div style={{ padding: '28px 36px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          {role === 'admin' ? '管理者機能' : '機能制限あり'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>AI課題生成</h1>
          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'rgba(145,22,25,0.08)', color: '#911619', fontWeight: 600, border: '1px solid rgba(145,22,25,0.2)' }}>Claude Haiku</span>
        </div>
      </div>

      <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', marginBottom: 24, display: 'flex', gap: 4 }}>
        <button style={tabStyle('generate')} onClick={() => setActiveTab('generate')}>✨ 生成</button>
        <button style={tabStyle('pending')} onClick={() => setActiveTab('pending')}>
          ⏳ 承認待ち
          {pendingTasks.length > 0 && (
            <span style={{ marginLeft: 6, background: '#911619', color: '#fff', borderRadius: 99, fontSize: 10, padding: '1px 6px', fontWeight: 700 }}>{pendingTasks.length}</span>
          )}
        </button>
        <button style={tabStyle('approved')} onClick={() => setActiveTab('approved')}>✅ 承認済み ({approvedTasks.length})</button>
      </div>

      {activeTab === 'generate' && (
        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ width: 300, flexShrink: 0 }}>
            <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a' }}>課題の条件を入力</div>
              <div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 5 }}>言語・技術</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {AI_LANGUAGES.map(l => (
                    <button key={l} onClick={() => setLangState(l)} style={{
                      padding: '4px 10px', borderRadius: 6, border: `1px solid ${lang === l ? '#911619' : 'rgba(0,0,0,0.1)'}`,
                      background: lang === l ? 'rgba(145,22,25,0.08)' : '#fff',
                      color: lang === l ? '#911619' : '#666', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', fontWeight: lang === l ? 600 : 400,
                    }}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 5 }}>種別</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {AI_TAGS.map(t => (
                    <button key={t} onClick={() => setTag(t)} style={{
                      flex: 1, padding: '6px', borderRadius: 6,
                      border: `1px solid ${tag === t ? '#911619' : 'rgba(0,0,0,0.1)'}`,
                      background: tag === t ? 'rgba(145,22,25,0.08)' : '#fff',
                      color: tag === t ? '#911619' : '#666', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: tag === t ? 600 : 400,
                    }}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 5 }}>追加コンテキスト（任意）</div>
                <textarea value={context} onChange={e => setContext(e.target.value)}
                  placeholder="例：FA現場での実務を想定した課題にしてほしい"
                  rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'inherit', resize: 'none', color: '#1a1a1a', background: '#fafafa' }} />
              </div>
              <button onClick={generate} disabled={generating || role !== 'admin'} style={{
                padding: '10px', borderRadius: 8, border: 'none', cursor: generating || role !== 'admin' ? 'not-allowed' : 'pointer',
                background: generating || role !== 'admin' ? '#e0e0e0' : '#911619',
                color: generating || role !== 'admin' ? '#aaa' : '#fff',
                fontSize: 13, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.15s',
              }}>
                {generating ? '⏳ 生成中...' : '✨ AIで課題を生成'}
              </button>
              {role !== 'admin' && <div style={{ fontSize: 11, color: '#aaa', textAlign: 'center' }}>管理者のみ使用可能</div>}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {!draft && !generating && (
              <div style={{ border: '2px dashed rgba(0,0,0,0.1)', borderRadius: 12, padding: '48px 32px', textAlign: 'center', color: '#bbb', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                <div style={{ fontSize: 40 }}>✨</div>
                <div style={{ fontSize: 14 }}>左の条件を設定してAIで課題を生成</div>
                <div style={{ fontSize: 12 }}>Claude Haikuが課題の下書きを自動作成します</div>
              </div>
            )}
            {generating && (
              <div style={{ border: '1px solid rgba(145,22,25,0.2)', borderRadius: 12, padding: '48px 32px', textAlign: 'center', background: 'rgba(145,22,25,0.03)', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #f0f0f0', borderTop: '3px solid #911619', animation: 'spin 0.8s linear infinite' }} />
                <div style={{ fontSize: 14, color: '#666' }}>Claude Haikuが課題を生成中...</div>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
            {draft && editedDraft && (
              <div style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#911619' }}>✨ AI生成下書き</span>
                  <span style={{ fontSize: 10, color: '#aaa', marginLeft: 'auto' }}>内容を確認・編集してから承認申請してください</span>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(145,22,25,0.08)', color: '#911619', fontWeight: 600 }}>{editedDraft.lang}</span>
                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#f0f0f0', color: '#666', fontWeight: 600 }}>{editedDraft.tag}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 5 }}>タイトル</div>
                    <input value={editedDraft.title} onChange={e => setEditedDraft(p => ({ ...p, title: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', fontSize: 14, fontWeight: 600, fontFamily: 'inherit', color: '#1a1a1a' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 5 }}>説明文</div>
                    <textarea value={editedDraft.description} onChange={e => setEditedDraft(p => ({ ...p, description: e.target.value }))}
                      rows={4} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', fontSize: 13, lineHeight: 1.7, fontFamily: 'inherit', color: '#444', resize: 'vertical' }} />
                  </div>
                  {editedDraft.checkpoints?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, color: '#888', marginBottom: 5 }}>確認ポイント</div>
                      {editedDraft.checkpoints.map((cp, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: '#555', marginBottom: 4 }}>
                          <span style={{ color: '#911619', flexShrink: 0 }}>▸</span><span>{cp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {editedDraft.links?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 11, color: '#888', marginBottom: 5 }}>参考リンク</div>
                      {editedDraft.links.map((url, i) => (
                        <div key={i} style={{ fontSize: 12, color: '#911619', marginBottom: 2 }}>🔗 {url}</div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, paddingTop: 4, borderTop: '1px solid rgba(0,0,0,0.07)' }}>
                    <button onClick={() => { setDraft(null); setEditedDraft(null) }} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#888', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>破棄</button>
                    <button onClick={generate} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(0,0,0,0.1)', background: '#fff', color: '#666', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>🔄 再生成</button>
                    <button onClick={submitForApproval} style={{ flex: 2, padding: '8px', borderRadius: 8, border: 'none', background: '#911619', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>承認申請する →</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {pendingTasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#bbb' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
              <div>承認待ちの課題はありません</div>
            </div>
          )}
          {pendingTasks.map(task => (
            <div key={task.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#fffdf0', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11, color: '#b45309', fontWeight: 600 }}>⏳ 承認待ち</span>
                <span style={{ fontSize: 10, color: '#aaa', marginLeft: 'auto' }}>{task.submittedAt}</span>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(145,22,25,0.08)', color: '#911619', fontWeight: 600 }}>{task.lang}</span>
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: '#f0f0f0', color: '#666' }}>{task.tag}</span>
              </div>
              <div style={{ padding: '16px 18px' }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{task.title}</div>
                <p style={{ fontSize: 12, color: '#666', lineHeight: 1.7, marginBottom: 12 }}>{task.description}</p>
                {task.checkpoints?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>確認ポイント</div>
                    {task.checkpoints.map((cp, i) => <div key={i} style={{ fontSize: 12, color: '#555', marginBottom: 3 }}>▸ {cp}</div>)}
                  </div>
                )}
                {role === 'admin' ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => rejectTask(task.id)} style={{ flex: 1, padding: '8px', borderRadius: 8, border: '1px solid rgba(255,107,107,0.3)', background: '#fff5f5', color: '#c0392b', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>✕ 却下</button>
                    <button onClick={() => approveTask(task.id)} style={{ flex: 2, padding: '8px', borderRadius: 8, border: 'none', background: '#911619', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>✓ 承認して新人へ公開</button>
                  </div>
                ) : <div style={{ fontSize: 11, color: '#aaa' }}>管理者の承認を待っています...</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'approved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {approvedTasks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#bbb' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✅</div>
              <div>承認済みの課題はまだありません</div>
            </div>
          )}
          {approvedTasks.map(task => (
            <div key={task.id} style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 10, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(45,122,79,0.12)', border: '1px solid rgba(45,122,79,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#2d7a4f', flexShrink: 0, marginTop: 2 }}>✓</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{task.title}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: 'rgba(145,22,25,0.08)', color: '#911619', fontWeight: 600 }}>{task.lang}</span>
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 3, background: '#f0f0f0', color: '#666' }}>{task.tag}</span>
                  <span style={{ fontSize: 10, color: '#bbb', marginLeft: 'auto' }}>承認日時: {task.approvedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
