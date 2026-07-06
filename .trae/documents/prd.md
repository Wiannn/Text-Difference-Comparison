## 1. Product Overview
文本差异比较工具，帮助用户直观对比原文与修改后文本的差异，快速识别增删改内容。
- 主要用途：文本校对、内容审核、版本对比
- 目标用户：文案编辑、内容创作者、开发者

## 2. Core Features

### 2.1 User Roles
| Role | Registration Method | Core Permissions |
|------|---------------------|------------------|
| Normal User | None | 使用文本比较功能 |

### 2.2 Feature Module
1. **文本比较页面**: 左右双栏输入、实时差异标注

### 2.3 Page Details
| Page Name | Module Name | Feature description |
|-----------|-------------|---------------------|
| Home page | 原文输入区 | 左侧文本输入框，支持多行文本 |
| Home page | 修改后输入区 | 右侧文本输入框，支持多行文本 |
| Home page | 差异对比展示 | 实时标注删除（红色）和新增（绿色）内容 |
| Home page | 操作按钮 | 清空、复制、对比按钮 |

## 3. Core Process
用户在左侧输入原文，右侧输入修改后的文本，系统自动检测并高亮显示差异。
```mermaid
flowchart LR
    A[输入原文] --> B[输入修改后文本]
    B --> C[实时计算差异]
    C --> D[高亮标注结果]
```

## 4. User Interface Design

### 4.1 Design Style
- 主色调：深蓝色 (#1e3a5f)
- 辅助色：红色 (#ef4444) 表示删除，绿色 (#22c55e) 表示新增
- 按钮风格：圆角、简洁
- 字体：Inter，清晰可读
- 布局：左右分栏，对称设计

### 4.2 Page Design Overview
| Page Name | Module Name | UI Elements |
|-----------|-------------|-------------|
| Home page | 标题区 | 居中标题，简洁明了 |
| Home page | 输入区 | 左右两个大文本框，带标签 |
| Home page | 对比结果 | 下方展示带颜色标注的对比结果 |

### 4.3 Responsiveness
- 桌面端：左右分栏布局
- 移动端：上下堆叠布局

### 4.4 3D Scene Guidance
Not applicable