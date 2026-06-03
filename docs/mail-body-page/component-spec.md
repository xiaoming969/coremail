# 邮件正文页组件规范

## 1. MailReadingPane

邮件正文页主容器，承载邮件头部、操作区、附件区、安全提示、正文、快捷回复和异常状态。

建议 props：

- `mail`
- `loading`
- `error`
- `permissionDenied`
- `deleted`
- `onReply`
- `onReplyAll`
- `onForward`
- `onArchive`
- `onDelete`
- `onMove`
- `onMarkUnread`
- `onToggleFollowUp`
- `onDownloadAttachment`
- `onPreviewAttachment`
- `onCreateTask`
- `onCreateEvent`

状态包括 `normal`、`loading`、`empty`、`error`、`permissionDenied`、`deleted`、`blocked`。

## 2. MailActionBar

展示邮件高频操作，必须包含回复、回复全部、转发、归档、删除、更多。

规则：

- 主操作必须可见。
- 危险操作需要确认或撤销。
- 滚动时保持可见。
- loading 状态下禁用。

## 3. MailHeader

展示邮件主题、发件人、发送时间和收件关系。必须包含 `subject`、`sender name`、`sender email`、`sent time`、`recipients summary`、`external sender badge`、`system mail badge`、`importance badge`。

## 4. RecipientDetails

展示 To、Cc、Bcc 明细。默认折叠，点击展开，外部人员明确标识，人数较多时支持查看全部。

## 5. SecurityNotice

展示安全提示。类型包括 `info`、`warning`、`danger`。`info` 不阻断，`warning` 解释风险，`danger` 可阻断下载或打开链接。

## 6. AttachmentList

展示附件列表。必须包含文件名、文件类型、文件大小、扫描状态、预览、下载。

状态包括：

- `normal`
- `scanning`
- `safe`
- `risky`
- `blocked`
- `unavailable`

## 7. MailBody

展示正文内容。最新正文完整展示，控制最大阅读宽度，表格和图片需要适配，外部链接需要识别，空正文需要展示占位说明。

## 8. QuotedHistory

展示历史引用。默认折叠，点击展开，签名和免责声明弱化展示。

## 9. QuickReply

提供快捷回复入口。状态包括 `collapsed`、`focused`、`editing`、`sending`、`sent`、`disabled`。默认轻量输入，点击后展开，发送中禁用重复提交，系统邮件可隐藏。

## 10. MailStateView

统一展示空、加载、失败、权限不足、已删除、安全拦截等状态。
