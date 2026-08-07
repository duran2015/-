# 设计师 Figma 操作手册（Token 系统搭建）

> 本手册是设计师在 Figma 中搭建 Design Token 系统的完整操作路径。
> 配合 `.ai/token-audit.md`（现状）和 `.ai/token-target-system.md`（目标骨架）使用。
> 每一步都具体到 Figma 菜单，照着做即可。

---

## 准备：开始前读两份文档

1. `.ai/token-audit.md` —— 了解现有 Token 的问题（哪里重复、哪里要踢出）
2. `.ai/token-target-system.md` —— 拿这份骨架作为建 Token 的蓝图

不用全记，建的时候随时回来查。

---

## 工具选择：两种路径

| 路径 | 工具 | 适用 | 推荐 |
|---|---|---|---|
| **路径 A** | Figma 原生 Variables + Styles | 无需插件，官方功能，上手快 | ✅ **推荐先用这个** |
| 路径 B | Tokens Studio 插件 | 能导出 JSON 给工程自动同步代码 | 后期升级用 |

本手册以**路径 A（原生 Variables）**为主，后期需要代码自动同步时再升级到路径 B。

---

## 第 1 步：新建 Design System 文件

1. Figma 左上角 `+` → **New design file**
2. 重命名为：`Kelul Design System`
3. 在文件里建 3 个 Page（左上角 Page 切换处右键 `Add page`）：
   - `01 Tokens`（放 Token 定义）
   - `02 Components`（放资产组件库）
   - `03 Playground`（验证页面、试验）

> 把这个文件设为团队共享，产品和工程师都能查阅。

---

## 第 2 步：建立颜色 Token（Local Variables）

切到 `01 Tokens` 页。

### 2.1 打开 Variables 面板

- 顶部菜单 **Preferences** → 勾选 **Local variables**（若已开启可跳过）
- 左侧出现 **Local variables** 面板

### 2.2 建 Color Collections

在 Local variables 面板点 `Create variable` → 选 `Color`，按目标骨架逐个建 Collection。

**操作**：点 Collection 右侧 `+` 新建分组，每个分组里点 `+` 加 Variable。

按 `token-target-system.md` 第一节建以下 Collection：

**Collection 1：Brand（品牌青绿色阶）**

```
变量名              值
brand/50           #E9FAFF
brand/100          #E0F7FA   ← 设计师填
brand/300          #12D6C8
brand/500          #00A6A1   ← 主色
brand/600          #00BBC8
brand/700          #00AFBE
```

> 在面板里：点 `+` 加变量 → Name 填 `brand/500` → 颜色块点开填 `#00A6A1`。斜杠会自动建子分组。

**Collection 2：Indigo（靛蓝第二主题）**

```
indigo/50    #F2EFFF
indigo/500   #525EE1
indigo/600   #4A56D9
indigo/700   #717DFF
```

**Collection 3：Semantic（语义色）**

```
danger/500    #FF3D3D
danger/600    #FF2E00
price/500     #FF3D3D
badge/500     #FF3B30
warning/500   #FF6C00
warning/bg    #FFF9F4
success/500   #34C759
success/bg    #E8F8EE
info/500      #4DA3FF
info/bg       #EAF4FF
countdown/500 #FF6257
countdown/bg  #FFF3F2
```

**Collection 4：Text（文字色阶）**

```
text/primary      #222222
text/secondary    #666666
text/tertiary     #999999
text/quaternary   #CCCCCC
text/onDark       #1A1A2E
text/inverse      #FFFFFF
```

**Collection 5：Background（背景层级）**

```
bg/page           #F1F4FB
bg/card           #FFFFFF
bg/inner          #F7F8FC
bg/elevated       #FDFDFE
bg/disabled       #F6F6F6
bg/danger-subtle  #FFECE9
```

**Collection 6：Divider（分割线）**

```
divider/default    #EEEEEE
divider/strong     #E8E8E8
divider/on-light   #EBECF6
border/input-capsule #F9F9F9
```

**Collection 7：Shadow（阴影色）**

```
shadow/card           #E6EAEE
shadow/subtle         #08000000
shadow/selected-chip  #38B4CCCC
shadow/chat-icon      #B3E2ECFF
shadow/chat-panel     #299AA3B2
```

**Collection 8：Consult / Func（咨询方式 + 功能图标）**

```
consult/voice      #00A6A1     consult/voice-bg    #E9FFF8
consult/video      #525EE1     consult/video-bg    #F9F7FE
consult/text       #52A8E1     consult/text-bg     #F4F9FF
func/pink          #FF7B9C     func/pink-bg        #FFEDF2
func/purple        #8B7CF6     func/purple-bg      #F0EDFF
```

> ✅ 颜色 Token 建完。渐变（如 brand 渐变）稍后在第 4 步用 Styles 处理（Figma 原生变量暂不支持渐变，需用 Fill Style 承载）。

---

## 第 3 步：建立尺寸 Token（Number Variables）

仍在 Local variables 面板，点 `Create variable` → 这次选 **Number**。

### 3.1 建 Spacing Collection（间距阶）

```
space/2xs   4
space/xs    8
space/sm    12
space/md    16
space/lg    20
space/xl    24
space/2xl   32
space/3xl   40
```

### 3.2 建 Radius Collection（圆角阶）

```
radius/xs    4
radius/sm    8
radius/md    12
radius/lg    16
radius/xl    20
radius/inner 10
radius/full  999
```

### 3.3 建 Sizing Collection（组件尺寸）

```
size/icon-sm     22
size/avatar-sm   40
size/avatar-md   44
size/icon-md     48
size/icon-lg     58
size/button-h    45
size/button-h-sm 36
size/button-h-dialog 44
size/input-h     52
size/input-h-chat 51
size/tap-min     44
size/badge-h     18
```

> ✅ 尺寸 Token 建完。

---

## 第 4 步：建立字体与渐变 Styles

切到右侧 **Properties** 面板，用 **Styles** 承载字体和渐变（Variables 不支持渐变和完整 TextStyle）。

### 4.1 建 Text Styles（字体）

右侧面板底部找 **Text** → 点 4 个点的图标 → `+` 新建 Style。

按骨架逐个建，命名用语义：

```
Style 名             字号 / 字重
font/display-lg     28 / semibold
font/headline       24 / bold
font/title-xl       20 / semibold
font/title-lg       18 / semibold
font/title-md       17 / semibold
font/title          16 / semibold
font/title-sm       15 / semibold
font/body-lg        14 / regular
font/body-lg-strong 14 / semibold
font/body           13 / regular
font/caption        12 / regular
font/label          11 / regular
font/badge          10 / regular
font/badge-sm       9  / semibold
```

> 建 Style 时：选个文字图层设好字号字重 → 点 Text 面板的 `Create style` → 命名。

### 4.2 建 Fill Styles（渐变）

右侧 **Fill** → 点 `Style` 的 4 点图标 → `+` 新建。

```
Style 名                 渐变值
gradient/brand-primary   #00D8E0 → #00AFBE
gradient/brand-button    #00E0C7 → #00BCCE → #00AFBE
gradient/indigo-button   #4A56D9 → #717DFF
gradient/banner          #4D5CFF → #A8A8FF
gradient/red-button      #FF7B5E → #FF5C71
gradient/aitab           #21DAE3 → #3EEEDA → #1DC8DF
```

> ✅ 字体和渐变 Styles 建完。

---

## 第 5 步：建立 Effect Styles（阴影）

右侧 **Effects**（下方面板）→ 点 `Style` 4 点 → `+` 新建 Drop shadow Style。

```
Style 名                  阴影参数
shadow/card              color #E6EAEE@50%, offset(0,3), blur 6
shadow/subtle            color #08000000, offset(0,1), blur 2
shadow/selected-chip     color #38B4CCCC, offset 按需, blur 按需
shadow/chat-icon         color #B3E2ECFF
shadow/chat-panel        color #299AA3B2
```

> ✅ 阴影 Styles 建完。到这里 Token 系统全部定义完成。

---

## 第 6 步：建立资产组件库（Assets）

切到 `02 Components` 页。

### 6.1 导入现有图片资产

把 `assets/images/` 下的图片（1x 版本）拖进 Figma 画布。

### 6.2 创建 Components

每张图选中 → 右键 **Create component**（或 `Ctrl+Alt+K` / `Cmd+Option+K`）。

**命名严格按代码前缀域**（与 `app_assets.dart` 一一对应）：

```
home/mascot
home/mood-great
home/tool-breath
ic/back-arrow
ic/default-avatar
tab/home-normal
tab/home-selected
login/wechat
login/mascot
mine/settings
message/conversation
ai/deer-greeting
consult/avatar-1
quick/breath
...
```

> 命名用斜杠分组，Figma Assets 面板会自动按层级展示，方便产品/工程师查找。

### 6.3 发布组件库

左上角菜单 **Assets** → 打开面板 → 点 `Publish`，把组件库发布为团队 Library。
这样产品画原型时能直接从 Assets 拖用。

---

## 第 7 步：验证 Token 系统（Playground）

切到 `03 Playground` 页，画几个测试页面验证 Token 是否够用。

**验证清单**（每个都画一下，确认有对应 Token）：

- [ ] 一张标准卡片（用 `bg/card` + `radius/md` + `shadow/card` + `text/primary`）
- [ ] 一个主按钮（用 `gradient/brand-button` + `radius/full` + `size/button-h` + `font/title`）
- [ ] 一个价格行（用 `price/500` + `font/headline`）
- [ ] 一条分割线（用 `divider/default`）
- [ ] 一个空状态（用 `bg/page` + `text/tertiary`）

**如果画的时候发现某个视觉找不到 Token** → 这就是缺口，补一个新 Token（记录在映射表里标注"新增"）。

---

## 第 8 步：产出映射表（关键交付物）

打开 `.ai/token-target-system.md`，每个 Token 都标了"吸收的旧 Token"。把这份整理成映射表。

新建文件 `.ai/token-migration-map.md`，格式：

```markdown
# Token 迁移映射表

## 颜色

| 旧 Token (core/theme) | 新 Token (Figma) | 动作 |
|---|---|---|
| brandTeal | brand/500 | 重命名 |
| accentTeal | brand/600 | 重命名+合并 |
| priceRed | price/500 | 重命名 |
| badgeRed | badge/500 | 重命名 |
| counselorBadgeRed | badge/500 | 合并(删除) |
| dividerDark | divider/strong | 重命名 |
| lightPurpleDivider | divider/on-light | 重命名 |
| chatCardDivider | divider/on-light | 合并(删除) |
| loginTopPicWidth(143) | — | 踢出(下沉页面) |

## 尺寸
...

## 字体
...
```

**动作分类**：
- `重命名`：值不变，只改语义名
- `合并(删除)`：多个旧值归到一个新值，冗余的删掉
- `踢出(下沉页面)`：页面级参数，移出 Token 体系
- `新增`：骨架里没有、验证时发现要补的

> 这张表是工程师重构 `core/theme/` 的依据，必须完整。

---

## 第 9 步：交付

交付 4 样东西给工程师：

1. **Figma 文件** `Kelul Design System`（已发布 Library）
2. **映射表** `.ai/token-migration-map.md`
3. **视觉规范** `.ai/design-spec.md`（Token 用法说明，每个分组的用途）
4. **决策清单勾选**（`.ai/token-audit.md` 第六节完成勾选）

工程师拿着映射表重构 `lib/core/theme/`，做全局引用替换。

---

## 常见问题

**Q：Figma Variables 和 Styles 有什么区别？**
A：Variables 存原始值（颜色、数字），Styles 存组合样式（字体=字号+字重+颜色、渐变、阴影）。两者配合用：Variable 引用到 Style 里。

**Q：斜杠命名（brand/500）在 Figma 里怎么用？**
A：直接在变量名里打斜杠，Figma 会自动按层级分组显示，便于组织。

**Q：后期怎么和代码同步？**
A：两种方式。① 人工：设计师改 Token 同步改 `core/theme/`（靠映射表+纪律）。② 自动：装 Tokens Studio 插件，导出 JSON，工程用 Style Dictionary 转 Dart。建议稳定后升级到方式②。

**Q：现有页面已经用了旧 Token，重构会不会乱？**
A：不会。工程师按映射表做全局查找替换，IDE 能批量改。踢出的页面级参数需要逐个页面下沉，工作量稍大但可控。
