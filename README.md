# Kairos 日程 · 官方网站

Kairos Schedule 的介绍与下载站点（纯静态，无构建步骤），部署在 Vercel。

- 官网地址：https://kschedule.chzih.com
- Vercel 默认地址：https://kairos-schedule-website.vercel.app
- GitHub 仓库：https://github.com/Sakurachu/KairosSchedule-Website
- Vercel 项目：`kairos-schedule-website`（本目录已通过 `vercel link` 关联）
- 网页版（应用本体）：https://ks.chzih.com
- Windows 大文件存放：Vercel Blob 存储 `kairos-downloads`（store_bCYbJThQaJ2lGXOB）

## 目录结构

```
index.html      单页官网（功能示意 / 功能亮点 / 使用场景 / 多端下载 / FAQ）
styles.css      全部样式，含浅色与深色主题
theme.js        在首屏渲染前读取主题偏好，减少深色模式闪烁
script.js       功能示意页签、主题切换、手机导航、平台推荐、复制校验和
assets/         图标、favicon、OG 分享图与可编辑 SVG 源文件
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

`main` 分支已连接 Vercel，推送后会自动创建生产部署：

```sh
git push origin main
```

需要手动部署时也可以执行：

```sh
vercel deploy --prod --yes
```

## 当前域名与项目边界

官网 `kschedule.chzih.com` 连接 `kairos-schedule-website` 项目；应用本体
`ks.chzih.com` 连接 `kairos-schedule` 项目。官网更新从本目录部署，不更改应用项目关联。

## 自定义域名（阿里云解析）

1. 在 Vercel 项目 Settings → Domains 中添加域名（当前为 `kschedule.chzih.com`）。
2. 在阿里云控制台 → 云解析 DNS → chzih.com 添加记录：
   - 记录类型：CNAME
   - 主机记录：`kschedule`（与第 1 步的子域名对应）
   - 记录值：`cname.vercel-dns.com`
   - TTL：默认
3. 生效后 Vercel 会自动签发证书。注意 `*.vercel.app` 默认域名在国内被
   DNS 污染 + SNI 阻断，属网络环境问题，与部署无关。

## 内容维护（2026-10-21）

- 功能依据主项目当前实现及 `docs/remaining-features.md`、`docs/fourth-round-workflow.md` 核对。
- 首屏交互为静态功能示意，明确使用示例数据，不连接账号，也不处理真实日程。
- 展示随手记、今日/逾期任务、多人计划、评论与记录、重复日程、模板、搜索批量、
  周回顾、归档、30 天回收站、设备管理与提醒诊断等已有能力。
- 登录为用户名 / 用户 ID / 邮箱加密码；注册按实际页面完成邮箱验证。
- 离线仅描述随手记本机草稿与手动上传；跨设备变化通常每 30 秒检查，避免承诺即时同步。
- 不承诺手机推送必达，不宣传尚需邮件服务配置的邮件发送或密码找回实际送达。
- canonical、`og:url`、分享图、robots 与 sitemap 均使用正式官网域名。
- `assets/og-cover.svg` 是分享图源文件；内容变更后需重新渲染为同目录的 1200×630 PNG。
- Windows 0.2.2 / Android 1.0.2 为当前提供的安装包版本，不代表云端功能版本。
