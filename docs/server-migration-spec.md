# EduTracker 客先サーバー移行仕様書

## 1. 概要

EduTracker（新人IT教育管理アプリ）を Supabase（クラウド）から客先オンプレミスサーバーへ移行する。
AI課題生成機能は省き、外部API通信を完全に排除したクローズド環境で運用する。

---

## 2. 現在の構成 vs 移行後の構成

### 現在（Supabase構成）

```
┌──────────────┐          ┌─────────────────────────────────┐
│              │          │         Supabase Cloud           │
│   ブラウザ    │─────────▶│                                 │
│              │          │  ┌───────────┐  ┌────────────┐  │
│  GitHub      │          │  │ PostgREST │  │    Auth     │  │
│  Pages配信   │          │  │ (API自動)  │  │ (認証管理)  │  │
│              │          │  └─────┬─────┘  └──────┬─────┘  │
│              │          │        │               │        │
│              │          │  ┌─────▼───────────────▼─────┐  │
│              │          │  │      PostgreSQL DB         │  │
│              │          │  └───────────────────────────┘  │
│              │          │  ┌───────────────────────────┐  │
│              │          │  │    Storage (画像保存)       │  │
│              │          │  └───────────────────────────┘  │
│              │          │                                 │
└──────────────┘          └─────────────────────────────────┘

※ 外部通信: Supabase Cloud + Anthropic API (AI課題生成)
```

### 移行後（客先サーバー構成）

```
┌──────────────┐          ┌─────────────────────────────────┐
│              │          │        客先サーバー (Docker)      │
│   ブラウザ    │─────────▶│                                 │
│              │          │  ┌───────────────────────────┐  │
│  社内NWから   │  :80/443 │  │       Nginx               │  │
│  アクセス     │─────────▶│  │  ・静的ファイル配信 (dist/) │  │
│              │          │  │  ・リバースプロキシ → API   │  │
│              │          │  │  ・画像ファイル配信          │  │
│              │          │  └──────────┬────────────────┘  │
│              │          │             │ /api/*             │
│              │          │  ┌──────────▼────────────────┐  │
│              │          │  │   Node.js API Server      │  │
│              │          │  │  ・REST API (CRUD)         │  │
│              │          │  │  ・JWT認証                  │  │
│              │          │  │  ・画像アップロード          │  │
│              │          │  └──────────┬────────────────┘  │
│              │          │             │ :5432              │
│              │          │  ┌──────────▼────────────────┐  │
│              │          │  │     PostgreSQL             │  │
│              │          │  │  ・ユーザー管理             │  │
│              │          │  │  ・進捗・コメント・編集     │  │
│              │          │  └───────────────────────────┘  │
│              │          │                                 │
│              │          │  ┌───────────────────────────┐  │
│              │          │  │  Volume (画像ファイル保存)   │  │
│              │          │  └───────────────────────────┘  │
│              │          │                                 │
└──────────────┘          └─────────────────────────────────┘

※ 外部通信: なし（完全クローズド）
```

---

## 3. Docker構成

### docker-compose.yml の構成

```
edutracker/
├── docker-compose.yml
├── nginx/
│   ├── nginx.conf          ← Nginx設定
│   └── dist/               ← ビルド済みフロントエンド
├── api/
│   ├── Dockerfile          ← APIサーバー用
│   ├── package.json
│   ├── server.js           ← メインエントリ
│   ├── routes/             ← APIルート
│   │   ├── auth.js
│   │   ├── profiles.js
│   │   ├── progress.js
│   │   ├── comments.js
│   │   ├── taskEdits.js
│   │   └── upload.js
│   └── middleware/
│       └── auth.js         ← JWT検証ミドルウェア
├── db/
│   └── schema.sql          ← 初期スキーマ
└── uploads/                ← 画像保存ディレクトリ
```

### コンテナ構成図

```
docker-compose.yml
│
├─ nginx        (port 80 公開)
│   └─ dist/ をマウント → 静的ファイル配信
│   └─ /api/* → api:3000 にプロキシ
│   └─ /uploads/* → uploads/ を配信
│
├─ api          (port 3000 内部)
│   └─ Node.js + Express
│   └─ uploads/ をマウント → 画像保存
│   └─ db:5432 に接続
│
└─ db           (port 5432 内部)
    └─ PostgreSQL 14
    └─ schema.sql で初期化
    └─ pgdata ボリュームで永続化
```

### 起動コマンド

```bash
# 初回起動（ビルド + 起動）
docker-compose up -d --build

# 停止
docker-compose down

# ログ確認
docker-compose logs -f api

# DB初期化（schema.sqlが自動実行される）
# → db/schema.sql を /docker-entrypoint-initdb.d/ にマウント
```

---

## 4. データベース設計

### テーブル一覧

```
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL                            │
│                                                         │
│  ┌──────────┐    ┌───────────────┐    ┌──────────────┐  │
│  │ profiles │◄───│ task_progress │    │  task_edits  │  │
│  │          │    │               │    │              │  │
│  │ id (PK)  │    │ user_id (FK)  │    │ step_id      │  │
│  │ name     │    │ step_id       │    │ task_id      │  │
│  │ role     │    │ task_id       │    │ title        │  │
│  │ joined_at│    │ completed_at  │    │ description  │  │
│  └──────┬───┘    └───────────────┘    │ criteria     │  │
│         │                             │ criteria_img │  │
│         │        ┌───────────────┐    │ links (JSON) │  │
│         └───────▶│ task_comments │    └──────────────┘  │
│                  │               │                      │
│                  │ user_id (FK)  │                      │
│                  │ step_id       │                      │
│                  │ task_id       │                      │
│                  │ text          │                      │
│                  │ created_at    │                      │
│                  └───────────────┘                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### データ量予測

| テーブル | 想定レコード数 | 増加ペース |
|----------|--------------|-----------|
| profiles | ~30件 | 年数回 |
| task_progress | ~500件 | ユーザー×タスク |
| task_comments | ~200件 | 週数件 |
| task_edits | ~20件 | 管理者が編集時 |

---

## 5. 認証フロー

### ログイン

```
ブラウザ                    APIサーバー                  DB
  │                           │                        │
  │  POST /api/auth/login     │                        │
  │  { userId, password }     │                        │
  │──────────────────────────▶│                        │
  │                           │  SELECT * FROM         │
  │                           │  profiles WHERE ...    │
  │                           │───────────────────────▶│
  │                           │◀───────────────────────│
  │                           │                        │
  │                           │  パスワード検証          │
  │                           │  (bcrypt.compare)      │
  │                           │                        │
  │  { token: "JWT..." }      │                        │
  │◀──────────────────────────│                        │
  │                           │                        │
  │  以降のリクエストは         │                        │
  │  Authorization: Bearer JWT │                        │
  │──────────────────────────▶│  JWT検証 → user取得     │
  │                           │───────────────────────▶│
```

### サインアップ

```
ブラウザ                    APIサーバー                  DB
  │                           │                        │
  │  POST /api/auth/signup    │                        │
  │  { userId, password,      │                        │
  │    name }                 │                        │
  │──────────────────────────▶│                        │
  │                           │  パスワードハッシュ化     │
  │                           │  (bcrypt.hash)         │
  │                           │                        │
  │                           │  INSERT INTO users     │
  │                           │───────────────────────▶│
  │                           │                        │
  │                           │  INSERT INTO profiles  │
  │                           │  (最初のユーザー→admin) │
  │                           │───────────────────────▶│
  │                           │                        │
  │  { message: "作成完了" }   │                        │
  │◀──────────────────────────│                        │
```

### 認証で追加が必要なテーブル

```sql
-- Supabaseの auth.users の代わり
CREATE TABLE users (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  login_id   TEXT UNIQUE NOT NULL,      -- ログインID
  password   TEXT NOT NULL,              -- bcryptハッシュ
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. API設計

### エンドポイント一覧

```
認証 ─────────────────────────────────────────────
POST   /api/auth/signup          アカウント作成
POST   /api/auth/login           ログイン → JWT返却

プロフィール ──────────────────────────────────────
GET    /api/profiles             全ユーザー取得
GET    /api/profiles/:id         特定ユーザー取得
PUT    /api/profiles/:id         プロフィール更新 [本人のみ]

進捗管理 ──────────────────────────────────────────
GET    /api/progress/:userId     ユーザーの進捗取得
POST   /api/progress             完了チェック追加 [本人のみ]
DELETE /api/progress             完了チェック解除 [本人のみ]

コメント ──────────────────────────────────────────
GET    /api/comments?stepId=&taskId=   コメント取得
POST   /api/comments             コメント投稿 [認証済み]

タスク編集 ────────────────────────────────────────
GET    /api/task-edits           全編集データ取得
POST   /api/task-edits           タスク追加/更新 [admin]
DELETE /api/task-edits/:stepId/:taskId  タスク削除 [admin]

画像 ──────────────────────────────────────────────
POST   /api/upload               画像アップロード [認証済み]
```

### リクエスト/レスポンス例

```
POST /api/auth/login
─────────────────────────────────────
Request:
  { "userId": "yamada", "password": "123456" }

Response (200):
  { "token": "eyJhbG...", "user": { "id": "uuid", "name": "山田", "role": "trainee" } }

Response (401):
  { "error": "IDまたはパスワードが間違っています" }
```

```
GET /api/progress/uuid-xxxx
─────────────────────────────────────
Response (200):
  [
    { "step_id": "step0", "task_id": 1, "completed_at": "2026-05-10" },
    { "step_id": "step0", "task_id": 2, "completed_at": "2026-05-12" }
  ]
```

```
POST /api/upload
─────────────────────────────────────
Request: multipart/form-data (file)

Response (200):
  { "url": "/uploads/criteria/1234567_abc.png" }
```

---

## 7. フロントエンド変更箇所

### 変更が必要なファイル

```
src/
├── lib/
│   ├── supabase.js   ← 削除
│   ├── db.js         ← 全面書き換え（fetch API に変更）
│   └── api.js        ← 新規（API通信ヘルパー）
├── LoginScreen.jsx   ← auth呼び出しを /api/auth/* に変更
├── App.jsx           ← セッション管理をJWT方式に変更
└── aigenerate.jsx    ← 削除（AI課題生成機能）
```

### 変更イメージ

```javascript
// ─── 現在 (Supabase) ───────────────────────
import { supabase } from './supabase'

// ログイン
await supabase.auth.signInWithPassword({ email, password })

// データ取得
await supabase.from('task_progress').select('*')

// ─── 移行後 (自前API) ──────────────────────
import { api } from './api'

// ログイン
await api.post('/auth/login', { userId, password })

// データ取得
await api.get(`/progress/${userId}`)
```

---

## 8. 削除する機能

| 機能 | ファイル | 理由 |
|------|---------|------|
| AI課題生成 | `src/aigenerate.jsx` | 外部API通信が必要 |
| Supabaseクライアント | `src/lib/supabase.js` | 自前APIに置き換え |
| サイドバーの「AI課題生成」 | `src/screens.jsx` | 機能削除に伴い |

---

## 9. 必要なサーバースペック

| 項目 | 最低要件 | 推奨 |
|------|---------|------|
| CPU | 1コア | 2コア |
| メモリ | 1GB | 2GB |
| ストレージ | 10GB | 20GB |
| OS | Linux (Docker対応) | Ubuntu 22.04 LTS |
| Docker | v20+ | 最新安定版 |
| Docker Compose | v2+ | 最新安定版 |
| ネットワーク | 社内LAN接続 | - |
| 外部通信 | 不要 | - |

### ストレージ内訳

```
フロントエンド (dist/)     :    ~1 MB
Docker イメージ            :  ~500 MB (Node.js + Nginx + PostgreSQL)
PostgreSQL データ          :  ~100 MB (十分すぎる)
画像ファイル               : ~1-5 GB (利用状況次第)
ログ                      :  ~500 MB
────────────────────────────────────
合計                      :  ~3-7 GB
```

---

## 10. 移行作業チェックリスト

```
□ 1. 客先環境の確認
    □ Docker / Docker Compose が利用可能か
    □ ポート80 (HTTP) が使用可能か
    □ サーバーOSの確認

□ 2. バックエンド構築
    □ docker-compose.yml 作成
    □ Node.js APIサーバー実装
       □ 認証 (signup / login / JWT)
       □ プロフィール API
       □ 進捗管理 API
       □ コメント API
       □ タスク編集 API
       □ 画像アップロード API
    □ PostgreSQL スキーマ (users テーブル追加)
    □ Nginx設定

□ 3. フロントエンド改修
    □ Supabase依存を除去
    □ API通信ヘルパー作成
    □ db.js を自前API呼び出しに書き換え
    □ LoginScreen.jsx の認証処理変更
    □ App.jsx のセッション管理変更
    □ AI課題生成機能の削除
    □ ビルド・動作確認

□ 4. テスト
    □ ローカルDocker環境で全機能テスト
    □ ユーザー登録 → ログイン → 進捗管理 の一連フロー
    □ 画像アップロード
    □ 管理者機能（タスク編集）

□ 5. デプロイ
    □ 客先サーバーにDockerインストール
    □ ファイル一式を配置
    □ docker-compose up -d
    □ 初期管理者アカウント作成
    □ 動作確認
```

---

## 11. 補足：Supabaseを使い続ける場合との比較

| 項目 | Supabase継続 | 客先サーバー移行 |
|------|-------------|----------------|
| 外部通信 | 必要（*.supabase.co） | 不要 |
| 初期構築 | なし（既に稼働中） | Docker構成 + API構築 |
| 運用コスト | Supabase月額料金 | サーバー電気代のみ |
| データ所在 | クラウド（海外） | 客先社内 |
| セキュリティ | Supabase依存 | 自社管理 |
| 障害対応 | Supabase側 | 自社対応 |
| バックアップ | Supabase自動 | 自前で設定 |
