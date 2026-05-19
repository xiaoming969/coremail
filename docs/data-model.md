# Coremail 数据模型

本文档定义 Coremail 演示产品中的核心数据对象、字段语义、对象关系和后续演进约束。它不是后端数据库设计，也不是 API 协议，但应作为前端 mock 数据、功能规格和未来接口设计的共同词典。

上游依据：

- `docs/product.md`
- `docs/design.md`
- `docs/information-architecture.md`
- `docs/components.md`
- `docs/features/calendar-search.md`
- `docs/features/mail-search.md`
- `docs/features/shared-permission.md`

## 1. 文档目的

Coremail 当前覆盖邮件、日历、多账号、共享权限、日程搜索和邮件搜索。随着功能增加，如果没有统一数据模型，很容易出现：

- 同一字段多种名称。
- 权限标签和权限 ID 混用。
- 账号来源和日历来源混淆。
- 组织者和参与人混淆。
- 删除、移除、取消共享语义混淆。
- mock 数据和真实接口难以对齐。

本文档用于约束：

- 核心实体字段。
- 字段命名和取值。
- 实体之间的关系。
- 派生数据和持久化数据的边界。
- 后续拆分代码或接入真实接口时的数据口径。

## 2. 通用约定

### 2.1 ID

所有核心实体必须有稳定 `id`。

规则：

- 前端列表渲染、选中态、弹窗目标都使用 `id`。
- 不使用名称、邮箱或标题作为唯一 key。
- mock 数据可以使用短 ID，例如 `acc1`、`c1`、`e1`、`m1`。
- 真实系统应使用后端稳定 ID。

### 2.2 时间

当前 demo 中部分日程使用相对时间字段：

- `weekOffset`
- `day`
- `startH`
- `durationH`

这是演示层数据表达，方便固定当前展示。

未来真实接口建议使用：

- `startAt`
- `endAt`
- `timezone`
- `isAllDay`

规则：

- 列表和搜索排序应基于可比较时间戳。
- 展示层负责格式化日期、星期和时间段。
- 不在业务逻辑里直接拼接展示文案作为数据源。

### 2.3 布尔字段

布尔字段使用明确含义：

- `checked`：是否在当前视图中显示。
- `enabled`：某项能力是否开启。
- `unread`：邮件是否未读。
- `starred`：邮件是否星标。
- `isPrimary`：是否主日历。
- `isAllDay`：是否全天日程。

不要用 `status` 表达简单开关。

### 2.4 展示文案与存储值

数据层优先使用稳定 ID，展示层再映射成中文文案。

示例：

- 权限 ID：`all_details`
- 展示文案：`仅查看详情`

不要把中文展示文案作为唯一业务判断依据。

## 3. 实体关系概览

核心关系：

```text
Account 1 -> N Calendar
Account 1 -> N Mail
Calendar 1 -> N Event
Calendar 1 -> N CalendarShare
ShareInvitation -> Calendar 或待创建共享日历
Mail 0/1 -> Event
MailDraft -> Mail
AvailabilityProposal -> Mail 或 MailDraft
```

业务解释：

- 账号决定身份和权限边界。
- 日历决定日程来源和共享关系。
- 日程属于某个日历。
- 邮件属于某个账号和文件夹。
- 邮件可以关联日程，也可以生成日程。
- 共享邀请被接收后，会在接收方左侧生成共享日历。

## 4. Account

账号表示邮箱账号、共享邮箱、群组账号或资源账号。

### 4.1 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 账号唯一 ID |
| `name` | string | 是 | 账号名称，常为邮箱地址 |
| `displayName` | string | 否 | 显示名称，例如用户姓名、群组名 |
| `email` | string | 是 | 邮箱地址 |
| `role` | string | 否 | 展示分类，例如我的账户、其他账户、群组账户、资源账户 |
| `ownership` | string | 是 | 账号归属类型 |
| `color` | string | 是 | UI 颜色 class |
| `checked` | boolean | 是 | 是否在当前视图中显示 |
| `mailboxMembers` | MailboxMember[] | 否 | 邮箱成员和代理权限 |
| `mailboxSettings` | MailboxSettings | 否 | 邮箱设置 |

### 4.2 `ownership`

推荐取值：

| 值 | 含义 |
| --- | --- |
| `self` | 我的账号 |
| `shared` | 他人共享给我的账号或日历来源 |
| `group` | 群组账号 |
| `room` | 会议室或资源账号 |

规则：

- `ownership` 影响菜单和权限入口。
- 共享日历菜单应根据共享日历对象判断，不应只靠展示名称判断。
- 多账号搜索跨账号时，需要展示来源账号。

## 5. MailboxMember

邮箱成员表示某人对邮箱账号的访问或代理发送权限。

### 5.1 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 成员记录 ID |
| `name` | string | 是 | 成员名称 |
| `email` | string | 是 | 成员邮箱 |
| `fullAccess` | boolean | 是 | 是否可完整访问邮箱 |
| `sendAs` | boolean | 是 | 是否可作为该邮箱发送 |
| `sendOnBehalf` | boolean | 是 | 是否可代表该邮箱发送 |

### 5.2 展示规则

人员展示优先：

```text
姓名 + 部门/职位 + 邮箱
```

头像只能辅助，不能作为主要识别信息。

## 6. MailboxSettings

邮箱设置表示邮箱级配置。

### 6.1 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `showInAddressList` | boolean | 否 | 是否显示在地址列表 |
| `saveSentItems` | boolean | 否 | 是否保存已发送邮件 |
| `automap` | boolean | 否 | 是否自动映射到用户邮箱 |
| `mobileAccess` | boolean | 否 | 是否允许移动端访问 |

这些字段属于邮箱设置，不属于日历共享权限。

## 7. Calendar

日历表示某个账号下的日历来源。

### 7.1 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 日历唯一 ID |
| `accountId` | string | 是 | 所属账号 ID |
| `name` | string | 是 | 日历名称 |
| `type` | string | 是 | 日历类型 |
| `owner` | string | 否 | 拥有者或来源人 |
| `color` | string | 是 | UI 颜色 class |
| `checked` | boolean | 是 | 是否在主视图显示 |
| `permission` | string | 否 | 旧展示权限或兼容字段 |
| `isPrimary` | boolean | 否 | 是否主日历 |
| `receivedFrom` | string | 否 | 共享方邮箱 |
| `receivedFromName` | string | 否 | 共享方名称 |
| `receivedPermissionId` | string | 否 | 接收方当前权限 ID |
| `receivedStatus` | string | 否 | 接收状态 |
| `defaultSharing` | CalendarDefaultSharing | 否 | 默认共享策略 |
| `publishing` | CalendarPublishing | 否 | 发布订阅设置 |
| `sharing` | CalendarShare[] | 否 | 共享对象列表 |

### 7.2 `type`

推荐取值：

| 值 | 含义 |
| --- | --- |
| `my` | 我的日历 |
| `shared` | 共享日历 |
| `group` | 群组日历 |
| `room` | 会议室日历 |

规则：

- 我的日历提供 `共享与权限`。
- 共享日历提供 `查看权限` 和 `从列表移除`。
- 接收方不能通过共享日历管理共享权限。

## 8. Permission

权限使用稳定 ID。

### 8.1 权限 ID

| ID | 展示文案 | 含义 |
| --- | --- | --- |
| `none` | 不共享 | 不开放访问 |
| `all_details` | 仅查看详情 | 可查看详细事件信息，不可编辑 |
| `edit` | 可编辑 | 可查看并编辑事件，不可管理共享权限 |
| `busy_only` | 可查看闲忙 | 只显示忙闲占用 |

兼容值：

- `titles_locations` 应映射为 `all_details`。
- `仅查看`、`查看所有详细信息` 等旧文案应映射为 `all_details`。
- `闲忙` 应映射为 `busy_only`。

### 8.2 使用规则

数据判断使用权限 ID。

展示文案通过映射生成。

不要用中文文案直接判断权限能力。

## 9. CalendarShare

共享记录表示共享方把某个日历共享给某个对象。

### 9.1 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 共享记录 ID |
| `name` | string | 是 | 共享对象名称 |
| `email` | string | 是 | 共享对象邮箱 |
| `scope` | string | 是 | 对象范围，例如 internal、external |
| `permission` | string | 是 | 权限 ID |
| `status` | string | 是 | 接收状态 |
| `updatedAt` | number | 否 | 最近更新时间戳 |
| `canViewPrivate` | boolean | 否 | 是否可查看私密日程 |
| `meetingResponses` | string | 否 | 会议响应处理方式 |

### 9.2 `status`

推荐取值：

| 值 | 展示文案 |
| --- | --- |
| `pending` | 待接收 |
| `accepted` | 已接收 |
| `expired` | 已失效 |
| `removed` | 已移除 |

注意：

- 接收方 `从列表移除` 不应改变共享方记录的权限语义。
- 共享方 `取消共享` 才会撤销访问权限。

## 10. CalendarDefaultSharing

默认共享策略表示组织内外默认可见性。

### 10.1 字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `organization` | permissionId | 组织内默认权限 |
| `external` | permissionId | 外部对象默认权限 |

规则：

- 默认共享策略不等同于具体共享记录。
- 具体共享记录优先级高于默认策略。

## 11. CalendarPublishing

发布订阅设置用于公开或半公开日历链接。

### 11.1 字段

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `enabled` | boolean | 是否启用发布 |
| `permission` | permissionId | 发布可见权限 |
| `htmlLink` | string | HTML 查看链接 |
| `icsLink` | string | ICS 订阅链接 |

发布链接属于日历拥有者能力，接收方默认不应管理。

## 12. ShareInvitation

共享邀请表示别人共享日历给当前用户但尚未接收的记录。

### 12.1 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 邀请 ID |
| `senderName` | string | 是 | 共享方名称 |
| `senderEmail` | string | 是 | 共享方邮箱 |
| `calendarName` | string | 是 | 被共享日历名称 |
| `permissionId` | string | 是 | 授予权限 |
| `color` | string | 否 | 接收后默认颜色 |
| `status` | string | 是 | 邀请状态 |
| `createdAt` | number | 是 | 创建时间戳 |
| `message` | string | 否 | 邀请说明 |

### 12.2 状态

推荐取值：

- `pending`
- `accepted`
- `ignored`
- `expired`

接收后可生成：

- 一个 `Account`。
- 一个或多个 `Calendar`。
- 对应 `Calendar.receivedPermissionId`。

## 13. Event

日程表示日历中的会议、忙闲块、全天事件或节假日。

### 13.1 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 日程 ID |
| `title` | string | 是 | 标题 |
| `calId` | string | 是 | 所属日历 ID |
| `day` | number | demo 必填 | 周内第几天，0-6 |
| `weekOffset` | number | demo 必填 | 相对基准周偏移 |
| `startH` | number | 否 | 开始小时，支持半小时或小数 |
| `durationH` | number | 否 | 持续小时数 |
| `isAllDay` | boolean | 否 | 是否全天 |
| `allDaySpan` | number | 否 | 全天跨天数量 |
| `location` | string | 否 | 地点 |
| `organizer` | string | 否 | 组织者 |
| `attendees` | string[] | 否 | 必需参与人 |
| `optionalAttendees` | string[] | 否 | 可选参与人 |
| `status` | string | 否 | 用户或会议状态 |
| `description` | string | 否 | 正文或备注 |
| `type` | string | 否 | 日程类型 |
| `kind` | string | 否 | 业务类型，默认 event |
| `meetingProvider` | string | 否 | 线上会议提供方 |
| `meetingLink` | string | 否 | 入会链接 |
| `repeat` | string | 否 | 循环规则 |
| `reminder` | string | 否 | 提醒规则 |
| `availability` | string | 否 | 忙闲状态 |
| `visibility` | string | 否 | 可见性 |
| `attachments` | string[] 或 Attachment[] | 否 | 附件 |
| `colorCategory` | string | 否 | 颜色分类 |
| `colorCategories` | string[] | 否 | 多颜色分类 |

### 13.2 时间字段演进

当前 demo：

```text
day + weekOffset + startH + durationH
```

未来真实接口建议：

```text
startAt + endAt + timezone
```

迁移时应保留展示层能力：

- 日期。
- 星期。
- 开始时间。
- 结束时间。
- 全天和跨天。

### 13.3 `status`

常见值：

- `已接受`
- `待响应`
- `已取消`
- `草稿`

注意：

- 会议状态不是颜色分类。
- 搜索列表不强展示“我的响应”，除非具体功能规格要求。

### 13.4 `type`

常见值：

- `normal`
- `cancelled`
- `busy_only`
- `holiday`

规则：

- `busy_only` 不展示敏感详情。
- `cancelled` 不展示一键入会。
- `holiday` 不按普通会议处理。

### 13.5 `meetingProvider`

常见值：

- `none`
- `meet`
- `teams`
- `zoom`
- `phone`

仅当 `meetingLink` 有效且日程满足入会条件时，列表展示一键入会。

### 13.6 `repeat`

推荐值：

- `does_not_repeat`
- `every_week`
- `every_month`
- `workdays`

展示规则：

- 普通会议不展示循环标识。
- 循环会议必须展示文字，例如 `循环 · 每周`。

### 13.7 颜色分类

颜色分类是用户自定义管理维度。

规则：

- `colorCategory` 表示单分类。
- `colorCategories` 表示多分类。
- 没有分类时不展示。
- 分类名称由展示层映射和允许修改。
- 颜色分类不等于会议状态。

## 14. Attachment

附件可用于邮件或日程。

### 14.1 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `name` | string | 是 | 文件名 |
| `size` | string | 否 | 文件大小展示值 |
| `url` | string | 否 | 文件访问链接 |
| `permission` | string | 否 | 附件权限状态 |

规则：

- 列表页只展示附件线索。
- 附件操作进入详情页处理。
- 无权限附件不展示敏感文件名。

## 15. Mail

邮件表示邮箱中的一封邮件。

### 15.1 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 邮件 ID |
| `accountId` | string | 是 | 所属账号 ID |
| `folder` | string | 是 | 文件夹 |
| `category` | string | 否 | 重点或其他 |
| `unread` | boolean | 是 | 是否未读 |
| `starred` | boolean | 是 | 是否星标 |
| `subject` | string | 是 | 主题 |
| `fromName` | string | 是 | 发件人名称 |
| `fromEmail` | string | 是 | 发件人邮箱 |
| `to` | string[] | 是 | 收件人 |
| `cc` | string[] | 否 | 抄送人 |
| `preview` | string | 否 | 列表摘要 |
| `body` | string | 否 | 正文 |
| `attachments` | Attachment[] | 否 | 附件 |
| `timestamp` | number | 是 | 邮件时间 |
| `linkedEventId` | string | 否 | 关联日程 ID |
| `availabilityProposal` | AvailabilityProposal | 否 | 可用时间卡 |
| `rescheduleRequestForEventId` | string | 否 | 重排请求关联日程 |
| `rescheduleResolvedAt` | number | 否 | 重排处理时间 |

### 15.2 `folder`

推荐取值：

- `inbox`
- `drafts`
- `sent`
- `archive`

### 15.3 `category`

推荐取值：

- `focused`
- `other`

该字段只用于收件箱重点/其他分类，不等于业务标签。

### 15.4 关联日程

`linkedEventId` 建立邮件与日程的关系。

规则：

- 邮件列表可展示 `关联日程`。
- 邮件详情可打开关联日程。
- 从邮件生成日程时，应写入来源邮件信息。

## 16. MailDraft

写信草稿用于写邮件、回复、全部回复、转发和编辑草稿。

### 16.1 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `mailId` | string | 否 | 编辑已有草稿时的邮件 ID |
| `accountId` | string | 是 | 发送账号 |
| `to` | string | 否 | 收件人输入串 |
| `cc` | string | 否 | 抄送输入串 |
| `subject` | string | 否 | 主题 |
| `body` | string | 否 | 正文 |
| `attachments` | Attachment[] | 否 | 附件 |
| `availabilityProposal` | AvailabilityProposal | 否 | 可用时间卡 |

### 16.2 收件人格式

当前 demo 使用分隔字符串：

```text
a@example.com; b@example.com
```

未来真实模型建议使用结构化数组：

```text
[{ name, email, scope }]
```

展示层仍可接受用户粘贴的分隔字符串。

## 17. AvailabilityProposal

可用时间卡用于从邮件中插入候选时间或确认会议时间。

### 17.1 字段

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 可用时间卡 ID |
| `accountId` | string | 是 | 创建账号 |
| `createdByAccountId` | string | 否 | 创建人账号 |
| `status` | string | 是 | 状态 |
| `slots` | AvailabilitySlot[] | 是 | 候选时间 |
| `confirmedSlotId` | string | 否 | 已确认时间 ID |

### 17.2 AvailabilitySlot

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 候选时间 ID |
| `dateMs` | number | 是 | 日期时间戳 |
| `startH` | number | 是 | 开始小时 |
| `durationH` | number | 是 | 持续小时数 |
| `summary` | string | 否 | 可读说明 |

### 17.3 状态

推荐取值：

- `draft`
- `sent`
- `confirmed`
- `removed`

可用时间卡是邮件能力，不应替代日历忙闲模型。

## 18. SearchResult

搜索结果通常是派生对象，不应作为持久化实体。

### 18.1 CalendarSearchResult

字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `event` | Event | 命中的日程 |
| `calendar` | Calendar | 日程所属日历 |
| `account` | Account | 日历所属账号 |
| `sourceLabel` | string | 跨账号来源展示 |
| `match` | SearchMatch | 匹配信息 |

### 18.2 MailSearchResult

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `mail` | Mail | 命中的邮件 |
| `account` | Account | 邮件所属账号 |
| `folderLabel` | string | 文件夹展示 |
| `sourceLabel` | string | 跨账号来源展示 |
| `match` | SearchMatch | 匹配信息 |

### 18.3 SearchMatch

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `score` | number | 相关性分数 |
| `matchedFields` | string[] | 命中的字段 |
| `tokens` | string[] | 搜索词分词 |

规则：

- 普通搜索结果页不展示“命中来源”文案。
- `matchedFields` 只用于决定是否展示正文片段或附件信息。

## 19. UI State

以下属于界面状态，不应作为核心业务实体：

- 当前模块 `activeProduct`。
- 当前日历页面状态 `currentScreen`。
- 当前搜索关键词。
- 当前筛选条件。
- 当前选中日程或邮件。
- 弹窗打开状态。
- 右键菜单位置。
- hover 预览状态。
- 拖拽、缩放、选区状态。

规则：

- UI state 可以本地保存或重置。
- 不应污染业务实体字段。
- 不应依赖 UI state 判断权限。

## 20. Mock 数据规则

当前 demo 使用 mock 数据。

规则：

- mock 数据可以用相对时间字段制造稳定演示。
- mock 数据可以保留丰富场景，例如多账号、共享日历、循环会议、历史会议。
- mock 数据字段应尽量接近真实模型。
- 新增 mock 字段时，应同步更新本文档。

不建议：

- 为单个页面临时加无法解释的字段。
- 用展示文案代替稳定 ID。
- 把 UI 状态写进 mock 实体。

## 21. 数据模型检查清单

新增或修改字段前，检查：

1. 这个字段属于哪个实体？
2. 它是持久化业务数据，还是 UI state？
3. 它是否已有同义字段？
4. 它是否应该使用稳定 ID 而不是展示文案？
5. 它是否影响权限判断？
6. 它是否影响搜索、筛选或排序？
7. 它是否需要跨账号展示来源？
8. 它是否会混淆组织者、参与人、账号来源、日历来源？
9. 它是否会混淆颜色分类、会议状态、权限状态？
10. 它是否需要同步更新对应 feature 文档？
