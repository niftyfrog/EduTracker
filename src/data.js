// ─── Constants & Utilities ───────────────────────────────────────────────────

export const TODAY = new Date().toISOString().split('T')[0]

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
      '配列・List・文字列操作',
      '例外処理・クラス入門・列挙型',
      'ファイル入出力',
      'エラーの読み方・ブレークポイントなど（Visual Studioの活用）',
    ],
    submission: 'exe + スクショ（または動画）',
    criteria: '指定動作が正しく動くか',
    tasks: [
      // ── 基礎 ──
      { id: 1, no: 1, title: '変数とデータ型', tag: '基礎', desc: `## この課題で何ができるようになるか

- 「変数」が何者かを理解する
- int, double, string, bool の4つの基本型を使い分けられる
- 型変換（数字と文字列の相互変換）ができる
- Console.WriteLine で値を画面に表示できる

---

## 1. 変数ってなに？

プログラミングの「変数」は、**名前のついた箱**だと思ってください。

\`\`\`
現実世界:
  「名前」と書いたラベルを貼った箱に「山田」と入れる

C#:
  string name = "山田";
\`\`\`

箱には **型（かた）** があります。整数を入れる箱、文字を入れる箱、というように決まっています。
間違った型のものを入れようとするとエラーになります。これは「安全装置」です。

---

## 2. 基本の4つの型

まずはこの4つだけ覚えれば十分です。

| 型 | 何を入れるか | 例 |
|----|------------|-----|
| \`int\` | 整数（小数なし） | \`42\`, \`-7\`, \`0\` |
| \`double\` | 小数あり | \`3.14\`, \`-0.5\`, \`100.0\` |
| \`string\` | 文字列（テキスト） | \`"こんにちは"\`, \`"abc"\` |
| \`bool\` | 真偽値（はい/いいえ） | \`true\`, \`false\` |

### 実際に書いてみよう

\`\`\`csharp
int age = 25;              // 年齢（整数）
double height = 170.5;     // 身長（小数）
string name = "山田";       // 名前（文字列）
bool isStudent = true;     // 学生かどうか（真偽値）
\`\`\`

ポイント:
- \`string\` は **ダブルクォート \`""\`** で囲む（シングルクォートではない）
- \`bool\` は \`true\` か \`false\` の **2択だけ**
- 行の最後に **セミコロン \`;\`** を忘れずに

---

## 3. 画面に表示する

値を確認するには \`Console.WriteLine\` を使います。
これがないと、プログラムが何をしているか目で見えません。

\`\`\`csharp
int age = 25;
Console.WriteLine(age);       // → 25
\`\`\`

### 文字列と変数を混ぜて表示する（文字列補間）

変数の中身を文章に埋め込みたいとき、**\`$\` を先頭につけて \`{}\` の中に変数名を書く**方法が一番便利です。

\`\`\`csharp
string name = "山田";
int age = 25;

Console.WriteLine($"{name}さんは{age}歳です。");
// → 山田さんは25歳です。
\`\`\`

\`$\` を忘れると \`{name}\` がそのまま文字として出てしまうので注意。

### よくある別の書き方（参考）

\`\`\`csharp
// + で文字列を繋げる方法（動くけど読みにくい）
Console.WriteLine(name + "さんは" + age + "歳です。");

// string.Format を使う方法（古いコードで見かける）
Console.WriteLine(string.Format("{0}さんは{1}歳です。", name, age));
\`\`\`

どれも結果は同じですが、**\`$"..."\` の書き方（文字列補間）を使うのがおすすめ**です。
現場のコードでも一番よく使われています。

---

## 4. 型変換 ── 数字と文字列を行き来する

ユーザーがキーボードから入力した値は、**すべて文字列（string）** です。
計算するには数値に変換する必要があります。

### 文字列 → 数値

\`\`\`csharp
string input = "42";

int number = int.Parse(input);         // 文字列 → 整数
double value = double.Parse(input);    // 文字列 → 小数
\`\`\`

### 数値 → 文字列

\`\`\`csharp
int age = 25;

string text = age.ToString();    // 整数 → 文字列
Console.WriteLine(text);         // → "25"
\`\`\`

### ユーザー入力を受け取って計算する例

\`\`\`csharp
Console.Write("数字を入力してください: ");
string input = Console.ReadLine();    // キーボードから1行読む（必ずstring）

int number = int.Parse(input);        // 文字列 → 整数に変換
int result = number * 2;

Console.WriteLine($"{number} の2倍は {result} です。");
\`\`\`

ここで \`int.Parse\` をしないまま \`input * 2\` と書くと **エラーになります。**
文字列は計算できないからです。

---

## 5. var ── 型を省略する書き方

C# には型を自動で推測してくれる \`var\` があります。

\`\`\`csharp
var age = 25;           // int だと自動判定
var name = "山田";       // string だと自動判定
var height = 170.5;     // double だと自動判定
\`\`\`

右辺を見れば型がわかる場合は \`var\` で書いても問題ありません。
ただし、**最初のうちは型を明示的に書くことをおすすめ**します。
型を意識する癖がつくと、エラーの原因が格段にわかりやすくなります。

---

## 6. よくあるエラーと対処法

### エラー1: \`FormatException\`

\`\`\`
System.FormatException: Input string was not in a correct format.
\`\`\`

**原因:** \`int.Parse\` に数値以外の文字列（\`"abc"\` や \`""\`）を渡した。

\`\`\`csharp
// これはエラーになる
int n = int.Parse("abc");   // "abc" は数値じゃない！
\`\`\`

**対処:** 入力値が正しいか確認する。Step 1-07（例外処理）で正式な対処法を学びます。

### エラー2: セミコロン忘れ

\`\`\`
error CS1002: ; expected
\`\`\`

**原因:** 行末の \`;\` を書き忘れた。

\`\`\`csharp
int age = 25     // ← ; がない！
\`\`\`

**対処:** エラーメッセージの行番号を見て \`;\` を追加する。

### エラー3: ダブルクォート忘れ

\`\`\`
error CS0103: The name 'こんにちは' does not exist in the current context
\`\`\`

**原因:** 文字列を \`""\` で囲み忘れた。

\`\`\`csharp
string greeting = こんにちは;    // ← "" がない！
string greeting = "こんにちは";  // ← これが正しい
\`\`\`

### エラー4: 型の不一致

\`\`\`
error CS0029: Cannot implicitly convert type 'string' to 'int'
\`\`\`

**原因:** string型の値を int型の変数に入れようとした。

\`\`\`csharp
int age = "25";         // ← string を int に入れようとしている
int age = int.Parse("25");  // ← これが正しい
\`\`\`

---

## 練習問題

段階的に取り組んでください。全部できたらこの課題は完了です。

### 練習1: 自己紹介を表示する（まずは写経）

以下のコードを**そのまま打ち込んで**実行してください。コピペではなく手で打つこと。

\`\`\`csharp
string name = "山田 花子";
int age = 22;
string company = "ABC株式会社";
bool isNewGrad = true;

Console.WriteLine("=== 自己紹介 ===");
Console.WriteLine($"名前: {name}");
Console.WriteLine($"年齢: {age}歳");
Console.WriteLine($"会社: {company}");
Console.WriteLine($"新卒: {isNewGrad}");
\`\`\`

確認: 5行の情報が正しく表示されればOK。

### 練習2: 自分の情報に書き換える（改造）

練習1のコードの値を**自分自身の情報に変更**してください。
変数の値だけ変えれば表示が変わることを体感してください。

### 練習3: 計算してみる（改造）

以下のコードを打ち込んで実行し、結果を確認してください。

\`\`\`csharp
int price = 1500;
double taxRate = 0.10;
double total = price + (price * taxRate);

Console.WriteLine($"商品価格: {price}円");
Console.WriteLine($"税率: {taxRate * 100}%");
Console.WriteLine($"税込価格: {total}円");
\`\`\`

その後、\`price\` と \`taxRate\` の値を変えて何度か実行してみてください。

### 練習4: ユーザー入力を使う（自作）

以下の仕様のプログラムを**自分で**書いてください。

\`\`\`
仕様:
1. 名前を入力してもらう
2. 年齢を入力してもらう
3. 「○○さん（△歳）、ようこそ！」と表示する
\`\`\`

ヒント:
- \`Console.ReadLine()\` で入力を受け取る
- 年齢は \`int.Parse()\` で変換が必要
- 表示は \`$"..."\` を使う

### 練習5: 自由課題（自作）

以下のどれか1つを自分で考えて作ってみてください。

- BMI計算器（身長と体重を入力 → BMIを表示）
- 秒数変換（秒数を入力 → ○分○秒に変換して表示）
- 割り勘計算（金額と人数を入力 → 1人あたりの金額を表示）

---

## まとめ

\`\`\`
今回学んだこと:

✓ 変数は「名前のついた箱」
✓ 基本の4型: int, double, string, bool
✓ Console.WriteLine と文字列補間 $"..."
✓ 型変換: int.Parse() / .ToString()
✓ Console.ReadLine() でユーザー入力を受け取る

次のステップ: 条件分岐（if / switch）
  → 「もし○○だったら△△する」という処理を学びます
\`\`\``, links: [], comments: [] },
      { id: 2, no: 2, title: '条件分岐（if / switch）', tag: '基礎', desc: 'if・else if・else による条件分岐と、switch 文の書き方を学ぶ。比較演算子（== != < > <= >=）と論理演算子（&& || !）も合わせて理解すること。', links: [], comments: [] },
      { id: 3, no: 3, title: 'ループ（for / while / foreach）', tag: '基礎', desc: 'for・while・do-while の違いと使い分けを学ぶ。break・continue の動作も確認すること。配列や List に対して foreach を使えるようにする。', links: [], comments: [] },
      { id: 4, no: 4, title: 'メソッド（関数）', tag: '基礎', desc: 'メソッドの定義・呼び出し・引数・戻り値の基本を学ぶ。void と返り値あり（int, string など）の両方を書けるようにすること。', links: [], comments: [] },
      { id: 5, no: 5, title: '配列と List<T>', tag: '基礎', desc: '配列（int[] など）の宣言・初期化・要素アクセスを学ぶ。List<T> の Add・Remove・Count・Contains などの基本操作も覚えること。配列と List の違い（固定長 vs 可変長）を理解する。', links: [], comments: [] },
      { id: 6, no: 6, title: '文字列操作', tag: '基礎', desc: 'string の主要メソッド（Split, Replace, Substring, Trim, Contains, IndexOf, ToUpper/ToLower）を学ぶ。文字列補間（$"{変数}"）や string.Format も使えるようにすること。', links: [], comments: [] },
      { id: 7, no: 7, title: '例外処理（try-catch-finally）', tag: '基礎', desc: 'try-catch-finally の構文と動作を学ぶ。FormatException・IndexOutOfRangeException・DivideByZeroException など代表的な例外を実際に発生させて捕捉する練習をすること。', links: [], comments: [] },
      { id: 8, no: 8, title: 'クラスとオブジェクト（入門）', tag: '基礎', desc: 'クラスの定義（フィールド・プロパティ・メソッド・コンストラクタ）と new によるインスタンス生成を学ぶ。簡単なクラス（例: Person クラス）を作って動かせるようにすること。', links: [], comments: [] },
      { id: 9, no: 9, title: '列挙型（enum）と定数（const）', tag: '基礎', desc: 'enum の定義と使い方を学ぶ。switch 文との組み合わせも練習すること。const と readonly の違いも理解する。', links: [], comments: [] },
      { id: 10, no: 10, title: 'ファイルの読み書き', tag: '基礎', desc: 'File.ReadAllText / File.WriteAllText による簡易ファイル操作を学ぶ。StreamReader / StreamWriter を使った行単位の読み書きも覚えること。using 文によるリソース管理も理解する。', links: [], comments: [] },
      // ── 課題 ──
      { id: 11, no: 11, title: 'コンソール版電卓', tag: '課題', desc: '四則演算（+/-/×/÷）が動作するコンソールアプリを作成する。0除算エラーのハンドリングも実装すること。繰り返し計算できるようにループを使うこと。', links: [], comments: [] },
      { id: 12, no: 12, title: 'おみくじアプリ', tag: '課題', desc: 'ランダムで「大吉・中吉・小吉・吉・凶」を表示するコンソールアプリを作成する。何度でも引き直せること。終了コマンドも実装すること。', links: [], comments: [] },
      { id: 13, no: 13, title: 'じゃんけんゲーム', tag: '課題', desc: 'ユーザーがグー・チョキ・パーを選択し、コンピュータとじゃんけんするアプリを作成する。勝敗判定と戦績（勝ち・負け・あいこの回数）を表示すること。enum を使って手を表現すると良い。', links: [], comments: [] },
      { id: 14, no: 14, title: '数当てゲーム', tag: '課題', desc: '1〜100のランダムな数をコンピュータが決め、ユーザーが当てるゲームを作成する。「もっと大きい」「もっと小さい」のヒントを出すこと。試行回数を表示し、不正な入力には例外処理で対応すること。', links: [], comments: [] },
      { id: 15, no: 15, title: '成績管理アプリ', tag: '課題', desc: '生徒名と点数を複数人分入力し、一覧表示・平均点・最高点・最低点を算出するアプリを作成する。List と クラス（生徒クラス）を使って実装すること。', links: [], comments: [] },
      { id: 16, no: 16, title: 'ToDoリスト', tag: '課題', desc: 'タスクの追加・一覧表示・完了/削除ができるコンソールアプリを作成する。List<T> を活用すること。番号指定で操作できるメニュー形式にすること。', links: [], comments: [] },
      { id: 17, no: 17, title: '簡易家計簿', tag: '課題', desc: '収入・支出を入力して記録し、残高と履歴を表示するアプリを作成する。データをテキストファイルに保存し、次回起動時に読み込めること。ファイル入出力と例外処理を活用すること。', links: [], comments: [] },
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
      { id: 1, no: 1, title: 'GUI版電卓', tag: '課題', desc: 'Step 1で作ったコンソール電卓のロジックをWindowsフォームに移植する。ボタンとテキストボックスを使ってGUI操作できること。', links: [], comments: [] },
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
      { id: 1, no: 1, title: 'データの取得（SELECT）', tag: '課題', desc: '指定テーブルからデータを取得するSELECT文を記述する。WHERE・ORDER BY・GROUP BYを使ったクエリも含む。', links: [], comments: [] },
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

// ─── Helper Functions ─────────────────────────────────────────────────────────
// steps パラメータ: DB編集データとマージ済みのステップ配列を受け取る

export function getProgress(trainee, stepId, steps = STEPS) {
  const step = steps.find(s => s.id === stepId)
  if (!step || !step.tasks.length) return 0
  const done = Object.keys(trainee.checked[stepId] || {}).length
  return Math.round((done / step.tasks.length) * 100)
}

export function getOverallProgress(trainee, steps = STEPS) {
  let total = 0, done = 0
  steps.forEach(s => {
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

// Recently completed tasks across all trainees → admin review queue
export function getRecentCompletions(trainees, days = 7, steps = STEPS) {
  const cutoff = new Date(TODAY + 'T12:00:00')
  cutoff.setDate(cutoff.getDate() - days + 1)
  const cutoffStr = cutoff.toISOString().split('T')[0]
  const result = []
  trainees.forEach(trainee => {
    steps.forEach(s => {
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
