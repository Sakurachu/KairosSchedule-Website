# Kairos 日程 · 官方网站

Kairos Schedule 的介绍与下载站点（纯静态，无构建步骤），部署在 Vercel。

- 线上地址：https://kairos-schedule-website.vercel.app（国内直连会被 DNS 污染，绑定自定义域名后可正常访问）
- Vercel 项目：`kairos-schedule-website`（本目录已通过 `vercel link` 关联）
- 网页版（应用本体）：https://ks.chzih.com
- Windows 大文件存放：Vercel Blob 存储 `kairos-downloads`（store_bCYbJThQaJ2lGXOB）

## 目录结构

```
index.html      单页官网（介绍 / 功能 / 多端 / 下载 / FAQ）
styles.css      全部样式，含浅色与深色主题
script.js       主题切换、手机导航、平台推荐标记、复制校验和
assets/         图标、favicon、og 分享图
downloads/      Android APK（随站点一起发布）
robots.txt      搜索引擎抓取规则
sitemap.xml     官网站点地图
.vercelignore   部署排除规则，防止本地密钥和项目元数据被上传
vercel.json     CSP、权限策略等安全响应头与缓存策略
```

## 版本更新流程

1. **Android**：把新 APK 放入 `downloads/`（建议保留版本号命名），更新 `index.html`
   下载卡片中的版本号、大小、日期、SHA-256（`sha256sum xxx.apk` 可生成），然后重新部署。
2. **Windows**：桌面包体积超过 Vercel 100MB 静态文件上限，存放在 Vercel Blob
   （存储 `kairos-downloads`，已连接到本项目）：

   ```sh
   # 在本目录执行（.env.local 中已有 BLOB_READ_WRITE_TOKEN）
   vercel blob put "D:\path\to\KairosSchedule-Setup-x.y.z.exe" --pathname desktop/KairosSchedule-Setup-x.y.z.exe
   # 然后更新 index.html 中的下载链接与校验和
   ```

   旧版本文件可用 `vercel blob list` / `vercel blob del` 管理。
   注意 `.env.local` 含 Blob 令牌，不要提交或外传。

## 部署

```sh
vercel --prod
```

## 自定义域名（阿里云解析）

1. 在 Vercel 项目 Settings → Domains 中添加域名（例如 `kairos.chzih.com`）；
   命令行方式：`vercel domains add chzih.com` 后 `vercel alias set kairos-schedule-website.vercel.app kairos.chzih.com`
2. 在阿里云控制台 → 云解析 DNS → chzih.com 添加记录：
   - 记录类型：CNAME
   - 主机记录：`kairos`（与第 1 步的子域名对应）
   - 记录值：`cname.vercel-dns.com`
   - TTL：默认
3. 生效后 Vercel 会自动签发证书。注意 `*.vercel.app` 默认域名在国内被
   DNS 污染 + SNI 阻断，属网络环境问题，与部署无关。

## 其他

- `index.html` 中的 `og:image` 当前使用 Vercel 绝对地址；绑定正式域名后应同步替换，
  避免分享封面继续依赖 `vercel.app` 域名。
- `index.html` 的 canonical / `og:url` 以及 `robots.txt`、`sitemap.xml` 也使用当前
  Vercel 地址；绑定正式域名时应一并替换。
