import { useMemo, useState } from 'react';
import AppIcon from '../../components/AppIcon';

const createLucideIcon = (name) =>
  function LucideIcon({ size = 20, className, 'aria-label': ariaLabel, ...props }) {
    return <AppIcon name={`lucide:${name}`} size={size} className={className} ariaLabel={ariaLabel} {...props} />;
  };

const AlignLeft = createLucideIcon('align-left');
const Bold = createLucideIcon('bold');
const ChevronDown = createLucideIcon('chevron-down');
const Clock = createLucideIcon('clock');
const Highlighter = createLucideIcon('highlighter');
const Image = createLucideIcon('image');
const Italic = createLucideIcon('italic');
const Link = createLucideIcon('link');
const List = createLucideIcon('list');
const Lock = createLucideIcon('lock');
const Mail = createLucideIcon('mail');
const Minus = createLucideIcon('minus');
const MoreVertical = createLucideIcon('more-vertical');
const Paperclip = createLucideIcon('paperclip');
const PenLine = createLucideIcon('pen-line');
const Redo2 = createLucideIcon('redo-2');
const Save = createLucideIcon('save');
const Send = createLucideIcon('send');
const Smile = createLucideIcon('smile');
const Square = createLucideIcon('square');
const Table = createLucideIcon('table');
const Type = createLucideIcon('type');
const Underline = createLucideIcon('underline');
const Undo2 = createLucideIcon('undo-2');
const UserCheck = createLucideIcon('user-check');
const X = createLucideIcon('x');

const splitRecipients = (value = '') =>
  value
    .split(/[;；,，\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const joinRecipients = (items) => Array.from(new Set(items.map((item) => item.trim()).filter(Boolean))).join('; ');

const menuPanelClass = 'absolute z-50 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-[0_12px_32px_rgba(15,23,42,0.16)]';

function RecipientLine({ label, value, pendingValue, placeholder, onPendingChange, onCommit, onRemove }) {
  const recipients = splitRecipients(value);

  const commit = () => {
    const nextValue = pendingValue.trim();
    if (!nextValue) return;
    onCommit(nextValue);
  };

  return (
    <div className="grid min-h-[42px] grid-cols-[72px_1fr] items-center border-b border-slate-100 text-sm">
      <div className="font-medium text-slate-600">{label}</div>
      <div className="flex min-w-0 flex-wrap items-center gap-2 py-1.5">
        {recipients.map((recipient) => (
          <button
            key={recipient}
            type="button"
            onClick={() => onRemove(recipient)}
            title={`移除 ${recipient}`}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            <span className="max-w-[260px] truncate">{recipient}</span>
            <X size={11} className="shrink-0 text-slate-400" />
          </button>
        ))}
        <input
          type="text"
          value={pendingValue}
          onChange={(event) => onPendingChange(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit();
            }
          }}
          placeholder={placeholder}
          className="min-w-[220px] flex-1 border-none bg-transparent py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
      </div>
    </div>
  );
}

function ComposerMenuItem({ children, icon: Icon, onClick, role = 'menuitem', checked = false }) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={role === 'menuitemradio' ? checked : undefined}
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold transition ${
        checked ? 'bg-[#0A59F7]/[0.08] text-[#0A59F7]' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
      }`}
    >
      {Icon && <Icon size={16} className="shrink-0" />}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {checked && <span className="text-[#0A59F7]">✓</span>}
    </button>
  );
}

export default function MailComposerModal({
  open,
  draft,
  accounts,
  onClose,
  onChange,
  onAddAttachment,
  onRemoveAttachment,
  onSaveDraft,
  onSend,
}) {
  const [toInput, setToInput] = useState('');
  const [ccInput, setCcInput] = useState('');
  const [bccInput, setBccInput] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const [aiDraft, setAiDraft] = useState(null);
  const bodySeed = draft?.body?.trim() || '请在这里输入邮件正文，AI 会基于当前内容生成建议。';
  const importance = draft?.importance || 'normal';
  const importanceLabel = importance === 'high' ? '高' : '普通';
  const aiActions = useMemo(
    () => [
      { id: 'polish', label: '润色表达', status: '已生成润色版本' },
      { id: 'formal', label: '更正式', status: '已生成更正式版本' },
      { id: 'friendly', label: '更友好', status: '已生成更友好版本' },
      { id: 'shorten', label: '简化内容', status: '已生成简洁版本' },
      { id: 'subject', label: '生成标题', status: '已生成标题建议' },
    ],
    [],
  );

  if (!open || !draft) return null;

  const addRecipient = (field, value) => {
    const current = splitRecipients(draft[field]);
    onChange({ [field]: joinRecipients([...current, value]) });
    if (field === 'to') setToInput('');
    if (field === 'cc') setCcInput('');
    if (field === 'bcc') setBccInput('');
  };

  const removeRecipient = (field, value) => {
    onChange({ [field]: joinRecipients(splitRecipients(draft[field]).filter((item) => item !== value)) });
  };

  const buildAiSuggestion = (actionId) => {
    if (actionId === 'subject') {
      return draft.subject?.trim() ? `建议标题：${draft.subject.trim()}` : '建议标题：关于材料评审安排的确认';
    }

    if (actionId === 'formal') {
      return `您好，\n\n${bodySeed.replace(/[。！!]*$/, '。')}\n\n如有需要，我会继续补充相关信息。`;
    }

    if (actionId === 'friendly') {
      return `你好，\n\n${bodySeed.replace(/[。！!]*$/, '。')} 我会继续跟进，有新进展再同步。`;
    }

    if (actionId === 'shorten') {
      return bodySeed.split(/[。！？\n]/).filter(Boolean).slice(0, 2).join('。') || bodySeed;
    }

    return `${bodySeed.replace(/[。！!]*$/, '。')}\n\n我会根据后续反馈继续调整。`;
  };

  const runAiAction = (action) => {
    setAiDraft({
      actionId: action.id,
      status: action.status,
      suggestion: buildAiSuggestion(action.id),
    });
  };

  const applyAiSuggestion = (mode) => {
    if (!aiDraft) return;

    if (aiDraft.actionId === 'subject') {
      onChange({ subject: aiDraft.suggestion.replace(/^建议标题：/, '') });
      return;
    }

    const suggestion = aiDraft.suggestion.trim();
    if (!suggestion) return;

    onChange({
      body: mode === 'append' && draft.body.trim() ? `${draft.body.trim()}\n\n${suggestion}` : suggestion,
    });
  };

  const buttonClass = 'inline-flex h-9 items-center gap-2 rounded-lg bg-slate-100 px-3 text-sm font-bold text-slate-800 transition hover:bg-slate-200';
  const iconButtonClass = 'inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100';
  const formatButtons = [
    { id: 'undo', icon: Undo2, label: '撤销' },
    { id: 'redo', icon: Redo2, label: '重做' },
    { id: 'paint', icon: Highlighter, label: '格式刷' },
    { id: 'type', icon: Type, label: '字号' },
    { id: 'bold', icon: Bold, label: '加粗' },
    { id: 'italic', icon: Italic, label: '斜体' },
    { id: 'underline', icon: Underline, label: '下划线' },
    { id: 'align', icon: AlignLeft, label: '对齐' },
    { id: 'list', icon: List, label: '列表' },
    { id: 'image', icon: Image, label: '图片' },
    { id: 'table', icon: Table, label: '表格' },
    { id: 'link', icon: Link, label: '链接' },
    { id: 'emoji', icon: Smile, label: '表情' },
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/10 p-0" role="dialog" aria-modal="true" aria-label="写邮件">
      <div
        data-mail-composer-window="true"
        className="h-[70vh] max-h-[calc(100vh-32px)] min-w-[920px] w-[76vw] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_56px_rgba(15,23,42,0.18)]"
      >
        <div className="flex h-full w-full flex-col overflow-hidden bg-white">
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-slate-100 px-4 text-sm sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <div className="truncate font-bold text-slate-950">新建邮件</div>
              <div className="shrink-0 text-xs font-medium text-slate-400">06:20:32 自动保存</div>
            </div>
            <div className="ml-4 flex items-center gap-1 text-slate-500">
              <button type="button" className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-slate-700" aria-label="窗口化">
                <Square size={14} />
              </button>
              <button type="button" className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-slate-700" aria-label="最小化">
                <Minus size={16} />
              </button>
              <button type="button" onClick={onClose} className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-slate-800" aria-label="关闭">
                <X size={16} />
              </button>
            </div>
          </div>

          <div data-mail-composer-actionbar="true" className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <button type="button" onClick={onSend} className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0A59F7] px-4 text-sm font-bold text-white transition hover:bg-[#084DDB]">
                <Send size={15} />
                发送
              </button>
              <button type="button" onClick={onSaveDraft} className={buttonClass}>
                <Save size={15} />
                保存
              </button>
              <div className="relative">
                <button type="button" onClick={() => setOpenMenu(openMenu === 'attachment' ? null : 'attachment')} className={buttonClass} aria-haspopup="menu">
                  <Paperclip size={15} />
                  附件
                  <ChevronDown size={13} />
                </button>
                {openMenu === 'attachment' && (
                  <div data-mail-attachment-menu="true" role="menu" className={menuPanelClass}>
                    <ComposerMenuItem icon={Square} onClick={() => { onAddAttachment(); setOpenMenu(null); }}>添加本地附件</ComposerMenuItem>
                    <ComposerMenuItem icon={Mail}>添加云空间附件</ComposerMenuItem>
                    <ComposerMenuItem icon={Paperclip}>大附件管理</ComposerMenuItem>
                    <ComposerMenuItem icon={Link}>上传到云空间</ComposerMenuItem>
                  </div>
                )}
              </div>
              <div className="relative">
                <button type="button" onClick={() => setOpenMenu(openMenu === 'encrypt' ? null : 'encrypt')} className={buttonClass} aria-haspopup="menu">
                  <Lock size={15} />
                  加密
                  <ChevronDown size={13} />
                </button>
                {openMenu === 'encrypt' && (
                  <div data-mail-encrypt-menu="true" role="menu" className={menuPanelClass}>
                    <ComposerMenuItem icon={Lock}>不可转发</ComposerMenuItem>
                    <ComposerMenuItem icon={Lock}>只读策略</ComposerMenuItem>
                    <ComposerMenuItem icon={Lock}>禁止打印</ComposerMenuItem>
                  </div>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100">
                <UserCheck size={15} />
                检查收件人
              </button>
              <button type="button" className="inline-flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100">
                <PenLine size={15} />
                签名
                <ChevronDown size={13} />
              </button>
              <div className="relative">
                <button type="button" aria-label="更多写信设置" onClick={() => setOpenMenu(openMenu === 'more' ? null : 'more')} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-800 transition hover:bg-slate-200" aria-haspopup="menu">
                  <MoreVertical size={18} />
                </button>
                {openMenu === 'more' && (
                  <div data-mail-composer-more-menu="true" role="menu" className={`${menuPanelClass} right-0`}>
                    <ComposerMenuItem icon={Clock}>定时发送</ComposerMenuItem>
                    <ComposerMenuItem icon={Mail}>标头栏设置</ComposerMenuItem>
                    <ComposerMenuItem onClick={() => setOpenMenu(null)}>抄送</ComposerMenuItem>
                    <ComposerMenuItem onClick={() => setOpenMenu(null)}>密送</ComposerMenuItem>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-5 sm:px-6">
            <div className="mx-auto w-full max-w-[1180px]">
              <div className="grid min-h-[44px] grid-cols-[72px_1fr] items-center border-b border-slate-100 text-sm">
                <div className="font-medium text-slate-600">发件人</div>
                <div className="relative max-w-[340px]">
                  <Mail size={15} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={draft.accountId}
                    onChange={(event) => onChange({ accountId: event.target.value })}
                    className="w-full appearance-none border-none bg-transparent py-2 pl-6 pr-7 text-sm font-semibold text-slate-900 focus:outline-none"
                    aria-label="发件邮箱"
                  >
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.email || account.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <RecipientLine
                label="收件人"
                value={draft.to}
                pendingValue={toInput}
                placeholder="输入收件人邮箱，按 Enter 添加"
                onPendingChange={setToInput}
                onCommit={(value) => addRecipient('to', value)}
                onRemove={(value) => removeRecipient('to', value)}
              />

              <RecipientLine
                label="抄送"
                value={draft.cc}
                pendingValue={ccInput}
                placeholder="输入抄送人邮箱，按 Enter 添加"
                onPendingChange={setCcInput}
                onCommit={(value) => addRecipient('cc', value)}
                onRemove={(value) => removeRecipient('cc', value)}
              />

              <RecipientLine
                label="密送"
                value={draft.bcc || ''}
                pendingValue={bccInput}
                placeholder="输入密送人邮箱，按 Enter 添加"
                onPendingChange={setBccInput}
                onCommit={(value) => addRecipient('bcc', value)}
                onRemove={(value) => removeRecipient('bcc', value)}
              />

              <div className="grid min-h-[46px] grid-cols-[72px_1fr_auto] items-center border-b border-slate-100 text-sm">
                <div className="font-medium text-slate-600">主题</div>
                <input
                  type="text"
                  value={draft.subject}
                  onChange={(event) => onChange({ subject: event.target.value })}
                  placeholder="请输入主题"
                  className="min-w-0 border-none bg-transparent py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  autoFocus
                />
                <div className="relative">
                  <button type="button" aria-label={`重要性 ${importanceLabel}`} onClick={() => setOpenMenu(openMenu === 'importance' ? null : 'importance')} className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100">
                    重要性
                    <ChevronDown size={13} />
                  </button>
                  {openMenu === 'importance' && (
                    <div data-mail-importance-menu="true" role="menu" className={`${menuPanelClass} right-0 w-32`}>
                      <ComposerMenuItem role="menuitemradio" checked={importance === 'normal'} onClick={() => { onChange({ importance: 'normal' }); setOpenMenu(null); }}>
                        普通
                      </ComposerMenuItem>
                      <ComposerMenuItem role="menuitemradio" checked={importance === 'high'} onClick={() => { onChange({ importance: 'high' }); setOpenMenu(null); }}>
                        高
                      </ComposerMenuItem>
                    </div>
                  )}
                </div>
              </div>

              <div data-mail-composer-format-toolbar="true" className="flex min-h-11 flex-wrap items-center gap-1 border-b border-slate-100 py-1.5">
                {formatButtons.slice(0, 4).map(({ id, icon: Icon, label }) => (
                  <button key={id} type="button" aria-label={label} className={iconButtonClass}>
                    <Icon size={17} />
                  </button>
                ))}
                <span className="mx-1 h-5 w-px bg-slate-200" />
                <button type="button" className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">正文 <ChevronDown size={13} /></button>
                <button type="button" className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">鸿蒙黑体 <ChevronDown size={13} /></button>
                <button type="button" className="inline-flex h-8 items-center gap-1 rounded-md px-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">小四 <ChevronDown size={13} /></button>
                {formatButtons.slice(4).map(({ id, icon: Icon, label }) => (
                  <button key={id} type="button" aria-label={label} className={iconButtonClass}>
                    <Icon size={17} />
                  </button>
                ))}
              </div>

              <textarea
                value={draft.body}
                onChange={(event) => onChange({ body: event.target.value })}
                placeholder="输入邮件正文..."
                className="min-h-[210px] w-full resize-y border-none bg-white py-4 text-sm leading-6 text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />

              <div className="rounded-lg border border-indigo-100 bg-indigo-50/60 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Highlighter size={16} className="text-indigo-600" />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-slate-700">AI 写作助手</span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-indigo-700">基于正文生成</span>
                      </div>
                      <div className="mt-0.5 text-xs text-slate-400">处理上方正文，可替换或追加到正文。</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {aiActions.map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => runAiAction(action)}
                        className="rounded-lg border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-50"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
                {aiDraft && (
                  <div className="mt-3 rounded-lg border border-indigo-100 bg-white px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs font-black text-indigo-700">{aiDraft.status}</div>
                      {aiDraft.actionId === 'subject' ? (
                        <button type="button" onClick={() => applyAiSuggestion('replace')} className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100">
                          应用到主题
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button type="button" onClick={() => applyAiSuggestion('replace')} className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100">
                            替换正文
                          </button>
                          <button type="button" onClick={() => applyAiSuggestion('append')} className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100">
                            追加到正文
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-600">{aiDraft.suggestion}</div>
                  </div>
                )}
              </div>

              {draft.attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {draft.attachments.map((attachment, index) => (
                    <button
                      key={`${attachment.name}-${index}`}
                      type="button"
                      onClick={() => onRemoveAttachment(index)}
                      className="inline-flex max-w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      <Paperclip size={13} className="shrink-0 text-slate-400" />
                      <span className="max-w-[240px] truncate">{attachment.name}</span>
                      <span className="text-xs text-slate-400">{attachment.size}</span>
                      <X size={12} className="shrink-0 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
