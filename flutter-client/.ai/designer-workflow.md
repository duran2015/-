# 设计师协作工作流

> 本文件告诉你（设计师）：在整个产品迭代中**你做什么、怎么做、怎么交付**。
> 你的主场是 **Figma**，**不写代码、不操作 git**。你的产出通过 Figma + 文件交付给 PM，由 PM 落地为 Flutter 代码。
> 配合 `.ai/figma-setup-guide.md`（Figma 具体操作）、`.ai/token-target-system.md`（目标 Token 骨架）使用。

---

## 一、你的角色

- 你是产品的**视觉上游**，且**最先开工**——先定义 Token，PM 才能搭原型
- ① 你定义 Token → ② PM 基于 Token 搭原型 → ③ 你基于原型+Token 做正式设计图 → ④ PM 按设计图落地代码
- 你与代码之间通过 **Figma** 沟通，不直接编辑代码库

你不负责：写 Flutter 代码、操作 git、业务规则、接口、原生工程。

---

## 二、整体协作流程

```
① 你定义 Design Token 系统（视觉地基，最先做）
   • 读 .ai/token-audit.md（现状）
   • 读 .ai/token-target-system.md（目标骨架）
   • 按 .ai/figma-setup-guide.md 在 Figma 搭 Token
        ↓ Token 体系就绪，PM 开始搭原型
② PM 基于 Token 约定搭原型（只用已定义 Token，不硬编码）
        ↓ PM 给你截图 / 录屏 / 可跑原型链接
③ 你基于原型 + Token 约定，做正式设计图         ← 你也在这里
   • 应用 Token、优化视觉、交互方案、图片、状态视觉
        ↓ 你交付（见第四节）
④ PM 按你的设计图落地 Flutter 代码 + 图片入库
        ↓
⑤ 工程师接真实接口 / 业务规则
        ↓
线上产品（循环迭代）
```

> ⚠️ 顺序很重要：**Token 是地基，必须最先做**。没有 Token，PM 无法搭出视觉规范的原型。

---

## 三、你要做的事（两个阶段）

### 阶段①：定义 Design Token（最先做）

**这是你的第一优先任务，PM 等你的 Token 才能搭原型。**

1. 读上下文（首次必读）：
   - `.ai/design-agent-rules.md`（你的工作约束）
   - `.ai/token-audit.md`（现有 Token 的问题）
   - `.ai/token-target-system.md`（目标 Token 骨架）
   - `.ai/figma-setup-guide.md`（Figma 操作手册）
2. 在 Figma 搭 Token 系统（按 figma-setup-guide.md 的 9 步）：
   - 颜色（品牌色阶、语义色、文字、背景、分割线、阴影）
   - 尺寸（间距阶、圆角阶、组件尺寸）
   - 字体（字号阶、字重）
   - 资产命名约定
3. 产出 `.ai/design-spec.md`（Token 清单与用法）
4. 交付：Figma Token 库 + design-spec，通知 PM 可以搭原型

> Token 不求一次完美。PM 搭原型 / 你做设计图时发现缺口，回头补 Token 即可。

### 阶段③：基于原型 + Token 做正式设计图

**PM 搭完原型（基于你的 Token）后，你做正式设计图。**

1. 审阅 PM 给的原型截图 / 录屏
2. 在 Figma 做正式设计图：
   - **应用 Token**：所有视觉值引用 Variables/Styles，不写散值
   - **页面视觉**：优化间距、对齐、层级、密度
   - **交互方案**：转场、反馈、微交互、动画（在 Figma 原型里体现）
   - **状态视觉**：补全 loading / empty / error / done 各状态
   - **图片资产**：产出图标、插画、背景、占位图
3. 交付（见第四节）

> ⚠️ 你做的是**视觉设计**。若发现 PM 的页面结构/信息架构有体验问题，作为"体验建议"提出来，由 PM 决定是否调整——不要擅自在 Figma 里大改结构。

---

## 四、交付物清单（每次精修完成后）

交付给 PM（通过飞书/共享文件夹），包含 3 部分：

### 1. Figma 交付

- 精修后的 Figma 页面链接（含标注、间距、颜色、字号）
- 交互原型（转场、反馈、状态切换）
- 涉及的 Token 变更清单（如有）

### 2. 图片资产（如有新增/修改）

- 图片源文件 + 多倍图（1x / 2x / 3x）
- **资产清单**（便于 PM 入库登记）：

```
文件名                       用途              尺寸
home_new_banner.png         首页顶部横幅      750×240
home_new_banner@2x.png      （2 倍图）        1500×480
home_new_banner@3x.png      （3 倍图）        2250×720
```

命名规则：与代码 `app_assets.dart` 前缀域一致（`home_` / `ic_` / `tab_` / `login_` / `mine_` / `message_` / `chat_` / `ai_` / `consult_` / `quick_`）。
格式：位图 PNG（透明优先），矢量图标 SVG。

### 3. 交接说明

```
本次精修范围：
- 首页卡片视觉（features/home/home_page.dart）
- 咨询师列表交互（features/consultant/consultant_list_page.dart）

需 PM 落地：
- 卡片间距从硬编码改为 space/md
- 新增图片：home_new_banner（1x/2x/3x 已附，请入库）
- loading 态视觉：见 Figma "Home/Loading" 帧

需工程接入：
- 列表下拉刷新动画需底层组件支持（请 PM 转达工程师）
```

---

## 五、图片资产怎么给 PM

你不进 git，图片通过以下方式交给 PM：

- **飞书/IM**：直接发文件（适合少量图片）
- **共享文件夹**（iCloud / 坚果云 / 飞书云空间）：批量图片放目录，PM 自取

> 关键：附上"资产清单"（文件名/用途/尺寸），PM 才能正确入库并登记 `app_assets.dart`。
> PM 入库流程：把 1x 放 `assets/images/`，2x 放 `2.0x/`，3x 放 `3.0x/`，然后在 `app_assets.dart` 加常量。

---

## 六、与 PM 的接力节奏

| 时机 | 你做什么 | PM 做什么 |
|---|---|---|
| PM 搭完骨架 | 收到截图/原型 → 审阅 | 等你反馈 |
| 你精修中 | Figma 精修 + 产出 | 继续其他页面 |
| 你交付后 | 等待 | 按你的稿落地代码 + 图片入库 |
| PM 落地后 | 收到新截图 → 复核视觉 | 等你确认 |

> 遇到结构问题随时提出，不用憋到交付。视觉问题用 Figma 评论标注最清晰。

---

## 七、Token 变更怎么处理

如果你新增/修改了 Design Token：

1. 在 Figma Variables/Styles 里改
2. 在交付的"Token 变更清单"里列出：
   ```
   新增：brand/100（#E0F7FA，卡片 hover 底）
   修改：text/primary（#222222 → #1A1A1A，对比度提升）
   删除：chatCardDivider（并入 divider/on-light）
   ```
3. PM 据此同步到代码 `lib/core/theme/`
4. **影响面**：列出受影响的页面/组件，让 PM 评估改动范围

---

## 八、常见问题

**Q：PM 落地的代码和我的 Figma 不一致怎么办？**
A：让 PM 给你跑起来的截图/录屏，对照 Figma 评论标注差异，PM 修正。

**Q：我发现某个视觉找不到对应 Token？**
A：这是 Token 缺口。新增一个 Token（在 Figma），并在交付清单里标注"新增"。

**Q：图片要改，但已经入库了？**
A：你产出新图交给 PM，PM 替换 `assets/images/` 里的文件（文件名保持不变即可，代码不用改）。

**Q：我想改某个页面的结构（不是视觉）？**
A：作为"体验建议"写在交接说明里，PM 决定是否调整。不要擅自在 Figma 大改结构造成与代码脱节。

**Q：需要看代码现状怎么办？**
A：让 PM 给你截图/录屏，或跑 Mock 模式的可跑原型。你不需要读代码。
