import { X } from 'lucide-react';
import { formatSuggestedSlotLabel } from '../../domain/appModel.js';

export default function AvailabilityProposalCard({ proposal, onPickSlot, onRemove, actionLabel = '确认这个时间' }) {
  if (!proposal) return null;

  const confirmedSlot = proposal.confirmedSlotId ? proposal.slots.find((slot) => slot.id === proposal.confirmedSlotId) : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
	        <div className="text-sm font-semibold text-slate-900">可用时间</div>
        {onRemove && proposal.status !== 'confirmed' && (
          <button
            onClick={onRemove}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <X size={12} />
            移除卡片
          </button>
        )}
      </div>

      <div className="space-y-3 px-5 py-4">
        {proposal.status === 'confirmed' && confirmedSlot && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            已确认 {formatSuggestedSlotLabel(new Date(confirmedSlot.dateMs), confirmedSlot.startH, confirmedSlot.durationH)}
          </div>
        )}

        <div className="grid gap-2 md:grid-cols-2">
          {proposal.slots.map((slot) => {
            const isConfirmed = proposal.confirmedSlotId === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                disabled={!onPickSlot || proposal.status === 'confirmed'}
                onClick={() => onPickSlot?.(slot.id)}
                className={`rounded-lg border px-3 py-3 text-left transition ${
                  isConfirmed
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : onPickSlot
                      ? 'border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                } ${!onPickSlot || proposal.status === 'confirmed' ? 'cursor-default' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {formatSuggestedSlotLabel(new Date(slot.dateMs), slot.startH, slot.durationH)}
                    </div>
	                    {slot.summary && <div className="mt-1 text-xs text-slate-500">{slot.summary}</div>}
                  </div>
                  {isConfirmed ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      已确认
                    </span>
                  ) : onPickSlot && proposal.status !== 'confirmed' ? (
                    <span className="text-xs font-medium text-blue-600">{actionLabel}</span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}

