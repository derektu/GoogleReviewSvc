# GoogleReviewSvc 使用說明

- 請參考[https://developers.google.com/android-publisher/getting_started](https://developers.google.com/android-publisher/getting_started), 設定一個service account, 取得這個service account的private key資料(client_secret.json)
- 啟動server
```
    $ node app.js --secret='path to your secret file' --port='port to listen'
```
- 查詢某個package最近一週review (json raw data)
```
    http://<your host:port>/reviews/<android package name> : 取得raw資料
```
- 查詢某個package最近一週review (ATOM feed)
```
    http://<your host:port>/reviews/rss/<android package name> : 取得ATOM feed
```
