# 需求文档：LIFE COMPASS — ND/HSP 能量感知生活操作系统

## 简介

LIFE COMPASS 是一款面向神经多样性（ND）及高敏感人群（HSP）的独立全功能 Web 应用，旨在完全替代现有 Notion 生活操作系统。本应用将现有 LIFE COMPASS Notion 系统的全部功能模块（SOP 执行引擎、每日签到、目标与愿景板、情绪板、活动与旅行规划、健康管理、健身管理、习惯追踪、库存管理、财务管理、时装秀、R.I.A. 阅读系统、内容创作系统、营养与健康、膳食规划、运动库、OKR 管理、知识管理、GTD 管理、生活方式、每日节律）迁移为独立 Web 应用，并在此基础上新增 ND/HSP 能量管理层——包括能量追踪、崩溃预防与急救、任务能量匹配、系统审计四大核心能力。

ND/HSP 用户 80% 的任务阻塞并非因为任务不重要，而是当前神经状态与任务需求不匹配。本系统的核心设计原则：能量是变量而非常量；崩溃预防 SOP 必须「无脑可用」（最多 3 步、大字体、高对比度）；所有录入界面优先使用选择式输入以降低认知负荷；决策树和模块组织消除「该记录到哪里」的焦虑；每日仪表盘隐藏非必要模块以减少视觉噪音。

## 术语表

- **App**：LIFE COMPASS 独立 Web 应用程序
- **Dashboard**：每日仪表盘，App 的主页面，聚合每日必须操作的所有入口
- **SOP_Engine**：SOP 执行引擎，基于 PDCA 循环（WRITE_PLAN → PLAN → DO → CHECK）的执行管理模块
- **Daily_Check_In**：每日签到模块（LIFEMATRICES），包含早/午/晚习惯追踪、情绪记录、通勤方式、日记
- **Goals_Vision_Board**：目标与愿景板模块，包含目标数据库和可视化愿景板
- **Mood_Board**：情绪板模块（MOOD BROAD），包含愿景板、人生愿景、自我定义、里程碑、显化愿景板、每日显化任务
- **Manifestation_Vision_Board**：显化愿景板，Mood_Board 的子模块，包含原型、情感核心、生活节奏、素材、色彩方案、阶段
- **Activity_Planner**：活动与旅行规划模块，管理事件/旅行的预算、同伴、地点、状态及打包清单
- **Health_Manager**：健康管理模块，管理医疗预约和药物数据库
- **Fitness_Manager**：健身管理 2.0 模块，包含目标（体重/腰围）、训练计划、训练统计、身体数据、运动库、健身里程碑
- **Habit_Tracker**：习惯追踪模块，管理每日习惯、里程碑、奖励、每周自我反思
- **Inventory_Manager**：库存管理模块，管理物品的类别、品牌、库存状态、更换周期、购买链接
- **Finance_Manager**：财务管理模块，管理收入/支出追踪、类别、支付方式、月度汇总
- **Fashion_Gallery**：时装秀（云看秀）模块，以画廊视图展示时装秀记录
- **RIA_Reading_System**：R.I.A. 阅读系统模块，Read → Interpret → Apply，管理书籍、笔记、行动调整
- **Content_Creation_System**：内容创作系统模块，管理内容/任务/平台/资源数据库，支持多平台（小红书、微信、知识星球、YouTube）
- **Nutrition_Health**：营养与健康模块，包含冥想、健康习惯、购物清单、膳食计划、食谱、运动追踪
- **Meal_Planner**：膳食规划模块，基于 BMR×1.5 计算（碳水:蛋白质:脂肪 = 4:3:3），管理每周膳食、食谱、食材、购物清单
- **Workout_Library**：运动库模块，运动数据库
- **OKR_Manager**：OKR 管理模块，三数据库联动系统：目标 → 关键结果 → 目标周期
- **Knowledge_Manager**：知识管理模块，9 种类型（书籍/文章/视频/课程/节目/电影/网站/想法/系统），状态流转，关联任务和项目
- **GTD_Manager**：GTD 管理模块，包含项目（关联任务、知识、KR）+ 任务（待办/计划/进行中/暂停/已完成）+ 项目概览
- **Lifestyle_Manager**：生活方式模块，包含观看清单、书籍、护肤、愿望清单
- **Daily_Routine**：每日节律模块，理想日常节奏蓝图（早晨/下午/晚间/周末/月度/季度/年度节律）
- **Energy_Tracker**：能量追踪模块，记录用户全天多时段的能量水平及消耗事件
- **Energy_Level**：能量等级，使用 1-5 整数刻度（1=极低，2=低，3=稳定，4=良好，5=峰值）
- **Energy_Check_In**：能量签到，用户在特定时段记录当前能量等级的操作
- **Energy_Drain_Event**：能量消耗事件，导致用户能量显著下降的具体事件记录
- **Energy_Pattern**：能量模式，基于历史签到数据识别出的用户个人能量波动规律
- **Crash_Prevention_SOP**：崩溃预防标准操作程序，当能量降至危险水平时触发的预防性干预流程
- **Sensory_First_Aid_Kit**：感官急救包，感官过载或情绪触发后的分级恢复菜单
- **Trigger_Record**：触发源记录，记录导致感官过载或情绪崩溃的具体触发因素
- **Recovery_Protocol**：恢复协议，根据触发严重程度（轻度/中度/重度）提供的恢复步骤
- **Task_Energy_Dimension**：任务能量维度，为 GTD 任务附加的能量相关属性字段
- **Cognitive_Load**：认知负荷，任务所需的认知资源等级（低/中/高）
- **Startup_Difficulty**：启动难度，任务从零开始执行的阻力等级（轻松启动/需要仪式感）
- **Suitable_Energy_State**：适配能量状态，执行该任务所需的最低能量状态（峰值/稳定/低能量可做）
- **Task_Matcher**：任务匹配器，根据用户当前能量等级推荐适配任务的模块
- **System_Auditor**：系统审计模块，负责识别重叠模块并提供录入决策树
- **Decision_Tree**：决策树，帮助用户快速判断「该记录到哪里」的引导流程
- **Severity_Level**：严重程度等级，触发事件的影响程度分级（轻度/中度/重度）
- **PDCA_Cycle**：PDCA 循环，SOP 执行引擎的核心流程（WRITE_PLAN → PLAN → DO → CHECK）
- **Emotion_Set**：情绪集合，Daily_Check_In 中使用的 8 种情绪类型
- **View_Mode**：视图模式，数据展示方式（表格/日历/看板/周统计/画廊）

## 需求

---

### 需求 1：应用架构与导航

**用户故事：** 作为用户，我希望拥有一个独立的 Web 应用来管理我的生活系统，以便我不再依赖 Notion 且能获得针对 ND/HSP 优化的体验。

#### 验收标准

1. THE App SHALL 作为独立 Web 应用运行，提供用户注册和登录功能
2. THE App SHALL 提供响应式布局，支持桌面端和移动端浏览器访问
3. THE App SHALL 提供侧边栏导航，列出所有功能模块的入口
4. THE Dashboard SHALL 作为 App 的默认首页，聚合每日必须操作的模块入口
5. WHILE 用户处于 Dashboard 视图中，THE App SHALL 隐藏所有标记为「偶尔维护」的模块入口，以减少视觉噪音
6. THE App SHALL 允许用户自定义侧边栏中模块的显示顺序和可见性
7. THE App SHALL 对所有用户数据进行持久化存储，支持数据导出功能

---

### 需求 2：SOP 执行引擎

**用户故事：** 作为用户，我希望拥有一个基于 PDCA 循环的执行引擎，以便我能系统化地管理从计划到复盘的完整工作流。

#### 验收标准

1. THE SOP_Engine SHALL 支持 PDCA_Cycle 的四个阶段：WRITE_PLAN、PLAN、DO、CHECK
2. THE SOP_Engine SHALL 提供五个子页面：收件箱（Inbox）、OKR 与项目管理、执行（Execution）、知识管理、复盘与纠正（Review & Correction）
3. WHEN 用户创建新的 SOP 条目时，THE SOP_Engine SHALL 将其初始状态设为 WRITE_PLAN
4. WHEN 用户推进 SOP 条目的阶段时，THE SOP_Engine SHALL 按 WRITE_PLAN → PLAN → DO → CHECK 的顺序流转状态
5. THE SOP_Engine SHALL 在收件箱子页面中展示所有未分类的新输入条目
6. THE SOP_Engine SHALL 在执行子页面中展示所有处于 DO 阶段的条目
7. THE SOP_Engine SHALL 在复盘与纠正子页面中展示所有处于 CHECK 阶段的条目，并支持用户记录复盘结论

---

### 需求 3：每日签到（LIFEMATRICES）

**用户故事：** 作为用户，我希望每天进行早/午/晚习惯追踪和情绪记录，以便我能持续监控自己的生活状态和情绪变化。

#### 验收标准

1. THE Daily_Check_In SHALL 提供三个签到时段：早晨、午间、晚间
2. WHEN 用户进行签到时，THE Daily_Check_In SHALL 允许用户勾选该时段的习惯完成情况
3. WHEN 用户进行签到时，THE Daily_Check_In SHALL 允许用户从 Emotion_Set（8 种情绪）中选择当前情绪状态
4. THE Daily_Check_In SHALL 允许用户记录当日通勤方式
5. THE Daily_Check_In SHALL 允许用户撰写每日日记
6. THE Daily_Check_In SHALL 自动计算并展示当日习惯完成率
7. THE Daily_Check_In SHALL 自动计算并展示连续签到天数（连续打卡天数）
8. THE Daily_Check_In SHALL 提供五种 View_Mode：表格视图、日历视图、看板视图、周统计视图、画廊视图
9. WHEN 用户切换 View_Mode 时，THE Daily_Check_In SHALL 以对应的布局重新渲染签到数据

---

### 需求 4：目标与愿景板

**用户故事：** 作为用户，我希望管理我的目标并通过可视化愿景板激励自己，以便我能保持对人生方向的清晰感。

#### 验收标准

1. THE Goals_Vision_Board SHALL 提供目标数据库，支持创建、编辑、删除目标条目
2. WHEN 用户创建目标时，THE Goals_Vision_Board SHALL 要求用户填写目标名称、描述、截止日期、状态字段
3. THE Goals_Vision_Board SHALL 提供可视化愿景板视图，支持用户上传图片并以画廊形式展示
4. THE Goals_Vision_Board SHALL 允许用户将目标与愿景板中的图片进行关联

---

### 需求 5：情绪板（MOOD BROAD）

**用户故事：** 作为用户，我希望拥有一个综合的情绪与愿景管理空间，以便我能定义自我、设定人生愿景并追踪显化进程。

#### 验收标准

1. THE Mood_Board SHALL 提供以下子模块：愿景板、人生愿景、自我定义、里程碑、显化愿景板、每日显化任务
2. THE Mood_Board SHALL 在愿景板子模块中支持用户上传和排列图片
3. THE Mood_Board SHALL 在人生愿景子模块中支持用户撰写和编辑人生愿景文本
4. THE Mood_Board SHALL 在自我定义子模块中支持用户记录自我认知和身份定义
5. THE Mood_Board SHALL 在里程碑子模块中支持用户创建和追踪人生里程碑
6. THE Manifestation_Vision_Board SHALL 包含以下维度：原型（Archetypes）、情感核心（Emotional Core）、生活节奏（Lifestyle Pace）、素材（Materials）、色彩方案（Color Palette）、阶段（Phases）
7. WHEN 用户创建每日显化任务时，THE Mood_Board SHALL 将任务关联至 Manifestation_Vision_Board 的对应阶段

---

### 需求 6：活动与旅行规划

**用户故事：** 作为用户，我希望管理我的活动和旅行计划，以便我能系统化地组织出行并追踪预算。

#### 验收标准

1. THE Activity_Planner SHALL 提供活动/旅行数据库，支持创建、编辑、删除条目
2. WHEN 用户创建活动条目时，THE Activity_Planner SHALL 要求用户填写以下字段：名称、日期、预算、同伴、地点、状态
3. THE Activity_Planner SHALL 为每个活动条目提供打包清单功能，支持添加、勾选、删除清单项
4. THE Activity_Planner SHALL 支持按状态（计划中/进行中/已完成/已取消）筛选活动列表

---

### 需求 7：健康管理

**用户故事：** 作为用户，我希望管理我的医疗预约和药物信息，以便我能系统化地追踪健康相关事务。

#### 验收标准

1. THE Health_Manager SHALL 提供医疗预约数据库，支持创建、编辑、删除预约记录
2. WHEN 用户创建医疗预约时，THE Health_Manager SHALL 要求用户填写以下字段：日期、时间、医生/科室、地点、备注
3. THE Health_Manager SHALL 提供药物数据库，支持记录药物名称、剂量、频率、开始日期、结束日期
4. IF 药物记录的结束日期已过，THEN THE Health_Manager SHALL 将该药物标记为「已停用」状态

---

### 需求 8：健身管理 2.0

**用户故事：** 作为用户，我希望全面管理我的健身目标、训练计划和身体数据，以便我能科学地追踪健身进展。

#### 验收标准

1. THE Fitness_Manager SHALL 提供健身目标设定功能，支持设定体重目标和腰围目标
2. THE Fitness_Manager SHALL 提供训练计划数据库，支持创建、编辑、删除训练计划
3. THE Fitness_Manager SHALL 提供训练统计功能，记录每次训练的日期、类型、时长、强度
4. THE Fitness_Manager SHALL 提供身体数据记录功能，支持记录体重、腰围、体脂率等指标及其日期
5. THE Fitness_Manager SHALL 提供运动库，包含运动名称、目标肌群、动作描述字段
6. THE Fitness_Manager SHALL 提供健身里程碑功能，支持用户创建和标记已达成的里程碑
7. WHEN 用户记录新的身体数据时，THE Fitness_Manager SHALL 以折线图形式展示该指标的历史趋势

---

### 需求 9：习惯追踪

**用户故事：** 作为用户，我希望追踪我的每日习惯并通过里程碑和奖励激励自己，以便我能建立和维持良好的生活习惯。

#### 验收标准

1. THE Habit_Tracker SHALL 提供习惯数据库，支持创建、编辑、删除习惯条目
2. WHEN 用户创建习惯时，THE Habit_Tracker SHALL 要求用户填写习惯名称、频率（每日/每周）、目标描述
3. THE Habit_Tracker SHALL 提供每日习惯打卡界面，允许用户勾选当日已完成的习惯
4. THE Habit_Tracker SHALL 自动计算每个习惯的连续完成天数
5. THE Habit_Tracker SHALL 提供里程碑功能，当习惯连续完成达到预设天数时自动标记里程碑
6. THE Habit_Tracker SHALL 提供奖励功能，允许用户为达成里程碑设定自定义奖励
7. THE Habit_Tracker SHALL 提供每周自我反思功能，允许用户在每周末撰写习惯执行反思

---

### 需求 10：库存管理

**用户故事：** 作为用户，我希望管理我的个人物品库存，以便我能追踪物品状态并及时补充。

#### 验收标准

1. THE Inventory_Manager SHALL 提供物品数据库，支持创建、编辑、删除物品条目
2. WHEN 用户创建物品条目时，THE Inventory_Manager SHALL 要求用户填写以下字段：名称、类别、品牌、库存状态（充足/即将用完/已用完）、更换周期、购买链接
3. THE Inventory_Manager SHALL 支持按类别和库存状态筛选物品列表
4. WHEN 物品的库存状态为「即将用完」时，THE Inventory_Manager SHALL 在 Dashboard 中展示补充提醒

---

### 需求 11：财务管理

**用户故事：** 作为用户，我希望追踪我的收入和支出，以便我能了解自己的财务状况并做出合理的消费决策。

#### 验收标准

1. THE Finance_Manager SHALL 提供收入和支出记录功能，支持创建、编辑、删除交易记录
2. WHEN 用户创建交易记录时，THE Finance_Manager SHALL 要求用户填写以下字段：日期、金额、类型（收入/支出）、类别、支付方式、备注
3. THE Finance_Manager SHALL 提供月度汇总视图，展示当月总收入、总支出、净收入
4. THE Finance_Manager SHALL 支持按类别和支付方式筛选交易记录
5. THE Finance_Manager SHALL 以图表形式展示各支出类别的占比分布

---

### 需求 12：时装秀（云看秀）

**用户故事：** 作为用户，我希望以画廊形式浏览和管理时装秀记录，以便我能收集和回顾时尚灵感。

#### 验收标准

1. THE Fashion_Gallery SHALL 提供时装秀记录数据库，支持创建、编辑、删除记录
2. WHEN 用户创建时装秀记录时，THE Fashion_Gallery SHALL 要求用户填写以下字段：品牌、季节、年份、图片、备注
3. THE Fashion_Gallery SHALL 以画廊视图（图片网格）作为默认展示模式
4. THE Fashion_Gallery SHALL 支持按品牌和季节筛选记录

---

### 需求 13：R.I.A. 阅读系统

**用户故事：** 作为用户，我希望通过 Read → Interpret → Apply 的方法论管理我的阅读，以便我能将阅读转化为实际行动。

#### 验收标准

1. THE RIA_Reading_System SHALL 提供书籍数据库，支持创建、编辑、删除书籍条目
2. WHEN 用户创建书籍条目时，THE RIA_Reading_System SHALL 要求用户填写以下字段：书名、作者、状态（未读/阅读中/已读）、评分
3. THE RIA_Reading_System SHALL 为每本书提供笔记功能，支持按 R.I.A. 三阶段（Read 摘录、Interpret 解读、Apply 应用）分类记录笔记
4. THE RIA_Reading_System SHALL 在 Apply 阶段支持用户创建行动调整条目，关联至具体的阅读笔记
5. THE RIA_Reading_System SHALL 支持按阅读状态筛选书籍列表

---

### 需求 14：内容创作系统

**用户故事：** 作为用户，我希望管理我的多平台内容创作流程，以便我能系统化地规划、创作和发布内容。

#### 验收标准

1. THE Content_Creation_System SHALL 提供四个关联数据库：内容库、任务库、平台库、资源库
2. WHEN 用户创建内容条目时，THE Content_Creation_System SHALL 要求用户填写以下字段：标题、平台（小红书/微信/知识星球/YouTube 中选择一项或多项）、状态（构思/草稿/审核/已发布）、发布日期
3. THE Content_Creation_System SHALL 允许用户为每个内容条目创建关联的创作任务
4. THE Content_Creation_System SHALL 支持按平台和状态筛选内容列表
5. THE Content_Creation_System SHALL 在平台库中管理各平台的账号信息和发布规范

---

### 需求 15：营养与健康

**用户故事：** 作为用户，我希望综合管理我的营养、冥想和健康习惯，以便我能全面维护身心健康。

#### 验收标准

1. THE Nutrition_Health SHALL 提供以下子模块：冥想记录、健康习惯、购物清单、膳食计划、食谱库、运动追踪
2. THE Nutrition_Health SHALL 在冥想记录子模块中支持记录冥想日期、时长、类型、感受
3. THE Nutrition_Health SHALL 在健康习惯子模块中支持追踪每日健康相关习惯的完成情况
4. THE Nutrition_Health SHALL 在购物清单子模块中支持创建、勾选、删除购物项
5. THE Nutrition_Health SHALL 在食谱库子模块中支持创建食谱，包含食材列表、步骤、营养信息
6. THE Nutrition_Health SHALL 在运动追踪子模块中支持记录每日运动类型和时长

---

### 需求 16：膳食规划

**用户故事：** 作为用户，我希望基于科学的营养计算规划每周膳食，以便我能保持均衡的饮食结构。

#### 验收标准

1. THE Meal_Planner SHALL 基于用户输入的 BMR（基础代谢率）自动计算每日目标热量（BMR × 1.5）
2. THE Meal_Planner SHALL 按碳水:蛋白质:脂肪 = 4:3:3 的比例计算每日各营养素的目标克数
3. THE Meal_Planner SHALL 提供每周膳食计划视图，支持为每天的早/午/晚餐分配食谱
4. THE Meal_Planner SHALL 提供食谱数据库，每个食谱包含食材列表、制作步骤、热量和营养素信息
5. THE Meal_Planner SHALL 提供食材数据库，记录食材名称、单位热量、营养素含量
6. WHEN 用户完成一周膳食计划后，THE Meal_Planner SHALL 自动生成该周所需食材的购物清单
7. THE Meal_Planner SHALL 在购物清单中合并相同食材并汇总所需数量

---

### 需求 17：运动库

**用户故事：** 作为用户，我希望拥有一个运动数据库，以便我能查阅和选择适合的运动项目。

#### 验收标准

1. THE Workout_Library SHALL 提供运动数据库，支持创建、编辑、删除运动条目
2. WHEN 用户创建运动条目时，THE Workout_Library SHALL 要求用户填写以下字段：运动名称、目标肌群、动作描述、难度等级、所需器材
3. THE Workout_Library SHALL 支持按目标肌群和难度等级筛选运动列表
4. THE Workout_Library SHALL 允许 Fitness_Manager 的训练计划引用运动库中的运动条目

---

### 需求 18：OKR 管理

**用户故事：** 作为用户，我希望通过三数据库联动的 OKR 系统管理我的目标，以便我能将宏观目标分解为可衡量的关键结果并按周期追踪。

#### 验收标准

1. THE OKR_Manager SHALL 提供三个关联数据库：目标（Objectives）、关键结果（Key Results）、目标周期（Goal Periods）
2. WHEN 用户创建目标时，THE OKR_Manager SHALL 要求用户填写目标名称、描述、所属目标周期
3. WHEN 用户创建关键结果时，THE OKR_Manager SHALL 要求用户填写关键结果描述、目标值、当前值、所属目标
4. THE OKR_Manager SHALL 自动计算每个目标的完成进度（基于其关联关键结果的完成百分比）
5. THE OKR_Manager SHALL 提供目标周期视图，展示该周期内所有目标及其关键结果的进度概览
6. THE OKR_Manager SHALL 允许 GTD_Manager 中的项目关联至关键结果

---

### 需求 19：知识管理

**用户故事：** 作为用户，我希望统一管理 9 种类型的知识条目并追踪其状态流转，以便我能系统化地积累和应用知识。

#### 验收标准

1. THE Knowledge_Manager SHALL 提供知识数据库，支持 9 种知识类型：书籍、文章、视频、课程、节目、电影、网站、想法、系统
2. WHEN 用户创建知识条目时，THE Knowledge_Manager SHALL 要求用户填写以下字段：标题、类型、状态（待处理/进行中/已完成/已归档）、来源、备注
3. THE Knowledge_Manager SHALL 支持知识条目的状态流转：待处理 → 进行中 → 已完成 → 已归档
4. THE Knowledge_Manager SHALL 允许知识条目关联至 GTD_Manager 中的任务和项目
5. THE Knowledge_Manager SHALL 支持按知识类型和状态筛选知识列表

---

### 需求 20：GTD 管理

**用户故事：** 作为用户，我希望通过 GTD 方法论管理我的项目和任务，以便我能系统化地推进工作并追踪进度。

#### 验收标准

1. THE GTD_Manager SHALL 提供项目数据库，支持创建、编辑、删除项目条目
2. WHEN 用户创建项目时，THE GTD_Manager SHALL 要求用户填写以下字段：项目名称、描述、状态、截止日期
3. THE GTD_Manager SHALL 允许项目关联至任务、知识条目和 OKR 关键结果
4. THE GTD_Manager SHALL 提供任务数据库，支持创建、编辑、删除任务条目
5. WHEN 用户创建任务时，THE GTD_Manager SHALL 要求用户填写以下字段：任务名称、描述、状态（待办/计划/进行中/暂停/已完成）、优先级、截止日期、所属项目
6. THE GTD_Manager SHALL 支持任务状态流转：待办 → 计划 → 进行中 → 暂停/已完成
7. THE GTD_Manager SHALL 提供项目概览视图，展示所有项目及其关联任务的完成进度
8. THE GTD_Manager SHALL 支持按状态和优先级筛选任务列表

---

### 需求 21：生活方式

**用户故事：** 作为用户，我希望管理我的观看清单、书籍、护肤和愿望清单，以便我能追踪生活中的各类兴趣和需求。

#### 验收标准

1. THE Lifestyle_Manager SHALL 提供四个子模块：观看清单、书籍、护肤、愿望清单
2. THE Lifestyle_Manager SHALL 在观看清单子模块中支持记录影视作品的名称、类型、状态（想看/在看/已看）、评分
3. THE Lifestyle_Manager SHALL 在书籍子模块中支持记录书籍的名称、作者、状态（想读/在读/已读）、评分
4. THE Lifestyle_Manager SHALL 在护肤子模块中支持记录护肤产品的名称、类别、使用频率、开封日期、保质期
5. THE Lifestyle_Manager SHALL 在愿望清单子模块中支持记录愿望项的名称、预估价格、优先级、状态（想要/已购/已放弃）

---

### 需求 22：每日节律

**用户故事：** 作为用户，我希望定义我的理想日常节奏蓝图，以便我能参照理想节律安排每天的活动。

#### 验收标准

1. THE Daily_Routine SHALL 提供节律蓝图编辑功能，支持定义以下时间维度的理想节律：早晨、下午、晚间、周末、月度、季度、年度
2. WHEN 用户编辑节律蓝图时，THE Daily_Routine SHALL 允许用户为每个时间段添加活动条目，包含活动名称、建议时间、备注
3. THE Daily_Routine SHALL 在 Dashboard 中展示当日适用的节律蓝图（工作日展示早晨/下午/晚间，周末展示周末节律）
4. THE Daily_Routine SHALL 允许用户随时查看和编辑所有时间维度的节律蓝图

---

## ND/HSP 能量管理层

---

### 需求 23：多时段能量签到

**用户故事：** 作为一名 ND/HSP 用户，我希望每天在多个时段记录我的能量水平，以便我能感知能量消耗的过程而非仅在崩溃后才意识到。

#### 验收标准

1. THE Energy_Tracker SHALL 提供四个固定签到时段：晨间、午间、午后、晚间
2. WHEN 用户进行能量签到时，THE Energy_Tracker SHALL 接受 1 至 5 的整数刻度作为 Energy_Level 输入（1=极低，2=低，3=稳定，4=良好，5=峰值）
3. WHEN 用户完成能量签到时，THE Energy_Tracker SHALL 将签到记录存储至能量签到数据库，包含日期、时段、Energy_Level 三个字段
4. THE Energy_Tracker SHALL 在签到界面以直观的视觉指示器（颜色编码和表情符号）展示 1-5 各等级的含义
5. IF 用户在某一时段未完成签到，THEN THE Energy_Tracker SHALL 在该时段结束前发送一次提醒
6. WHEN 用户查看当日签到记录时，THE Energy_Tracker SHALL 以时间线形式展示当日所有已完成的能量签到
7. THE Energy_Tracker SHALL 将能量签到入口集成至 Dashboard，与 Daily_Check_In 并列展示

---

### 需求 24：能量消耗事件标记

**用户故事：** 作为一名 ND/HSP 用户，我希望能随时标记导致能量下降的事件，以便我能识别个人的能量消耗模式。

#### 验收标准

1. THE Energy_Tracker SHALL 允许用户在任意时间创建 Energy_Drain_Event 记录
2. WHEN 用户创建 Energy_Drain_Event 时，THE Energy_Tracker SHALL 提供以下选择式输入字段：消耗程度（轻微/中等/严重）、事件类别（社交/感官/认知/情绪/体力中选择一项或多项），以及一个可选的事件描述自由文本字段
3. WHEN 用户创建 Energy_Drain_Event 时，THE Energy_Tracker SHALL 自动关联最近一次能量签到记录的时间戳
4. THE Energy_Tracker SHALL 在当日时间线视图中将 Energy_Drain_Event 与能量签到记录一并展示

---

### 需求 25：个人能量模式识别

**用户故事：** 作为一名 ND/HSP 用户，我希望系统能基于我的历史数据识别出我的能量波动规律，以便我能提前规划高耗能活动的时间安排。

#### 验收标准

1. WHEN 用户累积至少 14 天的签到数据后，THE Energy_Tracker SHALL 生成用户的 Energy_Pattern 周报
2. THE Energy_Pattern 周报 SHALL 包含以下内容：各时段平均能量等级、能量最高和最低的时段分布、最频繁的 Energy_Drain_Event 类别排名
3. WHEN 用户查看 Energy_Pattern 周报时，THE Energy_Tracker SHALL 以折线图形式展示过去 7 天各时段的能量趋势
4. WHILE 用户持续记录签到数据，THE Energy_Tracker SHALL 每周自动更新 Energy_Pattern 周报

---

### 需求 26：能量预警机制

**用户故事：** 作为一名 ND/HSP 用户，我希望当我的能量降至危险水平时系统能主动提醒我，以便我能在崩溃前采取预防措施。

#### 验收标准

1. WHEN 用户签到的 Energy_Level 等于或低于 2 时，THE Energy_Tracker SHALL 立即触发能量预警通知
2. WHEN 用户在同一天内连续两个时段的 Energy_Level 下降时，THE Energy_Tracker SHALL 触发能量下降趋势预警
3. WHEN 能量预警被触发时，THE Energy_Tracker SHALL 在通知中提供直接跳转至 Crash_Prevention_SOP 的链接
4. THE Energy_Tracker SHALL 允许用户自定义预警阈值（默认值为 Energy_Level ≤ 2）

---

### 需求 27：感官过载急救 SOP

**用户故事：** 作为一名 ND/HSP 用户，我希望在感官过载或情绪崩溃时能获得一个无需思考的急救流程，以便我在认知能力受损时仍能执行恢复步骤。

#### 验收标准

1. THE Crash_Prevention_SOP SHALL 提供一个最多包含 3 个步骤的紧急恢复流程
2. THE Crash_Prevention_SOP 的每个步骤 SHALL 使用不超过 10 个字的简短指令描述
3. THE Crash_Prevention_SOP SHALL 在 Dashboard 提供一键直达入口，标记为醒目的紧急按钮样式
4. WHEN 用户触发 Crash_Prevention_SOP 时，THE App SHALL 以全屏、大字体（不小于 32px）、高对比度模式展示每个步骤
5. THE Crash_Prevention_SOP SHALL 提供默认的 3 步急救流程（步骤 1：离开当前环境；步骤 2：启动感官安抚；步骤 3：设定恢复计时器）
6. THE Crash_Prevention_SOP SHALL 允许用户自定义每个步骤的具体内容

---

### 需求 28：分级恢复菜单

**用户故事：** 作为一名 ND/HSP 用户，我希望在触发事件后能根据严重程度获得对应的恢复建议，以便我能选择最适合当前状态的恢复方式。

#### 验收标准

1. THE Sensory_First_Aid_Kit SHALL 提供三个 Severity_Level 的恢复菜单：轻度、中度、重度
2. WHEN 用户选择轻度恢复时，THE Sensory_First_Aid_Kit SHALL 展示短时间（5-15 分钟）的自我调节活动列表
3. WHEN 用户选择中度恢复时，THE Sensory_First_Aid_Kit SHALL 展示中等时间（15-45 分钟）的恢复活动列表，并建议取消后续低优先级安排
4. WHEN 用户选择重度恢复时，THE Sensory_First_Aid_Kit SHALL 展示长时间（45 分钟以上）的深度恢复方案，并建议清空当日剩余安排
5. THE Sensory_First_Aid_Kit SHALL 允许用户为每个 Severity_Level 自定义恢复活动列表
6. WHEN 用户完成恢复流程后，THE Sensory_First_Aid_Kit SHALL 提示用户进行一次能量签到以记录恢复效果

---

### 需求 29：触发源记录与分析

**用户故事：** 作为一名 ND/HSP 用户，我希望能记录每次触发事件的来源，以便我能识别反复出现的触发模式并提前预防。

#### 验收标准

1. WHEN 用户使用 Crash_Prevention_SOP 或 Sensory_First_Aid_Kit 后，THE App SHALL 引导用户创建一条 Trigger_Record
2. WHEN 用户创建 Trigger_Record 时，THE App SHALL 提供以下选择式输入字段：触发类别（感官/情绪/社交/认知/环境中选择）、Severity_Level（轻度/中度/重度）、使用的恢复方案，以及一个可选的触发描述自由文本字段
3. WHEN 用户累积至少 10 条 Trigger_Record 后，THE App SHALL 生成触发源分析报告，包含最频繁的触发类别和严重程度分布
4. THE App SHALL 在 Trigger_Record 创建流程中优先使用选择式输入（非自由文本），以降低记录时的认知负荷

---

### 需求 30：任务能量维度标注

**用户故事：** 作为一名 ND/HSP 用户，我希望为每个任务标注能量相关属性，以便系统能根据我的当前状态推荐合适的任务。

#### 验收标准

1. THE Task_Energy_Dimension SHALL 为 GTD_Manager 的任务数据库新增以下属性字段：Cognitive_Load（低/中/高）、Startup_Difficulty（轻松启动/需要仪式感）、Suitable_Energy_State（峰值/稳定/低能量可做）
2. THE Task_Energy_Dimension SHALL 为每个新增字段提供默认值（Cognitive_Load=中，Startup_Difficulty=轻松启动，Suitable_Energy_State=稳定）
3. WHEN 用户创建新任务时，THE GTD_Manager SHALL 在任务创建表单中展示能量维度字段，并允许用户修改默认值
4. THE Task_Energy_Dimension SHALL 为现有未标注的任务保留默认值，不要求用户回溯标注

---

### 需求 31：基于能量的任务动态推荐

**用户故事：** 作为一名 ND/HSP 用户，我希望系统能根据我当前的能量水平推荐适合执行的任务，以便我在低能量时段也能保持生产力而非完全停滞。

#### 验收标准

1. WHEN 用户完成能量签到后，THE Task_Matcher SHALL 根据当前 Energy_Level 筛选并展示适配的待办任务列表
2. WHEN Energy_Level 为 1 或 2 时，THE Task_Matcher SHALL 仅展示 Suitable_Energy_State 为「低能量可做」且 Startup_Difficulty 为「轻松启动」的任务
3. WHEN Energy_Level 为 3 时，THE Task_Matcher SHALL 展示 Suitable_Energy_State 为「低能量可做」或「稳定」的任务
4. WHEN Energy_Level 为 4 或 5 时，THE Task_Matcher SHALL 展示所有待办任务，并将 Cognitive_Load 为「高」的任务置顶推荐
5. THE Task_Matcher SHALL 在推荐列表中以视觉标识区分不同 Cognitive_Load 等级的任务
6. IF 当前 Energy_Level 下无适配任务，THEN THE Task_Matcher SHALL 展示「当前无适配任务，建议进入恢复模式」的提示，并提供跳转至 Sensory_First_Aid_Kit 的链接
7. THE Task_Matcher SHALL 在 Dashboard 中展示当前能量状态下的推荐任务摘要

---

### 需求 32：系统模块重叠审计

**用户故事：** 作为一名 ND/HSP 用户，我希望系统能识别出功能重叠的模块，以便我能减少「该记录到哪里」的认知负荷。

#### 验收标准

1. THE System_Auditor SHALL 识别并列出 App 中功能重叠的模块对（如：Lifestyle_Manager 书籍与 RIA_Reading_System、Daily_Check_In 与 Habit_Tracker）
2. THE System_Auditor SHALL 为每对重叠模块提供合并建议，说明建议保留的模块及合并方式
3. THE System_Auditor SHALL 将审计结果以清单形式存储在 Knowledge_Manager 中
4. THE System_Auditor SHALL 提供审计结果的可视化展示，标注模块间的重叠关系

---

### 需求 33：录入决策树

**用户故事：** 作为一名 ND/HSP 用户，我希望有一个决策树帮助我快速判断信息该记录到哪个模块，以便我不再因选择困难而消耗额外认知资源。

#### 验收标准

1. THE Decision_Tree SHALL 以不超过 3 层的树状结构引导用户从信息类型到目标模块的决策
2. WHEN 用户启动 Decision_Tree 时，THE Decision_Tree SHALL 首先询问信息类别（任务/知识/习惯/记录/其他）
3. WHEN 用户选择信息类别后，THE Decision_Tree SHALL 根据类别展示下一层筛选条件，最终指向唯一的目标模块
4. THE Decision_Tree SHALL 在 Dashboard 提供快捷入口
5. THE Decision_Tree SHALL 允许用户自定义决策路径和目标模块映射
6. THE Decision_Tree SHALL 使用选择式交互（按钮点击），不要求用户输入文本

---

### 需求 34：系统维护频率分级

**用户故事：** 作为一名 ND/HSP 用户，我希望系统能区分每日必须维护和偶尔维护的模块，以便我能将有限的能量集中在最重要的日常记录上。

#### 验收标准

1. THE System_Auditor SHALL 将 App 中的所有模块分为两类：每日维护（Daily）和偶尔维护（Occasional）
2. THE Dashboard SHALL 仅展示每日维护类模块的入口，聚合所有每日必须操作的功能
3. WHILE 用户处于 Dashboard 视图中，THE App SHALL 隐藏所有偶尔维护类模块的入口，以减少视觉干扰
4. THE App SHALL 允许用户自定义每个模块的维护频率分类
5. THE App SHALL 在侧边栏中以视觉分组区分每日维护和偶尔维护模块

---

### 需求 35：数据持久化与导入导出

**用户故事：** 作为用户，我希望我的所有数据能安全存储并支持导入导出，以便我能从 Notion 迁移数据并防止数据丢失。

#### 验收标准

1. THE App SHALL 将所有用户数据持久化存储至数据库
2. THE App SHALL 提供数据导出功能，支持将所有模块数据导出为 JSON 格式
3. THE App SHALL 提供数据导入功能，支持从 JSON 格式文件导入数据
4. WHEN 用户执行数据导入时，THE App SHALL 在导入前展示数据预览，并要求用户确认后再执行导入操作
5. IF 数据导入过程中发生错误，THEN THE App SHALL 回滚所有已导入的数据并向用户展示错误详情

---

### 需求 36：认知负荷优化

**用户故事：** 作为一名 ND/HSP 用户，我希望所有录入界面都尽量减少认知负荷，以便我在低能量状态下也能顺利完成记录。

#### 验收标准

1. THE App SHALL 在所有数据录入表单中优先使用选择式输入（下拉菜单、单选按钮、多选复选框）而非自由文本输入
2. THE App SHALL 为所有必填字段提供合理的默认值
3. WHILE 用户处于 Energy_Level 等于或低于 2 的状态时，THE Dashboard SHALL 以简化模式展示，仅显示能量签到、任务推荐和急救 SOP 入口
4. THE App SHALL 在所有模块中提供一致的交互模式和视觉风格，避免用户在不同模块间切换时产生认知切换成本
