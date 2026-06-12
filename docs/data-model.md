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

Coremail 当前覆盖邮件、日历、通讯录、多账号、共享权限、日程搜索、邮件搜索和人员搜索。随着功能增加，如果没有统一数据模型，很容易出现：

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

### 2.2.1 中国节假日与工作日

当前 demo 内置 2026 年中国节假日和调休工作日规则，用于：

- 生成节假日日历的全天事件。
- 判断周 / 日视图时间格是否应作为休息日置灰。
- 判断周末调休工作日是否应恢复为普通工作日，并显示 `班` 徽标。

数据口径：

- `CHINA_2026_HOLIDAY_RANGES`：法定节假日放假区间。
- `CHINA_2026_MAKEUP_WORKDAY_KEYS`：周末调休工作日日期。
- `isChinaRestDay(date)`：休息日判断，包含周六、周日和法定节假日，但排除调休工作日。
- `isChinaMakeupWorkday(date)`：调休工作日判断。

该规则是前端 mock 数据，不代表长期后端接口。接入真实日历服务后，节假日和调休工作日应来自企业配置或官方节假日源，并按年份更新。

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
Department 1 -> N Contact
ContactGroup N -> N Contact
ShareInvitation -> Calendar 或待创建共享日历
Mail 0/1 -> Event
MailDraft -> Mail
SearchResult -> Mail、Event 或 Contact
```

业务解释：

- 账号决定身份和权限边界。
- 日历决定日程来源和共享关系。
- 日程属于某个日历。
- 邮件属于某个账号和文件夹。
- 邮件可以关联日程，也可以生成日程。
- 联系人属于企业通讯录、个人通讯录、外部联系人或群组。
- 部门和群组帮助识别人员来源和选择影响范围。
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
| `securityStatus` | string | 否 | 安全扫描状态，例如 scanning、safe、risky、blocked、unavailable |

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
| `flagStatus` | string | 否 | 旗标或跟进状态 |
| `importance` | string | 否 | 重要性，例如 normal、high |
| `conversationId` | string | 否 | 会话 ID |
| `subject` | string | 是 | 主题 |
| `fromName` | string | 是 | 发件人名称 |
| `fromEmail` | string | 是 | 发件人邮箱 |
| `fromScope` | string | 是 | 发件人范围，例如 internal、external、system |
| `to` | string[] | 是 | 收件人 |
| `cc` | string[] | 否 | 抄送人 |
| `preview` | string | 否 | 列表摘要 |
| `body` | string | 否 | 正文 |
| `attachments` | Attachment[] | 否 | 附件 |
| `timestamp` | number | 是 | 邮件时间 |
| `securityStatus` | string | 否 | 邮件安全状态 |
| `isSystem` | boolean | 否 | 是否系统邮件 |
| `linkedEventId` | string | 否 | 关联日程 ID |

### 15.2 `folder`

推荐取值：

- `inbox`
- `drafts`
- `sent`
- `archive`
- `deleted`
- `junk`
- `outbox`
- `conversation`

### 15.3 发件人字段

规则：

- `fromName` 必须是完整个人姓名。不能使用部门、岗位、团队、职级、称谓或角色代替，例如 `人力资源`、`产品经理`、`销售团队`、`周老师`、`李经理` 都不是合格发件人姓名。
- 当前用户作为发件人时，也应写入真实姓名，例如 `小华`，不要把 `我` 作为邮件数据中的发件人名称。
- `fromEmail` 保留邮箱地址，列表默认不重复展示；详情、悬停补充和搜索来源说明可以展示。
- `fromScope` 应明确写入 `internal`、`external` 或 `system`，展示层据此区分内外部邮件和系统邮件。
- 无后端的 mock 数据也必须遵守上述规则，不能用岗位或部门名占位。

### 15.4 `category`

推荐取值：

- `focused`
- `other`

该字段只用于收件箱重点/其他分类，不等于业务标签。

### 15.5 关联日程

`linkedEventId` 建立邮件与日程的关系。

规则：

- 邮件列表可展示 `关联日程`。
- 邮件详情可打开关联日程。
- 从邮件生成日程时，应写入来源邮件信息。

### 15.6 MailFavorite

邮箱收藏夹表示 A 栏的快捷范围入口，不是独立邮件文件夹。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 收藏项 ID，建议由 `folderId` 和 `accountId` 组合生成 |
| `folderId` | string | 是 | 指向的邮件文件夹或派生范围，例如 inbox、sent、drafts、deleted |
| `accountId` | string | 是 | 指向的账号；`all` 表示全账号聚合范围 |

规则：

- `accountId = all` 表示聚合范围，展示数量和打开后的邮件列表都必须覆盖所有账号。
- 相同 `folderId` 可以为多个账号各自创建收藏项，此时 `id` 必须保留账号维度，例如 `unread-acc1`、`unread-acc2`。
- 账号级同名收藏项展示时必须附带账号名称或邮箱，避免用户误判作用范围。
- `从收藏夹移除` 只删除 `MailFavorite` 入口，不改变 `Mail.folder`、邮件内容或账号权限。
- 收藏夹添加 / 移除属于本地偏好，必须用短反馈说明结果。

### 15.7 MailCustomFolder

邮箱自定义文件夹表示账号下由用户创建或导入的本地文件夹节点。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 自定义文件夹 ID |
| `accountId` | string | 是 | 所属邮箱账号 |
| `parentFolderId` | string \| null | 否 | 父级文件夹；为空表示账号根级 |
| `label` | string | 是 | 文件夹名称 |
| `source` | string | 否 | 来源，例如 `manual`、`import` |

规则：

- `创建子文件夹` 写入 `source = manual`。
- `导入归档` 写入 `source = import`，归档内容缺失时可以先以 Mock 文件夹表达，但不得假装已经导入真实后端数据。
- 在无后端的原型中，自定义文件夹至少应作为本地偏好保存，刷新后不能立即丢失。
- 自定义文件夹的右键操作应遵循普通实体文件夹规则；清空时仍需确认影响范围。

### 15.8 MailFolderOrder

邮箱文件夹排序表示用户在 A 栏对某个账号下文件夹顺序的本地偏好。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `accountId` | string | 是 | 邮箱账号 ID |
| `folderIds` | string[] | 是 | 该账号下文件夹、派生范围和自定义文件夹的展示顺序 |

规则：

- 排序按账号保存，账号 A 的排序不得影响账号 B。
- `folderIds` 中不存在或已不可用的 ID 应被忽略；新增文件夹应追加到当前账号列表末尾。
- 拖动排序只改变 A 栏展示顺序，不改变 `Mail.folder`、邮件内容、收藏夹、权限或后端文件夹结构。
- 在无后端的原型中，排序至少应作为本地偏好保存，刷新后不能立即丢失。

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

## 17. Contact Directory

通讯录实体用于联系人列表、联系人详情、组织架构、人员搜索和人员选择。

### 17.1 Contact

联系人表示内部员工或外部联系人。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 联系人唯一 ID |
| `name` | string | 是 | 姓名 |
| `email` | string | 是 | 邮箱 |
| `departmentId` | string | 否 | 所属部门 ID |
| `departmentName` | string | 否 | 所属部门展示名 |
| `organizationPath` | string[] | 否 | 组织路径 |
| `title` | string | 否 | 职位或角色 |
| `phone` | string | 否 | 手机号 |
| `officePhone` | string | 否 | 办公电话 |
| `scope` | string | 是 | 联系人范围，例如 internal、external |
| `status` | string | 否 | 可见或可选状态 |
| `groupIds` | string[] | 否 | 所属群组 |

规则：

- 重名人员必须通过 `departmentName`、`title`、`email` 或 `organizationPath` 辅助识别。
- 外部联系人使用 `scope: external`，展示层必须明确标识。
- 权限不足联系人不要展示空姓名或空邮箱，应使用 `status` 说明不可见原因。

### 17.2 Department

部门用于组织架构树和部门选择。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 部门唯一 ID |
| `name` | string | 是 | 部门名称 |
| `parentId` | string | 否 | 上级部门 ID |
| `path` | string[] | 否 | 完整组织路径 |
| `memberCount` | number | 否 | 成员数量 |
| `managerContactId` | string | 否 | 部门负责人联系人 ID |

### 17.3 ContactGroup

群组用于分发列表、协作组和人员选择。

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | 是 | 群组唯一 ID |
| `name` | string | 是 | 群组名称 |
| `type` | string | 是 | 群组类型，例如 distribution、project、department |
| `memberCount` | number | 否 | 成员数量 |
| `memberContactIds` | string[] | 否 | 成员联系人 ID |
| `scope` | string | 否 | 群组范围，例如 internal、external |

规则：

- 群组和部门不是个人联系人，人员选择中必须显示对象类型。
- 选择群组或部门时，展示层必须说明影响范围。

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

### 18.3 ContactSearchResult

建议字段：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `contact` | Contact | 命中的联系人 |
| `department` | Department | 所属部门 |
| `groups` | ContactGroup[] | 所属群组 |
| `sourceLabel` | string | 来源展示 |
| `match` | SearchMatch | 匹配信息 |

### 18.4 SearchMatch

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
- mock 数据应覆盖联系人、部门、群组、重名人员和外部联系人。
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
