import { Check, X } from 'lucide-react';
import { formatSuggestedSlotLabel } from '../../domain/appModel.js';

export default function AvailabilityProposalModal({
  open,
  account,
  candidates,
  selectedSlotIds,
  onToggleSlot,
  onClose,
  onApply,
}) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={onClose}>
      <div
        className="w-full max-w-[760px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
	          <div className="text-lg font-semibold text-slate-900">插入可用时间</div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            当前账户：<span className="font-semibold text-slate-900">{account?.email || account?.name || '未选择账户'}</span>
          </div>

          <div className="grid gap-2 md:grid-cols-2">
            {candidates.map((slot) => {
              const checked = selectedSlotIds.includes(slot.id);
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onToggleSlot(slot.id)}
                  className={`rounded-lg border px-4 py-3 text-left transition ${
                    checked ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {formatSuggestedSlotLabel(new Date(slot.dateMs), slot.startH, slot.durationH)}
                      </div>
	                      {slot.summary && <div className="mt-1 text-xs text-slate-500">{slot.summary}</div>}
                    </div>
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                        checked ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 bg-white text-transparent'
                      }`}
                    >
                      <Check size={12} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

	        <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-white">
              取消
            </button>
            <button
              onClick={onApply}
              disabled={selectedSlotIds.length === 0}
              className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                selectedSlotIds.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-slate-300'
              }`}
            >
              插入时间卡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

