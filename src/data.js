// ─── Constants & Utilities ───────────────────────────────────────────────────

export const TODAY = '2026-04-20'

export function relativeDate(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((new Date(TODAY + 'T12:00:00') - new Date(dateStr + 'T12:00:00')) / 86400000)
  if (diff === 0) return '今日'
  if (diff === 1) return '昨日'
  if (diff < 7) return `${diff}日前`
  const d = new Date(dateStr + 'T12:00:00')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const LANGUAGES = [
  { id: 'java',   name: 'Java',       icon: 'devicon-java-plain colored',       total: 10, color: '#f89820' },
  { id: 'python', name: 'Python',     icon: 'devicon-python-plain colored',     total: 10, color: '#4d9fff' },
  { id: 'sql',    name: 'SQL',        icon: 'devicon-mysql-plain colored',      total: 5,  color: '#a78bfa' },
  { id: 'js',     name: 'JavaScript', icon: 'devicon-javascript-plain colored', total: 8,  color: '#f5c542' },
  { id: 'git',    name: 'Git',        icon: 'devicon-git-plain colored',        total: 5,  color: '#00e599' },
]

export const TASKS_DATA = {
  java: [
    { id: 1,  no: 1,  title: '変数とデータ型',             tag: '基礎',   desc: 'Javaにおける基本的なデータ型（int, String, boolean等）と変数の宣言方法を学習します。', links: ['https://docs.oracle.com/javase/tutorial/', 'https://qiita.com/java-basics'],
      comments: [{ who: '田中 先輩', role: 'admin', date: '2026-04-18', text: '公式ドキュメントをしっかり読んでみてください！' }] },
    { id: 2,  no: 2,  title: '制御フロー（if/for/while）', tag: '基礎',   desc: '条件分岐と繰り返し処理の基本を理解し、実際にコードで確認します。', links: ['https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html'],
      comments: [{ who: '鈴木 太郎', role: 'trainee', date: '2026-04-19', text: 'whileとdo-whileの違いがよくわかりませんでした。また確認します。' }] },
    { id: 3,  no: 3,  title: 'オブジェクト指向の基本',     tag: '基礎',   desc: 'クラス・インスタンス・継承・ポリモーフィズムの概念を理解します。', links: ['https://docs.oracle.com/javase/tutorial/java/concepts/', 'https://qiita.com/oop-guide', 'https://confluence.internal/java-samples'],
      comments: [
        { who: '田中 先輩', role: 'admin',   date: '2026-04-18', text: 'まずリンク①を読んでから手を動かしてください！' },
        { who: '山田 花子', role: 'trainee', date: '2026-04-19', text: '継承のところが難しかったですが、サンプルコードで理解できました！' },
        { who: '田中 先輩', role: 'admin',   date: '2026-04-20', text: 'よく頑張りました！次はポリモーフィズムの実装例も確認してみましょう。' },
      ] },
    { id: 4,  no: 4,  title: '例外処理',                   tag: '基礎',   desc: 'try-catch-finallyを使った例外処理の書き方を学びます。', links: ['https://docs.oracle.com/javase/tutorial/essential/exceptions/'], comments: [] },
    { id: 5,  no: 5,  title: 'コレクションフレームワーク', tag: '基礎',   desc: 'List, Map, Setなどのコレクションクラスの使い方を学習します。', links: [],
      comments: [{ who: '田中 先輩', role: 'admin', date: '2026-04-20', text: 'ここは実案件でも頻繁に出てきます。特にHashMapの使い方を重点的に。' }] },
    { id: 6,  no: 6,  title: 'ストリームAPI',               tag: '基礎',   desc: 'Java 8以降のStream APIを使ったデータ処理を学びます。', links: [], comments: [] },
    { id: 7,  no: 7,  title: 'ファイルI/O処理（実案件ベース）', tag: '実案件', desc: '実際の案件で使われるファイル読み書きのパターンを学習します。', links: [], comments: [] },
    { id: 8,  no: 8,  title: 'Spring Boot入門',            tag: '実案件', desc: 'Spring Bootを使ったWeb APIの基本構造を理解します。', links: [], comments: [] },
    { id: 9,  no: 9,  title: 'JUnit テスト入門',           tag: '実案件', desc: 'ユニットテストの書き方とTDDの基礎を学びます。', links: [], comments: [] },
    { id: 10, no: 10, title: 'DB連携（JDBC/JPA）',         tag: '実案件', desc: 'データベースとJavaアプリケーションの連携方法を学習します。', links: [], comments: [] },
  ],
  python: [
    { id: 11, no: 1,  title: 'Python基礎文法',    tag: '基礎',   desc: 'Python特有の文法と基本的なデータ型を学習します。', links: [], comments: [] },
    { id: 12, no: 2,  title: 'リスト・辞書・タプル', tag: '基礎', desc: 'Pythonのコレクション型を理解します。', links: [], comments: [] },
    { id: 13, no: 3,  title: '関数と高階関数',     tag: '基礎',   desc: 'def, lambda, map/filterを学習します。', links: [], comments: [] },
    { id: 14, no: 4,  title: 'クラスとOOP',        tag: '基礎',   desc: 'Pythonにおけるオブジェクト指向を理解します。', links: [],
      comments: [{ who: '田中 先輩', role: 'admin', date: '2026-04-17', text: 'Javaとの比較でPythonのOOPの特徴を整理してみてください。' }] },
    { id: 15, no: 5,  title: 'ファイル操作',       tag: '基礎',   desc: 'テキスト・CSVファイルの読み書きを学びます。', links: [], comments: [] },
    { id: 16, no: 6,  title: 'pip・仮想環境',      tag: '基礎',   desc: 'パッケージ管理と仮想環境の使い方を学びます。', links: [], comments: [] },
    { id: 17, no: 7,  title: 'pandas入門',         tag: '実案件', desc: 'データ分析の基礎ライブラリを学習します。', links: [], comments: [] },
    { id: 18, no: 8,  title: 'FastAPI入門',        tag: '実案件', desc: 'REST APIの作成をFastAPIで学びます。', links: [], comments: [] },
    { id: 19, no: 9,  title: 'テスト（pytest）',   tag: '実案件', desc: 'pytestを使ったテストの書き方を学びます。', links: [], comments: [] },
    { id: 20, no: 10, title: 'Docker連携',         tag: '実案件', desc: 'Pythonアプリのコンテナ化を学習します。', links: [], comments: [] },
  ],
  sql: [
    { id: 21, no: 1, title: 'SELECT基礎',                    tag: '基礎',   desc: '基本的なSELECT文の書き方を学習します。', links: [], comments: [] },
    { id: 22, no: 2, title: 'WHERE・ORDER BY・GROUP BY',     tag: '基礎',   desc: '絞り込み・並び替え・集計を学びます。', links: [], comments: [] },
    { id: 23, no: 3, title: 'JOIN（結合）',                  tag: '基礎',   desc: 'テーブルの結合方法を学習します。', links: [],
      comments: [{ who: '田中 先輩', role: 'admin', date: '2026-04-19', text: 'INNER JOINとLEFT JOINの違いをしっかり押さえてください。' }] },
    { id: 24, no: 4, title: 'サブクエリ',                    tag: '基礎',   desc: 'ネストしたクエリの書き方を理解します。', links: [], comments: [] },
    { id: 25, no: 5, title: 'トランザクション・インデックス', tag: '実案件', desc: 'パフォーマンスチューニングの基礎を学びます。', links: [], comments: [] },
  ],
  js: [
    { id: 26, no: 1, title: 'JavaScript基礎',           tag: '基礎',   desc: 'JS特有の文法と型を学習します。', links: [], comments: [] },
    { id: 27, no: 2, title: '非同期処理（Promise/async）', tag: '基礎', desc: '非同期プログラミングのパターンを学びます。', links: [], comments: [] },
    { id: 28, no: 3, title: 'DOM操作',                  tag: '基礎',   desc: 'ブラウザAPIを使ったDOM操作を学習します。', links: [], comments: [] },
    { id: 29, no: 4, title: 'React入門',                tag: '実案件', desc: 'コンポーネントベースのUI開発を学びます。', links: [], comments: [] },
    { id: 30, no: 5, title: 'REST API呼び出し（fetch）', tag: '実案件', desc: 'フロントエンドからのAPI連携を学習します。', links: [], comments: [] },
    { id: 31, no: 6, title: 'TypeScript入門',           tag: '実案件', desc: '型安全なJavaScriptを学びます。', links: [], comments: [] },
    { id: 32, no: 7, title: 'テスト（Jest）',           tag: '実案件', desc: 'Jestを使ったユニットテストを学習します。', links: [], comments: [] },
    { id: 33, no: 8, title: 'ビルドツール（Vite）',     tag: '実案件', desc: 'モダンなフロントエンドビルドを学習します。', links: [], comments: [] },
  ],
  git: [
    { id: 34, no: 1, title: 'Gitの基本（init/add/commit）', tag: '基礎', desc: 'バージョン管理の基礎を学習します。', links: [], comments: [] },
    { id: 35, no: 2, title: 'ブランチとマージ',             tag: '基礎', desc: 'ブランチ戦略とマージを学びます。', links: [], comments: [] },
    { id: 36, no: 3, title: 'リモートリポジトリ（GitHub）', tag: '基礎', desc: 'push/pull/cloneを学習します。', links: [], comments: [] },
    { id: 37, no: 4, title: 'プルリクエスト文化',           tag: '基礎', desc: 'コードレビューの進め方を学びます。', links: [], comments: [] },
    { id: 38, no: 5, title: 'コンフリクト解消',             tag: '基礎', desc: 'マージコンフリクトの解決方法を学びます。', links: [], comments: [] },
  ],
}

// checked: { langId: { taskId(string): dateString } }
export const TRAINEES = [
  {
    id: 'trainee_001', name: '山田 花子', joined: '2026年4月',
    checked: {
      java:   { '1': '2026-04-07', '2': '2026-04-07', '3': '2026-04-08', '4': '2026-04-09', '5': '2026-04-10', '6': '2026-04-14', '7': '2026-04-15', '8': '2026-04-16' },
      python: { '11': '2026-04-01', '12': '2026-04-02', '13': '2026-04-03', '14': '2026-04-07', '15': '2026-04-08', '16': '2026-04-09', '17': '2026-04-14' },
      sql:    { '21': '2026-04-10', '22': '2026-04-11', '23': '2026-04-14' },
      js:     {},
      git:    { '34': '2026-04-01', '35': '2026-04-02', '36': '2026-04-03', '37': '2026-04-07', '38': '2026-04-08' },
    },
  },
  {
    id: 'trainee_002', name: '鈴木 太郎', joined: '2026年4月',
    checked: {
      java:   { '1': '2026-04-07', '2': '2026-04-08', '3': '2026-04-09', '4': '2026-04-10', '5': '2026-04-14' },
      python: { '11': '2026-04-14', '12': '2026-04-15', '13': '2026-04-16' },
      sql:    { '21': '2026-04-17', '22': '2026-04-20' },
      js:     {},
      git:    { '34': '2026-04-07', '35': '2026-04-08', '36': '2026-04-09' },
    },
  },
  {
    id: 'trainee_003', name: '伊藤 美咲', joined: '2026年4月',
    checked: {
      java:   { '1': '2026-04-06', '2': '2026-04-07', '3': '2026-04-08', '4': '2026-04-09', '5': '2026-04-13', '6': '2026-04-14' },
      python: { '11': '2026-04-13', '12': '2026-04-14', '13': '2026-04-15', '14': '2026-04-16', '15': '2026-04-17' },
      sql:    { '21': '2026-04-16', '22': '2026-04-17', '23': '2026-04-20' },
      js:     { '26': '2026-04-18' },
      git:    { '34': '2026-04-06', '35': '2026-04-07', '36': '2026-04-08', '37': '2026-04-09', '38': '2026-04-13' },
    },
  },
]

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getProgress(trainee, langId) {
  const tasks = TASKS_DATA[langId] || []
  if (!tasks.length) return 0
  const done = Object.keys(trainee.checked[langId] || {}).length
  return Math.round((done / tasks.length) * 100)
}

export function getOverallProgress(trainee) {
  let total = 0, done = 0
  LANGUAGES.forEach(l => {
    total += (TASKS_DATA[l.id] || []).length
    done += Object.keys(trainee.checked[l.id] || {}).length
  })
  return total ? Math.round((done / total) * 100) : 0
}

export function getTotalDone(trainee) {
  return Object.values(trainee.checked).reduce((a, b) => a + Object.keys(b).length, 0)
}

// Returns { 'YYYY-MM-DD': count } for all completion dates
export function getCompletionDates(trainee) {
  const counts = {}
  Object.values(trainee.checked).forEach(langChecked => {
    Object.values(langChecked).forEach(date => {
      if (date) counts[date] = (counts[date] || 0) + 1
    })
  })
  return counts
}

// Tasks with admin comments → trainee notifications
export function getTraineeNotifications() {
  const items = []
  LANGUAGES.forEach(l => {
    TASKS_DATA[l.id].forEach(task => {
      const adminComments = task.comments.filter(c => c.role === 'admin')
      if (adminComments.length > 0) {
        const latest = adminComments[adminComments.length - 1]
        items.push({ task, lang: l, comment: latest })
      }
    })
  })
  return items.sort((a, b) => b.comment.date.localeCompare(a.comment.date))
}

// Recently completed tasks across all trainees → admin review queue
export function getRecentCompletions(trainees, days = 7) {
  const cutoff = new Date(TODAY + 'T12:00:00')
  cutoff.setDate(cutoff.getDate() - days + 1)
  const cutoffStr = cutoff.toISOString().split('T')[0]
  const result = []
  trainees.forEach(trainee => {
    LANGUAGES.forEach(l => {
      Object.entries(trainee.checked[l.id] || {}).forEach(([taskId, date]) => {
        if (date >= cutoffStr) {
          const task = TASKS_DATA[l.id]?.find(t => String(t.id) === taskId)
          if (task) result.push({ trainee, task, lang: l, date })
        }
      })
    })
  })
  return result.sort((a, b) => b.date.localeCompare(a.date))
}
