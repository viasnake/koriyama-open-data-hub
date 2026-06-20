# RSS API

郡山市公式サイト RSS の記事情報を JSON で取得できます。防災、子育て、生活、イベント、市政情報などの更新情報を、アプリケーションや一覧画面で扱いやすい形式で返します。

## 取得対象

この API では、市民向けポータルで扱いやすい次の RSS を取得対象にしています。

- 全体 RSS: `/rss/10/list*.xml`
- 生活分類 RSS: `/rss/10/life*.xml`
- 特設サイト RSS: `/rss/10/site-*.xml`

組織別 RSS `/rss/10/soshiki-*.xml` は対象外です。担当課単位の更新をすべて網羅する API ではありません。

## RSS feed 一覧

取得対象の RSS feed は `/api/v2/rss/feeds` で確認できます。

```bash
curl "https://civic-koriyama-data.alflag.org/api/v2/rss/feeds"
```

カテゴリで絞り込む場合は `kind` を指定します。

```bash
curl "https://civic-koriyama-data.alflag.org/api/v2/rss/feeds?kind=life"
```

## 記事一覧

RSS 記事は `/api/v2/rss/entries` で取得できます。

```bash
curl "https://civic-koriyama-data.alflag.org/api/v2/rss/entries?limit=10"
```

カテゴリ、feed、公開日時、キーワードで絞り込めます。

```bash
curl "https://civic-koriyama-data.alflag.org/api/v2/rss/entries?category=event&limit=20"
curl "https://civic-koriyama-data.alflag.org/api/v2/rss/entries?q=子育て"
```

主なレスポンス項目は次の通りです。

| フィールド | 説明 |
| --- | --- |
| `id` | RSS 記事 ID |
| `title` | 記事タイトル |
| `url` | 記事 URL |
| `summary` | 概要。取得できない場合は `null` |
| `category` | API 側で分類したカテゴリ |
| `published_at` | 公開日時。RSS にない場合は `null` |
| `feed` | 取得元 feed の情報 |

詳しい query とレスポンス形式は {doc}`api` を参照してください。
