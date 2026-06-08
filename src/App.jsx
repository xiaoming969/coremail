import { lazy, Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import AppIcon from './components/AppIcon';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import MailReadingPane from './features/mail/components/MailReadingPane';
import { MAIL_READING_STATE_BY_MAIL_ID } from './features/mail/data/mockMailReadingStates';
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
  MEETING_PROVIDER_LABELS,
  REPEAT_LABELS,
  REMINDER_LABELS,
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
  getCalendarPermissionId,
  getCalendarPermissionLabel,
  getCalendarPermissionOption,
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
  getEventEndTimestamp,
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

const createIconifyIcon = (name) =>
  function IconifyIcon({ size = 20, className, 'aria-label': ariaLabel, ...props }) {
    return <AppIcon name={name} size={size} className={className} ariaLabel={ariaLabel} {...props} />;
  };

const createLucideIcon = (name) => createIconifyIcon(`lucide:${name}`);
const resolveIconComponent = (icon) => (typeof icon === 'string' ? createIconifyIcon(icon) : icon);

const AlertCircle = createLucideIcon('circle-alert');
const AlignLeft = createLucideIcon('align-left');
const Archive = createLucideIcon('archive');
const ArrowRight = createLucideIcon('arrow-right');
const Bell = createLucideIcon('bell');
const Calendar = createLucideIcon('calendar');
const Check = createLucideIcon('check');
const ChevronDown = createLucideIcon('chevron-down');
const ChevronLeft = createLucideIcon('chevron-left');
const ChevronRight = createLucideIcon('chevron-right');
const ChevronsLeft = createLucideIcon('chevrons-left');
const ChevronsRight = createLucideIcon('chevrons-right');
const Clock = createLucideIcon('clock');
const Copy = createLucideIcon('copy');
const Edit = createLucideIcon('pencil');
const Eye = createLucideIcon('eye');
const FileText = createLucideIcon('file-text');
const Flag = createLucideIcon('flag');
const FlagFilled = createIconifyIcon('ph:flag-fill');
const Forward = createLucideIcon('forward');
const Funnel = createLucideIcon('funnel');
const HelpCircle = createLucideIcon('circle-help');
const ListFilter = createLucideIcon('list-filter');
const Lock = createLucideIcon('lock');
const Mail = createLucideIcon('mail');
const MailOpen = createLucideIcon('mail-open');
const MapPin = createLucideIcon('map-pin');
const Maximize2 = createLucideIcon('maximize-2');
const Minus = createLucideIcon('minus');
const Minimize2 = createLucideIcon('minimize-2');
const MoreHorizontal = createLucideIcon('more-horizontal');
const Palette = createLucideIcon('palette');
const Paperclip = createLucideIcon('paperclip');
const PanelRightOpen = createLucideIcon('panel-right-open');
const Plus = createLucideIcon('plus');
const RefreshCw = createLucideIcon('refresh-cw');
const Reply = createLucideIcon('reply');
const ReplyAll = createLucideIcon('reply-all');
const Save = createLucideIcon('save');
const Search = createLucideIcon('search');
const Send = createLucideIcon('send');
const Settings = createLucideIcon('settings');
const Sparkles = createLucideIcon('sparkles');
const Square = createLucideIcon('square');
const SquareCheck = createLucideIcon('square-check');
const SquarePen = createLucideIcon('square-pen');
const Trash = createLucideIcon('trash');
const UserPlus = createLucideIcon('user-plus');
const Users = createLucideIcon('users');
const Video = createLucideIcon('video');
const X = createLucideIcon('x');

const CalendarSearchResults = lazy(() => import('./features/calendarSearch/CalendarSearchResults.jsx'));
const MailComposerModal = lazy(() => import('./features/mail/MailComposerModal.jsx'));

const APP_SIDEBAR_WIDTH = 'clamp(240px, 18.52vw, 320px)';
const APP_SIDEBAR_MIN_WIDTH = 240;
const APP_SIDEBAR_MAX_WIDTH = 320;
const CALENDAR_SIDEBAR_DEFAULT_WIDTH = 276;
const MAIL_SIDEBAR_DEFAULT_WIDTH = 320;
const MAIL_LIST_DEFAULT_WIDTH = 544;
const MAIL_LIST_MIN_WIDTH = 360;
const MAIL_READER_DEFAULT_WIDTH = 864;
const MAIL_READER_MIN_WIDTH = 720;
const MAIL_LAYOUT_AB_EXPAND_RATIO = 0.7;
const MAIL_LAYOUT_ABC_RESTORE_RATIO = 0.64;
const MAIL_LAYOUT_STORAGE_KEY = 'coremail.mailLayout';
const MAIL_LAYOUT_MODE_ABC = 'ABC';
const MAIL_LAYOUT_MODE_AB = 'AB';
const APP_COLLAPSED_SIDEBAR_WIDTH = 64;
const MAIL_SIDEBAR_DRAG_EXPAND_THRESHOLD = 160;
const MAIL_SIDEBAR_DRAG_COLLAPSE_THRESHOLD = 192;
const MAIL_SIDEBAR_AUTO_COLLAPSE_WIDTH = 1320;
const MAIL_LAYOUT_AB_WIDTH = 1144;
const MAIL_TABLE_COLUMN_DEFAULTS = {
  sender: 136,
  subject: 520,
  status: 120,
  time: 92,
};
const MAIL_TABLE_COLUMN_BOUNDS = {
  sender: { min: 96, max: 240 },
  subject: { min: 360, max: 840 },
  status: { min: 84, max: 180 },
  time: { min: 72, max: 144 },
};
const SHOW_CALENDAR_SEARCH_ENTRY = false;

const getViewportWidth = () => (typeof window === 'undefined' ? 1280 : window.innerWidth);

const getDefaultAppSidebarWidth = (viewportWidth = getViewportWidth()) =>
  clampNumber(Math.round(viewportWidth * 0.1852), APP_SIDEBAR_MIN_WIDTH, APP_SIDEBAR_MAX_WIDTH);

const getDefaultMailSidebarWidth = (viewportWidth = getViewportWidth()) =>
  clampNumber(viewportWidth >= 1600 ? MAIL_SIDEBAR_DEFAULT_WIDTH : Math.round(viewportWidth * 0.1852), APP_SIDEBAR_MIN_WIDTH, APP_SIDEBAR_MAX_WIDTH);

const getCalendarSidebarBounds = (viewportWidth = getViewportWidth()) => {
  const max = clampNumber(Math.round(viewportWidth * 0.28), 248, APP_SIDEBAR_MAX_WIDTH);
  return {
    min: Math.min(APP_SIDEBAR_MIN_WIDTH, max),
    max,
  };
};

const getDefaultCalendarSidebarWidth = (viewportWidth = getViewportWidth()) => {
  const bounds = getCalendarSidebarBounds(viewportWidth);
  return clampNumber(CALENDAR_SIDEBAR_DEFAULT_WIDTH, bounds.min, bounds.max);
};

const getMailListBounds = (viewportWidth = getViewportWidth(), sidebarWidth = getDefaultMailSidebarWidth(viewportWidth), layoutMode = MAIL_LAYOUT_MODE_ABC) => {
  const availableWidth = Math.max(MAIL_LIST_MIN_WIDTH, viewportWidth - sidebarWidth);
  if (layoutMode === MAIL_LAYOUT_MODE_AB) {
    return {
      min: MAIL_LIST_MIN_WIDTH,
      max: availableWidth,
    };
  }

  const maxByReader = availableWidth - MAIL_READER_MIN_WIDTH;
  return {
    min: MAIL_LIST_MIN_WIDTH,
    max: Math.max(MAIL_LIST_MIN_WIDTH, maxByReader),
  };
};

const getDefaultMailListWidth = (viewportWidth = getViewportWidth(), sidebarWidth = getDefaultMailSidebarWidth(viewportWidth), layoutMode = MAIL_LAYOUT_MODE_ABC) => {
  const bounds = getMailListBounds(viewportWidth, sidebarWidth, layoutMode);
  return clampNumber(MAIL_LIST_DEFAULT_WIDTH, bounds.min, bounds.max);
};

const getMailReaderWidth = (viewportWidth, sidebarWidth, listWidth) =>
  Math.max(0, Math.round(viewportWidth - sidebarWidth - listWidth));

const getMailContentWidth = (viewportWidth, sidebarWidth) => Math.max(MAIL_LIST_MIN_WIDTH, viewportWidth - sidebarWidth);

const resolveMailReaderDragMode = (nextListWidth, currentLayoutMode, viewportWidth, sidebarWidth) => {
  const contentWidth = getMailContentWidth(viewportWidth, sidebarWidth);
  if (currentLayoutMode === MAIL_LAYOUT_MODE_AB) {
    return nextListWidth <= contentWidth * MAIL_LAYOUT_ABC_RESTORE_RATIO ? MAIL_LAYOUT_MODE_ABC : MAIL_LAYOUT_MODE_AB;
  }
  return nextListWidth >= contentWidth * MAIL_LAYOUT_AB_EXPAND_RATIO ? MAIL_LAYOUT_MODE_AB : MAIL_LAYOUT_MODE_ABC;
};

const persistMailLayoutPreference = ({ layoutMode, sidebarWidth, listWidth, readerWidth = null, isACollapsed = false }, viewportWidth = getViewportWidth()) => {
  if (typeof window === 'undefined') return;

  const nextLayoutMode = layoutMode === MAIL_LAYOUT_MODE_AB ? MAIL_LAYOUT_MODE_AB : MAIL_LAYOUT_MODE_ABC;
  const nextSidebarWidth = Math.round(clampNumber(sidebarWidth, APP_SIDEBAR_MIN_WIDTH, APP_SIDEBAR_MAX_WIDTH));
  const nextListBounds = getMailListBounds(viewportWidth, nextSidebarWidth, nextLayoutMode);
  const nextListWidth = Math.round(clampNumber(listWidth, nextListBounds.min, nextListBounds.max));
  const nextReaderWidth = readerWidth === null ? getMailReaderWidth(viewportWidth, nextSidebarWidth, nextListWidth) : Math.max(0, Math.round(readerWidth));

  try {
    window.localStorage.setItem(
      MAIL_LAYOUT_STORAGE_KEY,
      JSON.stringify({
        layoutMode: nextLayoutMode,
        aWidth: nextSidebarWidth,
        bWidth: nextListWidth,
        cWidth: nextReaderWidth,
        isACollapsed,
        isCHidden: nextLayoutMode === MAIL_LAYOUT_MODE_AB,
        updatedAt: Date.now(),
      }),
    );
  } catch {
    // Ignore storage failures; drag state still applies for the current session.
  }
};

const loadMailLayoutPreferences = () => {
  const viewportWidth = getViewportWidth();
  const defaultSidebarWidth = getDefaultMailSidebarWidth(viewportWidth);
  const defaultListWidth = getDefaultMailListWidth(viewportWidth, defaultSidebarWidth);

  if (typeof window === 'undefined') {
    return {
      layoutMode: MAIL_LAYOUT_MODE_ABC,
      sidebarWidth: defaultSidebarWidth,
      listWidth: defaultListWidth,
    };
  }

  try {
    const raw = window.localStorage.getItem(MAIL_LAYOUT_STORAGE_KEY);
    if (!raw) {
      return {
        layoutMode: MAIL_LAYOUT_MODE_ABC,
        sidebarWidth: defaultSidebarWidth,
        listWidth: defaultListWidth,
      };
    }

    const parsed = JSON.parse(raw);
    const layoutMode = parsed.layoutMode === MAIL_LAYOUT_MODE_AB || parsed.isCHidden ? MAIL_LAYOUT_MODE_AB : MAIL_LAYOUT_MODE_ABC;
    const sidebarWidth = clampNumber(Number(parsed.aWidth) || defaultSidebarWidth, APP_SIDEBAR_MIN_WIDTH, APP_SIDEBAR_MAX_WIDTH);
    const listBounds = getMailListBounds(viewportWidth, sidebarWidth, layoutMode);
    const listWidth = clampNumber(Number(parsed.bWidth) || defaultListWidth, listBounds.min, listBounds.max);

    return {
      layoutMode,
      sidebarWidth,
      listWidth,
    };
  } catch {
    return {
      layoutMode: MAIL_LAYOUT_MODE_ABC,
      sidebarWidth: defaultSidebarWidth,
      listWidth: defaultListWidth,
    };
  }
};

const DEFAULT_CALENDAR_REMINDER_SETTINGS = {
  popupEnabled: true,
  newEventDefaultReminder: '15m',
  incomingReminderPolicy: 'follow_organizer',
};

const CALENDAR_REMINDER_SETTINGS_STORAGE_KEY = 'coremail.calendarReminderSettings';
const REMINDER_DISMISS_ALL_SKIP_CONFIRM_STORAGE_KEY = 'coremail.reminderDismissAllSkipConfirm';

const loadCalendarReminderSettings = () => {
  if (typeof window === 'undefined') return DEFAULT_CALENDAR_REMINDER_SETTINGS;

  try {
    const raw = window.localStorage.getItem(CALENDAR_REMINDER_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_CALENDAR_REMINDER_SETTINGS;

    const parsed = JSON.parse(raw);
    const incomingReminderPolicy =
      parsed.incomingReminderPolicy && parsed.incomingReminderPolicy !== 'none'
        ? parsed.incomingReminderPolicy
        : DEFAULT_CALENDAR_REMINDER_SETTINGS.incomingReminderPolicy;
    return {
      ...DEFAULT_CALENDAR_REMINDER_SETTINGS,
      ...parsed,
      newEventDefaultReminder:
        parsed.newEventDefaultReminder || parsed.defaultReminder || DEFAULT_CALENDAR_REMINDER_SETTINGS.newEventDefaultReminder,
      incomingReminderPolicy,
    };
  } catch {
    return DEFAULT_CALENDAR_REMINDER_SETTINGS;
  }
};

const INCOMING_REMINDER_OPTIONS = [
  { id: 'follow_organizer', label: '跟随组织者设置' },
  ...REMINDER_OPTIONS.filter((option) => option.id !== 'none'),
];

const loadReminderDismissAllSkipConfirm = () => {
  if (typeof window === 'undefined') return false;

  try {
    return window.localStorage.getItem(REMINDER_DISMISS_ALL_SKIP_CONFIRM_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const REMINDER_OFFSET_MINUTES = {
  '0m': 0,
  '5m': 5,
  '10m': 10,
  '15m': 15,
  '30m': 30,
  '1h': 60,
  '1d': 24 * 60,
};

const SNOOZE_OPTIONS = [
  { id: '5m', label: '5 分钟后', minutes: 5 },
  { id: '10m', label: '10 分钟后', minutes: 10 },
  { id: '15m', label: '15 分钟后', minutes: 15 },
  { id: '30m', label: '30 分钟后', minutes: 30 },
  { id: '1h', label: '1 小时后', minutes: 60 },
];

const getReminderOffsetMinutes = (reminder) => {
  if (!reminder || reminder === 'none') return null;
  return REMINDER_OFFSET_MINUTES[reminder] ?? 15;
};

const formatRelativeMinutes = (minutes) => {
  const safeMinutes = Math.max(0, Math.round(minutes));
  if (safeMinutes < 60) return `${safeMinutes} 分钟`;
  const hours = Math.floor(safeMinutes / 60);
  const rest = safeMinutes % 60;
  return rest > 0 ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`;
};

const getReminderTimeMeta = (event, nowValue = TODAY_DATE.getTime()) => {
  const startValue = getEventStartTimestamp(event);
  const endValue = getEventEndTimestamp(event);

  if (nowValue > endValue) {
    return { state: 'ended', statusLabel: '已结束', detailLabel: '', startValue, endValue };
  }

  if (nowValue >= startValue) {
    const elapsedMinutes = (nowValue - startValue) / (60 * 1000);
    return {
      state: 'ongoing',
      statusLabel: '正在进行中',
      detailLabel: `已开始 ${formatRelativeMinutes(elapsedMinutes)}`,
      startValue,
      endValue,
    };
  }

  const remainingMinutes = (startValue - nowValue) / (60 * 1000);
  return {
    state: 'upcoming',
    statusLabel: '即将开始',
    detailLabel: `${formatRelativeMinutes(remainingMinutes)}后开始`,
    startValue,
    endValue,
  };
};

const canJoinReminderEvent = (event, nowValue = TODAY_DATE.getTime()) => {
  if (!event?.meetingLink) return false;
  if (event.status === '已取消' || event.type === 'cancelled') return false;
  return nowValue <= getEventEndTimestamp(event);
};

const getAvailableSnoozeOptions = (event, nowValue = TODAY_DATE.getTime()) => {
  return SNOOZE_OPTIONS.map((option) => ({
    ...option,
    mode: 'from-now',
    until: nowValue + option.minutes * 60 * 1000,
  }));
};

const resolveSnoozeOption = (event, snoozeValue, nowValue = TODAY_DATE.getTime()) => {
  const options = getAvailableSnoozeOptions(event, nowValue);
  return options.find((option) => option.id === snoozeValue) || options[0] || null;
};

const normalizeReminderIdentity = (value) => String(value || '').trim().toLowerCase();

const buildCurrentUserIdentitySet = (accounts = []) => {
  const identities = new Set(['我']);
  accounts.forEach((account) => {
    [account.name, account.displayName, account.email].filter(Boolean).forEach((value) => identities.add(value));
  });
  return new Set(Array.from(identities).map(normalizeReminderIdentity).filter(Boolean));
};

const isIncomingReminderEvent = (event, currentUserIdentities) => {
  const organizer = normalizeReminderIdentity(event?.organizer);
  if (!organizer) return false;
  if (currentUserIdentities.has(organizer)) return false;

  const participants = [...(event.attendees || []), ...(event.optionalAttendees || [])].map(normalizeReminderIdentity);
  return participants.some((person) => currentUserIdentities.has(person));
};

const getOrganizerReminder = (event) => event?.organizerReminder ?? event?.reminder ?? 'none';

const getEffectiveEventReminder = (event, settings, currentUserIdentities) => {
  if (!event) return 'none';
  if (event.reminderOverride) return event.reminder ?? 'none';
  if (!isIncomingReminderEvent(event, currentUserIdentities)) return event.reminder ?? 'none';

  const policy = settings.incomingReminderPolicy || 'follow_organizer';
  return policy === 'follow_organizer' ? getOrganizerReminder(event) : policy;
};

const MAIL_SIDEBAR_FOLDERS = [
  ...MAIL_FOLDERS.filter((folder) => folder.id === 'inbox').map((folder) => ({ ...folder, icon: resolveIconComponent(folder.icon) })),
  { id: 'unread', label: '未读邮件', icon: Mail },
  { id: 'flagged', label: '旗标邮件', icon: Flag },
  ...MAIL_FOLDERS.filter((folder) => folder.id !== 'inbox').map((folder) => ({ ...folder, icon: resolveIconComponent(folder.icon) })),
];

const mailMatchesFolder = (mail, folderId) => {
  if (folderId === 'unread') return mail.unread;
  if (folderId === 'flagged') return mail.starred;
  return mail.folder === folderId;
};

const getMailFolderLabel = (folderId) =>
  MAIL_SIDEBAR_FOLDERS.find((folder) => folder.id === folderId)?.label ||
  MAIL_FOLDERS.find((folder) => folder.id === folderId)?.label ||
  '邮件';

const getMailSmartSignals = (mail) => {
  const text = `${mail.subject || ''} ${mail.preview || ''} ${mail.body || ''}`;
  const todo = /确认|安排|同步|反馈|处理|建议|需要|请/.test(text);
  const important = mail.starred || /紧急|风险|评审|确认|变更|预算|高潜/.test(text);

  return {
    important,
    meeting: Boolean(mail.linkedEventId),
    todo,
  };
};

const MAIL_LIST_FILTER_OPTIONS = [
  { id: 'all', label: '全部', icon: Mail },
  { id: 'unread', label: '未读', icon: Mail },
  { id: 'flagged', label: '已标记', icon: Flag },
  { id: 'attachment', label: '带附件', icon: Paperclip },
  { id: 'important', label: '高重要性', icon: AlertCircle },
];

const MAIL_SORT_OPTIONS = [
  { id: 'newest', label: '日期：从新到旧' },
  { id: 'oldest', label: '日期：从旧到新' },
];

const PRODUCT_ACTIVE_ICONS = {
  mail: 'mdi:email',
  calendar: 'mdi:calendar-today',
  contacts: 'mdi:account-group',
  settings: 'mdi:cog',
};

function ProductActiveIcon({ id, size = 20, className }) {
  const iconName = PRODUCT_ACTIVE_ICONS[id] || PRODUCT_ACTIVE_ICONS.settings;

  return <AppIcon name={iconName} size={size} className={className} />;
}

function ProductTabsBar({ activeProduct, onSelect, compact = false, vertical = false }) {
  const buttonSize = compact ? 'h-10 w-10' : 'h-11 w-11';
  const iconBoxSize = compact ? 'h-5 w-5' : 'h-6 w-6';
  const iconSize = compact ? 20 : 22;

  return (
    <div className={`${vertical ? 'grid grid-cols-1' : 'grid grid-cols-4'} ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {PRODUCT_TABS.map(({ id, label, icon }) => {
        const selected = activeProduct === id;
        return (
          <button
            key={id}
            data-product-tab={id}
            onClick={() => onSelect(id)}
            aria-label={label}
            title={label}
            className={`${buttonSize} mx-auto flex items-center justify-center rounded-xl transition-colors duration-150 ${
              selected ? 'text-slate-950' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className={`${iconBoxSize} inline-flex items-center justify-center`}>
              {selected ? (
                <ProductActiveIcon id={id} size={iconSize} />
              ) : (
                <AppIcon name={icon} size={iconSize} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SidebarProductDock({ activeProduct, onSelectProduct, compact = false }) {
  return (
    <div
      data-app-sidebar-product-dock="true"
      className={`mt-auto shrink-0 ${compact ? 'p-3' : 'p-4'}`}
    >
      <ProductTabsBar activeProduct={activeProduct} onSelect={onSelectProduct} compact={compact} vertical={compact} />
    </div>
  );
}

function LayoutResizeHandle({ id, label, value, min, max, active = false, edgePinned = false, onStart, onStep }) {
  const handleKeyDown = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    onStep(event.key === 'ArrowRight' ? 16 : -16);
  };

  return (
    <div
      data-layout-resizer={id}
      role="separator"
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      tabIndex={0}
      onMouseDown={onStart}
      onKeyDown={handleKeyDown}
      className={`group/resize relative z-30 hidden shrink-0 cursor-col-resize select-none md:block focus:outline-none ${
        edgePinned ? '-ml-4 mr-0 w-4' : '-mx-1 w-2'
      } ${
        active ? 'bg-[#0A59F7]/[0.04]' : ''
      }`}
    >
      <span
        className={`absolute inset-y-0 left-1/2 w-px -translate-x-1/2 transition ${
          active ? 'bg-[#0A59F7]' : 'bg-slate-200 group-hover/resize:bg-[#0A59F7] group-focus/resize:bg-[#0A59F7]'
        }`}
      />
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
          className="inline-flex items-center px-5 py-3 rounded-xl bg-[#0A59F7] text-white font-bold shadow-md"
        >
          返回日历模块
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>
    </div>
  );
}

function CalendarReminderSettingsContent({ settings, onChange }) {
  const selectClass =
    'h-9 w-full appearance-none rounded-lg border border-slate-200 bg-[#fbfcfd] pl-3.5 pr-9 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#0A59F7]/40 focus:bg-white';
  const rows = [
    {
      title: '日历提醒弹窗',
      description: '会议未结束时，到点会弹出提醒。',
      control: (
        <button
          type="button"
          onClick={() => onChange({ popupEnabled: !settings.popupEnabled })}
          className={`relative h-6 w-11 rounded-full transition ${
            settings.popupEnabled ? 'bg-[#0A59F7]' : 'bg-slate-300'
          }`}
          aria-pressed={settings.popupEnabled}
          aria-label="开启日历提醒弹窗"
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
              settings.popupEnabled ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      ),
    },
    {
      title: '我新建的日程默认提醒',
      description: '只影响你之后新建的日程，已有日程不会改变。',
      control: (
        <div className="relative w-full max-w-52">
          <select
            value={settings.newEventDefaultReminder}
            onChange={(event) => onChange({ newEventDefaultReminder: event.target.value })}
            className={selectClass}
            aria-label="新建日程的默认提醒时间"
          >
            {REMINDER_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      ),
    },
    {
      title: '别人邀请我的会议提醒',
      description: '默认按组织者设置提醒，也可以改成你自己的固定时间。',
      control: (
        <div className="relative w-full max-w-52">
          <select
            value={settings.incomingReminderPolicy}
            onChange={(event) => onChange({ incomingReminderPolicy: event.target.value })}
            className={selectClass}
            aria-label="收到会议邀请时的提醒时间"
          >
            {INCOMING_REMINDER_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      ),
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#f2f3f5] px-7 py-7">
      <div className="max-w-[660px]">
        <h2 className="text-lg font-black text-slate-950">日历提醒</h2>

        <section className="mt-7">
          <div className="mb-2.5">
            <h3 className="text-sm font-bold text-slate-900">提醒设置</h3>
          </div>
          <div data-reminder-settings-card="true" className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            {rows.map((row, index) => (
              <div
                key={row.title}
                className={`grid min-h-[64px] gap-3 px-4 py-3 text-sm lg:grid-cols-[minmax(0,1fr)_minmax(180px,208px)] lg:items-center ${
                  index > 0 ? 'border-t border-slate-100' : ''
                }`}
              >
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">{row.title}</div>
                  <div className="mt-1 text-xs font-medium leading-5 text-slate-500">{row.description}</div>
                </div>
                <div className="flex min-w-0 justify-start lg:justify-end">{row.control}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function CalendarReminderSettingsPage({ settings, onChange, onBack }) {
  return (
    <div className="flex-1 overflow-hidden bg-[#f1f3f5]">
      <CalendarReminderSettingsContent settings={settings} onChange={onChange} />
      <button type="button" onClick={onBack} className="sr-only">
        返回日历模块
      </button>
    </div>
  );
}

function SettingsCenterModal({ open, settings, onChange, onClose }) {
  const [activeSection, setActiveSection] = useState('calendar');
  const [activePanel, setActivePanel] = useState('calendar-reminders');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const primaryItems = [
    { id: 'account', label: '账号', icon: Users },
    { id: 'general', label: '常规', icon: Settings },
    { id: 'mail', label: '邮件', icon: Mail },
    { id: 'calendar', label: '日历', icon: Calendar },
    { id: 'tools', label: '企业工具箱', icon: Archive },
    { id: 'help', label: '帮助与反馈', icon: HelpCircle },
    { id: 'about', label: '关于', icon: AlertCircle },
  ];
  const secondaryItems = {
    account: [{ id: 'account-basic', label: '账号信息' }],
    general: [{ id: 'general-basic', label: '基础设置' }],
    mail: [
      { id: 'mail-compose', label: '收发邮件设置' },
      { id: 'mail-category', label: '来信分类' },
    ],
    calendar: [{ id: 'calendar-reminders', label: '日历提醒' }],
    tools: [{ id: 'tools-basic', label: '工具箱设置' }],
    help: [{ id: 'help-feedback', label: '帮助与反馈' }],
    about: [{ id: 'about-version', label: '关于 Coremail' }],
  };

  useEffect(() => {
    if (!open) return;
    setActiveSection('calendar');
    setActivePanel('calendar-reminders');
    setIsFullscreen(false);
  }, [open]);

  if (!open) return null;

  const panels = secondaryItems[activeSection] || [];

  return createPortal(
    <div
      className={`fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/20 ${isFullscreen ? 'p-3' : 'p-5'}`}
      role="dialog"
      aria-modal="true"
      aria-label="设置中心"
    >
      <div
        data-settings-center-window="true"
        className={`flex overflow-hidden border border-slate-200 bg-white shadow-[0_18px_56px_rgba(15,23,42,0.20)] transition-[width,height,border-radius] duration-150 ${
          isFullscreen
            ? 'h-[calc(100vh-24px)] w-[calc(100vw-24px)] rounded-xl'
            : 'h-[76vh] min-h-[520px] w-[920px] max-w-[calc(100vw-40px)] rounded-[18px]'
        }`}
      >
        <aside className="flex w-52 shrink-0 flex-col border-r border-slate-200 bg-white">
          <div className="flex h-14 items-center gap-2.5 px-5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A59F7] text-white shadow-sm">
              <Settings size={17} />
            </span>
            <span className="text-sm font-black text-slate-900">设置中心</span>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-3">
            {primaryItems.map(({ id, label, icon: Icon }) => {
              const selected = activeSection === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveSection(id);
                    setActivePanel((secondaryItems[id] || [])[0]?.id || '');
                  }}
                  className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold transition ${
                    selected ? 'bg-[#0A59F7]/[0.08] text-slate-950' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={17} className={selected ? 'text-slate-950' : 'text-slate-500'} />
                  {label}
                </button>
              );
            })}
          </nav>
        </aside>

        <aside className="w-56 shrink-0 border-r border-slate-200 bg-white px-5 py-6">
          <h1 className="mb-5 text-lg font-black text-slate-950">
            {primaryItems.find((item) => item.id === activeSection)?.label || '设置'}
          </h1>
          <div className="space-y-1.5">
            {panels.map((item) => {
              const selected = activePanel === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePanel(item.id)}
                  className={`h-10 w-full rounded-lg px-3 text-left text-sm font-bold transition ${
                    selected ? 'bg-[#0A59F7]/[0.08] text-slate-950' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="relative min-w-0 flex-1 bg-[#f1f3f5]">
          <div className="absolute right-4 top-4 z-10 flex items-center gap-1 text-slate-700">
            <button type="button" className="rounded-md p-1.5 transition hover:bg-white/70" aria-label="最小化">
              <Minus size={16} />
            </button>
            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="rounded-md p-1.5 transition hover:bg-white/70"
              aria-label={isFullscreen ? '还原窗口' : '全屏显示'}
              title={isFullscreen ? '还原窗口' : '全屏显示'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
            <button type="button" onClick={onClose} className="rounded-md p-1.5 transition hover:bg-white/70" aria-label="关闭设置中心">
              <X size={16} />
            </button>
          </div>
          {activePanel === 'calendar-reminders' ? (
            <CalendarReminderSettingsContent settings={settings} onChange={onChange} />
          ) : (
            <div className="flex h-full items-center justify-center px-8 text-sm font-semibold text-slate-400">
              当前设置项暂未开放
            </div>
          )}
        </main>
      </div>
    </div>,
    document.body,
  );
}

function AccountColorMenuItem({ colors, currentColor, onSelect }) {
  return (
    <div className="group/color relative">
      <button
        type="button"
        className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
      >
        <Palette size={14} className="mr-2 text-gray-400" />
        <span className="min-w-0 flex-1">颜色</span>
        <ChevronRight size={14} className="ml-2 text-gray-400" />
      </button>
      <div className="absolute left-[calc(100%-4px)] top-0 z-[70] hidden w-64 rounded-[18px] border border-slate-200 bg-white p-3 shadow-lg group-hover/color:grid group-hover/color:grid-cols-6 group-hover/color:gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${color} transition hover:scale-105 ${
              currentColor === color ? 'ring-2 ring-slate-900 ring-offset-2' : 'ring-1 ring-black/5'
            }`}
            aria-label={`选择颜色 ${color}`}
          >
            {currentColor === color && <Check size={16} className="text-white drop-shadow" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function UtilitySidebar({ activeProduct, onSelectProduct }) {
  return (
    <aside
      data-app-sidebar={activeProduct}
      className="relative z-10 hidden shrink-0 flex-col border-r border-slate-200 bg-[#f1f3f5] md:flex"
      style={{ width: APP_SIDEBAR_WIDTH }}
    >
      <div className="border-b border-slate-200 bg-[#f1f3f5] p-6">
        <div className="text-lg font-black text-gray-900">{MODULE_COPY[activeProduct]?.title || '模块'}</div>
      </div>
      <div className="flex-1 bg-[#f1f3f5] p-5"></div>
      <SidebarProductDock activeProduct={activeProduct} onSelectProduct={onSelectProduct} />
    </aside>
  );
}

function MailSidebar({
  accounts,
  mails,
  mailFolder,
  selectedMailAccountId,
  collapsed,
  width = APP_SIDEBAR_WIDTH,
  onToggleCollapsed,
  onSelectFolder,
  onCompose,
  activeProduct,
  onSelectProduct,
}) {
  const mailAccountIds = new Set(mails.map((mail) => mail.accountId));
  const mailboxes = accounts.filter((account) => mailAccountIds.has(account.id));
  const getFolderCount = (accountId, folderId) => mails.filter((mail) => mail.accountId === accountId && mailMatchesFolder(mail, folderId)).length;
  const getAggregateFolderCount = (folderId) => mails.filter((mail) => mailMatchesFolder(mail, folderId)).length;
  const favoriteRows = [
    ...mailboxes.map((account) => ({
      id: `inbox-${account.id}`,
      label: `收件箱 · ${account.email}`,
      icon: resolveIconComponent(MAIL_FOLDERS.find((folder) => folder.id === 'inbox')?.icon) || Mail,
      count: getFolderCount(account.id, 'inbox'),
      onClick: () => onSelectFolder('inbox', account.id),
    })),
    {
      id: 'sent',
      label: '已发送',
      icon: Send,
      count: getAggregateFolderCount('sent'),
      onClick: () => onSelectFolder('sent', selectedMailAccountId),
    },
    {
      id: 'drafts',
      label: '草稿',
      icon: FileText,
      count: getAggregateFolderCount('drafts'),
      onClick: () => onSelectFolder('drafts', selectedMailAccountId),
    },
    {
      id: 'deleted',
      label: '已删除',
      icon: Trash,
      count: getAggregateFolderCount('deleted'),
      onClick: () => onSelectFolder('deleted', selectedMailAccountId),
    },
  ];

  if (collapsed) {
    return (
      <aside
        data-app-sidebar="mail"
        className="relative z-10 hidden shrink-0 select-none border-r border-slate-200 bg-[#f1f3f5] md:flex md:flex-col"
        style={{ width: APP_COLLAPSED_SIDEBAR_WIDTH, zIndex: 20 }}
      >
        <div className="flex flex-col items-center border-b border-slate-200 px-3 py-4">
          <button
            onClick={onToggleCollapsed}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/80 bg-white/85 text-gray-600 transition hover:bg-white"
            title="展开侧边栏"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="border-b border-slate-200 px-3 py-4">
          <button
            data-mail-sidebar-compose="true"
            onClick={() => onCompose('new')}
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
            title="写邮件"
          >
            <SquarePen size={17} />
          </button>
        </div>
        <div className="flex-1 min-h-0"></div>
        <SidebarProductDock activeProduct={activeProduct} onSelectProduct={onSelectProduct} compact />
      </aside>
    );
  }

  return (
    <aside
      data-app-sidebar="mail"
      className="relative z-10 hidden shrink-0 select-none border-r border-slate-200 bg-[#f1f3f5] md:flex md:flex-col"
      style={{ width, zIndex: 20 }}
    >
      <div className="px-6 pb-4 pt-6">
        <div data-mail-sidebar-brand="true" className="flex items-center justify-between gap-3">
          <div className="text-lg font-black text-gray-900">Coremail</div>
          <button
            onClick={onToggleCollapsed}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-white/85 text-gray-600 transition hover:bg-white"
            title="收起侧边栏"
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        <button
          data-mail-sidebar-compose="true"
          onClick={() => onCompose('new')}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-4 text-base font-black text-[#0A59F7] transition-colors hover:bg-slate-200"
        >
          <SquarePen size={18} className="mr-2" />
          写邮件
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-3">
        <section data-mail-favorites="true" className="mb-6">
          <button type="button" className="mb-2 flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-slate-500">
            收藏夹
            <ChevronDown size={16} />
          </button>
          <div className="space-y-0.5">
            {favoriteRows.map(({ id, label, icon: Icon, count, onClick }) => (
              <button
                key={id}
                type="button"
                data-mail-favorite={id}
                onClick={onClick}
                className="flex h-9 w-full items-center justify-between rounded-lg px-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200/70 hover:text-slate-950"
              >
                <span className="flex min-w-0 items-center">
                  <Icon size={17} className="mr-3 shrink-0 text-slate-500" />
                  <span className="truncate">{label}</span>
                </span>
                {count > 0 && <span className="ml-3 shrink-0 text-xs font-semibold text-slate-500">{count}</span>}
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-5">
          {mailboxes.map((account) => (
            <section
              key={account.id}
              data-mailbox-id={account.id}
              className="px-1 py-0.5"
            >
              <button
                type="button"
                data-mailbox-account={account.id}
                onClick={() => onSelectFolder('inbox', account.id)}
                className="flex h-9 w-full items-center justify-between rounded-lg px-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200/70 hover:text-slate-900"
              >
                <span className="truncate">{account.email}</span>
                <ChevronDown size={16} className="ml-2 shrink-0 text-slate-500" />
              </button>

              <div className="mt-1 space-y-0.5">
                {MAIL_SIDEBAR_FOLDERS.map(({ id, label, icon: Icon }) => {
                  const selected = selectedMailAccountId === account.id && mailFolder === id;
                  const count = getFolderCount(account.id, id);
                  return (
                    <button
                      key={id}
                      data-mailbox-folder={id}
                      type="button"
                      onClick={() => onSelectFolder(id, account.id)}
                      className={`flex h-9 w-full items-center justify-between rounded-lg px-2 text-sm font-semibold transition ${
                        selected ? 'bg-slate-200/80 text-slate-950' : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-950'
                      }`}
                    >
                      <span className="flex min-w-0 items-center">
                        <Icon size={17} className={`mr-3 shrink-0 ${selected ? 'text-slate-950' : 'text-slate-500'}`} />
                        <span className="truncate">{label}</span>
                      </span>
                      {count > 0 && <span className="ml-3 shrink-0 text-xs font-semibold text-slate-500">{count}</span>}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
          {mailboxes.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm font-semibold text-slate-400">
              当前账号暂无邮箱
            </div>
          )}
        </div>
      </div>

      <SidebarProductDock activeProduct={activeProduct} onSelectProduct={onSelectProduct} />
    </aside>
  );
}

const getMailAiInsight = (mail, linkedEvent = null) => {
  if (!mail) {
    return {
      categoryLabel: '普通邮件',
      categoryTone: 'bg-slate-100 text-slate-600',
      summary: '选择邮件后，AI 会基于正文、附件和关联日程生成摘要。',
      todos: [],
      replies: [],
    };
  }

  const source = `${mail.subject} ${mail.preview} ${mail.body}`;
  const hasAction = /确认|请|需要|建议|回复|安排|补齐|同步|打印|装订/.test(source);
  const isMeeting = Boolean(mail.linkedEventId || linkedEvent || /会议|日程|评审|拜访|午餐会|会面/.test(source));
  const isImportant = Boolean(mail.starred || /张总|董事会|风险|明早|CFO|预算/.test(source));
  const hasAttachment = mail.attachments.length > 0;

  if (mail.id === 'm1') {
    return {
      categoryLabel: '重要待办',
      categoryTone: 'bg-indigo-50 text-indigo-700',
      summary: '评审材料已补齐预算和风险页，发件人建议明天下午一起过一遍，并会在确认后同步给张总和研发负责人。',
      todos: ['确认明天下午是否可以一起评审材料', '查看附件 Q2_路线评审_v4.pptx', '确认后同步给张总和研发负责人'],
      replies: ['确认明天下午一起过一遍', '我先看附件后反馈', '请先同步给相关负责人'],
    };
  }

  if (mail.id === 'm2') {
    return {
      categoryLabel: '会议相关',
      categoryTone: 'bg-[#0A59F7]/[0.08] text-[#0A59F7]',
      summary: '客户拜访时间调整到下周三上午，需要确认是否顺带安排午餐会，并判断是否提前锁定会议。',
      todos: ['确认下周三上午拜访行程', '判断是否安排午餐会', '必要时提前锁定会议时间'],
      replies: ['我来确认客户拜访行程', '可以顺带安排午餐会', '需要先确认客户时间'],
    };
  }

  if (mail.id === 'm6') {
    return {
      categoryLabel: '高优先级',
      categoryTone: 'bg-rose-50 text-rose-700',
      summary: '董事会材料需在明早 8:30 前送达，需要确认打印份数并在今晚完成装订。',
      todos: ['确认董事会材料打印份数', '今晚完成材料装订', '明早 8:30 前送达'],
      replies: ['我会今晚完成装订', '请确认最终打印份数', '已收到，我会按时处理'],
    };
  }

  return {
    categoryLabel: isImportant ? '重要邮件' : isMeeting ? '会议相关' : hasAction ? '待处理' : '信息同步',
    categoryTone: isImportant
      ? 'bg-rose-50 text-rose-700'
      : isMeeting
        ? 'bg-[#0A59F7]/[0.08] text-[#0A59F7]'
        : hasAction
          ? 'bg-amber-50 text-amber-700'
          : 'bg-slate-100 text-slate-600',
    summary: hasAction
      ? `${mail.fromName} 提到：${mail.preview}`
      : `${mail.fromName} 同步了这封邮件的主要信息：${mail.preview}`,
    todos: [
      ...(hasAction ? ['查看邮件内容并决定是否需要回复'] : []),
      ...(hasAttachment ? [`查看附件 ${mail.attachments[0].name}`] : []),
      ...(isMeeting ? ['确认是否需要生成或查看关联日程'] : []),
    ],
    replies: hasAction ? ['收到，我会处理', '我确认后回复你', '需要再补充一些信息'] : ['收到，谢谢同步', '我先看一下', '后续有问题再反馈'],
  };
};

const getMailTimelineKey = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const getMailTimelineLabel = (timestamp) => {
  const date = new Date(timestamp);
  if (sameDay(date, TODAY_DATE)) return '今天';
  if (sameDay(date, addDays(TODAY_DATE, -1))) return '昨天';
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日 ${weekdays[date.getDay()]}`;
};

const formatMailListTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

function MailWorkspace({
  accounts,
  mails,
  mailFolder,
  mailListFilter,
  mailSortOrder,
  selectedMail,
  onSelectMail,
  onToggleStar,
  onToggleRead,
  onArchiveMail,
  onDeleteMail,
  onMoveMail,
  onCompose,
  onEditDraft,
  onScheduleFromMail,
  onMarkReadAfterViewing,
  onCreateTaskFromMail,
  onPreviewAttachment,
  onDownloadAttachment,
  onQuickReplySend,
  onReaderRetry,
  onReaderSecurityAction,
  onOpenLinkedEvent,
  onSetMailListFilter,
  onSetMailSortOrder,
  onExportMailBatch,
  linkedEventLookup,
  mailListWidth,
  mailListBounds,
  mailLayoutMode,
  activeLayoutResize,
  onStartLayoutResize,
  onStepLayoutResize,
  onRestoreMailReader,
}) {
  const [mailSearchQuery, setMailSearchQuery] = useState('');
  const [readerMoreOpen, setReaderMoreOpen] = useState(false);
  const [mailContextMenu, setMailContextMenu] = useState(null);
  const [mailFilterMenuOpen, setMailFilterMenuOpen] = useState(false);
  const [mailSelectionMode, setMailSelectionMode] = useState(false);
  const [selectedMailIds, setSelectedMailIds] = useState([]);
  const [mailListDetailId, setMailListDetailId] = useState(null);
  const [mailTableColumns, setMailTableColumns] = useState(MAIL_TABLE_COLUMN_DEFAULTS);
  const readerMoreRef = useRef(null);
  const mailFilterRef = useRef(null);
  const mailTableColumnResizeRef = useRef(null);
  const folderLabel = getMailFolderLabel(mailFolder);
  const unreadCount = mails.filter((mail) => mail.unread).length;
  const normalizedMailSearchQuery = mailSearchQuery.trim().toLowerCase();
  const visibleMails = normalizedMailSearchQuery
    ? mails.filter((mail) =>
        [mail.subject, mail.preview, mail.body, mail.quotedHistory, mail.fromName, mail.fromEmail, ...(mail.attachments || []).map((attachment) => attachment.name)]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedMailSearchQuery)),
      )
    : mails;
  const effectiveSelectedMail = selectedMail && visibleMails.some((mail) => mail.id === selectedMail.id) ? selectedMail : visibleMails[0] || null;
  const isMailSearchActive = Boolean(normalizedMailSearchQuery);
  const mailListSummary = isMailSearchActive ? `搜索到 ${visibleMails.length} 封邮件` : `${mails.length} 封邮件，${unreadCount} 封未读`;
  const activeMailFilter = MAIL_LIST_FILTER_OPTIONS.find((option) => option.id === mailListFilter) || MAIL_LIST_FILTER_OPTIONS[0];
  const mailTableGridTemplate = `10px ${mailTableColumns.sender}px minmax(${mailTableColumns.subject}px,1fr) ${mailTableColumns.status}px ${mailTableColumns.time}px`;
  const mailTimelineRows = useMemo(() => {
    const rows = [];
    let previousTimelineKey = '';
    visibleMails.forEach((mail) => {
      const timelineKey = getMailTimelineKey(mail.timestamp);
      if (timelineKey !== previousTimelineKey) {
        rows.push({
          type: 'timeline',
          key: `timeline-${timelineKey}`,
          label: getMailTimelineLabel(mail.timestamp),
        });
        previousTimelineKey = timelineKey;
      }
      rows.push({ type: 'mail', key: mail.id, mail });
    });
    return rows;
  }, [visibleMails]);

  useEffect(() => {
    setReaderMoreOpen(false);
    setMailContextMenu(null);
    setMailFilterMenuOpen(false);
  }, [effectiveSelectedMail?.id]);

  useEffect(() => {
    if (!readerMoreOpen) return undefined;

    const handlePointerDown = (event) => {
      if (readerMoreRef.current && !readerMoreRef.current.contains(event.target)) {
        setReaderMoreOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setReaderMoreOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [readerMoreOpen]);

  useEffect(() => {
    if (!mailFilterMenuOpen) return undefined;

    const handlePointerDown = (event) => {
      if (mailFilterRef.current && !mailFilterRef.current.contains(event.target)) {
        setMailFilterMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMailFilterMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mailFilterMenuOpen]);

  useEffect(() => {
    setSelectedMailIds((prev) => {
      const next = prev.filter((id) => visibleMails.some((mail) => mail.id === id));
      return next.length === prev.length && next.every((id, index) => id === prev[index]) ? prev : next;
    });
  }, [visibleMails]);

  useEffect(() => {
    if (!mailContextMenu) return undefined;

    const closeMailContextMenu = () => setMailContextMenu(null);
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeMailContextMenu();
    };

    window.addEventListener('mousedown', closeMailContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', closeMailContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mailContextMenu]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const active = mailTableColumnResizeRef.current;
      if (!active) return;
      event.preventDefault();
      const bounds = MAIL_TABLE_COLUMN_BOUNDS[active.column];
      const nextWidth = clampNumber(active.startWidth + event.clientX - active.startX, bounds.min, bounds.max);
      setMailTableColumns((prev) => ({ ...prev, [active.column]: nextWidth }));
    };

    const handleMouseUp = () => {
      if (!mailTableColumnResizeRef.current) return;
      mailTableColumnResizeRef.current = null;
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (mailTableColumnResizeRef.current) handleMouseUp();
    };
  }, []);

  const startMailTableColumnResize = (column, event) => {
    event.preventDefault();
    event.stopPropagation();
    mailTableColumnResizeRef.current = {
      column,
      startX: event.clientX,
      startWidth: mailTableColumns[column],
    };
    document.documentElement.style.cursor = 'col-resize';
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const renderMailTableColumnResizer = (column, label) => (
    <span
      role="separator"
      aria-label={label}
      aria-orientation="vertical"
      aria-valuemin={MAIL_TABLE_COLUMN_BOUNDS[column].min}
      aria-valuemax={MAIL_TABLE_COLUMN_BOUNDS[column].max}
      aria-valuenow={Math.round(mailTableColumns[column])}
      tabIndex={0}
      data-mail-column-resizer={column}
      onMouseDown={(event) => startMailTableColumnResize(column, event)}
      onKeyDown={(event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        const delta = event.key === 'ArrowRight' ? 16 : -16;
        setMailTableColumns((prev) => {
          const bounds = MAIL_TABLE_COLUMN_BOUNDS[column];
          return { ...prev, [column]: clampNumber(prev[column] + delta, bounds.min, bounds.max) };
        });
      }}
      className="absolute inset-y-0 right-[-10px] z-20 hidden w-5 cursor-col-resize select-none outline-none md:block"
    >
      <span className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-transparent transition group-hover:bg-slate-300 group-focus:bg-[#0A59F7]" />
    </span>
  );

  const openMailContextMenu = (event, mail) => {
    event.preventDefault();
    event.stopPropagation();
    setMailContextMenu({
      mailId: mail.id,
      x: Math.min(event.clientX, window.innerWidth - 188),
      y: Math.min(event.clientY, window.innerHeight - 176),
    });
  };

  const runMailContextAction = (handler) => {
    handler();
    setMailContextMenu(null);
  };

  const enterMailSelectionMode = () => {
    const fallbackMailId = effectiveSelectedMail?.id || visibleMails[0]?.id;
    setMailSelectionMode(true);
    setSelectedMailIds((prev) => (prev.length > 0 ? prev : fallbackMailId ? [fallbackMailId] : []));
  };

  const exitMailSelectionMode = () => {
    setMailSelectionMode(false);
    setSelectedMailIds([]);
  };

  const toggleSelectedMail = (mailId) => {
    setSelectedMailIds((prev) => (prev.includes(mailId) ? prev.filter((id) => id !== mailId) : [...prev, mailId]));
  };

  const applyMailListFilter = (filterId) => {
    onSetMailListFilter(filterId);
    setMailFilterMenuOpen(false);
  };

  const applyMailSortOrder = (sortId) => {
    onSetMailSortOrder(sortId);
    setMailFilterMenuOpen(false);
  };

  const selectNextVisibleMail = (mailId) => {
    const currentIndex = visibleMails.findIndex((mail) => mail.id === mailId);
    const nextMail = visibleMails[currentIndex + 1] || visibleMails[currentIndex - 1] || visibleMails.find((mail) => mail.id !== mailId);
    if (nextMail) onSelectMail(nextMail.id);
  };

  const selectMailFromList = (mail) => {
    onSelectMail(mail.id);
    if (mail.unread) onMarkReadAfterViewing(mail.id);
  };

  const openMailListDetail = (mail) => {
    selectMailFromList(mail);
    setMailListDetailId(mail.id);
    setMailContextMenu(null);
  };

  const closeMailListDetail = () => {
    setMailListDetailId(null);
  };

  const renderMailStatusIcons = (mail, { showUnread = false, showLinkedEvent = false } = {}) => {
    const statusIconClass = 'inline-flex h-6 min-w-6 items-center justify-center rounded-md';
    return (
      <>
        {showUnread && mail.unread && (
          <span role="img" aria-label="未读邮件" title="未读邮件" className={`${statusIconClass} text-[#0A59F7]`}>
            <Mail size={14} />
          </span>
        )}
        {mail.starred && (
          <span role="img" aria-label="旗标邮件" title="旗标邮件" data-mail-flag-icon-mode="filled" className={`${statusIconClass} text-red-500`}>
            <FlagFilled size={14} />
          </span>
        )}
        {mail.attachments.length > 0 && (
          <span role="img" aria-label={`含 ${mail.attachments.length} 个附件`} title={`含 ${mail.attachments.length} 个附件`} className={`${statusIconClass} gap-0.5 text-slate-500`}>
            <Paperclip size={14} />
            <span className="text-[11px] font-black leading-none">{mail.attachments.length}</span>
          </span>
        )}
        {showLinkedEvent && mail.linkedEventId && (
          <span role="img" aria-label="关联日程" title="关联日程" className={`${statusIconClass} text-slate-500`}>
            <Calendar size={14} />
          </span>
        )}
      </>
    );
  };

  const renderMailQuickActions = (mail) => {
    const readActionLabel = mail.unread ? '标为已读' : '标为未读';
    const ReadActionIcon = mail.unread ? MailOpen : Mail;
    return (
      <>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleRead(mail.id);
          }}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-900 transition hover:bg-slate-100"
          aria-label={readActionLabel}
          title={readActionLabel}
        >
          <ReadActionIcon size={14} />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleStar(mail.id);
          }}
          className={`inline-flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-slate-100 ${mail.starred ? 'text-red-500' : 'text-slate-900'}`}
          aria-label={mail.starred ? '取消旗标' : '标记旗标'}
          title={mail.starred ? '取消旗标' : '标记旗标'}
          data-mail-flag-icon-mode={mail.starred ? 'filled' : 'outline'}
        >
          {mail.starred ? <FlagFilled size={14} /> : <Flag size={14} />}
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteMail(mail.id);
          }}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-900 transition hover:bg-slate-100"
          aria-label="删除邮件"
          title="删除"
        >
          <Trash size={14} />
        </button>
      </>
    );
  };

  const renderMailSelectedActions = (mail) => {
    if (!mail) return null;
    const readActionLabel = mail.unread ? '标为已读' : '标为未读';
    const ReadActionIcon = mail.unread ? MailOpen : Mail;
    const selectedActionClass = 'inline-flex h-9 shrink-0 items-center rounded-lg px-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-100 hover:text-slate-950';
    return (
      <div data-mail-selected-actions="true" className="flex shrink-0 items-center gap-1 rounded-lg bg-white/80 p-0.5">
        <button type="button" onClick={() => onToggleRead(mail.id)} className={selectedActionClass} aria-label={readActionLabel} title={readActionLabel}>
          <ReadActionIcon size={16} className="mr-1.5" />
          {readActionLabel}
        </button>
        <button
          type="button"
          onClick={() => onToggleStar(mail.id)}
          className={`${selectedActionClass} ${mail.starred ? 'text-red-600 hover:text-red-700' : ''}`}
          aria-label={mail.starred ? '取消旗标' : '标记旗标'}
          title={mail.starred ? '取消旗标' : '标记旗标'}
        >
          {mail.starred ? <FlagFilled size={16} className="mr-1.5" /> : <Flag size={16} className="mr-1.5" />}
          {mail.starred ? '取消旗标' : '标记旗标'}
        </button>
        <button type="button" onClick={() => onArchiveMail(mail.id)} className={selectedActionClass} aria-label="归档邮件" title="归档邮件">
          <Archive size={16} className="mr-1.5" />
          归档
        </button>
        <button type="button" onClick={() => onDeleteMail(mail.id)} className={`${selectedActionClass} text-red-600 hover:text-red-700`} aria-label="删除邮件" title="删除邮件">
          <Trash size={16} className="mr-1.5" />
          删除
        </button>
      </div>
    );
  };

  const renderMailSelectedActionBar = (mail) => {
    if (!mail) return null;
    return (
      <div data-mail-selected-action-bar="true" className="flex min-h-11 items-center justify-between gap-3 rounded-lg bg-[#0A59F7]/[0.04] px-3 py-2 ring-1 ring-[#0A59F7]/10">
        <div className="flex min-w-0 items-center gap-2 text-sm font-black text-slate-700">
          <span className="inline-flex h-6 shrink-0 items-center rounded-md bg-white px-2 text-[#0A59F7] ring-1 ring-[#0A59F7]/15">已选中 1 封</span>
          <span className="min-w-0 truncate text-slate-950">{mail.subject}</span>
          <span className="hidden shrink-0 text-xs font-semibold text-slate-500 md:inline">当前邮件操作</span>
        </div>
        {renderMailSelectedActions(mail)}
      </div>
    );
  };

  const renderMailReaderPane = (mail, { onBackToList } = {}) => {
    const linkedEvent = mail?.linkedEventId ? linkedEventLookup[mail.linkedEventId] || null : null;
    return (
      <MailReadingPane
        mail={mail}
        state={mail ? MAIL_READING_STATE_BY_MAIL_ID[mail.id] : undefined}
        folderLabel={mail ? MAIL_FOLDERS.find((item) => item.id === mail.folder)?.label : ''}
        linkedEvent={
          linkedEvent
            ? {
                id: linkedEvent.id,
                status: linkedEvent.status,
                summary: `${linkedEvent.status || '已接受'} · ${formatEventDateTime(linkedEvent)}`,
              }
            : null
        }
        aiInsight={getMailAiInsight(mail, linkedEvent)}
        formatMailTime={formatMailTime}
        onReply={() => mail && onCompose('reply', mail.id)}
        onReplyAll={() => mail && onCompose('replyAll', mail.id)}
        onForward={() => mail && onCompose('forward', mail.id)}
        onArchive={() => mail && onArchiveMail(mail.id)}
        onDelete={() => mail && onDeleteMail(mail.id)}
        onMove={() => mail && (onMoveMail || onArchiveMail)(mail.id)}
        onToggleRead={() => mail && onToggleRead(mail.id)}
        onToggleFollowUp={() => mail && onToggleStar(mail.id)}
        onCreateTask={() => mail && onCreateTaskFromMail(mail.id)}
        onCreateEvent={() => mail && onScheduleFromMail(mail.id)}
        onRetry={() => mail && onReaderRetry(mail.id)}
        onBackToList={onBackToList || (() => mail && onSelectMail(mail.id))}
        onViewNext={() => mail && selectNextVisibleMail(mail.id)}
        onMarkReadAfterViewing={() => mail && onMarkReadAfterViewing(mail.id)}
        onPreviewAttachment={(attachment) => mail && onPreviewAttachment(mail.id, attachment)}
        onDownloadAttachment={(attachment) => mail && onDownloadAttachment(mail.id, attachment)}
        onQuickReplySend={(body) => mail && onQuickReplySend(mail.id, body)}
        onSecurityAction={(action) => mail && onReaderSecurityAction(mail.id, action)}
        onOpenLinkedEvent={() => mail?.linkedEventId && onOpenLinkedEvent(mail.linkedEventId)}
      />
    );
  };

  const renderReaderToolbar = () => {
    if (!selectedMail) return null;

    const toolbarButtonClass = 'inline-flex h-9 shrink-0 items-center rounded-lg px-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950';
    const toolbarPrimaryButtonClass = 'inline-flex h-9 shrink-0 items-center rounded-lg bg-[#0A59F7] px-3 text-sm font-bold text-white transition hover:bg-[#084DDB]';
    const toolbarAccentButtonClass = 'inline-flex h-9 shrink-0 items-center rounded-lg px-2.5 text-sm font-bold text-[#0A59F7] transition hover:bg-[#0A59F7]/[0.08]';
    const windowButtonClass = 'inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950';
    const menuItemClass = 'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950';
    const readerActions = [
      ...(selectedMail.folder === 'drafts'
        ? [
            {
              id: 'edit',
              label: '继续编辑',
              icon: SquarePen,
              variant: 'primary',
              onClick: () => onEditDraft(selectedMail.id),
            },
          ]
        : [
            {
              id: 'reply',
              label: '回复',
              icon: Reply,
              onClick: () => onCompose('reply', selectedMail.id),
            },
            {
              id: 'replyAll',
              label: '回复全部',
              icon: ReplyAll,
              onClick: () => onCompose('replyAll', selectedMail.id),
            },
            {
              id: 'forward',
              label: '转发',
              icon: Forward,
              onClick: () => onCompose('forward', selectedMail.id),
            },
          ]),
      {
        id: 'read',
        label: selectedMail.unread ? '标为已读' : '标为未读',
        icon: Mail,
        onClick: () => onToggleRead(selectedMail.id),
      },
      {
        id: 'star',
        label: selectedMail.starred ? '取消旗标' : '标记旗标',
        icon: selectedMail.starred ? FlagFilled : Flag,
        onClick: () => onToggleStar(selectedMail.id),
      },
      {
        id: 'delete',
        label: '删除',
        icon: Trash,
        onClick: () => onDeleteMail(selectedMail.id),
      },
      {
        id: 'move',
        label: '移动',
        icon: Archive,
        onClick: () => onArchiveMail(selectedMail.id),
      },
      {
        id: 'schedule',
        label: '生成日程',
        icon: Calendar,
        variant: 'accent',
        onClick: () => onScheduleFromMail(selectedMail.id),
      },
    ];
    const getVisibleActionClass = (action) => {
      if (action.variant === 'primary') return toolbarPrimaryButtonClass;
      if (action.variant === 'accent') return toolbarAccentButtonClass;
      return toolbarButtonClass;
    };
    const renderActionIcon = (action, size = 16, className = 'mr-1.5') => {
      const Icon = action.icon;
      return <Icon size={size} className={`${className} ${action.id === 'star' && selectedMail.starred ? 'text-red-500' : ''}`.trim()} />;
    };

    return (
      <div data-mail-reader-toolbar="true" className="relative flex shrink-0 flex-nowrap items-center border-b border-slate-200 bg-white px-6 py-4">
        <div data-mail-reader-toolbar-actions="true" className="flex min-w-0 flex-1 flex-nowrap items-center gap-1 overflow-hidden whitespace-nowrap pr-2">
          {readerActions.map((action) => (
            <button key={action.id} onClick={action.onClick} className={getVisibleActionClass(action)}>
              {renderActionIcon(action)}
              {action.label}
            </button>
          ))}
        </div>
        <div ref={readerMoreRef} className="relative mr-2 shrink-0">
          <button
            type="button"
            aria-label="更多邮件操作"
            title="更多邮件操作"
            aria-haspopup="menu"
            aria-expanded={readerMoreOpen}
            onClick={() => setReaderMoreOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <MoreHorizontal size={18} />
          </button>
          {readerMoreOpen && (
            <div
              data-mail-reader-more-menu="true"
              role="menu"
              className="absolute right-0 top-[calc(100%+8px)] z-40 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-[0_12px_32px_rgba(15,23,42,0.14)]"
            >
              {readerActions.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setReaderMoreOpen(false);
                    action.onClick();
                  }}
                  className={action.variant === 'accent' ? `${menuItemClass} text-[#0A59F7] hover:bg-[#0A59F7]/[0.08] hover:text-[#084DDB]` : menuItemClass}
                >
                  {renderActionIcon(action, 16, 'shrink-0 text-slate-500')}
                  <span className="min-w-0 flex-1 truncate">{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div data-mail-reader-window-controls="true" className="ml-auto flex shrink-0 items-center gap-1">
          <button type="button" aria-label="客服帮助" title="客服帮助" className={windowButtonClass}>
            <HelpCircle size={17} />
          </button>
          <div className="mx-1 h-6 w-px bg-slate-200" />
          <button type="button" aria-label="最小化窗口" title="最小化" className={windowButtonClass}>
            <Minus size={17} />
          </button>
          <button type="button" aria-label="全屏窗口" title="全屏" className={windowButtonClass}>
            <Maximize2 size={16} />
          </button>
          <button type="button" aria-label="关闭窗口" title="关闭" className={windowButtonClass}>
            <X size={17} />
          </button>
        </div>
      </div>
    );
  };

  const contextMail = mailContextMenu ? visibleMails.find((mail) => mail.id === mailContextMenu.mailId) : null;
  const selectedBatchMails = mailSelectionMode
    ? selectedMailIds
        .map((id) => visibleMails.find((mail) => mail.id === id))
        .filter(Boolean)
    : [];
  const selectedBatchCount = selectedBatchMails.length;
  const runMailBatchAction = (handler, { closeAfter = false } = {}) => {
    if (selectedBatchCount === 0) return;
    handler();
    if (closeAfter) exitMailSelectionMode();
  };
  const renderMailBatchActions = ({ density = 'default' } = {}) => {
    const compact = density === 'compact';
    const batchActionClass = `inline-flex h-9 shrink-0 items-center rounded-lg px-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-45 ${
      compact ? 'gap-1.5' : ''
    }`;
    const batchActions = [
      {
        id: 'mark-read',
        label: '标为已读',
        aria: '批量标为已读',
        icon: MailOpen,
        onClick: () => runMailBatchAction(() => selectedBatchMails.filter((mail) => mail.unread).forEach((mail) => onToggleRead(mail.id))),
      },
      {
        id: 'mark-unread',
        label: '标为未读',
        aria: '批量标为未读',
        icon: Mail,
        onClick: () => runMailBatchAction(() => selectedBatchMails.filter((mail) => !mail.unread).forEach((mail) => onToggleRead(mail.id))),
      },
      {
        id: 'flag',
        label: '标记旗标',
        aria: '批量标记旗标',
        icon: Flag,
        onClick: () => runMailBatchAction(() => selectedBatchMails.filter((mail) => !mail.starred).forEach((mail) => onToggleStar(mail.id))),
      },
      {
        id: 'archive',
        label: '归档',
        aria: '批量归档',
        icon: Archive,
        onClick: () => runMailBatchAction(() => selectedBatchMails.forEach((mail) => onArchiveMail(mail.id)), { closeAfter: true }),
      },
      {
        id: 'export',
        label: '导出',
        aria: '批量导出',
        icon: Save,
        onClick: () => runMailBatchAction(() => onExportMailBatch?.(selectedBatchMails.map((mail) => mail.id))),
      },
      {
        id: 'delete',
        label: '删除',
        aria: '批量删除',
        icon: Trash,
        danger: true,
        onClick: () => runMailBatchAction(() => selectedBatchMails.forEach((mail) => onDeleteMail(mail.id)), { closeAfter: true }),
      },
    ];

    return (
      <div data-mail-batch-actions="true" className={`flex min-w-0 shrink-0 items-center gap-1 ${compact ? 'overflow-x-auto' : 'overflow-hidden'}`}>
        {batchActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              aria-label={action.aria}
              title={action.label}
              disabled={selectedBatchCount === 0}
              onClick={action.onClick}
              className={`${batchActionClass} ${
                action.danger ? 'text-red-600 hover:bg-red-50 hover:text-red-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    );
  };
  const isMailReaderHidden = mailLayoutMode === MAIL_LAYOUT_MODE_AB;
  const mailListMode = isMailReaderHidden ? 'table' : 'compact';
  const mailListDetailMail = isMailReaderHidden && mailListDetailId ? visibleMails.find((mail) => mail.id === mailListDetailId) || null : null;

  return (
      <div data-mail-workspace="true" data-mail-layout-mode={mailLayoutMode} className="flex min-w-0 flex-1 overflow-hidden bg-[#f6f7f9]">
        <div
          data-mail-list-pane="true"
          data-mail-list-mode={mailListMode}
          className={`flex min-w-0 flex-col border-r border-slate-200 bg-white ${isMailReaderHidden ? 'flex-1' : 'shrink-0'}`}
          style={isMailReaderHidden ? undefined : { width: mailListWidth }}
        >
        <div className="bg-white px-6 pb-4 pt-6">
          <div data-mail-list-toolbar="true" className="space-y-4">
            <div className="flex h-10 items-center rounded-xl bg-slate-100 px-2">
              <button type="button" className="inline-flex h-8 shrink-0 items-center rounded-lg px-2.5 text-sm font-bold text-slate-800 transition hover:bg-white">
                全部
                <ChevronDown size={14} className="ml-1 text-slate-500" />
              </button>
              <span className="mx-2 h-5 w-px bg-slate-300" />
              <Search size={15} className="shrink-0 text-slate-400" />
              <input
                value={mailSearchQuery}
                onChange={(event) => setMailSearchQuery(event.target.value)}
                placeholder="搜索邮件"
                className="ml-2 min-w-0 flex-1 border-none bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button type="button" className="ml-2 inline-flex h-8 shrink-0 items-center rounded-lg px-2.5 text-sm font-bold text-slate-500 transition hover:bg-white hover:text-slate-800">
                高级
              </button>
            </div>

            {mailSelectionMode ? (
              <div data-mail-selection-bar="true" className="flex min-h-12 items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 text-lg font-black text-slate-950">
                  <SquareCheck size={22} className="shrink-0 fill-[#0A59F7] text-[#0A59F7]" />
                  <span>已选中 <span className="text-[#0A59F7]">{selectedMailIds.length}</span> 封邮件</span>
                </div>
                {isMailReaderHidden && renderMailBatchActions({ density: 'compact' })}
                <button
                  type="button"
                  aria-label="退出多选"
                  title="退出多选"
                  onClick={exitMailSelectionMode}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
	                <div className="min-w-0">
	                  <h2 className="text-lg font-black text-slate-950">{folderLabel}</h2>
	                  <div data-mail-list-summary="true" className="mt-1 text-xs font-semibold text-slate-400">
	                    {mailListSummary}
	                  </div>
	                </div>
                <div data-mail-folder-toolbar="true" className="flex shrink-0 items-center gap-1.5">
                  {isMailReaderHidden && (
                    <button
                      type="button"
                      aria-label="显示阅读区"
                      title="显示阅读区"
                      onClick={onRestoreMailReader}
                      className="inline-flex h-9 shrink-0 items-center rounded-lg px-2.5 text-sm font-black text-[#0A59F7] transition hover:bg-[#0A59F7]/[0.08]"
                    >
                      <PanelRightOpen size={17} className="mr-1.5" />
                      显示阅读区
                    </button>
                  )}
                  <button type="button" aria-label="刷新邮件" title="刷新邮件" className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-slate-950">
                    <RefreshCw size={17} />
                  </button>
                  <button
                    type="button"
                    aria-label="多选邮件"
                    title="多选邮件"
                    onClick={enterMailSelectionMode}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    <SquareCheck size={17} />
                  </button>
                  <div ref={mailFilterRef} className="relative">
                    <button
                      type="button"
                      data-mail-filter-trigger="true"
                      onClick={() => setMailFilterMenuOpen((prev) => !prev)}
                      aria-label="筛选邮件"
                      title="筛选邮件"
                      aria-haspopup="menu"
                      aria-expanded={mailFilterMenuOpen}
                      className={`inline-flex h-9 items-center justify-center rounded-lg px-2.5 text-sm font-black transition ${
                        mailListFilter !== 'all' ? 'bg-[#0A59F7]/[0.08] text-[#0A59F7]' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                      }`}
                    >
                      <Funnel size={17} />
                      {mailListFilter !== 'all' && <span className="ml-1.5 max-w-[56px] truncate">{activeMailFilter.label}</span>}
                    </button>
                    {mailFilterMenuOpen && (
                      <div
                        data-mail-filter-menu="true"
                        role="menu"
                        className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
                      >
                        {MAIL_LIST_FILTER_OPTIONS.map((option) => {
                          const Icon = option.icon;
                          const active = option.id === mailListFilter;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              role="menuitemradio"
                              aria-checked={active}
                              onClick={() => applyMailListFilter(option.id)}
                              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-bold transition ${
                                active ? 'bg-[#0A59F7]/[0.08] text-[#0A59F7]' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                              }`}
                            >
                              <Icon size={17} className="shrink-0" />
                              <span className="min-w-0 flex-1 truncate">{option.label}</span>
                              {active && <Check size={15} className="shrink-0" />}
                            </button>
                          );
                        })}
                        <div className="my-1 h-px bg-slate-100" />
                        {MAIL_SORT_OPTIONS.map((option) => {
                          const active = option.id === mailSortOrder;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              role="menuitemradio"
                              aria-checked={active}
                              onClick={() => applyMailSortOrder(option.id)}
                              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-bold transition ${
                                active ? 'bg-[#0A59F7]/[0.08] text-[#0A59F7]' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                              }`}
                            >
                              <ListFilter size={17} className="shrink-0" />
                              <span className="min-w-0 flex-1 truncate">{option.label}</span>
                              {active && <Check size={15} className="shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {!mailSelectionMode && isMailReaderHidden && effectiveSelectedMail && renderMailSelectedActionBar(effectiveSelectedMail)}
          </div>

        </div>

	        <div className={`flex-1 bg-white ${mailListDetailMail ? 'overflow-hidden' : 'overflow-y-auto'} ${isMailReaderHidden ? 'px-0 py-0' : 'px-3 py-2'}`}>
	          {mailListDetailMail ? (
	            <div data-mail-list-detail-page="true" className="flex h-full min-h-0 flex-col bg-[#f6f7f9]">
	              <div className="flex h-12 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-5">
	                <button
	                  type="button"
	                  onClick={closeMailListDetail}
	                  className="inline-flex h-8 shrink-0 items-center rounded-lg px-2.5 text-sm font-black text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
	                >
	                  <ChevronLeft size={16} className="mr-1.5" />
	                  返回邮件列表
	                </button>
	                <div className="min-w-0 truncate text-sm font-semibold text-slate-500">{mailListDetailMail.subject}</div>
	              </div>
	              <div className="min-h-0 flex-1 overflow-hidden">
	                {renderMailReaderPane(mailListDetailMail, { onBackToList: closeMailListDetail })}
	              </div>
	            </div>
	          ) : (
	            <>
	          {isMailReaderHidden && (
            <div
              data-mail-wide-list-header="true"
              className="sticky top-0 z-10 grid items-center gap-4 border-y border-slate-200 bg-slate-50 px-5 py-2 text-xs font-black text-slate-500"
              style={{ gridTemplateColumns: mailTableGridTemplate }}
            >
              <span />
              <span className="group relative min-w-0">发件人{renderMailTableColumnResizer('sender', '调整发件人列宽')}</span>
              <span className="group relative min-w-0">主题与摘要{renderMailTableColumnResizer('subject', '调整主题与摘要列宽')}</span>
              <span className="group relative min-w-0">状态{renderMailTableColumnResizer('status', '调整状态列宽')}</span>
              <span className="group relative min-w-0 text-right">时间{renderMailTableColumnResizer('time', '调整时间列宽')}</span>
            </div>
          )}
	          {visibleMails.length === 0 ? (
	            <div data-mail-empty-state="true" className="flex h-full items-center justify-center px-6 text-center">
	              {isMailSearchActive ? (
	                <div className="max-w-[360px]">
	                  <div className="text-sm font-black text-slate-700">没有找到与“{mailSearchQuery.trim()}”相关的邮件</div>
	                  <div className="mt-2 text-xs font-semibold leading-5 text-slate-500">请更换关键词，或清除搜索后查看当前文件夹邮件。</div>
	                  <button
	                    type="button"
	                    onClick={() => setMailSearchQuery('')}
	                    className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50"
	                  >
	                    清除搜索
	                  </button>
	                </div>
	              ) : (
	                <div className="text-sm font-semibold text-slate-400">当前筛选下没有邮件</div>
	              )}
	            </div>
	          ) : (
            mailTimelineRows.map((row) => {
              if (row.type === 'timeline') {
                return (
		                  <div
		                    key={row.key}
		                    data-mail-timeline-label="true"
		                    className={
                          isMailReaderHidden
                            ? 'flex items-center gap-2 border-b border-slate-100 bg-white px-5 py-2 text-xs font-black text-slate-500'
                            : 'flex items-center gap-2 px-3 pb-1 pt-4 text-sm font-black text-slate-600'
                        }
		                  >
		                    <ChevronDown size={15} className="shrink-0 text-slate-500" />
		                    <span>{row.label}</span>
	                  </div>
                );
              }

              const mail = row.mail;
	              const selected = effectiveSelectedMail?.id === mail.id;
              const selectedInBatch = selectedMailIds.includes(mail.id);
              if (isMailReaderHidden) {
                return (
                  <div
                    key={mail.id}
                    data-mail-list-card={mail.id}
                    data-mail-row-mode="table"
	                    onClick={() => {
	                      if (mailSelectionMode) {
	                        toggleSelectedMail(mail.id);
	                        return;
	                      }
	                      selectMailFromList(mail);
	                    }}
	                    onDoubleClick={() => openMailListDetail(mail)}
	                    onContextMenu={(event) => openMailContextMenu(event, mail)}
                    className={`group relative grid min-h-[54px] w-full cursor-pointer items-center gap-4 border-b border-slate-100 px-5 py-2 text-left transition-colors ${
                      selectedInBatch
                        ? 'bg-[#0A59F7]/10'
                        : selected
                          ? 'bg-[#0A59F7]/10'
                          : 'bg-white hover:bg-slate-50'
                    }`}
                    style={{ gridTemplateColumns: mailTableGridTemplate }}
                  >
                    <div className="flex items-center justify-center">
                      {mailSelectionMode ? (
                        <input
                          type="checkbox"
                          aria-label={`选择邮件：${mail.subject}`}
                          checked={selectedInBatch}
                          onChange={() => toggleSelectedMail(mail.id)}
                          onClick={(event) => event.stopPropagation()}
                          className="h-4 w-4 shrink-0 rounded border-slate-300 text-[#0A59F7] focus:ring-[#0A59F7]"
                        />
                      ) : (
                        <span
                          data-mail-read-state={mail.unread ? 'unread' : 'read'}
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${mail.unread ? 'bg-[#0A59F7]' : 'bg-transparent'}`}
                          aria-label={mail.unread ? '未读' : '已读'}
                        />
                      )}
                    </div>
                    <div data-mail-wide-column="sender" className="min-w-0">
                      <div data-mail-sender-name="true" className="truncate text-sm font-black text-slate-950">{mail.fromName}</div>
                    </div>
                    <div data-mail-wide-column="subject" data-mail-row-content="true" className="min-w-0">
                      <div data-mail-title-time="true" className="flex min-w-0 items-center gap-1.5">
                        {mail.linkedEventId && <Calendar size={14} className="shrink-0 text-slate-500" aria-label="关联日程" />}
                        <div data-mail-title-text="true" className={`min-w-0 truncate text-sm leading-snug ${mail.unread ? 'font-black text-[#0A59F7]' : 'font-black text-slate-950'}`}>
                          {mail.subject}
                        </div>
                      </div>
                      <div data-mail-preview="true" className={`mt-0.5 truncate text-xs font-medium leading-snug ${mail.unread ? 'text-slate-600' : 'text-slate-500'}`}>
                        {mail.preview}
                      </div>
                    </div>
	                    <div data-mail-wide-column="status" data-mail-sender-markers="true" className="flex min-w-0 items-center gap-1.5 text-slate-500">
	                      {renderMailStatusIcons(mail, { showUnread: true, showLinkedEvent: false })}
	                    </div>
                    <div data-mail-wide-column="time" className="relative flex min-w-0 items-center justify-end">
                      <div
                        data-mail-hover-actions="true"
                        className={`pointer-events-none absolute right-0 z-10 items-center justify-end gap-1 rounded-lg bg-white px-1 opacity-0 shadow-sm ring-1 ring-slate-200/80 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 ${mailSelectionMode ? 'hidden' : 'flex'}`}
                      >
	                        {renderMailQuickActions(mail)}
                      </div>
                      <div data-mail-timestamp="true" className="shrink-0 text-right text-xs font-semibold tabular-nums text-slate-500">{formatMailListTime(mail.timestamp)}</div>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={mail.id}
                  data-mail-list-card={mail.id}
                  data-mail-row-mode="compact"
	                  onClick={() => {
	                    if (mailSelectionMode) {
	                      toggleSelectedMail(mail.id);
	                      return;
	                    }
	                    selectMailFromList(mail);
	                  }}
                  onContextMenu={(event) => openMailContextMenu(event, mail)}
                  className={`group relative my-0.5 grid w-full cursor-pointer grid-cols-[10px_minmax(0,1fr)] gap-2 rounded-xl px-3 py-2 text-left transition-colors ${
                    selectedInBatch
                      ? 'bg-[#0A59F7]/10 ring-1 ring-[#0A59F7]/30'
                      : selected
                        ? 'bg-[#0A59F7]/10 ring-1 ring-[#0A59F7]/30'
                        : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  <div className="flex justify-center pt-[7px]">
                    <span
                      data-mail-read-state={mail.unread ? 'unread' : 'read'}
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${mail.unread ? 'bg-[#0A59F7]' : 'bg-transparent'}`}
                      aria-label={mail.unread ? '未读' : '已读'}
                    />
                  </div>
	                  <div data-mail-row-content="true" className="min-w-0">
	                    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_88px] gap-3">
	                      <div className="min-w-0">
                          <div data-mail-sender-name="true" className="min-w-0 truncate text-sm font-black text-slate-950">{mail.fromName}</div>
	                        <div data-mail-title-time="true" className="mt-1 flex min-w-0 items-center gap-1">
	                          {mailSelectionMode && (
	                            <input
	                              type="checkbox"
	                              aria-label={`选择邮件：${mail.subject}`}
	                              checked={selectedInBatch}
	                              onChange={() => toggleSelectedMail(mail.id)}
	                              onClick={(event) => event.stopPropagation()}
	                              className="h-4 w-4 shrink-0 rounded border-slate-300 text-[#0A59F7] focus:ring-[#0A59F7]"
	                            />
	                          )}
	                          {mail.linkedEventId && <Calendar size={14} className="shrink-0 text-slate-500" aria-label="关联日程" />}
	                          <div data-mail-title-text="true" className={`min-w-0 truncate text-sm leading-snug ${mail.unread ? 'font-black text-[#0A59F7]' : 'font-black text-slate-950'}`}>
	                            {mail.subject}
	                          </div>
	                        </div>
                        </div>
	                      <div className="flex w-[88px] shrink-0 flex-col items-end">
	                        <div className="relative h-6 w-[88px]">
	                        <div
	                          data-mail-hover-actions="true"
	                          className={`pointer-events-none absolute inset-y-0 right-0 z-10 items-center justify-end gap-1 rounded-lg bg-white px-1 opacity-0 shadow-sm ring-1 ring-slate-200/80 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 ${mailSelectionMode ? 'hidden' : 'flex'}`}
	                        >
		                          {renderMailQuickActions(mail)}
	                        </div>
	                        <div data-mail-sender-markers="true" className="absolute inset-y-0 right-0 flex items-center justify-end gap-1.5 text-slate-500 transition-opacity group-hover:opacity-0">
	                          {renderMailStatusIcons(mail)}
	                        </div>
	                        </div>
	                        <div data-mail-timestamp="true" className="mt-1 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-500">{formatMailListTime(mail.timestamp)}</div>
	                      </div>
	                    </div>
	                    <div data-mail-preview="true" className={`mt-0.5 truncate text-xs font-medium leading-snug ${mail.unread ? 'text-slate-600' : 'text-slate-500'}`}>
	                      {mail.preview}
	                    </div>
                  </div>
                </div>
              );
            })
          )}
	          {contextMail && (
            <div
              data-mail-context-menu="true"
              role="menu"
              className="fixed z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
              style={{ top: mailContextMenu.y, left: mailContextMenu.x }}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            >
	              <button
	                type="button"
	                role="menuitem"
	                onClick={() => runMailContextAction(() => onToggleRead(contextMail.id))}
	                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
	              >
	                {contextMail.unread ? <MailOpen size={15} className="text-slate-400" /> : <Mail size={15} className="text-slate-400" />}
	                {contextMail.unread ? '标为已读' : '标为未读'}
	              </button>
	              <button
	                type="button"
	                role="menuitem"
	                onClick={() => runMailContextAction(() => onToggleStar(contextMail.id))}
	                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
	              >
	                {contextMail.starred ? <FlagFilled size={15} className="text-red-500" /> : <Flag size={15} className="text-slate-400" />}
	                {contextMail.starred ? '取消旗标' : '标记旗标'}
	              </button>
	              <button
	                type="button"
	                role="menuitem"
	                onClick={() => runMailContextAction(() => onDeleteMail(contextMail.id))}
	                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
	              >
	                <Trash size={15} />
	                删除邮件
	              </button>
	              <div className="my-1 h-px bg-slate-100" />
	              <button
	                type="button"
	                role="menuitem"
	                onClick={() => runMailContextAction(() => onArchiveMail(contextMail.id))}
	                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
	              >
	                <Archive size={15} className="text-slate-400" />
	                归档邮件
	              </button>
	            </div>
	          )}
	            </>
	          )}
	        </div>
	      </div>

      <LayoutResizeHandle
        id="mail-b"
        label={isMailReaderHidden ? '拖拽恢复邮件阅读区' : '调整邮件列表和阅读窗格宽度'}
        value={mailListWidth}
        min={mailListBounds.min}
        max={mailListBounds.max}
        active={activeLayoutResize === 'mail-b'}
        edgePinned={isMailReaderHidden}
        onStart={(event) => onStartLayoutResize('mail-b', event)}
        onStep={(delta) => onStepLayoutResize('mail-b', delta)}
      />

      {!isMailReaderHidden && (
      <div data-mail-reader-region="true" className="min-w-0 flex-1 bg-[#f6f7f9]">
        {mailSelectionMode ? (
          <div data-mail-bulk-reader="true" className="flex h-full flex-col bg-[#f6f7f9]">
            <div className="flex shrink-0 flex-nowrap items-center border-b border-slate-200 bg-white px-6 py-4">
              <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-hidden whitespace-nowrap pr-2">
                {renderMailBatchActions()}
              </div>
              <button type="button" aria-label="更多批量操作" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100">
                <MoreHorizontal size={18} />
              </button>
            </div>

            <div data-mail-bulk-reader-surface="true" className="flex-1 overflow-y-auto px-8 py-10">
              <div className="mx-auto flex min-h-full max-w-[720px] items-center justify-center">
                {selectedBatchMails.length === 0 ? (
                  <div className="text-sm font-semibold text-slate-400">请选择要批量处理的邮件</div>
                ) : (
                  <div className="w-full text-center">
                    <div className="text-2xl font-black text-slate-950">已选中 {selectedBatchMails.length} 封邮件</div>
                    <div className="mt-3 text-sm font-semibold leading-6 text-slate-500">批量操作不会打开单封邮件内容，请使用上方操作栏处理当前选择。</div>
                    <div className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 text-left">
                      <div className="bg-white px-4 py-3">
                        <div className="text-xs font-semibold text-slate-400">未读</div>
                        <div className="mt-1 text-lg font-black text-slate-950">{selectedBatchMails.filter((mail) => mail.unread).length}</div>
                      </div>
                      <div className="bg-white px-4 py-3">
                        <div className="text-xs font-semibold text-slate-400">旗标</div>
                        <div className="mt-1 text-lg font-black text-slate-950">{selectedBatchMails.filter((mail) => mail.starred).length}</div>
                      </div>
                      <div className="bg-white px-4 py-3">
                        <div className="text-xs font-semibold text-slate-400">附件</div>
                        <div className="mt-1 text-lg font-black text-slate-950">{selectedBatchMails.filter((mail) => mail.attachments.length > 0).length}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
	        ) : (
		          renderMailReaderPane(effectiveSelectedMail)
	        )}
      </div>
      )}
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
  width = APP_SIDEBAR_WIDTH,
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
        data-app-sidebar="calendar"
        className="relative z-10 hidden shrink-0 select-none border-r border-slate-200 bg-[#f1f3f5] md:flex md:flex-col"
        style={{ width: APP_COLLAPSED_SIDEBAR_WIDTH, zIndex: 20 }}
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
        <SidebarProductDock activeProduct={activeProduct} onSelectProduct={onSelectProduct} compact />
      </aside>
    );
  }

  return (
    <aside
      data-app-sidebar="calendar"
      className="relative z-10 hidden shrink-0 select-none border-r border-slate-200 bg-[#f1f3f5] md:flex md:flex-col"
      style={{ width, zIndex: 20 }}
    >
        <div className="px-6 pb-4 pt-6">
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
          <div className="flex w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-[#0A59F7]">
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

      <div className="px-6 pb-6">
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
            <span
              className="shrink-0 whitespace-nowrap px-1 text-center text-sm font-bold leading-none text-gray-800"
              data-calendar-mini-month-label="true"
            >
              {focusDate.getFullYear()}年{focusDate.getMonth() + 1}月
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
                        ? 'bg-[#0A59F7] text-white font-bold hover:bg-[#0A59F7]'
                        : cell.isCurrentMonth
                          ? 'text-gray-700 hover:bg-slate-200'
                          : 'text-gray-300 hover:bg-slate-100'
                    } ${
                      cell.isToday && !isSelectedDate
                        ? 'ring-2 ring-[#0A59F7] ring-offset-1 font-bold text-[#0A59F7]'
                        : ''
                    } ${
                      cell.isToday && isSelectedDate
                        ? 'ring-2 ring-[#0A59F7]/40 ring-offset-1'
                        : ''
                    }`}
                  >
                    <span className="relative z-[1] leading-none">{cell.date.getDate()}</span>
                    {markerColors.length > 0 && (
                      <span
                        className={`pointer-events-none absolute left-1/2 bottom-[2px] h-[2px] w-[6px] -translate-x-1/2 rounded-full ${
                          isSelectedDate ? 'bg-white' : 'bg-[#0A59F7]'
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

      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-3">
        <div className="space-y-5">
          {[
            { key: 'ownAccounts', title: '我的日历', ownership: 'self', items: ownAccounts },
            { key: 'sharedAccounts', title: '共享日历', ownership: 'shared', items: sharedAccounts },
          ].map((group) => (
            <div key={group.title} className="group px-1">
              <button
                type="button"
                onClick={() => toggleSection(group.key)}
                className="mb-1 flex h-9 w-full items-center justify-between rounded-lg px-2 text-left text-sm font-medium text-slate-500 transition hover:bg-slate-200/70 hover:text-slate-900"
              >
                <span className="relative flex min-w-0 items-center pr-2">
                  <span className="truncate text-[12px] font-bold tracking-wide text-slate-400">{group.title}</span>
                  {group.ownership === 'shared' && pendingShareInvitationCount > 0 && (
                    <span className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                  )}
                </span>
                <ChevronDown
                  size={16}
                  className={`ml-2 shrink-0 text-slate-500 transition-transform ${
                    collapsedSections[group.key] ? '-rotate-90' : ''
                  }`}
                />
              </button>

              {!collapsedSections[group.key] && (
                <div className="mt-1 space-y-[2px]">
                  {group.items.map((account) => {
                    const displayName = getAccountDisplayLabel(account);
                    const fullLabel = getAccountFullLabel(account);

                    return (
                      <div
                        key={account.id}
                        className="group/account relative flex cursor-default items-center gap-2 rounded-xl px-2 py-1.5 transition-colors duration-120 hover:bg-white/65"
                        onContextMenu={(e) => onAccountContextMenu(e, account)}
                      >
                        <label
                          className="relative flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center"
                          title={account.checked ? '取消选中此日历' : '选中此日历'}
                        >
                          <input
                            type="checkbox"
                            checked={account.checked}
                            onChange={(e) => {
                              e.stopPropagation();
                              onToggleAccount(account.id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`显示${displayName}`}
                            className="sr-only"
                          />
                          <span
                            data-calendar-account-checkbox={account.id}
                            className={`flex h-5 w-5 items-center justify-center rounded-md border-[1.5px] transition-all duration-150 ${
                              account.checked ? getAccountCheckboxTone(account.color) : 'border-gray-300 bg-white text-transparent hover:border-[#0A59F7]/60'
                            }`}
                          >
                            {account.checked && <Check size={13} strokeWidth={2.8} />}
                          </span>
                        </label>
                        <div title={fullLabel} className="-mx-1 min-w-0 flex-1 truncate rounded px-1 py-0.5">
                          <span className="text-[14px] font-semibold leading-snug text-gray-800">{displayName}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAccountMenu?.(e, account);
                          }}
                          title="更多"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 opacity-0 transition hover:bg-white hover:text-gray-700 group-hover/account:opacity-100"
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        {account.ownership === 'shared' && account.hasPendingInvite && (
                          <span className="absolute right-1.5 top-1/2 h-1.5 w-1.5 shrink-0 -translate-y-1/2 animate-pulse rounded-full bg-red-500" />
                        )}
                      </div>
                    );
                  })}

                  {group.items.length === 0 && (
                    <div className="px-1 py-2.5 text-xs font-medium text-gray-400">
                      {`暂无${group.title}`}
                    </div>
                  )}

                  {group.ownership === 'shared' && (
                    <button
                      onClick={onAddSharedCalendar}
                      className="relative mt-0.5 flex w-full items-center justify-start gap-1.5 rounded-lg px-2 py-[5px] text-[12px] font-medium text-gray-500 transition-colors duration-120 hover:bg-slate-200/70 hover:text-[#0A59F7]"
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
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <SidebarProductDock activeProduct={activeProduct} onSelectProduct={onSelectProduct} />
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
                          ? 'bg-[#0A59F7]/[0.06]'
                          : showHuaweiWorkdayBadges && isHuaweiMakeupWorkday(day.date)
                            ? 'bg-amber-50/70'
                            : isWeekendDate(day.date)
                              ? 'bg-slate-50/70'
                              : 'bg-[#fcfcfb]'
                      }`}
                    >
                      <div className="flex h-12 flex-col items-center justify-center">
                        <span className={`text-xs font-bold ${day.isToday ? 'text-[#0A59F7]' : 'text-gray-500'}`}>{day.short}</span>
                        <span className={`inline-flex items-center gap-1 text-lg font-black ${day.isToday ? 'text-[#0A59F7]' : 'text-gray-900'}`}>
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
                                      className={`w-full truncate rounded-md border px-2 py-1 text-left text-[11px] font-semibold transition-colors hover:ring-2 hover:ring-[#0A59F7]/25 ${tones.container} ${
                                        flashingEventId === event.id ? 'coremail-event-locate-pulse' : ''
                                      }`}
                                    >
                                      <span className={event.status === '已取消' ? 'line-through' : ''}>{title}</span>
                                      {spans > 1 && <span className="ml-1 text-[10px] text-gray-400">跨{spans}天</span>}
                                    </button>
                                  );
                                })}
                                {cellEvents.length > 3 && <div className="px-1 text-[10px] font-bold text-[#0A59F7]">+{cellEvents.length - 3} 更多</div>}
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
                  <div key={`${day.date.toISOString()}-split-timeline`} className={`relative border-r border-gray-200 ${day.isToday ? 'bg-[#0A59F7]/[0.02]' : 'bg-white'}`}>
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
                                  isWorkHour(hour) ? 'border-gray-100 bg-transparent hover:bg-[#0A59F7]/[0.08]' : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100'
                                }`}
                              >
                                {!selection && (
                                  <div className="absolute inset-1 hidden items-center justify-center rounded-lg border-2 border-dashed border-[#0A59F7]/35 bg-[#0A59F7]/[0.05] group-hover:flex">
                                    <Plus className="text-[#0A59F7]" size={16} />
                                  </div>
                                )}
                              </div>
                            ))}

                            {selection && sameDay(selection.date, day.date) && (selection.laneId || null) === laneId && (
                              <div
                                className="pointer-events-none absolute rounded-lg border-2 border-[#0A59F7]/60 bg-[#0A59F7]/[0.12] shadow-sm"
                                style={{
                                  top: `${getWeekTimeTop(selection.startH)}px`,
                                  height: `${getTimeHeight(selection.durationH)}px`,
                                  left: '4px',
                                  width: 'calc(100% - 8px)',
                                  zIndex: 4,
                                }}
                              >
                                <div className="px-2 py-1.5 text-[11px] font-black text-[#0A59F7]">
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
                                    editable ? 'cursor-grab select-none hover:ring-2 hover:ring-[#0A59F7]/30 active:cursor-grabbing' : 'cursor-pointer'
                                  } ${isInteracting && interaction?.changed ? 'pointer-events-none z-20 ring-2 ring-[#0A59F7]/40 shadow-lg' : 'hover:z-10'} ${
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
                                      <span className="mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#0A59F7] shadow-sm"></span>
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
                                      <span className="mb-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#0A59F7] shadow-sm"></span>
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
                              ? 'bg-[#0A59F7]/[0.07]'
                              : showHuaweiWorkdayBadges && isHuaweiMakeupWorkday(day.date)
                                ? 'bg-amber-50/70'
                                : isWeekendDate(day.date)
                                  ? 'bg-slate-50/70'
                                  : 'bg-[#fcfcfb]'
                          }`}
                          style={{ height: `${weekTimelineHeaderHeight}px` }}
                        >
                          <div className="flex h-full flex-col items-center justify-center">
                            <span className={`text-xs font-bold ${day.isToday ? 'text-[#0A59F7]' : 'text-gray-500'}`}>{day.short}</span>
                            <span className={`inline-flex items-center gap-1 text-lg font-black ${day.isToday ? 'text-[#0A59F7]' : 'text-gray-800'}`}>
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
                          const hiddenDetails = isBusyOnlyEvent(event, calendar) || isPrivateLimitedEvent(event, calendar);
                          const displayEvent = hiddenDetails ? { ...event, type: 'busy_only' } : event;
                          const tones = getToneClasses(displayEvent, calendar.color || 'bg-gray-500');
                          const visibleTitle = getVisibleEventTitle(event, calendar);
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
                              title={visibleTitle}
                              className={`pointer-events-auto absolute rounded-md border text-left px-2 py-1 text-[11px] font-semibold truncate transition-colors hover:ring-2 hover:ring-[#0A59F7]/25 ${tones.container} ${
                                flashingEventId === event.id ? 'coremail-event-locate-pulse' : ''
                              }`}
                              style={{ left, width, top }}
                            >
                              <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${tones.stripe}`}></div>
                              <div className="pl-2 truncate">
                                {visibleTitle}
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
                          className={`flex-1 border-r border-gray-200 relative ${day.isToday ? 'bg-[#0A59F7]/[0.03]' : ''}`}
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
                              isWorkHour(hour) ? 'border-gray-100 bg-white hover:bg-[#0A59F7]/[0.08]' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                            }`}
                          >
                            {!selection && (
                              <div className="hidden group-hover:flex absolute inset-1 border-2 border-dashed border-[#0A59F7]/35 rounded-lg bg-[#0A59F7]/[0.05] items-center justify-center">
                                <Plus className="text-[#0A59F7]" size={18} />
                              </div>
                            )}
                          </div>
                          ))}

                          {selection && sameDay(selection.date, day.date) && (selection.laneId || null) === laneId && (
                            <div
                              className="absolute rounded-xl border-2 border-[#0A59F7]/60 bg-[#0A59F7]/[0.12] shadow-sm pointer-events-none"
                              style={{
                                top: `${getWeekTimeTop(selection.startH)}px`,
                                height: `${getTimeHeight(selection.durationH)}px`,
                                left: '4px',
                                width: 'calc(100% - 8px)',
                                zIndex: 4,
                              }}
                            >
                              <div className="px-2 py-2 text-[#0A59F7]">
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
                                    editable ? 'cursor-grab active:cursor-grabbing select-none hover:ring-2 hover:ring-[#0A59F7]/30 hover:z-10' : 'cursor-pointer'
                                  } ${isInteracting && interaction?.changed ? 'pointer-events-none ring-2 ring-[#0A59F7]/40 shadow-lg z-20' : useCompactCard ? 'hover:z-10' : 'hover:shadow-md hover:z-10'} ${
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
                                      <span className="mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#0A59F7] shadow-sm"></span>
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
                                      <span className="mb-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#0A59F7] shadow-sm"></span>
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
                          const hiddenDetails = isBusyOnlyEvent(event, calendar) || isPrivateLimitedEvent(event, calendar);
                          const displayEvent = hiddenDetails ? { ...event, type: 'busy_only' } : event;
                          const tones = getToneClasses(displayEvent, calendar.color || 'bg-gray-500');
                          const visibleTitle = getVisibleEventTitle(event, calendar);
                          const sourceLabel = showOverlayAccountLabel ? getCompactSourceLabel(account, calendar) : '';
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
                              title={`${visibleTitle}${account ? ` · ${getAccountDisplayLabel(account)}` : ''}`}
                              className={`relative w-full overflow-hidden rounded-lg border px-3 py-2 text-left transition-colors hover:ring-2 hover:ring-[#0A59F7]/25 ${tones.container} ${
                                flashingEventId === event.id ? 'coremail-event-locate-pulse' : ''
                              }`}
                            >
                              {!hiddenDetails && <div className={`absolute bottom-0 left-0 top-0 w-1 ${tones.stripe}`}></div>}
                              <div className="flex min-w-0 items-start gap-2 pl-1">
                                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${tones.stripe}`}></div>
                                <div className="min-w-0">
                                  {sourceLabel && (
                                    <div className="mb-0.5 truncate text-[10px] font-black opacity-55">{sourceLabel}</div>
                                  )}
                                  <span className="block truncate text-xs font-bold">{visibleTitle}</span>
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
                              isWorkHour(hour) ? 'border-gray-100 bg-white hover:bg-[#0A59F7]/[0.08]' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                            }`}
                          >
                            {!selection && (
                              <div className="hidden group-hover:flex absolute inset-1 border-2 border-dashed border-[#0A59F7]/35 rounded-lg bg-[#0A59F7]/[0.06] items-center justify-center">
                                <Plus className="text-[#0A59F7]" size={18} />
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ))}
                    {selection && sameDay(selection.date, focusDate) && (selection.laneId || null) === lane.id && (
                      <div
                        className="absolute rounded-xl border-2 border-[#0A59F7]/60 bg-[#0A59F7]/[0.12] shadow-sm pointer-events-none"
                        style={{
                          top: `${getTimeTop(selection.startH)}px`,
                          height: `${getTimeHeight(selection.durationH)}px`,
                          left: '8px',
                          width: 'calc(100% - 16px)',
                          zIndex: 4,
                        }}
                      >
                        <div className="px-3 py-2 text-[11px] font-black text-[#0A59F7]">
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
                              editable ? 'cursor-grab active:cursor-grabbing select-none hover:ring-2 hover:ring-[#0A59F7]/30 hover:z-10' : 'cursor-pointer'
                            } ${isInteracting && interaction?.changed ? 'pointer-events-none ring-2 ring-[#0A59F7]/40 shadow-lg z-20' : useCompactCard ? 'hover:z-10' : 'hover:shadow-md'} ${
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
                                <span className="mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#0A59F7] shadow-sm"></span>
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
                                      <span className="mb-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#0A59F7] shadow-sm"></span>
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
              ? 'bg-slate-50/80 hover:bg-[#0A59F7]/[0.04]'
              : 'bg-white hover:bg-[#0A59F7]/[0.04]';
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
                      ? 'bg-[#0A59F7] text-white'
                      : isSelectedDate
                        ? 'border border-[#0A59F7] bg-[#0A59F7]/[0.08] text-[#0A59F7]'
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
                      ? 'border-[#0A59F7]/25 bg-[#0A59F7]/[0.08] text-[#0A59F7] opacity-100'
                      : 'border-slate-200 bg-white opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:border-[#0A59F7]/25 group-hover:bg-[#0A59F7]/[0.08] group-hover:text-[#0A59F7] group-focus-within:opacity-100 group-focus-within:pointer-events-auto'
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
                  className="text-[11px] font-bold text-[#0A59F7] pl-1"
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
  const organizer = !isBusyOnly ? event.organizer || getAccountDisplayLabel(account) || '' : '';
  const isRecurring = !isBusyOnly && event.repeat && event.repeat !== 'does_not_repeat';
  const joinable = !isBusyOnly && canJoinCalendarEvent(event);
  const titleTone = getToneClasses(isBusyOnly ? { ...event, type: 'busy_only' } : event, calendar?.color || account?.color || 'bg-gray-500');

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
        <div className={`relative border-b px-4 py-3 ${titleTone.container}`}>
          {!isBusyOnly && <div className={`absolute bottom-0 left-0 top-0 w-1 ${titleTone.stripe}`}></div>}
          {mode === 'drag' && label && (
            <div className="mb-2 inline-flex rounded-full bg-[#0A59F7]/[0.08] px-2 py-0.5 text-[11px] font-bold text-[#0A59F7]">
              {label}
            </div>
          )}
          <div className="flex min-w-0 items-start gap-2 pl-1">
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
            <Clock size={13} className="mr-2 shrink-0 text-[#0A59F7]" />
            {formatEventDateTime(event)}
          </div>

          {event.location && !isBusyOnly && (
            <div className="flex min-w-0 items-center">
              <MapPin size={13} className="mr-2 shrink-0 text-emerald-600" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {mode === 'drag' && (
            <div className="rounded-xl bg-[#0A59F7]/[0.08] px-3 py-2 text-[11px] font-bold text-[#0A59F7]">
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
                className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-[#0A59F7] px-3 text-xs font-bold text-white transition hover:bg-[#084DDB]"
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
        className="flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-left outline-none transition hover:bg-slate-50 focus:border-[#0A59F7] focus:ring-2 focus:ring-[#0A59F7]/20"
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
                    selected.id === option.id ? 'bg-[#0A59F7]/[0.08]' : 'hover:bg-slate-50'
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
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#0A59F7] focus:ring-2 focus:ring-[#0A59F7]/20"
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
          className="inline-flex h-10 items-center justify-center rounded-lg bg-[#0A59F7] px-3 text-sm font-bold text-white transition hover:bg-[#084DDB] disabled:cursor-not-allowed disabled:bg-slate-300"
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
            <span className={`h-4 w-4 shrink-0 rounded-full ${account.color || 'bg-[#0A59F7]'}`}></span>
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
                      className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#0A59F7] focus:ring-2 focus:ring-[#0A59F7]/20"
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
                        account.color === color ? 'ring-2 ring-[#0A59F7] ring-offset-2' : 'hover:scale-105'
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

          <div className="min-h-0 flex-1 overflow-y-auto p-6 space-y-6">
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
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#0A59F7] focus:ring-2 focus:ring-[#0A59F7]/20"
                    />
                  </div>
                  <PermissionDropdown value={draft.permissionId} onChange={(permissionId) => onChange({ permissionId })} />
                  <button
                    onClick={onSubmit}
                    disabled={!draft.email.trim()}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0A59F7] px-4 text-sm font-bold text-white transition hover:bg-[#084DDB] disabled:cursor-not-allowed disabled:bg-slate-300"
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
  const sourceName = calendar.receivedFromName || calendar.owner || calendar.receivedFrom || '未知共享方';
  const sourceAccount = calendar.receivedFrom || calendar.ownerEmail || '未提供账号';

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[560px] max-w-[92vw] max-h-[70vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`h-4 w-4 shrink-0 rounded-full ${calendar.color || account?.color || 'bg-gray-400'}`}></span>
            <div className="truncate text-lg font-black text-gray-900">查看权限</div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getReminderSharedCalendarName = (calendar, account) => {
  if (calendar?.type !== 'shared' && account?.ownership !== 'shared') return '';
  const name = getAccountDisplayLabel(account) || calendar?.receivedFromName || calendar?.owner || calendar?.name || '';
  return name;
};

const REMINDER_NOTICE_TONES = {
  invitation: {
    border: 'border-l-indigo-500',
    selectedBg: 'bg-indigo-50/60',
    hoverBg: 'hover:bg-indigo-50/40',
    badge: 'bg-indigo-50 text-indigo-700',
    icon: 'bg-indigo-50 text-indigo-600',
    action: 'bg-indigo-600 hover:bg-indigo-700',
  },
  shared: {
    border: 'border-l-orange-500',
    selectedBg: 'bg-orange-50/60',
    hoverBg: 'hover:bg-orange-50/40',
    badge: 'bg-orange-50 text-orange-700',
    icon: 'bg-orange-50 text-orange-600',
    action: 'bg-orange-600 hover:bg-orange-700',
  },
  update: {
    border: 'border-l-cyan-500',
    selectedBg: 'bg-cyan-50/60',
    hoverBg: 'hover:bg-cyan-50/40',
    badge: 'bg-cyan-50 text-cyan-700',
    icon: 'bg-cyan-50 text-cyan-600',
    action: 'bg-cyan-600 hover:bg-cyan-700',
  },
  sync: {
    border: 'border-l-slate-500',
    selectedBg: 'bg-slate-50',
    hoverBg: 'hover:bg-slate-50/80',
    badge: 'bg-slate-100 text-slate-700',
    icon: 'bg-slate-100 text-slate-500',
    action: 'bg-slate-700 hover:bg-slate-800',
  },
};

const REMINDER_NOTICE_ICON_MAP = {
  alert: AlertCircle,
  calendar: Calendar,
  refresh: RefreshCw,
  userPlus: UserPlus,
  users: Users,
};

const SUPPLEMENTAL_REMINDER_NOTIFICATIONS = [
  {
    id: 'notice-meeting-invitation',
    kind: 'notification',
    noticeType: 'invitation',
    title: '王敏邀请你参加预算口径确认会',
    typeLabel: '会议邀请',
    summary: '今天 10:50 - 11:20 · 等待回复',
    meta: [
      { icon: 'users', label: '来自 王敏' },
      { icon: 'calendar', label: '刚刚收到' },
    ],
    action: 'event_details',
    actionLabel: '查看邀请',
    eventId: 'q4-budget-sync',
    reminderSortTime: TODAY_DATE.getTime() + 3 * 60 * 1000,
  },
  {
    id: 'notice-shared-calendar',
    kind: 'notification',
    noticeType: 'shared',
    title: '张三共享了日历',
    typeLabel: '共享日历',
    summary: '你获得“可编辑”权限，可查看并维护该共享日历。',
    meta: [
      { icon: 'calendar', label: '张三' },
      { icon: 'userPlus', label: '刚刚加入' },
    ],
    action: 'shared_access',
    actionLabel: '查看权限',
    accountId: 'acc2',
    reminderSortTime: TODAY_DATE.getTime() + 4 * 60 * 1000,
  },
  {
    id: 'notice-event-updated',
    kind: 'notification',
    noticeType: 'update',
    title: '渠道复盘与线索分配时间已更新',
    typeLabel: '日程变更',
    summary: '组织者将会议地点调整为销售区 2F。',
    meta: [
      { icon: 'alert', label: '来自销售团队' },
      { icon: 'calendar', label: '5 分钟前更新' },
    ],
    action: 'event_details',
    actionLabel: '查看变更',
    eventId: 'q4-customer-budget',
    reminderSortTime: TODAY_DATE.getTime() + 5 * 60 * 1000,
  },
  {
    id: 'notice-sync-finished',
    kind: 'notification',
    noticeType: 'sync',
    title: '日历同步完成',
    typeLabel: '同步通知',
    summary: '已同步企业日历和共享日历，发现 1 条权限变更。',
    meta: [
      { icon: 'refresh', label: '系统通知' },
      { icon: 'calendar', label: '所有日历' },
    ],
    action: 'feedback',
    actionLabel: '查看结果',
    feedback: '日历已同步完成',
    reminderSortTime: TODAY_DATE.getTime() + 6 * 60 * 1000,
  },
];

function ReminderModal({
  open,
  onClose,
  reminderEvents,
  accountMap,
  calendarMap,
  onOpenEvent,
  onJoinEvent,
  onSnoozeEvent,
  onDismissEvent,
  onDismissAllEvents,
  onOpenNotification,
  onOpenSettings,
  skipDismissAllConfirm = false,
  onSetSkipDismissAllConfirm,
}) {
  const [snoozeValues, setSnoozeValues] = useState({});
  const [selectedReminderId, setSelectedReminderId] = useState(null);
  const [dismissAllConfirmOpen, setDismissAllConfirmOpen] = useState(false);
  const [skipDismissAllNextTime, setSkipDismissAllNextTime] = useState(false);

  useEffect(() => {
    if (!open) {
      setDismissAllConfirmOpen(false);
      setSkipDismissAllNextTime(false);
      return;
    }
    setSelectedReminderId((prev) => {
      if (reminderEvents.some((item) => item.id === prev)) return prev;
      return reminderEvents.find((item) => item.kind !== 'notification' && canJoinReminderEvent(item, TODAY_DATE.getTime()))?.id || reminderEvents[0]?.id || null;
    });
  }, [open, reminderEvents]);

  if (!open) return null;

  const requestDismissAllEvents = () => {
    if (reminderEvents.length === 0) return;
    if (skipDismissAllConfirm) {
      onDismissAllEvents();
      return;
    }
    setSkipDismissAllNextTime(false);
    setDismissAllConfirmOpen(true);
  };

  const confirmDismissAllEvents = () => {
    if (skipDismissAllNextTime) onSetSkipDismissAllConfirm?.(true);
    setDismissAllConfirmOpen(false);
    onDismissAllEvents();
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div
        className="relative max-h-[74vh] w-[820px] max-w-[92vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_18px_56px_rgba(15,23,42,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-reminder-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-5 py-4">
          <div id="calendar-reminder-title" className="text-lg font-black text-gray-900">提醒</div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-slate-700" aria-label="关闭提醒窗口">
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[calc(74vh-136px)] overflow-y-auto p-3">
          {reminderEvents.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm font-semibold text-gray-500">
              暂无待处理提醒
            </div>
          )}

          {reminderEvents.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              {reminderEvents.map((item, index) => {
                if (item.kind === 'notification') {
                  const noticeTone = REMINDER_NOTICE_TONES[item.noticeType] || REMINDER_NOTICE_TONES.sync;
                  const NoticeIcon = REMINDER_NOTICE_ICON_MAP[item.meta?.[0]?.icon] || Bell;
                  const selected = selectedReminderId === item.id;

                  return (
                    <div
                      key={item.id}
                      data-reminder-notice-id={item.id}
                      className={`group border-l-[3px] transition ${
                        selected ? `${noticeTone.border} ${noticeTone.selectedBg}` : `border-l-transparent ${noticeTone.hoverBg}`
                      } ${
                        index > 0 ? 'border-t border-slate-100' : ''
                      }`}
                    >
                      <div className="flex min-w-0 items-start gap-3 px-4 py-3">
                        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${noticeTone.icon}`}>
                          <NoticeIcon size={16} />
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedReminderId(item.id)}
                          onDoubleClick={() => onOpenNotification?.(item)}
                          className="min-w-0 flex-1 text-left focus:outline-none"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="min-w-0 flex-1 truncate text-sm font-black text-gray-900">{item.title}</div>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${noticeTone.badge}`}>
                              {item.typeLabel}
                            </span>
                          </div>
                          <div className="mt-1 truncate text-xs font-semibold text-slate-500">{item.summary}</div>
                          <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                            {(item.meta || []).map((entry) => {
                              const MetaIcon = REMINDER_NOTICE_ICON_MAP[entry.icon] || Bell;
                              return (
                                <span key={`${item.id}-${entry.label}`} className="inline-flex min-w-0 items-center gap-1.5">
                                  <MetaIcon size={13} className="shrink-0 text-slate-400" />
                                  <span className="truncate">{entry.label}</span>
                                </span>
                              );
                            })}
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDismissEvent(item.id)}
                          className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 ${
                            selected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                          }`}
                          aria-label={`清除 ${item.title || '该通知'}`}
                          title="清除此通知"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      {selected && (
                        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-white/85 px-4 py-2.5">
                          <button
                            type="button"
                            onClick={() => onOpenNotification?.(item)}
                            className={`inline-flex h-8 items-center rounded-lg px-3 text-xs font-bold text-white transition ${noticeTone.action}`}
                          >
                            {item.actionLabel || '查看'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }

                const event = item;
                const calendar = calendarMap[event.calId] || { color: 'bg-gray-500', accountId: '', name: '日历' };
                const account = accountMap[calendar.accountId];
                const timeMeta = getReminderTimeMeta(event, TODAY_DATE.getTime());
                const statusText = timeMeta.detailLabel || timeMeta.statusLabel;
                const snoozeOptions = getAvailableSnoozeOptions(event, TODAY_DATE.getTime());
                const snoozeOption = resolveSnoozeOption(event, snoozeValues[event.id], TODAY_DATE.getTime());
                const snoozeValue = snoozeOption?.id || snoozeOptions[0]?.id || '5m';
                const canJoin = canJoinReminderEvent(event, TODAY_DATE.getTime());
                const selected = selectedReminderId === event.id;
                const sharedCalendarName = getReminderSharedCalendarName(calendar, account);

                return (
                  <div
                    key={event.id}
                    data-reminder-event-id={event.id}
                    className={`group border-l-[3px] transition ${
                      selected ? 'border-l-[#0A59F7] bg-[#0A59F7]/[0.04]' : 'border-l-transparent hover:bg-slate-50/80'
                    } ${
                      index > 0 ? 'border-t border-slate-100' : ''
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-4 px-5 py-4">
                      <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${canJoin ? 'bg-[#0A59F7]/[0.08] text-[#0A59F7]' : 'bg-slate-100 text-slate-500'}`}>
                        {canJoin ? <Video size={23} fill="currentColor" strokeWidth={2.2} /> : <Calendar size={22} />}
                      </span>
                      <div
                        role="button"
                        tabIndex={0}
                        title="双击查看详情"
                        onClick={() => setSelectedReminderId(event.id)}
                        onDoubleClick={() => onOpenEvent(event.id)}
                        onKeyDown={(entry) => {
                          if (entry.key === 'Enter') onOpenEvent(event.id);
                        }}
                        className="min-w-0 flex-1 cursor-pointer text-left focus:outline-none"
                      >
                        <div className="flex min-w-0 flex-wrap items-center gap-3">
                          <div className="min-w-0 truncate text-sm font-black text-gray-900">{event.title || '无标题'}</div>
                          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${timeMeta.state === 'ongoing' ? 'bg-emerald-50 text-emerald-700' : 'bg-[#0A59F7]/[0.08] text-[#0A59F7]'}`}>
                            {statusText}
                          </span>
                        </div>

                        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                          <span className="inline-flex min-w-0 items-center gap-1.5">
                            <Clock size={13} className="shrink-0 text-slate-400" />
                            <span className="truncate">{formatDateLabel(eventToDate(event))} · {event.isAllDay ? '全天' : formatTimeRange(event.startH || WORK_START_HOUR, event.durationH || 1)}</span>
                          </span>
                          {event.location && (
                            <span className="inline-flex min-w-0 items-center gap-1.5">
                              <MapPin size={13} className="shrink-0 text-slate-400" />
                              <span className="truncate">{event.location}</span>
                            </span>
                          )}
                          {sharedCalendarName && (
                            <span className="inline-flex min-w-0 items-center gap-1.5">
                              <Calendar size={13} className="shrink-0 text-slate-400" />
                              <span className="truncate">{sharedCalendarName}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div data-reminder-inline-actions="true" className="flex shrink-0 items-center gap-3">
                        {canJoin && (
                          <button
                            type="button"
                            onClick={() => onJoinEvent(event)}
                            className="inline-flex h-11 items-center rounded-lg bg-[#0A59F7] px-5 text-sm font-bold text-white transition hover:bg-[#084DDB]"
                          >
                            加入会议
                          </button>
                        )}
                        <div className="relative h-11 w-[120px]">
                          <select
                            value={snoozeValue}
                            onChange={(entry) => {
                              const nextValue = entry.target.value;
                              setSnoozeValues((prev) => ({ ...prev, [event.id]: nextValue }));
                              onSnoozeEvent(event, nextValue);
                            }}
                            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                            aria-label={`${event.title || '无标题'} 稍后提醒时间`}
                          >
                            {snoozeOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <div className="flex h-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 shadow-sm">
                            稍后提醒
                            <ChevronDown size={14} className="text-slate-400" />
                          </div>
                        </div>
                      <button
                        type="button"
                        onClick={() => onDismissEvent(event.id)}
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700 ${
                          selected ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                        }`}
                        aria-label={`清除 ${event.title || '该提醒'}`}
                        title="清除此提醒"
                      >
                        <X size={15} />
                      </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3">
          <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-500">
            <span className="truncate">总是太早或太晚提醒？</span>
            <button
              type="button"
              onClick={onOpenSettings}
              className="shrink-0 font-bold text-[#0A59F7] transition hover:text-[#084DDB]"
            >
              提醒设置
            </button>
          </div>
          <button
            type="button"
            disabled={reminderEvents.length === 0}
            onClick={requestDismissAllEvents}
            className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400"
          >
            全部清除
          </button>
        </div>

        {dismissAllConfirmOpen && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/20 px-5" role="dialog" aria-modal="true" aria-label="确认全部清除提醒">
            <div className="w-[360px] max-w-full rounded-xl border border-slate-200 bg-white p-5 shadow-[0_18px_46px_rgba(15,23,42,0.22)]">
              <div className="text-base font-black text-slate-900">清除全部提醒？</div>
              <div className="mt-2 text-sm font-medium leading-6 text-slate-500">当前提醒会全部关闭，本次不会再显示。</div>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600">
                <input
                  type="checkbox"
                  checked={skipDismissAllNextTime}
                  onChange={(event) => setSkipDismissAllNextTime(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#0A59F7] focus:ring-[#0A59F7]"
                />
                下次不再提示
              </label>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDismissAllConfirmOpen(false)}
                  className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={confirmDismissAllEvents}
                  className="inline-flex h-9 items-center rounded-lg bg-[#0A59F7] px-3 text-sm font-bold text-white transition hover:bg-[#084DDB]"
                >
                  全部清除
                </button>
              </div>
            </div>
          </div>
        )}
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
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="text-lg font-black text-gray-900">快捷键</div>
            <div className="mt-1 text-sm font-semibold text-gray-500">用于快速处理日历、邮件和弹窗。</div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100" aria-label="关闭快捷键说明">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2">
          {groups.map((group, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              {group.map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between gap-3 border-b border-slate-200 py-2 last:border-b-0">
                  <span className="text-sm font-semibold text-slate-600">{desc}</span>
                  <kbd className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-black text-slate-700">{key}</kbd>
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
  const [activeProduct, setActiveProduct] = useState('mail');
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
  const [mailSidebarCollapsed, setMailSidebarCollapsed] = useState(false);
  const [mailSidebarNarrowExpanded, setMailSidebarNarrowExpanded] = useState(false);
  const [initialMailLayout] = useState(() => loadMailLayoutPreferences());
  const [viewportWidth, setViewportWidth] = useState(() => getViewportWidth());
  const [calendarSidebarWidth, setCalendarSidebarWidth] = useState(() => getDefaultCalendarSidebarWidth());
  const [mailSidebarWidth, setMailSidebarWidth] = useState(() => initialMailLayout.sidebarWidth);
  const [mailListWidth, setMailListWidth] = useState(() => initialMailLayout.listWidth);
  const [mailLayoutMode, setMailLayoutMode] = useState(() => initialMailLayout.layoutMode);
  const [activeLayoutResize, setActiveLayoutResize] = useState(null);
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
  const [settingsCenterOpen, setSettingsCenterOpen] = useState(false);
  const [calendarReminderSettings, setCalendarReminderSettings] = useState(loadCalendarReminderSettings);
  const [skipReminderDismissAllConfirm, setSkipReminderDismissAllConfirm] = useState(loadReminderDismissAllSkipConfirm);
  const [joinedReminderEventIds, setJoinedReminderEventIds] = useState([]);
  const [dismissedReminderEventIds, setDismissedReminderEventIds] = useState([]);
  const [snoozedReminderUntilById, setSnoozedReminderUntilById] = useState({});
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);
  const [calendarRenameDialog, setCalendarRenameDialog] = useState({ open: false, targetId: null, name: '' });
  const [calendarDeleteConfirm, setCalendarDeleteConfirm] = useState({ open: false, targetId: null });
  const [calendarSyncReport, setCalendarSyncReport] = useState(null);
  const [splitAccountIds, setSplitAccountIds] = useState(
    MOCK_ACCOUNTS.filter((account) => account.checked)
      .slice(0, MAX_SPLIT_ACCOUNTS)
      .map((account) => account.id),
  );
  const [mailFolder, setMailFolder] = useState('inbox');
  const [selectedMailAccountId, setSelectedMailAccountId] = useState(MOCK_MAILS[0]?.accountId || MOCK_ACCOUNTS[0]?.id || 'acc1');
  const [mailListFilter, setMailListFilter] = useState('all');
  const [mailSortOrder, setMailSortOrder] = useState('newest');
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
  const layoutResizeRef = useRef(null);
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
  const mailResponsiveSidebarCollapsed = viewportWidth < MAIL_SIDEBAR_AUTO_COLLAPSE_WIDTH && !mailSidebarNarrowExpanded;
  const effectiveMailSidebarCollapsed = mailSidebarCollapsed || mailResponsiveSidebarCollapsed;
  const mailLayoutSidebarWidth = effectiveMailSidebarCollapsed ? APP_COLLAPSED_SIDEBAR_WIDTH : mailSidebarWidth;
  const calendarSidebarBounds = getCalendarSidebarBounds(viewportWidth);
  const mailSidebarBounds = { min: APP_SIDEBAR_MIN_WIDTH, max: APP_SIDEBAR_MAX_WIDTH };
  const mailListBounds = getMailListBounds(viewportWidth, mailLayoutSidebarWidth, mailLayoutMode);
  const currentUserIdentities = useMemo(() => buildCurrentUserIdentitySet(accounts), [accounts]);
  const normalizedCalendarSearch = calendarSearchQuery.trim().toLowerCase();
  const calendarSearchAccountOptions = useMemo(() => activeAccounts.map((account) => ({ ...account, label: account.email || account.name })), [activeAccounts]);
  useEffect(() => {
    try {
      window.localStorage.setItem(CALENDAR_REMINDER_SETTINGS_STORAGE_KEY, JSON.stringify(calendarReminderSettings));
    } catch {
      // Ignore private browsing or storage quota failures; in-memory settings still work.
    }
  }, [calendarReminderSettings]);

  useEffect(() => {
    try {
      window.localStorage.setItem(REMINDER_DISMISS_ALL_SKIP_CONFIRM_STORAGE_KEY, String(skipReminderDismissAllConfirm));
    } catch {
      // Ignore storage failures; the current session state still applies.
    }
  }, [skipReminderDismissAllConfirm]);

  const saveMailLayoutPreference = ({ layoutMode = mailLayoutMode, sidebarWidth = mailSidebarWidth, listWidth = mailListWidth, readerWidth = null } = {}) => {
    persistMailLayoutPreference({ layoutMode, sidebarWidth, listWidth, readerWidth, isACollapsed: mailSidebarCollapsed });
  };

  const applyMailSidebarResize = (nextWidth, viewportWidth, { layoutMode = mailLayoutMode, wasCollapsed = effectiveMailSidebarCollapsed } = {}) => {
    if (wasCollapsed && nextWidth < MAIL_SIDEBAR_DRAG_EXPAND_THRESHOLD) {
      return {
        collapsed: true,
        sidebarWidth: mailSidebarWidth,
        layoutSidebarWidth: APP_COLLAPSED_SIDEBAR_WIDTH,
      };
    }

    if (!wasCollapsed && nextWidth < MAIL_SIDEBAR_DRAG_COLLAPSE_THRESHOLD) {
      const collapsedListBounds = getMailListBounds(viewportWidth, APP_COLLAPSED_SIDEBAR_WIDTH, layoutMode);
      setMailSidebarCollapsed(true);
      setMailSidebarNarrowExpanded(false);
      setMailListWidth((width) => clampNumber(width, collapsedListBounds.min, collapsedListBounds.max));
      return {
        collapsed: true,
        sidebarWidth: mailSidebarWidth,
        layoutSidebarWidth: APP_COLLAPSED_SIDEBAR_WIDTH,
      };
    }

    const nextSidebarWidth = clampNumber(nextWidth, APP_SIDEBAR_MIN_WIDTH, APP_SIDEBAR_MAX_WIDTH);
    const nextListBounds = getMailListBounds(viewportWidth, nextSidebarWidth, layoutMode);
    setMailSidebarCollapsed(false);
    setMailSidebarNarrowExpanded(viewportWidth < MAIL_SIDEBAR_AUTO_COLLAPSE_WIDTH);
    setMailSidebarWidth(nextSidebarWidth);
    setMailListWidth((width) => clampNumber(width, nextListBounds.min, nextListBounds.max));
    return {
      collapsed: false,
      sidebarWidth: nextSidebarWidth,
      layoutSidebarWidth: nextSidebarWidth,
    };
  };

  const applyMailReaderResize = (nextWidth, viewportWidth, sidebarWidth, currentLayoutMode = mailLayoutMode) => {
    const nextLayoutMode = resolveMailReaderDragMode(nextWidth, currentLayoutMode, viewportWidth, sidebarWidth);

    if (nextLayoutMode === MAIL_LAYOUT_MODE_AB) {
      const abBounds = getMailListBounds(viewportWidth, sidebarWidth, MAIL_LAYOUT_MODE_AB);
      setMailLayoutMode(MAIL_LAYOUT_MODE_AB);
      setMailListWidth(abBounds.max);
      return {
        layoutMode: MAIL_LAYOUT_MODE_AB,
        listWidth: abBounds.max,
        readerWidth: 0,
      };
    }

    const abcBounds = getMailListBounds(viewportWidth, sidebarWidth, MAIL_LAYOUT_MODE_ABC);
    const nextListWidth = clampNumber(nextWidth, abcBounds.min, abcBounds.max);
    setMailLayoutMode(MAIL_LAYOUT_MODE_ABC);
    setMailListWidth(nextListWidth);
    return {
      layoutMode: MAIL_LAYOUT_MODE_ABC,
      listWidth: nextListWidth,
      readerWidth: getMailReaderWidth(viewportWidth, sidebarWidth, nextListWidth),
    };
  };

  const setLayoutWidth = (type, nextWidth, viewportWidth = getViewportWidth()) => {
    if (type === 'calendar-a') {
      const bounds = getCalendarSidebarBounds(viewportWidth);
      setCalendarSidebarWidth(clampNumber(nextWidth, bounds.min, bounds.max));
      return;
    }

    if (type === 'mail-a') {
      applyMailSidebarResize(nextWidth, viewportWidth);
      return;
    }

    if (type === 'mail-b') {
      applyMailReaderResize(nextWidth, viewportWidth, mailLayoutSidebarWidth, mailLayoutMode);
    }
  };

  const getLayoutWidth = (type) => {
    if (type === 'calendar-a') return calendarSidebarWidth;
    if (type === 'mail-a') return mailLayoutSidebarWidth;
    return mailListWidth;
  };

  const startLayoutResize = (type, event) => {
    event.preventDefault();
    event.stopPropagation();
    layoutResizeRef.current = {
      type,
      startX: event.clientX,
      lastClientX: event.clientX,
      startWidth: getLayoutWidth(type),
      viewportWidth: getViewportWidth(),
      sidebarWidth: mailLayoutSidebarWidth,
      preferredSidebarWidth: mailSidebarWidth,
      listWidth: mailListWidth,
      layoutMode: mailLayoutMode,
      mailSidebarCollapsed: effectiveMailSidebarCollapsed,
    };
    setActiveLayoutResize(type);
    document.documentElement.style.cursor = 'col-resize';
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const stepLayoutResize = (type, delta) => {
    const viewportWidth = getViewportWidth();
    const nextWidth =
      type === 'mail-a' && effectiveMailSidebarCollapsed && delta > 0 ? APP_SIDEBAR_MIN_WIDTH : getLayoutWidth(type) + delta;

    if (type === 'calendar-a') {
      setLayoutWidth(type, nextWidth, viewportWidth);
      return;
    }

    if (type === 'mail-a') {
      const result = applyMailSidebarResize(nextWidth, viewportWidth);
      const nextListBounds = getMailListBounds(viewportWidth, result.layoutSidebarWidth, mailLayoutMode);
      const nextListWidth = clampNumber(mailListWidth, nextListBounds.min, nextListBounds.max);
      persistMailLayoutPreference(
        {
          layoutMode: mailLayoutMode,
          sidebarWidth: result.sidebarWidth,
          listWidth: nextListWidth,
          readerWidth: getMailReaderWidth(viewportWidth, result.layoutSidebarWidth, nextListWidth),
          isACollapsed: result.collapsed,
        },
        viewportWidth,
      );
      return;
    }

    if (type === 'mail-b') {
      const result = applyMailReaderResize(nextWidth, viewportWidth, mailLayoutSidebarWidth, mailLayoutMode);
      persistMailLayoutPreference(
        {
          layoutMode: result.layoutMode,
          sidebarWidth: mailSidebarWidth,
          listWidth: result.listWidth,
          readerWidth: result.readerWidth,
          isACollapsed: mailSidebarCollapsed,
        },
        viewportWidth,
      );
    }
  };

  useLayoutEffect(() => {
    const clampLayoutWidths = () => {
      const nextViewportWidth = getViewportWidth();
      const nextCalendarBounds = getCalendarSidebarBounds(nextViewportWidth);
      const nextNarrowExpanded = nextViewportWidth < MAIL_SIDEBAR_AUTO_COLLAPSE_WIDTH && mailSidebarNarrowExpanded;
      const nextResponsiveMailCollapsed = nextViewportWidth < MAIL_SIDEBAR_AUTO_COLLAPSE_WIDTH && !nextNarrowExpanded;

      setViewportWidth(nextViewportWidth);
      if (nextViewportWidth >= MAIL_SIDEBAR_AUTO_COLLAPSE_WIDTH && mailSidebarNarrowExpanded) {
        setMailSidebarNarrowExpanded(false);
      }
      setCalendarSidebarWidth((width) => clampNumber(width, nextCalendarBounds.min, nextCalendarBounds.max));
      setMailSidebarWidth((width) => {
        const nextSidebarWidth = clampNumber(width, APP_SIDEBAR_MIN_WIDTH, APP_SIDEBAR_MAX_WIDTH);
        const nextLayoutMode = nextViewportWidth < MAIL_LAYOUT_AB_WIDTH || nextNarrowExpanded ? MAIL_LAYOUT_MODE_AB : mailLayoutMode;
        const nextLayoutSidebarWidth = nextResponsiveMailCollapsed ? APP_COLLAPSED_SIDEBAR_WIDTH : nextSidebarWidth;
        const nextMailListBounds = getMailListBounds(nextViewportWidth, nextLayoutSidebarWidth, nextLayoutMode);
        setMailLayoutMode(nextLayoutMode);
        setMailListWidth((listWidth) => clampNumber(listWidth, nextMailListBounds.min, nextMailListBounds.max));
        return nextSidebarWidth;
      });
    };

    clampLayoutWidths();
    window.addEventListener('resize', clampLayoutWidths);
    return () => window.removeEventListener('resize', clampLayoutWidths);
  }, [mailLayoutMode, mailSidebarNarrowExpanded]);

  useEffect(() => {
    const clearLayoutResize = () => {
      layoutResizeRef.current = null;
      setActiveLayoutResize(null);
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    const handleMouseMove = (event) => {
      const active = layoutResizeRef.current;
      if (!active) return;

      event.preventDefault();
      active.lastClientX = event.clientX;
      const nextWidth = active.startWidth + event.clientX - active.startX;

      if (active.type === 'calendar-a') {
        const bounds = getCalendarSidebarBounds(active.viewportWidth);
        setCalendarSidebarWidth(clampNumber(nextWidth, bounds.min, bounds.max));
      }

      if (active.type === 'mail-a') {
        const result = applyMailSidebarResize(nextWidth, active.viewportWidth, {
          layoutMode: active.layoutMode,
          wasCollapsed: active.mailSidebarCollapsed,
        });
        active.mailSidebarCollapsed = result.collapsed;
        active.sidebarWidth = result.layoutSidebarWidth;
      }

      if (active.type === 'mail-b') {
        const result = applyMailReaderResize(nextWidth, active.viewportWidth, active.sidebarWidth, active.layoutMode);
        active.layoutMode = result.layoutMode;
      }
    };

    const handleMouseUp = () => {
      const active = layoutResizeRef.current;
      if (!active) return;

      const finalWidth = active.startWidth + (active.lastClientX ?? active.startX) - active.startX;
      if (active.type === 'mail-a') {
        const result = applyMailSidebarResize(finalWidth, active.viewportWidth, {
          layoutMode: active.layoutMode,
          wasCollapsed: active.mailSidebarCollapsed,
        });
        const nextListBounds = getMailListBounds(active.viewportWidth, result.layoutSidebarWidth, active.layoutMode);
        const nextListWidth = clampNumber(active.listWidth, nextListBounds.min, nextListBounds.max);
        setMailListWidth(nextListWidth);
        persistMailLayoutPreference({
          layoutMode: active.layoutMode,
          sidebarWidth: result.sidebarWidth,
          listWidth: nextListWidth,
          readerWidth: getMailReaderWidth(active.viewportWidth, result.layoutSidebarWidth, nextListWidth),
          isACollapsed: result.collapsed,
        }, active.viewportWidth);
      }

      if (active.type === 'mail-b') {
        const result = applyMailReaderResize(finalWidth, active.viewportWidth, active.sidebarWidth, active.layoutMode);
        persistMailLayoutPreference({
          layoutMode: result.layoutMode,
          sidebarWidth: active.sidebarWidth,
          listWidth: result.listWidth,
          readerWidth: result.readerWidth,
          isACollapsed: mailSidebarCollapsed,
        }, active.viewportWidth);
      }

      clearLayoutResize();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (layoutResizeRef.current) clearLayoutResize();
    };
  }, [mailSidebarCollapsed]);

  const restoreMailReader = () => {
    const viewportWidth = getViewportWidth();
    const bounds = getMailListBounds(viewportWidth, mailLayoutSidebarWidth, MAIL_LAYOUT_MODE_ABC);
    const preferredListWidth = clampNumber(viewportWidth - mailLayoutSidebarWidth - MAIL_READER_DEFAULT_WIDTH, bounds.min, bounds.max);
    const readerWidth = getMailReaderWidth(viewportWidth, mailLayoutSidebarWidth, preferredListWidth);

    setMailLayoutMode(MAIL_LAYOUT_MODE_ABC);
    setMailListWidth(preferredListWidth);
    saveMailLayoutPreference({
      layoutMode: MAIL_LAYOUT_MODE_ABC,
      sidebarWidth: mailSidebarWidth,
      listWidth: preferredListWidth,
      readerWidth,
    });
  };

  const handleToggleMailSidebarCollapsed = () => {
    const nextViewportWidth = getViewportWidth();
    const isNarrowDesktop = nextViewportWidth < MAIL_SIDEBAR_AUTO_COLLAPSE_WIDTH;

    if (isNarrowDesktop && effectiveMailSidebarCollapsed && !mailSidebarCollapsed) {
      const nextSidebarWidth = clampNumber(mailSidebarWidth, APP_SIDEBAR_MIN_WIDTH, APP_SIDEBAR_MAX_WIDTH);
      const nextListBounds = getMailListBounds(nextViewportWidth, nextSidebarWidth, MAIL_LAYOUT_MODE_AB);
      const nextListWidth = nextListBounds.max;

      setMailSidebarNarrowExpanded(true);
      setMailSidebarCollapsed(false);
      setMailLayoutMode(MAIL_LAYOUT_MODE_AB);
      setMailListWidth(nextListWidth);
      persistMailLayoutPreference(
        {
          layoutMode: MAIL_LAYOUT_MODE_AB,
          sidebarWidth: nextSidebarWidth,
          listWidth: nextListWidth,
          readerWidth: 0,
          isACollapsed: false,
        },
        nextViewportWidth,
      );
      return;
    }

    if (isNarrowDesktop && !effectiveMailSidebarCollapsed) {
      const nextLayoutMode = nextViewportWidth < MAIL_LAYOUT_AB_WIDTH ? MAIL_LAYOUT_MODE_AB : MAIL_LAYOUT_MODE_ABC;
      const nextListBounds = getMailListBounds(nextViewportWidth, APP_COLLAPSED_SIDEBAR_WIDTH, nextLayoutMode);
      const nextListWidth =
        nextLayoutMode === MAIL_LAYOUT_MODE_AB ? nextListBounds.max : clampNumber(mailListWidth, nextListBounds.min, nextListBounds.max);

      setMailSidebarNarrowExpanded(false);
      setMailSidebarCollapsed(false);
      setMailLayoutMode(nextLayoutMode);
      setMailListWidth(nextListWidth);
      persistMailLayoutPreference(
        {
          layoutMode: nextLayoutMode,
          sidebarWidth: mailSidebarWidth,
          listWidth: nextListWidth,
          readerWidth: nextLayoutMode === MAIL_LAYOUT_MODE_AB ? 0 : getMailReaderWidth(nextViewportWidth, APP_COLLAPSED_SIDEBAR_WIDTH, nextListWidth),
          isACollapsed: true,
        },
        nextViewportWidth,
      );
      return;
    }

    const nextCollapsed = !mailSidebarCollapsed;
    const nextLayoutSidebarWidth = nextCollapsed ? APP_COLLAPSED_SIDEBAR_WIDTH : mailSidebarWidth;
    const nextListBounds = getMailListBounds(nextViewportWidth, nextLayoutSidebarWidth, mailLayoutMode);
    const nextListWidth = clampNumber(mailListWidth, nextListBounds.min, nextListBounds.max);

    setMailSidebarNarrowExpanded(false);
    setMailSidebarCollapsed(nextCollapsed);
    setMailListWidth(nextListWidth);
    persistMailLayoutPreference(
      {
        layoutMode: mailLayoutMode,
        sidebarWidth: mailSidebarWidth,
        listWidth: nextListWidth,
        readerWidth: getMailReaderWidth(nextViewportWidth, nextLayoutSidebarWidth, nextListWidth),
        isACollapsed: nextCollapsed,
      },
      nextViewportWidth,
    );
  };

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
          const matchesFolder = mailMatchesFolder(mail, mailFolder);
          const signals = getMailSmartSignals(mail);
          const matchesListFilter =
            mailListFilter === 'all' ||
            (mailListFilter === 'unread' && mail.unread) ||
            (mailListFilter === 'flagged' && mail.starred) ||
            (mailListFilter === 'attachment' && mail.attachments.length > 0) ||
            (mailListFilter === 'important' && signals.important);
          const matchesAccount = mail.accountId === selectedMailAccountId;

          return matchesFolder && matchesListFilter && matchesAccount;
        })
        .sort((left, right) => (mailSortOrder === 'oldest' ? left.timestamp - right.timestamp : right.timestamp - left.timestamp)),
    [mailFolder, mailListFilter, mailSortOrder, mails, selectedMailAccountId],
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
  const selectedEventMeetingLabel =
    selectedEvent && selectedEvent.meetingProvider && selectedEvent.meetingProvider !== 'none'
      ? MEETING_PROVIDER_LABELS[selectedEvent.meetingProvider] || '在线会议'
      : '';
  const selectedEventColorCategories = selectedEvent ? getEventColorCategories(selectedEvent, colorCategoryLabels) : [];
  const selectedEventStartDate = selectedEvent ? new Date(getEventStartTimestamp(selectedEvent)) : null;
  const selectedEventEndDate = selectedEvent ? new Date(getEventEndTimestamp(selectedEvent)) : null;
  const selectedEventSentDate = selectedEvent
    ? new Date(selectedEvent.sentAt || selectedEvent.sentTime || selectedEvent.updatedAt || selectedEvent.createdAt || getEventStartTimestamp(selectedEvent) - DAY_MS)
    : null;
  const formatDetailDateTime = (date) => (date ? `${formatDateLabel(date)} ${formatClockStamp(date).slice(0, 5)}` : '未记录');
  const selectedEventOrganizerLabel = selectedEvent?.organizer || selectedEventAccountInfo?.name || '我';
  const selectedEventMethodLabel = selectedEvent
    ? selectedEvent.meetingProvider && selectedEvent.meetingProvider !== 'none'
      ? selectedEvent.meetingProvider === 'phone'
        ? '电话会议'
        : `线上会议 · ${selectedEventMeetingLabel}`
      : selectedEvent.location
        ? '线下会议'
        : '待定'
    : '';
  const selectedEventRuleLabel = selectedEvent
    ? [
        selectedEvent.repeat && selectedEvent.repeat !== 'does_not_repeat' ? `循环：${REPEAT_LABELS[selectedEvent.repeat]}` : '不循环',
        getEffectiveEventReminder(selectedEvent, calendarReminderSettings, currentUserIdentities) !== 'none'
          ? `提醒：${REMINDER_LABELS[getEffectiveEventReminder(selectedEvent, calendarReminderSettings, currentUserIdentities)]}`
          : '不提醒',
      ].join(' · ')
    : '';
  const selectedEventParticipants = selectedEvent
    ? Array.from(new Set([...(selectedEvent.attendees || [])].filter(Boolean))).filter(
        (person) => normalizeParticipantIdentity(person) !== normalizeParticipantIdentity(selectedEventOrganizerLabel),
      )
    : [];
  const selectedEventOptionalParticipants = selectedEvent
    ? Array.from(new Set([...(selectedEvent.optionalAttendees || [])].filter(Boolean))).filter(
        (person) =>
          normalizeParticipantIdentity(person) !== normalizeParticipantIdentity(selectedEventOrganizerLabel) &&
          !selectedEventParticipants.some((participant) => normalizeParticipantIdentity(participant) === normalizeParticipantIdentity(person)),
      )
    : [];
  const draftAccountInfo = accountMap[calendarMap[draftForm.calId]?.accountId] || null;
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
    const nowValue = TODAY_DATE.getTime();
    const joinedIds = new Set(joinedReminderEventIds);
    const dismissedIds = new Set(dismissedReminderEventIds);
    const visible = events
      .filter((event) => {
        if (!calendarReminderSettings.popupEnabled) return false;
        if (!activeCalIds.includes(event.calId)) return false;
        if (event.status === '已取消' || event.type === 'cancelled') return false;
        const effectiveReminder = getEffectiveEventReminder(event, calendarReminderSettings, currentUserIdentities);
        if (effectiveReminder === 'none') return false;
        if (joinedIds.has(event.id) || dismissedIds.has(event.id)) return false;
        if ((snoozedReminderUntilById[event.id] || 0) > nowValue) return false;

        const offsetMinutes = getReminderOffsetMinutes(effectiveReminder);
        if (offsetMinutes === null) return false;

        const startTime = getEventStartTimestamp(event);
        const endTime = getEventEndTimestamp(event);
        const triggerTime = startTime - offsetMinutes * 60 * 1000;

        return nowValue <= endTime && nowValue >= triggerTime;
      })
      .map((event) => {
        const startTime = getEventStartTimestamp(event);
        const endTime = getEventEndTimestamp(event);
        return { ...event, reminderStartTime: startTime, reminderEndTime: endTime };
      })
      .sort((left, right) => left.reminderStartTime - right.reminderStartTime);

    const activeItems = [...visible].sort((left, right) => {
      const leftTime = left.reminderSortTime ?? left.reminderStartTime ?? 0;
      const rightTime = right.reminderSortTime ?? right.reminderStartTime ?? 0;
      return leftTime - rightTime;
    });

    return {
      active: activeItems.slice(0, 8),
    };
  }, [
    activeCalIds,
    calendarReminderSettings.incomingReminderPolicy,
    calendarReminderSettings.popupEnabled,
    currentUserIdentities,
    dismissedReminderEventIds,
    events,
    joinedReminderEventIds,
    snoozedReminderUntilById,
  ]);
  const editableCalendars = useMemo(() => calendars.filter((calendar) => canEditCalendarContent(calendar)), [calendars]);
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
      color: 'bg-[#0A59F7]',
    });
  };

  const updateCalendarReminderSettings = (patch) => {
    setCalendarReminderSettings((prev) => ({ ...prev, ...patch }));
  };

  const handleOpenReminders = () => {
    if (!calendarReminderSettings.popupEnabled) {
      triggerFeedback('L3', {
        msg: '日历提醒弹窗已关闭',
        icon: <Bell size={16} />,
        color: 'bg-slate-900',
      });
      return;
    }
    setReminderDialogOpen(true);
    setContextMenu(null);
  };

  const markReminderJoined = (eventId) => {
    setJoinedReminderEventIds((prev) => (prev.includes(eventId) ? prev : [...prev, eventId]));
    setDismissedReminderEventIds((prev) => prev.filter((id) => id !== eventId));
    setSnoozedReminderUntilById((prev) => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
  };

  const handleJoinReminderEvent = (event) => {
    if (!event?.id || !event.meetingLink) return;
    markReminderJoined(event.id);
    if (reminderEvents.active.length <= 1) {
      setReminderDialogOpen(false);
    }
    openExternalLink(event.meetingLink, '已打开会议链接');
  };

  const handleSnoozeReminderEvent = (event, snoozeValue) => {
    const option = resolveSnoozeOption(event, snoozeValue, TODAY_DATE.getTime());
    if (!event?.id || !option) return;

    setSnoozedReminderUntilById((prev) => ({
      ...prev,
      [event.id]: option.until,
    }));
    if (reminderEvents.active.length <= 1) {
      setReminderDialogOpen(false);
    }
    triggerFeedback('L3', {
      msg: `${option.label}重新提醒`,
      icon: <Bell size={16} />,
      color: 'bg-[#0A59F7]',
    });
  };

  const handleDismissReminderEvent = (eventId) => {
    setDismissedReminderEventIds((prev) => (prev.includes(eventId) ? prev : [...prev, eventId]));
    setSnoozedReminderUntilById((prev) => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
    if (reminderEvents.active.length <= 1) {
      setReminderDialogOpen(false);
    }
  };

  const handleOpenReminderNotification = (notification) => {
    if (!notification) return;
    if (notification.action === 'shared_access' && notification.accountId) {
      openSharedCalendarAccess(notification.accountId);
      return;
    }
    if (notification.action === 'event_details' && notification.eventId) {
      navTo('details', notification.eventId);
      return;
    }
    triggerFeedback('L3', {
      msg: notification.feedback || notification.title || '已查看通知',
      icon: <Bell size={16} />,
      color: 'bg-slate-900',
    });
  };

  const handleDismissAllReminderEvents = () => {
    const activeIds = reminderEvents.active.map((event) => event.id);
    if (activeIds.length === 0) return;

    setDismissedReminderEventIds((prev) => Array.from(new Set([...prev, ...activeIds])));
    setSnoozedReminderUntilById((prev) => {
      const next = { ...prev };
      activeIds.forEach((id) => {
        delete next[id];
      });
      return next;
    });
    setReminderDialogOpen(false);
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

  /* ===== 日历颜色 ===== */
  const CALENDAR_COLORS = [
    'bg-[#0A59F7]', 'bg-cyan-500', 'bg-sky-500',
    'bg-emerald-500', 'bg-green-500', 'bg-teal-500',
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
    'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
    'bg-red-500', 'bg-rose-500', 'bg-pink-500',
    'bg-slate-500', 'bg-gray-500', 'bg-zinc-500',
  ];

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
    markReminderJoined(event.id);
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
    const fallbackAccountId = sourceMail?.accountId || selectedMailAccountId || activeAccountIds[0] || accounts[0]?.id || 'acc1';
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
    const bcc = parseRecipients(draft.bcc || '');
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
      bcc,
      preview: draft.body.trim().split('\n').find(Boolean) || '(无正文)',
      body: draft.body.trim(),
      attachments: draft.attachments,
      importance: draft.importance || 'normal',
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
    setSelectedMailAccountId(nextMail.accountId);
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
    const targetMail = mails.find((mail) => mail.id === mailId);
    if (targetMail) setSelectedMailAccountId(targetMail.accountId);
    setSelectedMailId(mailId);
  };

  const selectMailboxFolder = (folderId, accountId = selectedMailAccountId) => {
    setSelectedMailAccountId(accountId);
    setMailFolder(folderId);
    const nextMail = [...mails]
      .filter((mail) => {
        const matchesFolder = mailMatchesFolder(mail, folderId);
        const signals = getMailSmartSignals(mail);
        const matchesListFilter =
          mailListFilter === 'all' ||
          (mailListFilter === 'unread' && mail.unread) ||
          (mailListFilter === 'flagged' && mail.starred) ||
          (mailListFilter === 'attachment' && mail.attachments.length > 0) ||
          (mailListFilter === 'important' && signals.important);
        return mail.accountId === accountId && matchesFolder && matchesListFilter;
      })
      .sort((left, right) => (mailSortOrder === 'oldest' ? left.timestamp - right.timestamp : right.timestamp - left.timestamp))[0];
    setSelectedMailId(nextMail?.id || null);
  };

  const getNextFilteredMailId = (mailId) => {
    const currentIndex = filteredMails.findIndex((mail) => mail.id === mailId);
    const nextMail = filteredMails[currentIndex + 1] || filteredMails[currentIndex - 1] || filteredMails.find((mail) => mail.id !== mailId);
    return nextMail?.id || null;
  };

  const toggleMailStar = (mailId) => {
    const currentMail = mails.find((mail) => mail.id === mailId);
    const willStar = !currentMail?.starred;
    setMails((prev) => prev.map((mail) => (mail.id === mailId ? { ...mail, starred: willStar, hasFollowUp: willStar } : mail)));
    triggerFeedback('L3', {
      msg: willStar ? '已标记旗标' : '已取消旗标',
      icon: willStar ? <FlagFilled size={16} className="text-red-500" /> : <Flag size={16} />,
      color: 'bg-slate-900',
    });
  };

  const toggleMailRead = (mailId) => {
    const currentMail = mails.find((mail) => mail.id === mailId);
    const willUnread = !currentMail?.unread;
    setMails((prev) => prev.map((mail) => (mail.id === mailId ? { ...mail, unread: willUnread } : mail)));
    triggerFeedback('L3', {
      msg: willUnread ? '已标为未读' : '已标为已读',
      icon: <Mail size={16} />,
      color: 'bg-slate-900',
    });
  };

  const markMailReadAfterViewing = (mailId) => {
    setMails((prev) => prev.map((mail) => (mail.id === mailId ? { ...mail, unread: false } : mail)));
  };

  const archiveMail = (mailId) => {
    const previousMail = mails.find((mail) => mail.id === mailId);
    if (!previousMail) return;
    const nextMailId = getNextFilteredMailId(mailId);

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
    setSelectedMailId(nextMailId);
    triggerFeedback('L3', {
      msg: '邮件已存档',
      icon: <Archive size={16} />,
      color: 'bg-slate-900',
      actionText: '撤销',
      actionLabel: '撤销归档邮件',
      onAction: () => {
        setMails((prev) => prev.map((mail) => (mail.id === mailId ? previousMail : mail)));
        setSelectedMailId(mailId);
        setFeedback({ type: null, payload: null });
      },
    });
  };

  const deleteMail = (mailId) => {
    const previousMail = mails.find((mail) => mail.id === mailId);
    if (!previousMail) return;
    const nextMailId = getNextFilteredMailId(mailId);

    setMails((prev) =>
      prev.map((mail) =>
        mail.id === mailId
          ? {
              ...mail,
              folder: 'deleted',
              unread: false,
            }
          : mail,
      ),
    );
    setSelectedMailId(nextMailId);
    triggerFeedback('L3', {
      msg: '邮件已删除',
      icon: <Trash size={16} />,
      color: 'bg-slate-900',
      actionText: '撤销',
      actionLabel: '撤销删除邮件',
      onAction: () => {
        setMails((prev) => prev.map((mail) => (mail.id === mailId ? previousMail : mail)));
        setSelectedMailId(mailId);
        setFeedback({ type: null, payload: null });
      },
    });
  };

  const moveMail = (mailId) => {
    const previousMail = mails.find((mail) => mail.id === mailId);
    if (!previousMail) return;
    const nextMailId = getNextFilteredMailId(mailId);

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
    setSelectedMailId(nextMailId);
    triggerFeedback('L3', {
      msg: '邮件已移动到归档',
      icon: <Archive size={16} />,
      color: 'bg-slate-900',
      actionText: '撤销',
      actionLabel: '撤销移动邮件',
      onAction: () => {
        setMails((prev) => prev.map((mail) => (mail.id === mailId ? previousMail : mail)));
        setSelectedMailId(mailId);
        setFeedback({ type: null, payload: null });
      },
    });
  };

  const exportMailBatch = (mailIds) => {
    triggerFeedback('L3', {
      msg: `已准备导出 ${mailIds.length} 封邮件`,
      icon: <Save size={16} />,
      color: 'bg-slate-900',
    });
  };

  const createTaskFromMail = (mailId) => {
    const mail = mails.find((item) => item.id === mailId);
    triggerFeedback('L3', {
      msg: mail ? `已从「${mail.subject}」创建跟进任务` : '已创建跟进任务',
      icon: <SquareCheck size={16} />,
      color: 'bg-slate-900',
    });
  };

  const retryMailReader = () => {
    triggerFeedback('L3', {
      msg: '已重新加载邮件内容',
      icon: <RefreshCw size={16} />,
      color: 'bg-slate-900',
    });
  };

  const previewMailAttachment = (_mailId, attachment) => {
    triggerFeedback('L3', {
      msg: attachment.canPreview ? `正在预览 ${attachment.name}` : '该附件暂不支持预览',
      icon: <FileText size={16} />,
      color: attachment.canPreview ? 'bg-slate-900' : 'bg-amber-600',
    });
  };

  const downloadMailAttachment = (_mailId, attachment) => {
    const blocked = attachment.status === 'scanning' || attachment.status === 'blocked' || attachment.status === 'unavailable' || !attachment.canDownload;
    triggerFeedback('L3', {
      msg: blocked ? '附件当前不可下载' : `附件下载中：${attachment.name}`,
      icon: <Paperclip size={16} />,
      color: blocked ? 'bg-red-600' : 'bg-slate-900',
    });
  };

  const sendQuickReply = (_mailId, body) => {
    triggerFeedback('L3', {
      msg: body ? '快捷回复已发送' : '回复内容为空',
      icon: <Reply size={16} />,
      color: body ? 'bg-emerald-600' : 'bg-amber-600',
    });
  };

  const runReaderSecurityAction = (_mailId, action) => {
    const messageMap = {
      details: '已打开风险详情',
      report: '已举报邮件',
      showImages: '已显示外部图片',
      trustSender: '已信任该发件人',
    };
    triggerFeedback('L3', {
      msg: messageMap[action] || '已处理安全操作',
      icon: <AlertCircle size={16} />,
      color: action === 'report' ? 'bg-red-600' : 'bg-slate-900',
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
      reminder: calendarReminderSettings.newEventDefaultReminder,
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
    setActiveProduct('calendar');
    setCurrentScreen('create');
    setFocusDate(stripTime(nextDraft.date));
    triggerFeedback('L3', {
      msg: '已从邮件生成日程草稿',
      icon: <Calendar size={16} />,
      color: 'bg-[#0A59F7]',
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
      color: 'bg-[#0A59F7]',
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
        color: 'bg-[#0A59F7]',
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
      color: 'bg-[#0A59F7]',
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
      color: 'bg-[#0A59F7]',
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

    setDraftForm(editingEvent ? nextDraft : { ...nextDraft, reminder: calendarReminderSettings.newEventDefaultReminder });
    setCreateDraft({
      isDirty: false,
      saveStatus: 'idle',
      mode: editingEvent ? 'edit' : 'create',
      eventId: editingEvent?.id ?? null,
    });
    setCreateDraftPanels(INITIAL_CREATE_DRAFT_PANELS);
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
    if (productId === 'settings') {
      setSettingsCenterOpen(true);
      setContextMenu(null);
      closeAccountMenu();
      setHoverPreview(null);
      return;
    }

    const proceed = () => {
      setActiveProduct(productId);
      setContextMenu(null);
      closeAccountMenu();
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
      color: 'bg-[#0A59F7]',
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

  const removeAttendee = (name, listKey = 'attendees') => {
    setDraftForm((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] || []).filter((person) => person !== name),
    }));
    markDraftDirty();
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
    const nextReminder = normalizedDraft.reminder || calendarReminderSettings.newEventDefaultReminder;
    const previousEvent = normalizedDraft.eventId ? selectedEvent : null;
    const previousIsIncoming = previousEvent ? isIncomingReminderEvent(previousEvent, currentUserIdentities) : false;
    const previousOrganizerReminder = previousEvent ? getOrganizerReminder(previousEvent) : nextReminder;
    const nextReminderOverride = previousIsIncoming ? Boolean(previousEvent?.reminderOverride) || nextReminder !== previousOrganizerReminder : false;
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
      reminder: nextReminder,
      organizerReminder: previousIsIncoming ? previousOrganizerReminder : nextReminder,
      reminderOverride: nextReminderOverride,
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
  const createDraftInviteeCount = draftForm.attendees.length + (draftForm.optionalAttendees || []).length;
  const createDraftLargeAudience = createDraftInviteeCount >= 20;
  const createDraftMassAudience = createDraftInviteeCount >= 80;
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
          color: 'bg-[#0A59F7]',
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
          width={calendarSidebarWidth}
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
	          selectedMailAccountId={selectedMailAccountId}
	          collapsed={effectiveMailSidebarCollapsed}
	          width={mailSidebarWidth}
		          onToggleCollapsed={handleToggleMailSidebarCollapsed}
	          onSelectFolder={selectMailboxFolder}
          onCompose={openMailComposer}
          activeProduct={activeProduct}
          onSelectProduct={handleProductSelect}
        />
      ) : (
        <UtilitySidebar activeProduct={activeProduct} onSelectProduct={handleProductSelect} />
      )}

      {activeProduct === 'calendar' && !calendarSidebarCollapsed && (
        <LayoutResizeHandle
          id="calendar-a"
          label="调整日历 A 栏宽度"
          value={calendarSidebarWidth}
          min={calendarSidebarBounds.min}
          max={calendarSidebarBounds.max}
          active={activeLayoutResize === 'calendar-a'}
          onStart={(event) => startLayoutResize('calendar-a', event)}
          onStep={(delta) => stepLayoutResize('calendar-a', delta)}
        />
      )}

	      {activeProduct === 'mail' && (!effectiveMailSidebarCollapsed || mailSidebarCollapsed) && (
	        <LayoutResizeHandle
          id="mail-a"
          label="调整邮箱 A 栏宽度"
          value={mailLayoutSidebarWidth}
          min={effectiveMailSidebarCollapsed ? APP_COLLAPSED_SIDEBAR_WIDTH : mailSidebarBounds.min}
          max={mailSidebarBounds.max}
          active={activeLayoutResize === 'mail-a'}
          onStart={(event) => startLayoutResize('mail-a', event)}
          onStep={(delta) => stepLayoutResize('mail-a', delta)}
        />
      )}

      <div className="relative z-10 flex flex-1 min-w-0 min-h-0 flex-col overflow-hidden bg-white">
        {activeProduct !== 'mail' && (
        <header className="relative flex min-h-16 shrink-0 flex-row items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6" style={{ zIndex: 40 }}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {activeProduct === 'calendar' ? (
              <div className="flex items-center gap-2 min-w-0 pr-1 whitespace-nowrap">
                {currentScreen === 'search' && (
                  <button
                    onClick={() => navTo('calendar')}
                    className="inline-flex h-10 shrink-0 items-center text-sm font-bold text-slate-700 transition hover:text-[#0A59F7]"
                  >
                    <ChevronLeft size={15} className="mr-1" />
                    返回日历
                  </button>
                )}
                {SHOW_CALENDAR_SEARCH_ENTRY && (
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
                )}
	                {currentScreen !== 'search' && (
	                  <>
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
        )}

        <div className="relative flex flex-1 min-w-0 min-h-0 overflow-hidden bg-white">
          {activeProduct === 'calendar' ? (
              <div className="relative flex flex-1 min-w-0 min-h-0 overflow-hidden bg-white">
                {(currentScreen === 'calendar' || currentScreen === 'create') && (
                  <div className="relative flex flex-1 min-w-0 min-h-0 flex-col bg-white">
                    <header className="relative flex shrink-0 flex-col gap-3 border-b border-slate-200 bg-white px-6 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between" style={{ zIndex: 10 }}>
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
	                        <button
	                          type="button"
	                          onClick={handleCalendarSync}
	                          aria-label="同步日历"
	                          title="同步日历"
	                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-800"
	                        >
	                          <RefreshCw size={18} />
	                        </button>
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
                      onJoinEvent={(event) => markReminderJoined(event.id)}
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
                            <div className="mx-auto w-full max-w-[980px]">
                              <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                  <h1 className={`text-2xl font-black leading-tight ${selectedEvent.status === '已取消' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                    {selectedEvent.title || '无标题'}
                                  </h1>
                                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-gray-500">
                                    <span>{formatDetailDateTime(selectedEventStartDate)}</span>
                                    {selectedEvent.status === '已取消' && <span className="text-red-600">会议已取消</span>}
                                  </div>
                                </div>
                                {selectedEvent.meetingLink && (
                                  <button
                                    onClick={() => {
                                      markReminderJoined(selectedEvent.id);
                                      openExternalLink(selectedEvent.meetingLink, '已打开会议链接');
                                    }}
                                    className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#0A59F7] px-4 text-sm font-bold text-white transition hover:bg-[#084DDB]"
                                  >
                                    <ArrowRight size={14} className="mr-2" />
                                    加入会议
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                                <div className="flex min-w-0 gap-3 border-b border-gray-100 py-3 text-sm">
                                  <Clock size={16} className="mt-0.5 shrink-0 text-[#0A59F7]" />
                                  <div className="grid min-w-0 flex-1 grid-cols-[64px_minmax(0,1fr)] gap-3">
                                    <div className="font-bold text-gray-400">时间</div>
                                    <div className="min-w-0 space-y-1">
                                      <div className="font-bold text-gray-900">开始：{formatDetailDateTime(selectedEventStartDate)}</div>
                                      <div className="font-bold text-gray-900">结束：{formatDetailDateTime(selectedEventEndDate)}</div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex min-w-0 gap-3 border-b border-gray-100 py-3 text-sm">
                                  <MapPin size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                                  <div className="grid min-w-0 flex-1 grid-cols-[64px_minmax(0,1fr)] gap-3">
                                    <div className="font-bold text-gray-400">方式</div>
                                    <div className="min-w-0 space-y-1">
                                      <div className="font-bold text-gray-900">{selectedEventMethodLabel}</div>
                                      {selectedEvent.location && <div className="font-semibold text-gray-500">地点：{selectedEvent.location}</div>}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex min-w-0 gap-3 border-b border-gray-100 py-3 text-sm">
                                  <Users size={16} className="mt-0.5 shrink-0 text-gray-500" />
                                  <div className="grid min-w-0 flex-1 grid-cols-[64px_minmax(0,1fr)] gap-3">
                                    <div className="font-bold text-gray-400">组织者</div>
                                    <div className="font-bold text-gray-900">{selectedEventOrganizerLabel}</div>
                                  </div>
                                </div>

                                <div className="flex min-w-0 gap-3 border-b border-gray-100 py-3 text-sm">
                                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                                  <div className="grid min-w-0 flex-1 grid-cols-[64px_minmax(0,1fr)] gap-3">
                                    <div className="font-bold text-gray-400">响应</div>
                                    <div>
                                      <div className="font-bold text-gray-900">{selectedEvent.status || '已接受'}</div>
                                      {selectedEvent.status === '待响应' && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          <button
                                            onClick={() => handleRespondToEvent(selectedEvent.id, 'reject')}
                                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                                          >
                                            拒绝
                                          </button>
                                          <button
                                            onClick={() => handleRespondToEvent(selectedEvent.id, 'accept')}
                                            className="rounded-lg bg-[#0A59F7] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#084DDB]"
                                          >
                                            接受
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex min-w-0 gap-3 border-b border-gray-100 py-3 text-sm">
                                  <RefreshCw size={16} className="mt-0.5 shrink-0 text-gray-500" />
                                  <div className="grid min-w-0 flex-1 grid-cols-[64px_minmax(0,1fr)] gap-3">
                                    <div className="font-bold text-gray-400">规则</div>
                                    <div className="font-bold text-gray-900">{selectedEventRuleLabel}</div>
                                  </div>
                                </div>

                                <div className="flex min-w-0 gap-3 border-b border-gray-100 py-3 text-sm">
                                  <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${selectedEventColorCategories[0]?.colorClass || 'bg-slate-300'}`}></span>
                                  <div className="grid min-w-0 flex-1 grid-cols-[64px_minmax(0,1fr)] gap-3">
                                    <div className="font-bold text-gray-400">分类</div>
                                    {selectedEventColorCategories.length > 0 ? (
                                      <div className="flex min-w-0 flex-wrap gap-1.5">
                                        {selectedEventColorCategories.map((category) => (
                                          <span key={category.id} className="inline-flex max-w-full items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700">
                                            <span className={`mr-1.5 h-2 w-2 shrink-0 rounded-full ${category.colorClass}`}></span>
                                            <span className="truncate">{category.label}</span>
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="font-bold text-gray-900">无分类</div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex min-w-0 gap-3 border-b border-gray-100 py-3 text-sm">
                                  <Send size={16} className="mt-0.5 shrink-0 text-gray-500" />
                                  <div className="grid min-w-0 flex-1 grid-cols-[64px_minmax(0,1fr)] gap-3">
                                    <div className="font-bold text-gray-400">发送</div>
                                    <div className="font-bold text-gray-900">{formatDetailDateTime(selectedEventSentDate)}</div>
                                  </div>
                                </div>

                                <div className="flex min-w-0 gap-3 border-b border-gray-100 py-3 text-sm sm:col-span-2">
                                  <UserPlus size={16} className="mt-0.5 shrink-0 text-gray-500" />
                                  <div className="grid min-w-0 flex-1 grid-cols-[64px_minmax(0,1fr)] gap-3">
                                    <div className="font-bold text-gray-400">参与者</div>
                                    <div className="flex min-w-0 flex-wrap gap-1.5">
                                      {selectedEventParticipants.length > 0 ? (
                                        selectedEventParticipants.map((person) => (
                                          <span key={`required-${person}`} className="rounded-lg bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700">
                                            {person}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="font-bold text-gray-900">无参与者</span>
                                      )}
                                      {selectedEventOptionalParticipants.map((person) => (
                                        <span key={`optional-${person}`} className="rounded-lg bg-gray-50 px-2 py-1 text-xs font-bold text-gray-500">
                                          {person}（可选）
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex min-w-0 gap-3 py-3 text-sm sm:col-span-2">
                                  <AlignLeft size={16} className="mt-0.5 shrink-0 text-gray-500" />
                                  <div className="grid min-w-0 flex-1 grid-cols-[64px_minmax(0,1fr)] gap-3">
                                    <div className="font-bold text-gray-400">正文</div>
                                    <p className="font-medium leading-6 text-gray-700">{selectedEvent.description || '暂无详细说明。'}</p>
                                  </div>
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
                  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/10 p-0">
                    <div className="h-[70vh] max-h-[calc(100vh-32px)] w-[70vw] max-w-[calc(100vw-32px)] overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_18px_56px_rgba(15,23,42,0.18)]">
                      <div className="flex h-full w-full flex-col overflow-hidden bg-white">
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm sm:px-6">
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="relative w-[260px] max-w-[42vw] shrink-0">
                              <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                              <select
                                value={draftAccountInfo?.id || ''}
                                onChange={(event) => handleDraftAccountChange(event.target.value)}
                                className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-sm font-semibold text-slate-900 focus:outline-none"
                                aria-label="发起账号"
                              >
                                {selectableDraftAccounts.map((account) => (
                                  <option key={account.id} value={account.id}>
                                    {account.email || account.name}
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

                        <div className="flex-1 overflow-y-auto px-4 pb-20 pt-4 sm:px-6">
                          <div className="mx-auto w-full max-w-[980px]">
                          <div className="border-b border-slate-200 py-3">
                            <input
                              type="text"
                              value={draftForm.title}
                              onChange={(event) => patchDraft({ title: event.target.value })}
                              placeholder="标题"
                              className="min-w-0 w-full border-none bg-transparent py-1 text-2xl font-semibold text-slate-900 placeholder:text-slate-300 focus:outline-none"
                              autoFocus
                            />
                          </div>

                          <div className="space-y-2.5 border-b border-slate-200 py-3 text-sm">
                            <div className="font-medium text-slate-600">时间</div>
                            <div className="space-y-3">
                              <div className="grid gap-3 lg:grid-cols-[minmax(160px,1fr)_140px_minmax(160px,1fr)_140px]">
                                <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3">
                                  <Calendar size={15} className="shrink-0 text-slate-400" />
                                  <input
                                    type="date"
                                    value={formatDateLabel(draftForm.date)}
                                    onChange={(event) => handleDraftDateChange(event.target.value)}
                                    className="w-full border-none bg-transparent py-1 text-sm font-medium text-slate-900 focus:outline-none"
                                    aria-label="开始日期"
                                  />
                                </label>
                                <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3">
                                  <Clock size={15} className="shrink-0 text-slate-400" />
                                  <select
                                    value={String(draftForm.startH)}
                                    onChange={(event) => handleDraftStartTimeChange(event.target.value)}
                                    className="w-full appearance-none border-none bg-transparent py-1 text-sm font-medium text-slate-900 focus:outline-none"
                                    aria-label="开始时间"
                                  >
                                    {TIME_SELECT_OPTIONS.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3">
                                  <Calendar size={15} className="shrink-0 text-slate-400" />
                                  <input
                                    type="date"
                                    value={formatDateLabel(draftEndMeta.date)}
                                    onChange={(event) => handleDraftEndDateChange(event.target.value, draftEndMeta.hour)}
                                    className="w-full border-none bg-transparent py-1 text-sm font-medium text-slate-900 focus:outline-none"
                                    aria-label="结束日期"
                                  />
                                </label>
                                <label className="flex min-h-[42px] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3">
                                  <Clock size={15} className="shrink-0 text-slate-400" />
                                  <select
                                    value={String(draftEndMeta.hour)}
                                    onChange={(event) => handleDraftEndTimeChange(event.target.value, draftEndMeta.date)}
                                    className="w-full appearance-none border-none bg-transparent py-1 text-sm font-medium text-slate-900 focus:outline-none"
                                    aria-label="结束时间"
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
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2.5 border-b border-slate-200 py-3 text-sm">
                            <div className="font-medium text-slate-600">必需</div>
                            <div className="space-y-3">
                              {createDraftLargeAudience ? (
                                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
                                    <div className="text-xs font-semibold text-slate-600">必需参会人</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      {draftForm.attendees.length > createDraftRequiredPreviewCount && (
                                        <button
                                          onClick={() =>
                                            setCreateDraftPanels((prev) => ({ ...prev, requiredExpanded: !prev.requiredExpanded }))
                                          }
                                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                          {createDraftPanels.requiredExpanded ? '收起名单' : '展开全部'}
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
                                            <button
                                              onClick={() => removeAttendee(person, 'attendees')}
                                              title={`移除 ${person}`}
                                              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                                            >
                                              <X size={12} />
                                            </button>
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
                                    placeholder="输入姓名或邮箱，按 Enter 添加"
                                    className="min-w-[220px] flex-1 border-none bg-transparent py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                  />
                                </div>
                              )}
                              {createDraftLargeAudience && (
                                <div className="flex min-h-[42px] flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                                  <input
                                    type="text"
                                    value={draftForm.inviteInput}
                                    onChange={(event) => patchDraft({ inviteInput: event.target.value })}
                                    onKeyDown={(event) => handleAttendeeInputKeyDown(event, 'attendees', 'inviteInput')}
                                    placeholder="输入姓名或邮箱，按 Enter 添加"
                                    className="min-w-[220px] flex-1 border-none bg-transparent py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2.5 border-b border-slate-200 py-3 text-sm">
                            <div className="font-medium text-slate-600">可选</div>
                            <div className="space-y-3">
                              {createDraftLargeAudience ? (
                                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
                                    <div className="text-xs font-semibold text-slate-600">可选参会人</div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      {(draftForm.optionalAttendees || []).length > createDraftOptionalPreviewCount && (
                                        <button
                                          onClick={() =>
                                            setCreateDraftPanels((prev) => ({ ...prev, optionalExpanded: !prev.optionalExpanded }))
                                          }
                                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                          {createDraftPanels.optionalExpanded ? '收起名单' : '展开全部'}
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
                                            <button
                                              onClick={() => removeAttendee(person, 'optionalAttendees')}
                                              title={`移除 ${person}`}
                                              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
                                            >
                                              <X size={12} />
                                            </button>
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
                                    placeholder="输入可选参与人，按 Enter 添加"
                                    className="min-w-[220px] flex-1 border-none bg-transparent py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                  />
                                </div>
                              )}
                              {createDraftLargeAudience && (
                                <div className="flex min-h-[42px] flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                                  <input
                                    type="text"
                                    value={draftForm.optionalInviteInput || ''}
                                    onChange={(event) => patchDraft({ optionalInviteInput: event.target.value })}
                                    onKeyDown={(event) => handleAttendeeInputKeyDown(event, 'optionalAttendees', 'optionalInviteInput')}
                                    placeholder="输入可选参与人，按 Enter 添加"
                                    className="min-w-[220px] flex-1 border-none bg-transparent py-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2.5 border-b border-slate-200 py-3 text-sm">
                            <div className="font-medium text-slate-600">地点 / 会议方式</div>
                            <div className="space-y-2.5">
                              <div className="grid gap-3 sm:grid-cols-2">
                                <label className="relative flex h-[42px] items-center rounded-lg border border-slate-200 bg-slate-50">
                                  <MapPin size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <input
                                    type="text"
                                    value={draftForm.location}
                                    onChange={(event) => patchDraft({ location: event.target.value })}
                                    placeholder="地点或会议室"
                                    className="h-full min-w-0 flex-1 border-none bg-transparent py-2 pl-9 pr-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                  />
                                </label>
                                <div className="relative flex h-[42px] items-center rounded-lg border border-slate-200 bg-slate-50">
                                  <Calendar size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                  <select
                                    value={draftForm.meetingProvider}
                                    onChange={(event) => setDraftMeetingProvider(event.target.value)}
                                    className="h-[42px] w-full appearance-none border-none bg-transparent py-2 pl-9 pr-9 text-sm font-medium text-slate-700 focus:outline-none"
                                  >
                                    {MEETING_PROVIDER_OPTIONS.map((option) => (
                                      <option key={option.id} value={option.id}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
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

                          <div className="space-y-2.5 border-b border-slate-200 py-3 text-sm">
                            <div className="font-medium text-slate-600">规则</div>
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
                                  className="h-4 w-4 rounded border-slate-300 text-[#0A59F7] focus:ring-[#0A59F7]"
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
                              <div className="relative">
                                <Bell size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                  value={draftForm.reminder}
                                  onChange={(event) => patchDraft({ reminder: event.target.value })}
                                  className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-slate-700 focus:outline-none"
                                  aria-label="提醒"
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
                          </div>

                          <div className="space-y-2.5 border-b border-slate-200 py-3 text-sm">
                            <div className="font-medium text-slate-600">显示</div>
                            <div className="flex flex-wrap items-center gap-3">
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
                            </div>
                          </div>

                          <div className="space-y-2.5 border-b border-slate-200 py-3 text-sm">
                            <div className="font-medium text-slate-600">正文</div>
                            <textarea
                              value={draftForm.description}
                              onChange={(event) => patchDraft({ description: event.target.value })}
                              className="min-h-[96px] w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A59F7]/20"
                              placeholder="补充会议背景、目标、议程和会前准备..."
                            ></textarea>
                          </div>

                          </div>
                        </div>

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
                              className="inline-flex items-center gap-2 rounded-lg bg-[#0A59F7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#084DDB]"
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
              mailListFilter={mailListFilter}
              mailSortOrder={mailSortOrder}
              selectedMail={selectedMail && filteredMails.some((mail) => mail.id === selectedMail.id) ? selectedMail : filteredMails[0] || null}
              onSelectMail={handleSelectMail}
              onToggleStar={toggleMailStar}
              onToggleRead={toggleMailRead}
              onArchiveMail={archiveMail}
              onDeleteMail={deleteMail}
              onMoveMail={moveMail}
              onCompose={openMailComposer}
              onEditDraft={(mailId) => openMailComposer('editDraft', mailId)}
              onScheduleFromMail={createEventFromMail}
              onMarkReadAfterViewing={markMailReadAfterViewing}
              onCreateTaskFromMail={createTaskFromMail}
              onPreviewAttachment={previewMailAttachment}
              onDownloadAttachment={downloadMailAttachment}
              onQuickReplySend={sendQuickReply}
              onReaderRetry={retryMailReader}
              onReaderSecurityAction={runReaderSecurityAction}
              onOpenLinkedEvent={(eventId) => navTo('details', eventId)}
              onSetMailListFilter={setMailListFilter}
              onSetMailSortOrder={setMailSortOrder}
              onExportMailBatch={exportMailBatch}
              linkedEventLookup={allEventLookup}
              mailListWidth={mailListWidth}
              mailListBounds={mailListBounds}
              mailLayoutMode={mailLayoutMode}
              activeLayoutResize={activeLayoutResize}
              onStartLayoutResize={startLayoutResize}
              onStepLayoutResize={stepLayoutResize}
              onRestoreMailReader={restoreMailReader}
            />
          ) : activeProduct === 'settings' ? (
            <CalendarReminderSettingsPage
              settings={calendarReminderSettings}
              onChange={updateCalendarReminderSettings}
              onBack={() => handleProductSelect('calendar')}
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
            onClose={closeMailComposer}
            onChange={patchMailComposer}
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

      <SettingsCenterModal
        open={settingsCenterOpen}
        settings={calendarReminderSettings}
        onChange={updateCalendarReminderSettings}
        onClose={() => setSettingsCenterOpen(false)}
      />

      <ReminderModal
        open={reminderDialogOpen}
        onClose={() => setReminderDialogOpen(false)}
        reminderEvents={reminderEvents.active}
        accountMap={accountMap}
        calendarMap={calendarMap}
        onOpenEvent={(id) => navTo('details', id)}
        onJoinEvent={handleJoinReminderEvent}
        onSnoozeEvent={handleSnoozeReminderEvent}
        onDismissEvent={handleDismissReminderEvent}
        onDismissAllEvents={handleDismissAllReminderEvents}
        onOpenNotification={handleOpenReminderNotification}
        onOpenSettings={() => {
          setReminderDialogOpen(false);
          setSettingsCenterOpen(true);
        }}
        skipDismissAllConfirm={skipReminderDismissAllConfirm}
        onSetSkipDismissAllConfirm={setSkipReminderDismissAllConfirm}
      />

      <ShortcutHelpModal open={shortcutHelpOpen} onClose={() => setShortcutHelpOpen(false)} />

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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#0A59F7]/60 focus:ring-1 focus:ring-[#0A59F7]/30"
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
              <AccountColorMenuItem
                colors={CALENDAR_COLORS}
                currentColor={contextMenu.account.color}
                onSelect={(color) => {
                  updateAccountColor(contextMenu.account.id, color);
                  setContextMenu(null);
                }}
              />
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
                <AccountColorMenuItem
                  colors={CALENDAR_COLORS}
                  currentColor={accountMenuAnchor.account.color}
                  onSelect={(color) => {
                    updateAccountColor(accountMenuAnchor.account.id, color);
                    closeAccountMenu();
                  }}
                />
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
                className="rounded-xl bg-[#0A59F7] px-4 py-2 text-sm font-bold text-white hover:bg-[#084DDB]"
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
          {feedback.payload?.actionText && feedback.payload?.onAction && (
            <button
              type="button"
              onClick={feedback.payload.onAction}
              className="ml-3 rounded-full bg-white/15 px-2.5 py-1 text-xs font-black text-white transition hover:bg-white/25"
              aria-label={feedback.payload?.actionLabel || feedback.payload.actionText}
            >
              {feedback.payload.actionText}
            </button>
          )}
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
