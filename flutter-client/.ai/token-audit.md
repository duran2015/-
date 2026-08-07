# Design Token 审计清单（设计师重构工作底稿）

> **用途**：本文件是现有 `lib/core/theme/` 的完整审计，供设计师在 Figma 中做 Token 系统化重构使用。
> **现状**：现有 Token 是 Codex 从 iOS 原生代码（`UIColor+Hex`、各 VC `Style` 枚举）反推抓取的**工程产物**，不是设计师自上而下设计的视觉系统。
> **目标**：设计师据此清单，去重、语义化、建阶，输出真正的 Design Token 系统，再反哺代码 `core/theme/`。
> **生成时间**：2026-07-31，基于 flutter 分支。

---

## 一、图例与问题分类

| 标记 | 含义 | 处理建议 |
|---|---|---|
| ✅ 语义清晰 | 已是合格 Token | 保留，进 Figma |
| ⚠️ 重复 | 与其他 Token 同值或近值 | 设计师合并为单一语义 Token |
| 🔴 页面级参数 | 是某页面的布局尺寸，非视觉原子 | **踢出 Token 体系**，下沉到页面常量 |
| ❓ 待决策 | 语义模糊或可能冗余 | 需设计师判断 |

---

## 二、颜色 Token（app_colors.dart，约 80 项）

### 2.1 文字色 ✅

| Token | 值 | 评估 |
|---|---|---|
| `textPrimary` | `#222222` | ✅ |
| `textSecondary` | `#666666` | ✅ |
| `textTertiary` | `#999999` | ✅ |
| `placeholder` | `#CCCCCC` | ✅ |
| `textDark` | `#1A1A2E` | ❓ 异常页专用，是否并入主文字色阶？ |

### 2.2 品牌青绿（主色系）

| Token | 值 | 评估 |
|---|---|---|
| `brandTeal` | `#00A6A1` | ✅ 主色 |
| `brandGradientStart` | `#00D8E0` | ✅ |
| `brandGradientEnd` | `#00AFBE` | ✅ |
| `brandGradient3Start` | `#00E0C7` | ⚠️ 与 brandGradientStart 同属"品牌渐变起"，需统一 |
| `brandGradient3Mid` | `#00BCCE` | ⚠️ 同上 |
| `brandTealLight` | `#E9FAFF` | ⚠️ 与 `brandTealSelected`(#EBFBFF) 近似，合并？ |
| `brandTealSelected` | `#EBFBFF` | ⚠️ 同上 |
| `avatarTintTeal` | `#12D6C8` | ❓ 头像 tint，是否归入品牌色阶 |
| `accentTeal` | `#00BBC8` | ⚠️ 与 brandTeal(#00A6A1) 都是"青绿强调"，需明确层级 |
| `chatBubbleSelf` | `#00C5D5` | ⚠️ 自己气泡色，又一个青绿——与 brandTeal/accentTeal 三者关系待定 |

> 🚨 **品牌青绿系有 5 个相近值**：`#00A6A1` / `#00BBC8` / `#00C5D5` / `#12D6C8` / `#00AFBE`。设计师需定义"品牌青绿色阶"（如 brand-500/600/700），把散值收敛进阶。

### 2.3 靛蓝/紫（第二主题：咨询师/视频）

| Token | 值 | 评估 |
|---|---|---|
| `indigo` | `#525EE1` | ✅ |
| `indigoGradientStart` | `#4A56D9` | ✅ |
| `indigoGradientEnd` | `#717DFF` | ✅ |
| `bannerGradientStart` | `#4D5CFF` | ⚠️ 与 indigo 系重叠，是否合并 |
| `bannerGradientEnd` | `#A8A8FF` | ⚠️ 同上 |
| `purpleTagBg` | `#F2EFFF` | ✅ |

### 2.4 红色/警示 🚨 重灾区

| Token | 值 | 评估 |
|---|---|---|
| `priceRed` | `#FF3D3D` | ⚠️ 价格红 |
| `badgeRed` | `#FF3B30` | ⚠️ 角标红（与 priceRed 近似） |
| `counselorBadgeRed` | `#FF2E00` | ⚠️ 咨询师徽标红 |
| `countdownText` | `#FF6257` | ⚠️ 倒计时文字红 |
| `tipText` | `#FF6C00` | ⚠️ 提示橙红 |
| `chatRecordingCancelBg` | `#FF7B64` | ⚠️ 取消态红 |
| `redGradientStart` | `#FF7B5E` | ⚠️ 红渐变起 |
| `redGradientEnd` | `#FF5C71` | ⚠️ 红渐变终 |

> 🚨 **8 个红/橙红值**，语义全是"警示/价格/危险"。建议设计师定义 `danger`（操作危险）/ `price`（价格）/ `badge`（角标）三套语义，把 8 个值收敛到 2-3 个。

### 2.5 背景与分割线 🚨 分割线重灾区

| Token | 值 | 评估 |
|---|---|---|
| `pageBackground` | `#F1F4FB` | ✅ 全局页面底 |
| `messageBackground` | `#F5F7FA` | ⚠️ 消息页底，与 pageBackground 近似，是否合并 |
| `pageGradientStart` | `#ECEFFF` | ✅ |
| `cardBackground` | `#FFFFFF` | ✅ |
| `innerBackground` | `#F7F8FC` | ✅ 卡片内灰底 |
| `statsGradientTop` | `#F9F7FE` | ⚠️ = `consultVideoBg`(#F9F7FE)，重复 |
| `statsGradientBottom` | `#FDFDFE` | ⚠️ = `chatCardGradientEnd`(#FDFDFE)，重复 |
| `chatCardGradientStart` | `#EBFEFF` | ⚠️ 与品牌浅底系近似 |
| `chatCardGradientEnd` | `#FDFDFE` | ⚠️ 见上 |
| `tipBackground` | `#FFF9F4` | ❓ 提示卡底，语义化？ |
| `exceptionIconBg` | `#FDECEC` | ❓ 异常图标底 |
| `badgeBgRed` | `#FFECE9` | ❓ 待支付徽标底 |
| `badgeBgGray` | `#F6F6F6` | ❓ 已取消徽标底 |

**分割线（🚨 5 个值 + 1 别名）**：

| Token | 值 | 评估 |
|---|---|---|
| `divider` | `#EEEEEE` | ⚠️ |
| `dividerDark` | `#E8E8E8` | ⚠️ = `messageAvatarBg` |
| `navDivider` | `#E5E5E5` | ⚠️ = `chatRecordingBg` |
| `hairline` | `#F0F0F0` | ⚠️ |
| `lightPurpleDivider` | `#EBECF6` | ⚠️ |
| `chatCardDivider` | = lightPurpleDivider | ⚠️ 别名，冗余 |
| `inputCapsuleBorder` | `#F9F9F9` | ⚠️ 输入框边，又一分割线值 |

> 🚨 **6+ 个分割线值**。建议设计师定义 `divider/default`、`divider/strong`、`divider/onLight` 最多 3 档，收敛所有。

### 2.6 投影/阴影

| Token | 值 | 评估 |
|---|---|---|
| `cardShadow` | `#E6EAEE` | ✅（配合 dimens 的 blur/offset/opacity） |
| `codeBoxShadow` | `#08000000` | ❓ 专用 |
| `selectedChipShadow` | `#38B4CCCC` | ❓ 专用 |
| `chatIconBadgeShadow` | `#B3E2ECFF` | ❓ 专用 |
| `chatPanelTileShadow` | `#299AA3B2` | ❓ 专用 |

### 2.7 咨询方式三色（tint + 浅底配对）

| Token | 值 | 评估 |
|---|---|---|
| `consultVoice` / `consultVoiceBg` | `#00A6A1`(=brandTeal) / `#E9FFF8` | ⚠️ tint 复用主色 |
| `consultVideo` / `consultVideoBg` | `#525EE1`(=indigo) / `#F9F7FE` | ⚠️ tint 复用第二主题 |
| `consultText` / `consultTextBg` | `#52A8E1` / `#F4F9FF` | ✅ |

### 2.8 功能图标 tint + 浅底（配对模式 ✅）

| Token | 值 |
|---|---|
| `funcGreen` / `funcGreenBg` | `#34C759` / `#E8F8EE` |
| `funcPurple` / `funcPurpleBg` | `#8B7CF6` / `#F0EDFF` |
| `funcPink` / `funcPinkBg` | `#FF7B9C` / `#FFEDF2` |
| `funcBlue` / `funcBlueBg` | `#4DA3FF` / `#EAF4FF` |

> ✅ 这套"tint + 浅底"配对模式很好，可上升为通用模式。

### 2.9 量表记录渐变

| Token | 值 | 评估 |
|---|---|---|
| `recordLevelGradientStart` | `#DCE5FF` | ❓ |
| `recordLevelGradientEnd` | `#C9E0EF` | ❓ |

---

## 三、尺寸/间距/圆角 Token（app_dimens.dart，约 70 项）

### 3.1 全局布局 ✅

| Token | 值 | 评估 |
|---|---|---|
| `screenPadding` | 15 | ✅ |
| `sectionGap` | 18 | ✅ |
| `cardPadding` | 15 | ✅（与 screenPadding 同值，可考虑合并为 spacing） |
| `cardRadius` | 12 | ✅ |
| `cardRadiusLarge` | 16 | ✅ |

### 3.2 间距阶 ⚠️ 不规整

| Token | 值 | 评估 |
|---|---|---|
| `gap4` | 4 | ✅ |
| `gap6` | 6 | ⚠️ 非 4/8 栅格 |
| `gap8` | 8 | ✅ |
| `gap10` | 10 | ⚠️ 非 4/8 栅格 |
| `gap12` | 12 | ✅ |
| `gap14` | 14 | ⚠️ 非 4/8 栅格 |
| `gap15` | 15 | ⚠️ 非 4/8 栅格，= screenPadding |
| `gap16` | 16 | ✅ |
| `gap18` | 18 | ⚠️ 非 4/8 栅格 |
| `gap20` | 20 | ✅ |

> 🚨 阶数 `4,6,8,10,12,14,15,16,18,20` 违背 4/8 栅格。建议设计师重新定义间距阶（如 `4,8,12,16,20,24,32`），现存非栅格值（6/10/14/15/18）评估能否归并。

### 3.3 圆角阶 ⚠️ 散乱

| Token | 值 | 评估 |
|---|---|---|
| `radiusTiny` | 3 | ⚠️ |
| `radiusTag` | 6 | ⚠️ |
| `radiusConsultTag` | 9 | ⚠️ |
| `radiusInner` | 10 | ⚠️ |
| `cardRadius` | 12 | ✅ |
| `radiusMedium` | 14 | ⚠️ |
| `radiusSpecial` | 15 | ⚠️ |
| `cardRadiusLarge` | 16 | ✅ |
| `buttonRadiusCapsule` | 22.5 | ⚠️ 胶囊（= 按钮高/2） |
| `chatInputRadius` | 25.5 | ⚠️ 胶囊 |
| `confirmButtonRadius` | 26.5 | ⚠️ 胶囊 |

> 🚨 圆角值 `3,6,9,10,12,14,15,16` 无清晰阶数。建议定义 `radius/xs(4)` `radius/sm(8)` `radius/md(12)` `radius/lg(16)` `radius/xl(20)` `radius/full`（胶囊）。

### 3.4 按钮/输入尺寸

| Token | 值 | 评估 |
|---|---|---|
| `buttonHeight` | 45 | ✅ |
| `buttonHeightSmall` | 36 | ✅ |
| `confirmButtonHeight` | 53 | ⚠️ 心情弹窗专用，页面级？ |
| `dialogButtonHeight` | 44 | ✅ |
| `retryButtonHeight` | 50 | ❓ 异常页专用 |
| `loginInputHeight` | 52 | ⚠️ 登录专用 |
| `chatInputHeight` | 51 | ⚠️ 聊天专用 |

### 3.5 页面级参数 🔴 建议踢出 Token 体系

以下是与具体页面布局强绑定的尺寸，**不是视觉原子**，应下沉到对应页面文件的私有常量：

| Token | 值 | 归属 |
|---|---|---|
| `loginTopPicTopOffset` | 60 | 🔴 登录页 |
| `loginTopPicWidth` | 143 | 🔴 登录页 |
| `loginTopPicHeight` | 141 | 🔴 登录页 |
| `loginPhoneToTopPicGap` | 36 | 🔴 登录页 |
| `loginAgreementInset` | 40 | 🔴 登录页 |
| `loginCheckBoxSize` | 14 | 🔴 登录页 |
| `loginCheckBoxTapSize` | 44 | 🔴 登录页（热区，可保留为通用最小点击区） |
| `thirdPartyToAgreementGap` | 20 | 🔴 登录页 |
| `loginCountryCodeDividerLeft` | 68 | 🔴 登录页 |
| `loginCountryCodeDividerHeight` | 22 | 🔴 登录页 |
| `loginButtonDisabledAlpha` | 0.3 | ⚠️ 可保留为通用 disabled 透明度 |
| `verifyCodeBoxGap` | 15 | 🔴 验证码页 |
| `verifyCodeBoxRadius` | 12 | ⚠️ = cardRadius，可复用 |
| `bindCardTopGap` | 30 | 🔴 微信绑定页 |
| `bindCardHeight` | 64 | 🔴 微信绑定页 |
| `bindAvatarSize` | 40 | 🔴 微信绑定页 |
| `bindAvatarLeading` | 15 | 🔴 微信绑定页 |
| `bindInputTopGap` | 32 | 🔴 微信绑定页 |
| `roleCardHeight` | 78 | 🔴 身份选择页 |
| `roleIconSize` | 48 | 🔴 身份选择页 |
| `roleCardTextGap` | 9 | 🔴 身份选择页 |
| `roleCardBorderWidth` | 0.5 | ⚠️ 可保留为通用 hairline 边宽 |
| `launchContentWidth` | 169 | 🔴 启动页 |
| `launchContentHeight` | 245 | 🔴 启动页 |
| `loginPadding` | 30 | 🔴 登录页 |
| `thirdPartyIconSize` | 58 | 🔴 登录页 |
| `thirdPartyIconGap` | 60 | 🔴 登录页 |
| `appleIconPointSize` | 26 | 🔴 登录页 |
| `loginTopPicWidth/Height...` | — | 🔴 登录页 |
| `messageHorizontalInset` | 16 | ⚠️ 可保留为通用页面边距 |
| `messageSysIconSize` | 40 | 🔴 消息页 |
| `messageAvatarSize` | 44 | ⚠️ 可保留为通用头像尺寸 |
| `messageUnreadBadgeHeight` | 18 | 🔴 消息页 |
| `messagePreviewIconSize` | 14 | 🔴 消息页 |

> 🚨 **约 30 项页面级参数混在 Token 里**。建议：通用尺寸（头像、最小点击区、页面边距、disabled 透明度、hairline 边宽）上升为 Token；纯页面布局参数下沉到页面。

### 3.6 TabBar 尺寸

| Token | 值 | 评估 |
|---|---|---|
| `tabBarContentHeight` | 49 | ⚠️ TabBar 专用，可保留（通用组件） |
| `tabBarIconTop` | 10 | 🔴 TabBar 内部布局 |
| `tabIconSize` | 22 | ✅ 可保留（通用图标尺寸） |
| `tabIconTextGap` | 6 | 🔴 TabBar 内部 |
| `tabItemHeight` | 39 | 🔴 TabBar 内部 |

### 3.7 卡片投影参数 ✅

| Token | 值 |
|---|---|
| `cardShadowBlur` | 6 |
| `cardShadowOffsetY` | 3 |
| `cardShadowOpacity` | 0.5 |

> ✅ 与 `AppColors.cardShadow` 配套，作为通用 elevation Token。

---

## 四、字体 Token（app_text_styles.dart）✅ 质量最高

**这部分基本可直接进 Figma，几乎不需重构。**

| Token | 字号 | 字重 | 用途 |
|---|---|---|---|
| `displayLarge` | 28 | semibold(w600) | 预约详情时段 |
| `price` | 24 | bold(w700) | 价格、异常页标题 |
| `codeDigit` | 24 | semibold(w600) | 验证码数字 |
| `titleXLarge` | 20 | semibold | 区块大标题 |
| `titleLarge` | 18 | semibold | 区块标题、姓名 |
| `titleMedium` | 17 | semibold | 导航标题、列表主标题 |
| `title` | 16 | semibold | 页面/卡片标题主力；主按钮文字 |
| `titleSmall` | 15 | semibold | 卡片标题 |
| `bodyLarge` | 14 | regular | 正文偏强 |
| `bodyLargeStrong` | 14 | semibold | 正文强调 |
| `body` | 13 | regular | 正文 |
| `caption` | 12 | regular | 辅助文字/标签 |
| `label` | 11 | regular | 小标签、TabBar |
| `badge` | 10 | regular | 徽标 |
| `badgeSmall` | 9 | semibold | 极小徽标 |

> 字号阶 `9,10,11,12,13,14,15,16,17,18,20,24,28` 清晰，字重惯例（标题 semibold / 正文 regular / 价格 bold）规范。
> ⚠️ 唯一小问题：`price`(24/w700) 与 `codeDigit`(24/w600) 同字号不同字重，确认是否需合并为 `headline` 体系。
> ⚠️ 命名混合了 Material 风格（displayLarge/titleMedium）与语义风格（price/caption/badge），建议设计师统一命名规范。

---

## 五、资产 Token（app_assets.dart）✅ 命名规范

- **来源**：脚本生成（`GENERATED FILE`），1:1 对应 iOS imageset
- **命名前缀域**：`home_` / `ic_` / `tab_` / `login_` / `mine_` / `message_` / `chat_` / `ai_` / `consult_`
- **格式**：PNG 为主，少量 SVG（`chat_panel_meditation`、`ic_consult_record_ai`、`ic_order_time` 等）
- **多倍图**：1x 在 `assets/images/`，2x 在 `2.0x/`，3x 在 `3.0x/`（Flutter 自动解析）

> ⚠️ Figma 端目前没有对应的资产库。建议设计师在 Figma 建立与命名前缀一致的资产组件库，便于产品/工程师查阅。
> ⚠️ `app_assets.dart` 是 GENERATED 文件，重构时改的是生成脚本，不是手改。

---

## 六、设计师决策清单（汇总待定项）

重构时，设计师需对以下问题逐一决策：

### 颜色类
- [ ] **品牌青绿色阶**：把 `#00A6A1`/`#00BBC8`/`#00C5D5`/`#12D6C8`/`#00AFBE` 5 个值收敛为 `brand-500/600/700` 色阶
- [ ] **红色系**：把 8 个红/橙红值收敛为 `danger`/`price`/`badge` 最多 3 套语义
- [ ] **分割线**：把 6+ 个分割线值收敛为 `divider/default`/`strong`/`onLight` 最多 3 档
- [ ] **品牌浅底**：`brandTealLight`/`brandTealSelected`/`chatCardGradientStart` 等浅底是否合并
- [ ] **页面底色**：`pageBackground`(#F1F4FB) 与 `messageBackground`(#F5F7FA) 是否统一
- [ ] **异常页文字**：`textDark`(#1A1A2E) 是否并入主文字色阶
- [ ] **消息域文字**：`messageNameText`(#333333) 与 `textPrimary`(#222222) 是否统一
- [ ] **状态色体系**：是否新增 `success`/`warning`/`info` 语义色（目前只有零散 funcGreen）

### 尺寸类
- [ ] **间距阶**：重新定义 4/8 栅格阶，归并 6/10/14/15/18 非栅格值
- [ ] **圆角阶**：定义 `xs/sm/md/lg/xl/full` 阶数，收敛 8 个散值
- [ ] **页面级参数踢出**：确认约 30 项页面布局参数下沉到页面
- [ ] **上升通用**：头像尺寸(40/44)、最小点击区(44)、hairline 边宽(0.5)、disabled 透明度(0.3) 是否上升为通用 Token

### 字体类
- [ ] **命名规范**：统一 Material 风格 vs 语义风格的命名
- [ ] **price vs codeDigit**：同字号不同字重是否合并

### 资产类
- [ ] **Figma 资产库**：建立与代码命名前缀一致的资产组件库

---

## 七、重构后的交付物（期望）

设计师重构完成后，期望交付：

1. **Figma Token 库**：用 Figma Variables/Styles（或 Tokens Studio 插件）承载新 Token 体系
2. **Token 映射表**：旧 Token → 新 Token 的映射（供工程师做全局替换）
3. **`.ai/design-spec.md`**：新 Token 的语义说明与用法文档

工程师据此重构 `lib/core/theme/`，全局替换引用点，删除冗余 Token。
