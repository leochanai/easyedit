# Cloudflare R2 配置说明

## 1. 创建 Cloudflare R2 存储桶

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择您的账户
3. 在左侧导航中找到 "R2 Object Storage"
4. 点击 "Create bucket" 创建一个新的存储桶
5. 记下存储桶名称

## 2. 获取 R2 API 凭证

1. 在 Cloudflare Dashboard 中，进入 "R2 Object Storage"
2. 点击 "Manage R2 API tokens"
3. 创建一个新的 API token，权限设置为 "Object Read and Write"
4. 记下以下信息：
   - Access Key ID
   - Secret Access Key
   - Account ID

## 3. 配置自定义域名（可选但推荐）

1. 在 R2 存储桶设置中，点击 "Settings"
2. 找到 "Custom domains" 部分
3. 添加您的自定义域名（例如：`cdn.yourdomain.com`）
4. 按照提示完成域名验证和 DNS 配置

## 4. 配置环境变量

创建 `.env.local` 文件，并添加以下配置：

```env
BASE_URL=https://api.katonai.dev

# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_PUBLIC_URL=https://your-custom-domain.com
```

**注意：** 如果您没有配置自定义域名，`CLOUDFLARE_R2_PUBLIC_URL` 可以使用 R2 的公共 URL 格式：
`https://pub-[bucket-id].r2.dev`

## 5. 更新示例图片

编辑 `app/SampleImages.tsx` 文件，将占位符 URL 替换为您 R2 存储桶中的实际图片地址。

## 6. 部署时的注意事项

确保在部署环境中正确设置所有环境变量。如果使用 Vercel 部署，请在项目设置中添加环境变量。

## 7. 测试上传功能

1. 启动开发服务器：`pnpm dev`
2. 访问应用程序
3. 尝试上传一张图片
4. 检查图片是否成功上传到 R2 存储桶
5. 确认图片可以正常显示

## 故障排除

- 如果上传失败，检查控制台错误信息
- 确认所有环境变量都已正确设置
- 检查 R2 API token 权限是否正确
- 确认存储桶名称和账户 ID 正确无误
