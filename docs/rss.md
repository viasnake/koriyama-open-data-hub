# RSS 取得と監査

郡山市公式サイトの RSS は、固定 seed と discovery の両方で管理します。seed は取得候補の初期値であり、実際に取得対象として扱う truth は `HTTP 200` かつ RSS/XML として parse できた feed です。

## 取得対象

取得対象は、市民向けポータルで扱いやすい次の RSS に限定します。

- 全体 RSS: `/rss/10/list*.xml`
- 生活分類 RSS: `/rss/10/life*.xml`
- 特設サイト RSS: `/rss/10/site-*.xml`

組織別 RSS `/rss/10/soshiki-*.xml` は対象外です。担当課単位の更新は通常表示ではノイズが多く、組織ページ URL から RSS URL を規則的に推定できないため、seed にも discovery の有効対象にも含めません。

## Seed 管理

固定 seed は `src/sources/rss.ts` の `KORIYAMA_RSS_FEEDS` で管理します。RSS URL を番号規則から生成せず、確認済みの `path` を明示的に追加してください。

seed を追加・変更したら、次の順で確認します。

```bash
npm run rss:verify
npm run rss:discover
npm run rss:audit
```

厳密に失敗扱いにしたい場合は `-- --strict` を付けます。

```bash
npm run rss:audit -- --strict
```

通常の `rss:audit` は warning-only です。`dead_seed_feeds`、`parse_error_seed_feeds`、`missing_from_seed` があっても終了コードは 0 のままにし、CI が公式サイトの一時的な不調で頻繁に落ちないようにしています。

## 生存確認

`rss:verify` は seed の全 RSS を最後まで検証し、`generated/rss-feeds.json` を出力します。

OK 判定の条件は次の通りです。

- URL を絶対 URL として解決できる
- HTTP GET が成功する
- HTTP status が `200`
- XML parse に成功する
- RSS、RSS 1.0/RDF、Atom のいずれかとして読める
- `channel.title` または `feed.title` を取得できる

記事数が 0 件でも、feed として正常に parse できれば OK です。

## Discovery

`rss:discover` は次の URL から巡回を始めます。

- `https://www.city.koriyama.lg.jp/`
- `https://www.city.koriyama.lg.jp/rss/`
- `https://www.city.koriyama.lg.jp/life/`

巡回対象は `/`、`/rss/`、`/life/`、`/life/*`、`/site/*` です。`/soshiki/*`、`/form/*`、`/map/*`、外部ドメインは除外します。

HTML の `a[href]`、`link[type="application/rss+xml"]`、`link[type="application/atom+xml"]` から、`/rss/10/list*.xml`、`/rss/10/life*.xml`、`/rss/10/site-*.xml` だけを抽出します。`soshiki-*` は明示的に除外します。

## Audit レポート

`rss:audit` は `verify + discover + compare` をまとめて実行し、`generated/rss-discovery-report.json` を出力します。

主な確認項目は次の通りです。

- `missing_from_seed`: discovery では見つかったが seed にない RSS
- `seed_not_discovered`: seed にはあるが discovery では見つからなかった RSS
- `dead_seed_feeds`: seed にあるが HTTP 200 ではない RSS
- `parse_error_seed_feeds`: seed にあるが RSS/XML として parse できない RSS
- `ok_feeds`: 取得対象として有効な RSS

`missing_from_seed` が出た場合は、公式サイトで対象 RSS かどうかを確認します。全体 RSS、生活分類 RSS、特設サイト RSS なら `KORIYAMA_RSS_FEEDS` に追加し、組織別 RSS や対象外ページなら除外対象として扱います。

## 定期実行

Cloudflare Cron は毎時起動します。

- `rss:fetch` 相当の取得処理: 毎時
- `rss:audit` 相当の監査処理: 1 日 1 回、UTC 19 時

Worker の取得処理は、D1 の `rss_feeds` で `enabled = true` かつ `verification_status = ok` の feed だけを取得します。初回など検証済み feed がない場合は seed を検証し、生存確認できた feed だけを有効化します。

## API

運用確認用に次の API を提供します。

- `GET /api/v2/rss/feeds`
- `GET /api/v2/rss/audit`
- `GET /api/v2/rss/entries`

`/api/v2/rss/feeds` は既定で有効かつ検証 OK の feed だけを返します。未検証や無効 feed を確認する場合は `include_unverified=true` や `include_disabled=true` を指定します。
