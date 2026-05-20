import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  AlignLeft,
  Archive,
  ArrowRight,
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Copy,
  Edit,
  Eye,
  FileText,
  Forward,
  HelpCircle,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  Minus,
  MoreHorizontal,
  Palette,
  Paperclip,
  Plus,
  RefreshCw,
  Reply,
  ReplyAll,
  Save,
  Search,
  Send,
  Settings,
  Square,
  SquarePen,
  Star,
  Trash,
  Type,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import {
  DAY_MS,
  TODAY_DATE,
  DAY_START_HOUR,
  WORK_START_HOUR,
  WORK_END_HOUR,
  CELL_HEIGHT,
  TIMELINE_HEADER_HEIGHT,
  SPLIT_WEEK_PANE_HEADER_HEIGHT,
  HALF_HOUR_STEP,
  MIN_EVENT_DURATION,
  HOURS,
  MONTH_WEEKDAY_NAMES,
  VIEW_OPTIONS,
  PRODUCT_TABS,
  MAIL_FOLDERS,
  MAIL_CONTACTS,
  MODULE_COPY,
  CALENDAR_PERMISSION_OPTIONS,
  HUAWEI_CALENDAR_ID,
  MAX_SPLIT_ACCOUNTS,
  SHARED_ACCOUNT_TEMPLATES,
  MOCK_SHARE_INVITATIONS,
  MEETING_PROVIDER_OPTIONS,
  REPEAT_OPTIONS,
  REMINDER_OPTIONS,
  AVAILABILITY_OPTIONS,
  VISIBILITY_OPTIONS,
  INITIAL_CREATE_DRAFT_PANELS,
  INITIAL_CREATE_DRAFT_BULK_INPUTS,
  EVENT_KIND_LABELS,
  MEETING_PROVIDER_LABELS,
  REPEAT_LABELS,
  REMINDER_LABELS,
  AVAILABILITY_LABELS,
  VISIBILITY_LABELS,
  stripTime,
  addDays,
  addMonths,
  sameDay,
  getWeekStart,
  dateToEventParts,
  eventToDate,
  formatHour,
  formatTimeRange,
  formatDateLabel,
  formatDraftTime,
  formatTimeSelectLabel,
  getDraftEndMeta,
  isHuaweiMakeupWorkday,
  isWeekendDate,
  getDraftDurationBetween,
  formatDurationLabel,
  normalizeParticipantIdentity,
  parseShareMemberInput,
  resolveKnownShareMember,
  getShareContactSuggestions,
  TIME_SELECT_OPTIONS,
  TIME_SELECT_END_OPTIONS,
  formatClockStamp,
  clampNumber,
  roundToHalfHour,
  clampStartHour,
  clampDuration,
  formatEventDateTime,
  formatAgendaEventLabel,
  getAgendaStatusTone,
  getCalendarPermissionId,
  getCalendarPermissionLabel,
  getCalendarPermissionOption,
  getCalendarPermissionCapabilities,
  canEditCalendarContent,
  getAccountCheckboxTone,
  ACCOUNT_COLOR_OPTIONS,
  getAccountDisplayLabel,
  getAccountFullLabel,
  getAccountEditableName,
  getPreviewPosition,
  getSlotFromPointer,
  clampLinesStyle,
  getTimedEventCardDensity,
  overlapsWindow,
  isWorkHour,
  getTimeTop,
  getTimeHeight,
  getWorkdayScrollTop,
  scrollElementToTop,
  SEARCH_COLOR_CATEGORY_OPTIONS,
  getEventStatusBadgeMeta,
  getTimedEventStatusSurface,
  getEventSearchMatchMeta,
  accountMatchesSearchScope,
  eventMatchesSearchPerson,
  eventMatchesMeetingType,
  eventMatchesAttachmentFilter,
  getEventColorCategories,
  eventMatchesColorCategory,
  eventMatchesSearchTimeframe,
  getEventStartTimestamp,
  canJoinCalendarEvent,
  getSearchSelectedAccountIds,
  getSearchSourceAccountLabel,
  joinRecipients,
  parseRecipients,
  dedupeParticipants,
  stripMailSubjectPrefixes,
  buildConferenceLink,
  formatMailTime,
  normalizeSelectionSlot,
  selectionMatchesSlot,
  buildTimedEventLayout,
  buildAllDayEventLayout,
  buildWeekDays,
  buildMiniMonthCells,
  formatRangeTitle,
  eventMatchesLayout,
  sortEvents,
  getCurrentTimeHour,
  isBusyOnlyEvent,
  isPrivateLimitedEvent,
  getVisibleEventTitle,
  getCompactSourceLabel,
  getEventSecondaryLine,
  getToneClasses,
  getDefaultEditableCalendarId,
  buildDraftForm,
  MOCK_ACCOUNTS,
  MOCK_CALENDARS,
  MOCK_EVENTS,
  MOCK_MAILS,
  buildMailDraft,
} from './domain/appModel.js';

const CalendarSearchResults = lazy(() => import('./features/calendarSearch/CalendarSearchResults.jsx'));
const MailComposerModal = lazy(() => import('./features/mail/MailComposerModal.jsx'));

function ProductActiveIcon({ id, size = 20 }) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    'aria-hidden': true,
  };

  if (id === 'mail') {
    return (
      <svg {...commonProps}>
        <path
          fill="currentColor"
          d="M4.75 5.5h14.5c1.38 0 2.5 1.12 2.5 2.5v8.5c0 1.38-1.12 2.5-2.5 2.5H4.75a2.5 2.5 0 0 1-2.5-2.5V8c0-1.38 1.12-2.5 2.5-2.5Zm.66 2.1a.75.75 0 0 0-.84 1.24l6.1 4.13c.8.54 1.86.54 2.66 0l6.1-4.13a.75.75 0 1 0-.84-1.24L12.5 11.72a.9.9 0 0 1-1 0L5.41 7.6Z"
        />
      </svg>
    );
  }

  if (id === 'calendar') {
    return (
      <svg {...commonProps}>
        <path fill="currentColor" d="M6.7 2.1a1 1 0 0 1 1 1v1.75h8.6V3.1a1 1 0 1 1 2 0v1.75h.35a2.9 2.9 0 0 1 2.9 2.9v10.5a2.9 2.9 0 0 1-2.9 2.9H5.35a2.9 2.9 0 0 1-2.9-2.9V7.75a2.9 2.9 0 0 1 2.9-2.9h.35V3.1a1 1 0 0 1 1-1Z" />
        <path fill="white" fillOpacity=".94" d="M4.8 9.1h14.4v8.9c0 .47-.38.85-.85.85H5.65A.85.85 0 0 1 4.8 18V9.1Z" />
        <path fill="currentColor" fillOpacity=".9" d="M7 11.25h2.3v2.3H7v-2.3Zm3.85 0h2.3v2.3h-2.3v-2.3Zm3.85 0H17v2.3h-2.3v-2.3ZM7 15.1h2.3v2.3H7v-2.3Zm3.85 0h2.3v2.3h-2.3v-2.3Z" />
      </svg>
    );
  }

  if (id === 'contacts') {
    return (
      <svg {...commonProps}>
        <path fill="currentColor" d="M9.25 11.25a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 1.75c-3.34 0-6.25 1.88-6.25 4.48v1.02c0 .97.78 1.75 1.75 1.75h9c.97 0 1.75-.78 1.75-1.75v-1.02c0-2.6-2.91-4.48-6.25-4.48Zm7.45-2.16a3.45 3.45 0 1 0-.04-6.89 5.72 5.72 0 0 1-.24 6.9l.28-.01Zm.6 2.02a6.67 6.67 0 0 0-1.88.27 5.86 5.86 0 0 1 2.08 4.35v.77h1.75c.97 0 1.75-.78 1.75-1.75v-.35c0-1.98-1.71-3.29-3.7-3.29Z" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path
        fill="currentColor"
        d="M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.3 7.3 0 0 0-1.69-.98l-.38-2.65A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.5.42l-.38 2.65c-.61.24-1.18.56-1.69.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.65-.07.98s.02.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.13.23.4.32.6.22l2.49-1c.51.4 1.08.74 1.69.98l.38 2.65c.05.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.24 1.18-.56 1.69-.98l2.49 1c.23.08.48 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65Z"
      />
      <path fill="white" fillOpacity=".92" d="M12 15.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z" />
    </svg>
  );
}

function ProductTabsBar({ activeProduct, onSelect, compact = false, vertical = false }) {
  const buttonSize = compact ? 'h-10 w-10' : 'h-11 w-11';

  return (
    <div className={`${vertical ? 'grid grid-cols-1' : 'grid grid-cols-4'} ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {PRODUCT_TABS.map(({ id, label, icon: Icon }) => {
        const selected = activeProduct === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            title={label}
            className={`${buttonSize} mx-auto flex items-center justify-center rounded-xl transition-colors duration-150 ${
              selected ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {selected ? (
              <ProductActiveIcon id={id} size={compact ? 20 : 23} />
            ) : (
              <Icon size={compact ? 18 : 21} strokeWidth={2.1} />
            )}
          </button>
        );
      })}
    </div>
  );
}

function ModulePlaceholder({ moduleId, onBack }) {
  const copy = MODULE_COPY[moduleId];

  return (
    <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-xl border border-gray-200 shadow-sm p-10">
        <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6">
          {moduleId === 'mail' && <Mail size={22} />}
          {moduleId === 'contacts' && <Users size={22} />}
          {moduleId === 'settings' && <Settings size={22} />}
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">{copy.title}</h2>
        {copy.desc && <p className="text-gray-600 leading-relaxed mb-8">{copy.desc}</p>}
        <button
          onClick={onBack}
          className="inline-flex items-center px-5 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-md"
        >
          返回日历模块
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
}

function UtilitySidebar({ activeProduct, onSelectProduct }) {
  return (
    <aside
      className="relative z-10 hidden shrink-0 flex-col border-r border-slate-200 bg-[#f1f3f5] md:flex"
      style={{ width: '252px' }}
    >
      <div className="border-b border-slate-200 bg-[#f1f3f5] p-6">
        <div className="text-lg font-black text-gray-900">{MODULE_COPY[activeProduct]?.title || '模块'}</div>
      </div>
      <div className="flex-1 bg-[#f1f3f5] p-5"></div>
      <div className="border-t border-slate-200 bg-[#f1f3f5] p-4">
        <ProductTabsBar activeProduct={activeProduct} onSelect={onSelectProduct} />
      </div>
    </aside>
  );
}

function MailSidebar({
  accounts,
  mails,
  mailFolder,
  onSelectFolder,
  onCompose,
  onToggleAccount,
  onOpenMailboxPermissions,
  activeProduct,
  onSelectProduct,
}) {
  const ownAccounts = accounts.filter((account) => account.ownership === 'self');
  const sharedAccounts = accounts.filter((account) => account.ownership === 'shared');
  const activeAccountIds = new Set(accounts.filter((account) => account.checked).map((account) => account.id));
  const folderCounts = MAIL_FOLDERS.reduce((accumulator, folder) => {
    accumulator[folder.id] = mails.filter((mail) => mail.folder === folder.id && activeAccountIds.has(mail.accountId)).length;
    return accumulator;
  }, {});
  const unreadByAccount = accounts.reduce((accumulator, account) => {
    accumulator[account.id] = mails.filter((mail) => mail.accountId === account.id && mail.folder === 'inbox' && mail.unread).length;
    return accumulator;
  }, {});

  return (
    <aside
      className="relative z-10 hidden shrink-0 select-none border-r border-slate-200 bg-[#f1f3f5] md:flex md:flex-col"
      style={{ width: '252px', zIndex: 20 }}
    >
      <div className="border-b border-slate-200 px-5 pt-6 pb-4">
        <button
          onClick={() => onCompose('new')}
          className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition-colors hover:bg-blue-700"
        >
          <SquarePen size={18} className="mr-2" />
          写邮件
        </button>
      </div>

      <div className="border-b border-slate-200 px-5 py-5">
        <div className="text-xs font-black text-gray-400 uppercase mb-3">文件夹</div>
        <div className="space-y-1">
          {MAIL_FOLDERS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onSelectFolder(id)}
              className={`w-full flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
                mailFolder === id
                  ? 'border-transparent bg-white/85 text-gray-900'
                  : 'border-transparent bg-transparent text-gray-600 hover:bg-white/60'
              }`}
            >
              <span className="flex items-center min-w-0">
                <Icon size={16} className="mr-2 shrink-0" />
                <span className="truncate">{label}</span>
              </span>
              <span className="ml-2 min-w-[22px] rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-gray-500">{folderCounts[id] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#f1f3f5] p-5 space-y-4">
        {[{ title: '我的日历', items: ownAccounts }, { title: '共享日历', items: sharedAccounts }].map((group) => (
          <div key={group.title}>
            <div className="text-[11px] font-black text-gray-400 uppercase mb-3">{group.title}</div>
            <div>
              {group.items.map((account) => (
                <div
                  key={account.id}
                  className="bg-transparent px-1 py-2 transition-all"
                >
                  <div className="flex items-start">
                    <button onClick={() => onToggleAccount(account.id)} className="flex items-start flex-1 min-w-0 text-left" title={`${account.name} · ${account.email}`}>
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 ${account.color}`}></div>
                      <div className="ml-3 min-w-0 flex-1">
                        <div className="text-sm font-bold text-gray-900 truncate">{account.name}</div>
                        <div className="text-xs text-gray-500 truncate mt-1">{account.email}</div>
                        <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                          <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-bold whitespace-nowrap">
                            未读 {unreadByAccount[account.id] || 0}
                          </span>
                          {account.checked && (
                            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-bold whitespace-nowrap">
                              当前显示中
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => onOpenMailboxPermissions(account.id)}
                      className="ml-3 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-slate-200/80 shrink-0"
                    >
                      权限
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 bg-[#f1f3f5] p-4">
        <ProductTabsBar activeProduct={activeProduct} onSelect={onSelectProduct} />
      </div>
    </aside>
  );
}

function MailWorkspace({
  accounts,
  mails,
  mailFolder,
  mailFocusTab,
  unreadOnly,
  selectedMail,
  onSelectMail,
  onToggleStar,
  onToggleRead,
  onArchiveMail,
  onCompose,
  onEditDraft,
  onScheduleFromMail,
  onOpenLinkedEvent,
  onToggleUnreadOnly,
  onSetMailFocusTab,
  upcomingEvents,
  linkedEventLookup,
  accountMap,
  calendarMap,
  onOpenEvent,
}) {
  const selectedLinkedEvent = selectedMail?.linkedEventId ? linkedEventLookup[selectedMail.linkedEventId] || null : null;

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden bg-white">
      <div className="w-[360px] min-w-0 border-r border-slate-200 bg-[#fcfcfb] flex flex-col">
        <div className="border-b border-slate-200 bg-[#fcfcfb] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-black text-gray-900">邮件</div>
            </div>
            <button onClick={() => onCompose('new')} className="inline-flex items-center px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold">
              <SquarePen size={15} className="mr-2" />
              写邮件
            </button>
          </div>

          {mailFolder === 'inbox' && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                {[
                  ['focused', '重点'],
                  ['other', '其他'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => onSetMailFocusTab(id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                      mailFocusTab === id ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={onToggleUnreadOnly}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  unreadOnly ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                仅看未读
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {mails.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">当前筛选下没有邮件。</div>
          ) : (
            mails.map((mail) => {
              const account = accounts.find((item) => item.id === mail.accountId);
              const selected = selectedMail?.id === mail.id;
              const linkedEvent = mail.linkedEventId ? linkedEventLookup[mail.linkedEventId] || null : null;
              return (
                <div
                  key={mail.id}
                  onClick={() => onSelectMail(mail.id)}
                  className={`w-full text-left px-4 py-4 border-b border-slate-100/80 transition-colors cursor-pointer ${
                    selected ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleStar(mail.id);
                      }}
                      className={`mt-1 ${mail.starred ? 'text-amber-500' : 'text-gray-300 hover:text-gray-500'}`}
                    >
                      <Star size={16} fill={mail.starred ? 'currentColor' : 'none'} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className={`text-sm truncate ${mail.unread ? 'font-black text-gray-900' : 'font-bold text-gray-700'}`}>{mail.fromName}</div>
                          <div className="text-[11px] text-gray-400 truncate mt-0.5">{account?.name}</div>
                        </div>
                        <div className="shrink-0 text-[11px] font-bold text-gray-400">{formatMailTime(mail.timestamp)}</div>
                      </div>
                      <div className={`mt-2 text-sm leading-snug ${mail.unread ? 'font-bold text-gray-900' : 'text-gray-700'}`} style={clampLinesStyle(1)}>
                        {mail.subject}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 leading-snug" style={clampLinesStyle(2)}>
                        {mail.preview}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {mail.unread && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-black">未读</span>}
                        {mail.attachments.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-black">
                            附件 {mail.attachments.length}
                          </span>
                        )}
                        {linkedEvent?.status === '已取消' && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-black">Cancel</span>
                        )}
                        {linkedEvent?.status === '草稿' && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-black">草稿</span>
                        )}
                        {linkedEvent?.status === '待响应' && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 text-[11px] font-black">待响应</span>
                        )}
                        {mail.linkedEventId && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black">关联日程</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 bg-[#f8f8f7]">
        {!selectedMail ? (
          <div className="h-full flex items-center justify-center text-gray-400">未选择邮件</div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="border-b border-slate-200 bg-[#fcfcfb] px-6 py-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold">{MAIL_FOLDERS.find((item) => item.id === selectedMail.folder)?.label}</span>
                    {selectedMail.unread && <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold">未读</span>}
                    {selectedLinkedEvent?.status === '已取消' && <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-bold">Cancel</span>}
                    {selectedLinkedEvent?.status === '草稿' && <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">草稿</span>}
                    {selectedMail.linkedEventId && (
                      <button
                        onClick={() => onOpenLinkedEvent(selectedMail.linkedEventId)}
                        className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold"
                      >
                        查看关联日程
                      </button>
                    )}
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">{selectedMail.subject}</h2>
                  <div className="mt-4 text-sm text-gray-700">
                    <div className="font-bold">{selectedMail.fromName} &lt;{selectedMail.fromEmail}&gt;</div>
                    <div className="text-gray-500 mt-1">收件人：{joinRecipients(selectedMail.to)}</div>
                    {selectedMail.cc.length > 0 && <div className="text-gray-500 mt-1">抄送：{joinRecipients(selectedMail.cc)}</div>}
                    <div className="text-gray-400 mt-1">{formatMailTime(selectedMail.timestamp)}</div>
                    {selectedLinkedEvent && (
                      <div className="mt-2 text-xs text-gray-500">
                        日程状态：{selectedLinkedEvent.status || '已接受'} · {formatEventDateTime(selectedLinkedEvent)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedMail.folder === 'drafts' ? (
                    <button onClick={() => onEditDraft(selectedMail.id)} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold">
                      继续编辑
                    </button>
                  ) : (
                    <>
                      <button onClick={() => onCompose('reply', selectedMail.id)} className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 inline-flex items-center">
                        <Reply size={15} className="mr-2" />
                        回复
                      </button>
                      <button onClick={() => onCompose('replyAll', selectedMail.id)} className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 inline-flex items-center">
                        <ReplyAll size={15} className="mr-2" />
                        全部回复
                      </button>
                      <button onClick={() => onCompose('forward', selectedMail.id)} className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 inline-flex items-center">
                        <Forward size={15} className="mr-2" />
                        转发
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onToggleRead(selectedMail.id)}
                    className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700"
                  >
                    {selectedMail.unread ? '标为已读' : '标为未读'}
                  </button>
                      <button onClick={() => onArchiveMail(selectedMail.id)} className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-700 inline-flex items-center">
                        <Archive size={15} className="mr-2" />
                        存档
                      </button>
                      <button onClick={() => onScheduleFromMail(selectedMail.id)} className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-sm font-bold text-blue-700">
                        生成日程
                      </button>
                    </div>
                  </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {selectedLinkedEvent?.status === '已取消' && (
                <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-rose-900">这场会议已经取消</div>
                    </div>
                    <button
                      onClick={() => onOpenLinkedEvent(selectedLinkedEvent.id)}
                      className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                    >
                      打开日程
                    </button>
                  </div>
                </div>
              )}

              {selectedMail.attachments.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-3">
                  {selectedMail.attachments.map((attachment) => (
                    <div key={attachment.name} className="px-3 py-2 rounded-xl border border-gray-200 bg-white inline-flex items-center">
                      <Paperclip size={14} className="mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm font-bold text-gray-800">{attachment.name}</div>
                        <div className="text-xs text-gray-500">{attachment.size}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 text-sm text-gray-700 whitespace-pre-wrap leading-7">
                {selectedMail.body}
              </div>
            </div>
          </div>
        )}
      </div>

      <aside className="hidden w-[300px] shrink-0 border-l border-slate-200 bg-[#fcfcfb] xl:flex xl:flex-col">
        <div className="border-b border-slate-200 px-5 py-4">
	          <div className="text-sm font-semibold text-slate-900">近期日程</div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            {upcomingEvents.slice(0, 8).map((event) => {
              const calendar = calendarMap[event.calId];
              const account = accountMap[calendar?.accountId];
              return (
                <button
                  key={event.id}
                  onClick={() => onOpenEvent(event.id)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{event.title}</div>
                      <div className="mt-1 truncate text-xs text-slate-500">
                        {formatEventDateTime(event)} · {account?.email || account?.name || '未知账户'}
                      </div>
                    </div>
                    <span className={`h-2.5 w-2.5 rounded-full ${calendar?.color || 'bg-slate-400'}`}></span>
                  </div>
                </button>
              );
            })}
            {upcomingEvents.length === 0 && <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">近期没有日程</div>}
          </div>
        </div>
      </aside>
    </div>
  );
}

function CalendarSidebar({
  accounts,
  miniMonthEventMap,
  showHuaweiWorkdayBadges = false,
  focusDate,
  calendarLayout,
  collapsed,
  onNewEvent,
  onShiftMonth,
  onSelectDate,
  onToggleAccount,
  onOpenMailboxPermissions,
  onOpenSharedCalendarAccess,
  onOpenSharingSettings,
  onAddSharedCalendar,
  onToggleCollapsed,
  onAccountContextMenu,
  onFocusAccount,
  onAccountMenu,
  pendingShareInvitationCount = 0,
  focusedAccountId,
  activeProduct,
  onSelectProduct,
}) {
  const [collapsedSections, setCollapsedSections] = useState({
    ownAccounts: false,
    sharedAccounts: false,
  });
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const createMenuRef = useRef(null);
  const miniMonthCells = buildMiniMonthCells(focusDate);
  const activeWeekStart = getWeekStart(focusDate);
  const ownAccounts = accounts.filter((account) => account.ownership === 'self');
  const sharedAccounts = accounts.filter((account) => account.ownership === 'shared');
  const toggleSection = (key) => setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    if (!createMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setCreateMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, [createMenuOpen]);

      if (collapsed) {
        return (
      <aside
        className="relative z-10 hidden shrink-0 select-none border-r border-slate-200 bg-[#f1f3f5] md:flex md:flex-col"
        style={{ width: '88px', zIndex: 20 }}
      >
        <div className="flex flex-col items-center border-b border-slate-200 px-3 py-4">
          <button
            onClick={onToggleCollapsed}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/80 bg-white/85 text-gray-600 hover:bg-white"
            title="展开侧边栏"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="border-b border-slate-200 px-3 py-4">
          <div className="relative" ref={createMenuRef}>
            <button
              onClick={() => {
                onNewEvent();
                setCreateMenuOpen(false);
              }}
              className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
              title="新建日程"
            >
              <Plus size={17} />
            </button>
            {createMenuOpen && (
              <div className="absolute left-[calc(50%+22px)] top-1/2 z-30 -translate-y-1/2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-md">
                <button
                  onClick={() => {
                    onNewEvent();
                    setCreateMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
                >
                  <Users size={15} className="text-slate-400" />
                  发起会议
                </button>
                <button
                  onClick={() => {
                    onNewEvent();
                    setCreateMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
                >
                  <SquarePen size={15} className="text-slate-400" />
                  新建日程
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-h-0"></div>
        <div className="border-t border-slate-200 p-3">
          <ProductTabsBar activeProduct={activeProduct} onSelect={onSelectProduct} compact vertical />
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="relative z-10 hidden shrink-0 select-none border-r border-slate-200 bg-[#f1f3f5] md:flex md:flex-col"
      style={{ width: '252px', zIndex: 20 }}
    >
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-lg font-black text-gray-900">Coremail</div>
          <button
            onClick={onToggleCollapsed}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white/85 text-gray-600 hover:bg-white"
            title="收起侧边栏"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        <div className="relative mt-4" ref={createMenuRef}>
          <div className="flex w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-blue-600">
            <button
              onClick={() => {
                onNewEvent();
                setCreateMenuOpen(false);
              }}
              className="flex min-w-0 flex-1 items-center justify-center px-4 py-3 font-bold transition-colors hover:bg-slate-200"
            >
              <Plus size={18} className="mr-2 shrink-0" />
              <span className="truncate">新建日程</span>
            </button>
            <button
              onClick={() => setCreateMenuOpen((prev) => !prev)}
              className="flex w-12 items-center justify-center transition-colors hover:bg-slate-200"
              title="展开新建菜单"
              aria-label="展开新建菜单"
              aria-expanded={createMenuOpen}
            >
              <ChevronDown size={16} />
            </button>
          </div>
          {createMenuOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-md">
              <button
                onClick={() => {
                  onNewEvent();
                  setCreateMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
              >
                <Users size={15} className="text-slate-400" />
                发起会议
              </button>
              <button
                onClick={() => {
                  onNewEvent();
                  setCreateMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
              >
                <SquarePen size={15} className="text-slate-400" />
                新建日程
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="px-1 pt-1">
          <div className="mb-4 flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <button className="rounded-lg p-1 text-gray-500 transition hover:bg-slate-100 hover:text-gray-700" onClick={() => onShiftMonth(-12)} title="上一年">
                <ChevronsLeft size={14} />
              </button>
              <button className="rounded-lg p-1 text-gray-500 transition hover:bg-slate-100 hover:text-gray-700" onClick={() => onShiftMonth(-1)} title="上一月">
                <ChevronLeft size={16} />
              </button>
            </div>
            <span className="min-w-0 text-center text-sm font-bold text-gray-800">
              {focusDate.getFullYear()}年 {focusDate.getMonth() + 1}月
            </span>
            <div className="flex items-center gap-1">
              <button className="rounded-lg p-1 text-gray-500 transition hover:bg-slate-100 hover:text-gray-700" onClick={() => onShiftMonth(1)} title="下一月">
                <ChevronRight size={16} />
              </button>
              <button className="rounded-lg p-1 text-gray-500 transition hover:bg-slate-100 hover:text-gray-700" onClick={() => onShiftMonth(12)} title="下一年">
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {MONTH_WEEKDAY_NAMES.map((day) => (
              <div key={day} className="text-gray-400 font-bold">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
            {miniMonthCells.map((cell) => {
              const inActiveWeek = getWeekStart(cell.date).getTime() === activeWeekStart.getTime();
              const dayMeta = miniMonthEventMap.get(formatDateLabel(cell.date));
              const markerColors = dayMeta?.colors?.slice(0, 4) || [];
              const isSelectedDate = sameDay(cell.date, focusDate);
              const showHuaweiWorkdayBadge = showHuaweiWorkdayBadges && cell.isCurrentMonth && isHuaweiMakeupWorkday(cell.date);
              const showWeekRange = calendarLayout === 'week' && inActiveWeek;

              return (
                <div key={cell.key} className="group/day relative flex h-9 cursor-pointer items-center justify-center">
                  {showWeekRange && <div className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100"></div>}
                  <button
                    type="button"
                    onClick={() => onSelectDate(cell.date)}
                    className={`relative z-[1] aspect-square w-7 flex items-center justify-center rounded-full font-medium transition-colors ${
                      isSelectedDate
                        ? 'bg-blue-600 text-white font-bold hover:bg-blue-600'
                        : cell.isCurrentMonth
                          ? 'text-gray-700 hover:bg-slate-200'
                          : 'text-gray-300 hover:bg-slate-100'
                    } ${
                      cell.isToday && !isSelectedDate
                        ? 'ring-2 ring-blue-500 ring-offset-1 font-bold text-blue-600'
                        : ''
                    } ${
                      cell.isToday && isSelectedDate
                        ? 'ring-2 ring-blue-300 ring-offset-1'
                        : ''
                    }`}
                  >
                    <span className="relative z-[1] leading-none">{cell.date.getDate()}</span>
                    {markerColors.length > 0 && (
                      <span
                        className={`pointer-events-none absolute left-1/2 bottom-[2px] h-[2px] w-[6px] -translate-x-1/2 rounded-full ${
                          isSelectedDate ? 'bg-white' : 'bg-blue-500'
                        }`}
                      ></span>
                    )}
                  </button>
                  {showHuaweiWorkdayBadge && (
                    <span className="pointer-events-none absolute right-[1px] top-[-1px] z-[4] flex h-3.5 min-w-3.5 items-center justify-center rounded-full border border-red-200 bg-white/95 px-[2px] text-[8px] font-bold leading-none text-red-500 shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                      班
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div>
          <div className="space-y-5">
            {[
              { key: 'ownAccounts', title: '我的日历', ownership: 'self', items: ownAccounts },
              { key: 'sharedAccounts', title: '共享日历', ownership: 'shared', items: sharedAccounts },
            ].map((group) => (
              <div key={group.title} className="group">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <button onClick={() => toggleSection(group.key)} className="flex items-center min-w-0 text-left">
                    <ChevronDown size={14} className={`mr-1 text-gray-400 transition-transform ${collapsedSections[group.key] ? '-rotate-90' : ''}`} />
                    <div className="relative text-[11px] font-bold text-gray-400 tracking-wide">
                      {group.title}
                      {group.ownership === 'shared' && pendingShareInvitationCount > 0 && (
                        <span className="absolute -right-2 -top-1 h-1.5 w-1.5 rounded-full bg-red-500" />
                      )}
                    </div>
                  </button>
                </div>
		                {!collapsedSections[group.key] && <div className="space-y-[2px]">
		                  {group.items.map((account) => {
				const displayName = getAccountDisplayLabel(account);
                    const fullLabel = getAccountFullLabel(account);
                    return (
                    <div
	                    key={account.id}
	                    className="group/account relative -mx-1 flex cursor-default items-center gap-2 rounded-xl px-2 py-1.5 transition-colors duration-120 hover:bg-white/65"
	                    onContextMenu={(e) => onAccountContextMenu(e, account)}
	                  >
	                    {/* Checkbox - independent click zone */}
	                    <button
	                      onClick={(e) => { e.stopPropagation(); onToggleAccount(account.id); }}
	                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all duration-150 ${
	                        account.checked
	                          ? `border-transparent ${getAccountCheckboxTone(account.color)}`
	                          : 'border-gray-300 bg-transparent text-transparent hover:border-blue-400 hover:bg-white/70'
	                      }`}
	                      title={account.checked ? '取消选中此日历' : '选中此日历'}
	                    >
	                      {account.checked && <Check size={12} strokeWidth={2.6} />}
	                    </button>
	                    {/* Content area - click to open details */}
	                    <div
                        title={fullLabel}
                        className="min-w-0 flex-1 truncate rounded px-1 py-0.5 -mx-1"
                      >
			                        <span className="text-[14px] leading-snug font-semibold text-gray-800">
			                          {displayName}
			                        </span>
			                      </div>
			                      {/* Hover: More menu button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onAccountMenu?.(e, account); }}
                        title="更多"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 opacity-0 transition hover:bg-white hover:text-gray-700 group-hover/account:opacity-100"
                      >
                        <MoreHorizontal size={14} />
                      </button>
			                      {/* Pending notification dot */}
                      {account.ownership === 'shared' && account.hasPendingInvite && (
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                      )}
			                    </div>
	                  );
		              })}
                  {group.items.length === 0 && (
                    <div className="px-1 py-2.5 text-xs font-medium text-gray-400">
                      {`暂无${group.title}`}
                    </div>
                  )}
                  {/* Persistent add button for shared calendars */}
                  {group.ownership === 'shared' && (
                    <button
                      onClick={onAddSharedCalendar}
                      className="relative mt-0.5 flex w-full items-center justify-start gap-1.5 rounded-lg px-2 py-[5px] text-[12px] font-medium text-gray-500 transition-colors duration-120 hover:bg-slate-200/70 hover:text-blue-600"
                    >
                      <Plus size={13} />
                      添加共享日历
                      {pendingShareInvitationCount > 0 && (
                        <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                          {pendingShareInvitationCount}
                        </span>
                      )}
                    </button>
                  )}
                </div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <ProductTabsBar activeProduct={activeProduct} onSelect={onSelectProduct} />
      </div>
    </aside>
  );
}

function WeekView({
  days,
  events,
  activeAccounts,
  accountDisplayMode,
  splitAccounts,
  accountMap,
  calendarMap,
  onSelectEvent,
  onOpenEvent,
  onCreateEvent,
  onContextMenu,
  selection,
  onStartSelection,
  onHoverSelection,
  onSlotContextMenu,
  showAccountLabel,
  interaction,
  onStartEventMove,
  onStartEventResize,
  onPreviewEvent,
  onHidePreview,
  onHideAccount,
  scrollRef,
  scrollToWorkStartToken,
  showHuaweiWorkdayBadges = false,
  flashingEventId = null,
}) {
  const allDayEvents = sortEvents(events.filter((event) => event.isAllDay));
  const timedEvents = sortEvents(events.filter((event) => !event.isAllDay));
  const weekAccounts =
    accountDisplayMode === 'split' && splitAccounts.length > 0
      ? splitAccounts
      : [
          {
            id: 'overlay',
            name: activeAccounts.length > 1 ? '叠加视图' : activeAccounts[0]?.name || '当前账户',
            email: activeAccounts.length > 1 ? `${activeAccounts.length} 个账户叠加显示` : activeAccounts[0]?.email || '',
            color: 'bg-slate-700',
          },
        ];
  const isSplit = accountDisplayMode === 'split' && weekAccounts[0]?.id !== 'overlay';
  const paneHeaderHeight = 0;
  const splitWeekPaneHeaderHeight = isSplit ? SPLIT_WEEK_PANE_HEADER_HEIGHT : 0;
  const weekTimelineHeaderHeight = TIMELINE_HEADER_HEIGHT;
  const getWeekTimeTop = (hour) => (hour - DAY_START_HOUR) * CELL_HEIGHT;
  const paneGap = 0;
  const paneMinWidth = isSplit ? (weekAccounts.length >= 3 ? 400 : 440) : 0;
  const paneData = useMemo(() => {
    return weekAccounts.map((weekAccount) => {
      const paneAllDayEvents =
        isSplit ? allDayEvents.filter((event) => calendarMap[event.calId]?.accountId === weekAccount.id) : allDayEvents;
      const paneTimedEvents =
        isSplit ? timedEvents.filter((event) => calendarMap[event.calId]?.accountId === weekAccount.id) : timedEvents;
      const paneAllDayLayout = buildAllDayEventLayout(paneAllDayEvents);
      const paneTimedLayout = {};

      days.forEach((day, dayIndex) => {
        Object.assign(paneTimedLayout, buildTimedEventLayout(paneTimedEvents.filter((event) => event.day === dayIndex)));
      });

      return {
        account: weekAccount,
        allDayEvents: paneAllDayEvents,
        timedEvents: paneTimedEvents,
        allDayLayout: paneAllDayLayout,
        timedLayout: paneTimedLayout,
      };
    });
  }, [allDayEvents, calendarMap, days, isSplit, timedEvents, weekAccounts]);
  const allDayHeight = Math.max(isSplit ? 44 : 52, ...paneData.map((pane) => 14 + pane.allDayLayout.rowCount * 30));
  const minContentWidth = isSplit ? 64 + paneData.length * paneMinWidth + Math.max(0, paneData.length - 1) * paneGap : 0;
  const splitDayMinWidth = isSplit ? (weekAccounts.length >= 3 ? 420 : 340) : 0;
  const splitWeekMinWidth = isSplit ? 64 + days.length * splitDayMinWidth : 0;
  const splitWeekLayouts = useMemo(() => {
    const layouts = {};

    days.forEach((day, dayIndex) => {
      weekAccounts.forEach((account) => {
        const laneEvents = timedEvents.filter(
          (event) => event.day === dayIndex && calendarMap[event.calId]?.accountId === account.id,
        );
        layouts[`${dayIndex}-${account.id}`] = buildTimedEventLayout(laneEvents);
      });
    });

    return layouts;
  }, [calendarMap, days, timedEvents, weekAccounts]);
  const splitAllDayHeight = useMemo(() => {
    if (!isSplit) return allDayHeight;

    const maxCellCount = days.reduce((max, day, dayIndex) => {
      const dayMax = weekAccounts.reduce((accountMax, account) => {
        const count = allDayEvents.filter((event) => {
          const startDay = event.day || 0;
          const endDay = startDay + Math.max(1, event.allDaySpan || 1) - 1;
          return calendarMap[event.calId]?.accountId === account.id && dayIndex >= startDay && dayIndex <= endDay;
        }).length;
        return Math.max(accountMax, count);
      }, 0);
      return Math.max(max, dayMax);
    }, 0);

    return Math.max(48, Math.min(132, 14 + Math.max(1, maxCellCount) * 28));
  }, [allDayEvents, allDayHeight, calendarMap, days, isSplit, weekAccounts]);

  useLayoutEffect(() => {
    const target = scrollRef?.current;
    if (!target) return;

    const scrollTop = getWorkdayScrollTop();
    const timeoutIds = [0, 80, 180, 320].map((delay) =>
      window.setTimeout(() => {
        if (target.isConnected) scrollElementToTop(target, scrollTop);
      }, delay),
    );
    const frameIds = [];
    frameIds.push(
      window.requestAnimationFrame(() => {
        if (target.isConnected) scrollElementToTop(target, scrollTop);
        frameIds.push(
          window.requestAnimationFrame(() => {
            if (target.isConnected) scrollElementToTop(target, scrollTop);
          }),
        );
      }),
    );

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
    };
  }, [scrollRef, scrollToWorkStartToken]);

  if (isSplit) {
    return (
      <div className="flex flex-1 flex-col min-w-0 min-h-0 bg-white relative overflow-hidden">
        <div className="flex-1 min-h-0 overflow-x-auto">
          <div className="flex min-h-full min-w-full flex-col" style={{ minWidth: `${splitWeekMinWidth}px` }}>
            <div className="sticky top-0 z-30 shrink-0 border-b border-gray-200 bg-white">
              <div className="flex border-b border-gray-200 bg-white">
                <div className="shrink-0 border-r border-gray-200 bg-white" style={{ width: '64px', height: '82px' }}></div>
                <div className="grid flex-1 bg-white" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(${splitDayMinWidth}px, 1fr))` }}>
                  {days.map((day) => (
                    <div
                      key={day.date.toISOString()}
                      className={`border-r border-gray-200 ${
                        day.isToday
                          ? 'bg-blue-50/70'
                          : showHuaweiWorkdayBadges && isHuaweiMakeupWorkday(day.date)
                            ? 'bg-amber-50/70'
                            : isWeekendDate(day.date)
                              ? 'bg-slate-50/70'
                              : 'bg-[#fcfcfb]'
                      }`}
                    >
                      <div className="flex h-12 flex-col items-center justify-center">
                        <span className={`text-xs font-bold ${day.isToday ? 'text-blue-600' : 'text-gray-500'}`}>{day.short}</span>
                        <span className={`inline-flex items-center gap-1 text-lg font-black ${day.isToday ? 'text-blue-700' : 'text-gray-900'}`}>
                          {day.dayNumber}
                          {showHuaweiWorkdayBadges && isHuaweiMakeupWorkday(day.date) && (
                            <span className="rounded-full bg-white/80 px-1 text-[9px] font-bold leading-4 text-red-500">班</span>
                          )}
                        </span>
                      </div>
                      <div
                        className="grid h-[34px] border-t border-gray-200 bg-white"
                        style={{ gridTemplateColumns: `repeat(${weekAccounts.length}, minmax(0, 1fr))` }}
                      >
                        {weekAccounts.map((account, accountIndex) => (
                          <div
                            key={`${day.date.toISOString()}-${account.id}-label`}
                            className={`flex min-w-0 items-center gap-1.5 px-2 ${accountIndex < weekAccounts.length - 1 ? 'border-r border-gray-100' : ''}`}
                          >
                            <span className={`h-2 w-2 shrink-0 rounded-full ${account.color}`}></span>
                            <span className="truncate text-[11px] font-bold text-gray-600">{account.email || account.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex bg-white">
                <div className="flex shrink-0 items-center justify-center border-r border-gray-200 bg-white" style={{ width: '64px', height: `${splitAllDayHeight}px` }}>
                  <span className="text-xs font-bold text-gray-400">全天</span>
                </div>
                <div className="grid flex-1 bg-white" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(${splitDayMinWidth}px, 1fr))` }}>
                  {days.map((day, dayIndex) => (
                    <div key={`${day.date.toISOString()}-split-all-day`} className="border-r border-gray-200">
                      <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${weekAccounts.length}, minmax(0, 1fr))` }}>
                        {weekAccounts.map((account, accountIndex) => {
                          const cellEvents = allDayEvents.filter((event) => {
                            const startDay = event.day || 0;
                            const endDay = startDay + Math.max(1, event.allDaySpan || 1) - 1;
                            return calendarMap[event.calId]?.accountId === account.id && dayIndex >= startDay && dayIndex <= endDay;
                          });

                          return (
                            <div
                              key={`${day.date.toISOString()}-${account.id}-all-day`}
                              className={`min-w-0 px-1.5 py-1.5 ${accountIndex < weekAccounts.length - 1 ? 'border-r border-gray-100' : ''}`}
                              style={{ height: `${splitAllDayHeight}px` }}
                            >
                              <div className="space-y-1">
                                {cellEvents.slice(0, 3).map((event) => {
                                  const calendar = calendarMap[event.calId] || { color: account.color, accountId: account.id };
                                  const tones = getToneClasses(isBusyOnlyEvent(event, calendar) ? { ...event, type: 'busy_only' } : event, calendar.color || account.color);
                                  const title = getVisibleEventTitle(event, calendar);
                                  const spans = Math.max(1, event.allDaySpan || 1);

                                  return (
	                                    <button
	                                      key={`${dayIndex}-${account.id}-${event.id}`}
	                                      data-event-card-id={event.id}
	                                      onClick={(entry) => {
                                        entry.stopPropagation();
                                        onSelectEvent(event.id);
                                      }}
                                      onDoubleClick={(entry) => {
                                        entry.stopPropagation();
                                        onOpenEvent(event.id);
                                      }}
                                      onMouseEnter={(entry) => onPreviewEvent(entry, event.id)}
                                      onMouseMove={(entry) => onPreviewEvent(entry, event.id)}
                                      onMouseLeave={() => onHidePreview(event.id)}
                                      title={title}
                                      className={`w-full truncate rounded-md border px-2 py-1 text-left text-[11px] font-semibold transition-colors hover:bg-white ${tones.container} ${
                                        flashingEventId === event.id ? 'coremail-event-locate-pulse' : ''
                                      }`}
                                    >
                                      <span className={event.status === '已取消' ? 'line-through' : ''}>{title}</span>
                                      {spans > 1 && <span className="ml-1 text-[10px] text-gray-400">跨{spans}天</span>}
                                    </button>
                                  );
                                })}
                                {cellEvents.length > 3 && <div className="px-1 text-[10px] font-bold text-blue-600">+{cellEvents.length - 3} 更多</div>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div ref={scrollRef} data-timeline-scroll="week" className="flex-1 min-h-0 overflow-y-auto bg-white flex relative">
              <div className="flex shrink-0 flex-col border-r border-gray-200 bg-white" style={{ width: '64px' }}>
                {HOURS.map((hour) => (
                  <div key={hour} className={`h-24 border-b relative ${isWorkHour(hour) ? 'border-gray-100 bg-white' : 'border-slate-200 bg-slate-50'}`}>
                    <span className="absolute -top-2.5 right-2 text-xs text-gray-500 font-bold">{hour}:00</span>
                  </div>
                ))}
              </div>

              <div className="grid flex-1 bg-white" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(${splitDayMinWidth}px, 1fr))` }}>
                {days.map((day, dayIndex) => (
                  <div key={`${day.date.toISOString()}-split-timeline`} className={`relative border-r border-gray-200 ${day.isToday ? 'bg-blue-50/20' : 'bg-white'}`}>
                    <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${weekAccounts.length}, minmax(0, 1fr))` }}>
                      {weekAccounts.map((account, accountIndex) => {
                        const laneId = account.id;
                        const preferredAccountId = account.id;
                        const laneEvents = timedEvents.filter(
                          (event) => event.day === dayIndex && calendarMap[event.calId]?.accountId === account.id,
                        );
                        const laneLayout = splitWeekLayouts[`${dayIndex}-${account.id}`] || {};

                        return (
                          <div
                            key={`${day.date.toISOString()}-${account.id}-timeline`}
                            className={`relative min-w-0 ${accountIndex < weekAccounts.length - 1 ? 'border-r border-gray-100' : ''}`}
                          >
                            {HOURS.map((hour) => (
                              <div
                                key={`${day.date.toISOString()}-${account.id}-${hour}`}
                                onMouseDown={(entry) => {
                                  if (entry.button !== 0) return;
                                  onStartSelection({ date: day.date, hour, laneId, preferredAccountId });
                                }}
                                onMouseEnter={() => onHoverSelection({ date: day.date, hour, laneId, preferredAccountId })}
                                onContextMenu={(entry) => onSlotContextMenu(entry, { date: day.date, hour, laneId, preferredAccountId })}
                                onDoubleClick={() => onCreateEvent({ date: day.date, startH: hour, durationH: 1, preferredAccountId })}
                                data-calendar-slot="true"
                                data-slot-date-ms={stripTime(day.date).getTime()}
                                data-slot-hour={hour}
                                className={`group relative h-24 cursor-pointer border-b transition-colors ${
                                  isWorkHour(hour) ? 'border-gray-100 bg-transparent hover:bg-blue-50' : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100'
                                }`}
                              >
                                {!selection && (
                                  <div className="absolute inset-1 hidden items-center justify-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50/60 group-hover:flex">
                                    <Plus className="text-blue-500" size={16} />
                                  </div>
                                )}
                              </div>
                            ))}

                            {selection && sameDay(selection.date, day.date) && (selection.laneId || null) === laneId && (
                              <div
                                className="pointer-events-none absolute rounded-lg border-2 border-blue-400 bg-blue-100/80 shadow-sm"
                                style={{
                                  top: `${getWeekTimeTop(selection.startH)}px`,
                                  height: `${getTimeHeight(selection.durationH)}px`,
                                  left: '4px',
                                  width: 'calc(100% - 8px)',
                                  zIndex: 4,
                                }}
                              >
                                <div className="px-2 py-1.5 text-[11px] font-black text-blue-700">
                                  新建 {formatTimeRange(selection.startH, selection.durationH)}
                                </div>
                              </div>
                            )}

                            {laneEvents.map((event) => {
                              const calendar = calendarMap[event.calId] || { color: account.color, accountId: account.id };
                              const displayEvent = isBusyOnlyEvent(event, calendar) ? { ...event, type: 'busy_only' } : event;
                              const editable =
                                !event.isAllDay && !isBusyOnlyEvent(event, calendar) && event.status !== '已取消' && canEditCalendarContent(calendar);
                              const safeStartH = event.startH || WORK_START_HOUR;
                              const safeDuration = event.durationH || 1;
                              const layout = laneLayout[event.id] || { column: 0, columnCount: 1 };
                              const top = getWeekTimeTop(safeStartH);
                              const height = getTimeHeight(safeDuration);
                              const width = `calc(${100 / layout.columnCount}% - 8px)`;
                              const left = `calc(${(layout.column * 100) / layout.columnCount}% + 4px)`;
                              const tones = getToneClasses(displayEvent, calendar.color || account.color);
                              const statusBadgeMeta = getEventStatusBadgeMeta(event.status);
                              const statusSurface = getTimedEventStatusSurface(event.status);
                              const title = getVisibleEventTitle(event, calendar);
                              const isInteracting = interaction?.eventId === event.id;
                              const density = getTimedEventCardDensity({ isSplit: true, columnCount: layout.columnCount, durationH: safeDuration });
                              const showSecondary = density === 'regular' && safeDuration >= 1.25;
                              const compactTimeLabel =
                                safeDuration > 0.5
                                  ? `${formatHour(safeStartH)}–${formatHour(safeStartH + safeDuration)}`
                                  : formatHour(safeStartH);

                              return (
	                                <div
	                                  key={event.id}
	                                  data-event-card-id={event.id}
	                                  onMouseDown={(entry) => {
                                    if (!editable || entry.button !== 0) return;
                                    onStartEventMove(entry, event);
                                  }}
                                  onClick={(entry) => {
                                    entry.stopPropagation();
                                    onSelectEvent(event.id);
                                  }}
                                  onDoubleClick={(entry) => {
                                    entry.stopPropagation();
                                    onOpenEvent(event.id);
                                  }}
                                  onContextMenu={(entry) => onContextMenu(entry, event)}
                                  onMouseEnter={(entry) => onPreviewEvent(entry, event.id)}
                                  onMouseMove={(entry) => onPreviewEvent(entry, event.id)}
                                  onMouseLeave={() => onHidePreview(event.id)}
                                  title={`${title} · ${formatTimeRange(safeStartH, safeDuration)}`}
                                  className={`group absolute overflow-hidden rounded-lg border px-2 py-1.5 shadow-none ${tones.container} ${statusSurface.cardClass} ${
                                    editable ? 'cursor-grab select-none hover:ring-2 hover:ring-blue-200/80 active:cursor-grabbing' : 'cursor-pointer'
                                  } ${isInteracting && interaction?.changed ? 'pointer-events-none z-20 ring-2 ring-blue-300 shadow-lg' : 'hover:z-10'} ${
                                    flashingEventId === event.id ? 'coremail-event-locate-pulse' : ''
                                  }`}
                                  style={{ top: `${top}px`, height: `${height}px`, left, width }}
                                >
                                  {!isBusyOnlyEvent(event, calendar) && <div className={`absolute bottom-0 left-0 top-0 w-1 ${tones.stripe}`}></div>}
                                  {statusSurface.topRuleClass && <div className={`pointer-events-none absolute left-1.5 right-1.5 top-1 h-0.5 rounded-full ${statusSurface.topRuleClass}`}></div>}
                                  {statusBadgeMeta && (
                                    <span className={`pointer-events-none absolute right-1.5 top-1.5 z-[1] rounded-full border px-1.5 py-0.5 text-[9px] font-bold leading-none ${statusBadgeMeta.className}`}>
                                      {statusBadgeMeta.compactLabel}
                                    </span>
                                  )}
                                  {editable && (
                                    <button
                                      type="button"
                                      onMouseDown={(entry) => onStartEventResize(entry, event, 'top')}
                                      onClick={(entry) => entry.stopPropagation()}
                                      className={`absolute left-1/2 top-0.5 z-[2] flex h-6 w-8 -translate-x-1/2 cursor-ns-resize items-start justify-center rounded-full transition-opacity ${
                                        isInteracting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                      }`}
                                      aria-label="调整开始时间"
                                    >
                                      <span className="mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm"></span>
                                    </button>
                                  )}
                                  {isBusyOnlyEvent(event, calendar) ? (
                                    <div className="flex h-full items-center justify-center text-[12px] font-bold opacity-70">
                                      <Lock size={13} className="mr-1" />
                                      忙碌
                                    </div>
                                  ) : (
                                    <div className={`flex h-full min-w-0 flex-col pl-1 ${statusBadgeMeta ? 'pr-7' : ''}`}>
                                      <div
                                        className={`min-w-0 text-[11px] font-bold leading-tight ${density === 'regular' ? '' : 'truncate'} ${
                                          event.status === '已取消' ? 'line-through' : ''
                                        }`}
                                        style={density === 'regular' ? clampLinesStyle(2) : undefined}
                                      >
                                        {title}
                                      </div>
                                      <div className="mt-0.5 min-w-0 truncate text-[10px] font-semibold leading-tight opacity-80">
                                        {compactTimeLabel}
                                      </div>
                                      {showSecondary && (
                                        <div className="mt-0.5 truncate text-[10px] font-medium opacity-60">{getEventSecondaryLine(event, calendar)}</div>
                                      )}
                                    </div>
                                  )}
                                  {editable && (
                                    <button
                                      type="button"
                                      onMouseDown={(entry) => onStartEventResize(entry, event, 'bottom')}
                                      onClick={(entry) => entry.stopPropagation()}
                                      className={`absolute bottom-0.5 left-1/2 z-[2] flex h-6 w-8 -translate-x-1/2 cursor-ns-resize items-end justify-center rounded-full transition-opacity ${
                                        isInteracting && interaction?.type === 'resize' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                      }`}
                                      aria-label="调整时长"
                                    >
                                      <span className="mb-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm"></span>
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>

                    {day.isToday && (
                      <div className="pointer-events-none absolute left-0 right-0" style={{ top: `${getWeekTimeTop(getCurrentTimeHour())}px`, zIndex: 15 }}>
                        <div className="absolute -left-1 -mt-1 h-2 w-2 rounded-full bg-red-500"></div>
                        <div className="w-full border-t-2 border-red-500"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-w-0 min-h-0 bg-white relative overflow-hidden">
      <div className="flex-1 min-h-0 overflow-x-auto">
        <div className="flex min-h-full min-w-full flex-col" style={isSplit ? { minWidth: `${minContentWidth}px` } : undefined}>
          <div className="sticky top-0 z-30 shrink-0 border-b border-gray-200 bg-white">
            <div className="flex border-b border-gray-200 bg-white">
              <div
                className="border-r border-gray-200 shrink-0 bg-white"
                style={{ width: '64px', height: `${splitWeekPaneHeaderHeight + weekTimelineHeaderHeight}px` }}
              ></div>
              <div
                className={isSplit ? 'flex-1 grid min-w-0 bg-white' : 'flex-1 flex bg-white'}
                style={isSplit ? { gridTemplateColumns: `repeat(${paneData.length}, minmax(${paneMinWidth}px, 1fr))` } : undefined}
              >
                {paneData.map((pane, paneIndex) => (
                  <div
                    key={`${pane.account.id}-date-header`}
                    className={`bg-white shrink-0 ${isSplit ? `overflow-hidden ${paneIndex < paneData.length - 1 ? 'border-r border-gray-200' : ''}` : 'border-r border-gray-200'}`}
                    style={isSplit ? { minWidth: `${paneMinWidth}px` } : { flex: 1, minWidth: 0 }}
                  >
                    {isSplit && (
                      <div
                        className="flex items-center gap-2 border-b border-gray-200 bg-[#fcfcfb] px-3"
                        style={{ height: `${splitWeekPaneHeaderHeight}px` }}
                      >
                        <div className={`h-2.5 w-2.5 rounded-full ${pane.account.color}`}></div>
                        <div className="min-w-0 flex-1 truncate text-[12px] font-bold text-gray-700">{pane.account.email || pane.account.name}</div>
                        <button
                          type="button"
                          onClick={() => onHideAccount?.(pane.account.id)}
                          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-white hover:text-gray-700"
                          title={`隐藏 ${pane.account.email || pane.account.name}`}
                          aria-label={`隐藏 ${pane.account.email || pane.account.name}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                    <div className="flex bg-white">
                      {days.map((day) => (
                        <div
                          key={`${pane.account.id}-${day.date.toISOString()}-date-header`}
                          className={`flex-1 border-r border-gray-200 px-2 ${
                            day.isToday
                              ? 'bg-blue-50/80'
                              : showHuaweiWorkdayBadges && isHuaweiMakeupWorkday(day.date)
                                ? 'bg-amber-50/70'
                                : isWeekendDate(day.date)
                                  ? 'bg-slate-50/70'
                                  : 'bg-[#fcfcfb]'
                          }`}
                          style={{ height: `${weekTimelineHeaderHeight}px` }}
                        >
                          <div className="flex h-full flex-col items-center justify-center">
                            <span className={`text-xs font-bold ${day.isToday ? 'text-blue-600' : 'text-gray-500'}`}>{day.short}</span>
                            <span className={`inline-flex items-center gap-1 text-lg font-black ${day.isToday ? 'text-blue-700' : 'text-gray-800'}`}>
                              {day.dayNumber}
                              {showHuaweiWorkdayBadges && isHuaweiMakeupWorkday(day.date) && (
                                <span className="rounded-full bg-white/80 px-1 text-[9px] font-bold leading-4 text-red-500">班</span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex bg-white">
              <div className="border-r border-gray-200 shrink-0 bg-white" style={{ width: '64px', height: `${allDayHeight}px` }}>
                <div className="flex h-full items-center justify-center">
                  <span className="text-xs font-bold text-gray-400">全天</span>
                </div>
              </div>
              <div
                className={isSplit ? 'flex-1 grid min-w-0 bg-white' : 'flex-1 flex'}
                style={isSplit ? { gridTemplateColumns: `repeat(${paneData.length}, minmax(${paneMinWidth}px, 1fr))` } : undefined}
              >
                {paneData.map((pane, paneIndex) => (
                  <div
                    key={pane.account.id}
                    className={`bg-white shrink-0 ${isSplit ? `overflow-hidden ${paneIndex < paneData.length - 1 ? 'border-r border-gray-200' : ''}` : 'border-r border-gray-200'}`}
                    style={isSplit ? { minWidth: `${paneMinWidth}px` } : { flex: 1, minWidth: 0 }}
                  >
                    <div className="relative" style={{ height: `${allDayHeight}px` }}>
                      <div className="flex h-full">
                        {days.map((day) => (
                          <div key={`${pane.account.id}-${day.date.toISOString()}-all-day`} className="flex-1 border-r border-gray-100 bg-white"></div>
                        ))}
                      </div>
                      <div className="pointer-events-none absolute inset-0">
                        {pane.allDayEvents.map((event) => {
                          const calendar = calendarMap[event.calId] || { color: 'bg-gray-500', accountId: 'unknown' };
                          const account = accountMap[calendar.accountId];
                          const tones = getToneClasses(event, calendar.color || 'bg-gray-500');
                          const startDay = event.day || 0;
                          const endDay = Math.min(days.length - 1, startDay + Math.max(1, event.allDaySpan || 1) - 1);
                          const spanDays = endDay - startDay + 1;
                          const row = pane.allDayLayout.positions[event.id]?.row || 0;
                          const top = `${8 + row * 28}px`;
                          const left = `calc(${(startDay * 100) / days.length}% + 4px)`;
                          const width = `calc(${(spanDays * 100) / days.length}% - 8px)`;

                          return (
	                            <button
	                              key={`${pane.account.id}-${event.id}-span`}
	                              data-event-card-id={event.id}
	                              onClick={(entry) => {
                                entry.stopPropagation();
                                onSelectEvent(event.id);
                              }}
                              onDoubleClick={(entry) => {
                                entry.stopPropagation();
                                onOpenEvent(event.id);
                              }}
                              onMouseEnter={(entry) => onPreviewEvent(entry, event.id)}
                              onMouseMove={(entry) => onPreviewEvent(entry, event.id)}
                              onMouseLeave={() => onHidePreview(event.id)}
                              title={event.title}
                              className={`pointer-events-auto absolute rounded-md border text-left px-2 py-1 text-[11px] font-semibold truncate transition-colors hover:bg-white ${tones.container} ${
                                flashingEventId === event.id ? 'coremail-event-locate-pulse' : ''
                              }`}
                              style={{ left, width, top }}
                            >
                              <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${tones.stripe}`}></div>
                              <div className="pl-2 truncate">
                                {event.title}
                                {spanDays > 1 && <span className="ml-1 text-[10px] text-gray-400">跨{spanDays}天</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div ref={scrollRef} data-timeline-scroll="week" className="flex-1 min-h-0 overflow-y-auto bg-white flex relative">
            <div className="border-r border-gray-200 flex flex-col shrink-0 bg-white" style={{ width: '64px' }}>
              {HOURS.map((hour) => (
                <div key={hour} className={`h-24 border-b relative ${isWorkHour(hour) ? 'border-gray-100 bg-white' : 'border-slate-200 bg-slate-50'}`}>
                  <span className="absolute -top-2.5 right-2 text-xs text-gray-500 font-bold">{hour}:00</span>
                </div>
              ))}
            </div>

            <div
              className={isSplit ? 'flex-1 grid min-w-0 bg-white' : 'flex-1 flex min-w-0 bg-white'}
              style={isSplit ? { gridTemplateColumns: `repeat(${paneData.length}, minmax(${paneMinWidth}px, 1fr))` } : undefined}
            >
              {paneData.map((pane, paneIndex) => (
                <div
                  key={`${pane.account.id}-timeline`}
                  className={`shrink-0 bg-white ${isSplit ? `overflow-hidden ${paneIndex < paneData.length - 1 ? 'border-r border-gray-200' : ''}` : 'border-r border-gray-200'}`}
                  style={isSplit ? { minWidth: `${paneMinWidth}px` } : { flex: 1, minWidth: 0 }}
                >
                  <div className="flex bg-white">
                    {days.map((day, dayIndex) => {
                      const laneId = isSplit ? pane.account.id : null;
                      const preferredAccountId = isSplit ? pane.account.id : null;

                      return (
                        <div
                          key={`${pane.account.id}-${day.date.toISOString()}`}
                          className={`flex-1 border-r border-gray-200 relative ${day.isToday ? 'bg-blue-50/30' : ''}`}
                        >
                          {HOURS.map((hour) => (
                            <div
                              key={`${pane.account.id}-${day.date.toISOString()}-${hour}`}
                              onMouseDown={(entry) => {
                                if (entry.button !== 0) return;
                                onStartSelection({ date: day.date, hour, laneId, preferredAccountId });
                              }}
                              onMouseEnter={() => onHoverSelection({ date: day.date, hour, laneId, preferredAccountId })}
                              onContextMenu={(entry) => onSlotContextMenu(entry, { date: day.date, hour, laneId, preferredAccountId })}
                              onDoubleClick={() => onCreateEvent({ date: day.date, startH: hour, durationH: 1, preferredAccountId })}
                              data-calendar-slot="true"
                              data-slot-date-ms={stripTime(day.date).getTime()}
                              data-slot-hour={hour}
                            className={`h-24 border-b transition-colors cursor-pointer relative group ${
                              isWorkHour(hour) ? 'border-gray-100 bg-white hover:bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                            }`}
                          >
                            {!selection && (
                              <div className="hidden group-hover:flex absolute inset-1 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/60 items-center justify-center">
                                <Plus className="text-blue-500" size={18} />
                              </div>
                            )}
                          </div>
                          ))}

                          {selection && sameDay(selection.date, day.date) && (selection.laneId || null) === laneId && (
                            <div
                              className="absolute rounded-xl border-2 border-blue-400 bg-blue-100/80 shadow-sm pointer-events-none"
                              style={{
                                top: `${getWeekTimeTop(selection.startH)}px`,
                                height: `${getTimeHeight(selection.durationH)}px`,
                                left: '4px',
                                width: 'calc(100% - 8px)',
                                zIndex: 4,
                              }}
                            >
                              <div className="px-2 py-2 text-blue-700">
                                {isSplit ? (
                                  <div className="flex flex-col gap-0.5 leading-tight">
                                    <span className="truncate text-[11px] font-black">新建</span>
                                    <span className="text-[10px] font-semibold whitespace-nowrap">{formatHour(selection.startH)}</span>
                                    <span className="text-[10px] font-semibold whitespace-nowrap">{formatHour(selection.startH + selection.durationH)}</span>
                                  </div>
                                ) : (
                                  <div className="text-[11px] font-black">新建 {formatTimeRange(selection.startH, selection.durationH)}</div>
                                )}
                              </div>
                            </div>
                          )}

                          {pane.timedEvents
                            .filter((event) => event.day === dayIndex)
                            .map((event) => {
                              const calendar = calendarMap[event.calId] || { color: 'bg-gray-500', accountId: 'unknown' };
                              const account = accountMap[calendar.accountId];
                              const colorClass = calendar.color || 'bg-gray-500';
                              const hiddenDetails = isBusyOnlyEvent(event, calendar) || isPrivateLimitedEvent(event, calendar);
                              const displayEvent = hiddenDetails ? { ...event, type: 'busy_only' } : event;
                              const visibleTitle = getVisibleEventTitle(event, calendar);
                              const editable =
                                !event.isAllDay && !hiddenDetails && event.status !== '已取消' && canEditCalendarContent(calendar);
                              const safeStartH = event.startH || WORK_START_HOUR;
                              const safeDuration = event.durationH || 1;
                              const top = getWeekTimeTop(safeStartH);
                              const height = getTimeHeight(safeDuration);
                              const tones = getToneClasses(displayEvent, colorClass);
                              const layout = pane.timedLayout[event.id] || { column: 0, columnCount: 1 };
                              const width = `calc(${100 / layout.columnCount}% - 8px)`;
                              const left = `calc(${(layout.column * 100) / layout.columnCount}% + 4px)`;
                              const isInteracting = interaction?.eventId === event.id;
                              const cardDensity = getTimedEventCardDensity({
                                isSplit,
                                columnCount: layout.columnCount,
                                durationH: safeDuration,
                              });
                              const useCompactCard = cardDensity !== 'regular';
                              const statusBadgeMeta = getEventStatusBadgeMeta(event.status);
                              const statusSurface = getTimedEventStatusSurface(event.status);
                              const compactTimeLabel = `${formatHour(safeStartH)}–${formatHour(safeStartH + safeDuration)}`;

                              return (
	                                <div
	                                  key={event.id}
	                                  data-event-card-id={event.id}
	                                  onMouseDown={(entry) => {
                                    if (!editable || entry.button !== 0) return;
                                    onStartEventMove(entry, event);
                                  }}
                                  onClick={(entry) => {
                                    entry.stopPropagation();
                                    onSelectEvent(event.id);
                                  }}
                                  onDoubleClick={(entry) => {
                                    entry.stopPropagation();
                                    onOpenEvent(event.id);
                                  }}
                                  onContextMenu={(entry) => onContextMenu(entry, event)}
                                  onMouseEnter={(entry) => onPreviewEvent(entry, event.id)}
                                  onMouseMove={(entry) => onPreviewEvent(entry, event.id)}
                                  onMouseLeave={() => onHidePreview(event.id)}
                                  title={`${visibleTitle} · ${formatTimeRange(safeStartH, safeDuration)}`}
                                  className={`group absolute overflow-hidden border ${useCompactCard ? 'rounded-lg shadow-none' : 'rounded-xl shadow-sm'} ${tones.container} ${statusSurface.cardClass} ${
                                    editable ? 'cursor-grab active:cursor-grabbing select-none hover:ring-2 hover:ring-blue-200/80 hover:z-10' : 'cursor-pointer'
                                  } ${isInteracting && interaction?.changed ? 'pointer-events-none ring-2 ring-blue-300 shadow-lg z-20' : useCompactCard ? 'hover:z-10' : 'hover:shadow-md hover:z-10'} ${
                                    flashingEventId === event.id ? 'coremail-event-locate-pulse' : ''
                                  }`}
                                  style={{ top: `${top}px`, height: `${height}px`, left, width, padding: useCompactCard ? '6px' : '8px' }}
                                >
                                  {!hiddenDetails && <div className={`absolute left-0 top-0 bottom-0 w-1 ${tones.stripe}`}></div>}
                                  {statusSurface.topRuleClass && <div className={`pointer-events-none absolute left-1.5 right-1.5 top-1 h-0.5 rounded-full ${statusSurface.topRuleClass}`}></div>}
                                  {statusBadgeMeta && (
                                    <span
                                      className={`pointer-events-none absolute right-1.5 top-1.5 z-[1] inline-flex items-center rounded-full border font-bold ${
                                        useCompactCard
                                          ? `px-1.5 py-0.5 text-[9px] leading-none ${statusBadgeMeta.className}`
                                          : `px-2 py-0.5 text-[10px] leading-none ${statusBadgeMeta.className}`
                                      }`}
                                    >
                                      {useCompactCard ? statusBadgeMeta.compactLabel : statusBadgeMeta.fullLabel}
                                    </span>
                                  )}
                                  {editable && (
                                    <button
                                      type="button"
                                      onMouseDown={(entry) => onStartEventResize(entry, event, 'top')}
                                      onClick={(entry) => entry.stopPropagation()}
                                      className={`absolute left-1/2 top-0.5 z-[2] flex h-6 w-8 -translate-x-1/2 items-start justify-center rounded-full cursor-ns-resize transition-opacity ${
                                        isInteracting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                      }`}
                                      aria-label="调整开始时间"
                                    >
                                      <span className="mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm"></span>
                                    </button>
                                  )}
                                  {hiddenDetails ? (
                                    <div className="font-bold flex items-center h-full justify-center opacity-60">
                                      <Lock size={14} className="mr-1" />
                                      {visibleTitle}
                                    </div>
                                  ) : (
                                    <div className={`flex flex-col h-full min-w-0 ${statusBadgeMeta ? 'pr-9' : ''} pl-1`}>
                                      {showAccountLabel && !useCompactCard && account && <div className="text-[10px] font-black opacity-60 truncate">{account.email || account.name}</div>}
                                      <div
                                        className={`mb-1 min-w-0 font-bold leading-tight ${event.status === '已取消' ? 'line-through' : ''} ${
                                          useCompactCard ? 'truncate text-[11px]' : 'text-[12px]'
                                        }`}
                                        style={useCompactCard ? undefined : clampLinesStyle(2)}
                                      >
                                        {visibleTitle}
                                      </div>
                                      {useCompactCard ? (
                                        <div className="mb-1 min-w-0 truncate text-[11px] font-semibold leading-tight opacity-80">
                                          {compactTimeLabel}
                                        </div>
                                      ) : (
                                        <div className="mb-1 flex items-center text-xs font-semibold opacity-75">
                                          <Clock size={10} className="mr-1" />
                                          {formatTimeRange(safeStartH, safeDuration)}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  {editable && (
                                    <button
                                      type="button"
                                      onMouseDown={(entry) => onStartEventResize(entry, event, 'bottom')}
                                      onClick={(entry) => entry.stopPropagation()}
                                      className={`absolute bottom-0.5 left-1/2 z-[2] flex h-6 w-8 -translate-x-1/2 items-end justify-center rounded-full cursor-ns-resize transition-opacity ${
                                        isInteracting && interaction?.type === 'resize' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                      }`}
                                      aria-label="调整时长"
                                    >
                                      <span className="mb-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm"></span>
                                    </button>
                                  )}
                                </div>
                              );
                            })}

                          {day.isToday && (
                            <div className="absolute left-0 right-0 pointer-events-none" style={{ top: `${getWeekTimeTop(getCurrentTimeHour())}px`, zIndex: 15 }}>
                              <div className="absolute left-0 w-2 h-2 rounded-full bg-red-500 -mt-1 -ml-1"></div>
                              <div className="border-t-2 border-red-500 w-full relative"></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DayView({
  focusDate,
  events,
  activeAccounts,
  accountDisplayMode,
  splitAccounts,
  accountMap,
  calendarMap,
  onSelectEvent,
  onOpenEvent,
  onCreateEvent,
  onContextMenu,
  selection,
  onStartSelection,
  onHoverSelection,
  onSlotContextMenu,
  interaction,
  onStartEventMove,
  onStartEventResize,
  onPreviewEvent,
  onHidePreview,
  onHideAccount,
  scrollRef,
  scrollToWorkStartToken,
  showHuaweiWorkdayBadges = false,
  flashingEventId = null,
}) {
  const lanes =
    accountDisplayMode === 'split' && splitAccounts.length > 0
      ? splitAccounts
      : [
          {
            id: 'overlay',
            name: activeAccounts.length > 1 ? '叠加视图' : activeAccounts[0]?.name || '当前账户',
            email:
              activeAccounts.length > 1
                ? `${activeAccounts.length} 个账户叠加显示`
                : activeAccounts[0]?.email || '',
            color: 'bg-slate-700',
          },
        ];
  const isSplit = accountDisplayMode === 'split' && lanes[0]?.id !== 'overlay';
  const allDayEvents = sortEvents(events.filter((event) => event.isAllDay));
  const timedEvents = sortEvents(events.filter((event) => !event.isAllDay));
  const dayPaneMinWidth = isSplit ? (lanes.length >= 3 ? 280 : 320) : 0;
  const splitGridStyle = isSplit ? { gridTemplateColumns: `repeat(${lanes.length}, minmax(${dayPaneMinWidth}px, 1fr))` } : undefined;
  const timedEventLayouts = useMemo(
    () =>
      Object.fromEntries(
        lanes.map((lane) => [
          lane.id,
          buildTimedEventLayout(isSplit ? timedEvents.filter((event) => calendarMap[event.calId]?.accountId === lane.id) : timedEvents),
        ]),
      ),
    [calendarMap, isSplit, lanes, timedEvents],
  );
  const showOverlayAccountLabel = !isSplit && activeAccounts.length > 1;

  useLayoutEffect(() => {
    const target = scrollRef?.current;
    if (!target) return;

    const scrollTop = getWorkdayScrollTop(TIMELINE_HEADER_HEIGHT);
    const timeoutIds = [0, 80, 180, 320].map((delay) =>
      window.setTimeout(() => {
        if (target.isConnected) scrollElementToTop(target, scrollTop);
      }, delay),
    );
    const frameIds = [];
    frameIds.push(
      window.requestAnimationFrame(() => {
        if (target.isConnected) scrollElementToTop(target, scrollTop);
        frameIds.push(
          window.requestAnimationFrame(() => {
            if (target.isConnected) scrollElementToTop(target, scrollTop);
          }),
        );
      }),
    );

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
    };
  }, [scrollRef, scrollToWorkStartToken]);

  return (
    <div className="flex flex-1 flex-col min-w-0 min-h-0 bg-white relative overflow-hidden">
      <div className="flex-1 min-h-0 overflow-x-auto">
        <div className="flex min-h-full min-w-full flex-col" style={isSplit ? { minWidth: `${64 + lanes.length * dayPaneMinWidth}px` } : undefined}>
          <div className="sticky top-0 z-30 shrink-0 border-b border-gray-200 bg-white">
            <div className="flex border-b border-gray-200 bg-white">
              <div className="border-r border-gray-200 shrink-0 bg-white" style={{ width: '64px', height: `${TIMELINE_HEADER_HEIGHT}px` }}></div>
              <div className={isSplit ? 'flex-1 grid min-w-0 bg-white' : 'flex-1 flex bg-white min-w-0'} style={splitGridStyle}>
                {lanes.map((lane) => (
                  <div
                    key={`${lane.id}-date-header`}
                    className={`${isSplit ? 'shrink-0' : 'flex-1'} border-r border-gray-200 min-w-0`}
                    style={isSplit ? { minWidth: `${dayPaneMinWidth}px` } : { flex: 1, minWidth: 0 }}
                  >
                    <div
                      className={`flex h-14 items-center px-4 ${
                        showHuaweiWorkdayBadges && isHuaweiMakeupWorkday(focusDate)
                          ? 'bg-amber-50/70'
                          : isWeekendDate(focusDate)
                            ? 'bg-slate-50/70'
                            : 'bg-[#fcfcfb]'
                      }`}
                    >
                      <div className="flex min-w-0 items-center justify-between gap-3 w-full">
                        <div className="min-w-0 flex items-center gap-2">
                          {isSplit && <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${lane.color}`}></div>}
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-gray-500">{isSplit ? (lane.email || lane.name) : sameDay(focusDate, TODAY_DATE) ? '今日' : '所选日期'}</div>
                            <div className="inline-flex items-center gap-1 text-lg font-black text-gray-900">
                              {isSplit ? `${focusDate.getMonth() + 1}月${focusDate.getDate()}日` : `${focusDate.getDate()}日`}
                              {showHuaweiWorkdayBadges && isHuaweiMakeupWorkday(focusDate) && (
                                <span className="rounded-full bg-white/80 px-1 text-[9px] font-bold leading-4 text-red-500">班</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {isSplit && (
                          <button
                            type="button"
                            onClick={() => onHideAccount?.(lane.id)}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-white hover:text-gray-700"
                            title={`隐藏 ${lane.email || lane.name}`}
                            aria-label={`隐藏 ${lane.email || lane.name}`}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex bg-white">
              <div className="border-r border-gray-200 flex items-center justify-center bg-white shrink-0" style={{ width: '64px' }}>
                <span className="text-xs font-bold text-gray-400">全天</span>
              </div>
              <div className={isSplit ? 'flex-1 grid min-w-0 bg-white' : 'flex-1 flex bg-white min-w-0'} style={splitGridStyle}>
                {lanes.map((lane) => (
                  <div
                    key={lane.id}
                    className={`${isSplit ? 'shrink-0' : 'flex-1'} border-r border-gray-200 min-h-[64px] relative`}
                    style={isSplit ? { minWidth: `${dayPaneMinWidth}px` } : { flex: 1, minWidth: 0 }}
                  >
                    <div className="p-2 space-y-2">
                      {allDayEvents
                        .filter((event) => lane.id === 'overlay' || calendarMap[event.calId]?.accountId === lane.id)
                        .map((event) => {
                          const calendar = calendarMap[event.calId] || { color: 'bg-gray-500', accountId: 'unknown' };
                          const account = accountMap[calendar.accountId];
                          return (
	                            <button
	                              key={event.id}
	                              data-event-card-id={event.id}
	                              onClick={(entry) => {
                                entry.stopPropagation();
                                onSelectEvent(event.id);
                              }}
                              onDoubleClick={(entry) => {
                                entry.stopPropagation();
                                onOpenEvent(event.id);
                              }}
                              onMouseEnter={(entry) => onPreviewEvent(entry, event.id)}
                              onMouseMove={(entry) => onPreviewEvent(entry, event.id)}
                              onMouseLeave={() => onHidePreview(event.id)}
                              title={`${event.title}${account ? ` · ${account.name}` : ''}`}
                              className={`w-full text-left rounded-xl border px-3 py-2 bg-gray-50 hover:bg-white ${
                                flashingEventId === event.id ? 'coremail-event-locate-pulse' : ''
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`w-2 h-2 rounded-full mr-2 ${calendar.color}`}></div>
                                <div className="min-w-0">
                                  {showOverlayAccountLabel && account && (
                                    <div className="mb-0.5 text-[10px] font-black text-gray-400 truncate">{account.name}</div>
                                  )}
                                  <span className="block text-xs font-bold text-gray-800 truncate">{event.title}</span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      {allDayEvents.filter((event) => lane.id === 'overlay' || calendarMap[event.calId]?.accountId === lane.id).length === 0 && (
                        <div className="text-xs text-gray-400 px-2 py-1">无全天事件</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

		          <div ref={scrollRef} data-timeline-scroll="day" className="flex-1 min-h-0 overflow-y-auto bg-white flex relative">
            <div className="border-r border-gray-200 flex flex-col shrink-0 bg-white" style={{ width: '64px' }}>
              {HOURS.map((hour) => (
                <div key={hour} className={`h-24 border-b relative ${isWorkHour(hour) ? 'border-gray-100 bg-white' : 'border-slate-200 bg-slate-50'}`}>
                  <span className="absolute -top-2.5 right-2 text-xs text-gray-500 font-bold">{hour}:00</span>
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className={isSplit ? 'grid bg-white min-w-full' : 'flex bg-white min-w-full'} style={splitGridStyle}>
                {lanes.map((lane) => (
	                  <div
                      key={lane.id}
                      className={`${isSplit ? 'shrink-0' : 'flex-1'} border-r border-gray-200 relative min-w-0`}
                      style={isSplit ? { minWidth: `${dayPaneMinWidth}px` } : { flex: 1, minWidth: 0 }}
                    >
                    {HOURS.map((hour) => (
                      (() => {
                        const preferredAccountId = lane.id !== 'overlay' ? lane.id : null;
                        return (
                          <div
                            key={`${lane.id}-${hour}`}
                            onMouseDown={(entry) => {
                              if (entry.button !== 0) return;
                              onStartSelection({ date: focusDate, hour, laneId: lane.id, preferredAccountId });
                            }}
                            onMouseEnter={() => onHoverSelection({ date: focusDate, hour, laneId: lane.id, preferredAccountId })}
                            onContextMenu={(entry) => onSlotContextMenu(entry, { date: focusDate, hour, laneId: lane.id, preferredAccountId })}
                            onDoubleClick={() => onCreateEvent({ date: focusDate, startH: hour, durationH: 1, preferredAccountId })}
                            data-calendar-slot="true"
                            data-slot-date-ms={stripTime(focusDate).getTime()}
                            data-slot-hour={hour}
                            className={`h-24 border-b transition-colors cursor-pointer relative group ${
                              isWorkHour(hour) ? 'border-gray-100 bg-white hover:bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                            }`}
                          >
                            {!selection && (
                              <div className="hidden group-hover:flex absolute inset-1 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 bg-opacity-60 items-center justify-center">
                                <Plus className="text-blue-500" size={18} />
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ))}
                    {selection && sameDay(selection.date, focusDate) && (selection.laneId || null) === lane.id && (
                      <div
                        className="absolute rounded-xl border-2 border-blue-400 bg-blue-100/80 shadow-sm pointer-events-none"
                        style={{
                          top: `${getTimeTop(selection.startH)}px`,
                          height: `${getTimeHeight(selection.durationH)}px`,
                          left: '8px',
                          width: 'calc(100% - 16px)',
                          zIndex: 4,
                        }}
                      >
                        <div className="px-3 py-2 text-[11px] font-black text-blue-700">
                          新建 {formatTimeRange(selection.startH, selection.durationH)}
                        </div>
                      </div>
                    )}
                    {timedEvents
                      .filter((event) => lane.id === 'overlay' || calendarMap[event.calId]?.accountId === lane.id)
                      .map((event) => {
                        const calendar = calendarMap[event.calId] || { color: 'bg-gray-500', accountId: 'unknown' };
                        const account = accountMap[calendar.accountId];
                        const hiddenDetails = isBusyOnlyEvent(event, calendar) || isPrivateLimitedEvent(event, calendar);
                        const displayEvent = hiddenDetails ? { ...event, type: 'busy_only' } : event;
                        const visibleTitle = getVisibleEventTitle(event, calendar);
                        const editable =
                          !event.isAllDay && !hiddenDetails && event.status !== '已取消' && canEditCalendarContent(calendar);
                        const safeStartH = event.startH || WORK_START_HOUR;
                        const safeDuration = event.durationH || 1;
                        const top = getTimeTop(safeStartH);
                        const height = getTimeHeight(safeDuration);
                        const tones = getToneClasses(displayEvent, calendar.color || 'bg-gray-500');
                        const layout = timedEventLayouts[lane.id]?.[event.id] || { column: 0, columnCount: 1 };
                        const width = `calc(${100 / layout.columnCount}% - 12px)`;
                        const left = `calc(${(layout.column / layout.columnCount) * 100}% + 8px)`;
                        const isInteracting = interaction?.eventId === event.id;
                        const cardDensity = getTimedEventCardDensity({
                          columnCount: layout.columnCount,
                          durationH: safeDuration,
                        });
                        const useCompactCard = cardDensity !== 'regular';
                        const statusBadgeMeta = getEventStatusBadgeMeta(event.status);
                        const statusSurface = getTimedEventStatusSurface(event.status);
                        const compactTimeLabel = `${formatHour(safeStartH)}–${formatHour(safeStartH + safeDuration)}`;
                              return (
	                          <div
	                            key={event.id}
	                            data-event-card-id={event.id}
	                            onMouseDown={(entry) => {
                              if (!editable || entry.button !== 0) return;
                              onStartEventMove(entry, event);
                            }}
                            onClick={(entry) => {
                              entry.stopPropagation();
                              onSelectEvent(event.id);
                            }}
                            onDoubleClick={(entry) => {
                              entry.stopPropagation();
                              onOpenEvent(event.id);
                            }}
                            onContextMenu={(entry) => onContextMenu(entry, event)}
                            onMouseEnter={(entry) => onPreviewEvent(entry, event.id)}
                            onMouseMove={(entry) => onPreviewEvent(entry, event.id)}
                            onMouseLeave={() => onHidePreview(event.id)}
                            title={`${visibleTitle} · ${formatTimeRange(safeStartH, safeDuration)}${event.location && !hiddenDetails ? ` · ${event.location}` : ''}`}
                            className={`group absolute overflow-hidden border ${useCompactCard ? 'rounded-lg p-2.5 shadow-none' : 'rounded-xl p-3 shadow-sm'} ${tones.container} ${statusSurface.cardClass} ${
                              editable ? 'cursor-grab active:cursor-grabbing select-none hover:ring-2 hover:ring-blue-200/80 hover:z-10' : 'cursor-pointer'
                            } ${isInteracting && interaction?.changed ? 'pointer-events-none ring-2 ring-blue-300 shadow-lg z-20' : useCompactCard ? 'hover:z-10' : 'hover:shadow-md'} ${
                              flashingEventId === event.id ? 'coremail-event-locate-pulse' : ''
                            }`}
                            style={{ top: `${top}px`, height: `${height}px`, left, width }}
                          >
                            {!hiddenDetails && <div className={`absolute left-0 top-0 bottom-0 w-1 ${useCompactCard ? '' : 'rounded-l-xl'} ${tones.stripe}`}></div>}
                            {statusSurface.topRuleClass && <div className={`pointer-events-none absolute left-2 right-2 top-1 h-0.5 rounded-full ${statusSurface.topRuleClass}`}></div>}
                            {statusBadgeMeta && (
                              <span
                                className={`pointer-events-none absolute right-1.5 top-1.5 z-[1] inline-flex items-center rounded-full border font-bold ${
                                  useCompactCard
                                    ? `px-1.5 py-0.5 text-[9px] leading-none ${statusBadgeMeta.className}`
                                    : `px-2 py-0.5 text-[10px] leading-none ${statusBadgeMeta.className}`
                                }`}
                              >
                                {useCompactCard ? statusBadgeMeta.compactLabel : statusBadgeMeta.fullLabel}
                              </span>
                            )}
                            {editable && (
                              <button
                                type="button"
                                onMouseDown={(entry) => onStartEventResize(entry, event, 'top')}
                                onClick={(entry) => entry.stopPropagation()}
                                className={`absolute left-1/2 top-0.5 z-[2] flex h-6 w-8 -translate-x-1/2 items-start justify-center rounded-full cursor-ns-resize transition-opacity ${
                                  isInteracting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}
                                aria-label="调整开始时间"
                              >
                                <span className="mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm"></span>
                              </button>
                            )}
                            {hiddenDetails ? (
                              <div className="font-bold flex items-center h-full justify-center opacity-60">
                                <Lock size={14} className="mr-1" />
                                {visibleTitle}
                              </div>
                            ) : (
                              <div className={`flex flex-col h-full ${useCompactCard ? 'pl-1.5' : 'pl-2'} ${statusBadgeMeta ? 'pr-9' : ''}`}>
                                {account && !useCompactCard && <div className="text-[10px] font-black opacity-60 truncate">{account.name}</div>}
                                <div
                                  className={`mb-1 min-w-0 font-bold leading-tight ${event.status === '已取消' ? 'line-through' : ''} ${
                                    useCompactCard ? 'truncate text-[11px]' : 'text-sm'
                                  }`}
                                  style={useCompactCard ? undefined : clampLinesStyle(2)}
                                >
                                  {visibleTitle}
                                </div>
                                {useCompactCard ? (
                                  <div className="mb-1 min-w-0 truncate text-[11px] font-semibold leading-tight opacity-80">
                                    {compactTimeLabel}
                                  </div>
                                ) : (
                                  <div className="mb-1 flex items-center text-xs font-semibold opacity-75">
                                    <Clock size={10} className="mr-1" />
                                    {formatTimeRange(safeStartH, safeDuration)}
                                  </div>
                                )}
                                {event.location && !useCompactCard && <div className="text-xs opacity-70 truncate">{event.location}</div>}
                              </div>
                            )}
                                  {editable && (
                                    <button
                                      type="button"
                                      onMouseDown={(entry) => onStartEventResize(entry, event, 'bottom')}
                                      onClick={(entry) => entry.stopPropagation()}
                                      className={`absolute bottom-0.5 left-1/2 z-[2] flex h-6 w-8 -translate-x-1/2 items-end justify-center rounded-full cursor-ns-resize transition-opacity ${
                                        isInteracting && interaction?.type === 'resize' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                      }`}
                                      aria-label="调整时长"
                                    >
                                      <span className="mb-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm"></span>
                                    </button>
                                  )}
                                </div>
                              );
                      })}
                    {sameDay(focusDate, TODAY_DATE) && (
                      <div className="pointer-events-none absolute left-0 right-0" style={{ top: `${getTimeTop(getCurrentTimeHour())}px`, zIndex: 15 }}>
                        <div className="absolute -left-1 -mt-1 h-2 w-2 rounded-full bg-red-500"></div>
                        <div className="w-full border-t-2 border-red-500"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MonthView({
  focusDate,
  events,
  accountDisplayMode,
  splitAccounts,
  calendarMap,
  accountMap,
  showHuaweiWorkdayBadges = false,
  onSelectEvent,
  onOpenEvent,
  onSelectDate,
  onQuickCreate,
  onSlotContextMenu,
  showAccountLabel,
  onPreviewEvent,
  onHidePreview,
  onHideAccount,
  flashingEventId = null,
}) {
  const monthCells = buildMiniMonthCells(focusDate);
  const monthWeekdayStickyTop = 0;
  const monthAccounts =
    accountDisplayMode === 'split' && splitAccounts.length > 0
      ? splitAccounts
      : [];
  const isSplit = accountDisplayMode === 'split' && monthAccounts.length > 0;
  const monthPaneMinWidth = monthAccounts.length >= 4 ? 320 : monthAccounts.length === 3 ? 360 : 420;
  const monthSplitMinWidth = monthAccounts.length > 0 ? monthAccounts.length * monthPaneMinWidth + Math.max(monthAccounts.length - 1, 0) * 16 : 0;
  const renderMonthWeekdayHeader = (paneKey = 'overlay', stickyTop = 0) => (
    <div
      className="sticky z-20 grid grid-cols-7 gap-px border-b border-slate-200 bg-slate-200"
      style={{ top: `${stickyTop}px` }}
    >
      {MONTH_WEEKDAY_NAMES.map((day) => (
        <div
          key={`${paneKey}-${day}`}
          className="flex h-12 items-center justify-center bg-[#fcfcfb] text-xs font-black text-slate-500"
        >
          {day}
        </div>
      ))}
    </div>
  );
  const renderMonthCells = (panelEvents, preferredAccountId = null, paneKey = 'overlay', options = {}) => (
    <div className="grid grid-cols-7 gap-px bg-slate-200">
      {monthCells.map((cell) => {
        const dayEvents = sortEvents(panelEvents.filter((event) => sameDay(eventToDate(event), cell.date)));
        const isSelectedDate = sameDay(cell.date, focusDate);
        const isHuaweiWorkday = showHuaweiWorkdayBadges && cell.isCurrentMonth && isHuaweiMakeupWorkday(cell.date);
        const isWeekend = isWeekendDate(cell.date);
        const cellSurface = !cell.isCurrentMonth
          ? 'bg-slate-50 text-slate-300'
          : isHuaweiWorkday
            ? 'bg-amber-50/70 hover:bg-amber-50'
            : isWeekend
              ? 'bg-slate-50/80 hover:bg-blue-50/40'
              : 'bg-white hover:bg-blue-50/40';
        const showQuickCreate = cell.isCurrentMonth && isSelectedDate;
        const maxVisibleEvents = options.groupBySource ? 4 : 3;

        return (
          <div
            key={`${paneKey}-${cell.key}`}
            onClick={() => onSelectDate(cell.date)}
            onContextMenu={(event) => onSlotContextMenu(event, { date: cell.date, hour: 10, preferredAccountId })}
            className={`group relative flex min-h-[164px] cursor-pointer flex-col p-3 transition-colors ${cellSurface}`}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectDate(cell.date);
                  }}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black transition ${
                    cell.isToday
                      ? 'bg-blue-600 text-white'
                      : isSelectedDate
                        ? 'border border-blue-500 bg-blue-50 text-blue-700'
                        : cell.isCurrentMonth
                          ? 'text-slate-800 hover:bg-slate-100'
                          : 'text-slate-300'
                  }`}
                >
                  {cell.date.getDate()}
                </button>
                {isHuaweiWorkday && (
                  <span className="inline-flex h-5 items-center rounded-full border border-red-100 bg-white/80 px-1.5 text-[10px] font-bold leading-none text-red-500">
                    班
                  </span>
                )}
              </div>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onQuickCreate({ date: cell.date, h: 10, preferredAccountId });
                }}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-slate-400 transition ${
                  cell.isCurrentMonth
                    ? showQuickCreate
                      ? 'border-blue-200 bg-blue-50 text-blue-600 opacity-100'
                      : 'border-slate-200 bg-white opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-focus-within:opacity-100 group-focus-within:pointer-events-auto'
                    : 'pointer-events-none opacity-0'
                }`}
                title="新建日程"
                aria-label={`在 ${formatDateLabel(cell.date)} 新建日程`}
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="space-y-0.5">
              {dayEvents.slice(0, maxVisibleEvents).map((event) => {
                const calendar = calendarMap[event.calId] || { color: 'bg-gray-500', accountId: 'unknown' };
                const account = accountMap[calendar.accountId];
                const hiddenDetails = isBusyOnlyEvent(event, calendar) || isPrivateLimitedEvent(event, calendar);
                const displayEvent = hiddenDetails ? { ...event, type: 'busy_only' } : event;
                const tones = getToneClasses(displayEvent, calendar.color || 'bg-gray-500');
                const visibleTitle = getVisibleEventTitle(event, calendar);
                const sourceLabel = options.groupBySource ? getCompactSourceLabel(account, calendar) : '';

                return (
	                  <button
	                    key={event.id}
	                    data-event-card-id={event.id}
	                    onClick={(entry) => {
                      entry.stopPropagation();
                      onSelectEvent(event.id);
                    }}
                    onDoubleClick={(entry) => {
                      entry.stopPropagation();
                      onOpenEvent(event.id);
                    }}
                    onMouseEnter={(entry) => onPreviewEvent(entry, event.id)}
                    onMouseMove={(entry) => onPreviewEvent(entry, event.id)}
                    onMouseLeave={() => onHidePreview(event.id)}
                    title={visibleTitle}
                    className={`w-full rounded border px-1.5 py-1 text-left text-[11px] leading-tight ${tones.container} ${
                      flashingEventId === event.id ? 'coremail-event-locate-pulse' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1 min-w-0 overflow-hidden">
                      <div className={`shrink-0 rounded-sm ${tones.stripe}`} style={{ width: '3px', height: '3px' }}></div>
                      {sourceLabel && (
                        <span className="shrink-0 rounded bg-white/70 px-1 text-[9px] font-bold text-gray-500">
                          {sourceLabel}
                        </span>
                      )}
                      {event.isAllDay ? (
                        <span className={`truncate font-medium ${event.status === '已取消' ? 'line-through' : ''}`}>{visibleTitle}</span>
                      ) : (
                        <>
                          <span className="shrink-0 font-semibold text-gray-500" style={{ fontSize: '10px' }}>{formatHour(event.startH || 8)}</span>
                          <span className={`truncate font-medium min-w-0 ${event.status === '已取消' ? 'line-through' : ''}`}>{visibleTitle}</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
              {dayEvents.length > maxVisibleEvents && (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectDate(cell.date);
                  }}
                  className="text-[11px] font-bold text-blue-600 pl-1"
                >
                  +{dayEvents.length - maxVisibleEvents} 更多
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
  const renderMonthGrid = (panelEvents, preferredAccountId = null, paneKey = 'overlay', stickyTop = 0, options = {}) => (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white" style={{ minWidth: '100%' }}>
      {renderMonthWeekdayHeader(paneKey, stickyTop)}
      {renderMonthCells(panelEvents, preferredAccountId, paneKey, options)}
    </div>
  );

  if (isSplit) {
    return (
      <div className="flex-1 min-h-0 overflow-auto bg-gray-50 p-4 md:p-6">
        <div className="space-y-3">
          {renderMonthGrid(events, null, 'month-source-grouped', monthWeekdayStickyTop, { groupBySource: true })}
        </div>
      </div>
    );
  }

  return <div className="flex-1 min-h-0 overflow-auto bg-gray-50 p-4 md:p-6">{renderMonthGrid(events, null, 'overlay', 0)}</div>;
}

function EventPreviewCard({
  event,
  calendar,
  account,
  x,
  y,
  mode = 'hover',
  label = '',
  onMouseEnter,
  onMouseLeave,
  onOpenEvent,
  onJoinEvent,
}) {
  if (!event) return null;

  const isBusyOnly = event.type === 'busy_only';
  const isCancelled = event.status === '已取消';
  const title = isBusyOnly ? '忙碌' : event.title || '无标题';
  const organizer = !isBusyOnly ? event.organizer || account?.name || '' : '';
  const isRecurring = !isBusyOnly && event.repeat && event.repeat !== 'does_not_repeat';
  const joinable = !isBusyOnly && canJoinCalendarEvent(event);

  return (
    <div
      className="pointer-events-none fixed z-[70] w-80 max-w-[calc(100vw-32px)]"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      <div
        className="pointer-events-auto overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="border-b border-slate-100 px-4 py-3">
          {mode === 'drag' && label && (
            <div className="mb-2 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700">
              {label}
            </div>
          )}
          <div className="flex min-w-0 items-start gap-2">
            <div className={`min-w-0 flex-1 text-sm font-black leading-snug ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {title}
            </div>
            {isRecurring && (
              <span
                className="group/recurrence relative mt-0.5 inline-flex shrink-0 text-slate-400"
                title={`循环：${REPEAT_LABELS[event.repeat] || '重复'}`}
              >
                <RefreshCw size={14} aria-label="循环会议" />
                <span className="pointer-events-none absolute right-0 top-6 z-10 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 opacity-0 shadow-md transition group-hover/recurrence:opacity-100">
                  循环：{REPEAT_LABELS[event.repeat] || '重复'}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2.5 px-4 py-3 text-xs text-gray-600">
          {organizer && (
            <div className="flex min-w-0 items-center">
              <Users size={13} className="mr-2 shrink-0 text-slate-400" />
              <span className="truncate">组织者：{organizer}</span>
            </div>
          )}

          <div className="flex min-w-0 items-center font-bold text-gray-800">
            <Clock size={13} className="mr-2 shrink-0 text-blue-600" />
            {formatEventDateTime(event)}
          </div>

          {event.location && !isBusyOnly && (
            <div className="flex min-w-0 items-center">
              <MapPin size={13} className="mr-2 shrink-0 text-emerald-600" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {mode === 'drag' && (
            <div className="rounded-xl bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-700">
              松手即可应用新的时间安排
            </div>
          )}
        </div>

        {mode === 'hover' && !isBusyOnly && (
          <div className="flex gap-2 border-t border-slate-100 px-4 py-3">
            <button
              type="button"
              onClick={(entry) => {
                entry.stopPropagation();
                onOpenEvent?.(event.id);
              }}
              className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
            >
              查看详情
            </button>
            {joinable && (
              <button
                type="button"
                onClick={(entry) => {
                  entry.stopPropagation();
                  onJoinEvent?.(event);
                }}
                className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-blue-600 px-3 text-xs font-bold text-white transition hover:bg-blue-700"
              >
                加入会议
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarEventSidebar({
  event,
  calendar,
  account,
  onBackToAgenda,
  onDeleteEvent,
  onRespond,
}) {
  const organizerLabel = event.organizer || account?.name || '我';
  const attendeeList = Array.from(new Set([...(event.attendees || []), ...(event.optionalAttendees || [])])).filter(
    (person) => person && person !== organizerLabel && person !== event.organizer,
  );
  const participantPreview = attendeeList.slice(0, 4);
  const hiddenParticipantCount = Math.max(attendeeList.length - participantPreview.length, 0);
  const locationLabel =
    event.location || (event.meetingProvider && event.meetingProvider !== 'none' ? MEETING_PROVIDER_LABELS[event.meetingProvider] : '未填写地点');
  const sourceLabel = calendar?.name || account?.email || account?.name || '日历';
  const statusLabel = event.status && event.status !== '已接受' ? event.status : null;

  return (
    <aside
      className="relative z-10 hidden shrink-0 border-l border-slate-200 bg-[#fcfcfb] lg:flex lg:flex-col"
      style={{ width: 'clamp(288px, 24vw, 352px)', zIndex: 20 }}
    >
      <div className="flex h-16 items-center justify-end border-b border-slate-200 bg-[#fcfcfb] px-5">
        <button
          onClick={onBackToAgenda}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          title="关闭侧栏"
          aria-label="关闭侧栏"
        >
          <X size={16} />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[#f8f8f7] p-4">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-500">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${calendar?.color || 'bg-slate-400'}`}></span>
            <span className="truncate">{sourceLabel}</span>
            {statusLabel && (
              <span className={`ml-auto shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${getAgendaStatusTone(statusLabel)}`}>
                {statusLabel}
              </span>
            )}
          </div>

          <div className="text-xl font-black leading-tight text-slate-900" style={clampLinesStyle(3)}>
            {event.title || '无标题'}
          </div>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50 text-sm">
            <div className="flex gap-3 px-3 py-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-blue-500" />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-400">时间</div>
                <div className="font-bold text-slate-900">{formatAgendaEventLabel(event)}</div>
              </div>
            </div>
            <div className="flex gap-3 px-3 py-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-emerald-500" />
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-slate-400">地点</div>
                <div className="truncate font-semibold text-slate-800">{locationLabel}</div>
              </div>
            </div>
            <div className="flex gap-3 px-3 py-3">
              <Users size={16} className="mt-0.5 shrink-0 text-slate-400" />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-slate-400">人员</div>
                <div className="mt-1 flex min-w-0 flex-wrap items-center gap-1.5">
                  <span className="rounded-md bg-white px-2 py-1 font-semibold text-slate-900 ring-1 ring-slate-200">
                    {organizerLabel}
                    <span className="ml-1 text-[11px] font-semibold text-blue-600">组织者</span>
                  </span>
                  {participantPreview.map((person) => (
                    <span key={person} className="max-w-full truncate rounded-md bg-white px-2 py-1 font-medium text-slate-700 ring-1 ring-slate-200">
                      {person}
                    </span>
                  ))}
                  {hiddenParticipantCount > 0 && (
                    <span className="rounded-md bg-white px-2 py-1 font-medium text-slate-500 ring-1 ring-slate-200">
                      +{hiddenParticipantCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {event.description && (
            <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <AlignLeft size={14} />
                日程说明
              </div>
              <div className="text-sm leading-6 text-slate-700" style={clampLinesStyle(4)}>
                {event.description}
              </div>
            </div>
          )}

          {event.status === '待响应' && (
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onRespond(event.id, 'reject')}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                拒绝
              </button>
              <button
                onClick={() => onRespond(event.id, 'accept')}
                className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                接受
              </button>
            </div>
          )}

          <button
            onClick={() => onDeleteEvent(event.id)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            <Trash size={15} />
            删除日程
          </button>
        </div>
      </div>
    </aside>
  );
}

function PermissionDropdown({ value, onChange, className = '' }) {
  const [open, setOpen] = useState(false);
  const [menuRect, setMenuRect] = useState(null);
  const triggerRef = useRef(null);
  const selected = getCalendarPermissionOption(value);

  const syncMenuRect = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const menuHeight = Math.min(240, CALENDAR_PERMISSION_OPTIONS.length * 68);
    const spaceBelow = window.innerHeight - rect.bottom;
    const openAbove = spaceBelow < menuHeight + 16 && rect.top > menuHeight + 16;

    const menuWidth = Math.max(rect.width, 300);
    const left = Math.min(Math.max(12, rect.left), Math.max(12, window.innerWidth - menuWidth - 12));

    setMenuRect({
      left,
      top: openAbove ? Math.max(12, rect.top - menuHeight - 6) : rect.bottom + 6,
      width: menuWidth,
      maxHeight: openAbove ? Math.max(180, rect.top - 20) : Math.max(180, window.innerHeight - rect.bottom - 18),
    });
  };

  useLayoutEffect(() => {
    if (!open) return undefined;

    syncMenuRect();
    const close = (event) => {
      if (triggerRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    const onFrameChange = () => syncMenuRect();

    window.addEventListener('mousedown', close);
    window.addEventListener('resize', onFrameChange);
    window.addEventListener('scroll', onFrameChange, true);
    return () => {
      window.removeEventListener('mousedown', close);
      window.removeEventListener('resize', onFrameChange);
      window.removeEventListener('scroll', onFrameChange, true);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          window.requestAnimationFrame(syncMenuRect);
        }}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-left outline-none transition hover:bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      >
        <span className="min-w-0">
          <span className="block truncate whitespace-nowrap text-sm font-black text-slate-900">{selected.label}</span>
        </span>
        <ChevronDown size={15} className="shrink-0 text-slate-500" />
      </button>
      {open &&
        menuRect &&
        createPortal(
          <div
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
            style={{
              position: 'fixed',
              left: menuRect.left,
              top: menuRect.top,
              width: menuRect.width,
              maxHeight: menuRect.maxHeight,
              zIndex: 9999,
            }}
          >
            <div className="overflow-y-auto" style={{ maxHeight: menuRect.maxHeight }}>
              {CALENDAR_PERMISSION_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onChange?.(option.id);
                    setOpen(false);
                  }}
                  className={`flex w-full flex-col px-3 py-2.5 text-left transition ${
                    selected.id === option.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm font-black text-slate-900">{option.label}</span>
                  <span className="mt-0.5 text-xs font-medium leading-snug text-slate-500">{option.desc}</span>
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function PermissionBadge({ permission }) {
  const option = getCalendarPermissionOption(permission);

  return (
    <span className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-900">
      {option.label}
    </span>
  );
}

function ShareStatusBadge({ status }) {
  const accepted = status === 'accepted';

  return (
    <span
      className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-bold ${
        accepted ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {accepted ? '已生效' : '待接受'}
    </span>
  );
}

function ShareMemberComposer({ existingShares = [], onAdd }) {
  const [memberInput, setMemberInput] = useState('');
  const [permissionId, setPermissionId] = useState('all_details');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const suggestions = useMemo(() => getShareContactSuggestions(memberInput, existingShares), [memberInput, existingShares]);
  const resolvedMember = useMemo(() => resolveKnownShareMember(memberInput, selectedMember), [memberInput, selectedMember]);

  const addMember = () => {
    const member = resolveKnownShareMember(memberInput, selectedMember);
    if (!member) return;

    onAdd?.({
      ...member,
      permission: permissionId,
      permissionId,
      scope: member.scope || (String(member.email || '').includes('@calendarpro.io') ? 'internal' : 'external'),
    });
    setMemberInput('');
    setSelectedMember(null);
    setShowSuggestions(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_260px_96px]">
        <div className="relative">
          <input
            value={memberInput}
            onChange={(event) => {
              setMemberInput(event.target.value);
              setSelectedMember(null);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
              if (event.key === 'Escape') {
                setShowSuggestions(false);
              }
            }}
            placeholder="姓名或邮箱"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              {suggestions.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    setSelectedMember(contact);
                    setMemberInput(contact.name);
                    setShowSuggestions(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition hover:bg-slate-50"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-900">{contact.name}</span>
                    <span className="block truncate text-xs font-medium text-slate-400">{contact.email}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
                    {contact.scope === 'external' ? '外部' : '组织内'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
        <PermissionDropdown value={permissionId} onChange={setPermissionId} />
        <button
          type="button"
          onClick={() => addMember()}
          disabled={!resolvedMember}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          添加
        </button>
      </div>
    </div>
  );
}

function CalendarPermissionModal({
  calendar,
  onClose,
  onUpdateShare,
  onAddShare,
  onRemoveShare,
}) {
  if (!calendar) return null;

  const visibleShares = calendar.sharing || [];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[760px] max-w-[92vw] max-h-[70vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-5">
          <div>
            <div className="text-lg font-black text-gray-900">共享权限</div>
            <div className="text-sm text-gray-500 mt-1">{calendar.name}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(70vh-88px)] space-y-4">
          <div className="text-sm font-black text-gray-900">我共享给了谁</div>
          <ShareMemberComposer existingShares={visibleShares} onAdd={onAddShare} />

          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="grid grid-cols-[minmax(0,1fr)_280px_96px] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-400">
              <div>成员</div>
              <div>权限</div>
              <div className="text-right">操作</div>
            </div>
            {visibleShares.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm font-medium text-slate-400">还没有共享给任何人。</div>
            ) : (
              visibleShares.map((share) => (
                <div key={share.id} className="grid grid-cols-[minmax(0,1fr)_280px_96px] items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="truncate text-sm font-bold text-slate-900">{share.name || share.email}</div>
                      <ShareStatusBadge status={share.status} />
                    </div>
                    <div className="mt-0.5 truncate text-xs font-medium text-slate-400">{share.email}</div>
                    {share.status !== 'accepted' && (
                      <div className="mt-0.5 truncate text-xs font-medium text-amber-600">
                        对方接受后按当前权限生效
                      </div>
                    )}
                  </div>
                  <PermissionDropdown
                    value={getCalendarPermissionId(share.permission)}
                    onChange={(permission) => onUpdateShare(share.id, { permission })}
                  />
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => onRemoveShare(share.id)}
                      className="rounded-lg px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      移除
                    </button>
                  </div>
                </div>
              )))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MailboxPermissionModal({
  account,
  accountCalendars = [],
  pendingInvitations = [],
  initialTab = 'settings',
  onClose,
  onRenameAccount,
  onUpdateAccountColor,
  onExportAccountCalendar,
  onDeleteAccountCalendars,
  onUpdateCalendarShare,
  onAddCalendarShare,
  onRemoveCalendarShare,
  onSetInvitationPermission,
  onAcceptInvitation,
  onIgnoreInvitation,
  onRemoveSharedAccount,
}) {
  const [draftName, setDraftName] = useState(getAccountEditableName(account));
  const [activeTab, setActiveTab] = useState(initialTab || 'settings');

  useEffect(() => {
    setDraftName(getAccountEditableName(account));
  }, [account?.id, account?.displayName, account?.name, account?.email]);

  useEffect(() => {
    setActiveTab(initialTab || 'settings');
  }, [initialTab, account?.id]);

  if (!account) return null;

  const accountLabel = getAccountFullLabel(account);
  const canSaveName = draftName.trim() && draftName.trim() !== getAccountEditableName(account);
  const ownCalendars = accountCalendars.filter((calendar) => calendar.type !== 'shared');
  const primaryCalendar = ownCalendars.find((calendar) => calendar.isPrimary) || ownCalendars[0] || accountCalendars[0];
  const shareRows = (primaryCalendar?.sharing || [])
    .filter((share) => share.status !== 'revoked')
    .map((share) => ({ calendar: primaryCalendar, share }));
  const panelTitle = activeTab === 'sharing' ? '共享权限' : '账户设置';
  const isSharedAccount = account.ownership === 'shared';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[760px] max-w-[92vw] max-h-[70vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`h-4 w-4 shrink-0 rounded-full ${account.color || 'bg-blue-500'}`}></span>
            <div className="min-w-0">
              <div className="truncate text-lg font-black text-gray-900">{panelTitle}</div>
              <div className="mt-1 truncate text-sm text-gray-500">{accountLabel}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(70vh-88px)] space-y-5">

          {activeTab === 'settings' && (
            <div className="space-y-7">
              <section>
                <div className="mb-4 text-sm font-black text-slate-900">基本信息</div>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_96px]">
                  <label className="block min-w-0">
                    <span className="mb-2 block text-xs font-bold text-slate-500">显示名称</span>
                    <input
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                  <button
                    disabled={!canSaveName}
                    onClick={() => onRenameAccount(account.id, draftName)}
                    className={`mt-6 h-11 rounded-xl px-4 text-sm font-bold transition sm:mt-6 ${
                      canSaveName ? 'bg-slate-900 text-white hover:bg-slate-800' : 'cursor-not-allowed bg-slate-200 text-slate-400'
                    }`}
                  >
                    保存
                  </button>
                </div>
                <div className="mt-4 flex min-w-0 items-center gap-3 text-sm">
                  <span className="shrink-0 text-xs font-bold text-slate-400">账号</span>
                  <span className="truncate font-semibold text-slate-600">{account.email || account.name}</span>
                </div>
              </section>

              <section className="border-t border-slate-100 pt-6">
                <div className="mb-4 text-sm font-black text-slate-900">账号颜色</div>
                <div className="flex flex-wrap gap-3.5">
                  {ACCOUNT_COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => onUpdateAccountColor(account.id, color)}
                      className={`h-9 w-9 rounded-full ${color} transition ${
                        account.color === color ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
                      }`}
                      title="修改颜色"
                    />
                  ))}
                </div>
              </section>

              <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                {!isSharedAccount ? (
                  <>
                  <button
                    onClick={() => onExportAccountCalendar(account.id)}
                    className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <FileText size={15} className="mr-2" />
                    导出日历
                  </button>
                  <button
                    onClick={() => onDeleteAccountCalendars(account.id)}
                    className="inline-flex h-10 items-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-600 transition hover:bg-red-100"
                  >
                    <Trash size={15} className="mr-2" />
                    删除日历
                  </button>
                  </>
                ) : (
                  <button
                    onClick={() => onRemoveSharedAccount?.(account)}
                    className="inline-flex h-10 items-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-bold text-red-600 transition hover:bg-red-100"
                  >
                    <X size={15} className="mr-2" />
                    从列表移除
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sharing' && (
            <div className="space-y-5">
              <div>
                {primaryCalendar && (
                  <div className="mb-3">
                    <ShareMemberComposer
                      existingShares={shareRows.map(({ share }) => share)}
                      onAdd={(member) => onAddCalendarShare?.(primaryCalendar.id, member)}
                    />
                  </div>
                )}
                <div className="mb-3 text-sm font-black text-gray-900">我共享出去的权限</div>
                <div className="rounded-xl border border-gray-200 bg-white">
                  <div className="grid grid-cols-[minmax(0,1fr)_280px_72px] gap-3 border-b border-gray-100 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-400">
                    <div>姓名 / 账号</div>
                    <div>权限</div>
                    <div className="text-right">操作</div>
                  </div>
                  {shareRows.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm font-medium text-slate-400">还没有共享给任何人。</div>
                  ) : (
                    shareRows.map(({ calendar, share }) => (
                      <div key={`${calendar.id}-${share.id}`} className="grid grid-cols-[minmax(0,1fr)_280px_72px] items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-b-0">
                        <div className="min-w-0">
                          <div className="flex min-w-0 items-center gap-2">
                            <div className="truncate text-sm font-bold text-gray-900">{share.name || share.email}</div>
                            <ShareStatusBadge status={share.status} />
                          </div>
                          <div className="truncate text-xs text-gray-400">{share.email}</div>
                          {share.status !== 'accepted' && (
                            <div className="mt-0.5 truncate text-xs font-medium text-amber-600">
                              对方接受后按当前权限生效
                            </div>
                          )}
                        </div>
                        <PermissionDropdown
                          value={getCalendarPermissionId(share.permission)}
                          onChange={(permission) => onUpdateCalendarShare?.(calendar.id, share.id, { permission })}
                        />
                        <button
                          onClick={() => onRemoveCalendarShare?.(calendar.id, share.id)}
                          className="justify-self-end rounded-lg px-2 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          移除
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddSharedCalendarModal({
  open,
  draft,
  accounts = [],
  invitations,
  onClose,
  onChange,
  onSubmit,
  onAcceptInvitation,
  onIgnoreInvitation,
  onSetInvitationPermission,
}) {
  const [showAccountSuggestions, setShowAccountSuggestions] = useState(false);
  const accountInputRef = useRef(null);
  const [accountSuggestionRect, setAccountSuggestionRect] = useState(null);
  const pendingInvitations = invitations.filter((item) => item.status === 'pending');
  const existingSharedTargets = useMemo(
    () => accounts.map((account) => ({ name: account.displayName || account.name, email: account.email })),
    [accounts],
  );
  const pendingInvitationContacts = useMemo(
    () =>
      pendingInvitations.map((item) => ({
        id: `pending-${item.id}`,
        name: item.senderName,
        email: item.senderEmail,
        scope: String(item.senderEmail || '').includes('@calendarpro.io') ? 'internal' : 'external',
        permissionId: item.permissionId,
        color: item.color,
        sharedGrant: true,
      })),
    [pendingInvitations],
  );
  const accountSuggestions = useMemo(
    () => getShareContactSuggestions(draft.email, existingSharedTargets, 5, pendingInvitationContacts),
    [draft.email, existingSharedTargets, pendingInvitationContacts],
  );

  useEffect(() => {
    if (!open) setShowAccountSuggestions(false);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !showAccountSuggestions || accountSuggestions.length === 0) {
      setAccountSuggestionRect(null);
      return undefined;
    }

    const updateRect = () => {
      const input = accountInputRef.current;
      if (!input) return;
      const rect = input.getBoundingClientRect();
      const viewportPadding = 16;
      const width = Math.min(rect.width, window.innerWidth - viewportPadding * 2);
      const left = Math.min(Math.max(viewportPadding, rect.left), window.innerWidth - width - viewportPadding);
      const availableBelow = window.innerHeight - rect.bottom - viewportPadding;
      const availableAbove = rect.top - viewportPadding;
      const shouldOpenAbove = availableBelow < 160 && availableAbove > availableBelow;
      const maxHeight = shouldOpenAbove
        ? Math.max(120, Math.min(260, availableAbove - 6))
        : Math.max(120, Math.min(260, availableBelow));

      setAccountSuggestionRect({
        left,
        top: shouldOpenAbove ? Math.max(viewportPadding, rect.top - maxHeight - 6) : rect.bottom + 6,
        width,
        maxHeight,
      });
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [open, showAccountSuggestions, accountSuggestions.length, draft.email]);

  if (!open) return null;

  const accountSuggestionLayer =
    showAccountSuggestions && accountSuggestions.length > 0 && accountSuggestionRect
      ? createPortal(
          <div
            className="fixed z-[90] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
            style={{
              left: accountSuggestionRect.left,
              top: accountSuggestionRect.top,
              width: accountSuggestionRect.width,
              maxHeight: accountSuggestionRect.maxHeight,
            }}
            onMouseDown={(event) => event.preventDefault()}
          >
            {accountSuggestions.map((contact) => {
              const permission = contact.permissionId ? getCalendarPermissionOption(contact.permissionId) : null;
              return (
                <button
                  key={contact.id || contact.email}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    onChange({
                      name: contact.name,
                      email: contact.email,
                      permissionId: contact.permissionId || draft.permissionId,
                      color: contact.color || draft.color,
                      lookupState: contact.permissionId ? 'ready' : null,
                      lookupMessage: contact.permissionId ? `已检测到对方授权：${permission.label}` : '',
                    });
                    setShowAccountSuggestions(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition hover:bg-slate-50"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-900">{contact.name}</span>
                    <span className="block truncate text-xs font-medium text-slate-400">{contact.email}</span>
                  </span>
                  {permission ? (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                      已授权 · {permission.label}
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                      联系人
                    </span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
        <div
          className="flex max-h-[70vh] w-[820px] max-w-[92vw] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-4">
            <div className="text-lg font-black text-gray-900">添加共享日历</div>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
              <X size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-6 pb-8 space-y-6">
            {pendingInvitations.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-black text-gray-900">
                  收到的共享
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold leading-none text-white">{pendingInvitations.length}</span>
                </div>
                <div className="overflow-visible rounded-xl border border-slate-200 bg-white">
                  <div className="grid gap-3 border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-400 lg:grid-cols-[minmax(170px,0.7fr)_minmax(300px,1fr)_132px]">
                    <div>共享方</div>
                    <div>给我的权限</div>
                    <div className="text-right">操作</div>
                  </div>
                  {pendingInvitations.map((invite) => {
                    const invitePermission = getCalendarPermissionOption(invite.permissionId);
                    return (
                    <div key={invite.id} className="grid gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 lg:grid-cols-[minmax(170px,0.7fr)_minmax(300px,1fr)_132px] lg:items-center">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`h-3 w-3 shrink-0 rounded-full ${invite.color}`}></span>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-slate-900">{invite.senderName || invite.senderEmail}</div>
                          <div className="mt-0.5 truncate text-xs font-medium text-slate-400">{invite.senderEmail}</div>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-black text-slate-900">{invitePermission.label}</div>
                        <div className="mt-0.5 truncate text-xs font-medium text-slate-400" title={invitePermission.desc}>
                          {invitePermission.desc}
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 lg:justify-end">
                        <button
                          onClick={() => onIgnoreInvitation(invite.id)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        >
                          忽略
                        </button>
                        <button
                          onClick={() => onAcceptInvitation(invite.id)}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                        >
                          添加
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="mb-3 text-sm font-black text-gray-900">通过账号添加</div>
              <div className="overflow-visible rounded-xl border border-slate-200 bg-white p-3">
                <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(240px,280px)_96px]">
                  <div className="min-w-0">
                    <input
                      ref={accountInputRef}
                      value={draft.email}
                      onChange={(event) => {
                        onChange({
                          email: event.target.value,
                          name: event.target.value,
                          lookupState: null,
                          lookupMessage: '',
                        });
                        setShowAccountSuggestions(true);
                      }}
                      onFocus={() => setShowAccountSuggestions(true)}
                      onBlur={() => window.setTimeout(() => setShowAccountSuggestions(false), 120)}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') setShowAccountSuggestions(false);
                      }}
                      placeholder="姓名或邮箱"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <PermissionDropdown value={draft.permissionId} onChange={(permissionId) => onChange({ permissionId })} />
                  <button
                    onClick={onSubmit}
                    disabled={!draft.email.trim()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    添加
                  </button>
                </div>
                {draft.lookupMessage && (
                  <div
                    className={`mt-2 rounded-lg px-3 py-2 text-xs font-semibold ${
                      draft.lookupState === 'ready'
                        ? 'bg-emerald-50 text-emerald-700'
                        : draft.lookupState === 'blocked'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {draft.lookupMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-end gap-3">
              <button onClick={onClose} className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-bold text-gray-700 hover:bg-white">
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
      {accountSuggestionLayer}
    </>
  );
}

function SharedCalendarAccessModal({ calendar, account, onClose }) {
  if (!calendar) return null;

  const permissionId = getCalendarPermissionId(calendar.receivedPermissionId || calendar.permission);
  const permissionOption = getCalendarPermissionOption(permissionId);
  const capabilities = getCalendarPermissionCapabilities(permissionId);
  const accountLabel = getAccountFullLabel(account);
  const sourceName = calendar.receivedFromName || calendar.owner || calendar.receivedFrom || '未知共享方';
  const sourceAccount = calendar.receivedFrom || calendar.ownerEmail || '未提供账号';
  const enabledCapabilities = capabilities.filter((item) => item.enabled).slice(0, 2);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[560px] max-w-[92vw] max-h-[70vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`h-4 w-4 shrink-0 rounded-full ${calendar.color || account?.color || 'bg-gray-400'}`}></span>
            <div className="min-w-0">
              <div className="truncate text-lg font-black text-gray-900">查看权限</div>
              <div className="mt-0.5 truncate text-sm text-gray-500">{accountLabel || calendar.name}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[calc(70vh-88px)] overflow-y-auto p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-400">共享方</div>
                <div className="mt-2 truncate text-base font-black text-slate-900">{sourceName}</div>
                <div className="mt-1 truncate text-sm font-medium text-slate-400">{sourceAccount}</div>
              </div>
              <PermissionBadge permission={permissionId} />
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="text-sm font-medium leading-relaxed text-slate-500">{permissionOption.desc}</div>
              {enabledCapabilities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {enabledCapabilities.map((item) => (
                    <span key={item.label} className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700">
                      <Check size={13} className="mr-1.5" />
                      {item.label}
                    </span>
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

function ReminderModal({ open, onClose, pendingEvents, upcomingEvents, accountMap, calendarMap, onOpenEvent, onRespond }) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div
        className="w-[720px] max-w-[92vw] max-h-[70vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-5">
	          <div className="text-lg font-black text-gray-900">近期提醒</div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(70vh-88px)] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
	              <div className="text-xs font-black text-orange-700 uppercase">待响应邀请</div>
	              <div className="mt-2 text-2xl font-black text-orange-900">{pendingEvents.length}</div>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
	              <div className="text-xs font-black text-blue-700 uppercase">近期会议</div>
	              <div className="mt-2 text-2xl font-black text-blue-900">{upcomingEvents.length}</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-black text-gray-900 mb-3">待响应</div>
            <div className="space-y-3">
              {pendingEvents.length === 0 && <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">当前没有待处理邀请。</div>}
              {pendingEvents.map((event) => {
                const calendar = calendarMap[event.calId] || { color: 'bg-gray-500', accountId: '' };
                const account = accountMap[calendar.accountId];
                return (
                  <div key={event.id} className="rounded-xl border border-gray-200 px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <button onClick={() => onOpenEvent(event.id)} className="text-left flex-1 min-w-0">
                        <div className="flex items-center">
                          <div className={`w-2.5 h-2.5 rounded-full ${calendar.color}`}></div>
                          <div className="ml-2 text-sm font-black text-gray-900 truncate">{event.title}</div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {formatDateLabel(eventToDate(event))} · {event.isAllDay ? '全天' : formatTimeRange(event.startH || WORK_START_HOUR, event.durationH || 1)}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 truncate">{account?.name || '未知账户'}{event.location ? ` · ${event.location}` : ''}</div>
                      </button>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => onRespond(event.id, 'reject')} className="px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700">
                          拒绝
                        </button>
                        <button onClick={() => onRespond(event.id, 'accept')} className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold">
                          接受
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-sm font-black text-gray-900 mb-3">近期日程</div>
            <div className="space-y-3">
              {upcomingEvents.length === 0 && <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500">当前没有近期日程。</div>}
              {upcomingEvents.map((event) => {
                const calendar = calendarMap[event.calId] || { color: 'bg-gray-500', accountId: '' };
                const account = accountMap[calendar.accountId];
                return (
                  <button
                    key={event.id}
                    onClick={() => onOpenEvent(event.id)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-4 text-left hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div className="flex items-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${calendar.color}`}></div>
                      <div className="ml-2 text-sm font-black text-gray-900 truncate">{event.title}</div>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center">
                        <Clock size={12} className="mr-1.5" />
                        {formatDateLabel(eventToDate(event))} · {event.isAllDay ? '全天' : formatTimeRange(event.startH || WORK_START_HOUR, event.durationH || 1)}
                      </span>
                      <span className="inline-flex items-center">
                        <Calendar size={12} className="mr-1.5" />
                        {account?.name || '未知账户'}
                      </span>
                      {event.location && (
                        <span className="inline-flex items-center">
                          <MapPin size={12} className="mr-1.5" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutHelpModal({ open, onClose }) {
  if (!open) return null;

  const groups = [
    [
      ['N', '新建日程 / 新邮件'],
      ['T', '回到今天'],
      ['M / W / D', '切换月 / 周 / 日视图'],
      ['R', '同步当前日历'],
    ],
    [
      ['?', '快捷键'],
      ['Esc', '关闭弹窗 / 返回上一级'],
      ['Delete', '删除当前详情中的日程'],
      ['双击空白时间', '新建日程'],
    ],
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div
        className="w-[560px] max-w-[92vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-5">
	          <div className="text-lg font-black text-gray-900">快捷键</div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((group, index) => (
            <div key={index} className="rounded-xl border border-gray-200 p-4 space-y-3">
              {group.map(([shortcut, desc]) => (
                <div key={shortcut} className="flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-gray-700">{desc}</span>
                  <kbd className="px-2.5 py-1 rounded-lg bg-gray-100 border border-gray-200 text-xs font-black text-gray-800 whitespace-nowrap">
                    {shortcut}
                  </kbd>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MainApp() {
  const [activeProduct, setActiveProduct] = useState('calendar');
  const [currentScreen, setCurrentScreen] = useState('calendar');
  const [calendarReturnScreen, setCalendarReturnScreen] = useState('calendar');
  const [calendarLayout, setCalendarLayout] = useState('week');
  const [accountDisplayMode, setAccountDisplayMode] = useState('overlay');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [flashingEventId, setFlashingEventId] = useState(null);
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [calendars, setCalendars] = useState(MOCK_CALENDARS);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [mails, setMails] = useState(MOCK_MAILS);
  const [focusDate, setFocusDate] = useState(stripTime(TODAY_DATE));
  const [calendarSidebarCollapsed, setCalendarSidebarCollapsed] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [focusedAccountId, setFocusedAccountId] = useState(null);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, payload: null });
  const [contextMenu, setContextMenu] = useState(null);

  const handleFocusAccount = (accountId) => {
    setFocusedAccountId((prev) => prev === accountId ? null : accountId);
  };

  const handleAccountMenu = (event, account) => {
    event.stopPropagation();
    setAccountMenuAnchor({ x: event.clientX, y: event.clientY, account });
  };

  const closeAccountMenu = () => setAccountMenuAnchor(null);
  const [calendarSearchQuery, setCalendarSearchQuery] = useState('');
  const [calendarSearchPopoverOpen, setCalendarSearchPopoverOpen] = useState(false);
  const [calendarRecentSearches, setCalendarRecentSearches] = useState(['Q4 预算', '会议', '周会', '产品评审', '客户沟通']);
  const [calendarSearchFilters, setCalendarSearchFilters] = useState({
    accountId: 'all',
    accountIds: [],
    calendarScope: 'all',
    timeframe: 'all',
    person: 'all',
    colorCategory: 'all',
    meetingType: 'all',
    attachment: 'all',
    sort: 'relevance',
  });
  const [colorCategoryLabels, setColorCategoryLabels] = useState(() =>
    Object.fromEntries(
      SEARCH_COLOR_CATEGORY_OPTIONS
        .filter((option) => option.id !== 'all' && option.id !== 'none')
        .map((option) => [option.id, option.shortLabel || option.label]),
    ),
  );
  const [permissionPanel, setPermissionPanel] = useState({ type: null, targetId: null });
  const [sharedCalendarDialog, setSharedCalendarDialog] = useState({
    open: false,
    tab: 'manual',
    name: '',
    email: '',
    permissionId: 'all_details',
    color: 'bg-cyan-500',
    lookupState: null,
    lookupMessage: '',
  });
  const [shareInvitations, setShareInvitations] = useState(MOCK_SHARE_INVITATIONS);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);
  const [calendarColorPicker, setCalendarColorPicker] = useState({ open: false, targetId: null, targetType: null });
  const [calendarRenameDialog, setCalendarRenameDialog] = useState({ open: false, targetId: null, name: '' });
  const [calendarDeleteConfirm, setCalendarDeleteConfirm] = useState({ open: false, targetId: null });
  const [calendarSyncReport, setCalendarSyncReport] = useState(null);
  const [splitAccountIds, setSplitAccountIds] = useState(
    MOCK_ACCOUNTS.filter((account) => account.checked)
      .slice(0, MAX_SPLIT_ACCOUNTS)
      .map((account) => account.id),
  );
  const [mailFolder, setMailFolder] = useState('inbox');
  const [mailFocusTab, setMailFocusTab] = useState('focused');
  const [mailUnreadOnly, setMailUnreadOnly] = useState(false);
  const [selectedMailId, setSelectedMailId] = useState(MOCK_MAILS[0]?.id || null);
  const [mailComposer, setMailComposer] = useState({
    open: false,
    mode: 'new',
    sourceMailId: null,
    draft: buildMailDraft({ fallbackAccountId: MOCK_ACCOUNTS[0]?.id }),
  });
  const [timeSelection, setTimeSelection] = useState(null);
  const [isSelectingTime, setIsSelectingTime] = useState(false);
  const [timelineScrollToken, setTimelineScrollToken] = useState(0);
  const [createDraft, setCreateDraft] = useState({
    isDirty: false,
    saveStatus: 'idle',
    mode: 'create',
    eventId: null,
  });
  const [createDraftPanels, setCreateDraftPanels] = useState(INITIAL_CREATE_DRAFT_PANELS);
  const [createDraftBulkInputs, setCreateDraftBulkInputs] = useState(INITIAL_CREATE_DRAFT_BULK_INPUTS);
  const [hoverPreview, setHoverPreview] = useState(null);
  const [eventInteraction, setEventInteraction] = useState(null);
  const calendarSearchBoxRef = useRef(null);
  const [draftForm, setDraftForm] = useState(() =>
    buildDraftForm({
      event: null,
      slot: null,
      focusDate: stripTime(TODAY_DATE),
      calendars: MOCK_CALENDARS,
      activeAccountIds: MOCK_ACCOUNTS.filter((account) => account.checked).map((account) => account.id),
    }),
  );
  const eventInteractionRef = useRef(null);
  const suppressOpenUntilRef = useRef(0);
  const timeSelectionRef = useRef(null);
  const isSelectingTimeRef = useRef(false);
  const selectionDraggedRef = useRef(false);
  const dayTimelineScrollRef = useRef(null);
  const weekTimelineScrollRef = useRef(null);
  const navToRef = useRef(null);
  const locateFlashTimerRef = useRef(null);
  const previewCloseTimerRef = useRef(null);

  const accountMap = useMemo(() => Object.fromEntries(accounts.map((account) => [account.id, account])), [accounts]);
  const calendarMap = useMemo(() => Object.fromEntries(calendars.map((calendar) => [calendar.id, calendar])), [calendars]);
  const activeAccountIds = useMemo(() => accounts.filter((account) => account.checked).map((account) => account.id), [accounts]);
  const activeAccounts = useMemo(() => accounts.filter((account) => account.checked), [accounts]);
  const normalizedCalendarSearch = calendarSearchQuery.trim().toLowerCase();
  const calendarSearchAccountOptions = useMemo(() => activeAccounts.map((account) => ({ ...account, label: account.email || account.name })), [activeAccounts]);
  useEffect(() => {
    if (!calendarSearchPopoverOpen) return undefined;

    const handlePointerDown = (event) => {
      if (calendarSearchBoxRef.current?.contains(event.target)) return;
      setCalendarSearchPopoverOpen(false);
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, [calendarSearchPopoverOpen]);

  useEffect(() => () => {
    if (locateFlashTimerRef.current) {
      window.clearTimeout(locateFlashTimerRef.current);
    }
    if (previewCloseTimerRef.current) {
      window.clearTimeout(previewCloseTimerRef.current);
    }
  }, []);

  const activeCalIds = useMemo(
    () =>
      calendars
        .filter((calendar) => activeAccountIds.includes(calendar.accountId))
        .map((calendar) => calendar.id),
    [calendars, activeAccountIds],
  );

  const activeEvents = useMemo(
    () => sortEvents(events.filter((event) => activeCalIds.includes(event.calId))),
    [activeCalIds, events],
  );
  const calendarSearchPeopleOptions = useMemo(() => {
    const names = new Set();

    activeEvents.forEach((event) => {
      if (event.type === 'holiday' || event.calId === HUAWEI_CALENDAR_ID) return;
      [event.organizer, ...(event.attendees || []), ...(event.optionalAttendees || [])]
        .filter(Boolean)
        .forEach((name) => names.add(name));
    });

    const primaryNames = Array.from(names).slice(0, 10);
    return [
      { id: 'all', label: '人员：选择人员或团队' },
      ...primaryNames.flatMap((name) => [
        { id: `any::${name}`, label: `相关人员：${name}` },
        { id: `organizer::${name}`, label: `组织者：${name}` },
        { id: `participant::${name}`, label: `参与人：${name}` },
      ]),
    ];
  }, [activeEvents]);
  const filteredMails = useMemo(
    () =>
      [...mails]
        .filter((mail) => {
          const matchesFolder = mail.folder === mailFolder;
          const matchesFocus = mailFolder !== 'inbox' || mail.category === mailFocusTab;
          const matchesUnread = !mailUnreadOnly || mail.unread;
          const matchesAccount = activeAccountIds.includes(mail.accountId);

          return matchesFolder && matchesFocus && matchesUnread && matchesAccount;
        })
        .sort((left, right) => right.timestamp - left.timestamp),
    [activeAccountIds, mailFocusTab, mailFolder, mailUnreadOnly, mails],
  );

  const rangeEvents = useMemo(
    () => activeEvents.filter((event) => eventMatchesLayout(event, calendarLayout, focusDate)),
    [activeEvents, calendarLayout, focusDate],
  );
  const interactiveRangeEvents = useMemo(() => {
    if (!eventInteraction?.eventId || !eventInteraction?.next) return rangeEvents;

    return rangeEvents.map((event) => (event.id === eventInteraction.eventId ? { ...event, ...eventInteraction.next } : event));
  }, [eventInteraction, rangeEvents]);

  const weekDays = useMemo(() => buildWeekDays(focusDate), [focusDate]);
  const visibleWeekDays = weekDays;
  const selectedEvent = useMemo(() => events.find((event) => event.id === selectedEventId), [events, selectedEventId]);
  const selectedPermissionCalendar = useMemo(
    () => (permissionPanel.type === 'calendar' ? calendars.find((calendar) => calendar.id === permissionPanel.targetId) : null),
    [calendars, permissionPanel],
  );
  const selectedPermissionMailbox = useMemo(
    () => (permissionPanel.type === 'mailbox' ? accounts.find((account) => account.id === permissionPanel.targetId) : null),
    [accounts, permissionPanel],
  );
  const selectedPermissionMailboxCalendars = useMemo(
    () => (selectedPermissionMailbox ? calendars.filter((calendar) => calendar.accountId === selectedPermissionMailbox.id) : []),
    [calendars, selectedPermissionMailbox],
  );
  const selectedSharedAccessCalendar = useMemo(
    () =>
      permissionPanel.type === 'shared_access'
        ? calendars.find((calendar) => calendar.accountId === permissionPanel.targetId && calendar.type === 'shared') ||
          calendars.find((calendar) => calendar.accountId === permissionPanel.targetId)
        : null,
    [calendars, permissionPanel],
  );
  const selectedMail = useMemo(() => mails.find((mail) => mail.id === selectedMailId) || null, [mails, selectedMailId]);
  const allEventLookup = useMemo(() => Object.fromEntries(events.map((event) => [event.id, event])), [events]);
  const previewedEvent = useMemo(() => {
    if (!hoverPreview?.eventId) return null;

    return interactiveRangeEvents.find((event) => event.id === hoverPreview.eventId) || events.find((event) => event.id === hoverPreview.eventId) || null;
  }, [events, hoverPreview, interactiveRangeEvents]);
  const interactionPreviewEvent = useMemo(() => {
    if (!eventInteraction?.eventId) return null;

    return interactiveRangeEvents.find((event) => event.id === eventInteraction.eventId) || events.find((event) => event.id === eventInteraction.eventId) || null;
  }, [eventInteraction, events, interactiveRangeEvents]);
  const selectedEventCalInfo =
    (selectedEvent && calendarMap[selectedEvent.calId]) || {
      color: 'bg-gray-500',
      name: '未知日历',
      permission: '仅查看详情',
      accountId: '',
      owner: '我',
    };
  const selectedEventAccountInfo = selectedEventCalInfo.accountId ? accountMap[selectedEventCalInfo.accountId] : null;
  const selectedEventKindLabel = selectedEvent ? EVENT_KIND_LABELS[selectedEvent.kind || 'event'] || '日程' : '';
  const selectedEventMeetingLabel =
    selectedEvent && selectedEvent.meetingProvider && selectedEvent.meetingProvider !== 'none'
      ? MEETING_PROVIDER_LABELS[selectedEvent.meetingProvider] || '在线会议'
      : '';
  const selectedEventCanJoin = selectedEvent ? canJoinCalendarEvent(selectedEvent) : false;
  const selectedEventColorCategories = selectedEvent ? getEventColorCategories(selectedEvent, colorCategoryLabels) : [];
  const draftAccountInfo = accountMap[calendarMap[draftForm.calId]?.accountId] || null;
  const draftParticipantAccountLookup = useMemo(() => {
    const nextMap = new Map();

    const register = (value, accountId) => {
      const key = normalizeParticipantIdentity(value);
      if (!key) return;
      const current = nextMap.get(key) || new Set();
      current.add(accountId);
      nextMap.set(key, current);
    };

    accounts.forEach((account) => {
      register(account.email, account.id);
      register(account.name, account.id);
      account.mailboxMembers?.forEach((member) => {
        register(member.name, account.id);
        register(member.email, account.id);
      });
    });

    calendars.forEach((calendar) => {
      register(calendar.owner, calendar.accountId);
    });

    return nextMap;
  }, [accounts, calendars]);
  const resolveParticipantAccountIds = (participants = []) => {
    const nextIds = new Set();

    participants.forEach((participant) => {
      const matched = draftParticipantAccountLookup.get(normalizeParticipantIdentity(participant));
      if (!matched) return;
      matched.forEach((accountId) => nextIds.add(accountId));
    });

    return Array.from(nextIds);
  };
  const getAccountPermissionMode = (accountId) => {
    const accountCalendars = calendars.filter((calendar) => calendar.accountId === accountId);
    if (accountCalendars.length === 0) return 'full';
    return accountCalendars.every((calendar) => getCalendarPermissionId(calendar.receivedPermissionId || calendar.permission) === 'busy_only') ? 'busy_only' : 'full';
  };
  const draftRequiredAccountIds = useMemo(() => {
    const nextIds = new Set();
    const selectedAccountId = calendarMap[draftForm.calId]?.accountId;

    if (selectedAccountId) nextIds.add(selectedAccountId);
    resolveParticipantAccountIds([draftForm.organizer, ...draftForm.attendees]).forEach((accountId) => nextIds.add(accountId));

    return Array.from(nextIds);
  }, [calendarMap, draftForm.attendees, draftForm.calId, draftForm.organizer, draftParticipantAccountLookup]);
  const draftOptionalAccountIds = useMemo(() => {
    const requiredIds = new Set(draftRequiredAccountIds);
    return resolveParticipantAccountIds(draftForm.optionalAttendees || []).filter((accountId) => !requiredIds.has(accountId));
  }, [draftForm.optionalAttendees, draftParticipantAccountLookup, draftRequiredAccountIds]);
  const draftRelevantAccountIds = useMemo(
    () => Array.from(new Set([...draftRequiredAccountIds, ...draftOptionalAccountIds])),
    [draftOptionalAccountIds, draftRequiredAccountIds],
  );
  const draftRelevantAccounts = useMemo(
    () => draftRelevantAccountIds.map((accountId) => accountMap[accountId]).filter(Boolean),
    [accountMap, draftRelevantAccountIds],
  );
  const draftMatchedRequiredParticipantIds = useMemo(
    () => resolveParticipantAccountIds(draftForm.attendees),
    [draftForm.attendees, draftParticipantAccountLookup],
  );
  const draftMatchedOptionalParticipantIds = useMemo(() => {
    const requiredIds = new Set(draftMatchedRequiredParticipantIds);
    return resolveParticipantAccountIds(draftForm.optionalAttendees || []).filter((accountId) => !requiredIds.has(accountId));
  }, [draftForm.optionalAttendees, draftMatchedRequiredParticipantIds, draftParticipantAccountLookup]);
  const participantDisplayLookup = useMemo(() => {
    const nextMap = new Map();
    const register = (key, payload) => {
      const normalized = normalizeParticipantIdentity(key);
      if (!normalized) return;
      nextMap.set(normalized, payload);
    };

    accounts.forEach((account) => {
      register(account.email, {
        title: account.name || account.email,
        subtitle: account.email,
        tag: account.ownership === 'self' ? '我的日历' : '共享日历',
      });
      register(account.name, {
        title: account.name || account.email,
        subtitle: account.email,
        tag: account.ownership === 'self' ? '我的日历' : '共享日历',
      });
    });
    MAIL_CONTACTS.forEach((contact) => {
      register(contact.email, {
        title: contact.name,
        subtitle: contact.email,
        tag: contact.scope === 'external' ? '外部' : '内部',
      });
      register(contact.name, {
        title: contact.name,
        subtitle: contact.email,
        tag: contact.scope === 'external' ? '外部' : '内部',
      });
    });

    return nextMap;
  }, [accounts]);
  const getParticipantDisplay = (value) => {
    const matched = participantDisplayLookup.get(normalizeParticipantIdentity(value));
    if (!matched) {
      return {
        title: value,
        subtitle: value.includes('@') ? value : '',
        tag: '',
      };
    }
    return matched;
  };

  const miniMonthEventMap = useMemo(() => {
    const nextMap = new Map();

    activeEvents.forEach((event) => {
      const calendar = calendarMap[event.calId];
      const color = calendar?.color || 'bg-gray-400';
      const accountId = calendar?.accountId || 'unknown';
      const span = event.isAllDay ? Math.max(1, event.allDaySpan || 1) : 1;
      const startDate = stripTime(eventToDate(event));

      for (let offset = 0; offset < span; offset += 1) {
        const dateKey = formatDateLabel(addDays(startDate, offset));
        const current = nextMap.get(dateKey) || { count: 0, colors: [], accountIds: [] };

        current.count += 1;
        if (!current.colors.includes(color)) current.colors.push(color);
        if (!current.accountIds.includes(accountId)) current.accountIds.push(accountId);
        nextMap.set(dateKey, current);
      }
    });

    nextMap.forEach((meta) => {
      meta.accountCount = meta.accountIds.length;
    });

    return nextMap;
  }, [activeEvents, calendarMap]);
  const showHuaweiWorkdayBadges = activeCalIds.includes(HUAWEI_CALENDAR_ID);
  const reminderEvents = useMemo(() => {
    const now = TODAY_DATE.getTime();
    const visible = events
      .filter((event) => activeCalIds.includes(event.calId) && event.status !== '已取消')
      .map((event) => {
        const startDate = eventToDate(event);
        const startTime = event.isAllDay
          ? stripTime(startDate).getTime()
          : new Date(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate(),
              Math.floor(event.startH || WORK_START_HOUR),
              (event.startH || WORK_START_HOUR) % 1 === 0.5 ? 30 : 0,
            ).getTime();
        const endTime = event.isAllDay
          ? startTime + (event.allDaySpan || 1) * DAY_MS
          : startTime + (event.durationH || 1) * 60 * 60 * 1000;
        return { ...event, reminderStartTime: startTime, reminderEndTime: endTime };
      })
      .sort((left, right) => left.reminderStartTime - right.reminderStartTime);

    return {
      pending: visible.filter((event) => event.status === '待响应').slice(0, 5),
      upcoming: visible.filter((event) => event.reminderEndTime >= now - 2 * 60 * 60 * 1000).slice(0, 8),
    };
  }, [activeCalIds, events]);
  const collectSlotConflicts = (date, startH, durationH, accountIds = [], excludeEventId = null) => {
    const relevantAccountIds = new Set(accountIds);

    return events
      .filter((event) => {
        if (event.id === excludeEventId || event.isAllDay) return false;
        if (event.availability === 'free') return false;
        if (!sameDay(eventToDate(event), date)) return false;
        const accountId = calendarMap[event.calId]?.accountId;
        if (!relevantAccountIds.has(accountId)) return false;
        return overlapsWindow(startH, startH + durationH, event.startH || 0, (event.startH || 0) + (event.durationH || 1));
      })
      .map((event) => ({
        ...event,
        accountId: calendarMap[event.calId]?.accountId,
      }));
  };

  const draftConflicts = useMemo(() => {
    return collectSlotConflicts(draftForm.date, draftForm.startH, draftForm.durationH, draftRelevantAccountIds, draftForm.eventId);
  }, [calendarMap, draftForm.date, draftForm.durationH, draftForm.eventId, draftForm.startH, draftRelevantAccountIds, events]);
  const currentSlotAccountStates = useMemo(
    () =>
      draftRelevantAccounts.map((account) => {
        const conflicts = collectSlotConflicts(draftForm.date, draftForm.startH, draftForm.durationH, [account.id], draftForm.eventId).sort(
          (left, right) => (left.startH || 0) - (right.startH || 0),
        );

        return {
          account,
          conflicts,
          scope: draftRequiredAccountIds.includes(account.id) ? 'required' : 'optional',
          permissionMode: getAccountPermissionMode(account.id),
        };
      }),
    [calendarMap, draftForm.date, draftForm.durationH, draftForm.eventId, draftForm.startH, draftRelevantAccounts, draftRequiredAccountIds, events],
  );
  const editableCalendars = useMemo(() => calendars.filter((calendar) => canEditCalendarContent(calendar)), [calendars]);
  const draftAccountCalendars = useMemo(
    () => editableCalendars.filter((calendar) => calendar.accountId === draftAccountInfo?.id),
    [draftAccountInfo?.id, editableCalendars],
  );
  const selectableDraftAccounts = useMemo(
    () => accounts.filter((account) => editableCalendars.some((calendar) => calendar.accountId === account.id)),
    [accounts, editableCalendars],
  );
  const splitAccounts = useMemo(
    () => activeAccounts.filter((account) => splitAccountIds.includes(account.id)).slice(0, MAX_SPLIT_ACCOUNTS),
    [activeAccounts, splitAccountIds],
  );
  const displayAccounts = useMemo(
    () =>
      accountDisplayMode === 'split' && activeAccounts.length > 1
        ? (splitAccounts.length > 0 ? splitAccounts : activeAccounts.slice(0, MAX_SPLIT_ACCOUNTS))
        : [],
    [accountDisplayMode, activeAccounts, splitAccounts],
  );
  const effectiveAccountDisplayMode = activeAccounts.length > 1 ? accountDisplayMode : 'overlay';
  const calendarSearchResults = useMemo(() => {
    if (!normalizedCalendarSearch) return [];

    const selectedSearchAccountIds = getSearchSelectedAccountIds(calendarSearchFilters, activeAccounts);
    const selectedSearchAccountIdSet = new Set(selectedSearchAccountIds);
    const showSourceAccount = activeAccounts.length > 1 && selectedSearchAccountIds.length > 1;

    return activeEvents
      .map((event) => {
        const calendar = calendarMap[event.calId];
        const account = calendar ? accountMap[calendar.accountId] : null;
        if (selectedSearchAccountIdSet.size > 0 && !selectedSearchAccountIdSet.has(account?.id)) return null;
        if (!accountMatchesSearchScope(account, calendarSearchFilters.calendarScope)) return null;
        if (!eventMatchesSearchPerson(event, calendarSearchFilters.person)) return null;
        if (!eventMatchesColorCategory(event, calendarSearchFilters.colorCategory)) return null;
        if (!eventMatchesMeetingType(event, calendarSearchFilters.meetingType)) return null;
        if (!eventMatchesAttachmentFilter(event, calendarSearchFilters.attachment)) return null;
        if (!eventMatchesSearchTimeframe(event, calendarSearchFilters.timeframe)) return null;

        const match = getEventSearchMatchMeta(event, calendar, account, normalizedCalendarSearch, 'all');
        if (!match) return null;

        const isSystemCalendarEvent = event.type === 'holiday' || event.calId === HUAWEI_CALENDAR_ID;
        const uniqueAttendees = isSystemCalendarEvent
          ? []
          : Array.from(new Set([...(event.attendees || []), ...(event.optionalAttendees || [])])).filter(Boolean);
        const attendeeCount = uniqueAttendees.length;
        const date = eventToDate(event);
        const distance = Math.abs(stripTime(date).getTime() - stripTime(TODAY_DATE).getTime()) / DAY_MS;
        const participantPreview =
          attendeeCount === 0
            ? ''
            : attendeeCount <= 2
              ? uniqueAttendees.join('、')
              : `${uniqueAttendees.slice(0, 2).join('、')} +${attendeeCount - 2} 人`;
        const hasOrganizer = Boolean(event.organizer) && !isSystemCalendarEvent;
        const relationshipLabel =
          isSystemCalendarEvent
            ? ''
            : match.matchedFields.includes('organizer') && hasOrganizer
              ? `组织者：${event.organizer}`
              : match.matchedFields.includes('attendees') && participantPreview
                ? `参与人：${participantPreview}`
                : hasOrganizer
                  ? `组织者：${event.organizer}${participantPreview ? ` · ${participantPreview}` : ''}`
                  : participantPreview
                    ? `参与人：${participantPreview}`
                    : '';
        const sourceLabel = showSourceAccount ? getSearchSourceAccountLabel(account) : '';
        const locationParts = [
          event.location,
          event.meetingProvider && event.meetingProvider !== 'none' ? MEETING_PROVIDER_LABELS[event.meetingProvider] : '',
        ].filter(Boolean);

        return {
          event,
          calendar,
          account,
          match,
          distance,
          dateLabel: formatAgendaEventLabel(event),
          locationLabel: locationParts.join(' · '),
          attendeesLabel:
            isSystemCalendarEvent
              ? ''
              : attendeeCount > 0
              ? `${event.organizer || '组织者'}，另有 ${attendeeCount} 位参会人`
              : `${event.organizer || '组织者'} 组织`,
          attendeesTooltip: uniqueAttendees.join('、'),
          relationshipLabel,
          sourceLabel,
        };
      })
      .filter(Boolean)
      .sort((left, right) => right.match.score - left.match.score || getEventStartTimestamp(left.event) - getEventStartTimestamp(right.event));
  }, [activeAccounts, activeEvents, accountMap, calendarMap, normalizedCalendarSearch, calendarSearchFilters]);

  useEffect(() => {
    const nextActiveIds = activeAccounts.map((account) => account.id);
    setSplitAccountIds((prev) => {
      const kept = prev.filter((id) => nextActiveIds.includes(id));
      const merged = [...kept, ...nextActiveIds.filter((id) => !kept.includes(id))];
      return merged.slice(0, Math.min(MAX_SPLIT_ACCOUNTS, merged.length));
    });

    if (nextActiveIds.length <= 1 && accountDisplayMode === 'split') {
      setAccountDisplayMode('overlay');
    }
  }, [activeAccounts, accountDisplayMode]);

  useEffect(() => {
    if (filteredMails.length === 0) {
      setSelectedMailId(null);
      return;
    }

    if (!filteredMails.some((mail) => mail.id === selectedMailId)) {
      setSelectedMailId(filteredMails[0].id);
    }
  }, [filteredMails, selectedMailId]);

  const triggerFeedback = (type, payload) => {
    setFeedback({ type, payload });
    if (type === 'L3') {
      setTimeout(() => {
        setFeedback((prev) => (prev.type === 'L3' ? { type: null, payload: null } : prev));
      }, 2600);
    }
  };

  const resetDraftState = () => {
    setCreateDraft({
      isDirty: false,
      saveStatus: 'idle',
      mode: 'create',
      eventId: null,
    });
    setCreateDraftPanels(INITIAL_CREATE_DRAFT_PANELS);
    setCreateDraftBulkInputs(INITIAL_CREATE_DRAFT_BULK_INPUTS);
  };

  const toggleSplitAccount = (id) => {
    setSplitAccountIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== id);
      }
      return [...prev.slice(-(MAX_SPLIT_ACCOUNTS - 1)), id];
    });
  };

  const getDefaultSharingCalendar = () =>
    calendars.find((calendar) => activeCalIds.includes(calendar.id) && calendar.isPrimary && accountMap[calendar.accountId]?.ownership === 'self') ||
    calendars.find((calendar) => calendar.isPrimary && accountMap[calendar.accountId]?.ownership === 'self') ||
    calendars.find((calendar) => activeCalIds.includes(calendar.id) && accountMap[calendar.accountId]?.ownership === 'self') ||
    calendars.find((calendar) => accountMap[calendar.accountId]?.ownership === 'self') ||
    calendars[0] ||
    null;

  const openCalendarPermissions = (calendarId) => {
    setPermissionPanel({ type: 'calendar', targetId: calendarId });
    setContextMenu(null);
  };

  const openMailboxPermissions = (accountId, tab = 'settings') => {
    setPermissionPanel({ type: 'mailbox', targetId: accountId, tab });
    setContextMenu(null);
  };

  const openSharedCalendarAccess = (accountId) => {
    setPermissionPanel({ type: 'shared_access', targetId: accountId });
    setContextMenu(null);
  };

  const closePermissionPanel = () => setPermissionPanel({ type: null, targetId: null });

  const removeSharedAccount = (accountId) => {
    const targetAccount = accounts.find((account) => account.id === accountId);
    if (!targetAccount || targetAccount.ownership !== 'shared') return;

    if (targetAccount.checked && accounts.filter((account) => account.checked).length <= 1) {
      triggerFeedback('L3', {
        msg: '至少保留一个可见账户',
        icon: <AlertCircle size={16} />,
        color: 'bg-slate-900',
      });
      return;
    }

    setAccounts((prev) => prev.filter((account) => account.id !== accountId));
    setCalendars((prev) => prev.filter((calendar) => calendar.accountId !== accountId));
    setSplitAccountIds((prev) => prev.filter((id) => id !== accountId));
    setFocusedAccountId((prev) => (prev === accountId ? null : prev));
    setPermissionPanel((prev) => (prev.targetId === accountId ? { type: null, targetId: null } : prev));
    triggerFeedback('L3', {
      msg: `已移除 ${getAccountDisplayLabel(targetAccount)}`,
      icon: <X size={16} />,
      color: 'bg-slate-900',
    });
  };

  const requestRemoveSharedAccount = (account) => {
    if (!account) return;
    setContextMenu(null);
    closeAccountMenu();
    setFeedback({
      type: 'L4',
      payload: {
        title: '从列表移除该共享日历？',
        desc: `这只会把 ${getAccountDisplayLabel(account)} 从你的共享日历列表和当前视图中移除，不会影响共享方的日历或权限设置。`,
        cancelText: '取消',
        confirmText: '从列表移除',
        onConfirm: () => {
          setFeedback({ type: null, payload: null });
          removeSharedAccount(account.id);
        },
      },
    });
  };

  const renameAccount = (accountId, nextName) => {
    const name = nextName.trim();
    if (!name) {
      triggerFeedback('L3', {
        msg: '名称不能为空',
        icon: <AlertCircle size={16} />,
        color: 'bg-red-600',
      });
      return;
    }

    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? {
              ...account,
              displayName: name,
              name: account.email === account.name ? account.name : name,
            }
          : account,
      ),
    );
    triggerFeedback('L3', {
      msg: '账户名称已更新',
      icon: <Check size={16} />,
      color: 'bg-slate-900',
    });
  };

  const updateAccountColor = (accountId, color) => {
    const account = accounts.find((item) => item.id === accountId);
    if (!account) return;

    setAccounts((prev) => prev.map((item) => (item.id === accountId ? { ...item, color } : item)));
    setCalendars((prev) =>
      prev.map((calendar) =>
        calendar.accountId === accountId && (calendar.isPrimary || calendar.color === account.color)
          ? { ...calendar, color }
          : calendar,
      ),
    );
    triggerFeedback('L3', {
      msg: '账户颜色已更新',
      icon: <Check size={16} />,
      color: 'bg-slate-900',
    });
  };

  const exportAccountCalendar = (accountId) => {
    const account = accounts.find((item) => item.id === accountId);
    const accountCalendars = calendars.filter((calendar) => calendar.accountId === accountId);
    const accountCalendarIds = new Set(accountCalendars.map((calendar) => calendar.id));
    const accountEvents = events.filter((event) => accountCalendarIds.has(event.calId));

    if (!account || accountCalendars.length === 0) {
      triggerFeedback('L3', {
        msg: '该账户暂无可导出的日历',
        icon: <AlertCircle size={16} />,
        color: 'bg-red-600',
      });
      return;
    }

    const escapeIcsText = (value = '') =>
      String(value).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
    const formatIcsDate = (date) =>
      `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const formatIcsDateTime = (date, hourValue = WORK_START_HOUR) => {
      const next = new Date(date);
      const hour = Math.floor(hourValue);
      const minute = Math.round((hourValue - hour) * 60);
      next.setHours(hour, minute, 0, 0);
      return `${formatIcsDate(next)}T${String(next.getHours()).padStart(2, '0')}${String(next.getMinutes()).padStart(2, '0')}00`;
    };
    const calendarById = Object.fromEntries(accountCalendars.map((calendar) => [calendar.id, calendar]));
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Coremail Calendar Demo//CN',
      `X-WR-CALNAME:${escapeIcsText(getAccountDisplayLabel(account))}`,
    ];

    accountEvents.forEach((event) => {
      const date = eventToDate(event);
      const calendar = calendarById[event.calId];
      const uid = `${event.id}@coremail.demo`;
      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${escapeIcsText(uid)}`);
      lines.push(`SUMMARY:${escapeIcsText(event.title || '未命名日程')}`);
      if (event.isAllDay) {
        const endDate = new Date(date.getTime() + DAY_MS);
        lines.push(`DTSTART;VALUE=DATE:${formatIcsDate(date)}`);
        lines.push(`DTEND;VALUE=DATE:${formatIcsDate(endDate)}`);
      } else {
        lines.push(`DTSTART:${formatIcsDateTime(date, event.startH || WORK_START_HOUR)}`);
        lines.push(`DTEND:${formatIcsDateTime(date, (event.startH || WORK_START_HOUR) + (event.durationH || 1))}`);
      }
      if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`);
      if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
      if (calendar?.name) lines.push(`CATEGORIES:${escapeIcsText(calendar.name)}`);
      lines.push('END:VEVENT');
    });
    lines.push('END:VCALENDAR');

    if (typeof document !== 'undefined' && typeof Blob !== 'undefined' && typeof URL !== 'undefined') {
      const safeName = getAccountDisplayLabel(account).replace(/[^\w.-]+/g, '_') || 'calendar';
      const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeName}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    triggerFeedback('L3', {
      msg: `已导出 ${accountEvents.length} 条日程`,
      icon: <FileText size={16} />,
      color: 'bg-slate-900',
    });
  };

  const deleteAccountCalendars = (accountId) => {
    const account = accounts.find((item) => item.id === accountId);
    const accountCalendarIds = calendars.filter((calendar) => calendar.accountId === accountId).map((calendar) => calendar.id);
    const accountCalendarIdSet = new Set(accountCalendarIds);

    if (!account || accountCalendarIds.length === 0) {
      triggerFeedback('L3', {
        msg: '该账户暂无可删除的日历',
        icon: <AlertCircle size={16} />,
        color: 'bg-red-600',
      });
      return;
    }

    setCalendars((prev) => prev.filter((calendar) => !accountCalendarIdSet.has(calendar.id)));
    setEvents((prev) => prev.filter((event) => !accountCalendarIdSet.has(event.calId)));
    if (selectedEventId && events.some((event) => event.id === selectedEventId && accountCalendarIdSet.has(event.calId))) {
      setSelectedEventId(null);
      if (currentScreen === 'details') setCurrentScreen('calendar');
    }
    triggerFeedback('L3', {
      msg: `已删除 ${getAccountDisplayLabel(account)} 的日历`,
      icon: <Trash size={16} />,
      color: 'bg-slate-900',
    });
  };

  const requestDeleteAccountCalendars = (accountId) => {
    const account = accounts.find((item) => item.id === accountId);
    const accountCalendars = calendars.filter((calendar) => calendar.accountId === accountId);
    if (!account || accountCalendars.length === 0) {
      deleteAccountCalendars(accountId);
      return;
    }

    setFeedback({
      type: 'L4',
      payload: {
        title: '删除日历',
        desc: `将删除 ${getAccountDisplayLabel(account)} 下的 ${accountCalendars.length} 个日历及相关日程。该操作仅作用于当前 demo 数据。`,
        cancelText: '取消',
        confirmText: '删除',
        onConfirm: () => {
          setFeedback({ type: null, payload: null });
          deleteAccountCalendars(accountId);
          closePermissionPanel();
        },
      },
    });
  };

  const getNextSharedTemplate = () => {
    const existingEmails = new Set(accounts.map((account) => account.email));
    return SHARED_ACCOUNT_TEMPLATES.find((item) => !existingEmails.has(item.email)) || SHARED_ACCOUNT_TEMPLATES[0];
  };

  const openSharedCalendarDialog = (prefill = null) => {
    const template = prefill || null;
    const hasPendingInvitations = shareInvitations.some((item) => item.status === 'pending');
    setSharedCalendarDialog({
      open: true,
      tab: template ? 'manual' : hasPendingInvitations ? 'inbox' : 'manual',
      name: template?.name || '',
      email: template?.email || '',
      permissionId: template?.permissionId || 'all_details',
      color: template?.color || 'bg-cyan-500',
      lookupState: null,
      lookupMessage: '',
    });
    setContextMenu(null);
  };

  const closeSharedCalendarDialog = () => {
    setSharedCalendarDialog((prev) => ({ ...prev, open: false }));
  };

  const patchSharedCalendarDialog = (patch) => {
    setSharedCalendarDialog((prev) => ({ ...prev, ...patch }));
  };

  const acceptShareInvitation = (inviteId) => {
    const invite = shareInvitations.find((item) => item.id === inviteId);
    if (!invite) return;

    const existingCalendar = calendars.find((calendar) => calendar.owner === invite.senderName && calendar.type === 'shared');
    const permissionLabel = getCalendarPermissionLabel(invite.permissionId);

    if (existingCalendar) {
      setCalendars((prev) =>
        prev.map((calendar) =>
          calendar.id === existingCalendar.id
            ? {
                ...calendar,
                checked: true,
                permission: permissionLabel,
                receivedFrom: invite.senderEmail,
                receivedFromName: invite.senderName,
                receivedPermissionId: invite.permissionId,
                receivedStatus: 'accepted',
                updatedAt: Date.now(),
              }
            : calendar,
        ),
      );
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === existingCalendar.accountId
            ? { ...account, checked: true, name: account.email || invite.senderEmail, displayName: invite.senderName }
            : account,
        ),
      );
    } else {
      const stamp = Date.now();
      const nextAccountId = `acc-${stamp}`;
      const nextCalendarId = `c-${stamp}`;
      setAccounts((prev) => [
        ...prev,
        {
          id: nextAccountId,
          name: invite.senderEmail,
          displayName: invite.senderName,
          email: invite.senderEmail,
          role: '共享日历',
          ownership: 'shared',
          color: invite.color,
          checked: true,
          mailboxMembers: [],
          mailboxSettings: {
            showInAddressList: true,
            saveSentItems: true,
            automap: true,
            mobileAccess: true,
          },
        },
      ]);
      setCalendars((prev) => [
        ...prev,
        {
          id: nextCalendarId,
          accountId: nextAccountId,
          name: invite.senderName,
          type: 'shared',
          owner: invite.senderName,
          color: invite.color,
          checked: true,
          permission: permissionLabel,
          isPrimary: true,
          receivedFrom: invite.senderEmail,
          receivedFromName: invite.senderName,
          receivedPermissionId: invite.permissionId,
          receivedStatus: 'accepted',
          updatedAt: Date.now(),
          defaultSharing: {
            organization: 'busy_only',
            external: 'none',
          },
          publishing: {
            enabled: false,
            permission: 'busy_only',
            htmlLink: `https://calendarpro.io/publish/${nextCalendarId}/html`,
            icsLink: `https://calendarpro.io/publish/${nextCalendarId}/ics`,
          },
          sharing: [],
        },
      ]);
    }

    setShareInvitations((prev) =>
      prev.map((item) =>
        item.id === inviteId
          ? { ...item, status: 'accepted', acceptedAt: Date.now() }
          : item,
      ),
    );
    triggerFeedback('L3', {
      msg: `已添加到共享日历 · 权限：${permissionLabel}`,
      icon: <Check size={16} />,
      color: 'bg-emerald-600',
    });
  };

  const ignoreShareInvitation = (inviteId) => {
    const invite = shareInvitations.find((item) => item.id === inviteId);
    if (!invite) return;
    setShareInvitations((prev) => prev.map((item) => (item.id === inviteId ? { ...item, status: 'ignored', updatedAt: Date.now() } : item)));
    triggerFeedback('L3', {
      msg: `已忽略来自 ${invite.senderName} 的共享邀请`,
      icon: <X size={16} />,
      color: 'bg-slate-900',
    });
  };

  const setShareInvitationPermission = (inviteId, permissionId) => {
    setShareInvitations((prev) =>
      prev.map((item) =>
        item.id === inviteId ? { ...item, permissionId: getCalendarPermissionId(permissionId), updatedAt: Date.now() } : item,
      ),
    );
  };

  const findSharedCalendarGrant = (emailOrName = '') => {
    const parsedMember = parseShareMemberInput(emailOrName);
    const emailKey = normalizeParticipantIdentity(parsedMember?.email || emailOrName);
    const nameKey = normalizeParticipantIdentity(parsedMember?.name || emailOrName);
    const pendingInvite = shareInvitations.find((item) => {
      if (item.status !== 'pending') return false;
      return normalizeParticipantIdentity(item.senderEmail) === emailKey || normalizeParticipantIdentity(item.senderName) === nameKey;
    });

    if (pendingInvite) {
      return {
        type: 'invite',
        inviteId: pendingInvite.id,
        name: pendingInvite.senderName,
        email: pendingInvite.senderEmail,
        permissionId: pendingInvite.permissionId,
        color: pendingInvite.color,
      };
    }

    const template = SHARED_ACCOUNT_TEMPLATES.find((item) => {
      return normalizeParticipantIdentity(item.email) === emailKey || normalizeParticipantIdentity(item.name) === nameKey;
    });

    if (template) {
      return {
        type: 'grant',
        name: template.name,
        email: template.email,
        permissionId: template.permissionId,
        color: template.color,
      };
    }

    return null;
  };

  const submitSharedCalendarDialog = () => {
    const draft = sharedCalendarDialog;
    const parsedMember = parseShareMemberInput(draft.email);
    const email = (parsedMember?.email || draft.email).trim().toLowerCase();
    const name = parsedMember?.name || draft.name.trim() || email;

    if (!email) {
      triggerFeedback('L3', {
        msg: '请输入共享日历账号',
        icon: <AlertCircle size={16} />,
        color: 'bg-red-600',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      triggerFeedback('L3', {
        msg: '邮箱格式不正确',
        icon: <AlertCircle size={16} />,
        color: 'bg-red-600',
      });
      return;
    }

    if (accounts.some((account) => account.email.toLowerCase() === email)) {
    triggerFeedback('L3', {
      msg: '该共享日历已存在',
      icon: <AlertCircle size={16} />,
      color: 'bg-red-600',
    });
      setSharedCalendarDialog((prev) => ({
        ...prev,
        lookupState: 'error',
        lookupMessage: '该共享日历已在左侧列表中。',
      }));
      return;
    }

    const grant = findSharedCalendarGrant(email);
    if (!grant) {
      const message = `${name} 尚未向你共享日历，暂不能添加。`;
      setSharedCalendarDialog((prev) => ({
        ...prev,
        lookupState: 'blocked',
        lookupMessage: message,
      }));
      triggerFeedback('L3', {
        msg: message,
        icon: <AlertCircle size={16} />,
        color: 'bg-amber-600',
      });
      return;
    }

    if (grant.type === 'invite') {
      acceptShareInvitation(grant.inviteId);
      setSharedCalendarDialog((prev) => ({ ...prev, open: false, tab: 'inbox', lookupState: null, lookupMessage: '' }));
      return;
    }

    const stamp = Date.now();
    const nextAccountId = `acc-${stamp}`;
    const nextCalendarId = `c-${stamp}`;
    const permissionId = grant.permissionId || draft.permissionId;
    const permissionLabel = getCalendarPermissionLabel(permissionId);
    const currentUser = accounts.find((account) => account.ownership === 'self');

    setAccounts((prev) => [
      ...prev,
        {
          id: nextAccountId,
        name: grant.email,
        displayName: grant.name,
        email: grant.email,
        role: '共享日历',
          ownership: 'shared',
          color: grant.color || draft.color,
          checked: true,
        mailboxMembers: [
          {
            id: `mb-${stamp}-self`,
            name: currentUser?.name || '我',
            email: currentUser?.email || 'me@calendarpro.io',
            fullAccess: true,
            sendAs: false,
            sendOnBehalf: true,
          },
          {
            id: `mb-${stamp}-owner`,
            name: grant.name,
            email: grant.email,
            fullAccess: true,
            sendAs: true,
            sendOnBehalf: false,
          },
        ],
        mailboxSettings: {
          showInAddressList: true,
          saveSentItems: true,
          automap: true,
          mobileAccess: true,
        },
      },
    ]);
    setCalendars((prev) => [
      ...prev,
      {
        id: nextCalendarId,
        accountId: nextAccountId,
        name: grant.name,
        type: 'shared',
        owner: grant.name,
        color: grant.color || draft.color,
        checked: true,
        permission: permissionLabel,
        isPrimary: true,
        receivedFrom: grant.email,
        receivedFromName: grant.name,
        receivedPermissionId: permissionId,
        receivedStatus: 'accepted',
        updatedAt: Date.now(),
        defaultSharing: {
          organization: 'busy_only',
          external: 'none',
        },
        publishing: {
          enabled: false,
          permission: 'busy_only',
          htmlLink: `https://calendarpro.io/publish/${nextCalendarId}/html`,
          icsLink: `https://calendarpro.io/publish/${nextCalendarId}/ics`,
        },
        sharing: [
          {
            id: `share-${stamp}`,
            name: currentUser?.name || '我',
            email: currentUser?.email || 'me@calendarpro.io',
            scope: 'internal',
            permission: permissionId,
            canViewPrivate: false,
            meetingResponses: 'delegate_only',
          },
        ],
      },
    ]);
    setSharedCalendarDialog((prev) => ({ ...prev, open: false, tab: 'inbox' }));
    triggerFeedback('L3', {
      msg: `已添加到共享日历 · 权限：${permissionLabel}`,
      icon: <Check size={16} />,
      color: 'bg-emerald-600',
    });
  };

  const handleOpenSharingSettings = () => {
    const calendar = getDefaultSharingCalendar();
    if (!calendar) {
      triggerFeedback('L3', {
        msg: '当前没有可设置的日历',
        icon: <AlertCircle size={16} />,
        color: 'bg-red-600',
      });
      return;
    }
    openCalendarPermissions(calendar.id);
  };

  const handleCalendarSync = () => {
    const hiddenAccounts = accounts.filter((account) => !account.checked);
    const busyOnlyCalendars = calendars.filter(
      (calendar) => activeCalIds.includes(calendar.id) && getCalendarPermissionId(calendar.receivedPermissionId || calendar.permission) === 'busy_only',
    );
    const updatedCount = events.filter((event) => activeCalIds.includes(event.calId) && event.status !== '已取消').length;
    const nextReport = {
      ranAt: Date.now(),
      updatedCount,
      calendarCount: activeCalIds.length,
      hiddenAccountCount: hiddenAccounts.length,
      busyOnlyCount: busyOnlyCalendars.length,
    };
    setCalendarSyncReport(nextReport);
    triggerFeedback('L3', {
      msg: `已同步 ${nextReport.calendarCount} 个日历，刷新 ${nextReport.updatedCount} 场会议`,
      icon: <RefreshCw size={16} />,
      color: 'bg-blue-600',
    });
  };

  const handleOpenReminders = () => {
    setReminderDialogOpen(true);
    setContextMenu(null);
  };

  const handleAddSharedCalendar = () => {
    openSharedCalendarDialog();
  };

  const notifyPermissionDenied = (calendarId) => {
    const calendar = calendars.find((item) => item.id === calendarId);
    if (!calendar || calendar.type !== 'shared') return;
    const currentPermissionId = getCalendarPermissionId(calendar.receivedPermissionId || calendar.permission);
    const currentPermissionLabel = getCalendarPermissionLabel(currentPermissionId);
    triggerFeedback('L3', {
      msg: `当前共享日历为"${currentPermissionLabel}"，无法执行此操作`,
      icon: <AlertCircle size={16} />,
      color: 'bg-slate-900',
    });
  };

  /* ===== 日历颜色选择器 ===== */
  const CALENDAR_COLORS = [
    'bg-blue-500', 'bg-cyan-500', 'bg-sky-500',
    'bg-emerald-500', 'bg-green-500', 'bg-teal-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
    'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
    'bg-red-500', 'bg-rose-500', 'bg-pink-500',
    'bg-slate-500', 'bg-gray-500', 'bg-zinc-500',
  ];

  const openColorPicker = (targetId, targetType) => {
    setCalendarColorPicker({ open: true, targetId, targetType });
    setContextMenu(null);
    closeAccountMenu();
  };

  const closeColorPicker = () => setCalendarColorPicker({ open: false, targetId: null, targetType: null });

  const applyCalendarColor = (color) => {
    const { targetId, targetType } = calendarColorPicker;
    if (!targetId) return;
    if (targetType === 'account') {
      setAccounts((prev) => prev.map((a) => a.id === targetId ? { ...a, color } : a));
      setCalendars((prev) => prev.map((c) => c.accountId === targetId ? { ...c, color } : c));
    } else {
      setCalendars((prev) => prev.map((c) => c.id === targetId ? { ...c, color } : c));
      const targetCal = calendars.find((c) => c.id === targetId);
      if (targetCal) {
        setAccounts((prev) => prev.map((a) => a.id === targetCal.accountId ? { ...a, color } : a));
      }
    }
    closeColorPicker();
  };

  /* ===== 日历重命名 ===== */
  const openRenameDialog = (calendarId) => {
    const cal = calendars.find((c) => c.id === calendarId);
    setCalendarRenameDialog({ open: true, targetId: calendarId, name: cal?.name || '' });
    setContextMenu(null);
    closeAccountMenu();
  };

  const closeRenameDialog = () => setCalendarRenameDialog({ open: false, targetId: null, name: '' });

  const submitRename = () => {
    const { targetId, name } = calendarRenameDialog;
    if (!targetId || !name.trim()) return;
    setCalendars((prev) => prev.map((c) => c.id === targetId ? { ...c, name: name.trim() } : c));
    closeRenameDialog();
    triggerFeedback('L3', { msg: '日历名称已更新', icon: <Check size={16} />, color: 'bg-emerald-600' });
  };

  /* ===== 日历导出 .ics ===== */
  const exportCalendarIcs = (calendarId) => {
    const cal = calendars.find((c) => c.id === calendarId);
    if (!cal) return;
    setContextMenu(null);
    closeAccountMenu();
    const calEvents = events.filter((e) => e.calId === calendarId && !e.isAllDay);
    const allDayEvents = events.filter((e) => e.calId === calendarId && e.isAllDay);
    const fmtDate = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const fmtLocal = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Coremail Calendar//CN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:' + cal.name.replace(/[\\;\\,]/g, '\\$&') + '\r\n';
    allDayEvents.forEach((ev) => {
      const sd = ev.date instanceof Date ? ev.date : new Date(ev.date);
      const ed = new Date(sd); ed.setDate(ed.getDate() + Math.max(1, ev.allDaySpan || 1));
      ics += 'BEGIN:VEVENT\r\nSUMMARY:' + (ev.title || '') + '\r\nDTSTART;VALUE=DATE:' + fmtLocal(sd) + '\r\nDTEND;VALUE=DATE:' + fmtLocal(ed) + '\r\nEND:VEVENT\r\n';
    });
    calEvents.forEach((ev) => {
      const baseDate = ev.date instanceof Date ? ev.date : new Date(ev.date);
      const sh = ev.startH || 9;
      const sd = new Date(baseDate); sd.setUTCHours(sh, 0, 0, 0);
      const dur = ev.durationH || 1;
      const ed = new Date(sd); ed.setUTCHours(sd.getUTCHours() + dur);
      ics += 'BEGIN:VEVENT\r\nSUMMARY:' + (ev.title || '') + '\r\nDTSTART:' + fmtDate(sd) + '\r\nDTEND:' + fmtDate(ed) + '\r\n';
      if (ev.location) ics += 'LOCATION:' + ev.location + '\r\n';
      if (ev.description) ics += 'DESCRIPTION:' + ev.description.replace(/\n/g, '\\n') + '\r\n';
      ics += 'END:VEVENT\r\n';
    });
    ics += 'END:VCALENDAR\r\n';
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${cal.name}.ics`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    triggerFeedback('L3', { msg: `${cal.name} 已导出`, icon: <Check size={16} />, color: 'bg-emerald-600' });
  };

  /* ===== 删除日历确认 ===== */
  const openDeleteConfirm = (calendarId) => {
    setCalendarDeleteConfirm({ open: true, targetId: calendarId });
    setContextMenu(null);
    closeAccountMenu();
  };

  const closeDeleteConfirm = () => setCalendarDeleteConfirm({ open: false, targetId: null });

  const confirmDeleteCalendar = () => {
    const { targetId } = calendarDeleteConfirm;
    if (!targetId) return;
    const cal = calendars.find((c) => c.id === targetId);
    setCalendars((prev) => prev.filter((c) => c.id !== targetId));
    if (cal?.isPrimary) {
      setAccounts((prev) => prev.filter((a) => a.id !== cal.accountId));
    }
    closeDeleteConfirm();
    triggerFeedback('L3', { msg: cal ? `${cal.name} 已删除` : '日历已删除', icon: <Trash size={16} />, color: 'bg-red-600' });
  };

  const startTimeSelection = (slot) => {
    const normalized = normalizeSelectionSlot({
      ...slot,
      startH: slot.hour,
      endH: slot.hour + 1,
      durationH: 1,
    });
    hideEventPreview();
    const nextSelection = {
      ...normalized,
      anchorH: slot.hour,
    };
    timeSelectionRef.current = nextSelection;
    selectionDraggedRef.current = false;
    isSelectingTimeRef.current = true;
    setTimeSelection(nextSelection);
    setSelectedEventId(null);
    setIsSelectingTime(true);
    setContextMenu(null);
  };

  const updateTimeSelection = (slot) => {
    if (!isSelectingTimeRef.current) return;
    setTimeSelection((prev) => {
      if (!prev) return prev;
      if (!sameDay(prev.date, stripTime(slot.date))) return prev;
      if ((prev.laneId || null) !== (slot.laneId || null)) return prev;

      const startH = Math.min(prev.anchorH, slot.hour);
      const endH = Math.max(prev.anchorH + 1, slot.hour + 1);
      const nextSelection = {
        ...prev,
        startH,
        endH,
        durationH: endH - startH,
        preferredAccountId: prev.preferredAccountId || slot.preferredAccountId || null,
      };
      if (slot.hour !== prev.anchorH) {
        selectionDraggedRef.current = true;
      }
      timeSelectionRef.current = nextSelection;
      return nextSelection;
    });
  };

  const clearTimeSelection = () => {
    timeSelectionRef.current = null;
    isSelectingTimeRef.current = false;
    selectionDraggedRef.current = false;
    setTimeSelection(null);
    setIsSelectingTime(false);
  };
  const syncEventInteraction = (valueOrUpdater) => {
    setEventInteraction((prev) => {
      const next = typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater;
      eventInteractionRef.current = next;
      return next;
    });
  };

  const clearPreviewCloseTimer = () => {
    if (!previewCloseTimerRef.current) return;
    window.clearTimeout(previewCloseTimerRef.current);
    previewCloseTimerRef.current = null;
  };

  const showEventPreview = (entry, eventId) => {
    if (eventInteractionRef.current || !eventId) return;
    const { x, y } = getPreviewPosition(entry.clientX, entry.clientY);
    clearPreviewCloseTimer();
    setHoverPreview((prev) => (prev?.eventId === eventId ? prev : { eventId, x, y }));
  };

  const hideEventPreview = (eventId = null, options = {}) => {
    clearPreviewCloseTimer();
    const closePreview = () => setHoverPreview((prev) => {
      if (!prev) return prev;
      if (eventId && prev.eventId !== eventId) return prev;
      return null;
    });

    if (eventId && !options.immediate && typeof window !== 'undefined') {
      previewCloseTimerRef.current = window.setTimeout(closePreview, 140);
      return;
    }

    closePreview();
  };

  const joinEventFromPreview = (event) => {
    if (!event?.meetingLink) return;
    hideEventPreview(event.id, { immediate: true });
    openExternalLink(event.meetingLink, '已打开会议链接');
  };

  const startEventMove = (entry, event) => {
    const calendar = calendarMap[event.calId];
    if (
      entry.button !== 0 ||
      !calendar ||
      event.isAllDay ||
      event.type === 'busy_only' ||
      event.status === '已取消'
    ) {
      return;
    }

    if (!canEditCalendarContent(calendar)) {
      if (calendar.type === 'shared') notifyPermissionDenied(calendar.id);
      return;
    }

    entry.preventDefault();
    entry.stopPropagation();
    clearTimeSelection();
    setContextMenu(null);
    hideEventPreview();

    const date = stripTime(eventToDate(event));
    const baseStartH = event.startH || WORK_START_HOUR;
    const baseDurationH = event.durationH || 1;
    const parts = dateToEventParts(date);

    syncEventInteraction({
      type: 'move',
      eventId: event.id,
      startPoint: { x: entry.clientX, y: entry.clientY },
      pointer: getPreviewPosition(entry.clientX, entry.clientY),
      changed: false,
      origin: {
        date,
        startH: baseStartH,
        durationH: baseDurationH,
        weekOffset: parts.weekOffset,
        day: parts.day,
      },
      next: {
        date,
        startH: baseStartH,
        durationH: baseDurationH,
        weekOffset: parts.weekOffset,
        day: parts.day,
      },
    });
  };

  const startEventResize = (entry, event, edge = 'bottom') => {
    const calendar = calendarMap[event.calId];
    if (
      entry.button !== 0 ||
      !calendar ||
      event.isAllDay ||
      event.type === 'busy_only' ||
      event.status === '已取消'
    ) {
      return;
    }

    if (!canEditCalendarContent(calendar)) {
      if (calendar.type === 'shared') notifyPermissionDenied(calendar.id);
      return;
    }

    entry.preventDefault();
    entry.stopPropagation();
    clearTimeSelection();
    setContextMenu(null);
    hideEventPreview();

    const date = stripTime(eventToDate(event));
    const baseStartH = event.startH || WORK_START_HOUR;
    const baseDurationH = event.durationH || 1;
    const parts = dateToEventParts(date);

    syncEventInteraction({
      type: 'resize',
      edge,
      eventId: event.id,
      startPoint: { x: entry.clientX, y: entry.clientY },
      pointer: getPreviewPosition(entry.clientX, entry.clientY),
      changed: false,
      origin: {
        date,
        startH: baseStartH,
        durationH: baseDurationH,
        weekOffset: parts.weekOffset,
        day: parts.day,
      },
      next: {
        date,
        startH: baseStartH,
        durationH: baseDurationH,
        weekOffset: parts.weekOffset,
        day: parts.day,
      },
    });
  };

  const openEventDetails = (eventId) => {
    if (!eventId || Date.now() < suppressOpenUntilRef.current) return;
    hideEventPreview();
    navTo('details', eventId);
  };
  const selectCalendarEvent = (eventId) => {
    if (!eventId) return;
    clearTimeSelection();
    setSelectedEventId(eventId);
    setShowRightSidebar(false);
  };
  const locateEventInCalendar = (eventId) => {
    const targetEvent = events.find((event) => event.id === eventId);
    if (!targetEvent) return;

    if (locateFlashTimerRef.current) {
      window.clearTimeout(locateFlashTimerRef.current);
    }
    setFlashingEventId(null);
    setFocusDate(stripTime(eventToDate(targetEvent)));
    setSelectedEventId(eventId);
    setShowRightSidebar(false);
    setCurrentScreen('calendar');
    setCalendarReturnScreen('calendar');

    const scrollToLocatedEvent = () => {
      const target = document.querySelector(`[data-event-card-id="${eventId}"]`);
      if (target) {
        target.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
      }
    };

    [80, 220, 420].forEach((delay) => window.setTimeout(scrollToLocatedEvent, delay));
    window.setTimeout(() => {
      scrollToLocatedEvent();
      setFlashingEventId(eventId);
      locateFlashTimerRef.current = window.setTimeout(() => setFlashingEventId(null), 2600);
    }, 120);
  };
  const executeCalendarSearch = (query = calendarSearchQuery) => {
    const nextQuery = query.trim();

    if (!nextQuery) {
      setCurrentScreen('calendar');
      setCalendarReturnScreen('calendar');
      return;
    }

    setCalendarSearchQuery(nextQuery);
    setCalendarSearchPopoverOpen(false);
    setCalendarRecentSearches((prev) => [nextQuery, ...prev.filter((item) => item !== nextQuery)].slice(0, 5));
    clearTimeSelection();
    hideEventPreview();
    setShowRightSidebar(false);
    setSelectedEventId(null);
    setCurrentScreen('search');
    setCalendarReturnScreen('search');
  };
  const clearCalendarSearch = () => {
    setCalendarSearchQuery('');
    setCalendarSearchPopoverOpen(false);
    setCurrentScreen('calendar');
    setCalendarReturnScreen('calendar');
  };

  const adjustSelectionDuration = (durationH) => {
    setTimeSelection((prev) => {
      if (!prev) return prev;
      const normalized = normalizeSelectionSlot(prev);
      const safeStartH = clampStartHour(normalized.startH, durationH);
      const safeDurationH = clampDuration(durationH, safeStartH);

      return {
        ...normalized,
        startH: safeStartH,
        endH: safeStartH + safeDurationH,
        durationH: safeDurationH,
      };
    });
  };

  const openSlotContextMenu = (event, slot) => {
    event.preventDefault();
    event.stopPropagation();
    hideEventPreview();
    const normalizedSlot = normalizeSelectionSlot({
      ...slot,
      startH: slot.hour,
      endH: slot.hour + 1,
      durationH: 1,
    });
    const targetSlot = selectionMatchesSlot(timeSelection, slot) ? normalizeSelectionSlot(timeSelection) : normalizedSlot;
    const x = Math.min(event.clientX, window.innerWidth - 240);
    const y = Math.min(event.clientY, window.innerHeight - 220);
    setContextMenu({ x, y, slot: targetSlot });
  };

  const openMailComposer = (mode = 'new', mailId = null) => {
    const sourceMail = mailId ? mails.find((mail) => mail.id === mailId) : null;
    const normalizedMode = sourceMail?.folder === 'drafts' && mode === 'new' ? 'editDraft' : mode;
    const fallbackAccountId = sourceMail?.accountId || activeAccountIds[0] || accounts[0]?.id || 'acc1';
    hideEventPreview();
    setMailComposer({
      open: true,
      mode: normalizedMode,
      sourceMailId: sourceMail?.id || null,
      draft: buildMailDraft({
        mode: normalizedMode,
        mail: sourceMail,
        fallbackAccountId,
      }),
    });
    setActiveProduct('mail');
    if (sourceMail?.id) setSelectedMailId(sourceMail.id);
  };

  const closeMailComposer = () => {
    setMailComposer((prev) => ({ ...prev, open: false }));
  };

  const patchMailComposer = (patch) => {
    setMailComposer((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        ...patch,
      },
    }));
  };

  const addMailRecipient = (field, email) => {
    setMailComposer((prev) => {
      const current = parseRecipients(prev.draft[field]);
      if (current.includes(email)) return prev;
      return {
        ...prev,
        draft: {
          ...prev.draft,
          [field]: joinRecipients([...current, email]),
        },
      };
    });
  };

  const addMailAttachment = () => {
    setMailComposer((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        attachments: [
          ...prev.draft.attachments,
          {
            name: `附件_${prev.draft.attachments.length + 1}.pdf`,
            size: `${0.6 + prev.draft.attachments.length * 0.4} MB`,
          },
        ],
      },
    }));
  };

  const removeMailAttachment = (index) => {
    setMailComposer((prev) => ({
      ...prev,
      draft: {
        ...prev.draft,
        attachments: prev.draft.attachments.filter((_, currentIndex) => currentIndex !== index),
      },
    }));
  };

  const saveMailComposer = (mode) => {
    const draft = mailComposer.draft;
    const to = parseRecipients(draft.to);
    const cc = parseRecipients(draft.cc);
    if (mode === 'send' && to.length === 0) {
      triggerFeedback('L3', {
        msg: '请先填写收件人',
        icon: <AlertCircle size={16} />,
        color: 'bg-red-600',
      });
      return;
    }

    const account = accountMap[draft.accountId] || accounts[0];
    const nextId = draft.mailId || `mail-${Date.now()}`;
    const nextMail = {
      id: nextId,
      accountId: draft.accountId || account?.id || 'acc1',
      folder: mode === 'send' ? 'sent' : 'drafts',
      category: 'focused',
      unread: false,
      starred: false,
      subject: draft.subject.trim() || '(无主题)',
      fromName: account?.name || '我',
      fromEmail: account?.email || 'me@calendarpro.io',
      to,
      cc,
      preview: draft.body.trim().split('\n').find(Boolean) || '(无正文)',
      body: draft.body.trim(),
      attachments: draft.attachments,
      timestamp: Date.now(),
      linkedEventId: mails.find((mail) => mail.id === mailComposer.sourceMailId)?.linkedEventId || null,
    };

    setMails((prev) => {
      const exists = prev.some((mail) => mail.id === nextId);
      if (exists) {
        return prev.map((mail) => (mail.id === nextId ? { ...mail, ...nextMail } : mail));
      }
      return [nextMail, ...prev];
    });
    setMailFolder(mode === 'send' ? 'sent' : 'drafts');
    setSelectedMailId(nextId);
    setActiveProduct('mail');
    setMailComposer((prev) => ({ ...prev, open: false }));
    triggerFeedback('L3', {
      msg: mode === 'send' ? '邮件已发送' : '邮件已保存到草稿',
      icon: <Mail size={16} />,
      color: mode === 'send' ? 'bg-emerald-600' : 'bg-slate-900',
    });
  };

  const handleSelectMail = (mailId) => {
    setSelectedMailId(mailId);
    setMails((prev) => prev.map((mail) => (mail.id === mailId ? { ...mail, unread: false } : mail)));
  };

  const toggleMailStar = (mailId) => {
    setMails((prev) => prev.map((mail) => (mail.id === mailId ? { ...mail, starred: !mail.starred } : mail)));
  };

  const toggleMailRead = (mailId) => {
    setMails((prev) => prev.map((mail) => (mail.id === mailId ? { ...mail, unread: !mail.unread } : mail)));
  };

  const archiveMail = (mailId) => {
    setMails((prev) =>
      prev.map((mail) =>
        mail.id === mailId
          ? {
              ...mail,
              folder: 'archive',
              unread: false,
            }
          : mail,
      ),
    );
    setMailFolder('archive');
    triggerFeedback('L3', {
      msg: '邮件已存档',
      icon: <Archive size={16} />,
      color: 'bg-slate-900',
    });
  };

  const createEventFromMail = (mailId) => {
    const mail = mails.find((item) => item.id === mailId);
    if (!mail) return;

    const nextDraft = buildDraftForm({
      event: null,
      slot: { date: stripTime(focusDate), h: 15 },
      focusDate,
      calendars,
      activeAccountIds,
    });
    const attendees = Array.from(new Set([mail.fromEmail, ...(mail.to || []), ...(mail.cc || [])].filter(Boolean)));
    const optionalAttendees = Array.from(new Set(mail.cc || [])).filter(Boolean);
    setDraftForm({
      ...nextDraft,
      title: mail.subject,
      description: `来源邮件：${mail.subject}\n发件人：${mail.fromName} <${mail.fromEmail}>\n\n${mail.body}`,
      attendees: (mail.to || []).length ? Array.from(new Set([mail.fromEmail, ...(mail.to || [])].filter(Boolean))) : attendees.length ? attendees : nextDraft.attendees,
      optionalAttendees,
      attachments: (mail.attachments || []).map((item) => (typeof item === 'string' ? item : item?.name)).filter(Boolean),
      inviteInput: '',
      optionalInviteInput: '',
    });
    setCreateDraft({
      isDirty: false,
      saveStatus: 'idle',
      mode: 'create',
      eventId: null,
    });
    setCreateDraftPanels(INITIAL_CREATE_DRAFT_PANELS);
    setCreateDraftBulkInputs(INITIAL_CREATE_DRAFT_BULK_INPUTS);
    setActiveProduct('calendar');
    setCurrentScreen('create');
    setFocusDate(stripTime(nextDraft.date));
    triggerFeedback('L3', {
      msg: '已从邮件生成日程草稿',
      icon: <Calendar size={16} />,
      color: 'bg-blue-600',
    });
  };

  const copyTextToClipboard = async (text, successMessage) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (typeof document !== 'undefined') {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      } else {
        throw new Error('clipboard unavailable');
      }

      triggerFeedback('L3', {
        msg: successMessage,
        icon: <Check size={16} />,
        color: 'bg-slate-900',
      });
    } catch (error) {
      triggerFeedback('L3', {
        msg: '复制失败，请手动复制链接',
        icon: <AlertCircle size={16} />,
        color: 'bg-red-600',
      });
    }
  };

  const openExternalLink = (url, successMessage = '已打开链接') => {
    if (!url) return;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    triggerFeedback('L3', {
      msg: successMessage,
      icon: <ArrowRight size={16} />,
      color: 'bg-blue-600',
    });
  };

  const copyCalendarPublishLink = (calendarId, key) => {
    const calendar = calendars.find((item) => item.id === calendarId);
    const link = calendar?.publishing?.[key];
    if (!calendar?.publishing?.enabled || !link) return;

    copyTextToClipboard(link, key === 'htmlLink' ? 'HTML 发布链接已复制' : 'ICS 订阅链接已复制');
  };

  const updateCalendarShare = (calendarId, shareId, patch) => {
    const currentShare = calendars
      .find((calendar) => calendar.id === calendarId)
      ?.sharing?.find((share) => share.id === shareId);

    setCalendars((prev) =>
      prev.map((calendar) => {
        if (calendar.id !== calendarId) return calendar;

        const sharing = calendar.sharing.map((share) => {
          if (share.id !== shareId) return share;

          const nextShare = {
            ...share,
            ...patch,
            permission: getCalendarPermissionId(patch.permission ?? share.permission),
            updatedAt: Date.now(),
          };
          const allowedOptions = CALENDAR_PERMISSION_OPTIONS;

          if (!allowedOptions.some((option) => option.id === nextShare.permission)) {
            nextShare.permission = 'all_details';
          }

          nextShare.canViewPrivate = false;
          nextShare.meetingResponses = 'none';

          return nextShare;
        });

        return { ...calendar, sharing };
      }),
    );
    const shouldNotify = ['permission', 'scope', 'canViewPrivate', 'meetingResponses'].some((key) => key in patch);
    if (shouldNotify) {
      triggerFeedback('L3', {
        msg: currentShare?.status === 'accepted' ? '日历共享权限已更新' : '已更新待接受权限，对方接受后生效',
        icon: <Check size={16} />,
        color: 'bg-blue-600',
      });
    }
  };

  const addCalendarShare = (calendarId, member = {}) => {
    const targetCalendar = calendars.find((calendar) => calendar.id === calendarId);
    const isLegacyScope = typeof member === 'string';
    const parsedMember = isLegacyScope ? null : parseShareMemberInput(member.email || member.name || '');
    const nextMember = isLegacyScope
      ? {
          name: '新共享成员',
          email: 'new.member@calendarpro.io',
          scope: member,
          permission: 'all_details',
        }
      : {
          ...(parsedMember || {}),
          ...member,
          permission: getCalendarPermissionId(member.permission || member.permissionId || 'all_details'),
        };
    const normalizedEmail = normalizeParticipantIdentity(nextMember.email || nextMember.name || '');

    if (!targetCalendar || !normalizedEmail) {
      triggerFeedback('L3', {
        msg: '请输入姓名或邮箱',
        icon: <AlertCircle size={16} />,
        color: 'bg-red-600',
      });
      return;
    }

    const duplicated = (targetCalendar.sharing || []).some(
      (share) =>
        normalizeParticipantIdentity(share.email || '') === normalizedEmail ||
        normalizeParticipantIdentity(share.name || '') === normalizeParticipantIdentity(nextMember.name || ''),
    );
    if (duplicated) {
      triggerFeedback('L3', {
        msg: '该成员已在共享列表中',
        icon: <AlertCircle size={16} />,
        color: 'bg-slate-900',
      });
      return;
    }

    setCalendars((prev) =>
      prev.map((calendar) =>
        calendar.id === calendarId
          ? {
              ...calendar,
              sharing: [
                ...(calendar.sharing || []),
                {
                  id: `share-${Date.now()}`,
                  name: nextMember.name || nextMember.email,
                  email: nextMember.email || nextMember.name,
                  scope: nextMember.scope || (String(nextMember.email || '').includes('@calendarpro.io') ? 'internal' : 'external'),
                  permission: nextMember.permission,
                  status: 'pending',
                  updatedAt: Date.now(),
                  canViewPrivate: false,
                  meetingResponses: 'none',
                },
              ],
            }
          : calendar,
      ),
    );
    triggerFeedback('L3', {
      msg: `已发送给 ${nextMember.name || nextMember.email}，待对方接受后生效`,
      icon: <Send size={16} />,
      color: 'bg-blue-600',
    });
  };

  const updateCalendarDefaultSharing = (calendarId, key, value) => {
    setCalendars((prev) =>
      prev.map((calendar) =>
        calendar.id === calendarId
          ? {
              ...calendar,
              defaultSharing: {
                ...calendar.defaultSharing,
                [key]: value,
              },
            }
          : calendar,
      ),
    );
    triggerFeedback('L3', {
      msg: '默认共享权限已更新',
      icon: <Check size={16} />,
      color: 'bg-blue-600',
    });
  };

  const updateCalendarPublishing = (calendarId, patch) => {
    setCalendars((prev) =>
      prev.map((calendar) =>
        calendar.id === calendarId
          ? {
              ...calendar,
              publishing: {
                ...calendar.publishing,
                ...patch,
              },
            }
          : calendar,
      ),
    );
  };

  const resetCalendarPublishLinks = (calendarId) => {
    const stamp = Date.now();
    setCalendars((prev) =>
      prev.map((calendar) =>
        calendar.id === calendarId
          ? {
              ...calendar,
              publishing: {
                ...calendar.publishing,
                htmlLink: `https://calendarpro.io/publish/${calendar.id}/html?v=${stamp}`,
                icsLink: `https://calendarpro.io/publish/${calendar.id}/ics?v=${stamp}`,
              },
            }
          : calendar,
      ),
    );
    triggerFeedback('L3', {
      msg: '发布链接已重置',
      icon: <RefreshCw size={16} />,
      color: 'bg-slate-900',
    });
  };

  const removeCalendarShare = (calendarId, shareId) => {
    const calendar = calendars.find((item) => item.id === calendarId);
    const targetShare = calendar?.sharing.find((share) => share.id === shareId);
    if (!calendar || !targetShare) return;

    setFeedback({
      type: 'L4',
      payload: {
        title: '移除共享权限',
        desc: `移除后，${targetShare.name || targetShare.email} 将不再拥有此账户的访问权限。`,
        cancelText: '取消',
        confirmText: '移除',
        onConfirm: () => {
          setFeedback({ type: null, payload: null });
          setCalendars((prev) =>
            prev.map((item) =>
              item.id === calendarId
                ? {
                    ...item,
                    sharing: (item.sharing || []).filter((share) => share.id !== shareId),
                  }
                : item,
            ),
          );
          triggerFeedback('L3', {
            msg: `已移除 ${targetShare.name || targetShare.email}`,
            icon: <Trash size={16} />,
            color: 'bg-slate-900',
          });
        },
      },
    });
  };

  const updateMailboxMember = (accountId, memberId, patch) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? {
              ...account,
              mailboxMembers: account.mailboxMembers.map((member) =>
                member.id === memberId ? { ...member, ...patch } : member,
              ),
            }
          : account,
      ),
    );
  };

  const toggleMailboxMemberPermission = (accountId, memberId, permissionKey) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? {
              ...account,
              mailboxMembers: account.mailboxMembers.map((member) =>
                member.id === memberId ? { ...member, [permissionKey]: !member[permissionKey] } : member,
              ),
            }
          : account,
      ),
    );
    triggerFeedback('L3', {
      msg: '共享邮箱权限已更新',
      icon: <Check size={16} />,
      color: 'bg-slate-900',
    });
  };

  const setMailboxMemberPermission = (accountId, memberId, permissionKey) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? {
              ...account,
              mailboxMembers: account.mailboxMembers.map((member) =>
                member.id === memberId
                  ? {
                      ...member,
                      fullAccess: permissionKey === 'fullAccess',
                      sendAs: permissionKey === 'sendAs',
                      sendOnBehalf: permissionKey === 'sendOnBehalf',
                    }
                  : member,
              ),
            }
          : account,
      ),
    );
    triggerFeedback('L3', {
      msg: '成员权限已更新',
      icon: <Check size={16} />,
      color: 'bg-slate-900',
    });
  };

  const addMailboxMember = (accountId) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? {
              ...account,
              mailboxMembers: [
                ...account.mailboxMembers,
                {
                  id: `member-${Date.now()}`,
                  name: '新成员',
                  email: 'new.member@calendarpro.io',
                  fullAccess: true,
                  sendAs: false,
                  sendOnBehalf: true,
                },
              ],
            }
          : account,
      ),
    );
  };

  const removeMailboxMember = (accountId, memberId) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? { ...account, mailboxMembers: account.mailboxMembers.filter((member) => member.id !== memberId) }
          : account,
      ),
    );
  };

  const toggleMailboxSetting = (accountId, key) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId
          ? {
              ...account,
              mailboxSettings: {
                ...account.mailboxSettings,
                [key]: !account.mailboxSettings[key],
              },
            }
          : account,
      ),
    );
  };

  const confirmDiscardDraft = (onConfirm, options = {}) => {
    triggerFeedback('L4', {
      title: options.title || '放弃未保存的草稿？',
      desc: options.desc || '您已经输入了会议内容，如果现在离开，所有未保存的修改将会丢失。',
      confirmText: options.confirmText || '丢弃并离开',
      cancelText: options.cancelText || '继续编辑',
      secondaryText: options.secondaryText,
      onSecondary: options.onSecondary,
      isDestructive: options.isDestructive ?? true,
      onConfirm: () => {
        setFeedback({ type: null, payload: null });
        resetDraftState();
        onConfirm();
      },
    });
  };

  const confirmLeaveCreate = (onDiscard, onSaveDraft = null) => {
    confirmDiscardDraft(onDiscard, {
      title: '关闭这场会议？',
      desc: '可以继续编辑，也可以先仅保存不发送，避免误操作直接把通知发给与会人。',
      confirmText: '放弃修改',
      cancelText: '继续编辑',
      secondaryText: onSaveDraft ? '仅保存不发送' : null,
      onSecondary: onSaveDraft,
    });
  };

  const openCreateView = (eventId = null, slot = null) => {
    const editingEvent = eventId ? events.find((event) => event.id === eventId) : null;
    const editingCalendar = editingEvent ? calendarMap[editingEvent.calId] : null;
    if (editingEvent && editingCalendar && !canEditCalendarContent(editingCalendar)) {
      if (editingCalendar.type === 'shared') notifyPermissionDenied(editingCalendar.id);
      return;
    }
    const nextDraft = buildDraftForm({
      event: editingEvent || null,
      slot,
      focusDate,
      calendars,
      activeAccountIds,
    });

    setDraftForm(nextDraft);
    setCreateDraft({
      isDirty: false,
      saveStatus: 'idle',
      mode: editingEvent ? 'edit' : 'create',
      eventId: editingEvent?.id ?? null,
    });
    setCreateDraftPanels(INITIAL_CREATE_DRAFT_PANELS);
    setCreateDraftBulkInputs(INITIAL_CREATE_DRAFT_BULK_INPUTS);
    setFocusDate(stripTime(nextDraft.date));
  };

  const navTo = (screen, eventId = null, draftSlot = null) => {
    const proceed = () => {
      setActiveProduct('calendar');
      setContextMenu(null);
      clearTimeSelection();
      setHoverPreview(null);
      eventInteractionRef.current = null;
      setEventInteraction(null);
      setSelectedEventId(eventId);

      if (screen === 'create') {
        openCreateView(eventId, draftSlot);
      } else if (screen === 'details' && eventId) {
        setFocusDate(stripTime(eventToDate(events.find((event) => event.id === eventId) || { weekOffset: 0, day: 0 })));
        resetDraftState();
      } else {
        resetDraftState();
      }

      if (screen === 'details') {
        setCalendarReturnScreen(currentScreen === 'search' ? 'search' : 'calendar');
      } else if (screen === 'calendar' || screen === 'search') {
        setCalendarReturnScreen(screen);
      }

      setCurrentScreen(screen);
    };

    if (currentScreen === 'create' && createDraft.isDirty && screen !== 'create') {
      confirmLeaveCreate(proceed, () => saveDraft('draft', { afterSave: () => proceed() }));
      return;
    }

    proceed();
  };
  navToRef.current = navTo;

  const scrollTimelineViewportToWorkStart = (layoutOverride = calendarLayout) => {
    if (layoutOverride !== 'day' && layoutOverride !== 'week') return;

    const target =
      (layoutOverride === 'day' ? dayTimelineScrollRef.current : weekTimelineScrollRef.current) ||
      (typeof document !== 'undefined' ? document.querySelector(`[data-timeline-scroll="${layoutOverride}"]`) : null);
    if (!target) return;

    const headerHeight =
      layoutOverride === 'week' && effectiveAccountDisplayMode === 'split' && displayAccounts.length > 0
        ? TIMELINE_HEADER_HEIGHT + SPLIT_WEEK_PANE_HEADER_HEIGHT
        : TIMELINE_HEADER_HEIGHT;
    const scrollTop = getWorkdayScrollTop(headerHeight);
    scrollElementToTop(target, scrollTop);
  };

  const queueTimelineScrollToWorkStart = (layoutOverride = calendarLayout) => {
    if (layoutOverride !== 'day' && layoutOverride !== 'week') return;
    setTimelineScrollToken((prev) => prev + 1);

    if (typeof window === 'undefined') return;

    const run = () => scrollTimelineViewportToWorkStart(layoutOverride);
    [0, 80, 180, 320, 520].forEach((delay) => window.setTimeout(run, delay));
    window.requestAnimationFrame(() => {
      run();
      window.requestAnimationFrame(run);
    });
  };

  const restoreCalendarLandingView = () => {
    setCalendarLayout('week');
    setAccountDisplayMode('overlay');
    setShowRightSidebar(false);
    setCalendarSearchQuery('');
    setCalendarReturnScreen('calendar');
    setFocusDate(stripTime(TODAY_DATE));
    setSelectedEventId(null);
    queueTimelineScrollToWorkStart('week');
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (!isSelectingTimeRef.current) return;

      isSelectingTimeRef.current = false;
      setIsSelectingTime(false);

      const latestSelection = timeSelectionRef.current;
      const didDragSelect = selectionDraggedRef.current;
      selectionDraggedRef.current = false;

      if (!latestSelection) return;

      if (didDragSelect) {
        const normalizedSelection = normalizeSelectionSlot(latestSelection);
        clearTimeSelection();
        navTo('create', null, normalizedSelection);
        return;
      }

      setTimeSelection(normalizeSelectionSlot(latestSelection));
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => {
    if (activeProduct !== 'calendar' || currentScreen !== 'calendar') return;
    queueTimelineScrollToWorkStart(calendarLayout);
  }, [activeProduct, calendarLayout, currentScreen, focusDate, effectiveAccountDisplayMode]);

  const handleProductSelect = (productId) => {
    const proceed = () => {
      setActiveProduct(productId);
      setContextMenu(null);
      clearTimeSelection();
      setHoverPreview(null);
      eventInteractionRef.current = null;
      setEventInteraction(null);
      if (productId === 'calendar') {
        restoreCalendarLandingView();
        setCurrentScreen('calendar');
      }
    };

    if (currentScreen === 'create' && createDraft.isDirty && productId !== 'calendar') {
      confirmLeaveCreate(proceed, () => saveDraft('draft', { afterSave: () => proceed() }));
      return;
    }

    if (productId !== 'calendar') {
      triggerFeedback('L3', {
        msg: `已切换到${PRODUCT_TABS.find((item) => item.id === productId)?.label || '其他模块'}`,
        icon: productId === 'mail' ? <Mail size={16} /> : productId === 'contacts' ? <Users size={16} /> : <Settings size={16} />,
        color: 'bg-slate-900',
      });
    }

    proceed();
  };

  const markDraftDirty = () => {
    setCreateDraft((prev) => ({ ...prev, isDirty: true, saveStatus: 'saving' }));
    setTimeout(() => {
      setCreateDraft((prev) => (prev.isDirty ? { ...prev, saveStatus: 'saved' } : prev));
    }, 700);
  };

  const patchDraft = (patch) => {
    setDraftForm((prev) => ({ ...prev, ...patch }));
    markDraftDirty();
  };

  const handleDraftAccountChange = (accountId) => {
    const nextCalendar =
      editableCalendars.find((calendar) => calendar.accountId === accountId && calendar.type === 'my') ||
      editableCalendars.find((calendar) => calendar.accountId === accountId);
    const nextAccount = accountMap[accountId];

    if (!nextCalendar) return;

    patchDraft({
      calId: nextCalendar.id,
      organizer: nextAccount?.email || nextCalendar.owner || '我',
    });
  };

  const handleDraftCalendarChange = (calendarId) => {
    const nextCalendar = editableCalendars.find((calendar) => calendar.id === calendarId);
    if (!nextCalendar) return;
    const nextAccount = accountMap[nextCalendar.accountId];

    patchDraft({
      calId: nextCalendar.id,
      organizer: nextAccount?.email || nextCalendar.owner || '我',
    });
  };

  const setDraftMeetingProvider = (meetingProvider) => {
    setDraftForm((prev) => ({
      ...prev,
      meetingProvider,
      meetingLink:
        meetingProvider === 'none' || meetingProvider === 'phone'
          ? ''
          : prev.meetingProvider === meetingProvider && prev.meetingLink
            ? prev.meetingLink
            : buildConferenceLink(meetingProvider, prev.title || '会议'),
      location: meetingProvider === 'phone' && !prev.location.trim() ? '电话或线下待补充' : prev.location,
    }));
    markDraftDirty();
  };

  const updateDraftSchedule = ({ date = draftForm.date, startH = draftForm.startH, durationH = draftForm.durationH }) => {
    const baseDate = stripTime(date);
    const safeStartH = clampStartHour(startH, durationH);
    const safeDurationH = clampDuration(durationH, safeStartH);
    const parts = dateToEventParts(baseDate);

    patchDraft({
      date: baseDate,
      weekOffset: parts.weekOffset,
      day: parts.day,
      startH: safeStartH,
      durationH: safeDurationH,
      timeText: formatDraftTime(baseDate, safeStartH, safeDurationH),
    });
    setFocusDate(baseDate);
  };

  const handleDraftDateChange = (value) => {
    if (!value) return;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return;
    updateDraftSchedule({ date: new Date(year, month - 1, day) });
  };

  const handleDraftStartTimeChange = (value) => {
    if (!value) return;
    const nextStartH = Number(value);
    if (Number.isNaN(nextStartH)) return;
    updateDraftSchedule({
      startH: nextStartH,
      durationH: draftForm.durationH,
    });
  };

  const updateDraftEndBoundary = (endDate, endH) => {
    const nextDuration = getDraftDurationBetween(draftForm.date, draftForm.startH, endDate, endH);

    if (nextDuration <= 0) {
      triggerFeedback('L3', {
        msg: '结束时间需晚于开始时间',
        icon: <AlertCircle size={16} />,
        color: 'bg-red-600',
      });
      return;
    }

    updateDraftSchedule({
      date: draftForm.date,
      startH: draftForm.startH,
      durationH: nextDuration,
    });
  };

  const handleDraftEndDateChange = (value, endH = getDraftEndMeta(draftForm.date, draftForm.startH, draftForm.durationH).hour) => {
    if (!value) return;
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return;
    updateDraftEndBoundary(new Date(year, month - 1, day), endH);
  };

  const handleDraftEndTimeChange = (value, endDate = getDraftEndMeta(draftForm.date, draftForm.startH, draftForm.durationH).date) => {
    if (!value) return;
    const nextEndH = Number(value);
    if (Number.isNaN(nextEndH)) return;
    updateDraftEndBoundary(endDate, nextEndH);
  };

  const toggleAccount = (id) => {
    const targetAccount = accounts.find((account) => account.id === id);
    if (!targetAccount) return;

    if (targetAccount.checked && accounts.filter((account) => account.checked).length <= 1) {
      triggerFeedback('L3', {
        msg: '至少保留一个可见账户',
        icon: <AlertCircle size={16} />,
        color: 'bg-slate-900',
      });
      return;
    }

    setAccounts((prev) => prev.map((account) => (account.id === id ? { ...account, checked: !account.checked } : account)));
    if (targetAccount.checked) {
      setSplitAccountIds((prev) => prev.filter((item) => item !== id));
      setFocusedAccountId((prev) => (prev === id ? null : prev));
    }
  };

  const hideAccountFromCalendarView = (accountId) => {
    const targetAccount = accountMap[accountId];
    if (!targetAccount) return;

    if (activeAccounts.length <= 1) {
      triggerFeedback('L3', {
        msg: '至少保留一个可见账户',
        icon: <AlertCircle size={16} />,
        color: 'bg-slate-900',
      });
      return;
    }

    setAccounts((prev) => prev.map((account) => (account.id === accountId ? { ...account, checked: false } : account)));
    setSplitAccountIds((prev) => prev.filter((id) => id !== accountId));
    setFocusedAccountId((prev) => (prev === accountId ? null : prev));
    triggerFeedback('L3', {
      msg: `已隐藏 ${targetAccount.email || targetAccount.name}`,
      icon: <X size={16} />,
      color: 'bg-slate-900',
    });
  };

  const handleDeleteEvent = (id) => {
    const targetEvent = events.find((event) => event.id === id);
    const targetCalendar = targetEvent ? calendarMap[targetEvent.calId] : null;
    if (targetCalendar && !canEditCalendarContent(targetCalendar)) {
      if (targetCalendar.type === 'shared') notifyPermissionDenied(targetCalendar.id);
      return;
    }
    setEvents((prev) => prev.filter((event) => event.id !== id));
    hideEventPreview(id);
    if (selectedEventId === id) setSelectedEventId(null);
    if (currentScreen === 'details') setCurrentScreen('calendar');
    triggerFeedback('L3', {
      msg: '已从日历中移除',
      icon: <Trash size={16} />,
      color: 'bg-gray-900',
    });
  };

  const handleRespondToEvent = (id, action) => {
    const nextStatus = action === 'accept' ? '已接受' : '已拒绝';
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, status: nextStatus } : event)));
    triggerFeedback('L3', {
      msg: nextStatus,
      icon: action === 'accept' ? <Check size={16} /> : <X size={16} />,
      color: action === 'accept' ? 'bg-emerald-600' : 'bg-slate-800',
    });
  };

  const changeRange = (delta) => {
    setHoverPreview(null);
    if (calendarLayout === 'day') {
      setFocusDate((prev) => stripTime(addDays(prev, delta)));
      return;
    }

    if (calendarLayout === 'month') {
      setFocusDate((prev) => stripTime(addMonths(prev, delta)));
      return;
    }

    setFocusDate((prev) => stripTime(addDays(prev, delta * 7)));
  };

  const jumpToToday = () => {
    setHoverPreview(null);
    setFocusDate(stripTime(TODAY_DATE));
    setActiveProduct('calendar');
    setCurrentScreen('calendar');
    triggerFeedback('L3', {
      msg: '已回到今日',
      icon: <Calendar size={16} />,
      color: 'bg-blue-600',
    });
  };

  const selectDate = (date, nextLayout = null) => {
    setHoverPreview(null);
    setFocusDate(stripTime(date));
    setActiveProduct('calendar');
    setCurrentScreen('calendar');
    if (nextLayout) {
      setCalendarLayout(nextLayout);
      queueTimelineScrollToWorkStart(nextLayout);
    }
  };

  const addAttendee = (listKey = 'attendees', inputKey = 'inviteInput') => {
    const name = draftForm[inputKey]?.trim();
    if (!name) return;

    addAttendeeByValue(name, listKey, inputKey);
  };

  const handleAttendeeInputKeyDown = (event, listKey = 'attendees', inputKey = 'inviteInput') => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addAttendee(listKey, inputKey);
      return;
    }

    if (event.key === 'Backspace' && !draftForm[inputKey]?.trim()) {
      const currentList = draftForm[listKey] || [];
      if (currentList.length === 0) return;
      event.preventDefault();
      removeAttendee(currentList[currentList.length - 1], listKey);
    }
  };

  const addAttendeeByValue = (name, listKey = 'attendees', inputKey = 'inviteInput', onComplete = null) => {
    const values = parseRecipients(name)
      .map((item) => item.trim())
      .filter(Boolean);
    if (values.length === 0) return;

    setDraftForm((prev) => {
      const nextDraft = {
        ...prev,
        attendees:
          listKey === 'attendees'
            ? dedupeParticipants([...(prev.attendees || []), ...values].filter(Boolean).map((item) => item.trim()))
            : (prev.attendees || []).filter((person) => !values.some((value) => normalizeParticipantIdentity(value) === normalizeParticipantIdentity(person))),
        optionalAttendees:
          listKey === 'optionalAttendees'
            ? dedupeParticipants(
                [
                  ...(prev.optionalAttendees || []).filter(
                    (person) => !(prev.attendees || []).some((attendee) => normalizeParticipantIdentity(attendee) === normalizeParticipantIdentity(person)),
                  ),
                  ...values.filter(
                    (value) => !(prev.attendees || []).some((attendee) => normalizeParticipantIdentity(attendee) === normalizeParticipantIdentity(value)),
                  ),
                ]
                  .filter(Boolean)
                  .map((item) => item.trim()),
              )
            : (prev.optionalAttendees || []).filter(
                (person) => !values.some((value) => normalizeParticipantIdentity(value) === normalizeParticipantIdentity(person)),
              ),
      };

      if (inputKey) nextDraft[inputKey] = '';
      return nextDraft;
    });
    onComplete?.();
    markDraftDirty();
  };

  const applyBulkAttendeeInput = (listKey = 'attendees') => {
    const bulkValue = createDraftBulkInputs[listKey]?.trim();
    if (!bulkValue) return;

    addAttendeeByValue(bulkValue, listKey, null, () => {
      setCreateDraftBulkInputs((prev) => ({ ...prev, [listKey]: '' }));
      setCreateDraftPanels((prev) => ({
        ...prev,
        [listKey === 'attendees' ? 'requiredBulkOpen' : 'optionalBulkOpen']: false,
        [listKey === 'attendees' ? 'requiredExpanded' : 'optionalExpanded']: true,
      }));
    });
  };

  const removeAttendee = (name, listKey = 'attendees') => {
    setDraftForm((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] || []).filter((person) => person !== name),
    }));
    markDraftDirty();
  };

  const applyDraftSuggestion = (startH) => {
    updateDraftSchedule({
      date: draftForm.date,
      startH,
      durationH: draftForm.durationH,
    });
  };

  const handleEditorTool = (tool) => {
    const snippets = {
      agenda: '会议议程\n1. 背景同步\n2. 方案评审\n3. 决策与分工\n',
      grid: '任务清单\n- 待确认事项：\n- 会后动作：\n',
      camera: '\n[插入现场截图占位]\n',
      attachment: '\n[附件] 请在会前查看《Calendar_规约.pdf》\n',
    };

    const patch = {
      description: `${draftForm.description}${draftForm.description ? '\n\n' : ''}${snippets[tool] || ''}`,
    };

    if (tool === 'attachment' && !draftForm.attachments.includes('Calendar_规约.pdf')) {
      patch.attachments = [...draftForm.attachments, 'Calendar_规约.pdf'];
    }

    patchDraft(patch);
    triggerFeedback('L3', {
      msg: '内容已插入',
      icon: <Check size={16} />,
      color: 'bg-gray-800',
    });
  };

  const saveDraft = (mode, options = {}) => {
    const afterSave = options.afterSave || null;
    if (mode === 'send' && !draftForm.title.trim()) {
      triggerFeedback('L3', {
        msg: '请先填写日程主题',
        icon: <AlertCircle size={16} />,
        color: 'bg-red-600',
      });
      return;
    }
    const normalizedDraft = {
      ...draftForm,
      title: draftForm.title.trim() || '未命名会议',
      timeText: formatDraftTime(draftForm.date, draftForm.startH, draftForm.durationH),
    };

    const selectedCalendar = calendarMap[normalizedDraft.calId];
    const selectedAccount = selectedCalendar ? accountMap[selectedCalendar.accountId] : null;
    const nextId = normalizedDraft.eventId || `e${Date.now()}`;
    const nextMeetingProvider = normalizedDraft.meetingProvider || 'none';
    const nextMeetingLink =
      nextMeetingProvider !== 'none' && nextMeetingProvider !== 'phone'
        ? normalizedDraft.meetingLink.trim() || buildConferenceLink(nextMeetingProvider, normalizedDraft.title.trim())
        : '';
    const normalizedAttendees = Array.from(
      new Set(
        [
          normalizedDraft.organizer || selectedAccount?.email || selectedCalendar?.owner || '我',
          ...(normalizedDraft.attendees || []),
          ...(normalizedDraft.optionalAttendees || []),
        ].filter(Boolean),
      ),
    );
    const payload = {
      id: nextId,
      title: normalizedDraft.title.trim(),
      day: normalizedDraft.day,
      weekOffset: normalizedDraft.weekOffset,
      startH: normalizedDraft.startH,
      durationH: normalizedDraft.durationH,
      calId: normalizedDraft.calId,
      location: normalizedDraft.location.trim(),
      organizer: normalizedDraft.organizer || selectedAccount?.email || selectedCalendar?.owner || '我',
      status:
        mode === 'draft' && !normalizedDraft.eventId
          ? '草稿'
          : normalizedDraft.eventId
            ? selectedEvent?.status || '已接受'
            : '已接受',
      description: normalizedDraft.description.trim(),
      type: 'normal',
      attendees: normalizedAttendees,
      kind: 'event',
      meetingProvider: nextMeetingProvider,
      meetingLink: nextMeetingLink,
      optionalAttendees: normalizedDraft.optionalAttendees || [],
      repeat: normalizedDraft.repeat || 'does_not_repeat',
      reminder: normalizedDraft.reminder || '30m',
      availability: normalizedDraft.availability === 'out_of_office' ? 'busy' : normalizedDraft.availability || 'busy',
      visibility: normalizedDraft.visibility || 'default',
      attachments: (normalizedDraft.attachments || [])
        .map((item) => (typeof item === 'string' ? item : item?.name))
        .filter(Boolean),
    };

    setEvents((prev) => {
      const exists = prev.some((event) => event.id === nextId);
      if (exists) {
        return prev.map((event) => (event.id === nextId ? { ...event, ...payload } : event));
      }
      return [...prev, payload];
    });

    setSelectedEventId(nextId);
    setFocusDate(stripTime(normalizedDraft.date));
    setCurrentScreen(mode === 'send' ? 'details' : 'calendar');
    setShowRightSidebar(mode !== 'send');
    resetDraftState();
    if (typeof afterSave === 'function') {
      setTimeout(() => afterSave(nextId), 0);
    }
    const successDetail =
      nextMeetingProvider !== 'none' && nextMeetingProvider !== 'phone'
        ? ` · 已生成 ${MEETING_PROVIDER_LABELS[nextMeetingProvider]} 链接`
        : '';
    triggerFeedback('L3', {
      msg:
        mode === 'send'
          ? createDraft.mode === 'edit'
            ? `已更新 ${selectedCalendar?.name || '目标日历'}${successDetail}`
            : `已创建到 ${selectedCalendar?.name || '目标日历'}${successDetail}`
          : createDraft.mode === 'edit'
            ? `草稿已更新 · ${selectedCalendar?.name || '目标日历'}`
            : `已保存为草稿 · ${selectedCalendar?.name || '目标日历'}`,
      icon: <Check size={16} />,
      color: mode === 'send' ? 'bg-emerald-600' : 'bg-gray-800',
    });
  };

  const createWindowTimestamp = formatClockStamp(new Date());
  const createWindowSaveLabel =
    createDraft.saveStatus === 'saving' ? '自动保存中' : createDraft.saveStatus === 'saved' ? '已自动保存' : '自动保存';
  const draftEndMeta = getDraftEndMeta(draftForm.date, draftForm.startH, draftForm.durationH);
  const createDraftSummaryText =
    sameDay(draftForm.date, draftEndMeta.date)
      ? `${formatDateLabel(draftForm.date)} · ${formatTimeRange(draftForm.startH, draftForm.durationH)}`
      : `${formatDateLabel(draftForm.date)} ${formatTimeSelectLabel(draftForm.startH)} - ${formatDateLabel(draftEndMeta.date)} ${formatTimeSelectLabel(
          draftEndMeta.hour,
        )}`;
  const createDraftDurationLabel = formatDurationLabel(draftForm.durationH);
  const createDraftSpansMultipleDays = !sameDay(draftForm.date, draftEndMeta.date);
  const createDraftScheduleTone =
    draftConflicts.length > 0 ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700';
  const createDraftInviteeCount = draftForm.attendees.length + (draftForm.optionalAttendees || []).length;
  const createDraftLargeAudience = createDraftInviteeCount >= 20;
  const createDraftMassAudience = createDraftInviteeCount >= 80;
  const createDraftRequiredMatchedCount = draftMatchedRequiredParticipantIds.length;
  const createDraftOptionalMatchedCount = draftMatchedOptionalParticipantIds.length;
  const createDraftRequiredUnmatchedCount = Math.max(draftForm.attendees.length - createDraftRequiredMatchedCount, 0);
  const createDraftOptionalUnmatchedCount = Math.max((draftForm.optionalAttendees || []).length - createDraftOptionalMatchedCount, 0);
  const createDraftRequiredBusyOnlyCount = draftMatchedRequiredParticipantIds.filter((accountId) => getAccountPermissionMode(accountId) === 'busy_only').length;
  const createDraftOptionalBusyOnlyCount = draftMatchedOptionalParticipantIds.filter((accountId) => getAccountPermissionMode(accountId) === 'busy_only').length;
  const createDraftScheduleText =
    draftConflicts.length > 0
      ? `${currentSlotAccountStates.filter((state) => state.conflicts.length > 0).length}/${Math.max(currentSlotAccountStates.length, 1)} 位参与人当前忙碌`
      : `当前时间满足 ${Math.max(createDraftRequiredMatchedCount, 1)} 位已识别必需参会者`;
  const createDraftAccountLabel = draftAccountInfo?.email || draftAccountInfo?.name || '未选择账户';
  const createDraftCalendarInfo = calendarMap[draftForm.calId] || null;
  const createDraftCalendarLabel = createDraftCalendarInfo?.name || '未选择日历';
  const createDraftBusyStates = currentSlotAccountStates.filter((state) => state.conflicts.length > 0);
  const createDraftRequiredBusyCount = currentSlotAccountStates.filter((state) => state.scope === 'required' && state.conflicts.length > 0).length;
  const createDraftOptionalBusyCount = currentSlotAccountStates.filter((state) => state.scope === 'optional' && state.conflicts.length > 0).length;
  const createDraftParticipantCheckMessage =
    draftRelevantAccountIds.length <= 1
      ? `当前按 ${createDraftAccountLabel} 的工作时间检查忙闲`
      : createDraftLargeAudience && createDraftBusyStates.length > 0
        ? `当前有 ${createDraftRequiredBusyCount} 位必需参会者、${createDraftOptionalBusyCount} 位可选参会者忙碌`
        : createDraftBusyStates.length > 0
        ? `${createDraftBusyStates
            .map((state) => `${state.account.email || state.account.name}${state.scope === 'required' ? '（必需）' : '（可选）'}`)
            .join('、')} 当前忙碌`
        : `已检查 ${Math.max(createDraftRequiredMatchedCount, 1)} 位必需参会者${createDraftOptionalMatchedCount > 0 ? ` 和 ${createDraftOptionalMatchedCount} 位可选参会者` : ''}`;
  const createDraftConflictPreviewItems = currentSlotAccountStates
    .flatMap(({ account, conflicts }) =>
      conflicts.slice(0, 1).map((event) => ({
        id: `${account.id}-${event.id}`,
        accountLabel: account.email || account.name,
        eventLabel: `${formatTimeRange(event.startH || 0, event.durationH || 1)} · ${
          getAccountPermissionMode(account.id) === 'busy_only' || event.type === 'busy_only' ? '忙碌' : event.title || '忙碌'
        }`,
      })),
    )
    .slice(0, 3);
  const createDraftRequiredText =
    draftForm.attendees.length > 0
      ? `已添加 ${draftForm.attendees.length} 位必需参与人${createDraftRequiredUnmatchedCount > 0 ? `，其中 ${createDraftRequiredUnmatchedCount} 位暂未识别到组织内日历` : ''}`
      : '';
  const createDraftOptionalText =
    (draftForm.optionalAttendees || []).length > 0
      ? `已添加 ${(draftForm.optionalAttendees || []).length} 位可选参与人${createDraftOptionalUnmatchedCount > 0 ? `，其中 ${createDraftOptionalUnmatchedCount} 位暂未识别到组织内日历` : ''}`
      : '';
  const createDraftRequiredPreviewCount = createDraftMassAudience ? 5 : 8;
  const createDraftOptionalPreviewCount = createDraftMassAudience ? 4 : 6;
  const createDraftVisibleRequiredAttendees =
    createDraftPanels.requiredExpanded || !createDraftLargeAudience
      ? draftForm.attendees
      : draftForm.attendees.slice(0, createDraftRequiredPreviewCount);
  const createDraftVisibleOptionalAttendees =
    createDraftPanels.optionalExpanded || !createDraftLargeAudience
      ? draftForm.optionalAttendees || []
      : (draftForm.optionalAttendees || []).slice(0, createDraftOptionalPreviewCount);
  const createDraftConflictSourceStates = createDraftLargeAudience
    ? currentSlotAccountStates.filter((state) => state.conflicts.length > 0)
    : currentSlotAccountStates;
  const createDraftConflictDetailStates = createDraftPanels.conflictsExpanded
    ? createDraftConflictSourceStates
    : createDraftConflictSourceStates.slice(0, 10);
  const createDraftHiddenConflictStateCount = Math.max(
    createDraftConflictSourceStates.length - createDraftConflictDetailStates.length,
    0,
  );

  const handleContextMenu = (event, entry) => {
    event.preventDefault();
    event.stopPropagation();
    if (!entry) return;

    hideEventPreview();
    const x = Math.min(event.clientX, window.innerWidth - 220);
    const y = Math.min(event.clientY, window.innerHeight - 220);
    setContextMenu({ x, y, event: entry });
  };

  const handleAccountContextMenu = (event, account) => {
    event.preventDefault();
    event.stopPropagation();
    if (!account) return;
    const x = Math.min(event.clientX, window.innerWidth - 180);
    const y = Math.min(event.clientY, window.innerHeight - 140);
    setContextMenu({ x, y, account });
  };

  useEffect(() => {
    const handleMouseMove = (entry) => {
      const active = eventInteractionRef.current;
      if (!active) return;

      const pointer = getPreviewPosition(entry.clientX, entry.clientY);

      if (active.type === 'move') {
        const nextSlot = getSlotFromPointer(entry.clientX, entry.clientY, active.origin.durationH);
        const movedEnough =
          Math.abs(entry.clientX - active.startPoint.x) > 4 || Math.abs(entry.clientY - active.startPoint.y) > 4;

        syncEventInteraction((prev) => {
          if (!prev) return prev;
          if (!nextSlot) {
            return {
              ...prev,
              pointer,
              changed: prev.changed || movedEnough,
            };
          }

          const next = {
            date: nextSlot.date,
            startH: nextSlot.startH,
            durationH: prev.origin.durationH,
            weekOffset: nextSlot.weekOffset,
            day: nextSlot.day,
          };

          const changed =
            prev.changed ||
            movedEnough ||
            next.startH !== prev.origin.startH ||
            next.day !== prev.origin.day ||
            next.weekOffset !== prev.origin.weekOffset;

          return {
            ...prev,
            pointer,
            changed,
            next,
          };
        });

        return;
      }

      if (active.type === 'resize') {
        const deltaHours = (entry.clientY - active.startPoint.y) / CELL_HEIGHT;

        syncEventInteraction((prev) => {
          if (!prev) return prev;

          if (prev.edge === 'top') {
            const fixedEndH = prev.origin.startH + prev.origin.durationH;
            const nextStartH = clampNumber(roundToHalfHour(prev.origin.startH + deltaHours), DAY_START_HOUR, fixedEndH - MIN_EVENT_DURATION);
            const nextDurationH = clampDuration(fixedEndH - nextStartH, nextStartH);
            const changed = prev.changed || nextStartH !== prev.origin.startH || nextDurationH !== prev.origin.durationH;

            return {
              ...prev,
              pointer,
              changed,
              next: {
                ...prev.next,
                startH: nextStartH,
                durationH: nextDurationH,
              },
            };
          }

          const nextDurationH = clampDuration(prev.origin.durationH + deltaHours, prev.origin.startH);
          const changed = prev.changed || nextDurationH !== prev.origin.durationH;

          return {
            ...prev,
            pointer,
            changed,
            next: {
              ...prev.next,
              durationH: nextDurationH,
            },
          };
        });
      }
    };

    const handleMouseUp = () => {
      const active = eventInteractionRef.current;
      if (!active) return;

      const hasChanged =
        active.changed &&
        (active.type === 'move'
          ? active.next.startH !== active.origin.startH ||
            active.next.day !== active.origin.day ||
            active.next.weekOffset !== active.origin.weekOffset
          : active.next.durationH !== active.origin.durationH);

      if (hasChanged) {
        const nextPatch = {
          day: active.next.day,
          weekOffset: active.next.weekOffset,
          startH: active.next.startH,
          durationH: active.next.durationH,
        };

        setEvents((prev) => prev.map((event) => (event.id === active.eventId ? { ...event, ...nextPatch } : event)));
        suppressOpenUntilRef.current = Date.now() + 180;
        triggerFeedback('L3', {
          msg: `已更新日程：${formatDraftTime(active.next.date, active.next.startH, active.next.durationH)}`,
          icon: <Clock size={16} />,
          color: 'bg-blue-600',
        });
      }

      if (active.changed) {
        suppressOpenUntilRef.current = Date.now() + 180;
      }

      eventInteractionRef.current = null;
      setEventInteraction(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const targetTag = event.target ? event.target.tagName : '';
      const isInputFocused = targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT';

      if (event.key === 'Escape') {
        event.preventDefault();
        if (isInputFocused && event.target.blur) event.target.blur();
        if (mailComposer.open) {
          closeMailComposer();
          return;
        }
        if (sharedCalendarDialog.open) {
          closeSharedCalendarDialog();
          return;
        }
        if (reminderDialogOpen) {
          setReminderDialogOpen(false);
          return;
        }
        if (shortcutHelpOpen) {
          setShortcutHelpOpen(false);
          return;
        }
        if (calendarColorPicker.open) {
          closeColorPicker();
          return;
        }
        if (calendarRenameDialog.open) {
          closeRenameDialog();
          return;
        }
        if (calendarDeleteConfirm.open) {
          closeDeleteConfirm();
          return;
        }
        if (eventInteractionRef.current) {
          eventInteractionRef.current = null;
          setEventInteraction(null);
          return;
        }
        if (contextMenu) setContextMenu(null);
        else if (timeSelection) clearTimeSelection();
        else if (feedback.type === 'L4') setFeedback({ type: null, payload: null });
        else if (currentScreen !== 'calendar') setCurrentScreen('calendar');
        return;
      }

      if (isInputFocused) return;

      switch (event.key.toLowerCase()) {
        case 'n':
          if (activeProduct === 'calendar') {
            event.preventDefault();
            navTo('create');
          } else if (activeProduct === 'mail') {
            event.preventDefault();
            openMailComposer('new');
          }
          break;
        case 't':
          if (activeProduct === 'calendar') {
            event.preventDefault();
            jumpToToday();
          }
          break;
        case 'r':
          if (activeProduct === 'calendar') {
            event.preventDefault();
            handleCalendarSync();
          }
          break;
        case 'm':
          if (activeProduct === 'calendar' && currentScreen === 'calendar') {
            event.preventDefault();
            setCalendarLayout('month');
          }
          break;
        case 'w':
          if (activeProduct === 'calendar' && currentScreen === 'calendar') {
            event.preventDefault();
            setCalendarLayout('week');
            queueTimelineScrollToWorkStart('week');
          }
          break;
        case 'd':
          if (activeProduct === 'calendar' && currentScreen === 'calendar') {
            event.preventDefault();
            setCalendarLayout('day');
            queueTimelineScrollToWorkStart('day');
          }
          break;
        case 'arrowleft':
          if (activeProduct === 'calendar' && currentScreen === 'calendar') {
            event.preventDefault();
            changeRange(-1);
          }
          break;
        case 'arrowright':
          if (activeProduct === 'calendar' && currentScreen === 'calendar') {
            event.preventDefault();
            changeRange(1);
          }
          break;
        case '?':
        case '/':
          if (event.shiftKey) {
            event.preventDefault();
            setShortcutHelpOpen(true);
          }
          break;
        default:
          if (
            (event.key === 'Delete' || event.key === 'Backspace') &&
            (currentScreen === 'details' || currentScreen === 'calendar') &&
            selectedEventId
          ) {
            event.preventDefault();
            handleDeleteEvent(selectedEventId);
          }
          break;
      }
    };

    const handleClickOutside = () => {
      if (contextMenu) setContextMenu(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [
    activeProduct,
    contextMenu,
    currentScreen,
    feedback.type,
    selectedEventId,
    calendarLayout,
    createDraft.isDirty,
    mailComposer.open,
    mails,
    timeSelection,
    sharedCalendarDialog.open,
    reminderDialogOpen,
    shortcutHelpOpen,
    calendarColorPicker.open,
    calendarRenameDialog.open,
    calendarDeleteConfirm.open,
  ]);

  useEffect(() => {
    if (currentScreen !== 'create') return;

    const handleCreateShortcuts = (event) => {
      const isMod = event.metaKey || event.ctrlKey;
      if (!isMod) return;

      if (event.key.toLowerCase() === 's') {
        event.preventDefault();
        saveDraft('draft');
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        saveDraft('send');
      }
    };

    window.addEventListener('keydown', handleCreateShortcuts);
    return () => window.removeEventListener('keydown', handleCreateShortcuts);
  }, [currentScreen, saveDraft]);

  const showAccountLabel = calendarLayout === 'day' ? activeAccounts.length > 1 : false;
  const pendingShareInvitations = shareInvitations.filter((item) => item.status === 'pending');

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#f7f7f5] text-gray-900 antialiased">
      <style>{`
        @keyframes coremail-event-locate-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
            transform: scale(1);
          }
          20%, 70% {
            box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.28), 0 0 0 8px rgba(37, 99, 235, 0.12);
            transform: scale(1.01);
          }
        }
        .coremail-event-locate-pulse {
          animation: coremail-event-locate-pulse 1.1s ease-in-out 2;
          z-index: 30 !important;
        }
      `}</style>
      {activeProduct === 'calendar' ? (
        <CalendarSidebar
          accounts={accounts}
          miniMonthEventMap={miniMonthEventMap}
          showHuaweiWorkdayBadges={showHuaweiWorkdayBadges}
          focusDate={focusDate}
          calendarLayout={calendarLayout}
          collapsed={calendarSidebarCollapsed}
          onNewEvent={() => navTo('create')}
          onShiftMonth={(delta) => setFocusDate((prev) => stripTime(addMonths(prev, delta)))}
          onSelectDate={(date) => selectDate(date, calendarLayout === 'month' ? 'day' : null)}
          onToggleAccount={toggleAccount}
          onOpenMailboxPermissions={openMailboxPermissions}
          onOpenSharedCalendarAccess={openSharedCalendarAccess}
          onOpenSharingSettings={handleOpenSharingSettings}
          onAddSharedCalendar={handleAddSharedCalendar}
          onToggleCollapsed={() => setCalendarSidebarCollapsed((prev) => !prev)}
          onAccountContextMenu={handleAccountContextMenu}
          onFocusAccount={handleFocusAccount}
          onAccountMenu={handleAccountMenu}
          pendingShareInvitationCount={pendingShareInvitations.length}
          focusedAccountId={focusedAccountId}
          activeProduct={activeProduct}
          onSelectProduct={handleProductSelect}
        />
      ) : activeProduct === 'mail' ? (
        <MailSidebar
          accounts={accounts}
          mails={mails}
          mailFolder={mailFolder}
          onSelectFolder={setMailFolder}
          onCompose={openMailComposer}
          onToggleAccount={toggleAccount}
          onOpenMailboxPermissions={openMailboxPermissions}
          activeProduct={activeProduct}
          onSelectProduct={handleProductSelect}
        />
      ) : (
        <UtilitySidebar activeProduct={activeProduct} onSelectProduct={handleProductSelect} />
      )}

      <div className="relative z-10 flex flex-1 min-w-0 min-h-0 flex-col overflow-hidden bg-white">
        <header className="relative flex min-h-16 shrink-0 flex-row items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6" style={{ zIndex: 40 }}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {activeProduct === 'calendar' ? (
              <div className="flex items-center gap-2 min-w-0 pr-1 whitespace-nowrap">
                {currentScreen === 'search' && (
                  <button
                    onClick={() => navTo('calendar')}
                    className="inline-flex h-10 shrink-0 items-center text-sm font-bold text-slate-700 transition hover:text-blue-600"
                  >
                    <ChevronLeft size={15} className="mr-1" />
                    返回日历
                  </button>
                )}
                <div
                  ref={calendarSearchBoxRef}
                  className="relative min-w-0 shrink-0"
                >
                  <div className="flex h-10 w-[324px] items-center rounded-xl bg-black/5 px-3">
                    <button
                      onClick={() => executeCalendarSearch()}
                      className="shrink-0 text-gray-400 transition hover:text-gray-600"
                      title="搜索日程"
                      aria-label="搜索日程"
                    >
                      <Search size={16} />
                    </button>
                    <input
                      value={calendarSearchQuery}
                      onFocus={() => setCalendarSearchPopoverOpen(true)}
                      onClick={() => setCalendarSearchPopoverOpen(true)}
                      onChange={(event) => {
                        setCalendarSearchQuery(event.target.value);
                        setCalendarSearchPopoverOpen(true);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          executeCalendarSearch(event.currentTarget.value);
                        }
                      }}
                      placeholder="搜索日程"
                      className="ml-2 w-full border-none bg-transparent text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none"
                    />
                    {calendarSearchQuery && (
                      <button
                        onClick={clearCalendarSearch}
                        className="ml-2 rounded-full p-1 text-gray-400 transition hover:bg-black/10 hover:text-gray-600"
                        title="清空搜索"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {calendarSearchPopoverOpen && (
                    <div
                      className="absolute left-0 top-0 z-[80] w-[792px] rounded-xl bg-white"
                      style={{
                        border: '0.5px solid rgba(0, 0, 0, 0.1)',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <div className="p-2">
                        <div className="flex h-11 w-[776px] items-center rounded-lg bg-slate-50 px-3">
                          <Search size={17} className="shrink-0 text-slate-400" />
                          <input
                            autoFocus
                            value={calendarSearchQuery}
                            onChange={(event) => setCalendarSearchQuery(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault();
                                executeCalendarSearch(event.currentTarget.value);
                              }
                              if (event.key === 'Escape') {
                                setCalendarSearchPopoverOpen(false);
                              }
                            }}
                            placeholder="搜索日程"
                            className="ml-2 min-w-0 flex-1 border-none bg-transparent text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none"
                          />
                          {calendarSearchQuery && (
                            <button
                              onClick={() => setCalendarSearchQuery('')}
                              className="ml-2 rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600"
                              title="清空"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        <div className="mt-2 px-1 pb-1">
                          <div className="px-2 py-1 text-xs font-bold text-slate-400">近期搜索</div>
                          {calendarRecentSearches.slice(0, 5).map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setCalendarSearchQuery(item);
                                executeCalendarSearch(item);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Clock size={15} className="text-slate-400" />
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {currentScreen !== 'search' && (
                  <>
                    <button
                      onClick={handleCalendarSync}
                      className="inline-flex h-10 shrink-0 items-center rounded-xl px-3 text-sm font-bold text-gray-700 transition hover:bg-black/5"
                    >
                      <RefreshCw size={14} className="mr-1.5" />
                      同步日历
                    </button>
                    <button
                      onClick={handleOpenReminders}
                      className="inline-flex h-10 shrink-0 items-center rounded-xl px-3 text-sm font-bold text-gray-700 transition hover:bg-black/5"
                    >
                      <Bell size={14} className="mr-1.5" />
                      提醒
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 select-none shrink-0">
                {PRODUCT_TABS.find((item) => item.id === activeProduct)?.label}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1 self-center">
            <button
              type="button"
              aria-label="联系客服"
              title="联系客服"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <HelpCircle size={16} />
            </button>
            <div className="mx-0.5 h-6 w-px bg-slate-200" />
            <button
              type="button"
              aria-label="最小化窗口"
              title="最小化"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <Minus size={16} />
            </button>
            <button
              type="button"
              aria-label="全屏窗口"
              title="全屏"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <Square size={14} />
            </button>
            <button
              type="button"
              aria-label="关闭窗口"
              title="关闭"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        <div className="relative flex flex-1 min-w-0 min-h-0 overflow-hidden bg-white">
          {activeProduct === 'calendar' ? (
              <div className="relative flex flex-1 min-w-0 min-h-0 overflow-hidden bg-white">
                {(currentScreen === 'calendar' || currentScreen === 'create') && (
                  <div className="relative flex flex-1 min-w-0 min-h-0 flex-col bg-white">
                    <header className="relative flex shrink-0 flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:px-8" style={{ zIndex: 10 }}>
                      <div className="flex items-center gap-3 min-w-0 flex-1 flex-wrap sm:flex-nowrap">
                        <button
                          onClick={jumpToToday}
                          className="hidden shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-gray-100 px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-200 sm:inline-flex sm:h-10 sm:min-w-[72px]"
                        >
                          今天
                        </button>
                        <div className="flex h-10 items-center rounded-lg bg-gray-100 p-[3px]">
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white hover:text-gray-700" onClick={() => changeRange(-1)}>
                            <ChevronLeft size={18} />
                          </button>
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-white hover:text-gray-700" onClick={() => changeRange(1)}>
                            <ChevronRight size={18} />
                          </button>
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-lg sm:text-xl font-black text-gray-800 truncate">{formatRangeTitle(calendarLayout, focusDate)}</h2>
                        </div>
                      </div>

                        <div className="flex items-center gap-2 flex-wrap min-w-0 sm:justify-end">
                        <div className="inline-flex items-center rounded-lg bg-gray-100 p-[3px]">
                            {VIEW_OPTIONS.map((option) => (
                              <button
                                key={option.id}
                                onClick={() => {
                                  setCalendarLayout(option.id);
                                  if (option.id === 'day' || option.id === 'week') {
                                    queueTimelineScrollToWorkStart(option.id);
                                  }
                                }}
                                className={`rounded-lg px-3 py-[9px] text-sm font-bold transition ${
                                  calendarLayout === option.id
                                    ? 'bg-white text-gray-800 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>

                        {activeAccounts.length > 1 && (
                          <div className="hidden md:inline-flex items-center rounded-lg bg-gray-100 p-[3px]">
                            <button
                              onClick={() => setAccountDisplayMode('overlay')}
                              className={`rounded-lg px-3 py-[9px] text-sm font-bold transition ${
                                effectiveAccountDisplayMode === 'overlay'
                                  ? 'bg-white text-gray-800 shadow-sm'
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                              aria-pressed={effectiveAccountDisplayMode === 'overlay'}
                            >
                              叠加视图
                            </button>
                            <button
                              onClick={() => setAccountDisplayMode('split')}
                              className={`rounded-lg px-3 py-[9px] text-sm font-bold transition ${
                                effectiveAccountDisplayMode === 'split'
                                  ? 'bg-white text-gray-800 shadow-sm'
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                              aria-pressed={effectiveAccountDisplayMode === 'split'}
                            >
                              拆分视图
                            </button>
                          </div>
                        )}

                        {activeAccounts.length > MAX_SPLIT_ACCOUNTS && effectiveAccountDisplayMode === 'split' && (
                          <div className="hidden xl:flex items-center max-w-[320px] overflow-x-auto rounded-lg bg-gray-100 p-[3px] space-x-1">
                            {activeAccounts.map((account) => {
                              const selected = splitAccountIds.includes(account.id);
                              return (
                                <button
                                  key={account.id}
                                  onClick={() => toggleSplitAccount(account.id)}
                                  className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition ${
                                    selected ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                  }`}
                                  title={account.name}
                                >
                                  <span className="inline-block max-w-[120px] truncate align-bottom">{account.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    </header>

	                    {activeCalIds.length === 0 ? (
	                      <div className="flex-1 flex items-center justify-center bg-white">
	                        <div className="text-center text-gray-400">
	                          <Calendar className="mx-auto h-12 w-12 mb-4" />
	                          <p className="font-bold">未选择账户</p>
	                        </div>
	                      </div>
	                    ) : calendarLayout === 'month' ? (
	                      <MonthView
                        focusDate={focusDate}
                        events={interactiveRangeEvents}
                        accountDisplayMode={effectiveAccountDisplayMode}
                        splitAccounts={displayAccounts}
                        calendarMap={calendarMap}
                        accountMap={accountMap}
                        showHuaweiWorkdayBadges={showHuaweiWorkdayBadges}
                        onSelectEvent={selectCalendarEvent}
                        onOpenEvent={openEventDetails}
                        onSelectDate={(date) => selectDate(date, 'day')}
                        onQuickCreate={(slot) => navTo('create', null, slot)}
                        onSlotContextMenu={openSlotContextMenu}
                        showAccountLabel={showAccountLabel}
                        onPreviewEvent={showEventPreview}
                        onHidePreview={hideEventPreview}
                        onHideAccount={hideAccountFromCalendarView}
                        flashingEventId={flashingEventId}
	                      />
	                    ) : calendarLayout === 'day' ? (
		                      <DayView
		                        key={`day-${focusDate.getTime()}-${timelineScrollToken}`}
		                        focusDate={focusDate}
		                        events={interactiveRangeEvents}
		                        activeAccounts={activeAccounts}
                        accountDisplayMode={effectiveAccountDisplayMode}
                        splitAccounts={displayAccounts}
                        accountMap={accountMap}
                        calendarMap={calendarMap}
                        onSelectEvent={selectCalendarEvent}
                        onOpenEvent={openEventDetails}
                        onCreateEvent={(slot) => navTo('create', null, slot)}
                        onContextMenu={handleContextMenu}
                        selection={timeSelection}
                        onStartSelection={startTimeSelection}
                        onHoverSelection={updateTimeSelection}
                        onSlotContextMenu={openSlotContextMenu}
                        interaction={eventInteraction}
	                        onStartEventMove={startEventMove}
	                        onStartEventResize={startEventResize}
	                        onPreviewEvent={showEventPreview}
	                        onHidePreview={hideEventPreview}
                        onHideAccount={hideAccountFromCalendarView}
	                        scrollRef={dayTimelineScrollRef}
	                        scrollToWorkStartToken={timelineScrollToken}
                        showHuaweiWorkdayBadges={showHuaweiWorkdayBadges}
                        flashingEventId={flashingEventId}
	                      />
		                    ) : (
	                      <WeekView
	                        key={`week-${focusDate.getTime()}-${timelineScrollToken}-${effectiveAccountDisplayMode}-${displayAccounts.map((account) => account.id).join('-')}`}
	                        days={visibleWeekDays}
	                        events={interactiveRangeEvents}
                        activeAccounts={activeAccounts}
                        accountDisplayMode={effectiveAccountDisplayMode}
                        splitAccounts={displayAccounts}
                        accountMap={accountMap}
                        calendarMap={calendarMap}
                        onSelectEvent={selectCalendarEvent}
                        onOpenEvent={openEventDetails}
                        onCreateEvent={(slot) => navTo('create', null, slot)}
                        onContextMenu={handleContextMenu}
                        selection={timeSelection}
                        onStartSelection={startTimeSelection}
                        onHoverSelection={updateTimeSelection}
                        onSlotContextMenu={openSlotContextMenu}
                        showAccountLabel={showAccountLabel}
                        interaction={eventInteraction}
	                        onStartEventMove={startEventMove}
	                        onStartEventResize={startEventResize}
	                        onPreviewEvent={showEventPreview}
	                        onHidePreview={hideEventPreview}
                          onHideAccount={hideAccountFromCalendarView}
	                        scrollRef={weekTimelineScrollRef}
	                        scrollToWorkStartToken={timelineScrollToken}
                        showHuaweiWorkdayBadges={showHuaweiWorkdayBadges}
                        flashingEventId={flashingEventId}
	                      />
	                    )}
                  </div>
                )}

                {currentScreen === 'search' && (
                  <Suspense fallback={<div className="flex min-h-0 flex-1 items-center justify-center bg-white text-sm font-bold text-slate-400">正在加载搜索结果...</div>}>
                    <CalendarSearchResults
                      query={calendarSearchQuery}
                      filters={calendarSearchFilters}
                      accountOptions={calendarSearchAccountOptions}
                      peopleOptions={calendarSearchPeopleOptions}
                      onChangeFilters={(patch) => setCalendarSearchFilters((prev) => ({ ...prev, ...patch }))}
                      onSearchQueryChange={setCalendarSearchQuery}
                      onSubmitSearch={executeCalendarSearch}
                      onClearSearch={clearCalendarSearch}
                      colorCategoryLabels={colorCategoryLabels}
                      onRenameColorCategory={(id, label) => setColorCategoryLabels((prev) => ({ ...prev, [id]: label }))}
                      results={calendarSearchResults}
                      onOpenEvent={openEventDetails}
                    />
                  </Suspense>
                )}

                {currentScreen === 'details' && selectedEvent && createPortal(
                  (
	                  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/10 p-0">
	                    <div className="h-[70vh] max-h-[calc(100vh-32px)] w-[70vw] max-w-[calc(100vw-32px)] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_18px_56px_rgba(15,23,42,0.18)]">
	                      <div className="flex h-full w-full flex-col overflow-hidden bg-white">
	                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm sm:px-6">
	                          <div className="min-w-0">
	                            <div className="truncate font-semibold text-slate-900">日历详情</div>
	                          </div>
	                          <div className="ml-4 flex items-center gap-1 text-slate-400">
	                            <button className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-slate-600" aria-label="最小化">
	                              <Minus size={16} />
	                            </button>
	                            <button className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-slate-600" aria-label="窗口化">
	                              <Square size={14} />
	                            </button>
	                            <button
	                              onClick={() => navTo(calendarReturnScreen || 'calendar')}
	                              className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-slate-700"
	                              aria-label="关闭"
	                            >
	                              <X size={16} />
	                            </button>
	                          </div>
	                        </div>
                      {selectedEvent.status === '已取消' && (
                        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
                          <div className="flex items-center text-red-800 text-sm font-bold">
                            <AlertCircle size={16} className="mr-2" />
                            该会议已被组织者取消
                          </div>
                          <button onClick={() => handleDeleteEvent(selectedEvent.id)} className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-xl shadow-sm">
                            移除
                          </button>
                        </div>
                      )}

                      <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        {selectedEvent.type === 'busy_only' ? (
                          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                            <Lock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h2 className="text-xl font-black text-gray-800">仅查看闲忙</h2>
                            <p className="text-gray-500 mt-2 text-sm font-medium">由于权限限制，您仅能看到该时段被占用。</p>
                          </div>
                        ) : (
                          <>
                            <div className="mb-6">
                              <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="bg-gray-100 text-gray-700 border border-gray-200 text-xs px-2 py-1 rounded-lg flex items-center font-bold">
                                  <div className={`w-2 h-2 rounded-full mr-1 ${selectedEventCalInfo.color || 'bg-gray-500'}`}></div>
                                  {selectedEventCalInfo.name || '未知'}
                                </span>
                                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded-lg font-bold">
                                  {selectedEventCalInfo.permission || ''}
                                </span>
                                {selectedEventAccountInfo && (
                                  <span className="bg-gray-100 text-gray-700 border border-gray-200 text-xs px-2 py-1 rounded-lg font-bold">
                                    {selectedEventAccountInfo.name}
                                  </span>
                                )}
                                {selectedEvent.status && (
                                  <span className={`text-xs px-2 py-1 rounded-lg border font-bold ${getAgendaStatusTone(selectedEvent.status)}`}>
                                    {selectedEvent.status}
                                  </span>
                                )}
                                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2 py-1 rounded-lg font-bold">
                                  {selectedEventKindLabel}
                                </span>
                                {selectedEvent.repeat && selectedEvent.repeat !== 'does_not_repeat' && (
                                  <span className="bg-gray-100 text-gray-700 border border-gray-200 text-xs px-2 py-1 rounded-lg font-bold">
                                    {REPEAT_LABELS[selectedEvent.repeat]}
                                  </span>
                                )}
                                {selectedEventColorCategories.map((category) => (
                                  <span key={category.id} className="inline-flex items-center bg-gray-100 text-gray-700 border border-gray-200 text-xs px-2 py-1 rounded-lg font-bold">
                                    <span className={`mr-1.5 h-2 w-2 rounded-full ${category.colorClass}`}></span>
                                    {category.label}
                                  </span>
                                ))}
                                {selectedEvent.reminder && selectedEvent.reminder !== 'none' && (
                                  <span className="bg-gray-100 text-gray-700 border border-gray-200 text-xs px-2 py-1 rounded-lg font-bold">
                                    {REMINDER_LABELS[selectedEvent.reminder]}
                                  </span>
                                )}
                              </div>
                              <h1 className={`text-2xl md:text-3xl font-black ${selectedEvent.status === '已取消' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                {selectedEvent.title || '无标题'}
                              </h1>
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 font-bold text-gray-800">
                                  <div className="flex items-center text-xs font-black uppercase tracking-[0.12em] text-gray-400 mb-2">
                                    <Clock size={14} className="mr-2 text-blue-600" />
                                    时间
                                  </div>
                                  {formatDateLabel(eventToDate(selectedEvent))} {formatTimeRange(selectedEvent.startH || 8, selectedEvent.durationH || 1)}
                                </div>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 font-bold text-gray-800">
                                  <div className="flex items-center text-xs font-black uppercase tracking-[0.12em] text-gray-400 mb-2">
                                    <MapPin size={14} className="mr-2 text-emerald-600" />
                                    地点 / 加入方式
                                  </div>
                                  <div>{selectedEvent.location || (selectedEventMeetingLabel ? '线上会议' : '待补充')}</div>
                                  {selectedEventMeetingLabel && <div className="mt-1 text-xs text-gray-500">{selectedEventMeetingLabel}</div>}
                                </div>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 font-bold text-gray-800">
                                  <div className="text-xs font-black uppercase tracking-[0.12em] text-gray-400 mb-2">日程设置</div>
                                  <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="rounded-full bg-white px-2.5 py-1 border border-gray-200 text-gray-700">
                                      {REPEAT_LABELS[selectedEvent.repeat || 'does_not_repeat']}
                                    </span>
                                    <span className="rounded-full bg-white px-2.5 py-1 border border-gray-200 text-gray-700">
                                      {REMINDER_LABELS[selectedEvent.reminder || '30m']}
                                    </span>
                                  </div>
                                </div>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 font-bold text-gray-800">
                                  <div className="text-xs font-black uppercase tracking-[0.12em] text-gray-400 mb-2">显示方式</div>
                                  <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="rounded-full bg-white px-2.5 py-1 border border-gray-200 text-gray-700">
                                      {AVAILABILITY_LABELS[selectedEvent.availability || 'busy']}
                                    </span>
                                    <span className="rounded-full bg-white px-2.5 py-1 border border-gray-200 text-gray-700">
                                      {VISIBILITY_LABELS[selectedEvent.visibility || 'default']}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {selectedEvent.meetingLink && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {selectedEventCanJoin && (
                                    <button
                                      onClick={() => openExternalLink(selectedEvent.meetingLink, '已打开会议链接')}
                                      className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white"
                                    >
                                      <ArrowRight size={14} className="mr-2" />
                                      一键入会
                                    </button>
                                  )}
                                  <button
                                    onClick={() => copyTextToClipboard(selectedEvent.meetingLink, '会议链接已复制')}
                                    className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700"
                                  >
                                    <Copy size={14} className="mr-2" />
                                    复制链接
                                  </button>
                                </div>
                              )}
                            </div>

                            {selectedEvent.status === '待响应' && (
                              <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center text-orange-800 font-bold">
                                  <HelpCircle size={18} className="mr-2 text-orange-600" />
                                  等待您的响应
                                </div>
                                <div className="flex space-x-3 w-full sm:w-auto">
                                  <button
                                    onClick={() => handleRespondToEvent(selectedEvent.id, 'reject')}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold"
                                  >
                                    拒绝
                                  </button>
                                  <button
                                    onClick={() => handleRespondToEvent(selectedEvent.id, 'accept')}
                                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold"
                                  >
                                    接受
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div className="md:col-span-2">
                                <h3 className="text-sm font-black text-gray-800 flex items-center mb-4 border-b border-gray-200 pb-2">
                                  <AlignLeft size={16} className="mr-2" />
                                  日程说明
                                </h3>
                                <div className="text-sm text-gray-700 leading-relaxed">
                                  <p className="mb-4 font-medium">{selectedEvent.description || '暂无详细说明。'}</p>
                                </div>
                              </div>
                              <div className="md:col-span-1">
                                <h3 className="text-sm font-black text-gray-800 flex items-center mb-4 border-b border-gray-200 pb-2">
                                  <Users size={16} className="mr-2" />
                                  参与者
                                </h3>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                                  {(selectedEvent.attendees || [selectedEvent.organizer]).map((person) => (
                                    <div key={person} className="flex items-center justify-between text-sm">
                                      <div className="flex items-center">
                                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mr-2">
                                          {person[0] || '无'}
                                        </div>
                                        <span className="font-bold">{person}</span>
                                      </div>
                                      {person === selectedEvent.organizer && <span className="text-xs font-bold text-blue-600">组织者</span>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    </div>
                  </div>
                  ),
                  document.body,
                )}

                {currentScreen === 'create' && createPortal(
                  (
                  <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 py-4">
                    <div className="max-h-[70vh] w-[min(1220px,calc(100vw-32px))] overflow-y-auto rounded-[18px] border border-slate-200 bg-white shadow-[0_18px_56px_rgba(15,23,42,0.18)]">
                      <div className="flex min-h-full w-full flex-col overflow-hidden bg-white">
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm sm:px-6">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="relative min-w-[220px] max-w-[320px]">
                              <select
                                value={draftAccountInfo?.id || ''}
                                onChange={(event) => handleDraftAccountChange(event.target.value)}
                                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pl-4 pr-9 text-sm font-semibold text-slate-900 focus:outline-none"
                              >
                                {selectableDraftAccounts.map((account) => (
                                  <option key={account.id} value={account.id}>
                                    账户：{account.email || account.name}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-slate-900">
                                {createDraft.mode === 'edit' ? '编辑日程' : '新建日程'}
                              </div>
                              <div className="mt-1 text-xs text-slate-400">
                                {createWindowTimestamp} {createWindowSaveLabel}
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-1 text-slate-400">
                            <button className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-slate-600" aria-label="最小化">
                              <Minus size={16} />
                            </button>
                            <button className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-slate-600" aria-label="窗口化">
                              <Square size={14} />
                            </button>
                            <button
                              onClick={() =>
                                createDraft.isDirty
                                  ? confirmLeaveCreate(() => navTo('calendar'), () => saveDraft('draft'))
                                  : navTo('calendar')
                              }
                              className="rounded-md p-1.5 transition hover:bg-slate-100 hover:text-slate-700"
                              aria-label="关闭"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-3 py-3 sm:px-6">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => saveDraft('send')}
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                              title="Cmd/Ctrl + Enter"
                            >
                              <Send size={15} />
                              发送通知
                            </button>
                            <button
                              onClick={() => saveDraft('draft')}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                              title="Cmd/Ctrl + S"
                            >
                              <Save size={15} />
                              仅保存不发送
                            </button>
                            <div className="relative">
                              <Bell size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <select
                                value={draftForm.reminder}
                                onChange={(event) => patchDraft({ reminder: event.target.value })}
                                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-slate-700 focus:outline-none"
                              >
                                {REMINDER_OPTIONS.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() =>
                                triggerFeedback('L3', {
                                  msg: createDraftParticipantCheckMessage,
                                  icon: <Users size={16} />,
                                  color: 'bg-gray-800',
                                })
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                              <Users size={15} className="text-slate-400" />
                              推荐依据
                            </button>
                            <div className="relative">
                              <Calendar size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <select
                                value={draftForm.availability}
                                onChange={(event) => patchDraft({ availability: event.target.value })}
                                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-slate-700 focus:outline-none"
                              >
                                {AVAILABILITY_OPTIONS.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                            <div className="relative">
                              <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <select
                                value={draftForm.visibility}
                                onChange={(event) => patchDraft({ visibility: event.target.value })}
                                className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-slate-700 focus:outline-none"
                              >
                                {VISIBILITY_OPTIONS.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                            <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700" aria-label="更多操作">
                              <MoreHorizontal size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="border-b border-slate-200 px-4 sm:px-6">
                          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 border-b border-slate-200 py-3 text-sm">
                            <div className="pt-2 text-slate-500">标题</div>
                            <div>
                              <input
                                type="text"
                                value={draftForm.title}
                                onChange={(event) => patchDraft({ title: event.target.value })}
                                placeholder="标题"
                                className="min-w-0 w-full border-none bg-transparent py-1 text-[28px] font-semibold tracking-tight text-slate-900 placeholder:text-slate-300 focus:outline-none"
                                autoFocus
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 border-b border-slate-200 py-3 text-sm">
                            <div className="pt-2 text-slate-500">写入到</div>
                            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                              <div className="relative">
                                <Calendar size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                  value={draftForm.calId}
                                  onChange={(event) => handleDraftCalendarChange(event.target.value)}
                                  className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-sm font-medium text-slate-900 focus:outline-none"
                                >
                                  {draftAccountCalendars.map((calendar) => (
                                    <option key={calendar.id} value={calendar.id}>
                                      {calendar.name}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600">
                                  发起账号 {createDraftAccountLabel}
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600">
                                  目标日历 {createDraftCalendarLabel}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 border-b border-slate-200 py-3 text-sm">
                            <div className="pt-2 text-slate-500">必需</div>
                            <div className="space-y-3">
                              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                                  共 {draftForm.attendees.length} 位
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600">
                                  忙闲可检查 {createDraftRequiredMatchedCount} 位
                                </span>
                                {createDraftRequiredUnmatchedCount > 0 && (
                                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                                    仅邮件名单 {createDraftRequiredUnmatchedCount} 位
                                  </span>
                                )}
                                {createDraftRequiredBusyOnlyCount > 0 && (
                                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-600">
                                    仅忙闲权限 {createDraftRequiredBusyOnlyCount} 位
                                  </span>
                                )}
                              </div>
                              {createDraftLargeAudience ? (
                                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
                                    <div className="text-xs font-semibold text-slate-600">必需参会人</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <button
                                        onClick={() =>
                                          setCreateDraftPanels((prev) => ({ ...prev, requiredBulkOpen: !prev.requiredBulkOpen }))
                                        }
                                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                      >
                                        {createDraftPanels.requiredBulkOpen ? '收起批量粘贴' : '批量粘贴名单'}
                                      </button>
                                      {draftForm.attendees.length > createDraftRequiredPreviewCount && (
                                        <button
                                          onClick={() =>
                                            setCreateDraftPanels((prev) => ({ ...prev, requiredExpanded: !prev.requiredExpanded }))
                                          }
                                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                          {createDraftPanels.requiredExpanded ? '收起名单' : `查看全部 ${draftForm.attendees.length} 位`}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  {createDraftVisibleRequiredAttendees.length > 0 ? (
                                    <div className="max-h-44 overflow-y-auto divide-y divide-slate-100">
                                      {createDraftVisibleRequiredAttendees.map((person) => {
                                        const display = getParticipantDisplay(person);
                                        return (
                                          <div key={person} className="flex items-center justify-between gap-3 px-3 py-2">
                                            <div className="min-w-0">
                                              <div className="truncate text-sm font-medium text-slate-800">{display.title}</div>
                                              <div className="truncate text-xs text-slate-400">{display.subtitle || person}</div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                              {display.tag && (
                                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                                                  {display.tag}
                                                </span>
                                              )}
                                              <button
                                                onClick={() => removeAttendee(person, 'attendees')}
                                                title={`移除 ${person}`}
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                                              >
                                                <X size={12} />
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="px-3 py-4 text-sm text-slate-400">还没有添加必需参会人</div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex min-h-[42px] flex-wrap items-center gap-2">
                                  {createDraftVisibleRequiredAttendees.map((person) => {
                                    const display = getParticipantDisplay(person);
                                    return (
                                      <button
                                        key={person}
                                        onClick={() => removeAttendee(person, 'attendees')}
                                        title={person}
                                        className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-left text-sm font-medium text-slate-700"
                                      >
                                        <span className="max-w-[220px] truncate">{display.title}</span>
                                        {display.subtitle && <span className="max-w-[180px] truncate text-xs text-slate-400">{display.subtitle}</span>}
                                        <X size={12} className="shrink-0" />
                                      </button>
                                    );
                                  })}
                                  <input
                                    type="text"
                                    value={draftForm.inviteInput}
                                    onChange={(event) => patchDraft({ inviteInput: event.target.value })}
                                    onKeyDown={(event) => handleAttendeeInputKeyDown(event, 'attendees', 'inviteInput')}
	                                    placeholder="姓名或邮箱"
                                    className="min-w-[220px] flex-1 border-none bg-transparent py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => addAttendee('attendees', 'inviteInput')}
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                  >
                                    <UserPlus size={15} />
                                    添加
                                  </button>
                                  <button
                                    onClick={() =>
                                      setCreateDraftPanels((prev) => ({ ...prev, requiredBulkOpen: !prev.requiredBulkOpen }))
                                    }
                                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                  >
                                    批量粘贴
                                  </button>
                                </div>
                              )}
                              {createDraftPanels.requiredBulkOpen && (
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
	                                  <textarea
                                    value={createDraftBulkInputs.attendees}
                                    onChange={(event) => setCreateDraftBulkInputs((prev) => ({ ...prev, attendees: event.target.value }))}
                                    rows={createDraftMassAudience ? 6 : 4}
                                    placeholder="例如：\nme@calendarpro.io\nsales@calendarpro.io\n客户代表A <guest@example.com>"
                                    className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                  />
                                  <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setCreateDraftBulkInputs((prev) => ({ ...prev, attendees: '' }));
                                        setCreateDraftPanels((prev) => ({ ...prev, requiredBulkOpen: false }));
                                      }}
                                      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                                    >
                                      取消
                                    </button>
                                    <button
                                      onClick={() => applyBulkAttendeeInput('attendees')}
                                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800"
                                    >
                                      <UserPlus size={15} />
                                      导入到必需参会人
                                    </button>
                                  </div>
                                </div>
                              )}
                              {createDraftLargeAudience && (
                                <div className="flex min-h-[42px] flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                                  <input
                                    type="text"
                                    value={draftForm.inviteInput}
                                    onChange={(event) => patchDraft({ inviteInput: event.target.value })}
                                    onKeyDown={(event) => handleAttendeeInputKeyDown(event, 'attendees', 'inviteInput')}
	                                    placeholder="姓名或邮箱"
                                    className="min-w-[220px] flex-1 border-none bg-transparent py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => addAttendee('attendees', 'inviteInput')}
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                  >
                                    <UserPlus size={15} />
                                    添加
                                  </button>
                                </div>
                              )}
	                              {createDraftRequiredText && <div className="mt-2 text-xs text-slate-400">{createDraftRequiredText}</div>}
                            </div>
                          </div>

                          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 border-b border-slate-200 py-3 text-sm">
                            <div className="pt-2 text-slate-500">可选</div>
                            <div className="space-y-3">
                              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                                  共 {(draftForm.optionalAttendees || []).length} 位
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600">
                                  忙闲可检查 {createDraftOptionalMatchedCount} 位
                                </span>
                                {createDraftOptionalUnmatchedCount > 0 && (
                                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                                    仅邮件名单 {createDraftOptionalUnmatchedCount} 位
                                  </span>
                                )}
                                {createDraftOptionalBusyOnlyCount > 0 && (
                                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-600">
                                    仅忙闲权限 {createDraftOptionalBusyOnlyCount} 位
                                  </span>
                                )}
                              </div>
                              {createDraftLargeAudience ? (
                                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
                                    <div className="text-xs font-semibold text-slate-600">可选参会人</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <button
                                        onClick={() =>
                                          setCreateDraftPanels((prev) => ({ ...prev, optionalBulkOpen: !prev.optionalBulkOpen }))
                                        }
                                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                      >
                                        {createDraftPanels.optionalBulkOpen ? '收起批量粘贴' : '批量粘贴名单'}
                                      </button>
                                      {(draftForm.optionalAttendees || []).length > createDraftOptionalPreviewCount && (
                                        <button
                                          onClick={() =>
                                            setCreateDraftPanels((prev) => ({ ...prev, optionalExpanded: !prev.optionalExpanded }))
                                          }
                                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                          {createDraftPanels.optionalExpanded ? '收起名单' : `查看全部 ${(draftForm.optionalAttendees || []).length} 位`}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  {createDraftVisibleOptionalAttendees.length > 0 ? (
                                    <div className="max-h-40 overflow-y-auto divide-y divide-slate-100">
                                      {createDraftVisibleOptionalAttendees.map((person) => {
                                        const display = getParticipantDisplay(person);
                                        return (
                                          <div key={person} className="flex items-center justify-between gap-3 px-3 py-2">
                                            <div className="min-w-0">
                                              <div className="truncate text-sm font-medium text-slate-800">{display.title}</div>
                                              <div className="truncate text-xs text-slate-400">{display.subtitle || person}</div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                              {display.tag && (
                                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                                                  {display.tag}
                                                </span>
                                              )}
                                              <button
                                                onClick={() => removeAttendee(person, 'optionalAttendees')}
                                                title={`移除 ${person}`}
                                                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                                              >
                                                <X size={12} />
                                              </button>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="px-3 py-4 text-sm text-slate-400">当前没有可选参与人</div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex min-h-[42px] flex-wrap items-center gap-2">
                                  {createDraftVisibleOptionalAttendees.map((person) => {
                                    const display = getParticipantDisplay(person);
                                    return (
                                      <button
                                        key={person}
                                        onClick={() => removeAttendee(person, 'optionalAttendees')}
                                        title={person}
                                        className="inline-flex max-w-full items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
                                      >
                                        <span className="max-w-[220px] truncate">{display.title}</span>
                                        {display.subtitle && <span className="max-w-[180px] truncate text-xs text-slate-400">{display.subtitle}</span>}
                                        <X size={12} className="shrink-0" />
                                      </button>
                                    );
                                  })}
                                  <input
                                    type="text"
                                    value={draftForm.optionalInviteInput || ''}
                                    onChange={(event) => patchDraft({ optionalInviteInput: event.target.value })}
                                    onKeyDown={(event) => handleAttendeeInputKeyDown(event, 'optionalAttendees', 'optionalInviteInput')}
	                                    placeholder="可选参与人"
                                    className="min-w-[220px] flex-1 border-none bg-transparent py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => addAttendee('optionalAttendees', 'optionalInviteInput')}
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                  >
                                    <UserPlus size={15} />
                                    添加
                                  </button>
                                  <button
                                    onClick={() =>
                                      setCreateDraftPanels((prev) => ({ ...prev, optionalBulkOpen: !prev.optionalBulkOpen }))
                                    }
                                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                  >
                                    批量粘贴
                                  </button>
                                </div>
                              )}
                              {createDraftPanels.optionalBulkOpen && (
                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
	                                  <textarea
                                    value={createDraftBulkInputs.optionalAttendees}
                                    onChange={(event) =>
                                      setCreateDraftBulkInputs((prev) => ({ ...prev, optionalAttendees: event.target.value }))
                                    }
                                    rows={createDraftMassAudience ? 5 : 4}
                                    placeholder="例如：\nassistant@calendarpro.io\nfinance@calendarpro.io"
                                    className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                  />
                                  <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        setCreateDraftBulkInputs((prev) => ({ ...prev, optionalAttendees: '' }));
                                        setCreateDraftPanels((prev) => ({ ...prev, optionalBulkOpen: false }));
                                      }}
                                      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                                    >
                                      取消
                                    </button>
                                    <button
                                      onClick={() => applyBulkAttendeeInput('optionalAttendees')}
                                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800"
                                    >
                                      <UserPlus size={15} />
                                      导入到可选参与人
                                    </button>
                                  </div>
                                </div>
                              )}
                              {createDraftLargeAudience && (
                                <div className="flex min-h-[42px] flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                                  <input
                                    type="text"
                                    value={draftForm.optionalInviteInput || ''}
                                    onChange={(event) => patchDraft({ optionalInviteInput: event.target.value })}
                                    onKeyDown={(event) => handleAttendeeInputKeyDown(event, 'optionalAttendees', 'optionalInviteInput')}
	                                    placeholder="可选参与人"
                                    className="min-w-[220px] flex-1 border-none bg-transparent py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => addAttendee('optionalAttendees', 'optionalInviteInput')}
                                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                  >
                                    <UserPlus size={15} />
                                    添加
                                  </button>
                                </div>
                              )}
	                              {createDraftOptionalText && <div className="mt-2 text-xs text-slate-400">{createDraftOptionalText}</div>}
                            </div>
                          </div>

                          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 border-b border-slate-200 py-3 text-sm">
                            <div className="pt-2 text-slate-500">开始</div>
                            <div className="grid gap-3 md:grid-cols-[188px_160px_minmax(0,1fr)] md:items-center">
                              <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3">
                                <Calendar size={15} className="shrink-0 text-slate-400" />
                                <input
                                  type="date"
                                  value={formatDateLabel(draftForm.date)}
                                  onChange={(event) => handleDraftDateChange(event.target.value)}
                                  className="w-full border-none bg-transparent py-1 text-sm font-medium text-slate-900 focus:outline-none"
                                />
                              </label>
                              <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3">
                                <Clock size={15} className="shrink-0 text-slate-400" />
                                <select
                                  value={String(draftForm.startH)}
                                  onChange={(event) => handleDraftStartTimeChange(event.target.value)}
                                  className="w-full appearance-none border-none bg-transparent py-1 text-sm font-medium text-slate-900 focus:outline-none"
                                >
                                  {TIME_SELECT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <div className="text-xs text-slate-400">组织者：{draftForm.organizer || createDraftAccountLabel}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 border-b border-slate-200 py-3 text-sm">
                            <div className="pt-2 text-slate-500">结束</div>
                            <div className="grid gap-3 md:grid-cols-[188px_160px_minmax(0,1fr)] md:items-center">
                              <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3">
                                <Calendar size={15} className="shrink-0 text-slate-400" />
                                <input
                                  type="date"
                                  value={formatDateLabel(draftEndMeta.date)}
                                  onChange={(event) => handleDraftEndDateChange(event.target.value, draftEndMeta.hour)}
                                  className="w-full border-none bg-transparent py-1 text-sm font-medium text-slate-900 focus:outline-none"
                                />
                              </label>
                              <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3">
                                <Clock size={15} className="shrink-0 text-slate-400" />
                                <select
                                  value={String(draftEndMeta.hour)}
                                  onChange={(event) => handleDraftEndTimeChange(event.target.value, draftEndMeta.date)}
                                  className="w-full appearance-none border-none bg-transparent py-1 text-sm font-medium text-slate-900 focus:outline-none"
                                >
                                  {TIME_SELECT_END_OPTIONS.filter((option) => {
                                    const optionValue = Number(option.value);
                                    return sameDay(draftForm.date, draftEndMeta.date) ? optionValue > draftForm.startH : true;
                                  }).map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 font-semibold ${createDraftScheduleTone}`}>
                                  {createDraftScheduleText}
                                </span>
                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600">
                                  时长 {createDraftDurationLabel}
                                </span>
                                {createDraftSpansMultipleDays && (
                                  <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                                    跨天
                                  </span>
                                )}
                              </div>
                              {createDraftConflictPreviewItems.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  {createDraftConflictPreviewItems.map((item) => (
                                    <span
                                      key={item.id}
                                      className="inline-flex max-w-full items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1 font-semibold text-red-700"
                                      title={`${item.accountLabel} · ${item.eventLabel}`}
                                    >
                                      <span className="max-w-[140px] truncate">{item.accountLabel}</span>
                                      <span className="text-red-400">·</span>
                                      <span className="max-w-[220px] truncate">{item.eventLabel}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 border-b border-slate-200 py-3 text-sm">
                            <div className="pt-2 text-slate-500">定期</div>
                            <div className="flex flex-wrap items-center gap-3">
                              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={draftForm.repeat !== 'does_not_repeat'}
                                  onChange={(event) =>
                                    patchDraft({
                                      repeat: event.target.checked ? 'every_week' : 'does_not_repeat',
                                    })
                                  }
                                  className="h-4 w-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                                />
                                标记为定期
                              </label>
                              {draftForm.repeat !== 'does_not_repeat' && (
                                <div className="relative">
                                  <RefreshCw size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <select
                                    value={draftForm.repeat}
                                    onChange={(event) => patchDraft({ repeat: event.target.value })}
                                    className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-slate-700 focus:outline-none"
                                  >
                                    {REPEAT_OPTIONS.filter((option) => option.id !== 'does_not_repeat').map((option) => (
                                      <option key={option.id} value={option.id}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                              )}
	                              {draftForm.repeat !== 'does_not_repeat' && (
	                                <div className="text-xs text-slate-400">{REPEAT_LABELS[draftForm.repeat] || '每周'}</div>
	                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-3 py-3 text-sm">
                            <div className="pt-2 text-slate-500">地点</div>
                            <div className="space-y-3">
                              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                                <div className="flex min-h-[42px] items-center gap-3">
                                  <MapPin size={15} className="shrink-0 text-slate-400" />
                                  <input
                                    type="text"
                                    value={draftForm.location}
                                    onChange={(event) => patchDraft({ location: event.target.value })}
	                                    placeholder="地点或会议室"
                                    className="min-w-0 flex-1 border-none bg-transparent py-1 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                  />
                                </div>
                                <div className="relative">
                                  <Calendar size={15} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <select
                                    value={draftForm.meetingProvider}
                                    onChange={(event) => setDraftMeetingProvider(event.target.value)}
                                    className="w-full appearance-none border-none bg-transparent py-1 pl-6 pr-6 text-sm font-medium text-slate-700 focus:outline-none"
                                  >
                                    {MEETING_PROVIDER_OPTIONS.map((option) => (
                                      <option key={option.id} value={option.id}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown size={14} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-slate-400" />
                                </div>
                              </div>
                              {draftForm.meetingProvider !== 'none' && draftForm.meetingProvider !== 'phone' && (
                                <div className="flex items-center gap-3">
                                  <Copy size={15} className="shrink-0 text-slate-400" />
                                  <input
                                    type="text"
                                    value={draftForm.meetingLink}
                                    onChange={(event) => patchDraft({ meetingLink: event.target.value })}
                                    placeholder="粘贴或编辑加入链接"
                                    className="min-w-0 flex-1 border-none bg-transparent py-1 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => copyTextToClipboard(draftForm.meetingLink, '会议链接已复制')}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                  >
                                    复制链接
                                  </button>
                                </div>
                              )}
                              <div className="text-xs text-slate-400">
                                {draftForm.meetingProvider === 'none'
                                  ? '不附带会议链接，适合线下或待定会议方式的日程'
                                  : draftForm.meetingProvider === 'phone'
                                    ? '已按电话 / 线下方式处理，可直接补充会议室或拨号信息'
                                    : '保存或发送时会保留当前会议链接'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 px-3 py-2 sm:px-6">
                          <button className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" aria-label="撤回">
                            <Reply size={15} />
                          </button>
                          <button className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" aria-label="重做">
                            <Forward size={15} />
                          </button>
                          <div className="mx-1 h-5 w-px bg-slate-200" />
                          <button className="rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800">正文</button>
                          <button className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" onClick={() => handleEditorTool('agenda')} aria-label="插入议程">
                            <Type size={15} />
                          </button>
                          <button className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" onClick={() => handleEditorTool('grid')} aria-label="插入待办">
                            <LayoutGrid size={15} />
                          </button>
                          <button className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" onClick={() => handleEditorTool('camera')} aria-label="插入截图占位">
                            <Camera size={15} />
                          </button>
                          <div className="mx-1 h-5 w-px bg-slate-200" />
                          <button className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" aria-label="正文布局">
                            <AlignLeft size={15} />
                          </button>
                          <button
                            onClick={() => copyTextToClipboard(draftForm.meetingLink, '会议链接已复制')}
                            disabled={!draftForm.meetingLink}
                            className={`rounded-md p-2 transition ${
                              draftForm.meetingLink
                                ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                                : 'cursor-not-allowed text-slate-300'
                            }`}
                            aria-label="复制会议链接"
                          >
                            <Copy size={15} />
                          </button>
                          <button className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" aria-label="搜索">
                            <Search size={15} />
                          </button>
                          <button className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700" aria-label="插入时间信息">
                            <Clock size={15} />
                          </button>
                        </div>

                        <textarea
                          value={draftForm.description}
                          onChange={(event) => patchDraft({ description: event.target.value })}
                          className="min-h-[420px] flex-1 resize-none border-none bg-white px-4 py-5 text-sm leading-7 text-slate-800 placeholder:text-slate-400 focus:outline-none sm:px-6"
                          placeholder="补充会议背景、目标、议程和会前准备..."
                        ></textarea>

                        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 sm:px-6">
                          <div className="text-xs text-slate-500">
                            {createDraft.mode === 'edit'
                              ? '保存草稿只保存本地修改，不会立即给与会人发送更新。'
                              : '可先保存草稿，确认无误后再发送通知。'}
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => saveDraft('draft')}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Save size={15} />
                              仅保存不发送
                            </button>
                            <button
                              onClick={() => saveDraft('send')}
                              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                              <Send size={15} />
                              发送通知
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ),
                  document.body,
                )}
              </div>
          ) : activeProduct === 'mail' ? (
            <MailWorkspace
              accounts={accounts}
              mails={filteredMails}
              mailFolder={mailFolder}
              mailFocusTab={mailFocusTab}
              unreadOnly={mailUnreadOnly}
              selectedMail={selectedMail && filteredMails.some((mail) => mail.id === selectedMail.id) ? selectedMail : filteredMails[0] || null}
              onSelectMail={handleSelectMail}
              onToggleStar={toggleMailStar}
              onToggleRead={toggleMailRead}
              onArchiveMail={archiveMail}
              onCompose={openMailComposer}
              onEditDraft={(mailId) => openMailComposer('editDraft', mailId)}
              onScheduleFromMail={createEventFromMail}
              onOpenLinkedEvent={(eventId) => navTo('details', eventId)}
              onToggleUnreadOnly={() => setMailUnreadOnly((prev) => !prev)}
              onSetMailFocusTab={setMailFocusTab}
              upcomingEvents={reminderEvents.upcoming}
              linkedEventLookup={allEventLookup}
              accountMap={accountMap}
              calendarMap={calendarMap}
              onOpenEvent={(eventId) => navTo('details', eventId)}
            />
          ) : (
            <ModulePlaceholder moduleId={activeProduct} onBack={() => handleProductSelect('calendar')} />
          )}
        </div>
      </div>

      {mailComposer.open && (
        <Suspense fallback={null}>
          <MailComposerModal
            open={mailComposer.open}
            draft={mailComposer.draft}
            accounts={accounts}
            contacts={MAIL_CONTACTS}
            onClose={closeMailComposer}
            onChange={patchMailComposer}
            onAddRecipient={addMailRecipient}
            onAddAttachment={addMailAttachment}
            onRemoveAttachment={removeMailAttachment}
            onSaveDraft={() => saveMailComposer('draft')}
            onSend={() => saveMailComposer('send')}
          />
        </Suspense>
      )}

      <AddSharedCalendarModal
        open={sharedCalendarDialog.open}
        draft={sharedCalendarDialog}
        accounts={accounts}
        invitations={shareInvitations}
        onClose={closeSharedCalendarDialog}
        onChange={patchSharedCalendarDialog}
        onSubmit={submitSharedCalendarDialog}
        onAcceptInvitation={acceptShareInvitation}
        onIgnoreInvitation={ignoreShareInvitation}
        onSetInvitationPermission={setShareInvitationPermission}
      />

      <ReminderModal
        open={reminderDialogOpen}
        onClose={() => setReminderDialogOpen(false)}
        pendingEvents={reminderEvents.pending}
        upcomingEvents={reminderEvents.upcoming}
        accountMap={accountMap}
        calendarMap={calendarMap}
        onOpenEvent={(id) => {
          setReminderDialogOpen(false);
          navTo('details', id);
        }}
        onRespond={(id, action) => {
          handleRespondToEvent(id, action);
        }}
      />

      <ShortcutHelpModal open={shortcutHelpOpen} onClose={() => setShortcutHelpOpen(false)} />

      {/* ===== 日历颜色选择器 ===== */}
      {calendarColorPicker.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={closeColorPicker}>
          <div className="max-h-[70vh] w-72 overflow-y-auto rounded-2xl bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-3 text-sm font-bold text-gray-800">选择颜色</h3>
            <div className="grid grid-cols-9 gap-2">
              {CALENDAR_COLORS.map((c) => (
                <button
                  key={c}
                  className={`h-8 w-8 rounded-full ${c} ring-offset-2 transition hover:scale-110 ${((calendarColorPicker.targetType === 'account' ? accounts.find(a => a.id === calendarColorPicker.targetId)?.color : calendars.find(c2 => c2.id === calendarColorPicker.targetId)?.color) === c) ? 'ring-2 ring-slate-800' : ''}`}
                  onClick={() => applyCalendarColor(c)}
                />
              ))}
            </div>
            <button onClick={closeColorPicker} className="mt-4 w-full rounded-xl py-2 text-xs font-medium text-gray-500 transition hover:bg-slate-100">取消</button>
          </div>
        </div>
      )}

      {/* ===== 日历重命名 ===== */}
      {calendarRenameDialog.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={closeRenameDialog}>
          <div className="max-h-[70vh] w-80 overflow-y-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-3 text-sm font-bold text-gray-800">重命名日历</h3>
            <input
              autoFocus
              value={calendarRenameDialog.name}
              onChange={(e) => setCalendarRenameDialog((prev) => ({ ...prev, name: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') submitRename(); if (e.key === 'Escape') closeRenameDialog(); }}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/30"
              placeholder="输入日历名称"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={closeRenameDialog} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-slate-100">取消</button>
              <button
                onClick={submitRename}
                disabled={!calendarRenameDialog.name.trim()}
                className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-40"
              >确认</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 删除日历确认 ===== */}
      {calendarDeleteConfirm.open && (() => {
        const cal = calendars.find((c) => c.id === calendarDeleteConfirm.targetId);
        return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={closeDeleteConfirm}>
          <div className="max-h-[70vh] w-80 overflow-y-auto rounded-2xl bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-1.5 text-sm font-bold text-gray-800">删除日历</h3>
            <p className="mb-4 text-sm text-gray-500 leading-relaxed">
              确认删除「<span className="font-medium text-gray-700">{cal?.name || '该日历'}</span>」？
              删除后该日历下的所有日程将被移除，此操作不可撤销。
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={closeDeleteConfirm} className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 transition hover:bg-slate-100">取消</button>
              <button onClick={confirmDeleteCalendar} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700">确认删除</button>
            </div>
          </div>
        </div>
        );
      })()}

      {activeProduct === 'calendar' && currentScreen === 'calendar' && hoverPreview && previewedEvent && !eventInteraction && (
        <EventPreviewCard
          event={previewedEvent}
          calendar={calendarMap[previewedEvent.calId]}
          account={accountMap[calendarMap[previewedEvent.calId]?.accountId]}
          x={hoverPreview.x}
          y={hoverPreview.y}
          onMouseEnter={clearPreviewCloseTimer}
          onMouseLeave={() => hideEventPreview(previewedEvent.id)}
          onOpenEvent={openEventDetails}
          onJoinEvent={joinEventFromPreview}
        />
      )}

      {activeProduct === 'calendar' && currentScreen === 'calendar' && eventInteraction && interactionPreviewEvent && (
        <EventPreviewCard
          event={interactionPreviewEvent}
          calendar={calendarMap[interactionPreviewEvent.calId]}
          account={accountMap[calendarMap[interactionPreviewEvent.calId]?.accountId]}
          x={eventInteraction.pointer?.x || 24}
          y={eventInteraction.pointer?.y || 24}
          mode="drag"
          label={eventInteraction.type === 'resize' ? '调整时长' : '拖拽改期'}
        />
      )}

      {contextMenu && contextMenu.slot && (
        <div
          className="fixed z-50 w-64 rounded-[18px] border border-slate-200 bg-white py-1 shadow-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-1 border-b border-slate-100 px-3 py-2">
            <div className="text-xs font-bold text-gray-800">所选时段</div>
            <div className="text-[11px] text-gray-500 mt-1">
              {formatDateLabel(contextMenu.slot.date)} {formatTimeRange(contextMenu.slot.startH, contextMenu.slot.durationH)}
            </div>
          </div>
          <button
            onClick={() => {
              navTo('create', null, contextMenu.slot);
              setContextMenu(null);
              clearTimeSelection();
            }}
            className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
          >
            <Plus size={14} className="mr-2" />
            新建日程
          </button>
          <button
            onClick={() => {
              handleAddSharedCalendar();
              setContextMenu(null);
              clearTimeSelection();
            }}
            className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
          >
            <Calendar size={14} className="mr-2" />
            添加共享日历
          </button>
          <button
            onClick={() => {
              setContextMenu(null);
              clearTimeSelection();
            }}
            className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-500 transition hover:bg-slate-50"
          >
            <X size={14} className="mr-2" />
            取消选择
          </button>
        </div>
      )}

      {contextMenu && contextMenu.event && (
        <div
          className="fixed z-50 w-48 rounded-[18px] border border-slate-200 bg-white py-1 shadow-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-1 border-b border-slate-100 px-3 py-2">
            <div className="text-xs font-bold text-gray-800 truncate">{contextMenu.event.title || '未知'}</div>
          </div>
          {contextMenu.event.type !== 'busy_only' && contextMenu.event.status !== '已取消' && (
            <>
              <button
                onClick={() => {
                  navTo('details', contextMenu.event.id);
                  setContextMenu(null);
                }}
                className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
              >
                <Eye size={14} className="mr-2" />
                查看详情
              </button>
              <button
                onClick={() => {
                  navTo('create', contextMenu.event.id);
                  setContextMenu(null);
                }}
                className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
              >
                <Edit size={14} className="mr-2" />
                编辑
              </button>
            </>
          )}
          <button
            onClick={() => {
              handleDeleteEvent(contextMenu.event.id);
              setContextMenu(null);
            }}
            className="flex w-full items-center px-3 py-2 text-left text-sm font-bold text-red-600 transition hover:bg-red-50/90"
          >
            <Trash size={14} className="mr-2" />
            移除
          </button>
        </div>
      )}

      {contextMenu && contextMenu.account && (
        <div
          className="fixed z-50 w-52 rounded-[18px] border border-slate-200 bg-white py-1 shadow-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-0.5 border-b border-slate-100 px-3 py-2">
            <div className="text-xs font-bold text-gray-800 truncate">{getAccountDisplayLabel(contextMenu.account) || '未知账号'}</div>
            <div className="text-[11px] text-gray-400 mt-0.5 truncate">{contextMenu.account.email || ''}</div>
          </div>
          {contextMenu.account.ownership !== 'shared' ? (
            <>
              <button
                onClick={() => { openMailboxPermissions(contextMenu.account.id, 'settings'); setContextMenu(null); }}
                className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
              >
                <Settings size={14} className="mr-2 text-gray-400" />
                设置
              </button>
              <button
                onClick={() => { openMailboxPermissions(contextMenu.account.id, 'sharing'); setContextMenu(null); }}
                className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
              >
                <Users size={14} className="mr-2 text-gray-400" />
                共享权限
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openColorPicker(contextMenu.account.id, 'account')}
                className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
              >
                <Palette size={14} className="mr-2 text-gray-400" />
                颜色
              </button>
              <button
                onClick={() => { openSharedCalendarAccess(contextMenu.account.id); setContextMenu(null); }}
                className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
              >
                <Eye size={14} className="mr-2 text-gray-400" />
                查看权限
              </button>
              <button
                onClick={() => requestRemoveSharedAccount(contextMenu.account)}
                className="flex w-full items-center px-3 py-2 text-left text-sm font-bold text-red-600 transition hover:bg-red-50/90"
              >
                <X size={14} className="mr-2" />
                从列表移除
              </button>
            </>
          )}
        </div>
      )}

      {/* Hover ... more menu for accounts */}
      {accountMenuAnchor && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeAccountMenu} />
          <div
            className="fixed z-50 w-52 rounded-[18px] border border-slate-200 bg-white py-1 shadow-lg"
            style={{ top: accountMenuAnchor.y, left: Math.min(accountMenuAnchor.x, window.innerWidth - 212) }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-0.5 border-b border-slate-100 px-3 py-2">
              <div className="text-xs font-bold text-gray-800 truncate">{getAccountDisplayLabel(accountMenuAnchor.account)}</div>
              <div className="text-[11px] text-gray-400 mt-0.5 truncate">{accountMenuAnchor.account.email}</div>
            </div>
            {accountMenuAnchor.account.ownership !== 'shared' ? (
              <>
                <button
                  onClick={() => { openMailboxPermissions(accountMenuAnchor.account.id, 'settings'); closeAccountMenu(); }}
                  className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
                >
                  <Settings size={14} className="mr-2 text-gray-400" />
                  设置
                </button>
                <button
                  onClick={() => { openMailboxPermissions(accountMenuAnchor.account.id, 'sharing'); closeAccountMenu(); }}
                  className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
                >
                  <Users size={14} className="mr-2 text-gray-400" />
                  共享权限
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openColorPicker(accountMenuAnchor.account.id, 'account')}
                  className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
                >
                  <Palette size={14} className="mr-2 text-gray-400" />
                  颜色
                </button>
                <button
                  onClick={() => { openSharedCalendarAccess(accountMenuAnchor.account.id); closeAccountMenu(); }}
                  className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
                >
                  <Eye size={14} className="mr-2 text-gray-400" />
                  查看权限
                </button>
                <button
                  onClick={() => requestRemoveSharedAccount(accountMenuAnchor.account)}
                  className="flex w-full items-center px-3 py-2 text-left text-sm font-bold text-red-600 transition hover:bg-red-50/90"
                >
                  <X size={14} className="mr-2" />
                  从列表移除
                </button>
              </>
            )}
          </div>
        </>
      )}

      {permissionPanel.type === 'calendar' && selectedPermissionCalendar && (
        <CalendarPermissionModal
          calendar={selectedPermissionCalendar}
          onClose={closePermissionPanel}
          onUpdateShare={(shareId, patch) => updateCalendarShare(selectedPermissionCalendar.id, shareId, patch)}
          onAddShare={(scope) => addCalendarShare(selectedPermissionCalendar.id, scope)}
          onRemoveShare={(shareId) => removeCalendarShare(selectedPermissionCalendar.id, shareId)}
        />
      )}

      {permissionPanel.type === 'mailbox' && selectedPermissionMailbox && (
        <MailboxPermissionModal
          account={selectedPermissionMailbox}
          accountCalendars={selectedPermissionMailboxCalendars}
          initialTab={permissionPanel.tab || 'settings'}
          onClose={closePermissionPanel}
          onRenameAccount={renameAccount}
          onUpdateAccountColor={updateAccountColor}
          onExportAccountCalendar={exportAccountCalendar}
          onDeleteAccountCalendars={requestDeleteAccountCalendars}
          pendingInvitations={pendingShareInvitations}
          onUpdateCalendarShare={updateCalendarShare}
          onAddCalendarShare={addCalendarShare}
          onRemoveCalendarShare={removeCalendarShare}
          onSetInvitationPermission={setShareInvitationPermission}
          onAcceptInvitation={acceptShareInvitation}
          onIgnoreInvitation={ignoreShareInvitation}
          onRemoveSharedAccount={requestRemoveSharedAccount}
        />
      )}

      {permissionPanel.type === 'shared_access' && selectedSharedAccessCalendar && (
        <SharedCalendarAccessModal
          calendar={selectedSharedAccessCalendar}
          account={accountMap[selectedSharedAccessCalendar.accountId]}
          onClose={closePermissionPanel}
        />
      )}

      {feedback.type === 'L4' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="w-11/12 max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
            <h3 className="text-lg font-black text-gray-900 mb-2">{feedback.payload?.title || '确认操作'}</h3>
            <p className="text-sm text-gray-600 mb-6">{feedback.payload?.desc}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={feedback.payload?.cancelText ? () => setFeedback({ type: null, payload: null }) : undefined}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-gray-700"
              >
                {feedback.payload?.cancelText || '取消'}
              </button>
              {feedback.payload?.secondaryText && feedback.payload?.onSecondary && (
                <button
                  onClick={() => {
                    const handler = feedback.payload?.onSecondary;
                    setFeedback({ type: null, payload: null });
                    handler?.();
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700"
                >
                  {feedback.payload.secondaryText}
                </button>
              )}
              <button
                onClick={feedback.payload?.onConfirm}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
              >
                {feedback.payload?.confirmText || '确认'}
              </button>
            </div>
          </div>
        </div>
      )}

      {feedback.type === 'L3' && (
        <div
          className={`absolute left-1/2 top-20 z-50 flex -translate-x-1/2 items-center rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-md ${
            feedback.payload?.color || 'bg-gray-800'
          }`}
        >
          {feedback.payload?.icon}
          <span className="ml-2">{feedback.payload?.msg}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
