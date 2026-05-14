# Step 1-01: 変数とデータ型

## この課題で何ができるようになるか

- 「変数」が何者かを理解する
- int, double, string, bool の4つの基本型を使い分けられる
- 型変換（数字と文字列の相互変換）ができる
- Console.WriteLine で値を画面に表示できる

---

## 1. 変数ってなに？

プログラミングの「変数」は、**名前のついた箱**だと思ってください。

```
現実世界:
  「名前」と書いたラベルを貼った箱に「山田」と入れる

C#:
  string name = "山田";
```

箱には **型（かた）** があります。整数を入れる箱、文字を入れる箱、というように決まっています。
間違った型のものを入れようとするとエラーになります。これは「安全装置」です。

---

## 2. 基本の4つの型

まずはこの4つだけ覚えれば十分です。

| 型 | 何を入れるか | 例 |
|----|------------|-----|
| `int` | 整数（小数なし） | `42`, `-7`, `0` |
| `double` | 小数あり | `3.14`, `-0.5`, `100.0` |
| `string` | 文字列（テキスト） | `"こんにちは"`, `"abc"` |
| `bool` | 真偽値（はい/いいえ） | `true`, `false` |

### 実際に書いてみよう

```csharp
int age = 25;              // 年齢（整数）
double height = 170.5;     // 身長（小数）
string name = "山田";       // 名前（文字列）
bool isStudent = true;     // 学生かどうか（真偽値）
```

ポイント:
- `string` は **ダブルクォート `""`** で囲む（シングルクォートではない）
- `bool` は `true` か `false` の **2択だけ**
- 行の最後に **セミコロン `;`** を忘れずに

---

## 3. 画面に表示する

値を確認するには `Console.WriteLine` を使います。
これがないと、プログラムが何をしているか目で見えません。

```csharp
int age = 25;
Console.WriteLine(age);       // → 25
```

### 文字列と変数を混ぜて表示する（文字列補間）

変数の中身を文章に埋め込みたいとき、**`$` を先頭につけて `{}` の中に変数名を書く**方法が一番便利です。

```csharp
string name = "山田";
int age = 25;

Console.WriteLine($"{name}さんは{age}歳です。");
// → 山田さんは25歳です。
```

`$` を忘れると `{name}` がそのまま文字として出てしまうので注意。

### よくある別の書き方（参考）

```csharp
// + で文字列を繋げる方法（動くけど読みにくい）
Console.WriteLine(name + "さんは" + age + "歳です。");

// string.Format を使う方法（古いコードで見かける）
Console.WriteLine(string.Format("{0}さんは{1}歳です。", name, age));
```

どれも結果は同じですが、**`$"..."` の書き方（文字列補間）を使うのがおすすめ**です。
現場のコードでも一番よく使われています。

---

## 4. 型変換 ── 数字と文字列を行き来する

ユーザーがキーボードから入力した値は、**すべて文字列（string）** です。
計算するには数値に変換する必要があります。

### 文字列 → 数値

```csharp
string input = "42";

int number = int.Parse(input);         // 文字列 → 整数
double value = double.Parse(input);    // 文字列 → 小数
```

### 数値 → 文字列

```csharp
int age = 25;

string text = age.ToString();    // 整数 → 文字列
Console.WriteLine(text);         // → "25"
```

### ユーザー入力を受け取って計算する例

```csharp
Console.Write("数字を入力してください: ");
string input = Console.ReadLine();    // キーボードから1行読む（必ずstring）

int number = int.Parse(input);        // 文字列 → 整数に変換
int result = number * 2;

Console.WriteLine($"{number} の2倍は {result} です。");
```

ここで `int.Parse` をしないまま `input * 2` と書くと **エラーになります。**
文字列は計算できないからです。

---

## 5. var ── 型を省略する書き方

C# には型を自動で推測してくれる `var` があります。

```csharp
var age = 25;           // int だと自動判定
var name = "山田";       // string だと自動判定
var height = 170.5;     // double だと自動判定
```

右辺を見れば型がわかる場合は `var` で書いても問題ありません。
ただし、**最初のうちは型を明示的に書くことをおすすめ**します。
型を意識する癖がつくと、エラーの原因が格段にわかりやすくなります。

---

## 6. よくあるエラーと対処法

### エラー1: `FormatException`

```
System.FormatException: Input string was not in a correct format.
```

**原因:** `int.Parse` に数値以外の文字列（`"abc"` や `""`）を渡した。

```csharp
// これはエラーになる
int n = int.Parse("abc");   // "abc" は数値じゃない！
```

**対処:** 入力値が正しいか確認する。Step 1-07（例外処理）で正式な対処法を学びます。

### エラー2: セミコロン忘れ

```
error CS1002: ; expected
```

**原因:** 行末の `;` を書き忘れた。

```csharp
int age = 25     // ← ; がない！
```

**対処:** エラーメッセージの行番号を見て `;` を追加する。

### エラー3: ダブルクォート忘れ

```
error CS0103: The name 'こんにちは' does not exist in the current context
```

**原因:** 文字列を `""` で囲み忘れた。

```csharp
string greeting = こんにちは;    // ← "" がない！
string greeting = "こんにちは";  // ← これが正しい
```

### エラー4: 型の不一致

```
error CS0029: Cannot implicitly convert type 'string' to 'int'
```

**原因:** string型の値を int型の変数に入れようとした。

```csharp
int age = "25";         // ← string を int に入れようとしている
int age = int.Parse("25");  // ← これが正しい
```

---

## 練習問題

段階的に取り組んでください。全部できたらこの課題は完了です。

### 練習1: 自己紹介を表示する（まずは写経）

以下のコードを**そのまま打ち込んで**実行してください。コピペではなく手で打つこと。

```csharp
string name = "山田 花子";
int age = 22;
string company = "ABC株式会社";
bool isNewGrad = true;

Console.WriteLine("=== 自己紹介 ===");
Console.WriteLine($"名前: {name}");
Console.WriteLine($"年齢: {age}歳");
Console.WriteLine($"会社: {company}");
Console.WriteLine($"新卒: {isNewGrad}");
```

確認: 5行の情報が正しく表示されればOK。

### 練習2: 自分の情報に書き換える（改造）

練習1のコードの値を**自分自身の情報に変更**してください。
変数の値だけ変えれば表示が変わることを体感してください。

### 練習3: 計算してみる（改造）

以下のコードを打ち込んで実行し、結果を確認してください。

```csharp
int price = 1500;
double taxRate = 0.10;
double total = price + (price * taxRate);

Console.WriteLine($"商品価格: {price}円");
Console.WriteLine($"税率: {taxRate * 100}%");
Console.WriteLine($"税込価格: {total}円");
```

その後、`price` と `taxRate` の値を変えて何度か実行してみてください。

### 練習4: ユーザー入力を使う（自作）

以下の仕様のプログラムを**自分で**書いてください。

```
仕様:
1. 名前を入力してもらう
2. 年齢を入力してもらう
3. 「○○さん（△歳）、ようこそ！」と表示する
```

ヒント:
- `Console.ReadLine()` で入力を受け取る
- 年齢は `int.Parse()` で変換が必要
- 表示は `$"..."` を使う

### 練習5: 自由課題（自作）

以下のどれか1つを自分で考えて作ってみてください。

- BMI計算器（身長と体重を入力 → BMIを表示）
- 秒数変換（秒数を入力 → ○分○秒に変換して表示）
- 割り勘計算（金額と人数を入力 → 1人あたりの金額を表示）

---

## まとめ

```
今回学んだこと:

✓ 変数は「名前のついた箱」
✓ 基本の4型: int, double, string, bool
✓ Console.WriteLine と文字列補間 $"..."
✓ 型変換: int.Parse() / .ToString()
✓ Console.ReadLine() でユーザー入力を受け取る

次のステップ: 条件分岐（if / switch）
  → 「もし○○だったら△△する」という処理を学びます
```
