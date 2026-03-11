# 需求文档：ND/HSP 能量感知生存系统

## 简介

本功能为现有 LIFE COMPASS（Notion 生活操作系统）增加一套专为神经多样性（ND）及高敏感人群（HSP）设计的能量管理层。现有系统在任务管理、习惯追踪、情绪记录等方面已具备完善功能，但缺乏「能量维度」的感知与响应能力。ND/HSP 用户 80% 的任务阻塞并非因为任务不重要，而是当前神经状态与任务需求不匹配。本系统旨在通过四个阶段——能量追踪、崩溃预防与急救、任务能量匹配、系统瘦身——填补这一核心缺口，使 LIFE COMPASS 从「管理工具」进化为「能量感知型生存系统」。

## 术语表

- **Energy_Tracker**：能量追踪模块，负责记录用户全天多时段的能量水平及消耗事件
- **Energy_Level**：能量等级，使用 1-5 整数刻度表示用户当前能量状态（1=极低，2=低，3=稳定，4=良好，5=峰值）
- **Energy_Check_In**：能量签到，用户在特定时段记录当前能量等级的操作
- **Energy_Drain_Event**：能量消耗事件，导致用户能量显著下降的具体事件记录
- **Energy_Pattern**：能量模式，基于历史签到数据识别出的用户个人能量波动规律
- **Crash_Prevention_SOP**：崩溃预防标准操作程序，当能量降至危险水平时触发的预防性干预流程
- **Sensory_First_Aid_Kit**：感官急救包，感官过载或情绪触发后的分级恢复菜单
- **Trigger_Record**：触发源记录，记录导致感官过载或情绪崩溃的具体触发因素
- **Recovery_Protocol**：恢复协议，根据触发严重程度（轻度/中度/重度）提供的恢复步骤
- **Task_Energy_Dimension**：任务能量维度，为现有 GTD 任务附加的能量相关属性字段
- **Cognitive_Load**：认知负荷，任务所需的认知资源等级（低/中/高）
- **Startup_Difficulty**：启动难度，任务从零开始执行的阻力等级（轻松启动/需要仪式感）
- **Suitable_Energy_State**：适配能量状态，执行该任务所需的最低能量状态（峰值/稳定/低能量可做）
- **Task_Matcher**：任务匹配器，根据用户当前能量等级推荐适配任务的模块
- **System_Auditor**：系统审计模块，负责识别重叠模块并提供录入决策树的模块
- **Decision_Tree**：决策树，帮助用户快速判断「该记录到哪里」的引导流程
- **LIFE_COMPASS**：生活指南针，用户现有的 Notion 生活操作系统
- **LIFEMATRICES**：生活矩阵，现有系统中的每日签到表（含早/午/晚习惯、情绪追踪）
- **Severity_Level**：严重程度等级，触发事件的影响程度分级（轻度/中度/重度）

## 需求

### 需求 1：多时段能量签到

**用户故事：** 作为一名 ND/HSP 用户，我希望每天在多个时段记录我的能量水平，以便我能感知能量消耗的过程而非仅在崩溃后才意识到。

#### 验收标准

1. THE Energy_Tracker SHALL 提供四个固定签到时段：晨间、午间、午后、晚间
2. WHEN 用户进行能量签到时，THE Energy_Tracker SHALL 接受 1 至 5 的整数刻度作为 Energy_Level 输入（1=极低，2=低，3=稳定，4=良好，5=峰值）
3. WHEN 用户完成能量签到时，THE Energy_Tracker SHALL 将签到记录存储至能量签到数据库，包含日期、时段、Energy_Level 三个字段
4. THE Energy_Tracker SHALL 在签到界面以直观的视觉指示器（如颜色编码或表情符号）展示 1-5 各等级的含义
5. IF 用户在某一时段未完成签到，THEN THE Energy_Tracker SHALL 在该时段结束前发送一次提醒
6. WHEN 用户查看当日签到记录时，THE Energy_Tracker SHALL 以时间线形式展示当日所有已完成的能量签到

### 需求 2：能量消耗事件标记

**用户故事：** 作为一名 ND/HSP 用户，我希望能随时标记导致能量下降的事件，以便我能识别个人的能量消耗模式。

#### 验收标准

1. THE Energy_Tracker SHALL 允许用户在任意时间创建 Energy_Drain_Event 记录
2. WHEN 用户创建 Energy_Drain_Event 时，THE Energy_Tracker SHALL 要求用户填写以下字段：事件描述（自由文本）、消耗程度（轻微/中等/严重）、事件类别（社交、感官、认知、情绪、体力中选择一项或多项）
3. WHEN 用户创建 Energy_Drain_Event 时，THE Energy_Tracker SHALL 自动关联最近一次能量签到记录的时间戳
4. THE Energy_Tracker SHALL 在当日时间线视图中将 Energy_Drain_Event 与能量签到记录一并展示

### 需求 3：个人能量模式识别

**用户故事：** 作为一名 ND/HSP 用户，我希望系统能基于我的历史数据识别出我的能量波动规律，以便我能提前规划高耗能活动的时间安排。

#### 验收标准

1. WHEN 用户累积至少 14 天的签到数据后，THE Energy_Tracker SHALL 生成用户的 Energy_Pattern 周报
2. THE Energy_Pattern 周报 SHALL 包含以下内容：各时段平均能量等级、能量最高和最低的时段分布、最频繁的 Energy_Drain_Event 类别排名
3. WHEN 用户查看 Energy_Pattern 周报时，THE Energy_Tracker SHALL 以折线图形式展示过去 7 天各时段的能量趋势
4. WHILE 用户持续记录签到数据，THE Energy_Tracker SHALL 每周自动更新 Energy_Pattern 周报

### 需求 4：能量预警机制

**用户故事：** 作为一名 ND/HSP 用户，我希望当我的能量降至危险水平时系统能主动提醒我，以便我能在崩溃前采取预防措施。

#### 验收标准

1. WHEN 用户签到的 Energy_Level 等于或低于 2 时，THE Energy_Tracker SHALL 立即触发能量预警通知
2. WHEN 用户在同一天内连续两个时段的 Energy_Level 下降时，THE Energy_Tracker SHALL 触发能量下降趋势预警
3. WHEN 能量预警被触发时，THE Energy_Tracker SHALL 在通知中提供直接跳转至 Crash_Prevention_SOP 的链接
4. THE Energy_Tracker SHALL 允许用户自定义预警阈值（默认值为 Energy_Level ≤ 2）

### 需求 5：感官过载急救 SOP

**用户故事：** 作为一名 ND/HSP 用户，我希望在感官过载或情绪崩溃时能获得一个无需思考的急救流程，以便我在认知能力受损时仍能执行恢复步骤。

#### 验收标准

1. THE Crash_Prevention_SOP SHALL 提供一个最多包含 3 个步骤的紧急恢复流程
2. THE Crash_Prevention_SOP 的每个步骤 SHALL 使用不超过 10 个字的简短指令描述
3. THE Crash_Prevention_SOP SHALL 在 LIFE_COMPASS 首页提供一键直达入口，标记为醒目的紧急按钮样式
4. WHEN 用户触发 Crash_Prevention_SOP 时，THE Crash_Prevention_SOP SHALL 以全屏、大字体、高对比度模式展示每个步骤
5. THE Crash_Prevention_SOP SHALL 提供默认的 3 步急救流程（步骤 1：离开当前环境；步骤 2：启动感官安抚；步骤 3：设定恢复计时器）
6. THE Crash_Prevention_SOP SHALL 允许用户自定义每个步骤的具体内容

### 需求 6：分级恢复菜单

**用户故事：** 作为一名 ND/HSP 用户，我希望在触发事件后能根据严重程度获得对应的恢复建议，以便我能选择最适合当前状态的恢复方式。

#### 验收标准

1. THE Sensory_First_Aid_Kit SHALL 提供三个 Severity_Level 的恢复菜单：轻度、中度、重度
2. WHEN 用户选择轻度恢复时，THE Sensory_First_Aid_Kit SHALL 展示短时间（5-15 分钟）的自我调节活动列表
3. WHEN 用户选择中度恢复时，THE Sensory_First_Aid_Kit SHALL 展示中等时间（15-45 分钟）的恢复活动列表，并建议取消后续低优先级安排
4. WHEN 用户选择重度恢复时，THE Sensory_First_Aid_Kit SHALL 展示长时间（45 分钟以上）的深度恢复方案，并建议清空当日剩余安排
5. THE Sensory_First_Aid_Kit SHALL 允许用户为每个 Severity_Level 自定义恢复活动列表
6. WHEN 用户完成恢复流程后，THE Sensory_First_Aid_Kit SHALL 提示用户进行一次能量签到以记录恢复效果

### 需求 7：触发源记录与分析

**用户故事：** 作为一名 ND/HSP 用户，我希望能记录每次触发事件的来源，以便我能识别反复出现的触发模式并提前预防。

#### 验收标准

1. WHEN 用户使用 Crash_Prevention_SOP 或 Sensory_First_Aid_Kit 后，THE Sensory_First_Aid_Kit SHALL 引导用户创建一条 Trigger_Record
2. WHEN 用户创建 Trigger_Record 时，THE Sensory_First_Aid_Kit SHALL 要求用户填写以下字段：触发类别（感官/情绪/社交/认知/环境中选择）、触发描述（自由文本，可选）、Severity_Level（轻度/中度/重度）、使用的恢复方案
3. WHEN 用户累积至少 10 条 Trigger_Record 后，THE Sensory_First_Aid_Kit SHALL 生成触发源分析报告，包含最频繁的触发类别和严重程度分布
4. THE Sensory_First_Aid_Kit SHALL 在 Trigger_Record 创建流程中将所有字段设计为选择式输入（非自由文本），以降低记录时的认知负荷

### 需求 8：任务能量维度标注

**用户故事：** 作为一名 ND/HSP 用户，我希望为每个任务标注能量相关属性，以便系统能根据我的当前状态推荐合适的任务。

#### 验收标准

1. THE Task_Energy_Dimension SHALL 为现有 GTD 任务数据库新增以下属性字段：Cognitive_Load（低/中/高）、Startup_Difficulty（轻松启动/需要仪式感）、Suitable_Energy_State（峰值/稳定/低能量可做）
2. THE Task_Energy_Dimension SHALL 为每个新增字段提供默认值（Cognitive_Load=中，Startup_Difficulty=轻松启动，Suitable_Energy_State=稳定）
3. WHEN 用户创建新任务时，THE Task_Energy_Dimension SHALL 在任务创建表单中展示能量维度字段，并允许用户修改默认值
4. THE Task_Energy_Dimension SHALL 为现有未标注的任务保留默认值，不要求用户回溯标注

### 需求 9：基于能量的任务动态推荐

**用户故事：** 作为一名 ND/HSP 用户，我希望系统能根据我当前的能量水平推荐适合执行的任务，以便我在低能量时段也能保持生产力而非完全停滞。

#### 验收标准

1. WHEN 用户完成能量签到后，THE Task_Matcher SHALL 根据当前 Energy_Level 筛选并展示适配的待办任务列表
2. WHEN Energy_Level 为 1 或 2 时，THE Task_Matcher SHALL 仅展示 Suitable_Energy_State 为「低能量可做」且 Startup_Difficulty 为「轻松启动」的任务
3. WHEN Energy_Level 为 3 时，THE Task_Matcher SHALL 展示 Suitable_Energy_State 为「低能量可做」或「稳定」的任务
4. WHEN Energy_Level 为 4 或 5 时，THE Task_Matcher SHALL 展示所有待办任务，并将 Cognitive_Load 为「高」的任务置顶推荐
5. THE Task_Matcher SHALL 在推荐列表中以视觉标识区分不同 Cognitive_Load 等级的任务
6. IF 当前 Energy_Level 下无适配任务，THEN THE Task_Matcher SHALL 展示「当前无适配任务，建议进入恢复模式」的提示，并提供跳转至 Sensory_First_Aid_Kit 的链接

### 需求 10：系统模块重叠审计

**用户故事：** 作为一名 ND/HSP 用户，我希望系统能识别出功能重叠的模块，以便我能减少「该记录到哪里」的认知负荷。

#### 验收标准

1. THE System_Auditor SHALL 识别并列出 LIFE_COMPASS 中功能重叠的模块对（如：Books 与 R.I.A.、LIFEMATRICES 与 Habit Tracker）
2. THE System_Auditor SHALL 为每对重叠模块提供合并建议，说明建议保留的模块及合并方式
3. THE System_Auditor SHALL 将审计结果以清单形式存储在 LIFE_COMPASS 的知识库中

### 需求 11：录入决策树

**用户故事：** 作为一名 ND/HSP 用户，我希望有一个决策树帮助我快速判断信息该记录到哪个模块，以便我不再因选择困难而消耗额外认知资源。

#### 验收标准

1. THE Decision_Tree SHALL 以不超过 3 层的树状结构引导用户从信息类型到目标模块的决策
2. WHEN 用户启动 Decision_Tree 时，THE Decision_Tree SHALL 首先询问信息类别（任务/知识/习惯/记录/其他）
3. WHEN 用户选择信息类别后，THE Decision_Tree SHALL 根据类别展示下一层筛选条件，最终指向唯一的目标模块
4. THE Decision_Tree SHALL 在 LIFE_COMPASS 首页提供快捷入口
5. THE Decision_Tree SHALL 允许用户自定义决策路径和目标模块映射

### 需求 12：系统维护频率分级

**用户故事：** 作为一名 ND/HSP 用户，我希望系统能区分每日必须维护和偶尔维护的模块，以便我能将有限的能量集中在最重要的日常记录上。

#### 验收标准

1. THE System_Auditor SHALL 将 LIFE_COMPASS 中的所有模块分为两类：每日维护（Daily）和偶尔维护（Occasional）
2. THE System_Auditor SHALL 为每日维护类模块提供一个统一的「每日仪表盘」视图，聚合所有每日必须操作的入口
3. WHILE 用户处于每日仪表盘视图中，THE System_Auditor SHALL 隐藏所有偶尔维护类模块的入口，以减少视觉干扰
4. THE System_Auditor SHALL 允许用户自定义每个模块的维护频率分类
