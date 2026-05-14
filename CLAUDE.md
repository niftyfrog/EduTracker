# EduTracker — プロジェクト指示書

## プロジェクト概要

IT企業の新人向け教育進捗管理アプリ。管理者（先輩）と新人（研修生）の2ロールで課題チェック・コメントを管理する。

## 技術スタック

- **フロントエンド:** React 18 + Vite 6（SPA）
- **バックエンド:** Supabase（認証 + PostgreSQL + Storage）
- **デプロイ:** GitHub Pages（GitHub Actions: `.github/workflows/deploy.yml`）
- **Markdown描画:** react-markdown + remark-gfm + react-syntax-highlighter

## ファイル構成

| ファイル | 役割 |
|---------|------|
| `src/App.jsx` | メインコンポーネント。Supabase Auth管理、DBデータ読み込み |
| `src/LoginScreen.jsx` | ID入力ベースのログイン/新規登録画面 |
| `src/screens.jsx` | 全画面コンポーネント（ダッシュボード、詳細、編集等） |
| `src/data.js` | カリキュラム定義（STEPS定数）、進捗計算ヘルパー |
| `src/Markdown.jsx` | MarkdownRenderer / MarkdownEditor コンポーネント |
| `src/components.jsx` | 共通UIコンポーネント |
| `src/lib/supabase.js` | Supabaseクライアント初期化 |
| `src/lib/db.js` | DB操作関数（profiles, task_progress, task_comments, task_edits, ai_tasks） |
| `src/aigenerate.jsx` | AI課題生成（DBバックエンド） |
| `src/famap.jsx` | FAシステムマップ |
| `supabase/schema.sql` | DBスキーマ |
| `supabase/add_criteria.sql` | criteria列追加マイグレーション |
| `docs/requirements.md` | 要件定義書 |
| `docs/server-migration-spec.md` | サーバー移行仕様書（Supabase → Docker自前ホスト） |
| `docs/curriculum/` | 各課題の詳細な学習コンテンツ（Markdown） |

## 認証

- **IDベース認証**（メールではない）
- 内部的には `{userId}@edutracker.local` の疑似メールでSupabase Authを利用
- 最初に登録したユーザーが自動的にadminになる（DBトリガー）
- 環境変数: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## カリキュラム構造

- `STEPS` 配列（Step 0〜4+）は `src/data.js` 内の定数
- Step 0: Visual Studio セットアップ（type: `checklist`）
- Step 1: C# 基礎・コンソールアプリ（10個の基礎 + 7個の課題 = 計17タスク）
- Step 2: C# + Windows フォーム（type: `assignment`）
- Step 3: SQL（type: `assignment`）
- Step 4+: 実案件（type: `project`）
- 各タスクの `desc` フィールドにMarkdownで詳細な学習コンテンツを格納（Step 1-01は反映済み）
- `docs/curriculum/` に元のMarkdownファイルを保管
- task_editsテーブルでDB側からタスク内容を上書き可能

## DBテーブル

- `profiles` — ユーザープロフィール（id, name, role, joined_at）
- `task_progress` — 課題完了状態（user_id, step_id, task_id, completed_at）
- `task_comments` — コメント（step_id, task_id, user_id, text, created_at）
- `task_edits` — 管理者によるタスク編集（title, tag, desc, links, criteria, criteria_image）
- `ai_tasks` — AI生成課題（status: pending/approved/rejected）

## タスクの完了条件（criteria）

- 各タスクに `criteria`（テキスト、Markdown対応）と `criteria_image`（Supabase Storage画像URL）を設定可能
- task_editsテーブルにcriteria / criteria_image列がない環境ではフォールバック（retryロジック in db.js）

## UIデザイン

- アクセントカラー: ダークレッド `#911619`
- フォント: Geist / Geist Mono

## 開発コマンド

```bash
npm install    # 依存インストール
npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
```

## 今後の予定

- Step 1 の残り16タスク分の学習コンテンツを `desc` に反映
- 最終的にSupabaseからDocker自前ホスト環境へ移行予定（詳細は `docs/server-migration-spec.md`）
- AI課題生成機能は移行時に省く可能性あり（外部API依存排除のため）

## 言語

ユーザーとのやり取りは日本語で行うこと。
