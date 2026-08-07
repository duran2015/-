# 目标 Design Token 体系骨架（草案 v1）

> **用途**：设计师系统化重构的起点草案。不是最终答案，是供调整的骨架。
> **原则**：语义化命名、成体系（色阶/阶数）、单一事实来源、去重。
> **基于**：`.ai/token-audit.md` 的审计发现。
> **如何用**：设计师在 Figma 按此结构建 Collections/Variables，值可微调；确认后产出"旧→新映射表"交给工程。
> **生成时间**：2026-07-31

---

## 一、颜色体系

### 1.1 Brand 品牌青绿（主色阶）

> 收敛来源：5 个相近值 `brandTeal`/`accentTeal`/`chatBubbleSelf`/`avatarTintTeal`/`brandGradientEnd`
> 定义 7 阶，设计师微调各阶色值

| Token | 建议值 | 用途 | 吸收的旧 Token |
|---|---|---|---|
| `brand/50` | `#E9FAFF` | 浅底、tag/badge 底 | `brandTealLight`, `brandTealSelected`, `chatCardGradientStart` |
| `brand/100` | `#E0F7FA` | hover/selected 浅底 | （新增，填充阶数） |
| `brand/300` | `#12D6C8` | 头像 tint、辅助 | `avatarTintTeal` |
| `brand/500` | `#00A6A1` | **主色**（按钮、强调、图标） | `brandTeal`, `consultVoice` |
| `brand/600` | `#00BBC8` | 次级强调（链接、时段） | `accentTeal`, `chatBubbleSelf` |
| `brand/700` | `#00AFBE` | 渐变终点、按压态 | `brandGradientEnd` |
| `brand/grad-primary` | `#00D8E0 → #00AFBE` | 品牌主渐变 | `brandGradient` |
| `brand/grad-button` | `#00E0C7 → #00BCCE → #00AFBE` | 按钮三色渐变 | `brandButtonGradient` |
| `brand/grad-aitab` | `#21DAE3 → #3EEEDA → #1DC8DF` | AI Tab 指示条 | `aiTabIndicatorGradient` |

> **设计师待定**：`brand/100` 具体值；主色 `brand/500` 用 `#00A6A1` 还是微调；阶数是否需要 200/400。

---

### 1.2 Indigo 靛蓝（第二主题：咨询师/视频/等级）

> 收敛来源：indigo 渐变系与 banner 渐变系重叠

| Token | 建议值 | 用途 | 吸收的旧 Token |
|---|---|---|---|
| `indigo/50` | `#F2EFFF` | 标签底、统计区顶 | `purpleTagBg`, `statsGradientTop`(=#F9F7FE 待统一) |
| `indigo/500` | `#525EE1` | 第二主题主色 | `indigo`, `consultVideo` |
| `indigo/600` | `#4A56D9` | 渐变起 | `indigoGradientStart` |
| `indigo/700` | `#717DFF` | 渐变终 | `indigoGradientEnd` |
| `indigo/grad-button` | `#4A56D9 → #717DFF` | 咨询师端按钮 | `indigoButtonGradient` |
| `indigo/grad-banner` | `#4D5CFF → #A8A8FF` | 首页咨询横幅 | `bannerGradient` |

> **设计师待定**：banner 渐变(#4D5CFF/#A8A8FF) 是否独立于 indigo 阶，还是合并。

---

### 1.3 Semantic 语义色 🚨 重点收敛

> 收敛来源：8 个红/橙红值 + 缺失的状态色体系

| Token | 建议值 | 用途 | 吸收的旧 Token |
|---|---|---|---|
| `danger/500` | `#FF3D3D` | **危险操作、删除** | `priceRed` |
| `danger/600` | `#FF2E00` | 咨询师徽标 | `counselorBadgeRed` |
| `danger/grad` | `#FF7B5E → #FF5C71` | 去支付/退款渐变按钮 | `redButtonGradient` |
| `price/500` | `#FF3D3D` | **价格** | （与 danger 同值，设计师定是否合并语义） |
| `badge/500` | `#FF3B30` | **未读角标** | `badgeRed` |
| `warning/500` | `#FF6C00` | 温馨提示 | `tipText` |
| `warning/bg` | `#FFF9F4` | 提示卡底 | `tipBackground` |
| `success/500` | `#34C759` | 成功（复用 funcGreen） | `funcGreen` |
| `success/bg` | `#E8F8EE` | 成功浅底 | `funcGreenBg` |
| `info/500` | `#4DA3FF` | 信息（复用 funcBlue） | `funcBlue` |
| `info/bg` | `#EAF4FF` | 信息浅底 | `funcBlueBg` |
| `countdown/500` | `#FF6257` | 倒计时文字（专用语义保留） | `countdownText` |
| `countdown/bg` | `#FFF3F2` | 倒计时底 | `countdownBg` |

> **设计师关键决策**：
> 1. `price` 和 `danger` 是同值不同语义，是否合并成一个 `danger/price`？（推荐：价格场景多且语义独立，保留 `price`）
> 2. `countdown` 是否并入 `danger`？（推荐：倒计时是专用语义，保留）
> 3. `chatRecordingCancelBg`(#FF7B64) 归入 `danger/600` 还是独立？

---

### 1.4 Text 文字色阶

| Token | 建议值 | 用途 | 吸收的旧 Token |
|---|---|---|---|
| `text/primary` | `#222222` | 主文字 | `textPrimary` |
| `text/secondary` | `#666666` | 次文字 | `textSecondary` |
| `text/tertiary` | `#999999` | 辅助文字 | `textTertiary`, `iconGray` |
| `text/quaternary` | `#CCCCCC` | 占位符 | `placeholder` |
| `text/onDark` | `#1A1A2E` | 深底文字（异常页） | `textDark` |
| `text/inverse` | `#FFFFFF` | 深色背景上的白字 | （隐式存在，显式化） |

> **设计师待定**：`messageNameText`(#333333) 并入 `text/primary` 还是新增 `text/primary-strong`？推荐并入 primary 统一。

---

### 1.5 Background 背景层级

| Token | 建议值 | 用途 | 吸收的旧 Token |
|---|---|---|---|
| `bg/page` | `#F1F4FB` | **页面底**（统一） | `pageBackground`, `messageBackground`(统一) |
| `bg/page-grad` | `#ECEFFF → #F1F4FB` | 页面渐变 | `pageGradient` |
| `bg/card` | `#FFFFFF` | 卡片 | `cardBackground` |
| `bg/inner` | `#F7F8FC` | 卡片内灰底、输入框底 | `innerBackground` |
| `bg/elevated` | `#FDFDFE` | 抬升层（渐变终、统计底） | `statsGradientBottom`, `chatCardGradientEnd` |
| `bg/disabled` | `#F6F6F6` | 禁用/已取消徽标底 | `badgeBgGray` |
| `bg/danger-subtle` | `#FFECE9` | 待支付徽标底、异常图标底 | `badgeBgRed`, `exceptionIconBg` |

> **设计师待定**：`messageBackground`(#F5F7FA) 与 `pageBackground`(#F1F4FB) 是否统一？推荐统一为 `bg/page`。

---

### 1.6 Divider 分割线 🚨 重点收敛（6→3）

| Token | 建议值 | 用途 | 吸收的旧 Token |
|---|---|---|---|
| `divider/default` | `#EEEEEE` | **默认分割线** | `divider` |
| `divider/strong` | `#E8E8E8` | 强分割线、头像底 | `dividerDark`, `messageAvatarBg` |
| `divider/on-light` | `#EBECF6` | 浅紫底上的分割线 | `lightPurpleDivider`, `chatCardDivider` |
| `border/input-capsule` | `#F9F9F9` | 输入胶囊描边（专用保留） | `inputCapsuleBorder` |

> **踢出**：`navDivider`(#E5E5E5)、`hairline`(#F0F0F0) —— 设计师评估归入 `default` 还是 `strong`。

---

### 1.7 Shadow 阴影体系

| Token | 建议 | 用途 | 吸收的旧 Token |
|---|---|---|---|
| `shadow/card` | color `#E6EAEE` @50%, blur 6, offsetY 3 | **通用卡片投影** | `cardShadow` + dimens 三参数 |
| `shadow/subtle` | color `#08000000` (3%) | 轻投影（验证码格） | `codeBoxShadow` |
| `shadow/selected-chip` | color `#38B4CCCC` | 选中态投影（专用保留） | `selectedChipShadow` |
| `shadow/chat-icon` | color `#B3E2ECFF` | 聊天图标徽章（专用保留） | `chatIconBadgeShadow` |
| `shadow/chat-panel` | color `#299AA3B2` | 面板瓦片（专用保留） | `chatPanelTileShadow` |

> **设计师待定**：后 3 个专用阴影是否合并为一档 `shadow/colored`？

---

### 1.8 Consult 咨询方式（专用语义保留）

> "tint + 浅底"配对模式很好，保留为专用语义组

| Token | 值 | 用途 | 旧 Token |
|---|---|---|---|
| `consult/voice` + `consult/voice-bg` | `#00A6A1`(=brand/500) / `#E9FFF8` | 语音咨询 | `consultVoice`/`Bg` |
| `consult/video` + `consult/video-bg` | `#525EE1`(=indigo/500) / `#F9F7FE` | 视频咨询 | `consultVideo`/`Bg` |
| `consult/text` + `consult/text-bg` | `#52A8E1` / `#F4F9FF` | 文字咨询 | `consultText`/`Bg` |

> tint 复用主色阶，浅底独立定义。

---

### 1.9 Func 功能图标（tint + 浅底配对）

> 模式上升为通用，保留 4 套

| Token | 值 | 旧 Token |
|---|---|---|
| `func/pink` + `func/pink-bg` | `#FF7B9C` / `#FFEDF2` | `funcPink`/`Bg` |
| `func/purple` + `func/purple-bg` | `#8B7CF6` / `#F0EDFF` | `funcPurple`/`Bg` |
| `func/green` → `success` | （并入 1.3 语义色） | `funcGreen` |
| `func/blue` → `info` | （并入 1.3 语义色） | `funcBlue` |

---

## 二、尺寸体系

### 2.1 Spacing 间距阶（4 倍数栅格）🚨 重新定义

> 收敛来源：`4,6,8,10,12,14,15,16,18,20` 非标准栅格

| Token | 值 | 用途 | 吸收的旧值 |
|---|---|---|---|
| `space/2xs` | 4 | 极小间距 | `gap4` |
| `space/xs` | 8 | 小间距 | `gap6`(归入), `gap8` |
| `space/sm` | 12 | 中小间距 | `gap10`(归入), `gap12` |
| `space/md` | 16 | 中间距（主力） | `gap14`(归入), `gap15`(归入), `gap16`, `screenPadding`(统一到这) |
| `space/lg` | 20 | 中大间距 | `gap18`(归入), `gap20` |
| `space/xl` | 24 | 大间距 | （新增，原缺失） |
| `space/2xl` | 32 | 区块间距 | `sectionGap`(18→建议24或保留语义), `bindInputTopGap`(下沉) |
| `space/3xl` | 40 | 页面留白 | `loginAgreementInset`(下沉), `thirdPartyIconGap`(下沉) |

> **设计师关键决策**：
> - 非栅格值（6/10/14/15/18）**强制归并**到最近栅格值，还是为某些保留？
> - `sectionGap`(18) 是保留为语义 `space/section`，还是归到 `space/xl`(24)？推荐保留语义 `space/section`。
> - `screenPadding`(15) 归到 `space/md`(16) 还是保留 `space/screen-padding`？推荐保留语义。

---

### 2.2 Radius 圆角阶 🚨 重新定义

| Token | 值 | 用途 | 吸收的旧值 |
|---|---|---|---|
| `radius/xs` | 4 | 小竖条、小标签 | `radiusTiny`(3→4) |
| `radius/sm` | 8 | 特质标签 | `radiusTag`(6→8), `radiusConsultTag`(9→8) |
| `radius/md` | 12 | **卡片标准** | `cardRadius`, `verifyCodeBoxRadius` |
| `radius/lg` | 16 | 大卡片、弹层 | `cardRadiusLarge` |
| `radius/xl` | 20 | 特殊大圆角 | `radiusSpecial`(15→20), `radiusMedium`(14→16或20) |
| `radius/inner` | 10 | 卡片内层（保留语义） | `radiusInner` |
| `radius/full` | 999 / (高/2) | **胶囊**（按钮、输入） | `buttonRadiusCapsule`, `chatInputRadius`, `confirmButtonRadius` |

> **设计师待定**：`radiusMedium`(14) 归 `lg`(16) 还是新增 `radius/14`？推荐归 lg。

---

### 2.3 Sizing 组件尺寸（通用）

| Token | 值 | 用途 | 吸收的旧值 |
|---|---|---|---|
| `size/icon-sm` | 22 | TabBar 图标 | `tabIconSize` |
| `size/avatar-sm` | 40 | 小头像 | `bindAvatarSize`, `messageSysIconSize` |
| `size/avatar-md` | 44 | 标准头像 | `messageAvatarSize` |
| `size/icon-md` | 48 | 身份卡片图标 | `roleIconSize` |
| `size/icon-lg` | 58 | 第三方登录图标 | `thirdPartyIconSize` |
| `size/button-h` | 45 | 主按钮高 | `buttonHeight` |
| `size/button-h-sm` | 36 | 次按钮高 | `buttonHeightSmall` |
| `size/button-h-dialog` | 44 | 弹窗按钮高 | `dialogButtonHeight` |
| `size/input-h` | 52 | 标准输入框高 | `loginInputHeight` |
| `size/input-h-chat` | 51 | 聊天输入条（专用保留） | `chatInputHeight` |
| `size/tap-min` | 44 | **最小点击热区**（Apple HIG） | `loginCheckBoxTapSize` |
| `size/badge-h` | 18 | 未读角标高 | `messageUnreadBadgeHeight` |

> **踢出 Token 体系的页面级参数**（下沉到页面私有常量）：
> `loginTopPicWidth/Height/TopOffset/PhoneToTopPicGap`、`loginCountryCodeDivider*`、`verifyCodeBoxGap`、`bindCardTopGap/Height/AvatarLeading/InputTopGap`、`roleCardHeight/TextGap`、`launchContentWidth/Height`、`loginPadding`、`thirdPartyIconGap`、`appleIconPointSize`、`messagePreviewIconSize`、`tabBarIconTop/IconTextGap/ItemHeight`
> 
> **理由**：这些是具体页面的布局参数，不是跨页面复用的视觉原子。

---

### 2.4 通用透明度

| Token | 值 | 用途 | 旧 Token |
|---|---|---|---|
| `opacity/disabled` | 0.3 | 禁用态透明度 | `loginButtonDisabledAlpha` |
| `opacity/hairline` | 0.5 (border-width 0.5) | 细边宽 | `roleCardBorderWidth` |

---

## 三、字体体系（基本沿用，统一命名）✅

> 现有质量高，保持字号/字重不变，只统一命名风格为语义化。

### 3.1 字号阶（Display → Label）

| Token | 字号 | 字重 | 用途 | 旧 Token |
|---|---|---|---|---|
| `font/display-lg` | 28 | semibold(w600) | 预约详情时段 | `displayLarge` |
| `font/headline` | 24 | bold(w700) | **价格、异常页标题** | `price` |
| `font/headline-numeric` | 24 | semibold(w600) | 验证码数字 | `codeDigit` |
| `font/title-xl` | 20 | semibold | 区块大标题 | `titleXLarge` |
| `font/title-lg` | 18 | semibold | 区块标题、姓名 | `titleLarge` |
| `font/title-md` | 17 | semibold | 导航标题、列表主标题 | `titleMedium` |
| `font/title` | 16 | semibold | 页面/卡片标题主力；主按钮 | `title` |
| `font/title-sm` | 15 | semibold | 卡片标题 | `titleSmall` |
| `font/body-lg` | 14 | regular | 正文偏强 | `bodyLarge` |
| `font/body-lg-strong` | 14 | semibold | 正文强调 | `bodyLargeStrong` |
| `font/body` | 13 | regular | 正文 | `body` |
| `font/caption` | 12 | regular | 辅助文字、标签 | `caption` |
| `font/label` | 11 | regular | 小标签、TabBar | `label` |
| `font/badge` | 10 | regular | 徽标 | `badge` |
| `font/badge-sm` | 9 | semibold | 极小徽标 | `badgeSmall` |

> **设计师待定**：`headline`(24/w700) 与 `headline-numeric`(24/w600) 是否合并为一个 `font/headline` 然后用字重参数区分？推荐合并。
> **字族**：系统字体（iOS SF Pro / Android Roboto），`_fontFamily = null`。

---

## 四、资产体系（沿用，建 Figma 组件库）

> 代码端 `app_assets.dart` 是脚本生成，命名规范。Figma 端需建立对应资产库。

**资产前缀域**（Figma Components 命名对齐）：

| 域前缀 | 用途 |
|---|---|
| `home_` | 首页（心情、测评、工具） |
| `ic_` | 通用图标（返回、勾选、箭头） |
| `tab_` | 底部 TabBar |
| `login_` | 登录流程 |
| `mine_` | 个人中心 |
| `message_` | 消息、会话 |
| `chat_` | 聊天（面板、气泡、卡片） |
| `ai_` | AI 小鹿页 |
| `consult_` | 咨询师、咨询记录 |
| `quick_` | 快捷工具 |
| `mine_` | 个人中心 |

> 设计师在 Figma 建 Asset Components 时，按此前缀域组织，与代码 1:1 对应。

---

## 五、Token 命名规范

### 5.1 分组约定

```
{group}/{semantic}[-{variant}]
```

- `group`：brand / indigo / semantic / text / bg / divider / shadow / consult / func / space / radius / size / opacity / font
- `semantic`：用途语义（primary / danger / page / md / title...）
- `variant`：变体（500 / lg / strong / button...）

### 5.2 阶数约定

- 颜色阶：`50 / 100 / 300 / 500 / 600 / 700`（不用满，按需）
- 尺寸阶：`2xs / xs / sm / md / lg / xl / 2xl / 3xl`
- 圆角阶：`xs / sm / md / lg / xl / full`

### 5.3 语义优先

优先语义命名（`bg/page`、`text/primary`），避免视觉值命名（`bg/blue-100`）。

---

## 六、收敛统计（重构收益）

| 维度 | 现有 | 目标 | 收敛比 |
|---|---|---|---|
| 颜色 Token | ~80 项 | ~50 项 | -37% |
| 其中分割线 | 6+ | 3-4 | -50% |
| 其中红色 | 8 | 3-4 语义 | -50% |
| 尺寸 Token | ~70 项 | ~40 项（+页面下沉） | -43% |
| 其中页面级参数 | ~30 混入 | 0（下沉页面） | 100% 踢出 |
| 间距阶 | 10 个非栅格 | 8 个栅格 | 规整化 |
| 圆角阶 | 8 散值 | 6 阶 | 规整化 |
| 字体 | 15 项 | 15 项（重命名） | 持平 |

---

## 七、设计师交付清单（重构完成后）

- [ ] Figma Variables/Styles 文件（含 brand/indigo/semantic/text/bg/divider/shadow 全部分组）
- [ ] Figma Asset Components 库（按前缀域组织）
- [ ] 旧 Token → 新 Token 映射表（Markdown 或 JSON）
- [ ] `.ai/design-spec.md`（新 Token 语义说明与用法）
- [ ] 决策清单勾选完成（见 `.ai/token-audit.md` 第六节）
