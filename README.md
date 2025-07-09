<a href="https://katon-easyedit.vercel.app/">
  <img alt="EasyEdit" src="./public/og-image.png">
  <h1 align="center">EasyEdit</h1>
</a>

<p align="center">
  用一个提示词编辑图片，由 KatonAI 提供的 Flux Kontext 驱动。
</p>

> **注**: 项目 fork 自 [Nutlope/easyedit](https://github.com/Nutlope/easyedit)

## 技术栈

- Flux Kontext Pro/Max API 来自 [KatonAI](https://api.katonai.dev)
- Next.js app router 和 Tailwind
- Cloudflare R2 用于图片存储
- Plausible 用于网站分析

## 重要说明

**此版本只支持 Flux Kontext Pro 和 Max 模型，需要 KatonAI API 密钥。**

## 克隆和运行

1. 克隆仓库: `git clone https://github.com/hellokaton/easyedit`
2. 创建 `.env.local` 文件并添加您的配置:

   ```
   BASE_URL=https://api.katonai.dev

   # Cloudflare R2 配置
   CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
   CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
   CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
   CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
   CLOUDFLARE_R2_PUBLIC_URL=https://your-domain.com
   ```

3. 运行 `pnpm install` 和 `pnpm dev` 来安装依赖并本地运行
4. 在界面中添加您的 KatonAI API 密钥 (必需)

## 获取 API 密钥

访问 [KatonAI API 设置](https://api.katonai.dev/settings/api-keys) 来获取您的 API 密钥。
