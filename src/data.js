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

// ─── Curriculum Steps ─────────────────────────────────────────────────────────

export const STEPS = [
  {
    id: 'step0',
    no: 0,
    label: 'Step 0',
    title: 'Visual Studioのインストール・基本操作',
    type: 'checklist',
    color: '#6366f1',
    icon: 'devicon-visualstudio-plain colored',
    topics: [],
    submission: null,
    criteria: null,
    tasks: [
      { id: 1, no: 1, title: 'インストール手順', desc: 'Visual Studio Community（または Professional）をインストールする。必要なワークロード（「.NETデスクトップ開発」）を選択して完了させること。', links: [], comments: [] },
      { id: 2, no: 2, title: 'プロジェクトの作り方', desc: '新規プロジェクトの作成手順を覚える。コンソールアプリとWindowsフォームアプリの両方を作れるようにする。', links: [], comments: [] },
      { id: 3, no: 3, title: '実行・デバッグの基本', desc: 'F5でのデバッグ実行、Ctrl+F5での通常実行の違い、ブレークポイントの設定と変数ウォッチの使い方を覚える。', links: [], comments: [] },
      { id: 4, no: 4, title: 'exeの書き出し方', desc: 'リリースビルドでexeを出力する方法を覚える。発行（Publish）機能の使い方も確認すること。', links: [], comments: [] },
    ],
  },
  {
    id: 'step1',
    no: 1,
    label: 'Step 1',
    title: 'C# 基礎（コンソールアプリ）',
    type: 'assignment',
    color: '#9b59b6',
    icon: 'devicon-csharp-plain colored',
    topics: [
      '変数・条件分岐・ループ・関数',
      'エラーの読み方・ブレークポイントなど（Visual Studioの活用）',
    ],
    submission: 'exe + スクショ（または動画）',
    criteria: '指定動作が正しく動くか',
    tasks: [
      { id: 1, no: 1, title: '変数とデータ型', tag: '基礎', desc: 'int・double・string・bool などの基本データ型と変数宣言を学ぶ。型変換（int.Parse, ToString など）も確認すること。Console.WriteLine で値を出力できるようにする。', links: [], comments: [] },
      { id: 2, no: 2, title: '条件分岐（if / switch）', tag: '基礎', desc: 'if・else if・else による条件分岐と、switch 文の書き方を学ぶ。比較演算子（== != < > <= >=）と論理演算子（&& || !）も合わせて理解すること。', links: [], comments: [] },
      { id: 3, no: 3, title: 'ループ（for / while / foreach）', tag: '基礎', desc: 'for・while・do-while の違いと使い分けを学ぶ。break・continue の動作も確認すること。配列や List に対して foreach を使えるようにする。', links: [], comments: [] },
      { id: 4, no: 4, title: 'メソッド（関数）', tag: '基礎', desc: 'メソッドの定義・呼び出し・引数・戻り値の基本を学ぶ。void と返り値あり（int, string など）の両方を書けるようにすること。', links: [], comments: [] },
      { id: 5, no: 5, title: 'コンソール版電卓', tag: '課題', desc: '四則演算（+/-/×/÷）が動作するコンソールアプリを作成する。0除算エラーのハンドリングも実装すること。繰り返し計算できるようにループを使うこと。', links: [], comments: [
        { who: '田中 先輩', role: 'admin', date: '2026-04-18', text: 'まずは足し算だけ動かして、少しずつ機能を追加していきましょう！' },
      ] },
      { id: 6, no: 6, title: 'おみくじアプリ', tag: '課題', desc: 'ランダムで「大吉・中吉・小吉・吉・凶」を表示するコンソールアプリを作成する。何度でも引き直せること。終了コマンドも実装すること。', links: [], comments: [] },
    ],
  },
  {
    id: 'step2',
    no: 2,
    label: 'Step 2',
    title: 'C# + コントロール（Windowsフォームアプリ）',
    type: 'assignment',
    color: '#e74c3c',
    icon: 'devicon-csharp-plain colored',
    topics: [
      'コントロールの種類・プロパティ・イベント',
      'Step 1のロジックをGUIに移植する',
    ],
    submission: 'exe + スクショ（または動画）',
    criteria: '指定動作が正しく動くか・見た目は不問',
    tasks: [
      { id: 1, no: 1, title: 'GUI版電卓', tag: '課題', desc: 'Step 1で作ったコンソール電卓のロジックをWindowsフォームに移植する。ボタンとテキストボックスを使ってGUI操作できること。', links: [], comments: [
        { who: '山田 花子', role: 'trainee', date: '2026-04-19', text: 'Buttonのイベントがうまく設定できませんでした。もう一度確認します。' },
        { who: '田中 先輩', role: 'admin', date: '2026-04-20', text: 'デザイナーからButtonをダブルクリックするとイベントが自動で作られますよ！' },
      ] },
      { id: 2, no: 2, title: 'GUI版おみくじアプリ', tag: '課題', desc: 'Step 1で作ったおみくじアプリをWindowsフォームに移植する。ボタンをクリックで結果がLabelに表示されること。', links: [], comments: [] },
    ],
  },
  {
    id: 'step3',
    no: 3,
    label: 'Step 3',
    title: 'SQL',
    type: 'assignment',
    color: '#a78bfa',
    icon: 'devicon-mysql-plain colored',
    topics: [
      'SQL Server / PostgreSQL',
      '基本的なCRUD操作',
    ],
    submission: 'スクショ + クエリ',
    criteria: '正しくデータの取得・登録・更新・削除ができるか',
    tasks: [
      { id: 1, no: 1, title: 'データの取得（SELECT）', tag: '課題', desc: '指定テーブルからデータを取得するSELECT文を記述する。WHERE・ORDER BY・GROUP BYを使ったクエリも含む。', links: [], comments: [
        { who: '田中 先輩', role: 'admin', date: '2026-04-19', text: 'INNER JOINとLEFT JOINの違いも押さえておくと後々役立ちます。' },
      ] },
      { id: 2, no: 2, title: 'データの登録（INSERT）', tag: '課題', desc: '指定テーブルにデータをINSERTする。複数件のまとめてINSERTも実施すること。', links: [], comments: [] },
      { id: 3, no: 3, title: 'データの更新（UPDATE）', tag: '課題', desc: '条件を指定してデータをUPDATEする。誤って全件更新しないようWHERE句の確認も行うこと。', links: [], comments: [] },
      { id: 4, no: 4, title: 'データの削除（DELETE）', tag: '課題', desc: '条件を指定してデータをDELETEする。論理削除と物理削除の違いも理解すること。', links: [], comments: [] },
    ],
  },
  {
    id: 'step4',
    no: 4,
    label: 'Step 4〜',
    title: '実案件',
    type: 'project',
    color: '#f89820',
    icon: 'devicon-java-plain colored',
    topics: [
      'Java / その他',
      '仕様書を読んで自分で作る',
      '仕様書を書く課題も含む',
    ],
    submission: '仕様書 + 成果物一式',
    criteria: '仕様通りに動作するか',
    tasks: [],
  },
]

// checked: { stepId: { taskId(string): dateString } }
export const TRAINEES = [
  {
    id: 'trainee_001', name: '山田 花子', joined: '2026年4月',
    checked: {
      step0: { '1': '2026-04-07', '2': '2026-04-07', '3': '2026-04-08', '4': '2026-04-09' },
      step1: { '1': '2026-04-10', '2': '2026-04-10', '3': '2026-04-13', '4': '2026-04-14', '5': '2026-04-14', '6': '2026-04-15' },
      step2: { '1': '2026-04-16' },
      step3: { '1': '2026-04-17', '2': '2026-04-18' },
      step4: {},
    },
  },
  {
    id: 'trainee_002', name: '鈴木 太郎', joined: '2026年4月',
    checked: {
      step0: { '1': '2026-04-07', '2': '2026-04-08', '3': '2026-04-09', '4': '2026-04-10' },
      step1: { '1': '2026-04-14', '2': '2026-04-14', '3': '2026-04-15' },
      step2: {},
      step3: {},
      step4: {},
    },
  },
  {
    id: 'trainee_003', name: '伊藤 美咲', joined: '2026年4月',
    checked: {
      step0: { '1': '2026-04-06', '2': '2026-04-07', '3': '2026-04-08', '4': '2026-04-09' },
      step1: { '1': '2026-04-13', '2': '2026-04-13', '3': '2026-04-14', '4': '2026-04-14', '5': '2026-04-15', '6': '2026-04-16' },
      step2: { '1': '2026-04-17', '2': '2026-04-18' },
      step3: { '1': '2026-04-17' },
      step4: {},
    },
  },
]

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getProgress(trainee, stepId) {
  const step = STEPS.find(s => s.id === stepId)
  if (!step || !step.tasks.length) return 0
  const done = Object.keys(trainee.checked[stepId] || {}).length
  return Math.round((done / step.tasks.length) * 100)
}

export function getOverallProgress(trainee) {
  let total = 0, done = 0
  STEPS.forEach(s => {
    total += s.tasks.length
    done += Object.keys(trainee.checked[s.id] || {}).length
  })
  return total ? Math.round((done / total) * 100) : 0
}

export function getTotalDone(trainee) {
  return Object.values(trainee.checked).reduce((a, b) => a + Object.keys(b).length, 0)
}

// Returns { 'YYYY-MM-DD': count } for all completion dates
export function getCompletionDates(trainee) {
  const counts = {}
  Object.values(trainee.checked).forEach(stepChecked => {
    Object.values(stepChecked).forEach(date => {
      if (date) counts[date] = (counts[date] || 0) + 1
    })
  })
  return counts
}

// Tasks with admin comments → trainee notifications
export function getTraineeNotifications() {
  const items = []
  STEPS.forEach(s => {
    s.tasks.forEach(task => {
      const adminComments = (task.comments || []).filter(c => c.role === 'admin')
      if (adminComments.length > 0) {
        const latest = adminComments[adminComments.length - 1]
        items.push({ task, step: s, comment: latest })
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
    STEPS.forEach(s => {
      Object.entries(trainee.checked[s.id] || {}).forEach(([taskId, date]) => {
        if (date >= cutoffStr) {
          const task = s.tasks.find(t => String(t.id) === taskId)
          if (task) result.push({ trainee, task, step: s, date })
        }
      })
    })
  })
  return result.sort((a, b) => b.date.localeCompare(a.date))
}
