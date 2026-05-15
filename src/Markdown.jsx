import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const SyntaxHighlighter = React.lazy(() =>
  import('react-syntax-highlighter/dist/esm/prism-light').then(mod => ({ default: mod.default }))
)

// Minimal light theme for code blocks
const codeTheme = {
  'pre[class*="language-"]': { background: '#f6f6f6', padding: '14px 16px', borderRadius: '8px', fontSize: '13px', lineHeight: '1.6', overflow: 'auto', border: '1px solid rgba(0,0,0,0.08)' },
  'code[class*="language-"]': { background: 'none', fontFamily: '"Geist Mono", "SF Mono", Consolas, monospace', fontSize: '13px' },
  comment: { color: '#6a737d' },
  prolog: { color: '#6a737d' },
  punctuation: { color: '#24292e' },
  property: { color: '#005cc5' },
  tag: { color: '#22863a' },
  boolean: { color: '#005cc5' },
  number: { color: '#005cc5' },
  string: { color: '#032f62' },
  keyword: { color: '#d73a49' },
  operator: { color: '#d73a49' },
  function: { color: '#6f42c1' },
  'class-name': { color: '#6f42c1' },
  builtin: { color: '#005cc5' },
  'attr-name': { color: '#6f42c1' },
  'attr-value': { color: '#032f62' },
}

const markdownStyles = {
  wrapper: {
    fontSize: 14,
    lineHeight: 1.8,
    color: '#333',
    wordBreak: 'break-word',
  },
  h1: { fontSize: 22, fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 8, marginTop: 24, marginBottom: 12 },
  h2: { fontSize: 18, fontWeight: 700, borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: 6, marginTop: 20, marginBottom: 10 },
  h3: { fontSize: 16, fontWeight: 700, marginTop: 18, marginBottom: 8 },
  h4: { fontSize: 14, fontWeight: 700, marginTop: 14, marginBottom: 6 },
  p: { marginTop: 0, marginBottom: 12 },
  ul: { paddingLeft: 24, marginBottom: 12 },
  ol: { paddingLeft: 24, marginBottom: 12 },
  li: { marginBottom: 4 },
  blockquote: {
    margin: '0 0 12px', padding: '8px 16px',
    borderLeft: '4px solid rgba(145,22,25,0.3)', background: 'rgba(145,22,25,0.04)',
    color: '#555',
  },
  inlineCode: {
    background: '#f0f0f0', padding: '2px 6px', borderRadius: 4,
    fontSize: '0.9em', fontFamily: '"Geist Mono", "SF Mono", Consolas, monospace',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  table: { borderCollapse: 'collapse', width: '100%', marginBottom: 12 },
  th: { border: '1px solid rgba(0,0,0,0.12)', padding: '8px 12px', background: '#f6f6f6', fontWeight: 600, fontSize: 13, textAlign: 'left' },
  td: { border: '1px solid rgba(0,0,0,0.08)', padding: '8px 12px', fontSize: 13 },
  a: { color: '#911619', textDecoration: 'none', borderBottom: '1px solid rgba(145,22,25,0.3)' },
  hr: { border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)', margin: '16px 0' },
  img: { maxWidth: '100%', borderRadius: 6 },
}

// Stable components object — avoids re-parse on every render
const mdComponents = {
  h1: ({ children }) => <h1 style={markdownStyles.h1}>{children}</h1>,
  h2: ({ children }) => <h2 style={markdownStyles.h2}>{children}</h2>,
  h3: ({ children }) => <h3 style={markdownStyles.h3}>{children}</h3>,
  h4: ({ children }) => <h4 style={markdownStyles.h4}>{children}</h4>,
  p: ({ children }) => <p style={markdownStyles.p}>{children}</p>,
  ul: ({ children }) => <ul style={markdownStyles.ul}>{children}</ul>,
  ol: ({ children }) => <ol style={markdownStyles.ol}>{children}</ol>,
  li: ({ children }) => <li style={markdownStyles.li}>{children}</li>,
  blockquote: ({ children }) => <blockquote style={markdownStyles.blockquote}>{children}</blockquote>,
  table: ({ children }) => <table style={markdownStyles.table}>{children}</table>,
  th: ({ children }) => <th style={markdownStyles.th}>{children}</th>,
  td: ({ children }) => <td style={markdownStyles.td}>{children}</td>,
  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={markdownStyles.a}>{children}</a>,
  hr: () => <hr style={markdownStyles.hr} />,
  img: ({ src, alt }) => <img src={src} alt={alt} style={markdownStyles.img} />,
  code: ({ inline, className, children }) => {
    if (inline) {
      return <code style={markdownStyles.inlineCode}>{children}</code>
    }
    const lang = className?.replace('language-', '') || ''
    const codeStr = String(children).replace(/\n$/, '')
    return (
      <React.Suspense fallback={<pre style={codeTheme['pre[class*="language-"]']}><code>{codeStr}</code></pre>}>
        <SyntaxHighlighter language={lang} style={codeTheme} PreTag="div">
          {codeStr}
        </SyntaxHighlighter>
      </React.Suspense>
    )
  },
}

const remarkPlugins = [remarkGfm]

export const MarkdownRenderer = React.memo(function MarkdownRenderer({ content }) {
  if (!content) return null

  return (
    <div style={markdownStyles.wrapper}>
      <ReactMarkdown remarkPlugins={remarkPlugins} components={mdComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
})

const cheatSheetSections = [
  { title: '見出し', items: ['# 見出し1', '## 見出し2', '### 見出し3'] },
  { title: '強調', items: ['**太字**', '*斜体*', '~~取り消し線~~'] },
  { title: 'リスト', items: ['- 箇条書き', '1. 番号付き', '  - ネスト（スペース2つ）'] },
  { title: 'リンク・画像', items: ['[表示テキスト](URL)', '![代替テキスト](画像URL)'] },
  { title: 'インラインコード', items: ['`code`'] },
  { title: 'コードブロック', items: ['```言語名', 'コード', '```'] },
  { title: '引用', items: ['> 引用文'] },
  { title: 'テーブル', items: ['| 列1 | 列2 |', '| --- | --- |', '| A | B |'] },
  { title: '水平線', items: ['---'] },
  { title: 'チェックボックス', items: ['- [ ] 未完了', '- [x] 完了'] },
]

const cheatSheetStyles = {
  panel: {
    width: 220, minWidth: 220, borderLeft: '1px solid rgba(0,0,0,0.08)',
    background: '#fafafa', padding: '12px 14px', overflow: 'auto',
    fontSize: 12, color: '#555', lineHeight: 1.6,
  },
  title: { fontSize: 11, fontWeight: 700, color: '#911619', marginBottom: 2, marginTop: 10 },
  code: {
    display: 'block', fontFamily: '"Geist Mono", "SF Mono", Consolas, monospace',
    fontSize: 11, color: '#444', background: '#f0f0f0', borderRadius: 3,
    padding: '1px 5px', marginBottom: 1,
  },
}

export function MarkdownEditor({ value, onChange, rows = 12 }) {
  const [showHelp, setShowHelp] = React.useState(true)
  const textareaRef = React.useRef(null)
  const minH = rows * 22

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.target.selectionStart
      const end = e.target.selectionEnd
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2
      })
    }
  }

  return (
    <div style={{ display: 'flex', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
      {/* Left: Editor */}
      <div style={{ flex: 1, minWidth: 0, borderRight: '1px solid rgba(0,0,0,0.08)' }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '0', borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#fafafa',
        }}>
          <div style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, color: '#911619' }}>編集</div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setShowHelp(h => !h)} style={{
            padding: '4px 10px', margin: '0 8px', border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 4, cursor: 'pointer', fontSize: 11, color: '#888',
            background: showHelp ? '#f0f0f0' : 'transparent',
          }}>?</button>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={rows}
          placeholder={'課題の詳細説明をMarkdownで入力...\n\n## 見出し\n- リスト\n```csharp\nConsole.WriteLine("Hello");\n```'}
          style={{
            width: '100%', padding: '14px 16px', border: 'none', outline: 'none',
            fontSize: 14, fontFamily: '"Geist Mono", "SF Mono", Consolas, monospace',
            lineHeight: 1.7, color: '#1a1a1a', resize: 'vertical',
            minHeight: minH, background: '#fff', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Center: Live Preview */}
      <div style={{ flex: 1, minWidth: 0, borderRight: showHelp ? '1px solid rgba(0,0,0,0.08)' : 'none', overflow: 'auto' }}>
        <div style={{
          padding: '8px 16px', borderBottom: '1px solid rgba(0,0,0,0.08)', background: '#fafafa',
          fontSize: 12, fontWeight: 600, color: '#888',
        }}>プレビュー</div>
        <div style={{ padding: '14px 16px', minHeight: minH, overflow: 'auto' }}>
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <div style={{ color: '#ccc', fontSize: 14 }}>プレビューがここに表示されます</div>
          )}
        </div>
      </div>

      {/* Right: Cheat Sheet */}
      {showHelp && (
        <div style={cheatSheetStyles.panel}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#333', marginBottom: 4 }}>Markdown記法</div>
          {cheatSheetSections.map(section => (
            <div key={section.title}>
              <div style={cheatSheetStyles.title}>{section.title}</div>
              {section.items.map((item, i) => (
                <code key={i} style={cheatSheetStyles.code}>{item}</code>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
