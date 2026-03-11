# 需求文档：LIFE COMPASS — ND/HSP 能量感知生活操作系统

## 简介

LIFE COMPASS 是一款面向神经多样性（ND）及高敏感人群（HSP）的独立全功能 Web 应用。本系统以「能量」为核心变量，围绕用户一天的真实生活流程组织所有功能模块，而非按 Notion 页面平铺罗列。

核心设计哲学：
- 能量是变量而非常量——它是用户每天第一个交互的对象
- 崩溃预防 SOP 从任何界面一键可达（浮动按钮）
- 所有录入优先选择式输入，降低认知负荷
- 模块按使用频率分层：每日 → 每周 → 每月 → 按需
- 系统层级：愿景 → OKR → 项目 → 任务 → 每日习惯 → 能量基底
- 低能量时（≤2）Dashboard 自动简化，只显示最核心功能

## 系统架构

### 分层结构

系统按用户使用频率和紧急程度分为 9 层：

| 层级 | 名称 | 使用频率 | 说明 |
|------|------|----------|------|
| Layer 0 | 🚨 紧急救援 | 随时可达 | 崩溃预防 SOP + 感官急救，浮动按钮从任何界面一键触达 |
| Layer 1 | ⚡ 每日驾驶舱 | 每日 | Dashboard 主页：能量签到、今日习惯、任务推荐、节律蓝图、快捷录入、预警提醒 |
| Layer 2 | 🔄 执行引擎 | 每周/按需 | GTD（收件箱→项目→任务）、SOP PDCA 循环、OKR 目标管理、内容创作管线 |
| Layer 3 | 🏋️ 身体与健康 | 每日追踪+每周规划 | 健身、营养膳食、医疗健康、冥想正念 |
| Layer 4 | 📚 知识与成长 | 每周/按需 | 知识库（9 类型）、R.I.A. 阅读系统、学习追踪 |
| Layer 5 | 🌟 愿景与身份 | 每月/每季度 | 人生愿景、自我定义、显化愿景板、里程碑、目标愿景板 |
| Layer 6 | 💰 生活事务 | 按需 | 财务（含愿望清单）、库存（含护肤）、活动与旅行规划 |
| Layer 7 | 🎨 收藏与灵感 | 休闲时 | 观看清单、时装秀画廊、媒体收藏 |
| Layer 8 | 📊 洞察与复盘 | 每周/每月 | 能量模式分析、触发源报告、周复盘、模块使用审计、录入决策树 |

### 模块关联关系

```
愿景与身份 (Layer 5)
  └── OKR 目标 (Layer 2)
        └── 项目 (Layer 2 GTD)
              └── 任务 (Layer 2 GTD) ──── 能量维度标注
                    └── 每日习惯 (Layer 1)
                          └── 能量签到 (Layer 1) ← 基底

身体与健康 (Layer 3) ←→ 每日习惯 (Layer 1)  [健身/营养习惯出现在每日打卡中]
知识与成长 (Layer 4) ←→ 任务 (Layer 2)       [阅读行动转化为任务]
库存 (Layer 6)       ──→ Dashboard (Layer 1)  [低库存提醒]
财务 (Layer 6)       ──→ Dashboard (Layer 1)  [预算预警]
紧急救援 (Layer 0)   ←── 能量预警 (Layer 1)   [能量≤2 自动提示跳转]
洞察与复盘 (Layer 8) ←── 所有层级数据         [汇总分析]
```

### 用户每日流程

```
起床 → 晨间能量签到(1-5) → 查看 Dashboard
  → 看今日习惯清单 + 能量匹配任务推荐
  → 执行任务/习惯
  → 午间能量签到
  → [如能量下降] 查看恢复建议 / 触发急救 SOP
  → 午后能量签到
  → 继续执行 / 进入低能量模式
  → 晚间能量签到 + 完成剩余习惯打卡
  → 写日记 / 记录情绪
  → 结束
```

### 用户每周流程

```
周末 → 查看能量周报（Layer 8）
  → 回顾本周习惯完成率
  → 检查 OKR 进度
  → 规划下周膳食 + 生成购物清单
  → 调整下周任务优先级
  → 撰写每周反思
```

## 术语表

- **App**：LIFE COMPASS 独立 Web 应用程序
- **Dashboard**：每日驾驶舱，App 的主页面，聚合每日核心操作入口
- **Energy_Level**：能量等级，1-5 整数刻度（1=极低，2=低，3=稳定，4=良好，5=峰值）
- **Energy_Check_In**：能量签到，用户在特定时段记录当前能量等级的操作
- **Energy_Drain_Event**：能量消耗事件，导致用户能量显著下降的具体事件记录
- **Energy_Pattern**：能量模式，基于历史签到数据识别出的用户个人能量波动规律
- **Crash_Prevention_SOP**：崩溃预防 SOP，最多 3 步的紧急恢复流程
- **Sensory_First_Aid_Kit**：感官急救包，按严重程度分级的恢复菜单
- **Daily_Tracker**：每日追踪模块（合并原 Daily_Check_In + Habit_Tracker），管理习惯打卡、情绪记录、日记
- **Execution_Engine**：执行引擎（合并原 GTD + SOP + OKR + 内容创作），统一的任务/项目/目标管理
- **GTD_Manager**：GTD 子模块，收件箱→项目→任务
- **SOP_Engine**：SOP 子模块，PDCA 循环（WRITE_PLAN → PLAN → DO → CHECK）
- **OKR_Manager**：OKR 子模块，目标→关键结果→目标周期
- **Content_Pipeline**：内容创作子模块，多平台内容管线
- **Body_Wellness**：身体与健康模块（合并原 Fitness + Nutrition + Health + Meal Planner + Workout Library）
- **Fitness_Sub**：健身子模块，目标/训练计划/运动库/身体数据/里程碑
- **Nutrition_Sub**：营养膳食子模块，BMR 计算/膳食规划/食谱/食材/购物清单
- **Health_Sub**：医疗健康子模块，预约/药物
- **Knowledge_Growth**：知识与成长模块（合并原 Knowledge_Manager + RIA_Reading_System）
- **Knowledge_Base**：知识库子模块，9 种类型，状态流转
- **RIA_Reading**：R.I.A. 阅读子模块，Read→Interpret→Apply，含书籍追踪
- **Vision_Identity**：愿景与身份模块（合并原 Goals_Vision_Board + Mood_Board）
- **Life_Admin**：生活事务模块（合并原 Finance + Inventory + Skincare + Wishlist + Activity Planner）
- **Finance_Sub**：财务子模块，收入/支出/愿望清单
- **Inventory_Sub**：库存子模块，物品/护肤品/库存预警
- **Collections**：收藏与灵感模块（合并原 Fashion_Gallery + Watchlist）
- **Insights_Review**：洞察与复盘模块，能量分析/触发源报告/周复盘/审计/决策树
- **Task_Energy_Dimension**：任务能量维度，认知负荷/启动难度/适配能量状态
- **Task_Matcher**：任务匹配器，根据当前能量推荐适配任务
- **Decision_Tree**：决策树，≤3 层引导用户判断「该记录到哪里」
- **Daily_Routine**：每日节律蓝图，理想日常节奏模板
- **Trigger_Record**：触发源记录，导致感官过载或情绪崩溃的触发因素
- **Severity_Level**：严重程度等级（轻度/中度/重度）
- **PDCA_Cycle**：PDCA 循环（WRITE_PLAN → PLAN → DO → CHECK）
- **Cognitive_Load**：认知负荷（低/中/高）
- **Startup_Difficulty**：启动难度（轻松启动/需要仪式感）
- **Suitable_Energy_State**：适配能量状态（峰值/稳定/低能量可做）

## 需求

---

### 需求 1：应用架构与全局体验（Layer 全局）

**用户故事：** 作为 ND/HSP 用户，我希望拥有一个独立的 Web 应用，其导航和交互方式针对认知负荷优化，以便我能在不同能量状态下都能顺畅使用。

#### 验收标准

1. THE App SHALL 作为独立 Web 应用运行，提供用户注册和登录功能
2. THE App SHALL 提供响应式布局，支持桌面端和移动端浏览器访问
3. THE App SHALL 提供侧边栏导航，按 Layer 0-8 的分层结构组织所有模块入口
4. THE App SHALL 在侧边栏中以视觉分组区分每日使用（Layer 0-1）和低频使用（Layer 5-8）的模块
5. THE App SHALL 允许用户自定义侧边栏中模块的显示顺序和可见性
6. THE App SHALL 在所有数据录入表单中优先使用选择式输入（下拉菜单、单选按钮、多选复选框）而非自由文本输入
7. THE App SHALL 为所有必填字段提供合理的默认值
8. THE App SHALL 在所有模块中提供一致的交互模式和视觉风格
9. THE App SHALL 提供一个全局浮动按钮，从任何界面一键跳转至 Crash_Prevention_SOP（Layer 0 紧急救援）
10. THE App SHALL 将所有用户数据持久化存储至数据库，并支持 JSON 格式的数据导入和导出
11. WHEN 用户执行数据导入时，THE App SHALL 在导入前展示数据预览，并要求用户确认后再执行
12. IF 数据导入过程中发生错误，THEN THE App SHALL 回滚所有已导入的数据并向用户展示错误详情

---

### 需求 2：紧急救援（Layer 0）

**用户故事：** 作为 ND/HSP 用户，我希望在感官过载或情绪崩溃时能获得一个无需思考的急救流程和分级恢复菜单，以便我在认知能力受损时仍能执行恢复步骤。

#### 验收标准

1. THE Crash_Prevention_SOP SHALL 提供一个最多包含 3 个步骤的紧急恢复流程，每个步骤使用不超过 10 个字的简短指令
2. THE Crash_Prevention_SOP SHALL 提供默认的 3 步急救流程（步骤 1：离开当前环境；步骤 2：启动感官安抚；步骤 3：设定恢复计时器）
3. THE Crash_Prevention_SOP SHALL 允许用户自定义每个步骤的具体内容
4. WHEN 用户触发 Crash_Prevention_SOP 时，THE App SHALL 以全屏、大字体（不小于 32px）、高对比度模式展示每个步骤
5. THE Sensory_First_Aid_Kit SHALL 提供三个 Severity_Level 的恢复菜单：轻度（5-15 分钟自我调节）、中度（15-45 分钟恢复+建议取消低优先级安排）、重度（45 分钟以上深度恢复+建议清空当日剩余安排）
6. THE Sensory_First_Aid_Kit SHALL 允许用户为每个 Severity_Level 自定义恢复活动列表
7. WHEN 用户完成恢复流程后，THE Sensory_First_Aid_Kit SHALL 提示用户进行一次能量签到以记录恢复效果
8. WHEN 用户使用 Crash_Prevention_SOP 或 Sensory_First_Aid_Kit 后，THE App SHALL 引导用户创建一条 Trigger_Record（选择式输入：触发类别、严重程度、使用的恢复方案，可选描述文本）

---

### 需求 3：能量签到与预警（Layer 1 核心）

**用户故事：** 作为 ND/HSP 用户，我希望每天在多个时段记录能量水平并在能量危险时获得主动提醒，以便我能感知能量变化趋势并在崩溃前采取预防措施。

#### 验收标准

1. THE Dashboard SHALL 作为 App 的默认首页，能量签到为首要交互入口
2. THE Energy_Check_In SHALL 提供四个固定签到时段：晨间、午间、午后、晚间
3. WHEN 用户进行能量签到时，THE Energy_Check_In SHALL 接受 1-5 整数刻度作为 Energy_Level 输入，并以颜色编码和表情符号直观展示各等级含义
4. WHEN 用户完成能量签到时，THE Energy_Check_In SHALL 将记录存储至数据库（日期、时段、Energy_Level）
5. THE Dashboard SHALL 以时间线形式展示当日所有已完成的能量签到
6. IF 用户在某一时段未完成签到，THEN THE Energy_Check_In SHALL 在该时段结束前发送一次提醒
7. WHEN 用户签到的 Energy_Level ≤ 2 时，THE App SHALL 立即触发能量预警通知，并提供直接跳转至 Crash_Prevention_SOP 的链接
8. WHEN 用户在同一天内连续两个时段的 Energy_Level 下降时，THE App SHALL 触发能量下降趋势预警
9. THE App SHALL 允许用户自定义预警阈值（默认值为 Energy_Level ≤ 2）
10. WHEN 用户随时标记 Energy_Drain_Event 时，THE Energy_Check_In SHALL 提供选择式输入：消耗程度（轻微/中等/严重）、事件类别（社交/感官/认知/情绪/体力，多选），以及可选描述文本
11. THE Dashboard SHALL 在当日时间线中将 Energy_Drain_Event 与能量签到记录一并展示

---

### 需求 4：每日追踪（Layer 1 — 合并原每日签到 + 习惯追踪）

**用户故事：** 作为 ND/HSP 用户，我希望在一个统一界面完成每日习惯打卡、情绪记录和日记，以便我不需要在多个模块间切换来完成日常记录。

#### 验收标准

1. THE Daily_Tracker SHALL 提供统一的每日追踪界面，包含习惯打卡、情绪记录、日记三个区域
2. THE Daily_Tracker SHALL 提供习惯数据库，支持创建、编辑、删除习惯条目（名称、频率、目标描述）
3. THE Daily_Tracker SHALL 提供三个签到时段（早晨、午间、晚间），每个时段展示该时段关联的习惯供用户勾选
4. THE Daily_Tracker SHALL 允许用户从 8 种预设情绪中选择当前情绪状态
5. THE Daily_Tracker SHALL 允许用户撰写每日日记和记录通勤方式
6. THE Daily_Tracker SHALL 自动计算并展示当日习惯完成率和每个习惯的连续完成天数
7. WHEN 习惯连续完成达到预设天数时，THE Daily_Tracker SHALL 自动标记里程碑并展示用户预设的奖励
8. THE Daily_Tracker SHALL 提供每周自我反思功能，允许用户在每周末撰写习惯执行反思
9. THE Daily_Tracker SHALL 支持多种视图模式：表格、日历、看板、周统计、画廊
10. THE Dashboard SHALL 在首页展示今日习惯清单和完成进度

---

### 需求 5：能量匹配任务推荐（Layer 1）

**用户故事：** 作为 ND/HSP 用户，我希望系统根据我当前能量水平推荐适合执行的任务，以便我在低能量时段也能保持生产力而非完全停滞。

#### 验收标准

1. THE Task_Energy_Dimension SHALL 为 GTD_Manager 的任务新增属性：Cognitive_Load（低/中/高）、Startup_Difficulty（轻松启动/需要仪式感）、Suitable_Energy_State（峰值/稳定/低能量可做），默认值分别为中、轻松启动、稳定
2. WHEN 用户完成能量签到后，THE Task_Matcher SHALL 根据当前 Energy_Level 筛选并展示适配的待办任务列表
3. WHEN Energy_Level 为 1 或 2 时，THE Task_Matcher SHALL 仅展示 Suitable_Energy_State 为「低能量可做」且 Startup_Difficulty 为「轻松启动」的任务
4. WHEN Energy_Level 为 3 时，THE Task_Matcher SHALL 展示 Suitable_Energy_State 为「低能量可做」或「稳定」的任务
5. WHEN Energy_Level 为 4 或 5 时，THE Task_Matcher SHALL 展示所有待办任务，并将 Cognitive_Load 为「高」的任务置顶推荐
6. THE Task_Matcher SHALL 在推荐列表中以视觉标识区分不同 Cognitive_Load 等级的任务
7. IF 当前 Energy_Level 下无适配任务，THEN THE Task_Matcher SHALL 展示「当前无适配任务，建议进入恢复模式」的提示，并提供跳转至 Sensory_First_Aid_Kit 的链接
8. THE Dashboard SHALL 在首页展示当前能量状态下的推荐任务摘要

---

### 需求 6：每日节律蓝图与 Dashboard 聚合（Layer 1）

**用户故事：** 作为 ND/HSP 用户，我希望 Dashboard 能聚合今日节律蓝图、快捷录入按钮和各类预警提醒，以便我在一个界面掌握全天安排。

#### 验收标准

1. THE Daily_Routine SHALL 提供节律蓝图编辑功能，支持定义早晨、下午、晚间、周末、月度、季度、年度的理想节律
2. WHEN 用户编辑节律蓝图时，THE Daily_Routine SHALL 允许为每个时间段添加活动条目（活动名称、建议时间、备注）
3. THE Dashboard SHALL 展示当日适用的节律蓝图（工作日展示早晨/下午/晚间，周末展示周末节律）
4. THE Dashboard SHALL 提供快捷添加按钮：新任务、新笔记、新支出、新能量消耗事件
5. THE Dashboard SHALL 聚合展示以下预警信息：低库存物品提醒、即将到来的医疗预约、能量预警
6. WHILE 用户当前 Energy_Level ≤ 2 时，THE Dashboard SHALL 以简化模式展示，仅显示能量签到、任务推荐和急救 SOP 入口
7. WHILE 用户处于 Dashboard 视图中，THE Dashboard SHALL 隐藏所有低频模块（Layer 5-8）的入口，以减少视觉噪音

---

### 需求 7：执行引擎 — GTD 任务与项目管理（Layer 2）

**用户故事：** 作为用户，我希望通过 GTD 方法论管理项目和任务（含能量维度），以便我能系统化地推进工作并追踪进度。

#### 验收标准

1. THE GTD_Manager SHALL 提供收件箱，展示所有未分类的新输入条目
2. THE GTD_Manager SHALL 提供项目数据库（名称、描述、状态、截止日期），支持关联任务、知识条目和 OKR 关键结果
3. THE GTD_Manager SHALL 提供任务数据库（名称、描述、状态、优先级、截止日期、所属项目、能量维度字段）
4. THE GTD_Manager SHALL 支持任务状态流转：待办 → 计划 → 进行中 → 暂停/已完成
5. WHEN 用户创建新任务时，THE GTD_Manager SHALL 在创建表单中展示 Task_Energy_Dimension 字段（Cognitive_Load、Startup_Difficulty、Suitable_Energy_State）并预填默认值
6. THE GTD_Manager SHALL 提供项目概览视图，展示所有项目及其关联任务的完成进度
7. THE GTD_Manager SHALL 支持按状态和优先级筛选任务列表

---

### 需求 8：执行引擎 — SOP PDCA 循环（Layer 2）

**用户故事：** 作为用户，我希望拥有一个基于 PDCA 循环的执行引擎，以便我能系统化地管理从计划到复盘的完整工作流。

#### 验收标准

1. THE SOP_Engine SHALL 支持 PDCA_Cycle 的四个阶段：WRITE_PLAN → PLAN → DO → CHECK
2. WHEN 用户创建新的 SOP 条目时，THE SOP_Engine SHALL 将其初始状态设为 WRITE_PLAN
3. WHEN 用户推进 SOP 条目的阶段时，THE SOP_Engine SHALL 按 WRITE_PLAN → PLAN → DO → CHECK 的顺序流转状态
4. THE SOP_Engine SHALL 提供按阶段分组的视图：收件箱（WRITE_PLAN）、执行中（DO）、复盘（CHECK）
5. THE SOP_Engine SHALL 在复盘视图中支持用户记录复盘结论

---

### 需求 9：执行引擎 — OKR 目标管理（Layer 2）

**用户故事：** 作为用户，我希望通过 OKR 系统将宏观目标分解为可衡量的关键结果，以便我能按周期追踪目标进展。

#### 验收标准

1. THE OKR_Manager SHALL 提供三个关联数据库：目标（Objectives）、关键结果（Key Results）、目标周期（Goal Periods）
2. WHEN 用户创建目标时，THE OKR_Manager SHALL 要求填写目标名称、描述、所属目标周期
3. WHEN 用户创建关键结果时，THE OKR_Manager SHALL 要求填写描述、目标值、当前值、所属目标
4. THE OKR_Manager SHALL 自动计算每个目标的完成进度（基于关联关键结果的完成百分比）
5. THE OKR_Manager SHALL 提供目标周期视图，展示该周期内所有目标及其关键结果的进度概览
6. THE OKR_Manager SHALL 允许 GTD_Manager 中的项目关联至关键结果

---

### 需求 10：执行引擎 — 内容创作管线（Layer 2）

**用户故事：** 作为用户，我希望管理多平台内容创作流程，以便我能系统化地规划、创作和发布内容。

#### 验收标准

1. THE Content_Pipeline SHALL 提供四个关联数据库：内容库、任务库、平台库、资源库
2. WHEN 用户创建内容条目时，THE Content_Pipeline SHALL 要求填写：标题、平台（小红书/微信/知识星球/YouTube，多选）、状态（构思/草稿/审核/已发布）、发布日期
3. THE Content_Pipeline SHALL 允许为每个内容条目创建关联的创作任务
4. THE Content_Pipeline SHALL 支持按平台和状态筛选内容列表
5. THE Content_Pipeline SHALL 在平台库中管理各平台的账号信息和发布规范

---

### 需求 11：身体与健康 — 健身（Layer 3）

**用户故事：** 作为用户，我希望全面管理健身目标、训练计划、运动库和身体数据，以便我能科学地追踪健身进展。

#### 验收标准

1. THE Fitness_Sub SHALL 提供健身目标设定功能（体重目标、腰围目标）
2. THE Fitness_Sub SHALL 提供训练计划数据库，支持创建、编辑、删除训练计划
3. THE Fitness_Sub SHALL 提供训练统计功能，记录每次训练的日期、类型、时长、强度
4. THE Fitness_Sub SHALL 提供身体数据记录功能（体重、腰围、体脂率等指标及日期）
5. WHEN 用户记录新的身体数据时，THE Fitness_Sub SHALL 以折线图展示该指标的历史趋势
6. THE Fitness_Sub SHALL 提供运动库（运动名称、目标肌群、动作描述、难度等级、所需器材），支持按肌群和难度筛选
7. THE Fitness_Sub SHALL 允许训练计划引用运动库中的运动条目
8. THE Fitness_Sub SHALL 提供健身里程碑功能，支持创建和标记已达成的里程碑

---

### 需求 12：身体与健康 — 营养膳食（Layer 3）

**用户故事：** 作为用户，我希望基于科学的营养计算规划每周膳食并自动生成购物清单，以便我能保持均衡的饮食结构。

#### 验收标准

1. THE Nutrition_Sub SHALL 基于用户输入的 BMR 自动计算每日目标热量（BMR × 1.5），并按碳水:蛋白质:脂肪 = 4:3:3 计算各营养素目标克数
2. THE Nutrition_Sub SHALL 提供每周膳食计划视图，支持为每天的早/午/晚餐分配食谱
3. THE Nutrition_Sub SHALL 提供食谱数据库（食材列表、制作步骤、热量和营养素信息）
4. THE Nutrition_Sub SHALL 提供食材数据库（名称、单位热量、营养素含量）
5. WHEN 用户完成一周膳食计划后，THE Nutrition_Sub SHALL 自动生成该周所需食材的购物清单，合并相同食材并汇总数量
6. THE Nutrition_Sub SHALL 提供冥想与正念记录功能（日期、时长、类型、感受）

---

### 需求 13：身体与健康 — 医疗健康（Layer 3）

**用户故事：** 作为用户，我希望管理医疗预约和药物信息，以便我能系统化地追踪健康相关事务。

#### 验收标准

1. THE Health_Sub SHALL 提供医疗预约数据库（日期、时间、医生/科室、地点、备注）
2. THE Health_Sub SHALL 提供药物数据库（药物名称、剂量、频率、开始日期、结束日期）
3. IF 药物记录的结束日期已过，THEN THE Health_Sub SHALL 将该药物标记为「已停用」状态
4. THE Health_Sub SHALL 将即将到来的医疗预约推送至 Dashboard 预警区域

---

### 需求 14：知识与成长（Layer 4 — 合并原知识管理 + R.I.A. 阅读系统）

**用户故事：** 作为用户，我希望在一个统一模块中管理所有知识条目和阅读活动，以便我能系统化地积累知识并将阅读转化为行动。

#### 验收标准

1. THE Knowledge_Base SHALL 提供知识数据库，支持 9 种类型：书籍、文章、视频、课程、节目、电影、网站、想法、系统
2. WHEN 用户创建知识条目时，THE Knowledge_Base SHALL 要求填写：标题、类型、状态（待处理/进行中/已完成/已归档）、来源、备注
3. THE Knowledge_Base SHALL 支持状态流转：待处理 → 进行中 → 已完成 → 已归档
4. THE Knowledge_Base SHALL 允许知识条目关联至 GTD_Manager 中的任务和项目
5. WHEN 知识条目类型为「书籍」时，THE RIA_Reading SHALL 为该条目提供 R.I.A. 三阶段笔记功能（Read 摘录、Interpret 解读、Apply 应用）
6. THE RIA_Reading SHALL 在 Apply 阶段支持创建行动调整条目，关联至具体的阅读笔记
7. THE Knowledge_Base SHALL 支持按类型和状态筛选知识列表

---

### 需求 15：愿景与身份（Layer 5 — 合并原目标愿景板 + 情绪板）

**用户故事：** 作为用户，我希望在一个统一空间定义人生愿景、自我身份和显化目标，以便我能保持对人生方向的清晰感并追踪显化进程。

#### 验收标准

1. THE Vision_Identity SHALL 提供以下子模块：人生愿景、自我定义、显化愿景板、里程碑与成就、目标愿景板（图片）
2. THE Vision_Identity SHALL 在人生愿景子模块中支持撰写和编辑人生愿景文本
3. THE Vision_Identity SHALL 在自我定义子模块中支持记录自我认知和身份定义框架
4. THE Vision_Identity SHALL 在显化愿景板子模块中包含以下维度：原型（Archetypes）、情感核心（Emotional Core）、生活节奏（Lifestyle Pace）、素材（Materials）、色彩方案（Color Palette）、阶段（Phases）
5. WHEN 用户创建每日显化任务时，THE Vision_Identity SHALL 将任务关联至显化愿景板的对应阶段
6. THE Vision_Identity SHALL 在里程碑子模块中支持创建和追踪人生里程碑
7. THE Vision_Identity SHALL 在目标愿景板子模块中支持上传图片并以画廊形式展示，允许将图片关联至目标

---

### 需求 16：生活事务 — 财务与愿望清单（Layer 6）

**用户故事：** 作为用户，我希望追踪收入支出并管理愿望清单，以便我能了解财务状况并做出合理的消费决策。

#### 验收标准

1. THE Finance_Sub SHALL 提供收入和支出记录功能（日期、金额、类型、类别、支付方式、备注）
2. THE Finance_Sub SHALL 提供月度汇总视图（当月总收入、总支出、净收入）
3. THE Finance_Sub SHALL 以图表形式展示各支出类别的占比分布
4. THE Finance_Sub SHALL 支持按类别和支付方式筛选交易记录
5. THE Finance_Sub SHALL 提供愿望清单功能（名称、预估价格、优先级、状态：想要/已购/已放弃），帮助用户在消费前进行理性评估

---

### 需求 17：生活事务 — 库存管理（Layer 6 — 合并原库存 + 护肤）

**用户故事：** 作为用户，我希望统一管理所有个人物品库存（包括护肤品），以便我能追踪物品状态并及时补充。

#### 验收标准

1. THE Inventory_Sub SHALL 提供物品数据库（名称、类别、品牌、库存状态、更换周期、购买链接）
2. THE Inventory_Sub SHALL 支持「护肤品」类别的扩展字段：使用频率、开封日期、保质期
3. THE Inventory_Sub SHALL 支持按类别和库存状态（充足/即将用完/已用完）筛选物品列表
4. WHEN 物品的库存状态为「即将用完」时，THE Inventory_Sub SHALL 在 Dashboard 中展示补充提醒
5. IF 护肤品已超过保质期，THEN THE Inventory_Sub SHALL 将该物品标记为「已过期」并在 Dashboard 中展示提醒

---

### 需求 18：生活事务 — 活动与旅行规划（Layer 6）

**用户故事：** 作为用户，我希望管理活动和旅行计划，以便我能系统化地组织出行并追踪预算。

#### 验收标准

1. THE Life_Admin SHALL 提供活动/旅行数据库（名称、日期、预算、同伴、地点、状态）
2. THE Life_Admin SHALL 为每个活动提供打包清单功能（添加、勾选、删除清单项）
3. THE Life_Admin SHALL 支持按状态（计划中/进行中/已完成/已取消）筛选活动列表

---

### 需求 19：收藏与灵感（Layer 7 — 合并原观看清单 + 时装秀画廊）

**用户故事：** 作为用户，我希望在一个统一空间管理影视、时装秀等媒体收藏，以便我能集中浏览和回顾各类灵感素材。

#### 验收标准

1. THE Collections SHALL 提供观看清单子模块，支持记录影视/播客作品（名称、类型、状态：想看/在看/已看、评分）
2. THE Collections SHALL 提供时装秀画廊子模块，支持记录时装秀（品牌、季节、年份、图片、备注），以画廊视图（图片网格）为默认展示
3. THE Collections SHALL 支持按类型、状态、品牌、季节等维度筛选记录

---

### 需求 20：洞察与复盘（Layer 8）

**用户故事：** 作为 ND/HSP 用户，我希望系统能基于历史数据生成能量分析报告、触发源分析，并提供录入决策树和模块审计，以便我能持续优化生活系统。

#### 验收标准

1. WHEN 用户累积至少 14 天签到数据后，THE Insights_Review SHALL 生成 Energy_Pattern 周报（各时段平均能量、最高/最低时段分布、最频繁消耗事件类别）
2. THE Insights_Review SHALL 以折线图展示过去 7 天各时段的能量趋势
3. WHILE 用户持续记录签到数据，THE Insights_Review SHALL 每周自动更新 Energy_Pattern 周报
4. WHEN 用户累积至少 10 条 Trigger_Record 后，THE Insights_Review SHALL 生成触发源分析报告（最频繁触发类别、严重程度分布）
5. THE Insights_Review SHALL 提供周复盘功能（对应 SOP CHECK 阶段），支持用户撰写每周总结
6. THE Decision_Tree SHALL 以不超过 3 层的树状结构引导用户从信息类型到目标模块的决策（首先询问类别：任务/知识/习惯/记录/其他，然后逐层筛选至唯一目标模块）
7. THE Decision_Tree SHALL 使用选择式交互（按钮点击），不要求用户输入文本
8. THE Decision_Tree SHALL 允许用户自定义决策路径和目标模块映射
9. THE Decision_Tree SHALL 在 Dashboard 提供快捷入口
10. THE Insights_Review SHALL 识别并列出功能重叠的模块对，为每对提供合并建议
