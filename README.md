# 积善之家 - 福善门 Web版 部署指南

## 项目信息

- **项目名称**: 积善之家 - 福善门
- **技术栈**: Vue 3 + Vite + Vant 4 + Vue Router + Pinia
- **特性**: 移动端优先、老年人友好、PWA支持

## 本地运行

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## Cloudflare Pages 部署

### 方式一：通过 Cloudflare Dashboard

1. **创建 Git 仓库**（如使用 GitHub/GitLab）
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 选择 **Pages** → **Create a project**

3. **连接仓库**
   - 选择你的 Git 提供商（GitHub/GitLab）
   - 授权访问你的仓库
   - 选择对应的仓库

4. **配置构建**
   - **Project name**: `fushanmen`（可自定义）
   - **Production branch**: `main`
   - **Build settings**:
     - **Framework preset**: Vue
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - **Environment variables** (可选):
     - `NODE_VERSION`: `18`

5. **部署**
   - 点击 **Save and Deploy**

### 方式二：直接上传 dist 文件夹

1. **构建项目**
   ```bash
   npm run build
   ```

2. **创建 Cloudflare Pages 项目**
   - 访问 https://dash.cloudflare.com
   - 选择 **Pages** → **Create a project**
   - 选择 **Direct uploads** → **Upload assets**
   - 拖拽 `dist` 文件夹到上传区域
   - 设置项目名称
   - 点击 **Save and Deploy**

### 自定义域名配置

1. **在 Cloudflare Pages 中设置**
   - 进入项目 **Settings** → **Custom domains**
   - 点击 **Set up a custom domain**
   - 输入你的域名（如 `family.example.com`）
   - 按照提示完成 DNS 配置

2. **DNS 配置**
   如果你的域名托管在 Cloudflare：
   - 添加 CNAME 记录指向你的 Pages 项目
   - 示例：`family.example.com` → `fushanmen.pages.dev`

3. **等待 SSL 证书**
   - Cloudflare 会自动为自定义域名申请 SSL 证书
   - 通常需要几分钟生效

### 注意事项

- **无需备案**: Cloudflare Pages 部署在海外节点，无需中国境内备案
- **访问速度**: 建议在国内使用 DNSPOD 或阿里云 DNS 配合 Cloudflare
- **国内访问优化**: 如需优化国内访问，可使用 Cloudflare 中国合作服务商

## 项目结构

```
fushanmen-web/
├── public/                 # 静态资源
│   ├── favicon.svg        # Favicon
│   └── manifest.webmanifest # PWA清单（Vite自动生成）
├── src/
│   ├── assets/styles/     # 样式文件
│   │   ├── variables.css  # 设计系统变量
│   │   └── common.css     # 公共样式
│   ├── components/        # 公共组件
│   │   ├── AudioPlayer.vue     # 音频播放器
│   │   ├── FamilyCard.vue      # 家族成员卡片
│   │   ├── PhotoUploader.vue   # 照片上传
│   │   ├── RecordButton.vue    # 录音按钮
│   │   ├── EmptyState.vue      # 空状态
│   │   └── TabBar.vue          # 底部导航
│   ├── views/             # 页面组件
│   │   ├── home/          # 首页
│   │   ├── family-tree/   # 家谱
│   │   ├── core-family/   # 我爱我家
│   │   ├── memoir/        # 回忆录
│   │   ├── milestone/     # 大事记
│   │   ├── mine/          # 我的
│   │   └── login/         # 登录
│   ├── router/            # 路由配置
│   ├── store/             # Pinia状态管理
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── index.html             # HTML模板
├── package.json          # 项目配置
├── vite.config.js        # Vite配置
└── README.md             # 部署指南（本文档）
```

## 功能说明

### 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 四大板块卡片 + 统计数据 |
| `/family-tree` | 家谱 | 列表/树状视图切换 |
| `/core-family` | 我爱我家 | 家族成员信息 |
| `/core-family-detail` | 家族动态圈 | 查看动态 |
| `/memoir` | 回忆录列表 | 所有回忆 |
| `/memoir-record` | 录制回忆 | 4步骤录制流程 |
| `/memoir-detail` | 回忆详情 | 播放回忆 |
| `/milestone` | 大事记 | 时间线视图 |
| `/milestone-create` | 创建大事记 | 表单提交 |
| `/milestone-detail` | 大事记详情 | 查看详情 |
| `/mine` | 我的 | 个人中心 |
| `/login` | 登录 | 手机验证码登录 |

### 组件说明

- **AudioPlayer**: 音频播放器，支持进度条
- **FamilyCard**: 家族成员卡片
- **PhotoUploader**: 照片上传组件（支持移动端）
- **RecordButton**: 录音按钮，支持长按录音
- **EmptyState**: 空状态展示
- **TabBar**: 底部导航栏

### 技术特点

1. **移动端优先**: 大触摸目标、清晰字体
2. **老年人友好**: 大字号、高对比度、简洁界面
3. **PWA 支持**: 可添加到桌面、离线访问
4. **Mock 数据**: 无需后端即可运行演示

## 常见问题

### Q: 如何添加新的家族成员？
A: 修改 `src/store/family.js` 中的 `mockFamilyMembers` 数组。

### Q: 如何连接真实后端？
A: 
1. 安装 axios: `npm install axios`
2. 在 `src/utils/` 创建 API 模块
3. 替换 store 中的 mock 数据为真实 API 调用

### Q: 如何自定义主题色？
A: 修改 `src/assets/styles/variables.css` 中的 CSS 变量。

## 许可证

MIT License
