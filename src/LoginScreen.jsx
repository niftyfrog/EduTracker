import React from 'react'
import { supabase } from './lib/supabase'

export function LoginScreen() {
  const [mode, setMode] = React.useState('login') // 'login' | 'signup'
  const [userId, setUserId] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [name, setName] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [message, setMessage] = React.useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const email = `${userId.trim().toLowerCase()}@edutracker.local`
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  async function handleSignup(e) {
    e.preventDefault()
    if (!name.trim()) { setError('名前を入力してください'); return }
    setLoading(true)
    setError('')
    const email = `${userId.trim().toLowerCase()}@edutracker.local`
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name.trim() } },
    })
    if (error) {
      setError(error.message)
    } else {
      setMessage('アカウントを作成しました。ログインしてください。')
      setMode('login')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid rgba(0,0,0,0.12)', fontSize: 14,
    background: '#fafafa', outline: 'none', fontFamily: 'inherit',
    color: '#1a1a1a', transition: 'border-color 0.15s',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f4f4f4',
    }}>
      <div style={{
        width: 380, background: '#fff', borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
        padding: '36px 32px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(145,22,25,0.12)', border: '1px solid rgba(145,22,25,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: '#911619',
          }}>✦</div>
          <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: '-0.02em' }}>EduTrack</span>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
          {mode === 'login' ? 'ログイン' : 'アカウント作成'}
        </h2>
        <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
          {mode === 'login' ? '新人教育管理システムにログイン' : '新しいアカウントを作成します'}
        </p>

        {message ? (
          <div style={{ padding: '12px 14px', borderRadius: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#166534', fontSize: 13 }}>
            {message}
          </div>
        ) : (
          <form onSubmit={mode === 'login' ? handleLogin : handleSignup}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {mode === 'signup' && (
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 5 }}>名前</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="山田 花子"
                    required
                    style={inputStyle}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 5 }}>ユーザーID</label>
                <input
                  type="text"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  placeholder="yamada_hanako"
                  required
                  autoComplete="username"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 5 }}>パスワード</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="6文字以上"
                  required
                  minLength={6}
                  style={inputStyle}
                />
              </div>

              {error && (
                <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(145,22,25,0.07)', border: '1px solid rgba(145,22,25,0.2)', color: '#911619', fontSize: 12 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '11px', borderRadius: 8, border: 'none',
                  background: loading ? '#e0e0e0' : '#911619',
                  color: loading ? '#aaa' : '#fff',
                  fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', marginTop: 4,
                  boxShadow: loading ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(145,22,25,0.3)',
                  transition: 'all 0.15s',
                }}
              >
                {loading ? '処理中...' : mode === 'login' ? 'ログイン' : 'アカウント作成'}
              </button>
            </div>
          </form>
        )}

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#888' }}>
          {mode === 'login' ? (
            <>アカウントをお持ちでない方は{' '}
              <button onClick={() => { setMode('signup'); setError(''); setMessage('') }}
                style={{ background: 'none', border: 'none', color: '#911619', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}>
                新規登録
              </button>
            </>
          ) : (
            <>すでにアカウントをお持ちの方は{' '}
              <button onClick={() => { setMode('login'); setError(''); setMessage('') }}
                style={{ background: 'none', border: 'none', color: '#911619', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, padding: 0 }}>
                ログイン
              </button>
            </>
          )}
        </div>

        {mode === 'signup' && (
          <p style={{ marginTop: 16, fontSize: 11, color: '#bbb', textAlign: 'center' }}>
            ※ 最初に登録したユーザーは自動的に管理者になります
          </p>
        )}
      </div>
    </div>
  )
}
