import { useMemo, useState } from 'react';
import { Paperclip, Send, Sparkles, X } from 'lucide-react';

export default function MailComposerModal({
  open,
  draft,
  accounts,
  contacts,
  onClose,
  onChange,
  onAddRecipient,
  onAddAttachment,
  onRemoveAttachment,
  onSaveDraft,
  onSend,
}) {
  const [aiDraft, setAiDraft] = useState(null);
  const bodySeed = draft?.body?.trim() || '请在这里输入邮件正文，AI 会基于当前内容生成建议。';
  const aiActions = useMemo(
    () => [
      { id: 'polish', label: '润色表达', status: '已生成润色版本' },
      { id: 'formal', label: '更正式', status: '已生成更正式版本' },
      { id: 'friendly', label: '更友好', status: '已生成更友好版本' },
      { id: 'shorten', label: '简化内容', status: '已生成简洁版本' },
      { id: 'proofread', label: '检查错别字', status: '已完成错别字检查' },
      { id: 'subject', label: '生成标题', status: '已生成标题建议' },
    ],
    [],
  );

  const buildAiSuggestion = (actionId) => {
    if (actionId === 'subject') {
      return draft?.subject?.trim() ? `建议标题：${draft.subject.trim()}` : '建议标题：关于材料评审安排的确认';
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

    if (actionId === 'proofread') {
      return '未发现明显错别字。建议检查收件人、时间和附件是否完整。';
    }

    return `${bodySeed.replace(/[。！!]*$/, '。')}\n\n我会根据后续反馈继续调整。`;
  };

  const runAiAction = (action) => {
    setAiDraft({
      status: action.status,
      suggestion: buildAiSuggestion(action.id),
    });
  };

  if (!open || !draft) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 p-4" role="dialog" aria-modal="true" aria-label="写邮件">
      <div className="flex w-full max-w-[820px] max-h-[70vh] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-4">
          <div className="text-lg font-black text-gray-900">写邮件</div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-white">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3 items-center">
            <div className="text-sm font-bold text-gray-500">发件邮箱</div>
            <select
              value={draft.accountId}
              onChange={(event) => onChange({ accountId: event.target.value })}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm font-bold text-gray-800 bg-white"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} · {account.email}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3 items-center">
            <div className="text-sm font-bold text-gray-500">收件人</div>
            <input
              value={draft.to}
              onChange={(event) => onChange({ to: event.target.value })}
              placeholder="多个收件人可用 ; 分隔"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3 items-center">
            <div className="text-sm font-bold text-gray-500">抄送</div>
            <input
              value={draft.cc}
              onChange={(event) => onChange({ cc: event.target.value })}
              placeholder="可选"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-xs font-black text-gray-500 mb-3">常用联系人</div>
            <div className="flex flex-wrap gap-2">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => onAddRecipient('to', contact.email)}
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 inline-flex items-center"
                  title={`${contact.name} <${contact.email}>`}
                >
                  <span className="max-w-[180px] truncate">{contact.name}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${contact.scope === 'external' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}
                  >
                    {contact.scope === 'external' ? '外部' : '内部'}
                  </span>
                </button>
              ))}
              <button
                onClick={() => onAddRecipient('to', 'partner@externalcorp.com')}
                className="px-3 py-2 rounded-xl border border-dashed border-amber-300 bg-amber-50 text-sm font-bold text-amber-700"
              >
                添加外部邮箱
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3 items-center">
            <div className="text-sm font-bold text-gray-500">主题</div>
            <input
              value={draft.subject}
              onChange={(event) => onChange({ subject: event.target.value })}
              placeholder="添加邮件主题..."
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white"
            />
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 flex items-center justify-between">
            <div className="text-xs font-bold text-gray-500">附件</div>
            <div className="flex items-center gap-2">
              <button
                onClick={onAddAttachment}
                className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 inline-flex items-center"
              >
                <Paperclip size={13} className="mr-1.5" />
                添加附件
              </button>
            </div>
          </div>

          {draft.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {draft.attachments.map((attachment, index) => (
                <button
                  key={`${attachment.name}-${index}`}
                  onClick={() => onRemoveAttachment(index)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 inline-flex items-center"
                >
                  <Paperclip size={13} className="mr-2 text-gray-400" />
                  <span className="max-w-[220px] truncate">{attachment.name}</span>
                  <X size={12} className="ml-2 text-gray-400" />
                </button>
              ))}
            </div>
          )}

          <section className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-600" />
                <div>
                  <div className="text-sm font-black text-slate-900">AI 写作助手</div>
                  <div className="mt-0.5 text-xs font-semibold text-indigo-500">先生成预览，确认后再应用到正文。</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => runAiAction(action)}
                    className="rounded-lg border border-indigo-100 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:border-indigo-200 hover:bg-indigo-50"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
            {aiDraft && (
              <div className="mt-3 rounded-lg border border-indigo-100 bg-white px-4 py-3">
                <div className="text-xs font-black text-indigo-700">{aiDraft.status}</div>
                <div className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-600">{aiDraft.suggestion}</div>
              </div>
            )}
          </section>

          <textarea
            value={draft.body}
            onChange={(event) => onChange({ body: event.target.value })}
            placeholder="输入邮件正文..."
            className="w-full min-h-[320px] rounded-xl border border-gray-300 px-4 py-4 text-sm text-gray-800 bg-white resize-none focus:outline-none"
          />
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <button
              onClick={onSaveDraft}
              className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-bold text-gray-700"
            >
              存草稿
            </button>
            <button
              onClick={onSend}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold inline-flex items-center"
            >
              发送
              <Send size={14} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
