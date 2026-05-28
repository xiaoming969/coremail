import { AlertCircle, Archive, Calendar, FileText, Inbox, Mail, Send, Settings, Trash, Users } from 'lucide-react';

export const DAY_MS = 24 * 60 * 60 * 1000;
export const BASE_WEEK_START = new Date(2026, 0, 5);
export const TODAY_DATE = new Date(2026, 0, 9, 10, 30);
export const DAY_START_HOUR = 0;
export const DAY_END_HOUR = 24;
export const WORK_START_HOUR = 8;
export const WORK_END_HOUR = 18;
export const CELL_HEIGHT = 96;
export const TIMELINE_HEADER_HEIGHT = 56;
export const SPLIT_WEEK_PANE_HEADER_HEIGHT = 36;
export const HALF_HOUR_STEP = 0.5;
export const MIN_EVENT_DURATION = 0.5;
export const HOURS = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, index) => index + DAY_START_HOUR);
export const WEEKDAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
export const MONTH_WEEKDAY_NAMES = ['一', '二', '三', '四', '五', '六', '日'];
export const VIEW_OPTIONS = [
  { id: 'month', label: '月' },
  { id: 'week', label: '周' },
  { id: 'day', label: '日' },
];
export const PRODUCT_TABS = [
  { id: 'mail', label: '邮件', icon: Mail },
  { id: 'calendar', label: '日历', icon: Calendar },
  { id: 'contacts', label: '通讯录', icon: Users },
  { id: 'settings', label: '设置', icon: Settings },
];
export const MAIL_FOLDERS = [
  { id: 'inbox', label: '收件箱', icon: Inbox },
  { id: 'drafts', label: '草稿', icon: FileText },
  { id: 'sent', label: '已发送', icon: Send },
  { id: 'deleted', label: '已删除邮件', icon: Trash },
  { id: 'junk', label: '垃圾邮件', icon: AlertCircle },
  { id: 'outbox', label: '发件箱', icon: Send },
  { id: 'archive', label: '存档', icon: Archive },
  { id: 'conversation', label: '对话历史记录', icon: FileText },
];
export const MAIL_CONTACTS = [
  { id: 'mc1', name: '产品经理', email: 'pm@calendarpro.io', scope: 'internal' },
  { id: 'mc2', name: '行政助理组', email: 'ea-team@calendarpro.io', scope: 'internal' },
  { id: 'mc3', name: '外部顾问', email: 'advisor@vendor.com', scope: 'external' },
  { id: 'mc4', name: '客户 CFO', email: 'cfo@externalcorp.com', scope: 'external' },
  { id: 'mc5', name: '张三', email: 'ea@calendarpro.io', scope: 'internal' },
  { id: 'mc6', name: '李四', email: 'sales@calendarpro.io', scope: 'internal' },
  { id: 'mc7', name: '陈晨', email: 'pm@calendarpro.io', scope: 'internal' },
  { id: 'mc8', name: '刘洋', email: 'liuyang@calendarpro.io', scope: 'internal' },
];
export const MODULE_COPY = {
  mail: {
    title: '邮件中心',
    desc: '',
  },
  contacts: {
    title: '通讯录',
    desc: '',
  },
  settings: {
    title: '设置中心',
    desc: '',
  },
};
export const CALENDAR_PERMISSION_OPTIONS = [
  { id: 'all_details', label: '仅查看详情', desc: '可查看标题、时间、地点和正文，不能修改日程。' },
  { id: 'busy_only', label: '仅查看闲忙', desc: '只显示忙闲占用，不显示标题、地点和正文。' },
  { id: 'edit', label: '可编辑', desc: '可查看详情，并可新建、修改和删除日程。' },
];
export const CALENDAR_PERMISSION_LABELS = {
  none: '不共享',
  all_details: '仅查看详情',
  titles_locations: '仅查看详情',
  busy_only: '仅查看闲忙',
  edit: '可编辑',
};
export const CALENDAR_PERMISSION_LABEL_TO_ID = {
  不共享: 'none',
  仅查看: 'all_details',
  仅查看详情: 'all_details',
  查看所有详细信息: 'all_details',
  查看标题和地点: 'all_details',
  闲忙: 'busy_only',
  仅查看闲忙: 'busy_only',
  可编辑: 'edit',
  all_details: 'all_details',
  titles_locations: 'all_details',
  busy_only: 'busy_only',
  edit: 'edit',
};
export const HUAWEI_ACCOUNT_ID = 'acc-huawei-calendar';
export const HUAWEI_CALENDAR_ID = 'c-huawei';
export const MAX_SPLIT_ACCOUNTS = 3;
export const SHARED_ACCOUNT_TEMPLATES = [
  { name: '王敏', email: 'finance@calendarpro.io', color: 'bg-cyan-500', permissionId: 'all_details' },
  { name: '钱宁', email: 'legal@calendarpro.io', color: 'bg-fuchsia-500', permissionId: 'all_details' },
  { name: '孙越', email: 'cs@calendarpro.io', color: 'bg-teal-500', permissionId: 'edit' },
  { name: '赵磊', email: 'advisor@vendor.com', color: 'bg-amber-500', permissionId: 'busy_only' },
];
export const MOCK_SHARE_INVITATIONS = [
  {
    id: 'share-invite-1',
    senderName: '王敏',
    senderEmail: 'finance@calendarpro.io',
    calendarName: 'finance@calendarpro.io',
    permissionId: 'all_details',
    color: 'bg-cyan-500',
    status: 'pending',
    createdAt: new Date(2026, 0, 8, 14, 20).getTime(),
    message: '共享了季度预算与报销排期，接收后会出现在左侧"共享日历"。',
  },
  {
    id: 'share-invite-2',
    senderName: '赵磊',
    senderEmail: 'advisor@vendor.com',
    calendarName: 'advisor@vendor.com',
    permissionId: 'busy_only',
    color: 'bg-amber-500',
    status: 'pending',
    createdAt: new Date(2026, 0, 9, 9, 5).getTime(),
    message: '仅开放忙闲占用，方便跨团队排会时快速查看空档。',
  },
];
export const EVENT_KIND_DEFAULTS = {
  event: {
    title: '',
    description: '',
    reminder: '15m',
    availability: 'busy',
    visibility: 'default',
  },
};
export const MEETING_PROVIDER_OPTIONS = [
  { id: 'none', label: '不添加链接' },
  { id: 'meet', label: 'Google Meet' },
  { id: 'teams', label: 'Teams' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'phone', label: '线下 / 电话' },
];
export const REPEAT_OPTIONS = [
  { id: 'does_not_repeat', label: '不重复' },
  { id: 'every_day', label: '每天' },
  { id: 'weekdays', label: '工作日' },
  { id: 'every_week', label: '每周' },
];
export const REMINDER_OPTIONS = [
  { id: 'none', label: '不提醒' },
  { id: '0m', label: '开始时' },
  { id: '5m', label: '5 分钟前' },
  { id: '10m', label: '10 分钟前' },
  { id: '15m', label: '15 分钟前' },
  { id: '30m', label: '30 分钟前' },
  { id: '1h', label: '1 小时前' },
  { id: '1d', label: '1 天前' },
];
export const AVAILABILITY_OPTIONS = [
  { id: 'busy', label: '忙碌' },
  { id: 'free', label: '空闲' },
];
export const VISIBILITY_OPTIONS = [
  { id: 'default', label: '默认可见' },
  { id: 'private', label: '私人日程' },
];
export const INITIAL_CREATE_DRAFT_PANELS = {
  requiredExpanded: false,
  optionalExpanded: false,
  conflictsExpanded: false,
  requiredBulkOpen: false,
  optionalBulkOpen: false,
};
export const INITIAL_CREATE_DRAFT_BULK_INPUTS = {
  attendees: '',
  optionalAttendees: '',
};
export const EVENT_KIND_LABELS = { event: '日程', focus: '日程', ooo: '日程' };
export const MEETING_PROVIDER_LABELS = Object.fromEntries(MEETING_PROVIDER_OPTIONS.map((option) => [option.id, option.label]));
export const REPEAT_LABELS = Object.fromEntries(REPEAT_OPTIONS.map((option) => [option.id, option.label]));
export const REMINDER_LABELS = Object.fromEntries(REMINDER_OPTIONS.map((option) => [option.id, option.label]));
export const AVAILABILITY_LABELS = {
  ...Object.fromEntries(AVAILABILITY_OPTIONS.map((option) => [option.id, option.label])),
  out_of_office: '忙碌',
};
export const VISIBILITY_LABELS = Object.fromEntries(VISIBILITY_OPTIONS.map((option) => [option.id, option.label]));

export const stripTime = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

export const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

export const addMonths = (date, amount) => {
  const base = stripTime(date);
  const targetFirstDay = new Date(base.getFullYear(), base.getMonth() + amount, 1);
  const lastDay = new Date(targetFirstDay.getFullYear(), targetFirstDay.getMonth() + 1, 0).getDate();
  return new Date(targetFirstDay.getFullYear(), targetFirstDay.getMonth(), Math.min(base.getDate(), lastDay));
};

export const sameDay = (left, right) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

export const sameMonth = (left, right) =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();

export const getWeekStart = (date) => {
  const next = stripTime(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
};

export const getWeekOffsetFromDate = (date) =>
  Math.round((getWeekStart(date).getTime() - BASE_WEEK_START.getTime()) / (7 * DAY_MS));

export const dateToEventParts = (date) => {
  const target = stripTime(date);
  const weekStart = getWeekStart(target);
  return {
    weekOffset: getWeekOffsetFromDate(target),
    day: Math.round((target.getTime() - weekStart.getTime()) / DAY_MS),
  };
};

export const eventToDate = (event) => addDays(BASE_WEEK_START, (event.weekOffset || 0) * 7 + (event.day || 0));

export const formatHour = (value) => {
  const hour = Math.floor(value);
  const minuteValue = Math.round((value - hour) * 60);
  const normalizedHour = hour + Math.floor(minuteValue / 60);
  const normalizedMinute = minuteValue % 60;
  return `${normalizedHour}:${String(normalizedMinute).padStart(2, '0')}`;
};

export const formatTimeRange = (startH, durationH) => `${formatHour(startH)} - ${formatHour(startH + durationH)}`;

export const formatDateLabel = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const formatDraftTime = (date, startH, durationH) => `${formatDateLabel(date)} ${formatTimeRange(startH, durationH)}`;
export const formatTimeSelectLabel = (value) => {
  if (value >= DAY_END_HOUR) return '24:00';
  return `${String(Math.floor(value)).padStart(2, '0')}:${value % 1 === 0.5 ? '30' : '00'}`;
};
export const buildDateTimeAtHour = (date, hour) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(hour), Math.round((hour - Math.floor(hour)) * 60), 0, 0);
export const getDraftEndMeta = (date, startH, durationH) => {
  const start = buildDateTimeAtHour(date, startH);
  const end = new Date(start.getTime() + durationH * 60 * 60 * 1000);

  return {
    date: stripTime(end),
    hour: end.getHours() + (end.getMinutes() >= 30 ? 0.5 : 0),
  };
};
export const isHuaweiMakeupWorkday = (date) => {
  const target = stripTime(date);
  return target.getDay() === 6 && addDays(target, 7).getMonth() !== target.getMonth();
};
export const isWeekendDate = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};
export const createAllDayCalendarEvent = ({ id, title, date, span = 1, calId, description = '', type = 'normal' }) => {
  const parts = dateToEventParts(date);

  return {
    id,
    title,
    ...parts,
    startH: 0,
    durationH: 24,
    calId,
    location: '',
    organizer: '华为日历',
    status: '已接受',
    description,
    type,
    attendees: ['华为日历'],
    meetingProvider: 'none',
    meetingLink: '',
    repeat: 'does_not_repeat',
    reminder: 'none',
    availability: 'free',
    visibility: 'default',
    kind: 'event',
    isAllDay: true,
    allDaySpan: span,
  };
};
export const getDraftDurationBetween = (startDate, startH, endDate, endH) => {
  const start = buildDateTimeAtHour(startDate, startH);
  const end = buildDateTimeAtHour(endDate, endH);
  return (end.getTime() - start.getTime()) / (60 * 60 * 1000);
};
export const getDefaultDraftStartHour = (date) => {
  const baseDate = stripTime(date);
  if (!sameDay(baseDate, TODAY_DATE)) return 9;

  const currentHour = TODAY_DATE.getHours() + TODAY_DATE.getMinutes() / 60;
  const rounded = roundToHalfHour(currentHour + HALF_HOUR_STEP);
  return clampStartHour(Math.max(WORK_START_HOUR, rounded), 1);
};
export const formatDurationLabel = (durationH) => {
  const totalMinutes = Math.round(durationH * 60);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  const parts = [];

  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}小时`);
  if (minutes > 0) parts.push(`${minutes}分钟`);

  return parts.length > 0 ? parts.join(' ') : '0分钟';
};
export const normalizeParticipantIdentity = (value = '') => value.trim().toLowerCase();
export const getShareContactDirectory = (extraContacts = []) => {
  const directory = [
    ...extraContacts,
    ...MOCK_SHARE_INVITATIONS.map((item) => ({
      id: `share-invite-contact-${item.id}`,
      name: item.senderName,
      email: item.senderEmail,
      scope: String(item.senderEmail || '').includes('@calendarpro.io') ? 'internal' : 'external',
      permissionId: item.permissionId,
      color: item.color,
      sharedGrant: true,
    })),
    ...SHARED_ACCOUNT_TEMPLATES.map((item, index) => ({
      id: `shared-template-${index}`,
      name: item.name,
      email: item.email,
      scope: String(item.email || '').includes('@calendarpro.io') ? 'internal' : 'external',
      permissionId: item.permissionId,
      color: item.color,
      sharedGrant: true,
    })),
    ...MAIL_CONTACTS,
  ];
  const seen = new Set();

  return directory.filter((contact) => {
    const key = normalizeParticipantIdentity(contact.email || contact.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
export const parseShareMemberInput = (value = '') => {
  const raw = String(value || '').trim();
  if (!raw) return null;

  const angleMatch = raw.match(/^(.+?)\s*<([^>]+)>$/);
  if (angleMatch) {
    return {
      name: angleMatch[1].trim(),
      email: angleMatch[2].trim(),
    };
  }

  const contact = getShareContactDirectory().find(
    (item) => normalizeParticipantIdentity(item.email) === normalizeParticipantIdentity(raw) ||
      normalizeParticipantIdentity(item.name) === normalizeParticipantIdentity(raw),
  );
  if (contact) return { name: contact.name, email: contact.email, scope: contact.scope };

  const emailMatch = raw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (emailMatch) {
    const email = emailMatch[0];
    const name = raw.replace(email, '').replace(/[<>]/g, '').trim();
    return { name: name || email, email };
  }

  return { name: raw, email: raw };
};
export const resolveKnownShareMember = (value = '', selectedContact = null) => {
  if (selectedContact) {
    return {
      name: selectedContact.name,
      email: selectedContact.email,
      scope: selectedContact.scope,
    };
  }

  const raw = String(value || '').trim();
  if (!raw) return null;

  const exactContact = getShareContactDirectory().find(
    (item) => normalizeParticipantIdentity(item.email) === normalizeParticipantIdentity(raw) ||
      normalizeParticipantIdentity(item.name) === normalizeParticipantIdentity(raw),
  );
  if (exactContact) {
    return {
      name: exactContact.name,
      email: exactContact.email,
      scope: exactContact.scope,
    };
  }

  const parsed = parseShareMemberInput(raw);
  const email = String(parsed?.email || '').trim();
  if (email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return parsed;
  }

  return null;
};
export const getShareContactSuggestions = (value = '', existingShares = [], limit = 5, extraContacts = []) => {
  const query = normalizeParticipantIdentity(value);
  if (!query) return [];

  const existingKeys = new Set(
    existingShares.flatMap((share) => [share.email, share.name]).filter(Boolean).map((item) => normalizeParticipantIdentity(item)),
  );

  return getShareContactDirectory(extraContacts).filter((contact) => {
    const name = normalizeParticipantIdentity(contact.name);
    const email = normalizeParticipantIdentity(contact.email);
    if (existingKeys.has(name) || existingKeys.has(email)) return false;
    return name.includes(query) || email.includes(query);
  }).slice(0, limit);
};
export const TIME_SELECT_OPTIONS = Array.from({ length: DAY_END_HOUR * 2 }, (_, index) => {
  const value = index * HALF_HOUR_STEP;
  return { value: String(value), label: formatTimeSelectLabel(value) };
});
export const TIME_SELECT_END_OPTIONS = [...TIME_SELECT_OPTIONS, { value: String(DAY_END_HOUR), label: formatTimeSelectLabel(DAY_END_HOUR) }];
export const formatClockStamp = (date) =>
  new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
export const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));
export const roundToHalfHour = (value) => Math.round(value / HALF_HOUR_STEP) * HALF_HOUR_STEP;
export const clampStartHour = (startH, durationH = MIN_EVENT_DURATION) =>
  clampNumber(roundToHalfHour(startH), DAY_START_HOUR, DAY_END_HOUR - Math.max(MIN_EVENT_DURATION, durationH));
export const clampDuration = (durationH, startH) =>
  clampNumber(roundToHalfHour(durationH), MIN_EVENT_DURATION, DAY_END_HOUR - startH);
export const formatEventDateTime = (event) =>
  `${formatDateLabel(eventToDate(event))} · ${event.isAllDay ? '全天' : formatTimeRange(event.startH || WORK_START_HOUR, event.durationH || 1)}`;
export const formatAgendaEventLabel = (event) => {
  const date = eventToDate(event);
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
  return `${date.getMonth() + 1}/${date.getDate()} ${WEEKDAY_NAMES[dayIndex]} · ${event.isAllDay ? '全天' : formatTimeRange(event.startH || WORK_START_HOUR, event.durationH || 1)}`;
};
export const getAgendaStatusTone = (status) => {
  if (status === '待响应') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === '草稿') return 'bg-slate-100 text-slate-700 border-slate-200';
  if (status === '已取消') return 'bg-slate-100 text-slate-500 border-slate-200';
  if (status === '已拒绝') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};
export const getCalendarPermissionId = (permission) => CALENDAR_PERMISSION_LABEL_TO_ID[permission] || permission || 'all_details';
export const getCalendarPermissionLabel = (permission) => CALENDAR_PERMISSION_LABELS[getCalendarPermissionId(permission)] || permission || '仅查看详情';
export const getCalendarPermissionOption = (permission) =>
  CALENDAR_PERMISSION_OPTIONS.find((option) => option.id === getCalendarPermissionId(permission)) || CALENDAR_PERMISSION_OPTIONS[0];
export const getCalendarPermissionCapabilities = (permission) => {
  const permissionId = getCalendarPermissionId(permission);

  if (permissionId === 'busy_only') {
    return [
      { label: '只显示忙闲占用', enabled: true },
      { label: '隐藏标题、地点和正文', enabled: true },
      { label: '不可新建、修改和删除', enabled: false },
    ];
  }

  if (permissionId === 'edit') {
    return [
      { label: '可查看日程详情', enabled: true },
      { label: '可新建、修改和删除', enabled: true },
      { label: '不可继续转共享', enabled: false },
    ];
  }

  return [
    { label: '可查看日程详情', enabled: true },
    { label: '不可新建、修改和删除', enabled: false },
    { label: '不可继续转共享', enabled: false },
  ];
};
export const canEditCalendarContent = (calendarOrPermission) => {
  const permissionId = typeof calendarOrPermission === 'string' ? getCalendarPermissionId(calendarOrPermission) : getCalendarPermissionId(calendarOrPermission?.permission);
  return permissionId === 'edit';
};
export const getAccountCheckboxTone = (color) => {
  if (color?.includes('orange')) return 'border-orange-500 bg-orange-500 text-white hover:border-orange-400';
  if (color?.includes('sky')) return 'border-sky-500 bg-sky-500 text-white hover:border-sky-400';
  if (color?.includes('green')) return 'border-green-500 bg-green-500 text-white hover:border-green-400';
  if (color?.includes('emerald')) return 'border-emerald-500 bg-emerald-500 text-white hover:border-emerald-400';
  if (color?.includes('purple')) return 'border-purple-500 bg-purple-500 text-white hover:border-purple-400';
  if (color?.includes('violet')) return 'border-violet-500 bg-violet-500 text-white hover:border-violet-400';
  if (color?.includes('cyan')) return 'border-cyan-500 bg-cyan-500 text-white hover:border-cyan-400';
  if (color?.includes('teal')) return 'border-teal-500 bg-teal-500 text-white hover:border-teal-400';
  if (color?.includes('fuchsia')) return 'border-fuchsia-500 bg-fuchsia-500 text-white hover:border-fuchsia-400';
  if (color?.includes('amber')) return 'border-amber-500 bg-amber-500 text-white hover:border-amber-400';
  if (color?.includes('yellow')) return 'border-yellow-500 bg-yellow-500 text-white hover:border-yellow-400';
  if (color?.includes('rose')) return 'border-rose-500 bg-rose-500 text-white hover:border-rose-400';
  if (color?.includes('red')) return 'border-red-500 bg-red-500 text-white hover:border-red-400';
  if (color?.includes('pink')) return 'border-pink-500 bg-pink-500 text-white hover:border-pink-400';
  if (color?.includes('indigo')) return 'border-indigo-500 bg-indigo-500 text-white hover:border-indigo-400';
  if (color?.includes('gray')) return 'border-gray-500 bg-gray-500 text-white hover:border-gray-400';
  if (color?.includes('zinc')) return 'border-zinc-500 bg-zinc-500 text-white hover:border-zinc-400';
  if (color?.includes('slate')) return 'border-slate-500 bg-slate-500 text-white hover:border-slate-400';
  return 'border-blue-600 bg-blue-600 text-white hover:border-blue-400';
};
export const ACCOUNT_COLOR_OPTIONS = [
  'bg-blue-500',
  'bg-orange-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-cyan-500',
  'bg-teal-500',
  'bg-fuchsia-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-indigo-500',
  'bg-slate-500',
];
export const getAccountPersonLabel = (account) => account?.displayName || account?.ownerName || account?.contactName || account?.name || account?.email || '';
export const getAccountDisplayLabel = (account) => getAccountPersonLabel(account);
export const getAccountFullLabel = (account) => {
  const person = getAccountPersonLabel(account);
  const email = account?.email || account?.name || '';
  if (!person) return email;
  if (!email || person === email) return person;
  return `${person} · ${email}`;
};
export const getAccountEditableName = (account) => account?.displayName || account?.name || account?.email || '';

export const getPreviewPosition = (clientX, clientY) => {
  if (typeof window === 'undefined') return { x: clientX + 16, y: clientY + 16 };

  return {
    x: clampNumber(clientX + 18, 16, Math.max(16, window.innerWidth - 336)),
    y: clampNumber(clientY + 18, 16, Math.max(16, window.innerHeight - 236)),
  };
};

export const getSlotFromPointer = (clientX, clientY, durationH = 1) => {
  if (typeof document === 'undefined') return null;

  const target = document.elementFromPoint(clientX, clientY)?.closest?.('[data-calendar-slot="true"]');
  if (!target) return null;

  const dateMs = Number(target.getAttribute('data-slot-date-ms'));
  const hour = Number(target.getAttribute('data-slot-hour'));

  if (Number.isNaN(dateMs) || Number.isNaN(hour)) return null;

  const rect = target.getBoundingClientRect();
  const offsetY = clientY - rect.top;
  const startH = clampStartHour(hour + (offsetY >= rect.height / 2 ? HALF_HOUR_STEP : 0), durationH);
  const date = stripTime(new Date(dateMs));
  const parts = dateToEventParts(date);

  return {
    date,
    startH,
    durationH,
    weekOffset: parts.weekOffset,
    day: parts.day,
  };
};

export const clampLinesStyle = (lines) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const getTimedEventCardDensity = ({ isSplit = false, columnCount = 1, durationH = 1 }) => {
  if (isSplit) {
    if (columnCount >= 3 || (columnCount >= 2 && durationH <= 1.25) || durationH <= 1) return 'micro';
    return 'compact';
  }

  if (columnCount >= 4 || (columnCount >= 3 && durationH <= 1.25) || (columnCount >= 2 && durationH <= 1)) return 'micro';
  if (columnCount >= 2 || durationH <= 1.25) return 'compact';
  return 'regular';
};

export const overlapsWindow = (leftStart, leftEnd, rightStart, rightEnd) => leftStart < rightEnd && rightStart < leftEnd;
export const isWorkHour = (hour) => hour >= WORK_START_HOUR && hour < WORK_END_HOUR;
export const getTimeTop = (hour) => (hour - DAY_START_HOUR) * CELL_HEIGHT;
export const getTimeHeight = (durationH) => durationH * CELL_HEIGHT;
export const getWorkdayScrollTop = () => Math.max(0, (WORK_START_HOUR - DAY_START_HOUR) * CELL_HEIGHT);
export const scrollElementToTop = (element, top) => {
  if (!element) return;
  element.scrollTop = top;
  element.scrollTo({ top, behavior: 'auto' });
};
export const tokenizeKeywordQuery = (query = '') => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const tokens = normalized
    .split(/[\s,，;；、|]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  return Array.from(new Set(tokens.length > 0 ? tokens : [normalized]));
};
export const EVENT_SEARCH_FIELD_WEIGHTS = {
  title: 8,
  attendees: 7,
  organizer: 7,
  location: 5,
  time: 4,
  attachments: 4,
  description: 3,
  calendar: 2,
};
export const SEARCH_TIMEFRAME_OPTIONS = [
  { id: 'all', label: '时间：全部时间' },
  { id: 'today', label: '今天' },
  { id: 'tomorrow', label: '明天' },
  { id: 'this_week', label: '本周' },
  { id: 'last_week', label: '上周' },
  { id: 'this_month', label: '本月' },
  { id: 'custom', label: '自定义时间范围' },
];
export const SEARCH_ACCOUNT_SCOPE_OPTIONS = [
  { id: 'all', label: '搜索范围：全部日历' },
  { id: 'mine', label: '我的日历' },
  { id: 'shared', label: '共享日历' },
  { id: 'group', label: '群组日历' },
  { id: 'room', label: '会议室日历' },
];
export const SEARCH_COLOR_CATEGORY_OPTIONS = [
  { id: 'all', label: '颜色分类：全部', shortLabel: '全部', colorClass: 'bg-slate-400' },
  { id: 'none', label: '无分类', shortLabel: '无分类', colorClass: 'bg-slate-300' },
  { id: 'project', label: '项目', shortLabel: '项目', colorClass: 'bg-blue-500' },
  { id: 'customer', label: '客户', shortLabel: '客户', colorClass: 'bg-emerald-500' },
  { id: 'important', label: '重要', shortLabel: '重要', colorClass: 'bg-rose-500' },
  { id: 'todo', label: '待处理', shortLabel: '待处理', colorClass: 'bg-amber-500' },
  { id: 'personal', label: '个人', shortLabel: '个人', colorClass: 'bg-violet-500' },
];
export const SEARCH_MEETING_TYPE_OPTIONS = [
  { id: 'all', label: '会议类型：全部' },
  { id: 'online', label: '线上会议' },
  { id: 'room', label: '会议室会议' },
  { id: 'no_location', label: '无地点会议' },
  { id: 'recurring', label: '循环会议' },
  { id: 'cancelled', label: '已取消会议' },
];
export const SEARCH_ATTACHMENT_OPTIONS = [
  { id: 'all', label: '有附件：全部' },
  { id: 'has', label: '有附件' },
  { id: 'none', label: '无附件' },
];
export const SEARCH_SORT_OPTIONS = [
  { id: 'relevance', label: '排序：相关性优先' },
  { id: 'time_asc', label: '时间从近到远' },
  { id: 'time_desc', label: '时间从远到近' },
];
export const getEventStatusBadgeMeta = (status) => {
  if (status === '待响应') {
    return {
      compactLabel: '待',
      fullLabel: '待响应',
      className: 'border-amber-200 bg-amber-50 text-amber-700',
    };
  }

  if (status === '已拒绝') {
    return {
      compactLabel: '拒',
      fullLabel: '已拒绝',
      className: 'border-slate-300 bg-slate-100 text-slate-600',
    };
  }

  if (status === '已取消') {
    return {
      compactLabel: '取消',
      fullLabel: '已取消',
      className: 'border-slate-300 bg-slate-100 text-slate-500',
    };
  }

  if (status === '草稿') {
    return {
      compactLabel: '稿',
      fullLabel: '草稿',
      className: 'border-slate-300 bg-slate-100 text-slate-600',
    };
  }

  return null;
};
export const getTimedEventStatusSurface = (status) => {
  if (status === '待响应') {
    return {
      cardClass: 'border-amber-200/90 ring-1 ring-amber-200/70',
      topRuleClass: 'bg-amber-400/90',
    };
  }

  if (status === '已拒绝') {
    return {
      cardClass: 'border-dashed border-slate-300/90 opacity-85',
      topRuleClass: 'bg-slate-400/80',
    };
  }

  if (status === '已取消') {
    return {
      cardClass: 'border-dashed border-slate-300/90 opacity-60',
      topRuleClass: 'bg-slate-300/90',
    };
  }

  if (status === '草稿') {
    return {
      cardClass: 'border-dashed border-slate-300/90 bg-slate-50/90',
      topRuleClass: 'bg-slate-400/80',
    };
  }

  return {
    cardClass: '',
    topRuleClass: '',
  };
};
export const getEventSearchFields = (event, calendar, account) => {
  const date = eventToDate(event);
  const startH = event.startH || WORK_START_HOUR;
  const durationH = event.durationH || 1;
  const endH = startH + durationH;
  const attendeeValues = [...(event.attendees || []), ...(event.optionalAttendees || [])];
  const attachmentNames = (event.attachments || [])
    .map((attachment) => (typeof attachment === 'string' ? attachment : attachment?.name))
    .filter(Boolean);

  return {
    title: [event.title, event.status === '已取消' ? '已取消' : ''],
    description: [event.description],
    attendees: attendeeValues,
    organizer: [event.organizer],
    time: [
      formatEventDateTime(event),
      formatAgendaEventLabel(event),
      formatDateLabel(date),
      `${date.getMonth() + 1}/${date.getDate()}`,
      `${date.getMonth() + 1}月${date.getDate()}日`,
      `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
      formatWeekdayLabel(date),
      event.isAllDay ? '全天' : formatTimeRange(startH, durationH),
      event.isAllDay ? '' : formatHour(startH),
      event.isAllDay ? '' : formatHour(endH),
    ],
    location: [event.location, MEETING_PROVIDER_LABELS[event.meetingProvider || 'none'], event.meetingLink],
    calendar: [calendar?.name, calendar?.owner, account?.name, account?.email],
    attachments: attachmentNames,
  };
};
export const getEventSearchMatchMeta = (event, calendar, account, query, fieldScope = 'all') => {
  const normalizedQuery = query.trim().toLowerCase();
  const tokens = tokenizeKeywordQuery(normalizedQuery);
  if (tokens.length === 0) return null;

  const fieldTextMap = Object.fromEntries(
    Object.entries(getEventSearchFields(event, calendar, account)).map(([field, values]) => [
      field,
      values
        .map((value) => String(value || '').toLowerCase())
        .filter(Boolean)
        .join(' '),
    ]),
  );
  const searchableEntries =
    fieldScope === 'all'
      ? Object.entries(fieldTextMap)
      : [[fieldScope, fieldTextMap[fieldScope] || '']];
  const fullText = searchableEntries.map(([, value]) => value).join(' ');

  if (!tokens.every((token) => fullText.includes(token))) return null;

  const matchedFields = new Set();
  let score = 0;

  tokens.forEach((token) => {
    searchableEntries.forEach(([field, value]) => {
      if (!value.includes(token)) return;
      matchedFields.add(field);
      score += EVENT_SEARCH_FIELD_WEIGHTS[field] || 1;
    });
  });

  if ((fieldScope === 'all' || fieldScope === 'title') && fieldTextMap.title.includes(normalizedQuery)) score += 14;
  if ((fieldScope === 'all' || fieldScope === 'organizer' || fieldScope === 'attendees') && (fieldTextMap.organizer.includes(normalizedQuery) || fieldTextMap.attendees.includes(normalizedQuery))) score += 8;
  if ((fieldScope === 'all' || fieldScope === 'location') && fieldTextMap.location.includes(normalizedQuery)) score += 5;
  if ((fieldScope === 'all' || fieldScope === 'time') && fieldTextMap.time.includes(normalizedQuery)) score += 4;

  return {
    score,
    matchedFields: Array.from(matchedFields),
  };
};
export const getNormalizedSearchStatus = (event) => {
  if (event.status === '已接受' || event.status === 'accepted') return 'accepted';
  if (event.status === '暂定' || event.status === 'tentative') return 'tentative';
  if (event.status === '已拒绝' || event.status === 'declined') return 'declined';
  if (event.status === '待响应' || event.status === 'pending' || event.status === 'unanswered') return 'unanswered';
  if (event.status === '已取消' || event.status === 'cancelled') return 'cancelled';
  return 'accepted';
};
export const accountMatchesSearchScope = (account, scope) => {
  if (!scope || scope === 'all') return true;
  if (!account) return false;
  if (scope === 'mine') return account.ownership !== 'shared';
  if (scope === 'shared') return account.ownership === 'shared';
  if (scope === 'huawei') return account.id === HUAWEI_ACCOUNT_ID;
  if (scope === 'group') return account.ownership === 'group' || account.type === 'group';
  if (scope === 'room') return account.ownership === 'room' || account.type === 'room';
  return account.id === scope;
};
export const eventMatchesSearchPerson = (event, personFilter) => {
  if (!personFilter || personFilter === 'all') return true;

  const [role, ...nameParts] = personFilter.split('::');
  const name = nameParts.join('::');
  if (!name) return true;

  const participants = [...(event.attendees || []), ...(event.optionalAttendees || [])].filter(Boolean);
  if (role === 'organizer') return event.organizer === name;
  if (role === 'participant') return participants.includes(name);

  return event.organizer === name || participants.includes(name);
};
export const eventMatchesMeetingType = (event, meetingType) => {
  if (!meetingType || meetingType === 'all') return true;

  const hasOnline = Boolean(event.meetingLink || (event.meetingProvider && event.meetingProvider !== 'none'));
  const hasLocation = Boolean(event.location);
  const isRecurring = Boolean(event.repeat && event.repeat !== 'does_not_repeat');
  const isCancelled = getNormalizedSearchStatus(event) === 'cancelled' || event.type === 'cancelled';

  if (meetingType === 'online') return hasOnline;
  if (meetingType === 'room') return hasLocation && !hasOnline;
  if (meetingType === 'no_location') return !hasLocation && !hasOnline;
  if (meetingType === 'recurring') return isRecurring;
  if (meetingType === 'cancelled') return isCancelled;

  return true;
};
export const eventMatchesAttachmentFilter = (event, attachmentFilter) => {
  if (!attachmentFilter || attachmentFilter === 'all') return true;

  const hasAttachments = (event.attachments || []).length > 0;
  if (attachmentFilter === 'has') return hasAttachments;
  if (attachmentFilter === 'none') return !hasAttachments;

  return true;
};
export const normalizeColorCategoryId = (value = '') => String(value || '').trim().toLowerCase();
export const getColorCategoryMeta = (value, labelOverrides = {}) => {
  const normalized = normalizeColorCategoryId(value);
  const matched =
    SEARCH_COLOR_CATEGORY_OPTIONS.find((option) => option.id === normalized || normalizeColorCategoryId(option.shortLabel) === normalized) ||
    null;

  if (!matched) return null;

  const overrideLabel = labelOverrides[matched.id];
  return overrideLabel ? { ...matched, label: overrideLabel, shortLabel: overrideLabel } : matched;
};
export const getEventColorCategories = (event = {}, labelOverrides = {}) => {
  const rawCategories = Array.isArray(event.colorCategories)
    ? event.colorCategories
    : Array.isArray(event.colorCategory)
      ? event.colorCategory
      : [event.colorCategory].filter(Boolean);

  return rawCategories
    .map((item) => {
      if (typeof item === 'object' && item) {
        const meta = getColorCategoryMeta(item.id || item.label, labelOverrides);
        return {
          id: normalizeColorCategoryId(item.id || meta?.id || item.label),
          label: labelOverrides[meta?.id] || item.label || meta?.shortLabel || item.id,
          colorClass: item.colorClass || meta?.colorClass || 'bg-slate-400',
        };
      }

      const meta = getColorCategoryMeta(item, labelOverrides);
      return {
        id: meta?.id || normalizeColorCategoryId(item),
        label: meta?.shortLabel || String(item || ''),
        colorClass: meta?.colorClass || 'bg-slate-400',
      };
    })
    .filter((item) => item.id && item.label);
};
export const eventMatchesColorCategory = (event, colorCategory) => {
  if (!colorCategory || colorCategory === 'all') return true;
  const categories = getEventColorCategories(event);
  if (colorCategory === 'none') return categories.length === 0;
  return categories.some((category) => category.id === colorCategory);
};
export const eventMatchesSearchTimeframe = (event, timeframe) => {
  if (!timeframe || timeframe === 'all') return true;

  const eventDate = stripTime(eventToDate(event));
  const today = stripTime(TODAY_DATE);

  if (timeframe === 'today') {
    return sameDay(eventDate, today);
  }

  if (timeframe === 'tomorrow') {
    return sameDay(eventDate, addDays(today, 1));
  }

  if (timeframe === 'this_week') {
    const start = getWeekStart(today);
    const end = addDays(start, 7);
    return eventDate >= start && eventDate < end;
  }

  if (timeframe === 'last_week') {
    const start = addDays(getWeekStart(today), -7);
    const end = addDays(start, 7);
    return eventDate >= start && eventDate < end;
  }

  if (timeframe === 'this_month') {
    return eventDate.getFullYear() === today.getFullYear() && eventDate.getMonth() === today.getMonth();
  }

  if (timeframe === 'next_30_days') {
    const end = addDays(today, 30);
    return eventDate >= today && eventDate <= end;
  }

  return true;
};
export const getEventStartTimestamp = (event) => {
  const date = eventToDate(event);
  const startH = event.isAllDay ? 0 : event.startH || WORK_START_HOUR;
  return stripTime(date).getTime() + startH * 60 * 60 * 1000;
};
export const getEventEndTimestamp = (event) => {
  const date = eventToDate(event);
  if (event.isAllDay) return stripTime(date).getTime() + DAY_MS * (event.allDaySpan || 1);

  const startH = event.startH || WORK_START_HOUR;
  const endH = startH + (event.durationH || 1);
  return stripTime(date).getTime() + endH * 60 * 60 * 1000;
};
export const canJoinCalendarEvent = (event, referenceDate = TODAY_DATE) => {
  if (!event?.meetingLink || !event.meetingProvider || event.meetingProvider === 'none') return false;
  if (event.status === '已取消' || event.type === 'cancelled') return false;

  const startValue = getEventStartTimestamp(event);
  const endValue = getEventEndTimestamp(event);
  return startValue - referenceDate.getTime() <= 15 * 60 * 1000 && endValue >= referenceDate.getTime();
};
export const getPrimarySearchAccountId = (accountOptions = []) => accountOptions[0]?.id || 'all';
export const getSearchSelectedAccountIds = (filters = {}, accountOptions = []) => {
  if (accountOptions.length === 0) return [];
  if (accountOptions.length === 1) return [accountOptions[0].id];

  if (filters.accountId === 'all') return accountOptions.map((account) => account.id);
  if (filters.accountId === 'custom') {
    const allowedIds = new Set(accountOptions.map((account) => account.id));
    const selected = (filters.accountIds || []).filter((id) => allowedIds.has(id));
    return selected.length > 0 ? selected : [getPrimarySearchAccountId(accountOptions)];
  }
  if (filters.accountId && filters.accountId !== 'current') return [filters.accountId];

  return [getPrimarySearchAccountId(accountOptions)];
};
export const getSearchAccountLabel = (filters = {}, accountOptions = []) => {
  if (accountOptions.length <= 1) return '';
  if (filters.accountId === 'all') return '账号：全部账号';

  const selectedIds = getSearchSelectedAccountIds(filters, accountOptions);
  if (filters.accountId === 'current') return '账号：当前账号';
  if (selectedIds.length > 1) return `账号：${selectedIds.length} 个账号`;

  const account = accountOptions.find((item) => item.id === selectedIds[0]);
  return `账号：${getAccountDisplayLabel(account) || account?.email || '指定账号'}`;
};
export const getSearchSourceAccountLabel = (account) => {
  if (!account) return '';
  const name = getAccountDisplayLabel(account) || account.name || '账号';
  const email = account.email || account.name || '';
  return email && email !== name ? `来源：${name}｜${email}` : `来源：${name}`;
};
export const joinRecipients = (items = []) => items.filter(Boolean).join('; ');
export const parseRecipients = (value) =>
  value
    .split(/[;,\n，；]/)
    .map((item) => item.trim())
    .filter(Boolean);
export const dedupeParticipants = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = normalizeParticipantIdentity(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
export const stripMailSubjectPrefixes = (subject = '') => subject.replace(/^(\s*(re|fw|fwd)\s*:\s*)+/gi, '').trim();
export const ensureSubjectPrefix = (subject, prefix) =>
  subject.toUpperCase().startsWith(`${prefix}:`) ? subject : `${prefix}: ${subject}`;
export const buildConferenceLink = (provider, title = '会议') => {
  const base = encodeURIComponent(String(title || 'meeting').trim()).replace(/%/g, '').slice(0, 18) || 'meeting';
  const suffix = `${base}${Date.now().toString(36).slice(-6)}`;

  if (provider === 'meet') return `https://meet.google.com/${suffix.slice(0, 10)}`;
  if (provider === 'teams') return `https://teams.microsoft.com/l/meetup-join/${suffix}`;
  if (provider === 'zoom') return `https://zoom.us/j/${suffix.replace(/\D/g, '').slice(0, 10) || '8612345678'}`;
  return '';
};
export const formatMailTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
export const formatWeekdayLabel = (date) => {
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
  return WEEKDAY_NAMES[dayIndex];
};
export const normalizeSelectionSlot = (slot) => ({
  ...slot,
  date: stripTime(slot.date),
  startH: slot.startH,
  endH: slot.endH ?? slot.startH + (slot.durationH || 1),
  durationH: slot.durationH ?? (slot.endH ?? slot.startH + 1) - slot.startH,
  laneId: slot.laneId || null,
});
export const selectionMatchesSlot = (selection, slot) =>
  Boolean(
    selection &&
      slot &&
      sameDay(selection.date, stripTime(slot.date)) &&
      (selection.laneId || null) === (slot.laneId || null) &&
      slot.hour >= selection.startH &&
      slot.hour < selection.endH,
  );

export const buildTimedEventLayout = (items) => {
  const sorted = [...items].sort((left, right) => {
    const leftStart = left.startH || WORK_START_HOUR;
    const rightStart = right.startH || WORK_START_HOUR;
    const leftEnd = leftStart + (left.durationH || 1);
    const rightEnd = rightStart + (right.durationH || 1);
    return leftStart - rightStart || leftEnd - rightEnd;
  });
  const result = {};
  let currentGroup = [];
  let columnEndTimes = [];
  let groupEnd = -Infinity;

  const flushGroup = () => {
    if (currentGroup.length === 0) return;
    const columnCount = Math.max(1, columnEndTimes.length);
    currentGroup.forEach((entry) => {
      result[entry.id] = {
        column: entry.column,
        columnCount,
      };
    });
    currentGroup = [];
    columnEndTimes = [];
    groupEnd = -Infinity;
  };

  sorted.forEach((item) => {
    const start = item.startH || WORK_START_HOUR;
    const end = start + (item.durationH || 1);

    if (currentGroup.length > 0 && start >= groupEnd) flushGroup();

    let column = columnEndTimes.findIndex((value) => value <= start);
    if (column === -1) {
      column = columnEndTimes.length;
      columnEndTimes.push(end);
    } else {
      columnEndTimes[column] = end;
    }

    currentGroup.push({ id: item.id, column });
    groupEnd = Math.max(groupEnd, end);
  });

  flushGroup();
  return result;
};

export const buildAllDayEventLayout = (items) => {
  const sorted = [...items].sort((left, right) => {
    const leftStart = left.day || 0;
    const rightStart = right.day || 0;
    const leftSpan = left.allDaySpan || 1;
    const rightSpan = right.allDaySpan || 1;
    return leftStart - rightStart || rightSpan - leftSpan;
  });
  const rowEndDays = [];
  const positions = {};

  sorted.forEach((item) => {
    const startDay = item.day || 0;
    const endDay = startDay + (item.allDaySpan || 1) - 1;
    let row = rowEndDays.findIndex((lastEndDay) => startDay > lastEndDay);

    if (row === -1) {
      row = rowEndDays.length;
      rowEndDays.push(endDay);
    } else {
      rowEndDays[row] = endDay;
    }

    positions[item.id] = { row };
  });

  return {
    positions,
    rowCount: Math.max(1, rowEndDays.length),
  };
};

export const buildWeekDays = (focusDate) => {
  const start = getWeekStart(focusDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(start, index);
    return {
      index,
      date,
      short: WEEKDAY_NAMES[index],
      dayNumber: date.getDate(),
      isToday: sameDay(date, TODAY_DATE),
    };
  });
};

export const buildMiniMonthCells = (focusDate) => {
  const monthStart = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
  // Monday-based: Sunday=0 -> 6, Mon=1->0, Tue=2->1, etc.
  const dayOfWeek = monthStart.getDay();
  const startOffset = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  const gridStart = addDays(monthStart, -startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      date,
      isCurrentMonth: date.getMonth() === focusDate.getMonth(),
      isToday: sameDay(date, TODAY_DATE),
    };
  });
};

export const formatRangeTitle = (layout, focusDate) => {
  if (layout === 'day') {
    const day = focusDate.getDay() === 0 ? 6 : focusDate.getDay() - 1;
    return `${focusDate.getMonth() + 1}月 ${focusDate.getDate()}日 ${WEEKDAY_NAMES[day]}`;
  }

  if (layout === 'month') {
    return `${focusDate.getFullYear()}年 ${focusDate.getMonth() + 1}月`;
  }

  const weekDays = buildWeekDays(focusDate);
  const first = weekDays[0].date;
  const last = weekDays[6].date;
  const sameMonthRange = first.getMonth() === last.getMonth();
  return sameMonthRange
    ? `${first.getMonth() + 1}月 ${first.getDate()}日–${last.getDate()}日`
    : `${first.getMonth() + 1}月 ${first.getDate()}日–${last.getMonth() + 1}月 ${last.getDate()}日`;
};

export const eventMatchesLayout = (event, layout, focusDate) => {
  const eventDate = eventToDate(event);

  if (layout === 'day') return sameDay(eventDate, focusDate);
  if (layout === 'month') return sameMonth(eventDate, focusDate);

  const weekStart = getWeekStart(focusDate);
  const weekEnd = addDays(weekStart, 7);
  return eventDate >= weekStart && eventDate < weekEnd;
};

export const sortEvents = (events) =>
  [...events].sort((left, right) => {
    const leftDate = eventToDate(left).getTime();
    const rightDate = eventToDate(right).getTime();

    if (leftDate !== rightDate) return leftDate - rightDate;
    if ((left.isAllDay ? 1 : 0) !== (right.isAllDay ? 1 : 0)) return left.isAllDay ? -1 : 1;
    if ((left.startH || 0) !== (right.startH || 0)) return (left.startH || 0) - (right.startH || 0);
    return (right.durationH || 1) - (left.durationH || 1);
  });

export const getCurrentTimeHour = () => TODAY_DATE.getHours() + TODAY_DATE.getMinutes() / 60;
export const isBusyOnlyEvent = (event, calendar) =>
  event?.type === 'busy_only' || getCalendarPermissionId(calendar?.receivedPermissionId || calendar?.permission) === 'busy_only';
export const isPrivateLimitedEvent = (event, calendar) =>
  event?.visibility === 'private' && calendar?.type === 'shared' && calendar?.canViewPrivate === false;
export const getVisibleEventTitle = (event, calendar) => {
  if (isBusyOnlyEvent(event, calendar)) return '忙碌';
  if (isPrivateLimitedEvent(event, calendar)) return '私密日程';
  return event?.title || '无标题';
};
export const getCompactSourceLabel = (account, calendar) => {
  const raw = getAccountPersonLabel(account) || calendar?.owner || calendar?.name || account?.email || '';
  if (!raw) return '';
  return raw.includes('@') ? raw.split('@')[0] : raw.replace(/[()（）]/g, '').slice(0, 6);
};
export const getEventSecondaryLine = (event, calendar) => {
  if (isBusyOnlyEvent(event, calendar) || isPrivateLimitedEvent(event, calendar)) return '';
  const place = event.location || (event.meetingProvider && event.meetingProvider !== 'none' ? MEETING_PROVIDER_LABELS[event.meetingProvider] : '');
  const people = event.organizer || (event.attendees?.length ? `${event.attendees[0]}等 ${event.attendees.length} 人` : '');
  return [place, people].filter(Boolean).join(' · ');
};

const EVENT_TONE_BY_COLOR_CLASS = {
  'bg-blue-500': { container: 'bg-blue-50 border-blue-200 text-slate-950', stripe: 'bg-blue-500' },
  'bg-cyan-500': { container: 'bg-cyan-50 border-cyan-200 text-slate-950', stripe: 'bg-cyan-500' },
  'bg-sky-500': { container: 'bg-sky-50 border-sky-200 text-slate-950', stripe: 'bg-sky-500' },
  'bg-emerald-500': { container: 'bg-emerald-50 border-emerald-200 text-slate-950', stripe: 'bg-emerald-500' },
  'bg-green-500': { container: 'bg-green-50 border-green-200 text-slate-950', stripe: 'bg-green-500' },
  'bg-teal-500': { container: 'bg-teal-50 border-teal-200 text-slate-950', stripe: 'bg-teal-500' },
  'bg-violet-500': { container: 'bg-violet-50 border-violet-200 text-slate-950', stripe: 'bg-violet-500' },
  'bg-purple-500': { container: 'bg-purple-50 border-purple-200 text-slate-950', stripe: 'bg-purple-500' },
  'bg-fuchsia-500': { container: 'bg-fuchsia-50 border-fuchsia-200 text-slate-950', stripe: 'bg-fuchsia-500' },
  'bg-orange-500': { container: 'bg-orange-50 border-orange-200 text-slate-950', stripe: 'bg-orange-500' },
  'bg-amber-500': { container: 'bg-amber-50 border-amber-200 text-slate-950', stripe: 'bg-amber-500' },
  'bg-yellow-500': { container: 'bg-yellow-50 border-yellow-200 text-slate-950', stripe: 'bg-yellow-500' },
  'bg-red-500': { container: 'bg-red-50 border-red-200 text-slate-950', stripe: 'bg-red-500' },
  'bg-rose-500': { container: 'bg-rose-50 border-rose-200 text-slate-950', stripe: 'bg-rose-500' },
  'bg-pink-500': { container: 'bg-pink-50 border-pink-200 text-slate-950', stripe: 'bg-pink-500' },
  'bg-slate-500': { container: 'bg-slate-50 border-slate-300 text-slate-950', stripe: 'bg-slate-500' },
  'bg-gray-500': { container: 'bg-gray-50 border-gray-300 text-slate-950', stripe: 'bg-gray-500' },
  'bg-zinc-500': { container: 'bg-zinc-50 border-zinc-300 text-slate-950', stripe: 'bg-zinc-500' },
};

export const getToneClasses = (event, colorClass) => {
  const isBusyOnly = event.type === 'busy_only';
  const isCancelled = event.status === '已取消';
  const isRejected = event.status === '已拒绝';
  const isDraft = event.status === '草稿';

  if (isBusyOnly) {
    return {
      container: 'bg-gray-100 border-gray-300 text-gray-500',
      stripe: 'bg-gray-300',
    };
  }

  if (isCancelled) {
    return {
      container: 'bg-gray-50 border-gray-300 border-dashed text-gray-500 opacity-80',
      stripe: 'bg-gray-300',
    };
  }

  if (isRejected) {
    return {
      container: 'bg-slate-50 border-slate-300 text-slate-500',
      stripe: 'bg-slate-400',
    };
  }

  if (isDraft) {
    return {
      container: 'bg-slate-50 border-slate-300 text-slate-700',
      stripe: 'bg-slate-400',
    };
  }

  return EVENT_TONE_BY_COLOR_CLASS[colorClass] || EVENT_TONE_BY_COLOR_CLASS['bg-blue-500'];
};

export const getDefaultEditableCalendarId = (calendars, activeAccountIds, preferredAccountId = null) => {
  const visibleEditable = calendars.filter(
    (calendar) => activeAccountIds.includes(calendar.accountId) && canEditCalendarContent(calendar),
  );

  const preferredAccountCalendar = preferredAccountId
    ? visibleEditable.find((calendar) => calendar.accountId === preferredAccountId)
    : null;
  const preferred = visibleEditable.find((calendar) => calendar.type === 'my');

  return preferredAccountCalendar?.id || preferred?.id || visibleEditable[0]?.id || calendars.find((calendar) => canEditCalendarContent(calendar))?.id;
};

export const buildDraftForm = ({ event, slot, focusDate, calendars, activeAccountIds }) => {
  const baseDate = stripTime(event ? eventToDate(event) : slot?.date || focusDate);
  const parts = dateToEventParts(baseDate);
  const calId = event?.calId || slot?.preferredCalendarId || getDefaultEditableCalendarId(calendars, activeAccountIds, slot?.preferredAccountId);
  const calendar = calendars.find((item) => item.id === calId) || calendars[0];
  const startH = event?.startH ?? slot?.startH ?? slot?.h ?? getDefaultDraftStartHour(baseDate);
  const durationH = event?.durationH ?? slot?.durationH ?? 1;
  const kindDefaults = EVENT_KIND_DEFAULTS.event;
  const linkedAccount = MOCK_ACCOUNTS.find((account) => account.id === calendar?.accountId);
  const organizer = event?.organizer ?? linkedAccount?.email ?? calendar?.owner ?? '我';
  const normalizedAttendees = Array.from(new Set((event?.attendees || []).filter(Boolean))).filter((person) => person !== organizer);
  const optionalAttendees = Array.from(new Set(event?.optionalAttendees || [])).filter(Boolean);
  const inferredMeetingProvider =
    event?.meetingProvider ??
    (event?.meetingLink ? 'meet' : event?.location === '线上会议' ? 'meet' : 'none');
  const normalizedAttachments = (event?.attachments || [])
    .map((item) => (typeof item === 'string' ? item : item?.name))
    .filter(Boolean);

  return {
    eventId: event?.id ?? null,
    date: baseDate,
    weekOffset: event?.weekOffset ?? parts.weekOffset,
    day: event?.day ?? parts.day,
    startH,
    durationH,
    timeText: formatDraftTime(baseDate, startH, durationH),
    title: event?.title ?? '',
    calId: calId || '',
    organizer,
    location: event?.location ?? '',
    description: event?.description ?? '',
    attendees: normalizedAttendees,
    optionalAttendees,
    inviteInput: '',
    optionalInviteInput: '',
    kind: 'event',
    meetingProvider: inferredMeetingProvider,
    meetingLink: event?.meetingLink ?? '',
    repeat: event?.repeat ?? 'does_not_repeat',
    reminder: event?.reminder ?? kindDefaults.reminder,
    availability: event?.availability === 'out_of_office' ? 'busy' : event?.availability ?? kindDefaults.availability,
    visibility: event?.visibility ?? kindDefaults.visibility,
    attachments: normalizedAttachments,
  };
};

export const MOCK_ACCOUNTS = [
  {
    id: 'acc1',
    name: 'me@calendarpro.io',
    displayName: '小华',
    email: 'me@calendarpro.io',
    role: '我的账户',
    ownership: 'self',
    color: 'bg-blue-500',
    checked: true,
    mailboxMembers: [
      { id: 'mb1', name: '我', email: 'me@calendarpro.io', fullAccess: true, sendAs: true, sendOnBehalf: false },
      { id: 'mb2', name: '产品经理', email: 'pm@calendarpro.io', fullAccess: true, sendAs: false, sendOnBehalf: true },
    ],
    mailboxSettings: {
      showInAddressList: true,
      saveSentItems: true,
      automap: true,
      mobileAccess: true,
    },
  },
  {
    id: HUAWEI_ACCOUNT_ID,
    name: 'huawei-calendar@calendarpro.io',
    displayName: '华为日历',
    email: 'huawei-calendar@calendarpro.io',
    role: '我的账户',
    ownership: 'self',
    color: 'bg-red-500',
    checked: true,
    mailboxMembers: [],
    mailboxSettings: {
      showInAddressList: true,
      saveSentItems: false,
      automap: false,
      mobileAccess: true,
    },
  },
  {
    id: 'acc2',
    name: 'ea@calendarpro.io',
    displayName: '张三',
    email: 'ea@calendarpro.io',
    role: '其他账户',
    ownership: 'shared',
    color: 'bg-orange-500',
    checked: true,
    mailboxMembers: [
      { id: 'mb3', name: '我', email: 'me@calendarpro.io', fullAccess: true, sendAs: true, sendOnBehalf: true },
      { id: 'mb4', name: '行政助理组', email: 'ea-team@calendarpro.io', fullAccess: true, sendAs: false, sendOnBehalf: true },
    ],
    mailboxSettings: {
      showInAddressList: true,
      saveSentItems: true,
      automap: true,
      mobileAccess: true,
    },
  },
  {
    id: 'acc3',
    name: 'sales@calendarpro.io',
    displayName: '李四',
    email: 'sales@calendarpro.io',
    role: '其他账户',
    ownership: 'shared',
    color: 'bg-emerald-500',
    checked: true,
    mailboxMembers: [
      { id: 'mb5', name: '销售团队', email: 'sales@calendarpro.io', fullAccess: true, sendAs: true, sendOnBehalf: false },
      { id: 'mb6', name: '我', email: 'me@calendarpro.io', fullAccess: true, sendAs: false, sendOnBehalf: true },
    ],
    mailboxSettings: {
      showInAddressList: true,
      saveSentItems: true,
      automap: false,
      mobileAccess: true,
    },
  },
  {
    id: 'acc4',
    name: 'product-group@calendarpro.io',
    displayName: '产品项目组',
    email: 'product-group@calendarpro.io',
    role: '群组账户',
    ownership: 'group',
    color: 'bg-cyan-500',
    checked: true,
    mailboxMembers: [
      { id: 'mb7', name: '产品项目组', email: 'product-group@calendarpro.io', fullAccess: true, sendAs: false, sendOnBehalf: true },
      { id: 'mb8', name: '我', email: 'me@calendarpro.io', fullAccess: true, sendAs: false, sendOnBehalf: true },
    ],
    mailboxSettings: {
      showInAddressList: true,
      saveSentItems: true,
      automap: true,
      mobileAccess: true,
    },
  },
  {
    id: 'acc5',
    name: 'rooms@calendarpro.io',
    displayName: '会议室资源',
    email: 'rooms@calendarpro.io',
    role: '资源账户',
    ownership: 'room',
    color: 'bg-amber-500',
    checked: true,
    mailboxMembers: [
      { id: 'mb9', name: '会议室管理员', email: 'rooms-admin@calendarpro.io', fullAccess: true, sendAs: true, sendOnBehalf: false },
      { id: 'mb10', name: '我', email: 'me@calendarpro.io', fullAccess: false, sendAs: false, sendOnBehalf: true },
    ],
    mailboxSettings: {
      showInAddressList: true,
      saveSentItems: false,
      automap: false,
      mobileAccess: true,
    },
  },
];

export const MOCK_CALENDARS = [
  {
    id: 'c1',
    accountId: 'acc1',
    name: '小华',
    type: 'my',
    owner: '小华',
    color: 'bg-blue-500',
    checked: true,
    permission: '可编辑',
    isPrimary: true,
    defaultSharing: {
      organization: 'busy_only',
      external: 'none',
    },
    publishing: {
      enabled: true,
      permission: 'titles_locations',
      htmlLink: 'https://calendarpro.io/publish/c1/html',
      icsLink: 'https://calendarpro.io/publish/c1/ics',
    },
    sharing: [
      {
        id: 'share1',
        name: '陈晨',
        email: 'pm@calendarpro.io',
        scope: 'internal',
        permission: 'all_details',
        status: 'accepted',
        updatedAt: new Date(2026, 0, 7, 16, 20).getTime(),
        canViewPrivate: false,
        meetingResponses: 'delegate_only',
      },
      {
        id: 'share2',
        name: '刘洋',
        email: 'liuyang@calendarpro.io',
        scope: 'internal',
        permission: 'edit',
        status: 'accepted',
        updatedAt: new Date(2026, 0, 8, 9, 10).getTime(),
        canViewPrivate: true,
        meetingResponses: 'delegate_copy',
      },
    ],
  },
  {
    id: 'c2',
    accountId: 'acc1',
    name: '小华',
    type: 'my',
    owner: '小华',
    color: 'bg-violet-500',
    checked: true,
    permission: '可编辑',
    isPrimary: false,
    defaultSharing: {
      organization: 'titles_locations',
      external: 'none',
    },
    publishing: {
      enabled: false,
      permission: 'all_details',
      htmlLink: 'https://calendarpro.io/publish/c2/html',
      icsLink: 'https://calendarpro.io/publish/c2/ics',
    },
    sharing: [
      {
        id: 'share3',
        name: '周琳',
        email: 'zhoulin@calendarpro.io',
        scope: 'internal',
        permission: 'edit',
        status: 'pending',
        updatedAt: new Date(2026, 0, 9, 8, 40).getTime(),
        canViewPrivate: false,
        meetingResponses: 'delegate_only',
      },
    ],
  },
  {
    id: HUAWEI_CALENDAR_ID,
    accountId: HUAWEI_ACCOUNT_ID,
    name: '华为日历',
    type: 'my',
    owner: '华为日历',
    color: 'bg-red-500',
    checked: true,
    permission: '仅查看详情',
    isPrimary: false,
    defaultSharing: {
      organization: 'busy_only',
      external: 'none',
    },
    publishing: {
      enabled: false,
      permission: 'all_details',
      htmlLink: 'https://calendarpro.io/publish/c-huawei/html',
      icsLink: 'https://calendarpro.io/publish/c-huawei/ics',
    },
    sharing: [],
  },
  {
    id: 'c3',
    accountId: 'acc2',
    name: '张三',
    type: 'shared',
    owner: '张三',
    color: 'bg-orange-500',
    checked: true,
    permission: '可编辑',
    isPrimary: true,
    receivedFrom: 'ea@calendarpro.io',
    receivedFromName: '张三',
    receivedPermissionId: 'edit',
    receivedStatus: 'accepted',
    updatedAt: new Date(2026, 0, 6, 18, 30).getTime(),
    defaultSharing: {
      organization: 'busy_only',
      external: 'none',
    },
    publishing: {
      enabled: false,
      permission: 'busy_only',
      htmlLink: 'https://calendarpro.io/publish/c3/html',
      icsLink: 'https://calendarpro.io/publish/c3/ics',
    },
    sharing: [
      {
        id: 'share4',
        name: '我',
        email: 'me@calendarpro.io',
        scope: 'internal',
        permission: 'edit',
        status: 'accepted',
        updatedAt: new Date(2026, 0, 6, 18, 30).getTime(),
        canViewPrivate: false,
        meetingResponses: 'delegate_only',
      },
    ],
  },
  {
    id: 'c4',
    accountId: 'acc2',
    name: '张三',
    type: 'shared',
    owner: '张三',
    color: 'bg-slate-500',
    checked: true,
    permission: '仅查看闲忙',
    isPrimary: true,
    receivedFrom: 'ea@calendarpro.io',
    receivedFromName: '张三',
    receivedPermissionId: 'busy_only',
    receivedStatus: 'accepted',
    updatedAt: new Date(2026, 0, 5, 11, 0).getTime(),
    defaultSharing: {
      organization: 'busy_only',
      external: 'none',
    },
    publishing: {
      enabled: false,
      permission: 'busy_only',
      htmlLink: 'https://calendarpro.io/publish/c4/html',
      icsLink: 'https://calendarpro.io/publish/c4/ics',
    },
    sharing: [
      {
        id: 'share5',
        name: '我',
        email: 'me@calendarpro.io',
        scope: 'internal',
        permission: 'busy_only',
        status: 'accepted',
        updatedAt: new Date(2026, 0, 5, 11, 0).getTime(),
        canViewPrivate: false,
        meetingResponses: 'delegate_only',
      },
    ],
  },
  {
    id: 'c5',
    accountId: 'acc3',
    name: '李四',
    type: 'shared',
    owner: '李四',
    color: 'bg-emerald-500',
    checked: true,
    permission: '可编辑',
    isPrimary: false,
    receivedFrom: 'sales@calendarpro.io',
    receivedFromName: '李四',
    receivedPermissionId: 'edit',
    receivedStatus: 'accepted',
    updatedAt: new Date(2026, 0, 4, 10, 10).getTime(),
    defaultSharing: {
      organization: 'titles_locations',
      external: 'busy_only',
    },
    publishing: {
      enabled: true,
      permission: 'all_details',
      htmlLink: 'https://calendarpro.io/publish/c5/html',
      icsLink: 'https://calendarpro.io/publish/c5/ics',
    },
    sharing: [
      {
        id: 'share6',
        name: '赵磊',
        email: 'advisor@vendor.com',
        scope: 'external',
        permission: 'titles_locations',
        status: 'accepted',
        updatedAt: new Date(2026, 0, 4, 9, 20).getTime(),
        canViewPrivate: false,
        meetingResponses: 'delegate_only',
      },
      {
        id: 'share7',
        name: '我',
        email: 'me@calendarpro.io',
        scope: 'internal',
        permission: 'edit',
        status: 'accepted',
        updatedAt: new Date(2026, 0, 4, 10, 10).getTime(),
        canViewPrivate: false,
        meetingResponses: 'delegate_only',
      },
    ],
  },
  {
    id: 'c6',
    accountId: 'acc4',
    name: '产品项目组',
    type: 'group',
    owner: '产品项目组',
    color: 'bg-cyan-500',
    checked: true,
    permission: '可编辑',
    isPrimary: true,
    defaultSharing: {
      organization: 'titles_locations',
      external: 'busy_only',
    },
    publishing: {
      enabled: true,
      permission: 'titles_locations',
      htmlLink: 'https://calendarpro.io/publish/c6/html',
      icsLink: 'https://calendarpro.io/publish/c6/ics',
    },
    sharing: [
      {
        id: 'share8',
        name: '我',
        email: 'me@calendarpro.io',
        scope: 'internal',
        permission: 'edit',
        status: 'accepted',
        updatedAt: new Date(2026, 0, 8, 14, 10).getTime(),
        canViewPrivate: false,
        meetingResponses: 'delegate_copy',
      },
    ],
  },
  {
    id: 'c7',
    accountId: 'acc5',
    name: '会议室资源',
    type: 'room',
    owner: '会议室资源',
    color: 'bg-amber-500',
    checked: true,
    permission: '仅查看详情',
    isPrimary: true,
    defaultSharing: {
      organization: 'titles_locations',
      external: 'none',
    },
    publishing: {
      enabled: false,
      permission: 'titles_locations',
      htmlLink: 'https://calendarpro.io/publish/c7/html',
      icsLink: 'https://calendarpro.io/publish/c7/ics',
    },
    sharing: [
      {
        id: 'share9',
        name: '我',
        email: 'me@calendarpro.io',
        scope: 'internal',
        permission: 'titles_locations',
        status: 'accepted',
        updatedAt: new Date(2026, 0, 8, 15, 25).getTime(),
        canViewPrivate: false,
        meetingResponses: 'delegate_only',
      },
    ],
  },
];

export const HUAWEI_HOLIDAY_EVENTS = [
  createAllDayCalendarEvent({
    id: 'huawei-holiday-2026-new-year',
    title: '元旦',
    date: new Date(2026, 0, 1),
    calId: HUAWEI_CALENDAR_ID,
    type: 'holiday',
  }),
  createAllDayCalendarEvent({
    id: 'huawei-holiday-2026-spring-festival',
    title: '春节假期',
    date: new Date(2026, 1, 16),
    span: 7,
    calId: HUAWEI_CALENDAR_ID,
    type: 'holiday',
  }),
  createAllDayCalendarEvent({
    id: 'huawei-holiday-2026-qingming',
    title: '清明节',
    date: new Date(2026, 3, 5),
    calId: HUAWEI_CALENDAR_ID,
    type: 'holiday',
  }),
  createAllDayCalendarEvent({
    id: 'huawei-holiday-2026-labor',
    title: '劳动节',
    date: new Date(2026, 4, 1),
    span: 3,
    calId: HUAWEI_CALENDAR_ID,
    type: 'holiday',
  }),
  createAllDayCalendarEvent({
    id: 'huawei-holiday-2026-dragon-boat',
    title: '端午节',
    date: new Date(2026, 5, 19),
    calId: HUAWEI_CALENDAR_ID,
    type: 'holiday',
  }),
  createAllDayCalendarEvent({
    id: 'huawei-holiday-2026-mid-autumn',
    title: '中秋节',
    date: new Date(2026, 8, 25),
    calId: HUAWEI_CALENDAR_ID,
    type: 'holiday',
  }),
  createAllDayCalendarEvent({
    id: 'huawei-holiday-2026-national-day',
    title: '国庆假期',
    date: new Date(2026, 9, 1),
    span: 7,
    calId: HUAWEI_CALENDAR_ID,
    type: 'holiday',
  }),
];

export const DEMO_EVENT_TEMPLATES = [
  {
    title: 'Q4 预算滚动复盘',
    location: '会议室 301',
    organizer: '王芳（财务部）',
    attendees: ['李强', '陈晨', '我', '财务预算组'],
    description: '复盘 Q4 预算 使用进度，确认下周需要调整的预算项。',
    meetingProvider: 'teams',
    attachments: ['Q4预算滚动表.xlsx', '预算口径说明.pdf'],
    colorCategory: 'project',
  },
  {
    title: '客户方案评审',
    location: '线上会议',
    organizer: '张伟（客户成功部）',
    attendees: ['林茜', '王璐', '我', '客户代表'],
    optionalAttendees: ['外部顾问'],
    description: '评审重点客户方案，确认报价、交付边界和风险项。',
    meetingProvider: 'zoom',
    attachments: ['客户方案_v3.pptx'],
    colorCategory: 'customer',
  },
  {
    title: '产品路线图同步',
    location: '产品区讨论室',
    organizer: '产品经理',
    attendees: ['设计负责人', '研发负责人', '我', '产品项目组'],
    description: '同步产品路线图、发布节奏和跨团队依赖。',
    meetingProvider: 'meet',
    attachments: ['路线图草案.pdf'],
    colorCategory: 'project',
  },
  {
    title: '渠道复盘与线索分配',
    location: '销售区 2F',
    organizer: '销售团队',
    attendees: ['运营经理', '销售团队', '我', '区域负责人'],
    description: '复盘渠道线索转化表现，并分配下周重点跟进客户。',
    meetingProvider: 'none',
    attachments: ['渠道线索清单.xlsx'],
    colorCategory: 'customer',
  },
  {
    title: '招聘面试校准会',
    location: '5号会议室',
    organizer: 'HRBP（人力资源部）',
    attendees: ['研发负责人', '产品经理', '我'],
    description: '校准候选人反馈，确认后续面试安排。',
    meetingProvider: 'none',
    attachments: [],
    colorCategory: 'todo',
  },
  {
    title: '供应商合同评审',
    location: '法务会议室',
    organizer: '法务专员',
    attendees: ['采购经理', '陈晨', '我', '财务分析师'],
    description: '评审供应商合同条款、付款节点和审批附件。',
    meetingProvider: 'teams',
    attachments: ['合同评审清单.docx'],
    colorCategory: 'important',
  },
  {
    title: '培训资料准备会',
    location: '培训教室',
    organizer: '培训负责人',
    attendees: ['运营经理', '客服主管', '我'],
    description: '确认培训资料、讲师安排和签到方式。',
    meetingProvider: 'none',
    attachments: ['培训资料目录.xlsx'],
    colorCategory: 'todo',
  },
  {
    title: '会议室设备巡检',
    location: '会议室 502',
    organizer: '会议室管理员',
    attendees: ['行政助理组', 'IT 支持', '我'],
    description: '检查会议室投屏、麦克风和白板设备。',
    meetingProvider: 'none',
    attachments: [],
    colorCategory: 'important',
  },
  {
    title: '数据看板验收',
    location: '线上会议',
    organizer: '数据分析师',
    attendees: ['运营经理', '产品经理', '我', '研发负责人'],
    description: '验收经营数据看板，确认指标口径和权限范围。',
    meetingProvider: 'meet',
    attachments: ['看板验收记录.xlsx'],
    colorCategory: 'project',
  },
  {
    title: '运营活动排期会',
    location: '运营作战室',
    organizer: '运营经理',
    attendees: ['市场负责人', '销售团队', '我'],
    description: '排期下月运营活动，确认内容、预算和投放渠道。',
    meetingProvider: 'teams',
    attachments: ['活动排期表.xlsx'],
    colorCategory: 'customer',
  },
  {
    title: '安全合规检查',
    location: '安全会议室',
    organizer: '安全负责人',
    attendees: ['IT 支持', '法务专员', '我'],
    description: '检查账号权限、共享范围和外部访问记录。',
    meetingProvider: 'none',
    attachments: ['合规检查项.pdf'],
    colorCategory: 'important',
  },
  {
    title: '项目里程碑评审',
    location: '大圆桌会议室',
    organizer: '项目经理',
    attendees: ['产品项目组', '研发负责人', '设计负责人', '我'],
    description: '评审项目里程碑、资源缺口和延期风险。',
    meetingProvider: 'teams',
    attachments: ['里程碑计划.mpp'],
    colorCategory: 'project',
  },
];

export const DEMO_EVENT_CALENDAR_IDS = ['c1', 'c2', 'c3', 'c5', 'c6', 'c7'];
export const DEMO_EVENT_TIME_SLOTS = [8.5, 9, 9.5, 10, 10.5, 11, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17];
export const DEMO_EVENT_DURATIONS = [0.5, 1, 1, 1.5, 2];
export const DEMO_ROOM_NAMES = ['会议室 301', '会议室 502', '大圆桌会议室', '培训教室', '法务会议室', '运营作战室'];
export const DEMO_REPEAT_OPTIONS = ['does_not_repeat', 'does_not_repeat', 'does_not_repeat', 'every_week', 'every_month'];
export const DEMO_MEETING_PROVIDERS = ['teams', 'meet', 'zoom', 'none'];

export const createDemoTimedEvents = (count = 168) =>
  Array.from({ length: count }, (_, index) => {
    const template = DEMO_EVENT_TEMPLATES[index % DEMO_EVENT_TEMPLATES.length];
    const weekIndex = Math.floor(index / 12) - 6;
    const dayIndex = (index * 2 + Math.floor(index / 12)) % 5;
    const date = addDays(getWeekStart(TODAY_DATE), weekIndex * 7 + dayIndex);
    const calId = DEMO_EVENT_CALENDAR_IDS[(index * 5 + Math.floor(index / 7)) % DEMO_EVENT_CALENDAR_IDS.length];
    const startH = DEMO_EVENT_TIME_SLOTS[(index * 7) % DEMO_EVENT_TIME_SLOTS.length];
    const durationH = DEMO_EVENT_DURATIONS[index % DEMO_EVENT_DURATIONS.length];
    const status = index % 37 === 0 ? '已取消' : index % 23 === 0 ? '已拒绝' : index % 19 === 0 ? '待响应' : '已接受';
    const roomEvent = calId === 'c7';
    const meetingProvider = roomEvent
      ? 'none'
      : template.meetingProvider === 'none'
        ? DEMO_MEETING_PROVIDERS[index % DEMO_MEETING_PROVIDERS.length]
        : template.meetingProvider;
    const title = roomEvent ? `会议室预订 · ${template.title}` : template.title;
    const location = roomEvent ? DEMO_ROOM_NAMES[index % DEMO_ROOM_NAMES.length] : template.location;
    const attachments = index % 3 === 0 ? template.attachments : index % 7 === 0 ? [`${template.title}材料.pdf`] : [];

    return {
      id: `demo-event-${String(index + 1).padStart(3, '0')}`,
      title,
      ...dateToEventParts(date),
      startH,
      durationH,
      calId,
      location,
      organizer: roomEvent ? '会议室管理员' : template.organizer,
      status,
      description: `${template.description} 本条为演示数据 ${index + 1}。`,
      type: status === '已取消' ? 'cancelled' : 'normal',
      attendees: template.attendees,
      optionalAttendees: index % 4 === 0 ? [...(template.optionalAttendees || []), '外部顾问'] : template.optionalAttendees || [],
      meetingProvider,
      meetingLink: meetingProvider === 'none' ? '' : `https://calendarpro.io/demo-meeting/${index + 1}`,
      repeat: DEMO_REPEAT_OPTIONS[index % DEMO_REPEAT_OPTIONS.length],
      reminder: index % 5 === 0 ? '10m' : '30m',
      availability: 'busy',
      visibility: index % 41 === 0 ? 'private' : 'default',
      kind: 'event',
      attachments,
      colorCategory: template.colorCategory,
    };
  });

export const createDemoAllDayEvents = (count = 18) =>
  Array.from({ length: count }, (_, index) => {
    const template = DEMO_EVENT_TEMPLATES[(index * 3) % DEMO_EVENT_TEMPLATES.length];
    const date = addDays(getWeekStart(TODAY_DATE), (Math.floor(index / 3) - 3) * 7 + (index % 5));
    const showOngoingJoinDemo = index === 9;
    const meetingProvider = showOngoingJoinDemo ? 'teams' : 'none';

    return {
      id: `demo-all-day-${String(index + 1).padStart(2, '0')}`,
      title: `${template.title}准备周`,
      ...dateToEventParts(date),
      startH: 0,
      durationH: 24,
      calId: DEMO_EVENT_CALENDAR_IDS[(index * 2) % DEMO_EVENT_CALENDAR_IDS.length],
      location: '',
      organizer: template.organizer,
      status: '已接受',
      description: `${template.title}相关材料集中准备与跨天占用。`,
      type: 'normal',
      attendees: template.attendees,
      meetingProvider,
      meetingLink: meetingProvider === 'none' ? '' : `https://teams.microsoft.com/l/meetup-join/demo-all-day-${index + 1}`,
      repeat: 'does_not_repeat',
      reminder: '1d',
      availability: 'busy',
      visibility: 'default',
      kind: 'event',
      isAllDay: true,
      allDaySpan: (index % 3) + 1,
      attachments: index % 2 === 0 ? [`${template.title}准备清单.xlsx`] : [],
      colorCategory: template.colorCategory,
    };
  });

export const createDemoBusyBlocks = (count = 18) =>
  Array.from({ length: count }, (_, index) => {
    const date = addDays(getWeekStart(TODAY_DATE), (Math.floor(index / 3) - 3) * 7 + ((index * 2) % 5));

    return {
      id: `demo-busy-only-${String(index + 1).padStart(2, '0')}`,
      title: '共享日历忙碌占用',
      ...dateToEventParts(date),
      startH: DEMO_EVENT_TIME_SLOTS[(index * 4) % DEMO_EVENT_TIME_SLOTS.length],
      durationH: DEMO_EVENT_DURATIONS[index % DEMO_EVENT_DURATIONS.length],
      calId: 'c4',
      location: '',
      organizer: '张三',
      status: '已接受',
      description: '',
      type: 'busy_only',
      attendees: ['张三'],
      meetingProvider: 'none',
      meetingLink: '',
      repeat: 'does_not_repeat',
      reminder: 'none',
      availability: 'busy',
      visibility: 'private',
      kind: 'event',
    };
  });

export const BULK_DEMO_EVENTS = [
  ...createDemoTimedEvents(),
  ...createDemoAllDayEvents(),
  ...createDemoBusyBlocks(),
];

export const MOCK_EVENTS = [
  ...HUAWEI_HOLIDAY_EVENTS,
  ...BULK_DEMO_EVENTS,
  {
    id: 'q4-budget-review',
    title: 'Q4 预算评审会',
    day: 4,
    startH: 10.58,
    durationH: 1,
    calId: 'c1',
    location: '',
    organizer: '王芳（财务部）',
    status: '已接受',
    description: '请各部门准备 Q4 预算 数据，并在会前反馈关键调整项。',
    type: 'normal',
    weekOffset: 0,
    attendees: ['王芳（财务部）', '李强', '陈晨', '我', '预算组'],
    optionalAttendees: ['运营经理', '采购经理'],
    meetingProvider: 'teams',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/q4-budget-review',
    repeat: 'does_not_repeat',
    reminder: '10m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    attachments: ['Q4 预算分配表.xlsx', '预算调整说明.pdf'],
    colorCategory: 'project',
  },
  {
    id: 'q4-budget-sync',
    title: '预算同步周会',
    day: 4,
    startH: 11,
    durationH: 0.5,
    calId: 'c1',
    location: '5号会议室',
    organizer: '赵敏（预算组）',
    status: '已接受',
    description: '同步 Q4 预算 周会口径，确认各部门提交节奏。',
    type: 'normal',
    weekOffset: 0,
    attendees: ['赵敏（预算组）', '周婷', '刘洋', '我', '财务预算组'],
    optionalAttendees: ['行政采购组'],
    meetingProvider: 'none',
    meetingLink: '',
    repeat: 'every_week',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    attachments: ['预算周会资料.pdf'],
    colorCategory: 'important',
  },
  {
    id: 'q4-customer-budget',
    title: '客户预算沟通会',
    day: 4,
    startH: 18.5,
    durationH: 1,
    calId: 'c1',
    location: '',
    organizer: '张伟（客户成功部）',
    status: '已接受',
    description: '围绕客户 Q4 预算 方案、采购排期和外部确认人进行沟通。',
    type: 'normal',
    weekOffset: 0,
    attendees: ['张伟（客户成功部）', '林茜', '王璐', '我', '客户代表'],
    optionalAttendees: ['外部顾问 A', '外部顾问 B'],
    meetingProvider: 'zoom',
    meetingLink: 'https://zoom.us/j/8612345604',
    repeat: 'does_not_repeat',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    colorCategory: 'customer',
  },
  {
    id: 'q4-budget-adjust',
    title: 'Q4 预算调整会',
    day: 0,
    startH: 9.5,
    durationH: 1,
    calId: 'c1',
    location: '会议室 301',
    organizer: '张伟（财务分析师）',
    status: '已接受',
    description: '确认 Q4 预算 调整项和部门归口。',
    type: 'normal',
    weekOffset: 1,
    attendees: ['张伟（财务分析师）', '李强', '陈晨', '我'],
    meetingProvider: 'none',
    meetingLink: '',
    repeat: 'does_not_repeat',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    attachments: ['Q4预算分配表.xlsx'],
    colorCategory: 'project',
  },
  {
    id: 'q4-budget-exec',
    title: '季度预算执行计划评审',
    day: 0,
    startH: 14,
    durationH: 1,
    calId: 'c1',
    location: '',
    organizer: '王芳（财务部）',
    status: '已接受',
    description: '评审 Q4 预算 执行计划，明确预算冻结和例外审批规则。',
    type: 'normal',
    weekOffset: 1,
    attendees: ['王芳（财务部）', '孙悦', '何琳', '我'],
    optionalAttendees: ['业务负责人'],
    meetingProvider: 'teams',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/q4-budget-execution',
    repeat: 'every_month',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
  },
  {
    id: 'q4-market-budget',
    title: '市场部预算沟通会',
    day: 1,
    startH: 11,
    durationH: 1,
    calId: 'c1',
    location: '会议室 502',
    organizer: '刘洋（市场部）',
    status: '已接受',
    description: '讨论市场活动投放与 Q4 预算 分配。',
    type: 'normal',
    weekOffset: 1,
    attendees: ['刘洋（市场部）', '陈思', '我', '渠道运营组'],
    meetingProvider: 'none',
    meetingLink: '',
    repeat: 'does_not_repeat',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    colorCategory: 'customer',
  },
  {
    id: 'q4-procurement-budget',
    title: '财务与采购对齐会',
    day: 2,
    startH: 15,
    durationH: 1,
    calId: 'c1',
    location: '',
    organizer: '陈晨（采购部）',
    status: '已接受',
    description: '对齐采购合同节奏和 Q4 预算 占用。',
    type: 'normal',
    weekOffset: 1,
    attendees: ['陈晨（采购部）', '李强', '采购经理', '我'],
    meetingProvider: 'meet',
    meetingLink: 'https://meet.google.com/q4-procurement-budget',
    repeat: 'does_not_repeat',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    colorCategory: 'important',
  },
  {
    id: 'q4-budget-plan-discussion',
    title: 'Q4 预算方案讨论会',
    day: 4,
    startH: 15.5,
    durationH: 1.5,
    calId: 'c1',
    location: '',
    organizer: '李强（财务总监）',
    status: '已接受',
    description: '各部门需在周五前确认 Q4 预算 分配口径。',
    type: 'normal',
    weekOffset: -1,
    attendees: ['李强（财务总监）', '赵敏', '周婷', '我'],
    optionalAttendees: ['财务预算组'],
    meetingProvider: 'none',
    meetingLink: '',
    repeat: 'every_week',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    attachments: ['Q4预算分配表.xlsx'],
    colorCategory: 'project',
  },
  {
    id: 'q4-market-history',
    title: '市场部 Q4 预算沟通会',
    day: 1,
    startH: 9.5,
    durationH: 1.5,
    calId: 'c1',
    location: '会议室 301',
    organizer: '刘洋（市场部）',
    status: '已接受',
    description: '复盘市场部 Q4 预算 调整口径。',
    type: 'normal',
    weekOffset: -1,
    attendees: ['刘洋（市场部）', '王璐', '我'],
    meetingProvider: 'none',
    meetingLink: '',
    repeat: 'does_not_repeat',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    colorCategory: 'customer',
  },
  {
    id: 'q4-budget-initial',
    title: 'Q4 预算初步规划会',
    day: 4,
    startH: 14,
    durationH: 1.5,
    calId: 'c1',
    location: '',
    organizer: '王芳（财务部）',
    status: '已接受',
    description: '确定 Q4 预算 初版目标、预算池和审批节点。',
    type: 'normal',
    weekOffset: -2,
    attendees: ['王芳（财务部）', '陈晨', '李强', '我'],
    meetingProvider: 'teams',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/q4-budget-initial',
    repeat: 'does_not_repeat',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    colorCategory: 'important',
  },
  {
    id: 'q4-budget-ready',
    title: '年度预算准备会',
    day: 5,
    startH: 10,
    durationH: 1,
    calId: 'c1',
    location: '',
    organizer: '赵敏（预算组）',
    status: '已接受',
    description: '准备年度预算复盘，同时检查 Q4 预算 剩余额度。',
    type: 'normal',
    weekOffset: -2,
    attendees: ['赵敏（预算组）', '我'],
    meetingProvider: 'none',
    meetingLink: '',
    repeat: 'does_not_repeat',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
  },
  {
    id: 'e1',
    title: '周度产研对齐会',
    day: 1,
    startH: 10,
    durationH: 1.5,
    calId: 'c1',
    location: '会议室 A',
    organizer: '我',
    status: '已接受',
    description: '本周工作进展同步。',
    type: 'normal',
    weekOffset: 0,
    attendees: ['我', '产品经理', '设计负责人'],
    meetingProvider: 'meet',
    meetingLink: 'https://meet.google.com/产研对齐-2026',
    repeat: 'every_week',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    attachments: ['项目周报.pdf', '评审备注.md'],
    colorCategory: 'project',
  },
  {
    id: 'e2',
    title: '【已取消】需求评审',
    day: 2,
    startH: 14,
    durationH: 2,
    calId: 'c1',
    location: '线上会议',
    organizer: '产品经理',
    status: '已取消',
    description: '会议取消，另行通知。',
    type: 'cancelled',
    weekOffset: 0,
    attendees: ['我', '产品经理', '研发负责人'],
    meetingProvider: 'teams',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/需求评审-2026',
    repeat: 'does_not_repeat',
    reminder: '10m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    colorCategory: 'todo',
  },
  {
    id: 'e3',
    title: '外部高管会见',
    day: 1,
    startH: 14,
    durationH: 2,
    calId: 'c3',
    location: '总部大楼',
    organizer: '张总',
    status: '已接受',
    description: '外部客户交流。',
    type: 'normal',
    weekOffset: 0,
    attendees: ['张总', '我'],
    meetingProvider: 'phone',
    meetingLink: '',
    repeat: 'does_not_repeat',
    reminder: '1h',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    colorCategory: 'customer',
  },
  {
    id: 'e4',
    title: '私人行程',
    day: 3,
    startH: 10,
    durationH: 1.5,
    calId: 'c4',
    location: '',
    organizer: '李四',
    status: '已接受',
    description: '',
    type: 'busy_only',
    weekOffset: 0,
    attendees: ['李四'],
  },
  {
    id: 'e5',
    title: '设计规范对齐',
    day: 4,
    startH: 11,
    durationH: 1,
    calId: 'c1',
    location: '工位区',
    organizer: '我',
    status: '待响应',
    description: '过一下全局交互规范。',
    type: 'normal',
    weekOffset: 0,
    attendees: ['我', '设计负责人'],
    meetingProvider: 'meet',
    meetingLink: 'https://meet.google.com/设计规范-2026',
    repeat: 'does_not_repeat',
    reminder: '10m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    colorCategory: 'project',
  },
  {
    id: 'e6',
    title: '产品立项汇报',
    day: 4,
    startH: 15,
    durationH: 2,
    calId: 'c1',
    location: '大圆桌会议室',
    organizer: '我',
    status: '已接受',
    description: '给老板过一期方案。',
    type: 'normal',
    weekOffset: 0,
    attendees: ['我', '老板', '产品经理'],
    meetingProvider: 'none',
    meetingLink: '',
    repeat: 'does_not_repeat',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    attachments: ['立项材料.pdf'],
    colorCategory: 'important',
  },
  {
    id: 'e7',
    title: 'Q1 规划周 (跨天锁定)',
    day: 0,
    startH: 0,
    durationH: 24,
    isAllDay: true,
    allDaySpan: 3,
    calId: 'c1',
    location: '',
    organizer: '我',
    status: '已接受',
    description: '谢绝其他会议插入。',
    type: 'normal',
    weekOffset: 0,
    attendees: ['我', '张总'],
    meetingProvider: 'none',
    meetingLink: '',
    repeat: 'does_not_repeat',
    reminder: '1d',
    availability: 'busy',
    visibility: 'private',
    kind: 'event',
  },
  {
    id: 'e8',
    title: '销售例会',
    day: 0,
    startH: 9,
    durationH: 1,
    calId: 'c5',
    location: '销售区 2F',
    organizer: '销售团队',
    status: '已接受',
    description: '同步重点客户跟进情况。',
    type: 'normal',
    weekOffset: 0,
    attendees: ['销售团队', '我'],
    colorCategory: 'customer',
  },
  {
    id: 'e9',
    title: '周末客户 brunch',
    day: 6,
    startH: 11,
    durationH: 1.5,
    calId: 'c5',
    location: '外部餐厅',
    organizer: '销售团队',
    status: '已接受',
    description: '高潜客户关系维护。',
    type: 'normal',
    weekOffset: 0,
    attendees: ['销售团队', '客户代表'],
    colorCategory: 'customer',
  },
  {
    id: 'e10',
    title: '下周优先级梳理',
    day: 0,
    startH: 10,
    durationH: 1.5,
    calId: 'c1',
    location: '产品区',
    organizer: '我',
    status: '已接受',
    description: '梳理下周版本优先级与资源约束。',
    type: 'normal',
    weekOffset: 1,
    attendees: ['我', '产品经理'],
  },
  {
    id: 'e11',
    title: '渠道复盘',
    day: 3,
    startH: 13,
    durationH: 1,
    calId: 'c5',
    location: '线上会议',
    organizer: '销售团队',
    status: '已接受',
    description: '回顾线索转化表现。',
    type: 'normal',
    weekOffset: 1,
    attendees: ['销售团队', '运营经理'],
    meetingProvider: 'zoom',
    meetingLink: 'https://zoom.us/j/8612345678',
    repeat: 'every_week',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
    colorCategory: 'customer',
  },
  {
    id: 'e12',
    title: '新品发布预热',
    day: 4,
    startH: 16,
    durationH: 1,
    calId: 'c2',
    location: '市场会议室',
    organizer: '我',
    status: '已接受',
    description: '确认发布周物料排期。',
    type: 'normal',
    weekOffset: -1,
    attendees: ['我', '市场负责人'],
    colorCategory: 'project',
  },
  {
    id: 'e13',
    title: '高管出差',
    day: 2,
    startH: 0,
    durationH: 24,
    isAllDay: true,
    allDaySpan: 2,
    calId: 'c3',
    location: '',
    organizer: '张总',
    status: '已接受',
    description: '外地出差，默认拒绝外部会议。',
    type: 'normal',
    weekOffset: 0,
    attendees: ['张总'],
    meetingProvider: 'none',
    meetingLink: '',
    repeat: 'does_not_repeat',
    reminder: '1d',
    availability: 'busy',
    visibility: 'default',
    kind: 'event',
  },
];

export const MOCK_MAILS = [
  {
    id: 'm1', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: true, starred: true,
    subject: 'Q2 路线评审材料已更新', fromName: '产品经理', fromEmail: 'pm@calendarpro.io',
    to: ["me@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '评审材料已经补齐预算和风险页，建议明天下午一起过一遍。', body: 'Hi，\n\n评审材料已经补齐预算和风险页，建议明天下午一起过一遍。如果你确认，我会同步给张总和研发负责人。\n\n附件里是最新版本。\n\nThanks,\n产品经理',
    attachments: [{"name": "Q2_路线评审_v4.pptx", "size": "8.2 MB"}],
    timestamp: new Date(2026, 0, 9, 9, 20, 0).getTime(),
    linkedEventId: 'e6',
  },
  {
    id: 'm2', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '请确认下周客户拜访行程', fromName: '张总', fromEmail: 'boss@calendarpro.io',
    to: ["ea@calendarpro.io"], cc: ["me@calendarpro.io"],
    preview: '客户把会面时间改到周三上午，是否能顺带安排午餐会？', body: '请确认下周客户拜访行程。客户把会面时间改到周三上午，是否能顺带安排午餐会？另外看看是否需要提前锁会。\n\n张总',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 8, 10, 0).getTime(),
    linkedEventId: 'e3',
  },
  {
    id: 'm3', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '销售周报已归档到共享邮箱', fromName: '销售团队', fromEmail: 'sales@calendarpro.io',
    to: ["sales@calendarpro.io"], cc: [],
    preview: '本周新增 4 条高潜客户线索，详细数据见正文。', body: '本周新增 4 条高潜客户线索，华东区成交机会提升明显。详细数据已经归档到共享邮箱，请需要的同学直接查看。',
    attachments: [{"name": "销售周报_第1周.xlsx", "size": "1.3 MB"}],
    timestamp: new Date(2026, 0, 8, 18, 45, 0).getTime(),
  },
  {
    id: 'm4', accountId: 'acc1', folder: 'drafts', category: 'focused',
    unread: false, starred: false,
    subject: 'Re: 设计规范对齐会后结论', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: ["pm@calendarpro.io"],
    preview: '草稿尚未发送，包含会后 action item 和补充时间安排。', body: '大家好，\n\n补充今天会后的结论如下：\n1. 本周五前补齐规范页。\n2. 下周一再次评审。\n\n如果没有问题，我会同步更新日历邀请。',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 7, 50, 0).getTime(),
  },
  {
    id: 'm5', accountId: 'acc1', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '会议纪要：周度产研对齐', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io", "rd@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '纪要已经同步，请关注里程碑和资源风险项。', body: '各位好，\n\n本周会议纪要已经同步，请重点关注里程碑与资源风险项。若有补充，请今天内回复邮件。',
    attachments: [{"name": "会议纪要_周度产研对齐.docx", "size": "640 KB"}],
    timestamp: new Date(2026, 0, 8, 17, 10, 0).getTime(),
    linkedEventId: 'e1',
  },
  {
    id: 'm6', accountId: 'acc2', folder: 'archive', category: 'other',
    unread: false, starred: true,
    subject: '董事会材料请提前打印', fromName: '行政助理组', fromEmail: 'ea-team@calendarpro.io',
    to: ["ea@calendarpro.io"], cc: [],
    preview: '董事会材料明早 8:30 前需送达，请确认打印份数。', body: '董事会材料明早 8:30 前需送达，请确认打印份数，并在今晚完成装订。',
    attachments: [{"name": "董事会材料.pdf", "size": "12.1 MB"}],
    timestamp: new Date(2026, 0, 7, 19, 5, 0).getTime(),
  },
  {
    id: 'm7', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '部门周会纪要', fromName: '孙莉', fromEmail: 'rd@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 6, 12, 0, 0).getTime(),
  },
  {
    id: 'm8', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '发版说明整理', fromName: '产品经理', fromEmail: 'pm@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 8, 7, 0, 0).getTime(),
  },
  {
    id: 'm9', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '邮件归档通知', fromName: '马经理', fromEmail: 'sales@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '系统例行维护时间安排已确认。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [],
    timestamp: new Date(2026, 0, 6, 17, 55, 0).getTime(),
  },
  {
    id: 'm10', accountId: 'acc3', folder: 'drafts', category: 'focused',
    unread: false, starred: false,
    subject: '部门周会纪要', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 3, 20, 30, 0).getTime(),
  },
  {
    id: 'm11', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '面试安排确认', fromName: '法务顾问', fromEmail: 'pm@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周项目例会通知，请准时参加。', body: '经过深入分析，建议采用以下方案。详细内容请查看附件文档，有任何问题欢迎随时讨论。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 5, 8, 25, 0).getTime(),
  },
  {
    id: 'm12', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '团建活动报名', fromName: '陈博士', fromEmail: 'admin@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '经过深入分析，建议采用以下方案。详细内容请查看附件文档，有任何问题欢迎随时讨论。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 4, 11, 30, 0).getTime(),
  },
  {
    id: 'm13', accountId: 'acc3', folder: 'sent', category: 'other',
    unread: true, starred: false,
    subject: '新人培训材料', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: [],
    preview: '本次迭代开发测试已完成。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [],
    timestamp: new Date(2026, 0, 3, 14, 45, 0).getTime(),
  },
  {
    id: 'm14', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '代码仓库迁移', fromName: '陈博士', fromEmail: 'pm@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户反馈问题已整理并分配。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 8, 8, 0, 0).getTime(),
  },
  {
    id: 'm15', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: 'FAQ 整理', fromName: '李娜', fromEmail: 'finance@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [],
    timestamp: new Date(2026, 0, 4, 21, 0, 0).getTime(),
  },
  {
    id: 'm16', accountId: 'acc1', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '密码重置提醒', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '本周项目例会通知，请准时参加。', body: '已完成对异常数据的排查，问题根源已锁定。修复方案已提交评审，预计本周内合并上线。',
    attachments: [],
    timestamp: new Date(2026, 0, 8, 15, 55, 0).getTime(),
  },
  {
    id: 'm17', accountId: 'acc3', folder: 'inbox', category: 'newsletter',
    unread: false, starred: false,
    subject: '外包管理规范', fromName: '马超', fromEmail: 'dev@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 7, 9, 5, 0).getTime(),
  },
  {
    id: 'm18', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '密码重置提醒', fromName: '黄经理', fromEmail: 'design@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 1, 18, 15, 0).getTime(),
  },
  {
    id: 'm19', accountId: 'acc1', folder: 'sent', category: 'focused',
    unread: true, starred: false,
    subject: '第三方服务续费', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: [],
    preview: '客户满意度调查结果已出。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 6, 22, 0, 0).getTime(),
  },
  {
    id: 'm20', accountId: 'acc1', folder: 'sent', category: 'newsletter',
    unread: false, starred: false,
    subject: '发版说明整理', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: [],
    preview: '系统例行维护时间安排已确认。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 6, 8, 5, 0).getTime(),
  },
  {
    id: 'm21', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: 'CI/CD 流水线更新', fromName: '黄经理', fromEmail: 'hr@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [],
    timestamp: new Date(2026, 0, 8, 20, 30, 0).getTime(),
  },
  {
    id: 'm22', accountId: 'acc1', folder: 'trash', category: 'social',
    unread: false, starred: false,
    subject: '福利政策更新', fromName: '林总监', fromEmail: 'rd@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 3, 10, 40, 0).getTime(),
  },
  {
    id: 'm23', accountId: 'acc3', folder: 'sent', category: 'newsletter',
    unread: false, starred: false,
    subject: '回滚预案检查', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '客户满意度调查结果已出。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [],
    timestamp: new Date(2026, 0, 3, 20, 20, 0).getTime(),
  },
  {
    id: 'm24', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '第三方服务续费', fromName: '市场经理', fromEmail: 'dev@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "安全审计报告.pdf", "size": "3.4 MB"}],
    timestamp: new Date(2026, 0, 2, 20, 45, 0).getTime(),
  },
  {
    id: 'm25', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '福利政策更新', fromName: '运维工程师', fromEmail: 'hr@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [],
    timestamp: new Date(2026, 0, 2, 9, 30, 0).getTime(),
  },
  {
    id: 'm26', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '办公用品申领', fromName: '市场经理', fromEmail: 'ops@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [],
    timestamp: new Date(2026, 0, 6, 9, 55, 0).getTime(),
  },
  {
    id: 'm27', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '迭代回顾总结', fromName: '胡洁', fromEmail: 'support@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 8, 9, 55, 0).getTime(),
  },
  {
    id: 'm28', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '考勤异常提醒', fromName: '后端开发', fromEmail: 'admin@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [],
    timestamp: new Date(2026, 0, 7, 13, 15, 0).getTime(),
  },
  {
    id: 'm29', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '外包管理规范', fromName: '徐总', fromEmail: 'dev@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 5, 13, 50, 0).getTime(),
  },
  {
    id: 'm30', accountId: 'acc1', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '产品规划讨论会', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '已完成对异常数据的排查，问题根源已锁定。修复方案已提交评审，预计本周内合并上线。',
    attachments: [],
    timestamp: new Date(2026, 0, 4, 11, 50, 0).getTime(),
  },
  {
    id: 'm31', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '技术方案评审', fromName: '何主管', fromEmail: 'finance@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 3, 9, 10, 0).getTime(),
  },
  {
    id: 'm32', accountId: 'acc1', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '需求优先级排序', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 5, 11, 0, 0).getTime(),
  },
  {
    id: 'm33', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '新人培训材料', fromName: '张总', fromEmail: 'rd@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本次迭代开发测试已完成。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 5, 11, 20, 0).getTime(),
  },
  {
    id: 'm34', accountId: 'acc2', folder: 'sent', category: 'other',
    unread: true, starred: false,
    subject: '缓存策略调整', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '已在附件中更新最新版本，请查收并及时反馈意见。如有疑问，请随时沟通。',
    attachments: [],
    timestamp: new Date(2026, 0, 3, 8, 20, 0).getTime(),
  },
  {
    id: 'm35', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '绩效考核结果公示', fromName: '周老师', fromEmail: 'support@corp.com',
    to: ["me@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '根据会议讨论结果，现整理相关材料。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 8, 16, 55, 0).getTime(),
  },
  {
    id: 'm36', accountId: 'acc3', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '福利政策更新', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '系统维护通知，请提前做好准备。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 2, 17, 50, 0).getTime(),
  },
  {
    id: 'm37', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '办公用品申领', fromName: '刘工', fromEmail: 'qa@partner.com',
    to: ["me@calendarpro.io"], cc: ["pm@calendarpro.io"],
    preview: '异常数据排查完成，修复方案已提交。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 3, 16, 55, 0).getTime(),
  },
  {
    id: 'm38', accountId: 'acc3', folder: 'drafts', category: 'other',
    unread: false, starred: false,
    subject: '知识产权申请', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 5, 9, 35, 0).getTime(),
  },
  {
    id: 'm39', accountId: 'acc1', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '知识产权申请', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '系统例行维护时间安排已确认。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 8, 14, 10, 0).getTime(),
  },
  {
    id: 'm40', accountId: 'acc1', folder: 'inbox', category: 'newsletter',
    unread: false, starred: false,
    subject: '办公用品申领', fromName: '人力资源', fromEmail: 'admin@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 13, 55, 0).getTime(),
  },
  {
    id: 'm41', accountId: 'acc2', folder: 'drafts', category: 'focused',
    unread: true, starred: false,
    subject: '合规审查通知', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 17, 40, 0).getTime(),
  },
  {
    id: 'm42', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '转化率分析', fromName: '林总监', fromEmail: 'finance@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 9, 9, 25, 0).getTime(),
  },
  {
    id: 'm43', accountId: 'acc1', folder: 'archive', category: 'newsletter',
    unread: false, starred: false,
    subject: '现金流预测报告', fromName: '王磊', fromEmail: 'design@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 8, 22, 0, 0).getTime(),
  },
  {
    id: 'm44', accountId: 'acc2', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '部门周会纪要', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '已完成对异常数据的排查，问题根源已锁定。修复方案已提交评审，预计本周内合并上线。',
    attachments: [],
    timestamp: new Date(2026, 0, 6, 17, 55, 0).getTime(),
  },
  {
    id: 'm45', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '关于项目进度的更新通知', fromName: '刘洋', fromEmail: 'design@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '系统维护通知，请提前做好准备。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 4, 23, 50, 0).getTime(),
  },
  {
    id: 'm46', accountId: 'acc3', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: 'FAQ 整理', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: [],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [],
    timestamp: new Date(2026, 0, 5, 22, 35, 0).getTime(),
  },
  {
    id: 'm47', accountId: 'acc3', folder: 'inbox', category: 'social',
    unread: false, starred: false,
    subject: '密码重置提醒', fromName: '孙莉', fromEmail: 'finance@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [],
    timestamp: new Date(2026, 0, 6, 12, 20, 0).getTime(),
  },
  {
    id: 'm48', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '薪资调整通知', fromName: '周强', fromEmail: 'hr@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '已完成对异常数据的排查，问题根源已锁定。修复方案已提交评审，预计本周内合并上线。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 6, 23, 25, 0).getTime(),
  },
  {
    id: 'm49', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: 'Sprint 规划会议', fromName: '吴同学', fromEmail: 'ops@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 6, 10, 55, 0).getTime(),
  },
  {
    id: 'm50', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '用户体验优化建议', fromName: '销售代表', fromEmail: 'admin@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '系统例行维护时间安排已确认。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 6, 15, 0, 0).getTime(),
  },
  {
    id: 'm51', accountId: 'acc3', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '转化率分析', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '客户反馈问题已整理并分配。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 5, 21, 45, 0).getTime(),
  },
  {
    id: 'm52', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: true, starred: true,
    subject: '客户需求对接安排', fromName: '陈博士', fromEmail: 'sales@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '已完成对异常数据的排查，问题根源已锁定。修复方案已提交评审，预计本周内合并上线。',
    attachments: [],
    timestamp: new Date(2026, 0, 4, 14, 40, 0).getTime(),
  },
  {
    id: 'm53', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '薪资调整通知', fromName: '周老师', fromEmail: 'support@calendarpro.io',
    to: ["me@calendarpro.io"], cc: ["pm@calendarpro.io"],
    preview: '本月产品更新日志已发布。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [],
    timestamp: new Date(2026, 0, 2, 15, 50, 0).getTime(),
  },
  {
    id: 'm54', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '年度预算编制', fromName: '徐总', fromEmail: 'dev@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户反馈问题已整理并分配。', body: '已在附件中更新最新版本，请查收并及时反馈意见。如有疑问，请随时沟通。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 2, 12, 10, 0).getTime(),
  },
  {
    id: 'm55', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '回滚预案检查', fromName: '赵主管', fromEmail: 'rd@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 6, 14, 40, 0).getTime(),
  },
  {
    id: 'm56', accountId: 'acc1', folder: 'archive', category: 'newsletter',
    unread: true, starred: false,
    subject: '留存数据周报', fromName: '胡总', fromEmail: 'support@partner.com',
    to: ["me@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '异常数据排查完成，修复方案已提交。', body: '已在附件中更新最新版本，请查收并及时反馈意见。如有疑问，请随时沟通。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 7, 9, 10, 0).getTime(),
  },
  {
    id: 'm57', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '日志分析报告', fromName: '孙莉', fromEmail: 'design@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户满意度调查结果已出。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 4, 20, 45, 0).getTime(),
  },
  {
    id: 'm58', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '日志分析报告', fromName: '孙莉', fromEmail: 'admin@vendor.net',
    to: ["me@calendarpro.io"], cc: ["pm@calendarpro.io"],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 5, 8, 50, 0).getTime(),
  },
  {
    id: 'm59', accountId: 'acc2', folder: 'drafts', category: 'newsletter',
    unread: false, starred: false,
    subject: '年度预算编制', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 4, 22, 50, 0).getTime(),
  },
  {
    id: 'm60', accountId: 'acc2', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '留存数据周报', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 9, 9, 45, 0).getTime(),
  },
  {
    id: 'm61', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '系统升级维护通知', fromName: '马超', fromEmail: 'rd@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [],
    timestamp: new Date(2026, 0, 8, 23, 0, 0).getTime(),
  },
  {
    id: 'm62', accountId: 'acc3', folder: 'archive', category: 'focused',
    unread: true, starred: false,
    subject: '报销单已审核', fromName: '孙工', fromEmail: 'qa@partner.com',
    to: ["me@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '本周核心数据已汇总完成。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [],
    timestamp: new Date(2026, 0, 7, 7, 40, 0).getTime(),
  },
  {
    id: 'm63', accountId: 'acc1', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '部署上线通知', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '已在附件中更新最新版本，请查收并及时反馈意见。如有疑问，请随时沟通。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 3, 18, 35, 0).getTime(),
  },
  {
    id: 'm64', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '知识产权申请', fromName: '胡洁', fromEmail: 'dev@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 2, 19, 30, 0).getTime(),
  },
  {
    id: 'm65', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '线上问题复盘', fromName: '市场经理', fromEmail: 'design@corp.com',
    to: ["me@calendarpro.io"], cc: ["pm@calendarpro.io"],
    preview: '本月产品更新日志已发布。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 19, 25, 0).getTime(),
  },
  {
    id: 'm66', accountId: 'acc3', folder: 'drafts', category: 'focused',
    unread: false, starred: true,
    subject: '薪资调整通知', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '本月产品更新日志已发布。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 1, 10, 20, 0).getTime(),
  },
  {
    id: 'm67', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: false, starred: true,
    subject: '合规审查通知', fromName: '马超', fromEmail: 'qa@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户满意度调查结果已出。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 7, 11, 35, 0).getTime(),
  },
  {
    id: 'm68', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '报销单已审核', fromName: '林总监', fromEmail: 'design@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户反馈问题已整理并分配。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 1, 19, 30, 0).getTime(),
  },
  {
    id: 'm69', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '需求优先级排序', fromName: '客户成功', fromEmail: 'hr@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 11, 50, 0).getTime(),
  },
  {
    id: 'm70', accountId: 'acc3', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: 'CI/CD 流水线更新', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 3, 8, 25, 0).getTime(),
  },
  {
    id: 'm71', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: 'CRM 数据清理', fromName: '赵敏', fromEmail: 'dev@corp.com',
    to: ["me@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '本周项目例会通知，请准时参加。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 4, 22, 35, 0).getTime(),
  },
  {
    id: 'm72', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '客户需求对接安排', fromName: '朱老师', fromEmail: 'rd@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [],
    timestamp: new Date(2026, 0, 3, 21, 40, 0).getTime(),
  },
  {
    id: 'm73', accountId: 'acc2', folder: 'inbox', category: 'newsletter',
    unread: true, starred: false,
    subject: '竞品功能对比', fromName: '销售代表', fromEmail: 'hr@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 8, 19, 40, 0).getTime(),
  },
  {
    id: 'm74', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '新功能需求讨论', fromName: '陈博士', fromEmail: 'ops@corp.com',
    to: ["me@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '根据会议讨论结果，现整理相关材料。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 1, 21, 30, 0).getTime(),
  },
  {
    id: 'm75', accountId: 'acc2', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: 'API 额度预警', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '已完成对异常数据的排查，问题根源已锁定。修复方案已提交评审，预计本周内合并上线。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 1, 9, 40, 0).getTime(),
  },
  {
    id: 'm76', accountId: 'acc3', folder: 'trash', category: 'focused',
    unread: false, starred: false,
    subject: '销售线索分配', fromName: '人力资源', fromEmail: 'sales@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本次迭代开发测试已完成。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 9, 7, 40, 0).getTime(),
  },
  {
    id: 'm77', accountId: 'acc1', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '薪资调整通知', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 6, 20, 30, 0).getTime(),
  },
  {
    id: 'm78', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '成本优化建议', fromName: '测试工程师', fromEmail: 'qa@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [],
    timestamp: new Date(2026, 0, 6, 11, 10, 0).getTime(),
  },
  {
    id: 'm79', accountId: 'acc3', folder: 'sent', category: 'focused',
    unread: true, starred: false,
    subject: '迭代回顾总结', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 5, 16, 10, 0).getTime(),
  },
  {
    id: 'm80', accountId: 'acc2', folder: 'drafts', category: 'focused',
    unread: false, starred: false,
    subject: '客户需求对接安排', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '本周项目例会通知，请准时参加。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 2, 13, 40, 0).getTime(),
  },
  {
    id: 'm81', accountId: 'acc3', folder: 'trash', category: 'other',
    unread: false, starred: false,
    subject: '设备采购申请', fromName: '王磊', fromEmail: 'design@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '系统维护通知，请提前做好准备。', body: '已完成对异常数据的排查，问题根源已锁定。修复方案已提交评审，预计本周内合并上线。',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 20, 10, 0).getTime(),
  },
  {
    id: 'm82', accountId: 'acc3', folder: 'drafts', category: 'focused',
    unread: false, starred: false,
    subject: 'IT 资产盘点', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '异常数据排查完成，修复方案已提交。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 1, 16, 0, 0).getTime(),
  },
  {
    id: 'm83', accountId: 'acc1', folder: 'archive', category: 'social',
    unread: true, starred: false,
    subject: '考勤异常提醒', fromName: '产品经理', fromEmail: 'boss@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 1, 12, 10, 0).getTime(),
  },
  {
    id: 'm84', accountId: 'acc1', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '销售线索分配', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [],
    timestamp: new Date(2026, 0, 2, 20, 10, 0).getTime(),
  },
  {
    id: 'm85', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: true, starred: true,
    subject: '会议室预约系统', fromName: '财务主管', fromEmail: 'pm@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 2, 16, 10, 0).getTime(),
  },
  {
    id: 'm86', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '合规审查通知', fromName: '李娜', fromEmail: 'finance@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 4, 22, 5, 0).getTime(),
  },
  {
    id: 'm87', accountId: 'acc1', folder: 'sent', category: 'focused',
    unread: true, starred: false,
    subject: '域名续费提醒', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '系统维护通知，请提前做好准备。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 2, 12, 35, 0).getTime(),
  },
  {
    id: 'm88', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '数据安全培训', fromName: '研发负责人', fromEmail: 'qa@corp.com',
    to: ["me@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '详细方案请查看附件文档。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [{"name": "安全审计报告.pdf", "size": "3.4 MB"}],
    timestamp: new Date(2026, 0, 2, 16, 30, 0).getTime(),
  },
  {
    id: 'm89', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '供应商评估', fromName: '张伟', fromEmail: 'qa@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户反馈问题已整理并分配。', body: '经过深入分析，建议采用以下方案。详细内容请查看附件文档，有任何问题欢迎随时讨论。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 7, 10, 55, 0).getTime(),
  },
  {
    id: 'm90', accountId: 'acc2', folder: 'inbox', category: 'social',
    unread: false, starred: false,
    subject: '用户体验调研', fromName: '黄经理', fromEmail: 'boss@calendarpro.io',
    to: ["me@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '本周核心数据已汇总完成。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 6, 20, 40, 0).getTime(),
  },
  {
    id: 'm91', accountId: 'acc2', folder: 'sent', category: 'focused',
    unread: true, starred: false,
    subject: 'VPN 使用指南', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 4, 13, 30, 0).getTime(),
  },
  {
    id: 'm92', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '自动化测试覆盖', fromName: '财务主管', fromEmail: 'sales@vendor.net',
    to: ["me@calendarpro.io"], cc: ["pm@calendarpro.io"],
    preview: '客户需求已收到，初步评估可行。', body: '已完成对异常数据的排查，问题根源已锁定。修复方案已提交评审，预计本周内合并上线。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 7, 20, 45, 0).getTime(),
  },
  {
    id: 'm93', accountId: 'acc3', folder: 'drafts', category: 'focused',
    unread: true, starred: false,
    subject: '容器集群扩容', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: ["pm@calendarpro.io"],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '已在附件中更新最新版本，请查收并及时反馈意见。如有疑问，请随时沟通。',
    attachments: [],
    timestamp: new Date(2026, 0, 7, 21, 10, 0).getTime(),
  },
  {
    id: 'm94', accountId: 'acc1', folder: 'drafts', category: 'other',
    unread: false, starred: false,
    subject: '测试报告已生成', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "安全审计报告.pdf", "size": "3.4 MB"}],
    timestamp: new Date(2026, 0, 8, 22, 30, 0).getTime(),
  },
  {
    id: 'm95', accountId: 'acc3', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: 'IT 资产盘点', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: [],
    preview: '异常数据排查完成，修复方案已提交。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 7, 18, 40, 0).getTime(),
  },
  {
    id: 'm96', accountId: 'acc2', folder: 'inbox', category: 'newsletter',
    unread: false, starred: false,
    subject: '关于项目进度的更新通知', fromName: '吴同学', fromEmail: 'rd@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户反馈问题已整理并分配。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 3, 15, 10, 0).getTime(),
  },
  {
    id: 'm97', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '供应商评估报告', fromName: '赵主管', fromEmail: 'rd@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '已在附件中更新最新版本，请查收并及时反馈意见。如有疑问，请随时沟通。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 1, 22, 30, 0).getTime(),
  },
  {
    id: 'm98', accountId: 'acc2', folder: 'inbox', category: 'social',
    unread: true, starred: false,
    subject: '季度目标复盘纪要', fromName: '销售代表', fromEmail: 'boss@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [],
    timestamp: new Date(2026, 0, 1, 9, 50, 0).getTime(),
  },
  {
    id: 'm99', accountId: 'acc1', folder: 'drafts', category: 'other',
    unread: false, starred: false,
    subject: '供应商评估', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: [],
    preview: '系统例行维护时间安排已确认。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "安全审计报告.pdf", "size": "3.4 MB"}],
    timestamp: new Date(2026, 0, 1, 8, 5, 0).getTime(),
  },
  {
    id: 'm100', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '系统升级维护通知', fromName: '测试工程师', fromEmail: 'boss@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周项目例会通知，请准时参加。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 1, 10, 35, 0).getTime(),
  },
  {
    id: 'm101', accountId: 'acc2', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: 'IT 资产盘点', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: ["pm@calendarpro.io"],
    preview: '根据会议讨论结果，现整理相关材料。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 9, 11, 40, 0).getTime(),
  },
  {
    id: 'm102', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: 'API 额度预警', fromName: '李娜', fromEmail: 'sales@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 6, 10, 5, 0).getTime(),
  },
  {
    id: 'm103', accountId: 'acc1', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: 'API 额度预警', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 7, 13, 20, 0).getTime(),
  },
  {
    id: 'm104', accountId: 'acc3', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '留存数据周报', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [],
    timestamp: new Date(2026, 0, 7, 12, 0, 0).getTime(),
  },
  {
    id: 'm105', accountId: 'acc2', folder: 'drafts', category: 'focused',
    unread: true, starred: false,
    subject: 'A/B 测试结果', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '本周项目例会通知，请准时参加。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 2, 21, 15, 0).getTime(),
  },
  {
    id: 'm106', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '成本优化建议', fromName: '钱总', fromEmail: 'support@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周项目例会通知，请准时参加。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 5, 21, 55, 0).getTime(),
  },
  {
    id: 'm107', accountId: 'acc3', folder: 'inbox', category: 'newsletter',
    unread: false, starred: false,
    subject: '产品规划讨论会', fromName: '客户成功', fromEmail: 'pm@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 9, 23, 50, 0).getTime(),
  },
  {
    id: 'm108', accountId: 'acc3', folder: 'sent', category: 'newsletter',
    unread: false, starred: true,
    subject: '新人导师分配', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '本周核心数据已汇总完成。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 5, 10, 35, 0).getTime(),
  },
  {
    id: 'm109', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '请假申请审批结果', fromName: '吴芳', fromEmail: 'ops@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本次迭代开发测试已完成。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [],
    timestamp: new Date(2026, 0, 3, 18, 5, 0).getTime(),
  },
  {
    id: 'm110', accountId: 'acc2', folder: 'trash', category: 'focused',
    unread: true, starred: false,
    subject: '跨部门协作流程', fromName: '吴同学', fromEmail: 'support@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '经过深入分析，建议采用以下方案。详细内容请查看附件文档，有任何问题欢迎随时讨论。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 8, 16, 5, 0).getTime(),
  },
  {
    id: 'm111', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: 'CI/CD 流水线更新', fromName: '刘工', fromEmail: 'rd@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 6, 10, 35, 0).getTime(),
  },
  {
    id: 'm112', accountId: 'acc2', folder: 'spam', category: 'focused',
    unread: false, starred: false,
    subject: '部门周会纪要', fromName: '林总监', fromEmail: 'qa@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 7, 10, 0).getTime(),
  },
  {
    id: 'm113', accountId: 'acc3', folder: 'inbox', category: 'social',
    unread: true, starred: false,
    subject: '报销单已审核', fromName: '李经理', fromEmail: 'dev@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 22, 0, 0).getTime(),
  },
  {
    id: 'm114', accountId: 'acc3', folder: 'drafts', category: 'other',
    unread: false, starred: false,
    subject: '预算审批进度', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '根据会议讨论结果，现整理相关材料。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 7, 20, 20, 0).getTime(),
  },
  {
    id: 'm115', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '日志分析报告', fromName: '刘洋', fromEmail: 'design@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '已在附件中更新最新版本，请查收并及时反馈意见。如有疑问，请随时沟通。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 2, 12, 5, 0).getTime(),
  },
  {
    id: 'm116', accountId: 'acc2', folder: 'archive', category: 'other',
    unread: true, starred: false,
    subject: '面试安排确认', fromName: '李经理', fromEmail: 'design@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '系统维护通知，请提前做好准备。', body: '经过深入分析，建议采用以下方案。详细内容请查看附件文档，有任何问题欢迎随时讨论。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 5, 16, 15, 0).getTime(),
  },
  {
    id: 'm117', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '容器集群扩容', fromName: '测试工程师', fromEmail: 'ops@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [],
    timestamp: new Date(2026, 0, 8, 21, 45, 0).getTime(),
  },
  {
    id: 'm118', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '跨部门协作流程', fromName: '胡总', fromEmail: 'sales@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周项目例会通知，请准时参加。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 8, 10, 35, 0).getTime(),
  },
  {
    id: 'm119', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '密码重置提醒', fromName: '朱军', fromEmail: 'ops@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 2, 16, 20, 0).getTime(),
  },
  {
    id: 'm120', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '离职交接清单', fromName: '钱总', fromEmail: 'ops@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户反馈问题已整理并分配。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 8, 9, 5, 0).getTime(),
  },
  {
    id: 'm121', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: 'IT 资产盘点', fromName: '王磊', fromEmail: 'sales@calendarpro.io',
    to: ["me@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 5, 15, 40, 0).getTime(),
  },
  {
    id: 'm122', accountId: 'acc1', folder: 'sent', category: 'newsletter',
    unread: true, starred: false,
    subject: '竞品分析报告', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [],
    timestamp: new Date(2026, 0, 2, 7, 55, 0).getTime(),
  },
  {
    id: 'm123', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '市场推广方案', fromName: '郑宇', fromEmail: 'dev@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 7, 22, 55, 0).getTime(),
  },
  {
    id: 'm124', accountId: 'acc3', folder: 'sent', category: 'focused',
    unread: true, starred: false,
    subject: '服务器扩容计划', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: [],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '已在附件中更新最新版本，请查收并及时反馈意见。如有疑问，请随时沟通。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 1, 7, 0, 0).getTime(),
  },
  {
    id: 'm125', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '测试报告已生成', fromName: '钱总', fromEmail: 'dev@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 3, 19, 10, 0).getTime(),
  },
  {
    id: 'm126', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '面试安排确认', fromName: '陈博士', fromEmail: 'ops@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 3, 12, 15, 0).getTime(),
  },
  {
    id: 'm127', accountId: 'acc3', folder: 'sent', category: 'newsletter',
    unread: false, starred: false,
    subject: '薪资调整通知', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '客户满意度调查结果已出。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 8, 23, 30, 0).getTime(),
  },
  {
    id: 'm128', accountId: 'acc3', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '合同审批流程提醒', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: [],
    preview: '本次迭代开发测试已完成。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 3, 10, 45, 0).getTime(),
  },
  {
    id: 'm129', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '灰度发布确认', fromName: '郑宇', fromEmail: 'dev@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 6, 6, 50, 0).getTime(),
  },
  {
    id: 'm130', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '关于项目进度的更新通知', fromName: '胡洁', fromEmail: 'pm@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '异常数据排查完成，修复方案已提交。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 3, 15, 30, 0).getTime(),
  },
  {
    id: 'm131', accountId: 'acc3', folder: 'trash', category: 'other',
    unread: false, starred: false,
    subject: '代码评审反馈', fromName: '马经理', fromEmail: 'admin@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 5, 16, 15, 0).getTime(),
  },
  {
    id: 'm132', accountId: 'acc3', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '性能基准报告', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "安全审计报告.pdf", "size": "3.4 MB"}],
    timestamp: new Date(2026, 0, 8, 22, 45, 0).getTime(),
  },
  {
    id: 'm133', accountId: 'acc2', folder: 'sent', category: 'focused',
    unread: true, starred: false,
    subject: '自动化测试覆盖', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '技术方案可行性评估已完成。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 2, 22, 50, 0).getTime(),
  },
  {
    id: 'm134', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '绩效考核结果公示', fromName: '吴芳', fromEmail: 'ops@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 9, 18, 45, 0).getTime(),
  },
  {
    id: 'm135', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '考勤异常提醒', fromName: '胡总', fromEmail: 'dev@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本次迭代开发测试已完成。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [],
    timestamp: new Date(2026, 0, 7, 9, 20, 0).getTime(),
  },
  {
    id: 'm136', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '设备采购申请', fromName: '赵敏', fromEmail: 'dev@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本次迭代开发测试已完成。', body: '已在附件中更新最新版本，请查收并及时反馈意见。如有疑问，请随时沟通。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 1, 10, 5, 0).getTime(),
  },
  {
    id: 'm137', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '成本优化建议', fromName: '数据分析师', fromEmail: 'rd@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [],
    timestamp: new Date(2026, 0, 5, 20, 15, 0).getTime(),
  },
  {
    id: 'm138', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '监控告警通知', fromName: '产品经理', fromEmail: 'boss@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [],
    timestamp: new Date(2026, 0, 3, 21, 30, 0).getTime(),
  },
  {
    id: 'm139', accountId: 'acc1', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '团建活动报名', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '本次迭代开发测试已完成。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 5, 6, 25, 0).getTime(),
  },
  {
    id: 'm140', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '安全漏洞修复提醒', fromName: '杨博士', fromEmail: 'admin@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 2, 6, 40, 0).getTime(),
  },
  {
    id: 'm141', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '关于项目进度的更新通知', fromName: '钱总', fromEmail: 'pm@corp.com',
    to: ["me@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '客户满意度调查结果已出。', body: '已在附件中更新最新版本，请查收并及时反馈意见。如有疑问，请随时沟通。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 4, 22, 35, 0).getTime(),
  },
  {
    id: 'm142', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '新人培训材料', fromName: '朱老师', fromEmail: 'pm@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '异常数据排查完成，修复方案已提交。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [],
    timestamp: new Date(2026, 0, 4, 11, 45, 0).getTime(),
  },
  {
    id: 'm143', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '薪资调整通知', fromName: '徐总', fromEmail: 'sales@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 6, 10, 25, 0).getTime(),
  },
  {
    id: 'm144', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '离职交接清单', fromName: '周老师', fromEmail: 'design@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [],
    timestamp: new Date(2026, 0, 5, 20, 55, 0).getTime(),
  },
  {
    id: 'm145', accountId: 'acc2', folder: 'archive', category: 'other',
    unread: false, starred: false,
    subject: '自动化测试覆盖', fromName: '市场经理', fromEmail: 'dev@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [{"name": "安全审计报告.pdf", "size": "3.4 MB"}],
    timestamp: new Date(2026, 0, 7, 22, 25, 0).getTime(),
  },
  {
    id: 'm146', accountId: 'acc1', folder: 'archive', category: 'other',
    unread: true, starred: false,
    subject: '离职交接清单', fromName: '陈博士', fromEmail: 'rd@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 2, 18, 5, 0).getTime(),
  },
  {
    id: 'm147', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '用户体验优化建议', fromName: '孙工', fromEmail: 'boss@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '系统例行维护时间安排已确认。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [],
    timestamp: new Date(2026, 0, 3, 8, 45, 0).getTime(),
  },
  {
    id: 'm148', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '绩效考核结果公示', fromName: '市场经理', fromEmail: 'dev@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户满意度调查结果已出。', body: '已完成对异常数据的排查，问题根源已锁定。修复方案已提交评审，预计本周内合并上线。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 3, 17, 0, 0).getTime(),
  },
  {
    id: 'm149', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: true,
    subject: '密码重置提醒', fromName: '张总', fromEmail: 'sales@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [],
    timestamp: new Date(2026, 0, 3, 10, 55, 0).getTime(),
  },
  {
    id: 'm150', accountId: 'acc2', folder: 'archive', category: 'other',
    unread: false, starred: false,
    subject: '供应商评估报告', fromName: '张伟', fromEmail: 'admin@client.cn',
    to: ["me@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '系统例行维护时间安排已确认。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "安全审计报告.pdf", "size": "3.4 MB"}],
    timestamp: new Date(2026, 0, 5, 10, 20, 0).getTime(),
  },
  {
    id: 'm151', accountId: 'acc1', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '收入数据分析', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [{"name": "安全审计报告.pdf", "size": "3.4 MB"}],
    timestamp: new Date(2026, 0, 8, 12, 15, 0).getTime(),
  },
  {
    id: 'm152', accountId: 'acc2', folder: 'archive', category: 'other',
    unread: false, starred: true,
    subject: '离职交接清单', fromName: '朱老师', fromEmail: 'support@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '异常数据排查完成，修复方案已提交。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 17, 35, 0).getTime(),
  },
  {
    id: 'm153', accountId: 'acc3', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '离职交接清单', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 9, 22, 5, 0).getTime(),
  },
  {
    id: 'm154', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: true, starred: false,
    subject: '部署上线通知', fromName: '陈博士', fromEmail: 'design@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 6, 18, 10, 0).getTime(),
  },
  {
    id: 'm155', accountId: 'acc3', folder: 'inbox', category: 'newsletter',
    unread: true, starred: false,
    subject: '供应商评估', fromName: '孙莉', fromEmail: 'admin@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 2, 18, 15, 0).getTime(),
  },
  {
    id: 'm156', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '用户体验优化建议', fromName: '产品经理', fromEmail: 'qa@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 9, 7, 15, 0).getTime(),
  },
  {
    id: 'm157', accountId: 'acc3', folder: 'sent', category: 'newsletter',
    unread: false, starred: true,
    subject: '季度目标复盘纪要', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: ["pm@calendarpro.io"],
    preview: '本周项目例会通知，请准时参加。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 3, 6, 25, 0).getTime(),
  },
  {
    id: 'm158', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '邮件归档通知', fromName: '钱总', fromEmail: 'hr@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [],
    timestamp: new Date(2026, 0, 5, 10, 55, 0).getTime(),
  },
  {
    id: 'm159', accountId: 'acc1', folder: 'archive', category: 'focused',
    unread: true, starred: false,
    subject: '部门周会纪要', fromName: '设计总监', fromEmail: 'hr@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '已在附件中更新最新版本，请查收并及时反馈意见。如有疑问，请随时沟通。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 6, 12, 10, 0).getTime(),
  },
  {
    id: 'm160', accountId: 'acc3', folder: 'sent', category: 'newsletter',
    unread: false, starred: false,
    subject: '迭代回顾总结', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 3, 16, 30, 0).getTime(),
  },
  {
    id: 'm161', accountId: 'acc2', folder: 'drafts', category: 'focused',
    unread: false, starred: false,
    subject: '入职手续办理指南', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [],
    timestamp: new Date(2026, 0, 8, 15, 45, 0).getTime(),
  },
  {
    id: 'm162', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '供应商评估', fromName: '行政助理', fromEmail: 'rd@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 4, 23, 30, 0).getTime(),
  },
  {
    id: 'm163', accountId: 'acc2', folder: 'sent', category: 'social',
    unread: true, starred: false,
    subject: '容器集群扩容', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '技术方案可行性评估已完成。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 5, 13, 10, 0).getTime(),
  },
  {
    id: 'm164', accountId: 'acc1', folder: 'inbox', category: 'social',
    unread: false, starred: false,
    subject: '邮件归档通知', fromName: '设计总监', fromEmail: 'support@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '系统维护通知，请提前做好准备。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 8, 23, 25, 0).getTime(),
  },
  {
    id: 'm165', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '关于项目进度的更新通知', fromName: '马经理', fromEmail: 'qa@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 7, 14, 10, 0).getTime(),
  },
  {
    id: 'm166', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '销售线索分配', fromName: '钱峰', fromEmail: 'design@calendarpro.io',
    to: ["me@calendarpro.io"], cc: ["pm@calendarpro.io"],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 8, 11, 30, 0).getTime(),
  },
  {
    id: 'm167', accountId: 'acc3', folder: 'inbox', category: 'social',
    unread: false, starred: false,
    subject: '合规审查通知', fromName: '周老师', fromEmail: 'hr@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '大家好，附件是本月产品更新日志，请各团队知悉并在本周内完成内部培训。',
    attachments: [],
    timestamp: new Date(2026, 0, 7, 7, 0, 0).getTime(),
  },
  {
    id: 'm168', accountId: 'acc1', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '部门周会纪要', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '系统维护通知，请提前做好准备。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 2, 16, 50, 0).getTime(),
  },
  {
    id: 'm169', accountId: 'acc3', folder: 'archive', category: 'focused',
    unread: false, starred: false,
    subject: '值班交接记录', fromName: '马超', fromEmail: 'pm@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 2, 6, 45, 0).getTime(),
  },
  {
    id: 'm170', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '成本优化建议', fromName: '市场经理', fromEmail: 'design@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户满意度调查结果已出。', body: '客户反馈了几个使用上的问题，已整理清单并分配处理人。优先级别已标注，请尽快跟进。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 5, 22, 0, 0).getTime(),
  },
  {
    id: 'm171', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '发版说明整理', fromName: '客户成功', fromEmail: 'sales@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 4, 12, 20, 0).getTime(),
  },
  {
    id: 'm172', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: 'CI/CD 流水线更新', fromName: '赵敏', fromEmail: 'support@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 2, 17, 0, 0).getTime(),
  },
  {
    id: 'm173', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '请假申请审批结果', fromName: '马经理', fromEmail: 'rd@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周项目例会通知，请准时参加。', body: '已完成对异常数据的排查，问题根源已锁定。修复方案已提交评审，预计本周内合并上线。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 2, 9, 50, 0).getTime(),
  },
  {
    id: 'm174', accountId: 'acc2', folder: 'sent', category: 'focused',
    unread: true, starred: false,
    subject: '需求优先级排序', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '本月产品更新日志已发布。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [],
    timestamp: new Date(2026, 0, 3, 14, 5, 0).getTime(),
  },
  {
    id: 'm175', accountId: 'acc2', folder: 'drafts', category: 'focused',
    unread: true, starred: true,
    subject: '新功能需求讨论', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [],
    timestamp: new Date(2026, 0, 5, 18, 20, 0).getTime(),
  },
  {
    id: 'm176', accountId: 'acc1', folder: 'inbox', category: 'social',
    unread: true, starred: false,
    subject: '值班交接记录', fromName: '行政助理', fromEmail: 'ops@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '系统维护通知，请提前做好准备。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "产品更新日志.md", "size": "120 KB"}],
    timestamp: new Date(2026, 0, 3, 11, 45, 0).getTime(),
  },
  {
    id: 'm177', accountId: 'acc3', folder: 'inbox', category: 'newsletter',
    unread: false, starred: false,
    subject: 'Sprint 规划会议', fromName: '胡总', fromEmail: 'sales@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本月产品更新日志已发布。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [{"name": "安全审计报告.pdf", "size": "3.4 MB"}],
    timestamp: new Date(2026, 0, 8, 14, 15, 0).getTime(),
  },
  {
    id: 'm178', accountId: 'acc2', folder: 'inbox', category: 'newsletter',
    unread: false, starred: false,
    subject: '数据库优化建议', fromName: '钱总', fromEmail: 'sales@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周项目例会通知，请准时参加。', body: '经过团队持续努力，本次迭代已按计划完成开发和测试。请各模块负责人确认上线时间。',
    attachments: [],
    timestamp: new Date(2026, 0, 4, 17, 0, 0).getTime(),
  },
  {
    id: 'm179', accountId: 'acc3', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '安全漏洞修复提醒', fromName: '赵主管', fromEmail: 'qa@vendor.net',
    to: ["me@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '详细方案请查看附件文档。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [],
    timestamp: new Date(2026, 0, 4, 7, 55, 0).getTime(),
  },
  {
    id: 'm180', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '入职手续办理指南', fromName: '王磊', fromEmail: 'ops@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 2, 19, 40, 0).getTime(),
  },
  {
    id: 'm181', accountId: 'acc2', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '市场推广方案', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '根据会议讨论结果，现整理相关材料。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [],
    timestamp: new Date(2026, 0, 2, 10, 40, 0).getTime(),
  },
  {
    id: 'm182', accountId: 'acc2', folder: 'drafts', category: 'focused',
    unread: false, starred: false,
    subject: '设备采购申请', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["pm@calendarpro.io"], cc: [],
    preview: '本周项目例会通知，请准时参加。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 6, 14, 30, 0).getTime(),
  },
  {
    id: 'm183', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '外包管理规范', fromName: '数据分析师', fromEmail: 'hr@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [],
    timestamp: new Date(2026, 0, 2, 18, 5, 0).getTime(),
  },
  {
    id: 'm184', accountId: 'acc2', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '现金流预测报告', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '技术方案可行性评估已完成。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 1, 15, 20, 0).getTime(),
  },
  {
    id: 'm185', accountId: 'acc3', folder: 'inbox', category: 'newsletter',
    unread: false, starred: false,
    subject: '办公用品申领', fromName: '财务主管', fromEmail: 'boss@team.org',
    to: ["me@calendarpro.io"], cc: ["boss@calendarpro.io"],
    preview: '客户满意度调查结果已出。', body: '请注意：系统将于周六凌晨 2:00-6:00 进行例行维护，请提前保存工作内容，避免数据丢失。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 2, 12, 5, 0).getTime(),
  },
  {
    id: 'm186', accountId: 'acc2', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '培训报名确认', fromName: '法务顾问', fromEmail: 'admin@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [],
    timestamp: new Date(2026, 0, 4, 16, 20, 0).getTime(),
  },
  {
    id: 'm187', accountId: 'acc1', folder: 'spam', category: 'focused',
    unread: true, starred: false,
    subject: '培训报名确认', fromName: '马超', fromEmail: 'rd@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [{"name": "需求文档_v2.1.pdf", "size": "5.7 MB"}],
    timestamp: new Date(2026, 0, 6, 19, 30, 0).getTime(),
  },
  {
    id: 'm188', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: 'API 额度预警', fromName: '后端开发', fromEmail: 'dev@team.org',
    to: ["me@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '本周项目例会通知，请准时参加。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [],
    timestamp: new Date(2026, 0, 3, 17, 50, 0).getTime(),
  },
  {
    id: 'm189', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '请假申请审批结果', fromName: '客户成功', fromEmail: 'rd@vendor.net',
    to: ["me@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [],
    timestamp: new Date(2026, 0, 7, 13, 45, 0).getTime(),
  },
  {
    id: 'm190', accountId: 'acc1', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '合同审批流程提醒', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: [],
    preview: '系统维护通知，请提前做好准备。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [{"name": "设计稿_首页改版.fig", "size": "15.2 MB"}],
    timestamp: new Date(2026, 0, 2, 20, 50, 0).getTime(),
  },
  {
    id: 'm191', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '性能基准报告', fromName: '赵主管', fromEmail: 'pm@team.org',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [],
    timestamp: new Date(2026, 0, 6, 21, 30, 0).getTime(),
  },
  {
    id: 'm192', accountId: 'acc1', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '发版说明整理', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["boss@calendarpro.io"], cc: [],
    preview: '技术方案可行性评估已完成。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [{"name": "项目进度表_2026Q1.xlsx", "size": "2.3 MB"}],
    timestamp: new Date(2026, 0, 1, 21, 0, 0).getTime(),
  },
  {
    id: 'm193', accountId: 'acc3', folder: 'archive', category: 'focused',
    unread: true, starred: false,
    subject: '新功能需求讨论', fromName: '后端开发', fromEmail: 'boss@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户需求已收到，初步评估可行。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 9, 22, 55, 0).getTime(),
  },
  {
    id: 'm194', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '现金流预测报告', fromName: '刘工', fromEmail: 'admin@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '安全扫描漏洞修复 deadline 已定。', body: '本周数据已汇总完成，核心指标如下：\n\n新增用户：+12.5%\n活跃度：提升 3.2pp\n转化率：稳定在 8.7%\n\n详细报告见附件。',
    attachments: [],
    timestamp: new Date(2026, 0, 5, 17, 50, 0).getTime(),
  },
  {
    id: 'm195', accountId: 'acc3', folder: 'drafts', category: 'focused',
    unread: false, starred: false,
    subject: '服务器扩容计划', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '本周五 15:00 将召开项目例会，主要议题：\n1. 进度同步\n2. 风险识别\n3. 资源协调\n\n请准时参加。',
    attachments: [],
    timestamp: new Date(2026, 0, 1, 6, 45, 0).getTime(),
  },
  {
    id: 'm196', accountId: 'acc2', folder: 'archive', category: 'focused',
    unread: false, starred: false,
    subject: '新人培训材料', fromName: '郭工', fromEmail: 'qa@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户满意度调查结果已出。', body: '经过深入分析，建议采用以下方案。详细内容请查看附件文档，有任何问题欢迎随时讨论。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 1, 21, 55, 0).getTime(),
  },
  {
    id: 'm197', accountId: 'acc3', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '会议纪要已发送，请查收', fromName: '何主管', fromEmail: 'boss@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周项目例会通知，请准时参加。', body: '经过深入分析，建议采用以下方案。详细内容请查看附件文档，有任何问题欢迎随时讨论。',
    attachments: [],
    timestamp: new Date(2026, 0, 8, 17, 45, 0).getTime(),
  },
  {
    id: 'm198', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: 'CI/CD 流水线更新', fromName: '胡洁', fromEmail: 'sales@corp.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '系统维护通知，请提前做好准备。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [],
    timestamp: new Date(2026, 0, 3, 6, 50, 0).getTime(),
  },
  {
    id: 'm199', accountId: 'acc3', folder: 'sent', category: 'other',
    unread: false, starred: false,
    subject: '监控告警通知', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '本周核心数据已汇总完成。', body: '关于上周提出的技术方案，研发团队已完成可行性评估。建议采用方案 B，优势在于维护成本更低。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 6, 17, 45, 0).getTime(),
  },
  {
    id: 'm200', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: true, starred: false,
    subject: '考勤异常提醒', fromName: '黄经理', fromEmail: 'finance@client.cn',
    to: ["me@calendarpro.io"], cc: [],
    preview: '本周项目例会通知，请准时参加。', body: '根据上次会议讨论结果，现将相关材料整理如下。请各负责人按时间节点推进工作。',
    attachments: [{"name": "测试用例_全量.xlsx", "size": "1.8 MB"}],
    timestamp: new Date(2026, 0, 5, 8, 35, 0).getTime(),
  },
  {
    id: 'm201', accountId: 'acc2', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: 'API 额度预警', fromName: '王磊', fromEmail: 'admin@calendarpro.io',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户满意度调查结果已出。', body: '系统计划于本周五晚间进行维护升级，届时部分服务可能短暂中断，请提前做好准备。',
    attachments: [{"name": "数据看板截图.png", "size": "2.1 MB"}],
    timestamp: new Date(2026, 0, 8, 23, 25, 0).getTime(),
  },
  {
    id: 'm202', accountId: 'acc2', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '绩效考核结果公示', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '详细方案请查看附件文档。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [{"name": "会议纪要_周度会议.docx", "size": "480 KB"}],
    timestamp: new Date(2026, 0, 9, 10, 20, 0).getTime(),
  },
  {
    id: 'm203', accountId: 'acc1', folder: 'inbox', category: 'focused',
    unread: false, starred: false,
    subject: '需求变更确认函', fromName: '李经理', fromEmail: 'design@corp.com',
    to: ["me@calendarpro.io"], cc: ["ea@calendarpro.io"],
    preview: '根据会议讨论结果，现整理相关材料。', body: '经过深入分析，建议采用以下方案。详细内容请查看附件文档，有任何问题欢迎随时讨论。',
    attachments: [{"name": "安全审计报告.pdf", "size": "3.4 MB"}],
    timestamp: new Date(2026, 0, 8, 9, 35, 0).getTime(),
  },
  {
    id: 'm204', accountId: 'acc1', folder: 'sent', category: 'focused',
    unread: false, starred: false,
    subject: '回滚预案检查', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["rd@calendarpro.io"], cc: [],
    preview: '客户反馈问题已整理并分配。', body: '客户满意度调查结果已出，NPS 得分 +8 分，详情请见附件报告。',
    attachments: [],
    timestamp: new Date(2026, 0, 5, 14, 10, 0).getTime(),
  },
  {
    id: 'm205', accountId: 'acc1', folder: 'inbox', category: 'other',
    unread: false, starred: false,
    subject: '转化率分析', fromName: '人力资源', fromEmail: 'design@partner.com',
    to: ["me@calendarpro.io"], cc: [],
    preview: '客户满意度调查结果已出。', body: '本次安全扫描发现 3 个中危漏洞，已分配给对应团队修复，deadline 为下周五。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 2, 15, 30, 0).getTime(),
  },
  {
    id: 'm206', accountId: 'acc1', folder: 'sent', category: 'newsletter',
    unread: false, starred: false,
    subject: '产品规划讨论会', fromName: '我', fromEmail: 'me@calendarpro.io',
    to: ["design@calendarpro.io"], cc: [],
    preview: '附件已更新至最新版本，请查收并及时反馈。', body: '收到客户最新需求，初步评估后认为可行。已安排下周进行需求评审，请项目组提前准备。',
    attachments: [{"name": "代码审查报告.html", "size": "320 KB"}],
    timestamp: new Date(2026, 0, 8, 13, 0, 0).getTime(),
  },
];;

export const buildMailDraft = ({ mode = 'new', mail = null, fallbackAccountId = 'acc1' }) => {
  if (mode === 'editDraft' && mail) {
    return {
      mailId: mail.id,
      accountId: mail.accountId || fallbackAccountId,
      to: joinRecipients(mail.to),
      cc: joinRecipients(mail.cc),
      subject: mail.subject || '',
      body: mail.body || '',
      attachments: mail.attachments || [],
    };
  }

  if (!mail) {
    return {
      mailId: null,
      accountId: fallbackAccountId,
      to: '',
      cc: '',
      subject: '',
      body: '',
      attachments: [],
    };
  }

  const quoteBody = `\n\n---- 原始邮件 ----\n发件人：${mail.fromName} <${mail.fromEmail}>\n时间：${formatMailTime(mail.timestamp)}\n主题：${mail.subject}\n\n${mail.body}`;

  if (mode === 'reply') {
    return {
      mailId: null,
      accountId: mail.accountId || fallbackAccountId,
      to: mail.fromEmail,
      cc: '',
      subject: ensureSubjectPrefix(mail.subject, 'RE'),
      body: quoteBody,
      attachments: [],
    };
  }

  if (mode === 'replyAll') {
    return {
      mailId: null,
      accountId: mail.accountId || fallbackAccountId,
      to: joinRecipients(Array.from(new Set([mail.fromEmail, ...(mail.to || [])]))),
      cc: joinRecipients(mail.cc || []),
      subject: ensureSubjectPrefix(mail.subject, 'RE'),
      body: quoteBody,
      attachments: [],
    };
  }

  return {
    mailId: null,
    accountId: mail.accountId || fallbackAccountId,
    to: '',
    cc: '',
    subject: ensureSubjectPrefix(mail.subject, 'FW'),
    body: `请查收以下转发内容。${quoteBody}`,
    attachments: mail.attachments || [],
  };
};
