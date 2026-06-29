# Nucleus Docs (front-project)

サイドバーでページを切り替えながら、タイトル・本文をインライン編集できるドキュメント管理 SPA です。
ページの一覧表示・作成・編集・削除（CRUD）を行い、未保存の変更がある状態での画面遷移を確認モーダルで保護します。

- **フレームワーク**: React 19 + TypeScript（React Compiler 有効）
- **ビルド/開発**: Vite 8
- **サーバー状態管理**: TanStack Query (React Query) v5
- **エラーハンドリング**: react-error-boundary
- **バリデーション**: Zod v4
- **スタイリング**: Tailwind CSS v4
- **テスト**: Vitest + Testing Library
- **パッケージマネージャ**: pnpm

---

## 1. 実行環境構築に必要な文書

### 1-1. 前提ソフトウェア

| ツール | バージョン | 備考 |
| --- | --- | --- |
| Node.js | 24.11.1 | `package.json` の依存（Vite 8 / TS 6）に合わせた新しめのランタイムが必要 |
| pnpm | 11.6.0 | `pnpm-lock.yaml` を採用。npm / yarn では未検証 |

バージョンは `mise.toml`（Node / pnpm）と `package.json` の `engines` / `packageManager` で固定しています。

#### mise を使う場合（推奨）

[mise](https://mise.jdx.dev/) を導入済みなら、プロジェクトルートで以下を実行するだけで `mise.toml` に記載のバージョンが揃います。

```bash
mise install
```

#### mise を使わない場合

Node 24 系を手動で用意し、pnpm は Corepack で有効化できます。

```bash
corepack enable
corepack prepare pnpm@11.6.0 --activate
```

### 1-2. 依存パッケージのインストール

```bash
pnpm install
```

インストール時に `prepare` スクリプトで Husky（Git フック）がセットアップされます。

### 1-3. 環境変数の設定

API のベース URL を環境変数で渡します。ハードコードは禁止で、`src/apis/client.ts` が `VITE_API_BASE_URL` を参照します。
実際の値を持つ `.env.local` は `.gitignore`（`*.local`）で除外されるため、コミット済みの `.env.example` をコピーして作成してください。

```bash
cp .env.example .env.local
```

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000
```

### 1-4. バックエンド API

本リポジトリはフロントエンドのみです。`VITE_API_BASE_URL` で指定した先に、以下の REST エンドポイントを提供する API サーバーが別途必要です。

| メソッド | パス | 用途 |
| --- | --- | --- |
| `GET` | `/content` | ページ一覧の取得 |
| `GET` | `/content/:id` | 単一ページの取得 |
| `POST` | `/content` | ページ作成 |
| `PUT` | `/content/:id` | ページ更新 |
| `DELETE` | `/content/:id` | ページ削除 |

レスポンスのデータ構造（`src/apis/content.ts`）:

```ts
type Content = {
  id: string;
  title: string;
  body: string;
};
```

### 1-5. 開発サーバーの起動

```bash
pnpm dev
```

Vite が起動し、表示された URL（デフォルト `http://localhost:5173`）でアクセスできます。

### 1-6. 主要コマンド一覧

| コマンド | 内容 |
| --- | --- |
| `pnpm dev` | 開発サーバー起動（HMR 有効） |
| `pnpm build` | 型チェック（`tsc -b`）＋本番ビルド |
| `pnpm preview` | ビルド成果物のローカルプレビュー |
| `pnpm lint` | ESLint 実行 |
| `pnpm format` | Prettier で整形 |
| `pnpm format:check` | 整形チェック（変更なし確認） |
| `pnpm test` | Vitest（ウォッチモード） |
| `pnpm test:run` | Vitest を 1 回実行 |
| `pnpm test:ui` | Vitest UI |
| `pnpm coverage` | カバレッジ計測 |

---

## 2. 設計・実装のために作成した中間文書

### 2-1. ディレクトリ構成

```
src/
├── apis/                  API クライアント層
│   ├── client.ts          fetch ラッパー（共通ヘッダ・エラー処理・204対応）
│   └── content.ts         /content エンドポイント定義と型
├── components/
│   ├── content/           記事編集系
│   │   ├── ArticlePanel.tsx   タイトル/本文の編集パネル
│   │   ├── ContentDetail.tsx  詳細取得・独自ErrorBoundary/Suspense を持つラッパー
│   │   ├── EditableTitle.tsx
│   │   └── EditableBody.tsx
│   ├── layout/            レイアウト
│   │   ├── Sidebar.tsx        ページ一覧・編集モード・追加/削除ボタン
│   │   ├── MainContent.tsx    コンテンツ表示・空状態
│   │   ├── ErrorFallback.tsx  全画面エラー表示（再試行ボタン付き）
│   │   └── Footer.tsx
│   └── ui/                汎用UI
│       ├── Button.tsx / Icon.tsx / Input.tsx / TextArea.tsx
│       ├── Spinner.tsx        ローディングスピナー
│       ├── Modal.tsx          createPortal によるモーダル土台
│       ├── Toast.tsx          トースト表示リスト
│       └── ConfirmDialog.tsx  確認ダイアログ（モーダル中身として使用）
├── hooks/                 ロジック層（カスタムフック）
│   ├── useContent.ts          React Query による CRUD フック群（useSuspenseQuery）
│   ├── usePageNavigation.ts   ページ選択・編集状態・遷移ガードの統括
│   ├── useArticleEditor.ts    タイトル/本文の編集状態・差分(isDirty)管理
│   ├── useUnsavedGuard.tsx    未保存ガード（isDirtyRef を受け取り確認モーダルを表示）
│   ├── useDeleteConfirm.tsx   削除確認モーダルの表示ロジック
│   ├── useSidebarState.ts     サイドバー開閉状態の管理
│   ├── useModal.ts            ModalContext を参照する consumer フック
│   └── useToast.ts            ToastContext を参照する consumer フック
├── providers/             グローバル状態の Provider
│   ├── modalContext.ts        Context 定義のみ（型・createContext）
│   ├── ModalProvider.tsx      Provider 実体（モーダル描画）
│   ├── toastContext.ts        Context 定義のみ
│   └── ToastProvider.tsx      Provider 実体（トースト描画）
├── types/
│   └── content.ts         共有型定義（Content / ContentInput / ContentFormErrors）
├── schemas/               バリデーションスキーマ
│   ├── content.ts             Zod スキーマ（タイトル・本文の制約定義）
│   └── content.test.ts        バリデーションの境界値テスト
├── lib/
│   ├── utils.ts           cn()（clsx + tailwind-merge）
│   └── messages.ts        トーストメッセージ定数・エラー文字列生成ユーティリティ
├── App.tsx                画面全体の組み立て・ハンドラ定義
└── main.tsx               エントリ。Provider のネスト構成
```

### 2-2. レイヤー設計の方針

- **API 層 / ロジック層 / 表示層を分離**。コンポーネントは表示に専念し、データ取得・更新は `hooks/` に集約する。
- **サーバー状態は React Query で一元管理**。`useContent.ts` がクエリキー `["content"]` を単一の信頼できる情報源とし、変更系（作成・更新・削除）の成功時に `invalidateQueries` でキャッシュを無効化して再取得する。
- **クライアント状態（編集中フラグ・選択中ページ等）はカスタムフックに閉じ込める**。`usePageNavigation` と `useArticleEditor` が責務を分担する。

### 2-3. グローバル UI（モーダル / トースト）の設計

モーダルとトーストはアプリのどこからでも呼び出せるよう Context で全体管理する。
React Fast Refresh の制約（`react-refresh/only-export-components`：同一ファイルでコンポーネントと非コンポーネントを混在 export しない）を満たすため、**3 ファイルに分割**している。

| ファイル | 役割 |
| --- | --- |
| `providers/modalContext.ts` | `createContext` と型定義のみ |
| `providers/ModalProvider.tsx` | Provider 本体。状態を持ち、実際の `<Modal>` を描画 |
| `hooks/useModal.ts` | `useContext` で値を取り出す consumer フック（Provider 外利用時は例外） |

トーストも同じ `*Context.ts` / `*Provider.tsx` / `use*.ts` の 3 分割パターンを踏襲。
`main.tsx` で `QueryClientProvider > ModalProvider > ToastProvider > App` の順にネストしている。

利用例:

```tsx
const { open, close } = useModal();
const { toast } = useToast();

open({ title: "確認", content: <ConfirmDialog ... /> });
toast({ message: "更新に失敗しました: Network Error", type: "error" });
```

### 2-4. 編集フローと未保存ガード

編集体験の中核となる仕様。

- `useArticleEditor` がタイトル・本文の下書き（draft）を保持し、保存元の値との差分から `isDirty` を算出する。
- **別ページへの遷移／サイドバー編集モード切替／タイトル↔本文の編集切替**のいずれでも、`isDirty` が真なら確認モーダルを表示する。
  - 「保存しないで続ける」→ 変更を破棄して遷移
  - 「キャンセル」→ 編集を継続
- 遷移可否の判断は `usePageNavigation` に渡す `onBeforeLeaveEdit(proceed)` と、`useArticleEditor` の `onBeforeSwitchField(proceed)` に集約。実際の遷移処理を `proceed` コールバックとして受け渡すことで、ガードロジックと遷移処理を疎結合に保つ。
- 編集中フラグは `isDirtyRef`（`RefObject<boolean>`）で親（`App.tsx`）へ伝搬し、レンダリングを増やさずに最新の dirty 状態を参照できるようにしている。

### 2-5. エラーハンドリング設計

#### データ取得エラー（2段階 ErrorBoundary）

`useContentList` / `useContent` は `useSuspenseQuery` を採用しており、ローディング状態は `<Suspense>` フォールバック（スピナー）が、エラー状態は `<ErrorBoundary>` が担う。コンポーネント内に `isLoading` / `isError` のガードを書かず、表示ロジックに集中できる。

| 境界 | 対象 | フォールバック |
| --- | --- | --- |
| 外側（`App`）| コンテンツ一覧取得失敗 | 全画面 `ErrorFallback`（再試行ボタン） |
| 内側（`ContentDetail`）| 単一コンテンツ取得失敗 | コンテンツエリア内のインラインエラー表示 |

再試行ボタンを押すと `resetErrorBoundary()` でバウンダリをリセットし、即座にトーストで「更新しました」を通知する。

#### ミューテーションエラー（トースト通知）

作成・更新の失敗は画面遷移を伴わないため、`useMutation` の `onError` コールバックからトーストを表示する。エラーメッセージは `src/lib/messages.ts` に定数として集約し、散在を防いでいる。

```ts
// src/lib/messages.ts
export const MESSAGES = {
  retry: "更新しました",
  createError: (detail: string) => `新規作成に失敗しました: ${detail}`,
  updateError: (detail: string) => `更新に失敗しました: ${detail}`,
} as const;
```

### 2-6. ページ作成・削除と空状態

- **新規作成**: `POST /content` 成功後、返却された `id` へ自動遷移（`App.tsx` の `handleAdd` 内 `onSuccess` で `handleSelect(data.id)` を実行）。
- **削除**: 確認モーダルで承認後に `DELETE`。
- **空状態**: ページが 0 件でもレイアウトは維持し、コンテンツ領域に「ページがありません」と作成ボタンを表示する。

---

## 3. その他の説明文書

### 3-1. コード品質・自動化

- **TypeScript strict** に加え `noUncheckedIndexedAccess` / `noUnusedLocals` / `noUnusedParameters` 等を有効化（`tsconfig.app.json`）。
- **ESLint**（`eslint.config.js`）: JS 推奨 + typescript-eslint + react-hooks + react-refresh。
- **Prettier**（`.prettierrc`）: セミコロンあり・ダブルクォート・末尾カンマ all・印字幅 80。
- **Husky + lint-staged**: コミット時に `pre-commit` フックで `lint-staged` を実行し、ステージされた `*.{ts,tsx}` に Prettier + ESLint --fix、`*.css` に Prettier を自動適用。

### 3-2. ビルド設定の補足

- **React Compiler** を Babel プラグイン経由で有効化（`vite.config.ts`）。自動メモ化により手動の `useMemo`/`useCallback` を最小化できる。開発・ビルドのパフォーマンスには影響する点に留意。
- **Tailwind CSS v4** は `@tailwindcss/vite` プラグインで統合。テーマ変数は `src/index.css` の `@theme inline` と CSS 変数で定義。
- **フォント**は `@fontsource-variable/noto-sans-jp`（Fontsource）を採用。`src/main.tsx` でインポートし、Vite がビルド時にバンドルへ含める。`src/index.css` のフォントファミリーは `"Noto Sans JP Variable"` を指定。

#### Fontsource（ローカルバンドル）を選んだ理由

当初は Google Fonts CDN から `Noto Sans JP` を読み込む構成だった。以下のトレードオフを比較し Fontsource の Variable Font 版に切り替えた。

| 観点 | Google Fonts CDN | Fontsource（採用） |
| --- | --- | --- |
| 外部通信 | DNS / TCP / TLS ラウンドトリップが発生 | なし（ローカルバンドル） |
| オフライン動作 | 不可 | 可 |
| プライバシー | リクエストが Google に送られる | なし |
| ブラウザキャッシュ共有 | 他サイトと共有できた（旧来の利点） | なし（現代ブラウザはパーティションキャッシュのため実質差なし） |
| フォントの重さ | 動的サブセット（Google 側で最適化） | CSS `unicode-range` でブラウザが必要ブロックのみ取得 |
| バンドルサイズ | 増えない | 増えるが unicode-range により初回ロード量は抑制される |
| Variable Font | 非対応（weight ごとに別ファイル） | 対応（1 ファイルで全 weight をカバー） |

Noto Sans JP は CJK グリフを含むため全量は大きいが、Variable Font + unicode-range の組み合わせにより実際にダウンロードされる量は限定的。外部 CDN への依存をなくしオフライン環境やイントラネットでも動作させる利点が上回ると判断した。

### 3-3. テスト

- Vitest を `jsdom` 環境で実行（`vite.config.ts` の `test` 設定）。
- グローバル API 有効（`globals: true`）、セットアップは `src/test/setup.ts`。
- カバレッジは v8 プロバイダ。`src/main.tsx` と型定義ファイルは計測対象外。

#### テスト一覧

| ファイル | 内容 |
| --- | --- |
| `schemas/content.test.ts` | バリデーション境界値テスト（タイトル 1・50・51文字、本文 9・10・2000・2001文字、空白 trim 等） |
| `hooks/useArticleEditor.test.ts` | 編集ロジックのユニットテスト（下表参照） |
| `components/ui/Input.test.tsx` | Input コンポーネントの描画・イベントテスト |
| `components/ui/TextArea.test.tsx` | TextArea コンポーネントの描画・イベントテスト |

**`useArticleEditor` テスト詳細**

| グループ | テストケース |
| --- | --- |
| `save()` | バリデーション通過時に `onSave` が呼ばれ `editingField` がクリアされる |
| `save()` | タイトルが空のとき `onSave` が呼ばれずエラーがセットされる |
| `save()` | 空白のみのタイトルでも `onSave` が呼ばれずエラーがセットされる（trim 検証） |
| `save()` | 本文が 9 文字のとき `onSave` が呼ばれずエラーがセットされる |
| `cancel()` | draft・エラー・`editingField` がすべて初期値にリセットされる |
| `isDirty` | 初期値から変更がないとき `false` |
| `isDirty` | タイトルを変更したとき `true` |
| `isDirty` | 変更後に `cancel()` すると `false` に戻る |
| `startEdit()` | dirty な状態で別フィールドへ切り替えると `onBeforeSwitchField` が呼ばれる |
| `startEdit()` | dirty でない状態で別フィールドへ切り替えても `onBeforeSwitchField` が呼ばれない |
