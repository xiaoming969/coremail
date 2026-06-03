import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import AppIcon from '../../../components/AppIcon';
import type { MailAttachment, MailReaderActionHandlers, MailReadingPaneMail, MailReadingState, MailSecurityInfo } from '../types/mail';
import {
  getEffectiveReadingState,
  getMailRecipients,
  getMailSender,
  getRecipientSummary,
  getSecurityInfo,
  hasReplyAllRisk,
  normalizeAttachments,
} from '../utils/mailReadingPane';

type MailAiInsight = {
  categoryLabel: string;
  categoryTone: string;
  summary: string;
  todos: string[];
  replies: string[];
};

type LinkedEventMeta = {
  id: string;
  status?: string;
  summary?: string;
};

type MailReadingPaneProps = MailReaderActionHandlers & {
  mail: MailReadingPaneMail | null;
  state?: MailReadingState;
  folderLabel?: string;
  linkedEvent?: LinkedEventMeta | null;
  aiInsight?: MailAiInsight | null;
  formatMailTime: (timestamp?: number) => string;
  onOpenLinkedEvent?: () => void;
};

type IconButtonProps = {
  icon: string;
  label: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  fill?: string;
};

const iconButtonClass =
  'inline-flex h-9 shrink-0 items-center rounded-lg px-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-45';
const iconOnlyButtonClass =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-45';

function IconButton({ icon, label, className = iconButtonClass, onClick, disabled, fill = 'none' }: IconButtonProps) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      <AppIcon name={icon} size={16} className="mr-1.5 shrink-0" fill={fill} />
      {label}
    </button>
  );
}

function MailActionBar({
  mail,
  disabled,
  moreOpen,
  setMoreOpen,
  moreRef,
  onReply,
  onReplyAll,
  onForward,
  onArchive,
  onDelete,
  onMove,
  onToggleRead,
  onToggleFollowUp,
  onCreateTask,
  onCreateEvent,
}: {
  mail: MailReadingPaneMail;
  disabled: boolean;
  moreOpen: boolean;
  setMoreOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  moreRef: React.RefObject<HTMLDivElement | null>;
} & Pick<
  MailReaderActionHandlers,
  'onReply' | 'onReplyAll' | 'onForward' | 'onArchive' | 'onDelete' | 'onMove' | 'onToggleRead' | 'onToggleFollowUp' | 'onCreateTask' | 'onCreateEvent'
>) {
  const systemReplyDisabled = Boolean(mail.isSystemMail);
  const actions: Array<{
    id: string;
    label: string;
    icon: string;
    onClick?: () => void;
    fill?: string;
    menuOnly?: boolean;
    accent?: boolean;
    disabled?: boolean;
  }> = [
    { id: 'reply', label: '回复', icon: 'lucide:reply', onClick: onReply, disabled: systemReplyDisabled },
    { id: 'replyAll', label: '回复全部', icon: 'lucide:reply-all', onClick: onReplyAll, disabled: systemReplyDisabled },
    { id: 'forward', label: '转发', icon: 'lucide:forward', onClick: onForward },
    { id: 'archive', label: '归档', icon: 'lucide:archive', onClick: onArchive },
    { id: 'delete', label: '删除', icon: 'lucide:trash', onClick: onDelete },
    { id: 'read', label: mail.unread ? '标为已读' : '标为未读', icon: 'lucide:mail', onClick: onToggleRead },
    { id: 'followUp', label: '标记旗标', icon: 'lucide:flag', onClick: onToggleFollowUp, fill: mail.starred || mail.hasFollowUp ? 'currentColor' : 'none' },
    { id: 'move', label: '移动到归档', icon: 'lucide:folder-input', onClick: onMove, menuOnly: true },
    { id: 'schedule', label: '生成日程', icon: 'lucide:calendar', onClick: onCreateEvent, accent: true },
  ];
  const toolbarActions = actions.filter((action) => !action.menuOnly);

  const menuActions = [
    ...actions,
    { id: 'task', label: '创建任务', icon: 'lucide:list-checks', onClick: onCreateTask, accent: true },
  ];

  return (
    <div
      data-mail-reader-toolbar="true"
      data-mail-reader-action-bar="true"
      className="sticky top-0 z-30 flex shrink-0 flex-nowrap items-center border-b border-slate-200 bg-white px-6 py-4"
    >
      <div data-mail-reader-toolbar-actions="true" className="flex min-w-0 flex-1 flex-nowrap items-center gap-1 overflow-hidden whitespace-nowrap pr-2">
          {toolbarActions.map((action) => (
          <IconButton
            key={action.id}
            icon={action.icon}
            label={action.label}
            fill={action.fill}
            disabled={disabled || action.disabled || !action.onClick}
            onClick={action.onClick}
            className={
              action.accent
                ? 'inline-flex h-9 shrink-0 items-center rounded-lg px-2.5 text-sm font-bold text-[#0A59F7] transition hover:bg-[#0A59F7]/[0.08] disabled:cursor-not-allowed disabled:opacity-45'
                : iconButtonClass
            }
          />
        ))}
      </div>

      <div ref={moreRef} className="relative mr-2 shrink-0">
        <button
          type="button"
          aria-label="更多邮件操作"
          title="更多邮件操作"
          aria-haspopup="menu"
          aria-expanded={moreOpen}
          disabled={disabled}
          onClick={() => setMoreOpen((open) => !open)}
          className={iconOnlyButtonClass}
        >
          <AppIcon name="lucide:more-horizontal" size={18} />
        </button>
        {moreOpen && (
          <div
            data-mail-reader-more-menu="true"
            role="menu"
            className="absolute right-0 top-[calc(100%+8px)] z-40 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-[0_12px_32px_rgba(15,23,42,0.14)]"
          >
            {menuActions.map((action) => (
              <button
                key={action.id}
                type="button"
                role="menuitem"
                disabled={disabled || action.disabled || !action.onClick}
                onClick={() => {
                  setMoreOpen(false);
                  action.onClick?.();
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${
                  action.accent ? 'text-[#0A59F7] hover:bg-[#0A59F7]/[0.08] hover:text-[#084DDB]' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <AppIcon name={action.icon} size={16} className="shrink-0 text-slate-500" fill={action.fill} />
                <span className="min-w-0 flex-1 truncate">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div data-mail-reader-window-controls="true" className="ml-auto flex shrink-0 items-center gap-1">
        <button type="button" aria-label="客服帮助" title="客服帮助" className={iconOnlyButtonClass}>
          <AppIcon name="lucide:circle-help" size={17} />
        </button>
        <div className="mx-1 h-6 w-px bg-slate-200" />
        <button type="button" aria-label="最小化窗口" title="最小化" className={iconOnlyButtonClass}>
          <AppIcon name="lucide:minus" size={17} />
        </button>
        <button type="button" aria-label="全屏窗口" title="全屏" className={iconOnlyButtonClass}>
          <AppIcon name="lucide:maximize-2" size={16} />
        </button>
        <button type="button" aria-label="关闭窗口" title="关闭" className={iconOnlyButtonClass}>
          <AppIcon name="lucide:x" size={17} />
        </button>
      </div>
    </div>
  );
}

function RecipientDetails({ mail, expanded, onToggle }: { mail: MailReadingPaneMail; expanded: boolean; onToggle: () => void }) {
  const groups = [
    { id: 'to', label: 'To', recipients: getMailRecipients(mail, 'to') },
    { id: 'cc', label: 'Cc', recipients: getMailRecipients(mail, 'cc') },
    { id: 'bcc', label: 'Bcc', recipients: getMailRecipients(mail, 'bcc') },
  ].filter((group) => group.recipients.length > 0);

  return (
    <div className="mt-2">
      <button
        type="button"
        data-mail-recipient-summary="true"
        aria-label={expanded ? '收起收件人明细' : '查看收件人明细'}
        aria-expanded={expanded}
        onClick={onToggle}
        className="inline-flex max-w-full items-center gap-1.5 rounded-lg px-0 py-1 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
      >
        <span className="truncate">{getRecipientSummary(mail)}</span>
        <AppIcon name={expanded ? 'lucide:chevron-up' : 'lucide:chevron-down'} size={14} className="shrink-0" />
      </button>
      {expanded && (
        <div data-mail-recipient-details="true" className="mt-2 max-w-[760px] space-y-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          {groups.map((group) => (
            <div key={group.id} className="grid gap-2 text-sm sm:grid-cols-[44px_minmax(0,1fr)]">
              <div className="font-black text-slate-500">{group.label}</div>
              <div className="flex min-w-0 flex-wrap gap-2">
                {group.recipients.map((recipient) => (
                  <span key={`${group.id}-${recipient.email}`} className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                    <span className="truncate">{recipient.name || recipient.email}</span>
                    {recipient.email && <span className="truncate text-slate-400">&lt;{recipient.email}&gt;</span>}
                    {recipient.isExternal && <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-xs font-black text-amber-700">外部</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MailHeader({
  mail,
  folderLabel,
  linkedEvent,
  formatMailTime,
  recipientExpanded,
  onToggleRecipients,
  onOpenLinkedEvent,
}: {
  mail: MailReadingPaneMail;
  folderLabel?: string;
  linkedEvent?: LinkedEventMeta | null;
  formatMailTime: (timestamp?: number) => string;
  recipientExpanded: boolean;
  onToggleRecipients: () => void;
  onOpenLinkedEvent?: () => void;
}) {
  const sender = getMailSender(mail);

  return (
    <div data-mail-reader-header="true" className="border-b border-slate-200 bg-white px-6 py-5">
      <div className="max-w-[1040px]">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {folderLabel && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{folderLabel}</span>}
          {mail.unread && <span className="rounded-full bg-[#0A59F7]/[0.08] px-2.5 py-1 text-xs font-bold text-[#0A59F7]">未读</span>}
          {(mail.isImportant || mail.starred) && <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">重要</span>}
          {mail.isSystemMail && <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-bold text-white">系统邮件</span>}
          {sender.isExternal && (
            <span data-mail-external-sender-badge="true" className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
              外部发件人
            </span>
          )}
          {linkedEvent && onOpenLinkedEvent && (
            <button
              type="button"
              onClick={onOpenLinkedEvent}
              className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100"
            >
              查看关联日程
            </button>
          )}
        </div>
        <h2 className="text-2xl font-black leading-tight text-slate-950">{mail.subject || '无主题'}</h2>
        <div data-mail-reader-sender-meta="true" className="mt-4 min-w-0 text-sm">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-black text-slate-900">{sender.name || sender.email || '未知发件人'}</span>
            {sender.email && <span className="font-semibold text-slate-500">&lt;{sender.email}&gt;</span>}
            <span className="text-slate-300">·</span>
            <span className="font-semibold text-slate-400">{formatMailTime(mail.timestamp)}</span>
          </div>
          <RecipientDetails mail={mail} expanded={recipientExpanded} onToggle={onToggleRecipients} />
        </div>
        {linkedEvent?.summary && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-500">
            日程：{linkedEvent.summary}
          </div>
        )}
      </div>
    </div>
  );
}

function SecurityNotice({ security, onSecurityAction }: { security: MailSecurityInfo; onSecurityAction?: (action: string) => void }) {
  if (security.level === 'none') return null;

  const tone =
    security.level === 'danger'
      ? {
          icon: 'lucide:shield-alert',
          wrap: 'border-red-200 bg-red-50 text-red-950',
          iconTone: 'text-red-600',
          button: 'border-red-200 bg-white text-red-700 hover:bg-red-100',
        }
      : security.level === 'warning'
        ? {
            icon: 'lucide:triangle-alert',
            wrap: 'border-amber-200 bg-amber-50 text-amber-950',
            iconTone: 'text-amber-600',
            button: 'border-amber-200 bg-white text-amber-800 hover:bg-amber-100',
          }
        : {
            icon: 'lucide:shield-check',
            wrap: 'border-sky-200 bg-sky-50 text-sky-950',
            iconTone: 'text-sky-600',
            button: 'border-sky-200 bg-white text-sky-700 hover:bg-sky-100',
          };

  const reasons = [
    security.isExternalSender ? '外部发件人' : '',
    security.hasExternalRecipients ? '含外部收件人' : '',
    security.hasExternalLinks ? '含外部链接' : '',
    security.hasRiskyAttachments ? '含风险附件' : '',
    security.isSensitive ? '敏感邮件' : '',
  ].filter(Boolean);

  return (
    <section data-mail-security-notice="true" className={`mb-5 max-w-[980px] rounded-lg border px-5 py-4 ${tone.wrap}`}>
      <div className="flex items-start gap-3">
        <AppIcon name={tone.icon} size={18} className={`mt-0.5 shrink-0 ${tone.iconTone}`} />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-black">{security.message || '请注意邮件安全风险。'}</div>
          {reasons.length > 0 && <div className="mt-1 text-xs font-semibold opacity-80">{reasons.join(' · ')}</div>}
          {security.level === 'danger' && (
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => onSecurityAction?.('details')} className={`rounded-lg border px-3 py-1.5 text-xs font-black transition ${tone.button}`}>
                查看风险详情
              </button>
              <button type="button" onClick={() => onSecurityAction?.('report')} className={`rounded-lg border px-3 py-1.5 text-xs font-black transition ${tone.button}`}>
                举报邮件
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const attachmentStatusMeta: Record<MailAttachment['status'], { label: string; className: string; desc: string }> = {
  safe: {
    label: '安全',
    className: 'bg-emerald-50 text-emerald-700',
    desc: '安全扫描已通过',
  },
  scanning: {
    label: '扫描中',
    className: 'bg-sky-50 text-sky-700',
    desc: '附件正在安全扫描，扫描完成后可下载。',
  },
  warning: {
    label: '有风险',
    className: 'bg-amber-50 text-amber-700',
    desc: '下载前请确认附件来源。',
  },
  blocked: {
    label: '高风险附件',
    className: 'bg-red-50 text-red-700',
    desc: '系统已限制该附件下载。',
  },
  unavailable: {
    label: '不可用',
    className: 'bg-slate-100 text-slate-600',
    desc: '附件当前不可预览或下载。',
  },
};

function AttachmentList({
  attachments,
  state,
  onPreviewAttachment,
  onDownloadAttachment,
  onRetry,
}: {
  attachments: MailAttachment[];
  state: MailReadingState | 'unselected';
  onPreviewAttachment?: (attachment: MailAttachment) => void;
  onDownloadAttachment?: (attachment: MailAttachment) => void;
  onRetry?: () => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<MailAttachment | null>(null);
  const visibleAttachments = showAll ? attachments : attachments.slice(0, 3);
  const requestDownload = (attachment: MailAttachment) => {
    if (attachment.status === 'warning') {
      setPendingDownload(attachment);
      return;
    }
    onDownloadAttachment?.(attachment);
  };

  useEffect(() => {
    setPendingDownload(null);
  }, [attachments]);

  if (attachments.length === 0 && state !== 'attachmentError') return null;

  if (state === 'attachmentError') {
    return (
      <section data-mail-attachment-list="true" className="mb-5 max-w-[980px] rounded-lg border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-black text-amber-950">附件信息加载失败</div>
            <div className="mt-1 text-xs font-semibold text-amber-800">请重试，或稍后再查看附件状态。</div>
          </div>
          <button type="button" onClick={onRetry} className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-black text-amber-800 transition hover:bg-amber-100">
            重试
          </button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section data-mail-attachment-list="true" className="mb-5 max-w-[980px]">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-black uppercase tracking-wide text-slate-400">附件 {attachments.length}</div>
          {attachments.length > 1 && (
            <button type="button" onClick={() => requestDownload(attachments[0])} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-black text-[#0A59F7] transition hover:bg-[#0A59F7]/[0.08]">
              <AppIcon name="lucide:download" size={14} />
              批量下载
            </button>
          )}
        </div>
        <div className="grid gap-3 xl:grid-cols-3">
          {visibleAttachments.map((attachment) => {
            const meta = attachmentStatusMeta[attachment.status];
            const disabledDownload = !attachment.canDownload || attachment.status === 'scanning' || attachment.status === 'blocked' || attachment.status === 'unavailable';
            return (
              <div
                key={attachment.id}
                data-mail-attachment-card={attachment.id}
                className="min-w-0 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500">{attachment.type}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-black text-slate-800">{attachment.name}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
                      <span>{attachment.size}</span>
                      <span className={`rounded-full px-2 py-0.5 font-black ${meta.className}`}>{meta.label}</span>
                    </div>
                    <div className="mt-1 text-xs font-medium text-slate-500">{attachment.riskReason || meta.desc}</div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    aria-label={`预览 ${attachment.name}`}
                    disabled={!attachment.canPreview}
                    onClick={() => onPreviewAttachment?.(attachment)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    预览
                  </button>
                  <button
                    type="button"
                    aria-label={`下载 ${attachment.name}`}
                    disabled={disabledDownload}
                    onClick={() => requestDownload(attachment)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    下载
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {attachments.length > 3 && (
          <button type="button" onClick={() => setShowAll((value) => !value)} className="mt-3 rounded-lg px-3 py-2 text-sm font-black text-[#0A59F7] transition hover:bg-[#0A59F7]/[0.08]">
            {showAll ? '收起附件' : `查看全部 ${attachments.length} 个附件`}
          </button>
        )}
      </section>

      {pendingDownload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="确认下载风险附件"
            data-mail-attachment-download-confirm="true"
            className="w-full max-w-[420px] rounded-lg border border-amber-200 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.18)]"
          >
            <div className="border-b border-amber-100 bg-amber-50 px-5 py-4">
              <div className="flex items-center gap-2 text-sm font-black text-amber-950">
                <AppIcon name="lucide:triangle-alert" size={17} className="shrink-0 text-amber-600" />
                确认下载风险附件
              </div>
              <div className="mt-2 text-sm font-semibold leading-6 text-amber-900">
                {pendingDownload.name}：{pendingDownload.riskReason || attachmentStatusMeta.warning.desc}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4">
              <button
                type="button"
                onClick={() => setPendingDownload(null)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onDownloadAttachment?.(pendingDownload);
                  setPendingDownload(null);
                }}
                className="rounded-lg bg-[#0A59F7] px-3 py-2 text-sm font-black text-white transition hover:bg-[#084DDB]"
              >
                继续下载
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AiAssistantPanel({ insight, onReply }: { insight?: MailAiInsight | null; onReply?: () => void }) {
  if (!insight) return null;

  return (
    <section data-mail-ai-assistant="true" className="mt-5 max-w-[980px] overflow-hidden rounded-lg border border-indigo-100 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center justify-between border-b border-indigo-50 bg-indigo-50/70 px-5 py-3">
        <div className="flex items-center gap-2">
          <AppIcon name="lucide:sparkles" size={16} className="text-indigo-600" />
          <h3 className="text-sm font-black text-slate-950">AI 邮件助手</h3>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-black ${insight.categoryTone}`}>{insight.categoryLabel}</span>
      </div>
      <div className="grid gap-0 md:grid-cols-[1.15fr_1fr_1fr]">
        <div className="border-b border-slate-100 px-5 py-4 md:border-b-0 md:border-r">
          <div className="text-xs font-black text-indigo-700">AI 摘要</div>
          <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{insight.summary}</p>
        </div>
        <div className="border-b border-slate-100 px-5 py-4 md:border-b-0 md:border-r">
          <div className="text-xs font-black text-indigo-700">待处理事项</div>
          <ul className="mt-2 space-y-2">
            {(insight.todos.length > 0 ? insight.todos : ['暂无明确待处理事项']).map((todo) => (
              <li key={todo} className="flex gap-2 text-sm font-medium leading-5 text-slate-600">
                <AppIcon name="lucide:check" size={14} className="mt-0.5 shrink-0 text-emerald-600" />
                <span>{todo}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-5 py-4">
          <div className="text-xs font-black text-indigo-700">快速回复建议</div>
          <div className="mt-2 space-y-2">
            {insight.replies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={onReply}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExternalImagesNotice({ onSecurityAction }: { onSecurityAction?: (action: string) => void }) {
  return (
    <section data-mail-external-images-notice="true" className="mb-5 max-w-[980px] rounded-lg border border-sky-200 bg-sky-50 px-5 py-4 text-sky-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <AppIcon name="lucide:image-off" size={18} className="shrink-0 text-sky-600" />
          <div className="min-w-0">
            <div className="text-sm font-black">为保护隐私，已阻止加载外部图片。</div>
            <div className="mt-1 text-xs font-semibold text-sky-800">显示图片前请确认发件人可信。</div>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => onSecurityAction?.('showImages')} className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-xs font-black text-sky-700 transition hover:bg-sky-100">
            显示图片
          </button>
          <button type="button" onClick={() => onSecurityAction?.('trustSender')} className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-xs font-black text-sky-700 transition hover:bg-sky-100">
            始终信任该发件人
          </button>
        </div>
      </div>
    </section>
  );
}

function renderBodyText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, index) => {
    if (/^https?:\/\//i.test(part)) {
      return (
        <a key={`${part}-${index}`} href={part} className="font-semibold text-[#0A59F7] underline decoration-[#0A59F7]/30 underline-offset-4" target="_blank" rel="noreferrer">
          {part}
        </a>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function MailBody({ body }: { body: string }) {
  return (
    <article data-mail-body="true" className="max-w-[980px] rounded-lg border border-slate-200 bg-white px-7 py-6 text-sm leading-7 text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      {body.trim() ? <div className="whitespace-pre-wrap break-words">{renderBodyText(body)}</div> : <div className="text-sm font-semibold text-slate-400">此邮件没有正文内容</div>}
    </article>
  );
}

function QuotedHistory({ quotedHistory }: { quotedHistory?: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!quotedHistory) return null;

  return (
    <section className="mt-5 max-w-[980px]">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
      >
        <AppIcon name={expanded ? 'lucide:chevron-up' : 'lucide:chevron-down'} size={16} />
        {expanded ? '收起历史邮件' : '展开历史邮件'}
      </button>
      {expanded && (
        <div data-mail-quoted-history="true" className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-7 text-slate-500">
          <div className="mb-2 text-xs font-black uppercase tracking-wide text-slate-400">历史邮件</div>
          <div className="whitespace-pre-wrap">{quotedHistory}</div>
        </div>
      )}
    </section>
  );
}

function QuickReply({
  mail,
  onReply,
  onQuickReplySend,
}: {
  mail: MailReadingPaneMail;
  onReply?: () => void;
  onQuickReplySend?: (body: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  if (mail.isSystemMail) {
    return (
      <section data-mail-quick-reply-disabled="true" className="mt-5 max-w-[980px] rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500">
        此邮件为系统通知，不支持直接回复。
      </section>
    );
  }

  const send = () => {
    const normalized = body.trim();
    if (!normalized || sending) return;
    setSending(true);
    window.setTimeout(() => {
      onQuickReplySend?.(normalized);
      setBody('');
      setOpen(false);
      setSending(false);
    }, 250);
  };

  return (
    <section data-mail-quick-reply="true" className="mt-5 max-w-[980px] rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <AppIcon name="lucide:reply" size={16} className="shrink-0" />
          快速回复...
        </button>
      ) : (
        <div>
          <textarea
            ref={inputRef}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            rows={4}
            placeholder="输入快捷回复..."
            className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium leading-6 text-slate-700 outline-none transition focus:border-[#0A59F7] focus:ring-2 focus:ring-[#0A59F7]/20"
          />
          <div className="mt-3 flex flex-wrap justify-between gap-2">
            <button type="button" onClick={onReply} className="rounded-lg px-3 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-100">
              打开完整回复
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={() => setOpen(false)} disabled={sending} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:opacity-45">
                取消
              </button>
              <button
                type="button"
                onClick={send}
                disabled={!body.trim() || sending}
                className="rounded-lg bg-[#0A59F7] px-4 py-2 text-sm font-black text-white transition hover:bg-[#084DDB] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {sending ? '发送中' : '发送'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function StateShell({ state, icon, title, desc, children }: { state: string; icon: string; title: string; desc?: string; children?: ReactNode }) {
  return (
    <div data-mail-state-view={state} className="flex h-full items-center justify-center bg-[#f6f7f9] px-8 py-10">
      <div className="w-full max-w-[520px] rounded-lg border border-slate-200 bg-white px-8 py-7 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <AppIcon name={icon} size={24} />
        </div>
        <h3 className="mt-4 text-base font-black text-slate-950">{title}</h3>
        {desc && <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{desc}</p>}
        {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div data-mail-state-view="loading" className="h-full bg-[#f6f7f9] px-8 py-10">
      <div className="mx-auto max-w-[980px] animate-pulse space-y-5">
        <div className="text-sm font-black text-slate-500">邮件内容加载中</div>
        <div className="h-10 rounded-lg bg-slate-200" />
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-5">
          <div className="h-7 w-2/3 rounded bg-slate-200" />
          <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
          <div className="mt-3 h-4 w-1/3 rounded bg-slate-100" />
        </div>
        <div className="grid gap-3 xl:grid-cols-3">
          <div className="h-24 rounded-lg bg-slate-200" />
          <div className="h-24 rounded-lg bg-slate-200" />
          <div className="h-24 rounded-lg bg-slate-200" />
        </div>
        <div className="h-72 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

function MailStateView({
  state,
  onRetry,
  onBackToList,
  onViewNext,
  onSecurityAction,
}: Pick<MailReaderActionHandlers, 'onRetry' | 'onBackToList' | 'onViewNext' | 'onSecurityAction'> & { state: MailReadingState | 'unselected' }) {
  if (state === 'loading') return <LoadingState />;

  if (state === 'unselected') {
    return (
      <StateShell state="unselected" icon="lucide:mail-open" title="请选择一封邮件查看内容" desc="从左侧列表选择邮件，或使用上下方向键切换邮件。" />
    );
  }

  if (state === 'permissionDenied') {
    return (
      <StateShell state="permissionDenied" icon="lucide:lock" title="你暂无权限查看此邮件内容" desc="如果需要访问，请联系邮箱管理员或邮件所有者。">
        <button type="button" onClick={onBackToList} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50">
          返回列表
        </button>
      </StateShell>
    );
  }

  if (state === 'deleted') {
    return (
      <StateShell state="deleted" icon="lucide:trash" title="该邮件已被删除">
        <button type="button" onClick={onViewNext} className="rounded-lg bg-[#0A59F7] px-4 py-2 text-sm font-black text-white transition hover:bg-[#084DDB]">
          查看下一封
        </button>
      </StateShell>
    );
  }

  if (state === 'blocked') {
    return (
      <StateShell state="blocked" icon="lucide:shield-alert" title="该邮件存在安全风险，部分内容已被限制访问。">
        <button type="button" onClick={() => onSecurityAction?.('details')} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-50">
          查看风险详情
        </button>
        <button type="button" onClick={() => onSecurityAction?.('report')} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-black text-red-700 transition hover:bg-red-50">
          举报邮件
        </button>
      </StateShell>
    );
  }

  return (
    <StateShell state={state} icon="lucide:circle-alert" title="邮件内容加载失败">
      <button type="button" onClick={onRetry} className="rounded-lg bg-[#0A59F7] px-4 py-2 text-sm font-black text-white transition hover:bg-[#084DDB]">
        重新加载
      </button>
    </StateShell>
  );
}

export default function MailReadingPane({
  mail,
  state,
  folderLabel,
  linkedEvent,
  aiInsight,
  formatMailTime,
  onReply,
  onReplyAll,
  onForward,
  onArchive,
  onDelete,
  onMove,
  onToggleRead,
  onToggleFollowUp,
  onCreateTask,
  onCreateEvent,
  onRetry,
  onBackToList,
  onViewNext,
  onMarkReadAfterViewing,
  onPreviewAttachment,
  onDownloadAttachment,
  onQuickReplySend,
  onSecurityAction,
  onOpenLinkedEvent,
}: MailReadingPaneProps) {
  const [recipientExpanded, setRecipientExpanded] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [replyAllConfirmOpen, setReplyAllConfirmOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  const readMarkedRef = useRef(false);
  const effectiveState = mail ? getEffectiveReadingState(mail, state) : 'unselected';
  const attachments = useMemo(() => (mail ? normalizeAttachments(mail) : []), [mail]);
  const security = useMemo(() => (mail ? getSecurityInfo({ ...mail, readingState: effectiveState === 'unselected' ? undefined : effectiveState }, attachments) : { level: 'none' as const }), [attachments, effectiveState, mail]);
  const blocksFullContent = effectiveState === 'loading' || effectiveState === 'error' || effectiveState === 'permissionDenied' || effectiveState === 'deleted' || effectiveState === 'blocked';

  useEffect(() => {
    setRecipientExpanded(false);
    setMoreOpen(false);
    setReplyAllConfirmOpen(false);
    readMarkedRef.current = false;
  }, [mail?.id]);

  useEffect(() => {
    if (!moreOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setMoreOpen(false);
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setMoreOpen(false);
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [moreOpen]);

  const markReadAfterViewing = () => {
    if (!mail?.unread || readMarkedRef.current || blocksFullContent) return;
    readMarkedRef.current = true;
    onMarkReadAfterViewing?.();
  };

  const confirmReplyAll = () => {
    if (!mail) return;
    if (hasReplyAllRisk(mail)) {
      setReplyAllConfirmOpen(true);
      return;
    }
    onReplyAll?.();
  };

  const handleBodyKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'PageDown' || event.key === 'ArrowDown') markReadAfterViewing();
  };

  if (!mail) {
    return (
      <div data-mail-reading-pane="true" className="h-full">
        <MailStateView state="unselected" onRetry={onRetry} onBackToList={onBackToList} onViewNext={onViewNext} onSecurityAction={onSecurityAction} />
      </div>
    );
  }

  return (
    <div data-mail-reading-pane="true" className="h-full min-w-0 bg-[#f6f7f9]">
      {blocksFullContent ? (
        <MailStateView state={effectiveState} onRetry={onRetry} onBackToList={onBackToList} onViewNext={onViewNext} onSecurityAction={onSecurityAction} />
      ) : (
        <div className="flex h-full flex-col">
          <MailActionBar
            mail={mail}
            disabled={false}
            moreOpen={moreOpen}
            setMoreOpen={setMoreOpen}
            moreRef={moreRef}
            onReply={onReply}
            onReplyAll={confirmReplyAll}
            onForward={onForward}
            onArchive={onArchive}
            onDelete={onDelete}
            onMove={onMove}
            onToggleRead={onToggleRead}
            onToggleFollowUp={onToggleFollowUp}
            onCreateTask={onCreateTask}
            onCreateEvent={onCreateEvent}
          />
          <MailHeader
            mail={mail}
            folderLabel={folderLabel}
            linkedEvent={linkedEvent}
            formatMailTime={formatMailTime}
            recipientExpanded={recipientExpanded}
            onToggleRecipients={() => setRecipientExpanded((value) => !value)}
            onOpenLinkedEvent={onOpenLinkedEvent}
          />
          <div
            className="flex-1 overflow-y-auto px-6 py-6"
            tabIndex={0}
            onScroll={markReadAfterViewing}
            onKeyDown={handleBodyKeyDown}
          >
            <AttachmentList attachments={attachments} state={effectiveState} onPreviewAttachment={onPreviewAttachment} onDownloadAttachment={onDownloadAttachment} onRetry={onRetry} />
            {effectiveState === 'externalImagesBlocked' && <ExternalImagesNotice onSecurityAction={onSecurityAction} />}
            <SecurityNotice security={security} onSecurityAction={onSecurityAction} />
            <MailBody body={effectiveState === 'empty' ? '' : mail.bodyText || mail.body || ''} />
            <QuotedHistory quotedHistory={mail.quotedHistory} />
            <AiAssistantPanel insight={aiInsight} onReply={onReply} />
            <QuickReply mail={mail} onReply={onReply} onQuickReplySend={onQuickReplySend} />
          </div>
        </div>
      )}

      {replyAllConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4" role="dialog" aria-modal="true" aria-label="确认回复全部">
          <div className="w-full max-w-[420px] rounded-lg bg-white px-6 py-5 shadow-[0_24px_72px_rgba(15,23,42,0.28)]">
            <div className="text-base font-black text-slate-950">确认回复全部</div>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">本次回复将发送给多位收件人，其中包含外部人员。是否继续？</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setReplyAllConfirmOpen(false)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50">
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyAllConfirmOpen(false);
                  onReplyAll?.();
                }}
                className="rounded-lg bg-[#0A59F7] px-4 py-2 text-sm font-black text-white transition hover:bg-[#084DDB]"
              >
                继续回复
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
