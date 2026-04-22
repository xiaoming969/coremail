import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
  Inbox,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  Minus,
  MoreHorizontal,
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('日历组件渲染失败:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '40px',
            background: '#fef2f2',
            color: '#991b1b',
            height: '100vh',
            fontFamily: 'sans-serif',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            ⚠️ 渲染拦截：应用发生异常
          </h2>
          <p>请将以下错误信息反馈给开发者，以便快速修复：</p>
          <pre
            style={{
              background: '#fff',
              padding: '20px',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              marginTop: '20px',
              overflow: 'auto',
              fontSize: '13px',
            }}
          >
            {this.state.error && this.state.error.toString()}
            <br />
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;
const BASE_WEEK_START = new Date(2026, 0, 5);
const TODAY_DATE = new Date(2026, 0, 9, 10, 30);
const DAY_START_HOUR = 0;
const DAY_END_HOUR = 24;
const WORK_START_HOUR = 8;
const WORK_END_HOUR = 18;
const CELL_HEIGHT = 96;
const TIMELINE_HEADER_HEIGHT = 56;
const SPLIT_WEEK_PANE_HEADER_HEIGHT = 36;
const HALF_HOUR_STEP = 0.5;
const MIN_EVENT_DURATION = 0.5;
const HOURS = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, index) => index + DAY_START_HOUR);
const WEEKDAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const MONTH_WEEKDAY_NAMES = ['一', '二', '三', '四', '五', '六', '日'];
const VIEW_OPTIONS = [
  { id: 'month', label: '月' },
  { id: 'week', label: '周' },
  { id: 'day', label: '日' },
];
const PRODUCT_TABS = [
  { id: 'mail', label: '邮件', icon: Mail },
  { id: 'calendar', label: '日历', icon: Calendar },
  { id: 'contacts', label: '通讯录', icon: Users },
  { id: 'settings', label: '设置', icon: Settings },
];
const MAIL_FOLDERS = [
  { id: 'inbox', label: '收件箱', icon: Inbox },
  { id: 'drafts', label: '草稿', icon: FileText },
  { id: 'sent', label: '已发送', icon: Send },
  { id: 'archive', label: '存档', icon: Archive },
];
const MAIL_CONTACTS = [
  { id: 'mc1', name: '产品经理', email: 'pm@calendarpro.io', scope: 'internal' },
  { id: 'mc2', name: '行政助理组', email: 'ea-team@calendarpro.io', scope: 'internal' },
  { id: 'mc3', name: '外部代理商', email: 'agency@vendor.com', scope: 'external' },
  { id: 'mc4', name: '客户 CFO', email: 'cfo@externalcorp.com', scope: 'external' },
];
const MODULE_COPY = {
  mail: {
    title: '邮件中心',
    desc: '这里可以承接收件箱、会话流、星标邮件与提醒回执。当前演示聚焦日历模块，邮件页先保留为占位。',
  },
  contacts: {
    title: '通讯录',
    desc: '这里可以承接组织架构、常用联系人、群组与共享目录。当前演示保留基础模块占位。',
  },
  settings: {
    title: '设置中心',
    desc: '这里可以承接账户、安全、签名与同步策略。当前演示保留系统配置入口占位。',
  },
};
const CALENDAR_PERMISSION_OPTIONS = [
  { id: 'busy_only', label: '仅查看忙闲' },
  { id: 'titles_locations', label: '查看标题和地点' },
  { id: 'all_details', label: '查看所有详细信息' },
  { id: 'edit', label: '可编辑' },
  { id: 'delegate', label: '代理人' },
];
const EXTERNAL_CALENDAR_PERMISSION_OPTIONS = CALENDAR_PERMISSION_OPTIONS.filter(
  (option) => !['edit', 'delegate'].includes(option.id),
);
const DEFAULT_CALENDAR_PERMISSION_OPTIONS = [
  { id: 'none', label: '不共享' },
  ...EXTERNAL_CALENDAR_PERMISSION_OPTIONS,
];
const DELEGATE_MEETING_OPTIONS = [
  { id: 'delegate_only', label: '仅向代理人发送会议请求和响应' },
  { id: 'delegate_copy', label: '向代理人发送，并给我保留副本' },
  { id: 'delegate_and_me', label: '同时发送给我和代理人' },
];
const PUBLISH_PERMISSION_OPTIONS = EXTERNAL_CALENDAR_PERMISSION_OPTIONS;
const CALENDAR_PERMISSION_LABELS = Object.fromEntries(
  CALENDAR_PERMISSION_OPTIONS.map((option) => [option.id, option.label]),
);
const CALENDAR_PERMISSION_LABEL_TO_ID = Object.fromEntries(
  CALENDAR_PERMISSION_OPTIONS.map((option) => [option.label, option.id]),
);
const CALENDAR_SHARE_STATUS_META = {
  pending: {
    label: '待接收',
    tone: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  accepted: {
    label: '已接收',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  ignored: {
    label: '已忽略',
    tone: 'border-slate-200 bg-slate-100 text-slate-500',
  },
  revoked: {
    label: '已撤回',
    tone: 'border-rose-200 bg-rose-50 text-rose-700',
  },
};
const PERMISSION_REQUEST_STATUS_META = {
  pending: {
    label: '待审批',
    tone: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  approved: {
    label: '已批准',
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  rejected: {
    label: '已拒绝',
    tone: 'border-rose-200 bg-rose-50 text-rose-700',
  },
};
const CALENDAR_PERMISSION_CAPABILITIES = {
  busy_only: ['查看忙闲', '不可查看日程详情', '不可编辑'],
  titles_locations: ['查看标题和地点', '不可查看正文', '不可编辑'],
  all_details: ['查看完整详情', '不可编辑', '不可再次分享'],
  edit: ['查看完整详情', '可新建 / 编辑 / 删除日程', '不可管理共享成员'],
  delegate: ['查看完整详情', '可编辑日程', '可管理共享成员'],
};
const MAX_SPLIT_ACCOUNTS = 3;
const SHARED_ACCOUNT_TEMPLATES = [
  { name: '财务团队', email: 'finance@calendarpro.io', color: 'bg-cyan-500', permissionId: 'all_details' },
  { name: '法务团队', email: 'legal@calendarpro.io', color: 'bg-fuchsia-500', permissionId: 'titles_locations' },
  { name: '客户成功', email: 'cs@calendarpro.io', color: 'bg-teal-500', permissionId: 'edit' },
  { name: '外部顾问', email: 'advisor@vendor.com', color: 'bg-amber-500', permissionId: 'busy_only' },
];
const MOCK_SHARE_INVITATIONS = [
  {
    id: 'share-invite-1',
    senderName: '财务团队',
    senderEmail: 'finance@calendarpro.io',
    calendarName: '财务团队协作日历',
    permissionId: 'all_details',
    color: 'bg-cyan-500',
    status: 'pending',
    createdAt: new Date(2026, 0, 8, 14, 20).getTime(),
    message: '共享了季度预算与报销排期，接收后会出现在左侧"共享账户"。',
  },
  {
    id: 'share-invite-2',
    senderName: '外部顾问',
    senderEmail: 'advisor@vendor.com',
    calendarName: '外部项目协作日历',
    permissionId: 'busy_only',
    color: 'bg-amber-500',
    status: 'pending',
    createdAt: new Date(2026, 0, 9, 9, 5).getTime(),
    message: '仅开放忙闲占用，方便跨团队排会时快速查看空档。',
  },
];
const MOCK_PERMISSION_REQUESTS = [
  {
    id: 'perm-request-1',
    calendarId: 'c1',
    shareId: 'share1',
    requesterName: '产品经理',
    requesterEmail: 'pm@calendarpro.io',
    currentPermissionId: 'all_details',
    requestedPermissionId: 'edit',
    status: 'pending',
    createdAt: new Date(2026, 0, 9, 11, 40).getTime(),
    reason: '需要在下周评审前代为调整会议时间和参会人。',
  },
];
const EVENT_KIND_DEFAULTS = {
  event: {
    title: '',
    description: '',
    reminder: '30m',
    availability: 'busy',
    visibility: 'default',
  },
};
const MEETING_PROVIDER_OPTIONS = [
  { id: 'none', label: '不添加链接' },
  { id: 'meet', label: 'Google Meet' },
  { id: 'teams', label: 'Teams' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'phone', label: '线下 / 电话' },
];
const REPEAT_OPTIONS = [
  { id: 'does_not_repeat', label: '不重复' },
  { id: 'every_day', label: '每天' },
  { id: 'weekdays', label: '工作日' },
  { id: 'every_week', label: '每周' },
];
const REMINDER_OPTIONS = [
  { id: 'none', label: '不提醒' },
  { id: '10m', label: '提前 10 分钟' },
  { id: '30m', label: '提前 30 分钟' },
  { id: '1h', label: '提前 1 小时' },
  { id: '1d', label: '提前 1 天' },
];
const AVAILABILITY_OPTIONS = [
  { id: 'busy', label: '忙碌' },
  { id: 'free', label: '空闲' },
];
const VISIBILITY_OPTIONS = [
  { id: 'default', label: '默认可见' },
  { id: 'private', label: '私人日程' },
];
const INITIAL_CREATE_DRAFT_PANELS = {
  requiredExpanded: false,
  optionalExpanded: false,
  conflictsExpanded: false,
  requiredBulkOpen: false,
  optionalBulkOpen: false,
};
const INITIAL_CREATE_DRAFT_BULK_INPUTS = {
  attendees: '',
  optionalAttendees: '',
};
const EVENT_KIND_LABELS = { event: '日程', focus: '日程', ooo: '日程' };
const MEETING_PROVIDER_LABELS = Object.fromEntries(MEETING_PROVIDER_OPTIONS.map((option) => [option.id, option.label]));
const REPEAT_LABELS = Object.fromEntries(REPEAT_OPTIONS.map((option) => [option.id, option.label]));
const REMINDER_LABELS = Object.fromEntries(REMINDER_OPTIONS.map((option) => [option.id, option.label]));
const AVAILABILITY_LABELS = {
  ...Object.fromEntries(AVAILABILITY_OPTIONS.map((option) => [option.id, option.label])),
  out_of_office: '忙碌',
};
const VISIBILITY_LABELS = Object.fromEntries(VISIBILITY_OPTIONS.map((option) => [option.id, option.label]));

const stripTime = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const addMonths = (date, amount) => {
  const base = stripTime(date);
  const targetFirstDay = new Date(base.getFullYear(), base.getMonth() + amount, 1);
  const lastDay = new Date(targetFirstDay.getFullYear(), targetFirstDay.getMonth() + 1, 0).getDate();
  return new Date(targetFirstDay.getFullYear(), targetFirstDay.getMonth(), Math.min(base.getDate(), lastDay));
};

const sameDay = (left, right) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const sameMonth = (left, right) =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();

const getWeekStart = (date) => {
  const next = stripTime(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  return next;
};

const getWeekOffsetFromDate = (date) =>
  Math.round((getWeekStart(date).getTime() - BASE_WEEK_START.getTime()) / (7 * DAY_MS));

const dateToEventParts = (date) => {
  const target = stripTime(date);
  const weekStart = getWeekStart(target);
  return {
    weekOffset: getWeekOffsetFromDate(target),
    day: Math.round((target.getTime() - weekStart.getTime()) / DAY_MS),
  };
};

const eventToDate = (event) => addDays(BASE_WEEK_START, (event.weekOffset || 0) * 7 + (event.day || 0));

const formatHour = (value) => {
  const hour = Math.floor(value);
  const minute = value % 1 === 0.5 ? '30' : '00';
  return `${hour}:${minute}`;
};

const formatTimeRange = (startH, durationH) => `${formatHour(startH)} - ${formatHour(startH + durationH)}`;

const formatDateLabel = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const formatDraftTime = (date, startH, durationH) => `${formatDateLabel(date)} ${formatTimeRange(startH, durationH)}`;
const formatTimeSelectLabel = (value) => {
  if (value >= DAY_END_HOUR) return '24:00';
  return `${String(Math.floor(value)).padStart(2, '0')}:${value % 1 === 0.5 ? '30' : '00'}`;
};
const buildDateTimeAtHour = (date, hour) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(hour), hour % 1 === 0.5 ? 30 : 0, 0, 0);
const getDraftEndMeta = (date, startH, durationH) => {
  const start = buildDateTimeAtHour(date, startH);
  const end = new Date(start.getTime() + durationH * 60 * 60 * 1000);

  return {
    date: stripTime(end),
    hour: end.getHours() + (end.getMinutes() >= 30 ? 0.5 : 0),
  };
};
const getDraftDurationBetween = (startDate, startH, endDate, endH) => {
  const start = buildDateTimeAtHour(startDate, startH);
  const end = buildDateTimeAtHour(endDate, endH);
  return (end.getTime() - start.getTime()) / (60 * 60 * 1000);
};
const getDefaultDraftStartHour = (date) => {
  const baseDate = stripTime(date);
  if (!sameDay(baseDate, TODAY_DATE)) return 9;

  const currentHour = TODAY_DATE.getHours() + TODAY_DATE.getMinutes() / 60;
  const rounded = roundToHalfHour(currentHour + HALF_HOUR_STEP);
  return clampStartHour(Math.max(WORK_START_HOUR, rounded), 1);
};
const formatDurationLabel = (durationH) => {
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
const normalizeParticipantIdentity = (value = '') => value.trim().toLowerCase();
const TIME_SELECT_OPTIONS = Array.from({ length: DAY_END_HOUR * 2 }, (_, index) => {
  const value = index * HALF_HOUR_STEP;
  return { value: String(value), label: formatTimeSelectLabel(value) };
});
const TIME_SELECT_END_OPTIONS = [...TIME_SELECT_OPTIONS, { value: String(DAY_END_HOUR), label: formatTimeSelectLabel(DAY_END_HOUR) }];
const formatClockStamp = (date) =>
  new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));
const roundToHalfHour = (value) => Math.round(value / HALF_HOUR_STEP) * HALF_HOUR_STEP;
const clampStartHour = (startH, durationH = MIN_EVENT_DURATION) =>
  clampNumber(roundToHalfHour(startH), DAY_START_HOUR, DAY_END_HOUR - Math.max(MIN_EVENT_DURATION, durationH));
const clampDuration = (durationH, startH) =>
  clampNumber(roundToHalfHour(durationH), MIN_EVENT_DURATION, DAY_END_HOUR - startH);
const formatEventDateTime = (event) =>
  `${formatDateLabel(eventToDate(event))} · ${event.isAllDay ? '全天' : formatTimeRange(event.startH || WORK_START_HOUR, event.durationH || 1)}`;
const formatAgendaEventLabel = (event) => {
  const date = eventToDate(event);
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
  return `${date.getMonth() + 1}/${date.getDate()} ${WEEKDAY_NAMES[dayIndex]} · ${event.isAllDay ? '全天' : formatTimeRange(event.startH || WORK_START_HOUR, event.durationH || 1)}`;
};
const getSearchResultWhenMeta = (event) => {
  const date = eventToDate(event);
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
  const diffDays = Math.round((stripTime(date).getTime() - stripTime(TODAY_DATE).getTime()) / DAY_MS);
  const dateLabel =
    diffDays === 0
      ? `今天 · ${WEEKDAY_NAMES[dayIndex]}`
      : diffDays === 1
        ? `明天 · ${WEEKDAY_NAMES[dayIndex]}`
        : `${date.getMonth() + 1}月${date.getDate()}日 · ${WEEKDAY_NAMES[dayIndex]}`;

  return {
    dateLabel,
    timeLabel: event.isAllDay ? '全天' : formatTimeRange(event.startH || WORK_START_HOUR, event.durationH || 1),
  };
};
const getSearchMatchSummary = (match, query) => {
  const labels = (match?.matchedFields || []).map((field) => EVENT_SEARCH_FIELD_LABELS[field]).filter(Boolean);
  if (labels.length === 0) return query ? `命中：${query}` : '命中当前关键词';
  return `命中：${labels.join('、')}${query ? ` · "${query}"` : ''}`;
};
const getSearchResultStatusTags = (event, calendar) => {
  const tags = [];

  if (event.isAllDay) tags.push('全天');
  if (event.repeat && event.repeat !== 'does_not_repeat') tags.push('重复');
  if (event.status === '已取消') tags.push('已取消');
  else if (event.status === '待响应') tags.push('未回复');
  else if (event.status === '已拒绝') tags.push('已拒绝');
  else if (event.status === '已接受') tags.push('我已接受');
  if (event.visibility === 'private') tags.push('私密');
  if (getCalendarPermissionId(calendar?.receivedPermissionId || calendar?.permission) === 'busy_only') tags.push('仅查看');
  else if (canEditCalendarContent(calendar?.receivedPermissionId || calendar?.permission)) tags.push('可编辑');

  return Array.from(new Set(tags)).slice(0, 4);
};
const getAgendaStatusTone = (status) => {
  if (status === '待响应') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (status === '草稿') return 'bg-slate-100 text-slate-700 border-slate-200';
  if (status === '已取消') return 'bg-slate-100 text-slate-500 border-slate-200';
  if (status === '已拒绝') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
};
const getCalendarPermissionId = (permission) => CALENDAR_PERMISSION_LABEL_TO_ID[permission] || permission || 'all_details';
const getCalendarPermissionLabel = (permission) => CALENDAR_PERMISSION_LABELS[getCalendarPermissionId(permission)] || permission || '查看所有详细信息';
const canEditCalendarContent = (calendarOrPermission) => {
  const permissionId = typeof calendarOrPermission === 'string' ? getCalendarPermissionId(calendarOrPermission) : getCalendarPermissionId(calendarOrPermission?.permission);
  return ['edit', 'delegate'].includes(permissionId);
};
const canManageCalendarSharing = (calendarOrPermission) => {
  const permissionId = typeof calendarOrPermission === 'string' ? getCalendarPermissionId(calendarOrPermission) : getCalendarPermissionId(calendarOrPermission?.permission);
  return permissionId === 'delegate';
};
const canReshareCalendar = (calendarOrPermission) => canManageCalendarSharing(calendarOrPermission);
const getNextPermissionLevel = (permission) => {
  const ordered = ['busy_only', 'titles_locations', 'all_details', 'edit', 'delegate'];
  const currentId = getCalendarPermissionId(permission);
  const currentIndex = ordered.indexOf(currentId);
  return ordered[Math.min(currentIndex + 1, ordered.length - 1)] || 'edit';
};
const formatShareTimeLabel = (timestamp) => {
  if (!timestamp) return '刚刚更新';
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const getAccountCheckboxTone = (color) => {
  if (color?.includes('orange')) return 'border-orange-500 bg-orange-500 text-white hover:border-orange-400';
  if (color?.includes('emerald')) return 'border-emerald-500 bg-emerald-500 text-white hover:border-emerald-400';
  if (color?.includes('violet')) return 'border-violet-500 bg-violet-500 text-white hover:border-violet-400';
  if (color?.includes('slate')) return 'border-slate-500 bg-slate-500 text-white hover:border-slate-400';
  return 'border-blue-600 bg-blue-600 text-white hover:border-blue-400';
};

const getPreviewPosition = (clientX, clientY) => {
  if (typeof window === 'undefined') return { x: clientX + 16, y: clientY + 16 };

  return {
    x: clampNumber(clientX + 18, 16, Math.max(16, window.innerWidth - 336)),
    y: clampNumber(clientY + 18, 16, Math.max(16, window.innerHeight - 236)),
  };
};

const getSlotFromPointer = (clientX, clientY, durationH = 1) => {
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

const clampLinesStyle = (lines) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

const getTimedEventCardDensity = ({ isSplit = false, columnCount = 1, durationH = 1 }) => {
  if (isSplit) {
    if (columnCount >= 3 || (columnCount >= 2 && durationH <= 1.25) || durationH <= 1) return 'micro';
    return 'compact';
  }

  if (columnCount >= 4 || (columnCount >= 3 && durationH <= 1.25) || (columnCount >= 2 && durationH <= 1)) return 'micro';
  if (columnCount >= 2 || durationH <= 1.25) return 'compact';
  return 'regular';
};

const overlapsWindow = (leftStart, leftEnd, rightStart, rightEnd) => leftStart < rightEnd && rightStart < leftEnd;
const isWorkHour = (hour) => hour >= WORK_START_HOUR && hour < WORK_END_HOUR;
const getTimeTop = (hour) => (hour - DAY_START_HOUR) * CELL_HEIGHT;
const getTimeHeight = (durationH) => durationH * CELL_HEIGHT;
const getWorkdayScrollTop = () => Math.max(0, (WORK_START_HOUR - DAY_START_HOUR) * CELL_HEIGHT);
const scrollElementToTop = (element, top) => {
  if (!element) return;
  element.scrollTop = top;
  element.scrollTo({ top, behavior: 'auto' });
};
const matchesSearchText = (values, query) => {
  if (!query) return true;
  return values.some((value) => String(value || '').toLowerCase().includes(query));
};
const tokenizeKeywordQuery = (query = '') => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const tokens = normalized
    .split(/[\s,，;；、|]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  return Array.from(new Set(tokens.length > 0 ? tokens : [normalized]));
};
const EVENT_SEARCH_FIELD_LABELS = {
  title: '标题',
  description: '正文',
  attendees: '参会人',
  organizer: '组织者',
  time: '时间',
  location: '地点',
  calendar: '账户/日历',
};
const EVENT_SEARCH_FIELD_WEIGHTS = {
  title: 8,
  attendees: 7,
  organizer: 7,
  location: 5,
  time: 4,
  description: 3,
  calendar: 2,
};
const SEARCH_SCOPE_OPTIONS = [
  { id: 'all', label: '全部字段' },
  { id: 'title', label: '主题' },
  { id: 'description', label: '正文' },
  { id: 'attendees', label: '参会人' },
  { id: 'organizer', label: '组织者' },
  { id: 'time', label: '时间' },
  { id: 'location', label: '地点' },
  { id: 'calendar', label: '账户/日历' },
];
const SEARCH_STATUS_OPTIONS = [
  { id: 'all', label: '全部状态' },
  { id: 'accepted', label: '已接受/正常' },
  { id: '待响应', label: '待响应' },
  { id: '已拒绝', label: '已拒绝' },
  { id: '已取消', label: '已取消' },
  { id: '草稿', label: '草稿' },
];
const SEARCH_TIMEFRAME_OPTIONS = [
  { id: 'all', label: '全部时间' },
  { id: 'this_week', label: '本周' },
  { id: 'this_month', label: '本月' },
  { id: 'next_30_days', label: '未来 30 天' },
];
const SEARCH_RESULT_COLUMN_OPTIONS = [
  { id: 'time', label: '时间' },
  { id: 'people', label: '组织者 / 参会人' },
  { id: 'location', label: '地点' },
  { id: 'calendar', label: '账户 / 日历' },
  { id: 'status', label: '状态' },
  { id: 'matchedFields', label: '命中字段' },
];
const getEventStatusBadgeMeta = (status) => {
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
const getTimedEventStatusSurface = (status) => {
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
const getEventSearchFields = (event, calendar, account) => {
  const date = eventToDate(event);
  const startH = event.startH || WORK_START_HOUR;
  const durationH = event.durationH || 1;
  const endH = startH + durationH;
  const attendeeValues = [...(event.attendees || []), ...(event.optionalAttendees || [])];

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
  };
};
const getEventSearchMatchMeta = (event, calendar, account, query, fieldScope = 'all') => {
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
const getNormalizedSearchStatus = (event) => event.status || 'accepted';
const eventMatchesSearchTimeframe = (event, timeframe) => {
  if (!timeframe || timeframe === 'all') return true;

  const eventDate = stripTime(eventToDate(event));
  const today = stripTime(TODAY_DATE);

  if (timeframe === 'this_week') {
    const start = getWeekStart(today);
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
const joinRecipients = (items = []) => items.filter(Boolean).join('; ');
const parseRecipients = (value) =>
  value
    .split(/[;,\n，；]/)
    .map((item) => item.trim())
    .filter(Boolean);
const dedupeParticipants = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = normalizeParticipantIdentity(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};
const stripMailSubjectPrefixes = (subject = '') => subject.replace(/^(\s*(re|fw|fwd)\s*:\s*)+/gi, '').trim();
const ensureSubjectPrefix = (subject, prefix) =>
  subject.toUpperCase().startsWith(`${prefix}:`) ? subject : `${prefix}: ${subject}`;
const buildConferenceLink = (provider, title = '会议') => {
  const base = encodeURIComponent(String(title || 'meeting').trim()).replace(/%/g, '').slice(0, 18) || 'meeting';
  const suffix = `${base}${Date.now().toString(36).slice(-6)}`;

  if (provider === 'meet') return `https://meet.google.com/${suffix.slice(0, 10)}`;
  if (provider === 'teams') return `https://teams.microsoft.com/l/meetup-join/${suffix}`;
  if (provider === 'zoom') return `https://zoom.us/j/${suffix.replace(/\D/g, '').slice(0, 10) || '8612345678'}`;
  return '';
};
const formatMailTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
const formatWeekdayLabel = (date) => {
  const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
  return WEEKDAY_NAMES[dayIndex];
};
const formatSuggestedSlotLabel = (date, startH, durationH, options = {}) => {
  const includeWeekday = options.includeWeekday !== false;
  const weekday = includeWeekday ? ` ${formatWeekdayLabel(date)}` : '';
  return `${date.getMonth() + 1}/${date.getDate()}${weekday} ${formatTimeRange(startH, durationH)}`;
};
const formatSuggestedTimeReason = ({ requiredCount = 0, optionalCount = 0, permissionLimitedCount = 0 }) => {
  const segments = [`基于 ${requiredCount} 位必需参会者`];
  if (optionalCount > 0) segments.push(`${optionalCount} 位可选参会者`);
  segments.push('的工作时间和忙闲状态');
  if (permissionLimitedCount > 0) segments.push(`其中 ${permissionLimitedCount} 位仅使用忙闲权限`);
  return segments.join('，');
};
const getSuggestedTimeStatusMeta = (suggestion, requiredCount = 0, optionalCount = 0) => {
  if (requiredCount <= 0) {
    return {
      tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      emphasis: '组织者可用',
      summary: optionalCount > 0 ? `已结合 ${optionalCount} 位可选参会者的忙闲给出建议时间` : '当前时间位于组织者的工作时间内',
    };
  }
  const requiredAvailable = Math.max(requiredCount - (suggestion?.requiredBusyCount || 0), 0);
  const optionalAvailable = Math.max(optionalCount - (suggestion?.optionalBusyCount || 0), 0);

  if ((suggestion?.requiredBusyCount || 0) === 0) {
    return {
      tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      emphasis: '可直接发出',
      summary:
        optionalCount > 0 && (suggestion?.optionalBusyCount || 0) > 0
          ? `全部 ${requiredCount} 位必需参会者可参加，${optionalAvailable}/${optionalCount} 位可选参会者可参加`
          : `全部 ${requiredCount} 位必需参会者可参加${optionalCount > 0 ? `，${optionalAvailable}/${optionalCount} 位可选参会者可参加` : ''}`,
    };
  }

  return {
    tone: 'border-amber-200 bg-amber-50 text-amber-700',
    emphasis: '需要协调',
    summary: `${requiredAvailable}/${requiredCount} 位必需参会者可参加${optionalCount > 0 ? `，${optionalAvailable}/${optionalCount} 位可选参会者可参加` : ''}`,
  };
};
const SCHEDULING_INTENT_PATTERNS = [
  /找时间/,
  /什么时候方便/,
  /方便沟通/,
  /约个时间/,
  /过一下/,
  /一起过/,
  /过一遍/,
  /安排.*会议/,
  /安排.*会/,
  /确认.*时间/,
  /同步.*时间/,
  /对一下时间/,
  /锁会/,
  /下周.*(安排|沟通|确认)/,
];
const detectSchedulingIntent = (subject = '', body = '') => {
  const content = `${subject}\n${body}`;
  return SCHEDULING_INTENT_PATTERNS.some((pattern) => pattern.test(content));
};
const normalizeSelectionSlot = (slot) => ({
  ...slot,
  date: stripTime(slot.date),
  startH: slot.startH,
  endH: slot.endH ?? slot.startH + (slot.durationH || 1),
  durationH: slot.durationH ?? (slot.endH ?? slot.startH + 1) - slot.startH,
  laneId: slot.laneId || null,
});
const selectionMatchesSlot = (selection, slot) =>
  Boolean(
    selection &&
      slot &&
      sameDay(selection.date, stripTime(slot.date)) &&
      (selection.laneId || null) === (slot.laneId || null) &&
      slot.hour >= selection.startH &&
      slot.hour < selection.endH,
  );

const buildTimedEventLayout = (items) => {
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

const buildAllDayEventLayout = (items) => {
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

const parseDraftTime = (text) => {
  const match = text.match(
    /(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2})(?::(\d{2}))?\s*-\s*(\d{1,2})(?::(\d{2}))?/,
  );

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const dayNumber = Number(match[3]);
  const startHour = Number(match[4]);
  const startMinute = Number(match[5] || 0);
  const endHour = Number(match[6]);
  const endMinute = Number(match[7] || 0);
  const startH = startHour + (startMinute >= 30 ? 0.5 : 0);
  const endH = endHour + (endMinute >= 30 ? 0.5 : 0);

  if (endH <= startH) return null;

  const date = stripTime(new Date(year, month, dayNumber));
  return {
    date,
    ...dateToEventParts(date),
    startH,
    durationH: endH - startH,
  };
};

const buildWeekDays = (focusDate) => {
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

const buildMiniMonthCells = (focusDate) => {
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

const formatRangeTitle = (layout, focusDate) => {
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

const eventMatchesLayout = (event, layout, focusDate) => {
  const eventDate = eventToDate(event);

  if (layout === 'day') return sameDay(eventDate, focusDate);
  if (layout === 'month') return sameMonth(eventDate, focusDate);

  const weekStart = getWeekStart(focusDate);
  const weekEnd = addDays(weekStart, 7);
  return eventDate >= weekStart && eventDate < weekEnd;
};

const sortEvents = (events) =>
  [...events].sort((left, right) => {
    const leftDate = eventToDate(left).getTime();
    const rightDate = eventToDate(right).getTime();

    if (leftDate !== rightDate) return leftDate - rightDate;
    if ((left.isAllDay ? 1 : 0) !== (right.isAllDay ? 1 : 0)) return left.isAllDay ? -1 : 1;
    return (left.startH || 0) - (right.startH || 0);
  });

const getToneClasses = (event, colorClass) => {
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

  return {
    container: `${colorClass.replace('bg-', 'bg-').replace('500', '100')} ${colorClass
      .replace('bg-', 'border-')
      .replace('500', '300')} ${colorClass.replace('bg-', 'text-').replace('500', '900')}`,
    stripe: colorClass,
  };
};

const getDefaultEditableCalendarId = (calendars, activeAccountIds, preferredAccountId = null) => {
  const visibleEditable = calendars.filter(
    (calendar) => activeAccountIds.includes(calendar.accountId) && canEditCalendarContent(calendar),
  );

  const preferredAccountCalendar = preferredAccountId
    ? visibleEditable.find((calendar) => calendar.accountId === preferredAccountId)
    : null;
  const preferred = visibleEditable.find((calendar) => calendar.type === 'my');

  return preferredAccountCalendar?.id || preferred?.id || visibleEditable[0]?.id || calendars.find((calendar) => canEditCalendarContent(calendar))?.id;
};

const buildDraftForm = ({ event, slot, focusDate, calendars, activeAccountIds }) => {
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

const MOCK_ACCOUNTS = [
  {
    id: 'acc1',
    name: '主工作',
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
    id: 'acc2',
    name: '领导助理',
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
    name: '销售团队',
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
];

const MOCK_CALENDARS = [
  {
    id: 'c1',
    accountId: 'acc1',
    name: '我的工作日历',
    type: 'my',
    owner: '我',
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
        name: '产品经理',
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
        name: 'EA Team',
        email: 'ea-team@calendarpro.io',
        scope: 'internal',
        permission: 'delegate',
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
    name: '市场活动排期',
    type: 'my',
    owner: '我',
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
        name: '市场负责人',
        email: 'marketing@calendarpro.io',
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
    id: 'c3',
    accountId: 'acc2',
    name: '张总 (领导)',
    type: 'shared',
    owner: '张总',
    color: 'bg-orange-500',
    checked: true,
    permission: '代理人',
    isPrimary: true,
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
    name: '李四 (研发)',
    type: 'shared',
    owner: '李四',
    color: 'bg-slate-500',
    checked: true,
    permission: '仅查看忙闲',
    isPrimary: true,
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
    name: '销售团队视图',
    type: 'shared',
    owner: '销售团队',
    color: 'bg-emerald-500',
    checked: true,
    permission: '可编辑',
    isPrimary: false,
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
        name: '外部代理商',
        email: 'agency@vendor.com',
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
];

const MOCK_EVENTS = [
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

const MOCK_MAILS = [
  {
    id: 'm1',
    accountId: 'acc1',
    folder: 'inbox',
    category: 'focused',
    unread: true,
    starred: true,
    subject: 'Q2 路线评审材料已更新',
    fromName: '产品经理',
    fromEmail: 'pm@calendarpro.io',
    to: ['me@calendarpro.io'],
    cc: ['ea@calendarpro.io'],
    preview: '评审材料已经补齐预算和风险页，建议明天下午一起过一遍。',
    body: 'Hi，\n\n评审材料已经补齐预算和风险页，建议明天下午一起过一遍。如果你确认，我会同步给张总和研发负责人。\n\n附件里是最新版本。\n\nThanks,\n产品经理',
    attachments: [{ name: 'Q2_路线评审_v4.pptx', size: '8.2 MB' }],
    timestamp: new Date(2026, 0, 9, 9, 20).getTime(),
    linkedEventId: 'e6',
  },
  {
    id: 'm2',
    accountId: 'acc2',
    folder: 'inbox',
    category: 'focused',
    unread: true,
    starred: false,
    subject: '请确认下周客户拜访行程',
    fromName: '张总',
    fromEmail: 'boss@calendarpro.io',
    to: ['ea@calendarpro.io'],
    cc: ['me@calendarpro.io'],
    preview: '客户把会面时间改到周三上午，是否能顺带安排午餐会？',
    body: '请确认下周客户拜访行程。客户把会面时间改到周三上午，是否能顺带安排午餐会？另外看看是否需要提前锁会。\n\n张总',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 8, 10).getTime(),
    linkedEventId: 'e3',
  },
  {
    id: 'm3',
    accountId: 'acc3',
    folder: 'inbox',
    category: 'other',
    unread: false,
    starred: false,
    subject: '销售周报已归档到共享邮箱',
    fromName: '销售团队',
    fromEmail: 'sales@calendarpro.io',
    to: ['sales@calendarpro.io'],
    cc: [],
    preview: '本周新增 4 条高潜客户线索，详细数据见正文。',
    body: '本周新增 4 条高潜客户线索，华东区成交机会提升明显。详细数据已经归档到共享邮箱，请需要的同学直接查看。',
    attachments: [{ name: '销售周报_第1周.xlsx', size: '1.3 MB' }],
    timestamp: new Date(2026, 0, 8, 18, 45).getTime(),
  },
  {
    id: 'm4',
    accountId: 'acc1',
    folder: 'drafts',
    category: 'focused',
    unread: false,
    starred: false,
    subject: 'Re: 设计规范对齐会后结论',
    fromName: '我',
    fromEmail: 'me@calendarpro.io',
    to: ['design@calendarpro.io'],
    cc: ['pm@calendarpro.io'],
    preview: '草稿尚未发送，包含会后 action item 和补充时间安排。',
    body: '大家好，\n\n补充今天会后的结论如下：\n1. 本周五前补齐规范页。\n2. 下周一再次评审。\n\n如果没有问题，我会同步更新日历邀请。',
    attachments: [],
    timestamp: new Date(2026, 0, 9, 7, 50).getTime(),
  },
  {
    id: 'm5',
    accountId: 'acc1',
    folder: 'sent',
    category: 'focused',
    unread: false,
    starred: false,
    subject: '会议纪要：周度产研对齐',
    fromName: '我',
    fromEmail: 'me@calendarpro.io',
    to: ['pm@calendarpro.io', 'rd@calendarpro.io'],
    cc: ['boss@calendarpro.io'],
    preview: '纪要已经同步，请关注里程碑和资源风险项。',
    body: '各位好，\n\n本周会议纪要已经同步，请重点关注里程碑与资源风险项。若有补充，请今天内回复邮件。',
    attachments: [{ name: '会议纪要_周度产研对齐.docx', size: '640 KB' }],
    timestamp: new Date(2026, 0, 8, 17, 10).getTime(),
    linkedEventId: 'e1',
  },
  {
    id: 'm6',
    accountId: 'acc2',
    folder: 'archive',
    category: 'other',
    unread: false,
    starred: true,
    subject: '董事会材料请提前打印',
    fromName: '行政助理组',
    fromEmail: 'ea-team@calendarpro.io',
    to: ['ea@calendarpro.io'],
    cc: [],
    preview: '董事会材料明早 8:30 前需送达，请确认打印份数。',
    body: '董事会材料明早 8:30 前需送达，请确认打印份数，并在今晚完成装订。',
    attachments: [{ name: '董事会材料.pdf', size: '12.1 MB' }],
    timestamp: new Date(2026, 0, 7, 19, 5).getTime(),
  },
];

const buildMailDraft = ({ mode = 'new', mail = null, fallbackAccountId = 'acc1' }) => {
  if (mode === 'editDraft' && mail) {
    return {
      mailId: mail.id,
      accountId: mail.accountId || fallbackAccountId,
      to: joinRecipients(mail.to),
      cc: joinRecipients(mail.cc),
      subject: mail.subject || '',
      body: mail.body || '',
      attachments: mail.attachments || [],
      availabilityProposal: mail.availabilityProposal || null,
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
      availabilityProposal: null,
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
      availabilityProposal: null,
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
      availabilityProposal: null,
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
    availabilityProposal: null,
  };
};

function ProductTabsBar({ activeProduct, onSelect, compact = false, vertical = false }) {
  return (
    <div className={`${vertical ? 'grid grid-cols-1' : 'grid grid-cols-4'} ${compact ? 'gap-1.5' : 'gap-2'}`}>
      {PRODUCT_TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          title={label}
          className={`rounded-xl border px-2 ${compact ? 'py-2.5' : 'py-3'} ${vertical ? 'w-full' : ''} flex items-center justify-center transition-all duration-200 ${
            activeProduct === id
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Icon size={compact ? 16 : 18} />
        </button>
      ))}
    </div>
  );
}

function ProductRail({ activeProduct, onSelect }) {
  return (
    <aside className="w-20 bg-slate-950 text-white border-r border-slate-800 shrink-0 flex flex-col items-center py-4">
      <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
        <Mail size={20} />
      </div>
      <div className="mt-3 text-[10px] font-black tracking-[0.28em] text-slate-400">MAIL OS</div>
      <div className="mt-auto w-full px-3 space-y-2">
        {PRODUCT_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`w-full rounded-xl px-2 py-3 flex flex-col items-center transition-colors ${
              activeProduct === id ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Icon size={18} />
            <span className="mt-1.5 text-[11px] font-bold">{label}</span>
          </button>
        ))}
      </div>
    </aside>
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
        <p className="text-gray-600 leading-relaxed mb-8">{copy.desc}</p>
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
        <div className="text-sm text-gray-500 mt-2 leading-relaxed">{MODULE_COPY[activeProduct]?.desc || '当前模块正在补齐中。'}</div>
      </div>
      <div className="flex-1 bg-[#f1f3f5] p-5">
        <div className="border-t border-dashed border-slate-300 px-1 pt-5 text-sm text-gray-500 leading-relaxed">
          这里预留给该模块自己的侧栏信息，例如目录、标签、常用操作或共享设置。
        </div>
      </div>
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
        {[{ title: '我的账户', items: ownAccounts }, { title: '其他账户', items: sharedAccounts }].map((group) => (
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
  onOpenAvailabilityPicker,
  onConfirmAvailabilitySlot,
  rescheduleSuggestions,
  onOpenReschedule,
  onApplyRescheduleSuggestion,
  upcomingEvents,
  linkedEventLookup,
  accountMap,
  calendarMap,
  onOpenEvent,
}) {
  const selectedMailHasSchedulingIntent = detectSchedulingIntent(selectedMail?.subject || '', selectedMail?.body || '');
  const selectedLinkedEvent = selectedMail?.linkedEventId ? linkedEventLookup[selectedMail.linkedEventId] || null : null;

  return (
    <div className="flex flex-1 min-w-0 overflow-hidden bg-white">
      <div className="w-[360px] min-w-0 border-r border-slate-200 bg-[#fcfcfb] flex flex-col">
        <div className="border-b border-slate-200 bg-[#fcfcfb] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-black text-gray-900">邮件</div>
              <div className="text-xs text-gray-500 mt-1">按账户联看收件箱，交互方式参考 Outlook 阅读窗格。</div>
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
                        {mail.availabilityProposal && (
                          <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 text-[11px] font-black">
                            可用时间卡
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
                        {mail.rescheduleRequestForEventId && !mail.rescheduleResolvedAt && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-black">
                            待重排
                          </span>
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
          <div className="h-full flex items-center justify-center text-gray-400">请选择一封邮件查看详情。</div>
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
                      {selectedMailHasSchedulingIntent && !selectedMail.availabilityProposal && (
                        <button
                          onClick={() => onOpenAvailabilityPicker(selectedMail.id)}
                          className="px-3 py-2 rounded-xl bg-white border border-blue-200 text-sm font-bold text-blue-700"
                        >
                          插入可用时间
                        </button>
                      )}
                      <button onClick={() => onScheduleFromMail(selectedMail.id)} className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-sm font-bold text-blue-700">
                        生成日程
                      </button>
                    </div>
                  </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {selectedMailHasSchedulingIntent && !selectedMail.availabilityProposal && (
                <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-blue-900">识别到这封邮件在讨论排期</div>
                      <div className="mt-1 text-xs text-blue-700">可以直接插入你的空闲时间卡片，不用手动在正文里打字描述。</div>
                    </div>
                    <button
                      onClick={() => onOpenAvailabilityPicker(selectedMail.id)}
                      className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                      插入可用时间
                    </button>
                  </div>
                </div>
              )}

              {selectedMail.availabilityProposal && (
                <div className="mb-6">
                  <AvailabilityProposalCard
                    proposal={selectedMail.availabilityProposal}
                    onPickSlot={(slotId) => onConfirmAvailabilitySlot(selectedMail.id, slotId)}
                  />
                </div>
              )}

              {selectedMail.rescheduleRequestForEventId && !selectedMail.rescheduleResolvedAt && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-amber-900">邀请被拒绝，建议直接寻找新时间</div>
                      <div className="mt-1 text-xs text-amber-700">系统已经剔除当前冲突时段，并基于最新忙闲状态重新推荐时间。</div>
                    </div>
                    <button
                      onClick={() => onOpenReschedule(selectedMail.rescheduleRequestForEventId)}
                      className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm font-semibold text-amber-800 transition hover:bg-amber-100"
                    >
                      寻找新时间
                    </button>
                  </div>

                  {rescheduleSuggestions.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {rescheduleSuggestions.map((suggestion, index) => (
                        <button
                          key={`${selectedMail.rescheduleRequestForEventId}-${index}`}
                          onClick={() => onApplyRescheduleSuggestion(selectedMail.rescheduleRequestForEventId, suggestion)}
                          className="rounded-lg border border-white/80 bg-white px-3 py-2 text-left transition hover:border-amber-300"
                        >
                          <div className="text-sm font-semibold text-slate-900">
                            {formatSuggestedSlotLabel(suggestion.date, suggestion.startH, suggestion.durationH)}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            {suggestion.requiredBusyCount === 0 ? '可直接全员更新' : `仍有 ${suggestion.requiredBusyCount} 位必需参会者冲突`}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedLinkedEvent?.status === '已取消' && (
                <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-rose-900">这场会议已经取消</div>
                      <div className="mt-1 text-xs text-rose-700">可直接打开日程查看详情，或从日历中删除这条无效会议。</div>
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
          <div className="mt-1 text-xs text-slate-500">看邮件时也能顺手确认最近有没有会。</div>
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

function MailComposerModal({
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
  onOpenAvailabilityPicker,
  onRemoveAvailabilityProposal,
}) {
  if (!open || !draft) return null;

  const hasSchedulingIntent = detectSchedulingIntent(draft.subject || '', draft.body || '');

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="flex w-full max-w-[820px] max-h-[88vh] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
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
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${contact.scope === 'external' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
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
              {hasSchedulingIntent && (
                <button
                  onClick={onOpenAvailabilityPicker}
                  className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-xs font-bold text-blue-700 inline-flex items-center"
                >
                  <Clock size={13} className="mr-1.5" />
                  插入可用时间
                </button>
              )}
              <button onClick={onAddAttachment} className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-700 inline-flex items-center">
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

          {draft.availabilityProposal && (
            <AvailabilityProposalCard
              proposal={draft.availabilityProposal}
              onRemove={onRemoveAvailabilityProposal}
              actionLabel="等待对方确认"
            />
          )}

          <textarea
            value={draft.body}
            onChange={(event) => onChange({ body: event.target.value })}
            placeholder="输入邮件正文..."
            className="w-full min-h-[320px] rounded-xl border border-gray-300 px-4 py-4 text-sm text-gray-800 bg-white resize-none focus:outline-none"
          />
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-xs text-gray-500">支持回复、转发、草稿保存和基于邮件生成日程。</div>
          <div className="flex items-center gap-3">
            <button onClick={onSaveDraft} className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-bold text-gray-700">
              存草稿
            </button>
            <button onClick={onSend} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold inline-flex items-center">
              发送
              <Send size={14} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarSidebar({
  accounts,
  miniMonthEventMap,
  focusDate,
  calendarLayout,
  collapsed,
  onNewEvent,
  onShiftMonth,
  onSelectDate,
  onToggleAccount,
  onSetAccountGroupChecked,
  onOpenMailboxPermissions,
  onOpenSharedCalendarAccess,
  onOpenSharingSettings,
  onAddSharedCalendar,
  onToggleCollapsed,
  onAccountContextMenu,
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
        className="relative z-10 hidden shrink-0 select-none border-r border-slate-200 bg-white/90 backdrop-blur-[80px] md:flex md:flex-col"
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
            <div className="flex h-11 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-blue-600">
              <button
                onClick={() => {
                  onNewEvent();
                  setCreateMenuOpen(false);
                }}
                className="flex flex-1 items-center justify-center transition hover:bg-slate-200"
                title="新建日程"
              >
                <Plus size={18} />
              </button>
              <div className="w-px bg-slate-200" />
              <button
                onClick={() => setCreateMenuOpen((prev) => !prev)}
                className="flex w-10 items-center justify-center transition hover:bg-slate-200"
                title="展开新建菜单"
              >
                <ChevronDown size={16} />
              </button>
            </div>
            {createMenuOpen && (
              <div className="absolute left-[calc(100%+8px)] top-0 z-30 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-md">
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
      className="relative z-10 hidden shrink-0 select-none border-r border-slate-200 bg-white/90 backdrop-blur-[80px] md:flex md:flex-col"
      style={{ width: '252px', zIndex: 20 }}
    >
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-lg font-black text-gray-900">账户</div>
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
              const showWeekRange = calendarLayout === 'week' && inActiveWeek;

              return (
                <div
                  key={cell.key}
                  className="relative flex h-9 cursor-pointer items-center justify-center"
                  onClick={() => onSelectDate(cell.date)}
                >
                  {showWeekRange && <div className="absolute inset-0 rounded-full bg-slate-100"></div>}
                  <button
                    type="button"
                    onClick={() => onSelectDate(cell.date)}
                    className={`relative z-[1] aspect-square w-7 flex items-center justify-center rounded-full font-medium transition-colors ${
                      cell.isCurrentMonth ? 'text-gray-700 hover:bg-slate-200' : 'text-gray-300'
                    } ${
                      isSelectedDate || cell.isToday
                        ? 'bg-blue-600 text-white font-bold'
                        : ''
                    }`}
                  >
                    {cell.date.getDate()}
                  </button>
                  {markerColors.length > 0 && (
                    <div className="pointer-events-none absolute left-1/2 z-[1] flex -translate-x-1/2 items-center justify-center" style={{ bottom: '1px' }}>
                      <span className={`h-[2px] w-[6px] rounded-full ${isSelectedDate ? 'bg-white' : 'bg-blue-500'}`}></span>
                    </div>
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
              { key: 'ownAccounts', title: '我的账户', ownership: 'self', items: ownAccounts },
              { key: 'sharedAccounts', title: '共享账户', ownership: 'shared', items: sharedAccounts },
            ].map((group) => (
              <div key={group.title} className="group">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <button onClick={() => toggleSection(group.key)} className="flex items-center min-w-0 text-left">
                    <ChevronDown size={14} className={`mr-1.5 text-gray-400 transition-transform ${collapsedSections[group.key] ? '-rotate-90' : ''}`} />
                    <div className="text-[11px] font-bold text-gray-400 tracking-wide">{group.title}</div>
                  </button>
                  <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                    {group.items.length > 0 && !group.items.every((item) => item.checked) && (
                      <button
                        onClick={() => onSetAccountGroupChecked(group.ownership)}
                        className="rounded-md px-2 py-0.5 text-[11px] font-medium text-gray-500 transition hover:bg-slate-200/70"
                      >
                        全选
                      </button>
                    )}
                    {group.ownership === 'self' && (
                      <button
                        onClick={onOpenSharingSettings}
                        className="rounded-md p-1 text-gray-400 transition hover:bg-slate-200/70 hover:text-gray-600"
                        title="设置共享账户"
                      >
                        <Settings size={13} />
                      </button>
                    )}
                  </div>
                </div>
		                {!collapsedSections[group.key] && <div className="space-y-px">
		                  {group.items.map((account) => (
                    <div
	                    key={account.id}
	                    className="group/account relative flex cursor-default items-center gap-2 rounded-lg px-1.5 py-[3px] transition-colors duration-120 hover:bg-slate-200/50"
	                    onContextMenu={(e) => onAccountContextMenu(e, account)}
	                  >
	                    {/* Checkbox - independent click zone */}
	                    <button
	                      onClick={(e) => { e.stopPropagation(); onToggleAccount(account.id); }}
	                      className={`flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all duration-150 ${
	                        account.checked
	                          ? `scale-100 border-transparent ${getAccountCheckboxTone(account.color).split(' ').filter(s => s.includes('bg-') || s.includes('text-')).join(' ')}`
	                          : 'border-gray-300 bg-white scale-100 hover:border-blue-400 hover:bg-blue-50/50'
	                      }`}
	                      title={account.checked ? '取消选中' : '选中'}
	                    >
	                      {account.checked && <Check size={10} strokeWidth={2.5} />}
	                    </button>
	                    {/* Content area - click to open details */}
	                    <div
                        title={account.name || ''}
                        className="min-w-0 flex-1 truncate cursor-pointer py-0.5 rounded px-1 -mx-1 transition-colors hover:bg-white/40"
                        onClick={() => {
                          if (account.ownership === 'shared') {
                            onOpenSharedCalendarAccess(account.id);
                          } else {
                            onOpenMailboxPermissions(account.id);
                          }
                        }}
                      >
			                        <span className="text-[13px] leading-tight font-medium text-gray-800">
			                          {account.name || ''}
			                        </span>
			                      </div>
			                      {/* Pending notification dot for shared calendars */}
                      {account.ownership === 'shared' && account.hasPendingInvite && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                      )}
			                    </div>
	                  ))}
                  {group.items.length === 0 && (
                    <div className="px-1 py-3 text-xs font-medium text-gray-400">
                      {`当前没有${group.title}`}
                    </div>
                  )}
                  {/* Persistent add button for shared calendars */}
                  {group.ownership === 'shared' && (
                    <button
                      onClick={onAddSharedCalendar}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg px-2 py-[5px] text-[12px] font-medium text-gray-500 transition-colors duration-120 hover:bg-slate-200/70 hover:text-blue-600 mt-0.5"
                    >
                      <Plus size={13} />
                      添加共享账户
                    </button>
                  )}
                </div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 p-4">
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
                          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-slate-100 hover:text-gray-700"
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
                            day.isToday ? 'bg-blue-50/80' : 'bg-[#fcfcfb]'
                          }`}
                          style={{ height: `${weekTimelineHeaderHeight}px` }}
                        >
                          <div className="flex h-full flex-col items-center justify-center">
                            <span className={`text-xs font-bold ${day.isToday ? 'text-blue-600' : 'text-gray-500'}`}>{day.short}</span>
                            <span className={`text-lg font-black ${day.isToday ? 'text-blue-700' : 'text-gray-800'}`}>{day.dayNumber}</span>
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
                              title={`${event.title}${account ? ` · ${account.email || account.name}` : ''}`}
                              className={`pointer-events-auto absolute rounded-md border text-left px-2 py-1 text-[11px] font-semibold truncate transition-colors hover:bg-white ${tones.container}`}
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
                              const editable =
                                !event.isAllDay && event.type !== 'busy_only' && event.status !== '已取消' && canEditCalendarContent(calendar);
                              const safeStartH = event.startH || WORK_START_HOUR;
                              const safeDuration = event.durationH || 1;
                              const top = getWeekTimeTop(safeStartH);
                              const height = getTimeHeight(safeDuration);
                              const tones = getToneClasses(event, colorClass);
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

                              return (
                                <div
                                  key={event.id}
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
                                  title={`${event.title || '无标题'} · ${formatTimeRange(safeStartH, safeDuration)}${account ? ` · ${account.email || account.name}` : ''}`}
                                  className={`group absolute overflow-hidden border ${useCompactCard ? 'rounded-lg shadow-none' : 'rounded-xl shadow-sm'} ${tones.container} ${statusSurface.cardClass} ${
                                    editable ? 'cursor-grab active:cursor-grabbing select-none hover:ring-2 hover:ring-blue-200/80 hover:z-10' : 'cursor-pointer'
                                  } ${isInteracting && interaction?.changed ? 'pointer-events-none ring-2 ring-blue-300 shadow-lg z-20' : useCompactCard ? 'hover:z-10' : 'hover:shadow-md hover:z-10'}`}
                                  style={{ top: `${top}px`, height: `${height}px`, left, width, padding: useCompactCard ? '6px' : '8px' }}
                                >
                                  {event.type !== 'busy_only' && <div className={`absolute left-0 top-0 bottom-0 w-1 ${tones.stripe}`}></div>}
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
                                  {event.type === 'busy_only' ? (
                                    <div className="font-bold flex items-center h-full justify-center opacity-60">
                                      <Lock size={14} className="mr-1" />
                                      忙碌
                                    </div>
                                  ) : (
                                    <div className={`flex flex-col h-full min-w-0 ${statusBadgeMeta ? 'pr-9' : ''} pl-1`}>
                                      {showAccountLabel && !useCompactCard && account && <div className="text-[10px] font-black opacity-60 truncate">{account.email || account.name}</div>}
                                      <div
                                        className={`mb-1 font-bold leading-tight ${event.status === '已取消' ? 'line-through' : ''} ${
                                          useCompactCard ? 'text-[11px] break-words' : 'text-[12px] break-words'
                                        }`}
                                        style={clampLinesStyle(cardDensity === 'micro' ? 2 : 2)}
                                      >
                                        {event.title || '无标题'}
                                      </div>
                                      {useCompactCard ? (
                                        <div className="mb-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] font-semibold leading-tight opacity-80">
                                          <span className="whitespace-nowrap">{formatHour(safeStartH)}</span>
                                          <span className="opacity-45">-</span>
                                          <span className="whitespace-nowrap">{formatHour(safeStartH + safeDuration)}</span>
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
                            <div className="absolute left-0 right-0 pointer-events-none" style={{ top: `${getWeekTimeTop(10.5)}px`, zIndex: 15 }}>
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
                    <div className="flex h-14 items-center px-4 bg-white">
                      <div className="flex min-w-0 items-center justify-between gap-3 w-full">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-gray-500">{isSplit ? (lane.email || lane.name) : sameDay(focusDate, TODAY_DATE) ? '今日' : '所选日期'}</div>
                          <div className="text-lg font-black text-gray-900">
                            {isSplit ? `${focusDate.getMonth() + 1}月${focusDate.getDate()}日` : `${focusDate.getDate()}日`}
                          </div>
                        </div>
                        {isSplit && (
                          <button
                            type="button"
                            onClick={() => onHideAccount?.(lane.id)}
                            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-slate-100 hover:text-gray-700"
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
                              className="w-full text-left rounded-xl border px-3 py-2 bg-gray-50 hover:bg-white"
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
                        const editable =
                          !event.isAllDay && event.type !== 'busy_only' && event.status !== '已取消' && canEditCalendarContent(calendar);
                        const safeStartH = event.startH || WORK_START_HOUR;
                        const safeDuration = event.durationH || 1;
                        const top = getTimeTop(safeStartH);
                        const height = getTimeHeight(safeDuration);
                        const tones = getToneClasses(event, calendar.color || 'bg-gray-500');
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
                              return (
                          <div
                            key={event.id}
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
                            title={`${event.title || '无标题'} · ${formatTimeRange(safeStartH, safeDuration)}${event.location ? ` · ${event.location}` : ''}`}
                            className={`group absolute border ${useCompactCard ? 'rounded-lg p-2.5 shadow-none' : 'rounded-xl p-3 shadow-sm'} ${tones.container} ${statusSurface.cardClass} ${
                              editable ? 'cursor-grab active:cursor-grabbing select-none hover:ring-2 hover:ring-blue-200/80 hover:z-10' : 'cursor-pointer'
                            } ${isInteracting && interaction?.changed ? 'pointer-events-none ring-2 ring-blue-300 shadow-lg z-20' : useCompactCard ? 'hover:z-10' : 'hover:shadow-md'}`}
                            style={{ top: `${top}px`, height: `${height}px`, left, width }}
                          >
                            {event.type !== 'busy_only' && <div className={`absolute left-0 top-0 bottom-0 w-1 ${useCompactCard ? '' : 'rounded-l-xl'} ${tones.stripe}`}></div>}
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
                            {event.type === 'busy_only' ? (
                              <div className="font-bold flex items-center h-full justify-center opacity-60">
                                <Lock size={14} className="mr-1" />
                                忙碌
                              </div>
                            ) : (
                              <div className={`flex flex-col h-full ${useCompactCard ? 'pl-1.5' : 'pl-2'} ${statusBadgeMeta ? 'pr-9' : ''}`}>
                                {account && !useCompactCard && <div className="text-[10px] font-black opacity-60 truncate">{account.name}</div>}
                                <div
                                  className={`mb-1 font-bold leading-tight ${event.status === '已取消' ? 'line-through' : ''} ${
                                    useCompactCard ? 'text-[11px] break-words' : 'text-sm break-words'
                                  }`}
                                  style={clampLinesStyle(cardDensity === 'micro' ? 2 : 2)}
                                >
                                  {event.title}
                                </div>
                                {useCompactCard ? (
                                  <div className="mb-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] font-semibold leading-tight opacity-80">
                                    <span className="whitespace-nowrap">{formatHour(safeStartH)}</span>
                                    <span className="opacity-45">-</span>
                                    <span className="whitespace-nowrap">{formatHour(safeStartH + safeDuration)}</span>
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
  onSelectEvent,
  onOpenEvent,
  onSelectDate,
  onQuickCreate,
  onSlotContextMenu,
  showAccountLabel,
  onPreviewEvent,
  onHidePreview,
  onHideAccount,
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
  const renderMonthCells = (panelEvents, preferredAccountId = null, paneKey = 'overlay') => (
    <div className="grid grid-cols-7 gap-px bg-slate-200">
      {monthCells.map((cell) => {
        const dayEvents = sortEvents(panelEvents.filter((event) => sameDay(eventToDate(event), cell.date)));
        const isSelectedDate = sameDay(cell.date, focusDate);
        const showQuickCreate = cell.isCurrentMonth && isSelectedDate;

        return (
          <div
            key={`${paneKey}-${cell.key}`}
            onClick={() => onSelectDate(cell.date)}
            onContextMenu={(event) => onSlotContextMenu(event, { date: cell.date, hour: 10, preferredAccountId })}
            className={`group relative flex min-h-[164px] cursor-pointer flex-col p-3 transition-colors ${
              cell.isCurrentMonth ? 'bg-white hover:bg-blue-50/40' : 'bg-slate-50 text-slate-300'
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
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
              {dayEvents.slice(0, 3).map((event) => {
                const calendar = calendarMap[event.calId] || { color: 'bg-gray-500', accountId: 'unknown' };
                const account = accountMap[calendar.accountId];
                const tones = getToneClasses(event, calendar.color || 'bg-gray-500');

                return (
                  <button
                    key={event.id}
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
                    title={`${event.title}${account ? ` · ${account.email || account.name}` : ''}`}
                    className={`w-full rounded border px-1.5 py-1 text-left text-[11px] leading-tight ${tones.container}`}
                  >
                    <div className="flex items-center gap-1 min-w-0 overflow-hidden">
                      <div className={`shrink-0 rounded-sm ${tones.stripe}`} style={{ width: '3px', height: '3px' }}></div>
                      {event.isAllDay ? (
                        <span className="truncate font-medium">{event.title}</span>
                      ) : (
                        <>
                          <span className="shrink-0 font-semibold text-gray-500" style={{ fontSize: '10px' }}>{formatHour(event.startH || 8)}</span>
                          <span className="truncate font-medium min-w-0">{event.title}</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
              {dayEvents.length > 3 && (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectDate(cell.date);
                  }}
                  className="text-[11px] font-bold text-blue-600 pl-1"
                >
                  +{dayEvents.length - 3} 更多
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
  const renderMonthGrid = (panelEvents, preferredAccountId = null, paneKey = 'overlay', stickyTop = 0) => (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white" style={{ minWidth: '100%' }}>
      {renderMonthWeekdayHeader(paneKey, stickyTop)}
      {renderMonthCells(panelEvents, preferredAccountId, paneKey)}
    </div>
  );

  if (isSplit) {
    return (
      <div className="flex-1 min-h-0 overflow-auto bg-gray-50 p-4 md:p-6">
        <div
          className="grid min-w-full gap-4"
          style={{
            gridTemplateColumns: `repeat(${monthAccounts.length}, minmax(${monthPaneMinWidth}px, 1fr))`,
            minWidth: `${monthSplitMinWidth}px`,
          }}
        >
          {monthAccounts.map((monthAccount) => {
            const panelEvents = events.filter((event) => calendarMap[event.calId]?.accountId === monthAccount.id);

            return (
              <section
                key={monthAccount.id}
                className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-gray-200 bg-gray-50 px-4 py-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${monthAccount.color}`}></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-black text-gray-900">{monthAccount.email || monthAccount.name}</div>
                    <div className="truncate text-[11px] font-bold text-gray-400">{focusDate.getFullYear()}年 {focusDate.getMonth() + 1}月</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onHideAccount?.(monthAccount.id)}
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-white hover:text-gray-700"
                    title={`隐藏 ${monthAccount.email || monthAccount.name}`}
                    aria-label={`隐藏 ${monthAccount.email || monthAccount.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="p-3">{renderMonthGrid(panelEvents, monthAccount.id, monthAccount.id, monthWeekdayStickyTop)}</div>
              </section>
            );
          })}
        </div>
      </div>
    );
  }

  return <div className="flex-1 min-h-0 overflow-auto bg-gray-50 p-4 md:p-6">{renderMonthGrid(events, null, 'overlay', 0)}</div>;
}

function EventPreviewCard({ event, calendar, account, x, y, mode = 'hover', label = '快速预览' }) {
  if (!event) return null;

  const isBusyOnly = event.type === 'busy_only';
  const isCancelled = event.status === '已取消';
  const attendees = event.attendees || [];
  const title = isBusyOnly ? '忙碌' : event.title || '无标题';

  return (
    <div
      className="fixed pointer-events-none z-[70] w-80 max-w-[calc(100vw-32px)]"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="flex items-start gap-3">
            <div className={`mt-1 h-2.5 w-2.5 rounded-full ${calendar?.color || 'bg-gray-400'}`}></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-blue-700">
                  {label}
                </span>
                {account && (
                  <span className="truncate text-[11px] font-bold text-gray-400">{account.name}</span>
                )}
              </div>
              <div className={`mt-2 text-sm font-black ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {title}
              </div>
              {calendar?.name && <div className="mt-1 text-xs font-semibold text-gray-500">{calendar.name}</div>}
            </div>
          </div>
        </div>

        <div className="space-y-2 px-4 py-3 text-xs text-gray-600">
          <div className="flex items-center font-bold text-gray-800">
            <Clock size={12} className="mr-2 text-blue-600" />
            {formatEventDateTime(event)}
          </div>

          {event.location && !isBusyOnly && (
            <div className="flex items-center">
              <MapPin size={12} className="mr-2 text-emerald-600" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          {event.organizer && !isBusyOnly && (
            <div className="flex items-center">
              <Users size={12} className="mr-2 text-violet-600" />
              <span className="truncate">{event.organizer} 组织</span>
              {attendees.length > 0 && <span className="ml-1 text-gray-400">· {attendees.length} 人</span>}
            </div>
          )}

          {event.meetingProvider && event.meetingProvider !== 'none' && !isBusyOnly && (
            <div className="flex items-center">
              <Calendar size={12} className="mr-2 text-sky-600" />
              <span>{MEETING_PROVIDER_LABELS[event.meetingProvider] || '在线会议'}</span>
            </div>
          )}

          {event.status && !isBusyOnly && (
            <div className="flex items-center">
              <Bell size={12} className="mr-2 text-amber-600" />
              <span>{event.status}</span>
            </div>
          )}

          {!isBusyOnly && (
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold text-gray-500">
              <span className="rounded-full bg-slate-100 px-2 py-1">{REPEAT_LABELS[event.repeat || 'does_not_repeat']}</span>
              <span className="rounded-full bg-slate-100 px-2 py-1">{REMINDER_LABELS[event.reminder || '30m']}</span>
            </div>
          )}

          {event.description && !isBusyOnly && (
            <p className="pt-1 text-[12px] leading-relaxed text-gray-500" style={clampLinesStyle(2)}>
              {event.description}
            </p>
          )}

          {mode === 'drag' && (
            <div className="rounded-xl bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-700">
              松手即可应用新的时间安排
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AgendaSidebar({
  title,
  groupedEvents,
  accountMap,
  calendarMap,
  onOpenEvent,
  onRespond,
}) {
  return (
    <aside
      className="relative z-10 hidden shrink-0 border-l border-slate-200 bg-[#fcfcfb] lg:flex lg:flex-col"
      style={{ width: 'clamp(272px, 23vw, 336px)', zIndex: 20 }}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-5">
        <h3 className="font-bold text-gray-900 flex items-center">
          <Calendar size={16} className="mr-2 text-blue-600" />
          {title}
        </h3>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
          {groupedEvents.reduce((total, group) => total + group.items.length, 0)}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-[#f8f8f7] p-4 space-y-4">
        {groupedEvents.map((group) => {
          const account = accountMap[group.accountId];
          const accountLabel = account?.email || account?.name || '未知账户';

          return (
            <section key={group.accountId} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <div className="min-w-0 flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${account?.color || 'bg-gray-400'}`}></div>
                  <div className="truncate text-sm font-bold text-slate-800">{accountLabel}</div>
                </div>
                <div className="ml-3 shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                  {group.items.length}
                </div>
              </div>
              <div className="relative px-4 py-3">
                <div className="space-y-3">
                {group.items.map((event) => {
                  const calendar = calendarMap[event.calId] || { color: 'bg-gray-500' };
                  const cleanedTitle =
                    event.status === '已取消'
                      ? (event.title || '无标题').replace(/^[【\[]?已取消[】\]]?\s*/, '')
                      : event.title || '无标题';
                  const detailText =
                    event.location ||
                    (event.meetingProvider && event.meetingProvider !== 'none'
                      ? MEETING_PROVIDER_LABELS[event.meetingProvider]
                      : calendar.name || '未补充地点');
                  return (
                    <div key={event.id} className="relative pl-5">
                      <div className={`absolute left-0 top-[10px] h-3 w-3 rounded-full border-2 border-white ${calendar.color}`}></div>
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <div className="text-[12px] font-semibold text-slate-500">{formatAgendaEventLabel(event)}</div>
                        {event.status && event.status !== '已接受' && (
                          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getAgendaStatusTone(event.status)}`}>
                            {event.status}
                          </span>
                        )}
                      </div>
                      <div
                        onClick={() => onOpenEvent(event.id)}
                        className="cursor-pointer rounded-lg border border-slate-200 bg-[#fcfcfb] p-3 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/40"
                      >
                        <div
                          title={cleanedTitle}
                          className={`text-sm font-semibold leading-snug ${event.status === '已取消' ? 'text-slate-400 line-through' : 'text-slate-900'}`}
                          style={clampLinesStyle(2)}
                        >
                          {cleanedTitle}
                        </div>
                        <div title={detailText} className="mt-1 flex items-center gap-1 text-xs text-slate-500" style={clampLinesStyle(1)}>
                          <MapPin size={10} className="shrink-0" />
                          <span className="truncate">{detailText}</span>
                        </div>
                        {event.status === '待响应' ? (
                          <div className="mt-3 flex gap-2" onClick={(entry) => entry.stopPropagation()}>
                            <button
                              className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-white"
                              onClick={() => onRespond(event.id, 'reject')}
                            >
                              拒绝
                            </button>
                            <button
                              className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                              onClick={() => onRespond(event.id, 'accept')}
                            >
                              接受
                            </button>
                          </div>
                        ) : event.status === '已拒绝' ? (
                          <div className="mt-3 text-[11px] font-medium text-slate-400">你已拒绝这条邀请</div>
                        ) : event.status === '已取消' ? (
                          <div className="mt-3 text-[11px] font-medium text-slate-400">该日程已取消</div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </section>
          );
        })}

        {groupedEvents.length === 0 && <div className="text-sm text-gray-400 pt-2">当前筛选下没有待处理日程。</div>}
      </div>
    </aside>
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
  const attendeeList = Array.from(new Set([event.organizer, ...(event.attendees || []), ...(event.optionalAttendees || [])])).filter(Boolean);
  const locationLabel =
    event.location || (event.meetingProvider && event.meetingProvider !== 'none' ? MEETING_PROVIDER_LABELS[event.meetingProvider] : '未填写地点');

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
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${calendar?.color || 'bg-slate-400'}`}></span>
            {account && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {account.email || account.name}
              </span>
            )}
            {calendar?.name && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                {calendar.name}
              </span>
            )}
            {event.status && event.status !== '已接受' && (
              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getAgendaStatusTone(event.status)}`}>
                {event.status}
              </span>
            )}
          </div>

          <div className="text-xl font-black text-slate-900" style={clampLinesStyle(3)}>
            {event.title || '无标题'}
          </div>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">时间</div>
              <div className="font-semibold text-slate-900">{formatAgendaEventLabel(event)}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">地点</div>
              <div className="font-semibold text-slate-900">{locationLabel}</div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">组织者</div>
              <div className="font-semibold text-slate-900">{event.organizer || '我'}</div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">参会人</div>
            {attendeeList.length > 0 ? (
              <div className="space-y-2">
                {attendeeList.map((person) => (
                  <div key={person} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                    {person}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-400">当前没有参会人</div>
            )}
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">日程说明</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-600">
              {event.description || '暂无详细说明。'}
            </div>
          </div>

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
            className="w-full rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
          >
            删除日程
          </button>
        </div>
      </div>
    </aside>
  );
}

function CalendarSearchResults({
  query,
  filters,
  accountOptions,
  onQueryChange,
  onSearch,
  onChangeFilters,
  onClear,
  results,
  onBack,
  onLocateEvent,
  onOpenEvent,
}) {
  const trimmedQuery = query.trim();
  const [selectedResultId, setSelectedResultId] = useState(null);

  useEffect(() => {
    if (results.length === 0) {
      setSelectedResultId(null);
      return;
    }

    setSelectedResultId((prev) => (results.some((result) => result.event.id === prev) ? prev : results[0].event.id));
  }, [results]);

  const groupedResults = useMemo(() => {
    const groups = [];

    results.forEach((result) => {
      const date = eventToDate(result.event);
      const groupKey = `${date.getFullYear()}-${date.getMonth()}`;
      const groupLabel = `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
      const existing = groups[groups.length - 1];

      if (!existing || existing.key !== groupKey) {
        groups.push({
          key: groupKey,
          label: groupLabel,
          items: [result],
        });
        return;
      }

      existing.items.push(result);
    });

    return groups;
  }, [results]);

  const selectedResult = useMemo(
    () => results.find((result) => result.event.id === selectedResultId) || null,
    [results, selectedResultId],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="border-b border-slate-200 bg-[#fcfcfb] px-6 py-4 sm:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ChevronLeft size={15} className="mr-2" />
              返回日历
            </button>

            <div className="flex min-w-[320px] flex-1 items-center rounded-xl border border-slate-200 bg-white px-3 py-2">
              <button
                onClick={() => onSearch(query)}
                className="shrink-0 text-gray-400 transition hover:text-gray-600"
                title="搜索日程"
                aria-label="搜索日程"
              >
                <Search size={16} />
              </button>
              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    onSearch(event.currentTarget.value);
                  }
                }}
                placeholder="继续搜索主题、正文、参会人、组织者、时间、地点..."
                className="ml-2 flex-1 border-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
              />
              {query && (
                <button
                  onClick={onClear}
                  className="ml-2 rounded-full p-1 text-gray-400 transition hover:bg-slate-100 hover:text-gray-600"
                  title="清空搜索"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm font-black text-slate-900">搜索结果</div>
            <div className="text-sm text-slate-500">
              {trimmedQuery ? `关键词 "${trimmedQuery}" 共匹配到 ${results.length} 场日程` : '输入关键词后查看搜索结果'}
            </div>
            <div className="text-sm text-slate-400">单击查看摘要，双击打开详情</div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.field}
              onChange={(event) => onChangeFilters({ field: event.target.value })}
              className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none"
            >
              {SEARCH_SCOPE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(event) => onChangeFilters({ status: event.target.value })}
              className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none"
            >
              {SEARCH_STATUS_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={filters.timeframe}
              onChange={(event) => onChangeFilters({ timeframe: event.target.value })}
              className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none"
            >
              {SEARCH_TIMEFRAME_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={filters.accountId}
              onChange={(event) => onChangeFilters({ accountId: event.target.value })}
              className="appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">全部账户</option>
              {accountOptions.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.email || account.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-[#f8f8f7] px-4 py-5 sm:px-8">
        {!trimmedQuery ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center text-slate-400">
            <div>
              <Search className="mx-auto mb-4 h-10 w-10" />
              <div className="text-base font-bold text-slate-700">输入关键词开始搜索</div>
              <div className="mt-2 text-sm leading-6">支持搜索主题、正文、参会人、组织者、时间、地点，以及账户和日历信息。</div>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center text-slate-400">
            <div>
              <Search className="mx-auto mb-4 h-10 w-10" />
              <div className="text-base font-bold text-slate-700">没有找到相关日程</div>
              <div className="mt-2 text-sm leading-6">
                可以试试会议标题、组织者、参会人、会议室、时间或地点关键词。
              </div>
            </div>
          </div>
        ) : (
          <div className="grid min-h-[560px] grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white xl:grid-cols-[minmax(360px,460px)_minmax(0,1fr)]">
            <div className="min-h-0 border-b border-slate-200 xl:border-b-0 xl:border-r">
              <div className="flex h-full min-h-0 flex-col">
                <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-4 py-3">
                  <div className="text-sm font-black text-slate-900">结果</div>
                  <div className="text-xs font-semibold text-slate-400">{results.length} 条</div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  {groupedResults.map((group) => (
                    <section key={group.key} className="border-b border-slate-100 last:border-b-0">
                      <div className="sticky top-0 z-[1] border-b border-slate-100 bg-white/95 px-4 py-2 text-xs font-black tracking-[0.08em] text-slate-500 backdrop-blur">
                        {group.label}
                      </div>
                      <div>
                        {group.items.map((result) => {
                          const { event, calendar, locationLabel } = result;
                          const isSelected = selectedResultId === event.id;
                          const whenMeta = getSearchResultWhenMeta(event);
                          const hitSummary = getSearchMatchSummary(result.match, trimmedQuery);
                          const statusTags = getSearchResultStatusTags(event, calendar);

                          return (
                            <div
                              key={event.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => setSelectedResultId(event.id)}
                              onDoubleClick={() => onOpenEvent(event.id)}
                              onKeyDown={(entry) => {
                                if (entry.key === 'Enter') {
                                  entry.preventDefault();
                                  onOpenEvent(event.id);
                                }
                                if (entry.key === ' ') {
                                  entry.preventDefault();
                                  setSelectedResultId(event.id);
                                }
                              }}
                              className={`w-full border-b border-slate-100 px-4 py-4 text-left transition outline-none last:border-b-0 ${
                                isSelected ? 'bg-blue-50/70' : 'bg-white hover:bg-slate-50'
                              }`}
                              title="双击查看详情"
                            >
                              <div className="flex gap-4">
                                <div className="w-40 shrink-0 pt-0.5">
                                  <div className="text-[12px] font-bold text-slate-500">{whenMeta.dateLabel}</div>
                                  <div className="mt-1 text-[15px] font-black leading-5 text-slate-900">{whenMeta.timeLabel}</div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="text-[15px] font-black leading-6 text-slate-900" style={clampLinesStyle(2)}>
                                        {event.title || '无标题'}
                                      </div>
                                      <div className="mt-1 truncate text-sm font-medium text-slate-600">{result.relationshipLabel}</div>
                                      <div className="mt-1 truncate text-sm text-slate-500">{locationLabel}</div>
                                    </div>
                                    {statusTags.length > 0 && (
                                      <div className="flex max-w-[180px] flex-wrap justify-end gap-1.5">
                                        {statusTags.map((tag) => (
                                          <span
                                            key={`${event.id}-${tag}`}
                                            className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                                              tag === '已取消'
                                                ? getAgendaStatusTone('已取消')
                                                : tag === '未回复'
                                                  ? getAgendaStatusTone('待响应')
                                                  : tag === '已拒绝'
                                                    ? getAgendaStatusTone('已拒绝')
                                                    : tag === '我已接受'
                                                      ? getAgendaStatusTone('已接受')
                                                      : 'border-slate-200 bg-slate-50 text-slate-600'
                                            }`}
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="mt-3 flex items-center justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="truncate text-[12px] font-semibold text-slate-500">{result.sourceLabel}</div>
                                      <div className="mt-0.5 truncate text-[12px] text-slate-400">{hitSummary}</div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(entry) => {
                                        entry.stopPropagation();
                                        onLocateEvent(event.id);
                                      }}
                                      onDoubleClick={(entry) => entry.stopPropagation()}
                                      className="inline-flex shrink-0 items-center rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] font-semibold text-slate-600 transition hover:bg-slate-50"
                                    >
                                      定位日历
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>

            <div className="min-h-0 bg-[#fafaf9]">
              {selectedResult ? (
                (() => {
                  const { event, calendar, account, locationLabel, attendeesLabel, dateLabel, match, sourceLabel, relationshipLabel } = selectedResult;
                  const detailAttendees = Array.from(
                    new Set([event.organizer, ...(event.attendees || []), ...(event.optionalAttendees || [])]),
                  ).filter(Boolean);
                  const statusTone =
                    event.status && event.status !== '已接受'
                      ? getAgendaStatusTone(event.status)
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700';

                  return (
                    <div className="flex h-full min-h-0 flex-col">
                      <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-5 py-3">
                        <div className="text-sm font-black text-slate-900">详情</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onLocateEvent(event.id)}
                            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            定位日历
                          </button>
                          <button
                            onClick={() => onOpenEvent(event.id)}
                            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            打开详情
                          </button>
                        </div>
                      </div>
                      <div className="min-h-0 flex-1 overflow-y-auto p-5">
                        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${calendar?.color || 'bg-slate-400'}`}></span>
                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                              {account?.email || account?.name || '未知账户'}
                            </span>
                            {calendar?.name && (
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                {calendar.name}
                              </span>
                            )}
                            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusTone}`}>
                              {event.status || '已接受'}
                            </span>
                          </div>

                          <div className="text-2xl font-black leading-tight text-slate-900">{event.title || '无标题'}</div>

                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">时间</div>
                              <div className="flex items-start gap-2 text-sm font-semibold text-slate-900">
                                <Clock size={14} className="mt-0.5 shrink-0 text-slate-400" />
                                <span>{dateLabel}</span>
                              </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">方式 / 地点</div>
                              <div className="flex items-start gap-2 text-sm font-semibold text-slate-900">
                                <MapPin size={14} className="mt-0.5 shrink-0 text-slate-400" />
                                <span>{locationLabel}</span>
                              </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">来源 / 所属日历</div>
                              <div className="flex items-start gap-2 text-sm font-semibold text-slate-900">
                                <Calendar size={14} className="mt-0.5 shrink-0 text-slate-400" />
                                <span>{sourceLabel || account?.email || account?.name || '未知账户'}</span>
                              </div>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">组织者 / 参会人</div>
                              <div className="flex items-start gap-2 text-sm font-semibold text-slate-900">
                                <Users size={14} className="mt-0.5 shrink-0 text-slate-400" />
                                <span>{relationshipLabel || attendeesLabel}</span>
                              </div>
                            </div>
                          </div>

                          {match.matchedFields.length > 0 && (
                            <div>
                              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">命中字段</div>
                              <div className="flex flex-wrap gap-2">
                                {match.matchedFields
                                  .map((field) => EVENT_SEARCH_FIELD_LABELS[field])
                                  .filter(Boolean)
                                  .map((label) => (
                                    <span
                                      key={`${event.id}-detail-${label}`}
                                      className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700"
                                    >
                                      {label}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">正文</div>
                            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                              {event.description || '暂无正文内容。'}
                            </div>
                          </div>

                          <div>
                            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">参会人明细</div>
                            {detailAttendees.length > 0 ? (
                              <div className="space-y-2">
                                {detailAttendees.map((person) => (
                                  <div
                                    key={`${event.id}-${person}`}
                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                                  >
                                    {person}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-sm text-slate-400">
                                当前没有参会人
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center text-slate-400">
                  <div>
                    <Search className="mx-auto mb-4 h-10 w-10" />
                    <div className="text-base font-bold text-slate-700">从左侧选择一条日程</div>
                    <div className="mt-2 text-sm leading-6">单击查看摘要，双击打开完整详情。</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarPermissionModal({
  calendar,
  permissionRequests = [],
  onClose,
  onUpdateShare,
  onAddShare,
  onRemoveShare,
  onResendShare,
  onHandlePermissionRequest,
  onUpdateDefaultSharing,
  onUpdatePublishing,
  onResetPublishLinks,
  onCopyPublishingLink,
}) {
  if (!calendar) return null;

  const pendingRequests = permissionRequests.filter((request) => request.calendarId === calendar.id && request.status === 'pending');

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[720px] max-w-[92vw] max-h-[88vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-5">
          <div>
            <div className="text-lg font-black text-gray-900">共享与权限</div>
            <div className="text-sm text-gray-500 mt-1">
              {calendar.name} · {calendar.isPrimary ? '主日历' : '附加日历'}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[72vh]">
          <div className="mb-4 rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-900">
            参考 Outlook 企业版：内部成员可授予查看、编辑，主日历额外支持"代理人"；外部共享仅保留查看类权限，并支持发布日历链接。
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 mb-6">
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="text-sm font-black text-gray-900 mb-3">默认权限</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-xs font-bold text-gray-500">
                  组织内默认权限
                  <select
                    value={calendar.defaultSharing.organization}
                    onChange={(event) => onUpdateDefaultSharing('organization', event.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white"
                  >
                    {DEFAULT_CALENDAR_PERMISSION_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-bold text-gray-500">
                  组织外默认权限
                  <select
                    value={calendar.defaultSharing.external}
                    onChange={(event) => onUpdateDefaultSharing('external', event.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white"
                  >
                    {DEFAULT_CALENDAR_PERMISSION_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-gray-900">发布日历</div>
                  <div className="text-xs text-gray-500 mt-1">对齐 Outlook 的 HTML / ICS 发布能力</div>
                </div>
                <input
                  type="checkbox"
                  checked={calendar.publishing.enabled}
                  onChange={(event) => onUpdatePublishing({ enabled: event.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
              </div>
              <label className="text-xs font-bold text-gray-500 block mt-4">
                发布内容
                <select
                  value={calendar.publishing.permission}
                  onChange={(event) => onUpdatePublishing({ permission: event.target.value })}
                  disabled={!calendar.publishing.enabled}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white disabled:bg-gray-100"
                >
                  {PUBLISH_PERMISSION_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <div className="mt-4 space-y-2">
                <div>
                  <div className="text-[11px] font-black text-gray-400 uppercase mb-1">HTML</div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={calendar.publishing.enabled ? calendar.publishing.htmlLink : '未启用发布'}
                      className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-600 bg-gray-50"
                    />
                    <button
                      onClick={() => onCopyPublishingLink('htmlLink')}
                      disabled={!calendar.publishing.enabled}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center shrink-0"
                    >
                      <Copy size={12} className="mr-1.5" />
                      复制
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-black text-gray-400 uppercase mb-1">ICS</div>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={calendar.publishing.enabled ? calendar.publishing.icsLink : '未启用发布'}
                      className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-600 bg-gray-50"
                    />
                    <button
                      onClick={() => onCopyPublishingLink('icsLink')}
                      disabled={!calendar.publishing.enabled}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center shrink-0"
                    >
                      <Copy size={12} className="mr-1.5" />
                      复制
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={onResetPublishLinks}
                className="mt-4 px-3 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200"
              >
                重置发布链接
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {calendar.sharing.map((share) => {
              const shareStatusMeta = CALENDAR_SHARE_STATUS_META[share.status || 'accepted'] || CALENDAR_SHARE_STATUS_META.accepted;
              const options =
                share.scope === 'external'
                  ? EXTERNAL_CALENDAR_PERMISSION_OPTIONS
                  : calendar.isPrimary
                    ? CALENDAR_PERMISSION_OPTIONS
                    : CALENDAR_PERMISSION_OPTIONS.filter((item) => item.id !== 'delegate');
              const isRevoked = share.status === 'revoked';

              return (
                <div key={share.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div title={share.name} className="text-sm font-bold text-gray-900 truncate">
                          {share.name}
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${share.scope === 'external' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                          {share.scope === 'external' ? '外部' : '内部'}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${shareStatusMeta.tone}`}>
                          {shareStatusMeta.label}
                        </span>
                      </div>
                      <div title={share.email} className="text-xs text-gray-500 mt-1 break-all">
                        {share.email}
                      </div>
                      <div className="mt-2 text-[11px] font-semibold text-gray-400">
                        当前权限：{getCalendarPermissionLabel(share.permission)} · 最近更新：{formatShareTimeLabel(share.updatedAt)}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {!isRevoked && (
                        <button
                          onClick={() => onResendShare(share.id)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200"
                        >
                          重发通知
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveShare(share.id)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100"
                      >
                        {isRevoked ? '已撤回' : '取消共享'}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <label className="text-xs font-bold text-gray-500">
                      姓名
                      <input
                        value={share.name}
                        onChange={(event) => onUpdateShare(share.id, { name: event.target.value })}
                        disabled={isRevoked}
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white disabled:bg-gray-100"
                      />
                    </label>
                    <label className="text-xs font-bold text-gray-500">
                      账号 / 邮箱
                      <input
                        value={share.email}
                        onChange={(event) => onUpdateShare(share.id, { email: event.target.value })}
                        disabled={isRevoked}
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white disabled:bg-gray-100"
                      />
                    </label>
                    <label className="text-xs font-bold text-gray-500">
                      共享对象
                      <select
                        value={share.scope}
                        onChange={(event) => onUpdateShare(share.id, { scope: event.target.value })}
                        disabled={isRevoked}
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white disabled:bg-gray-100"
                      >
                        <option value="internal">组织内</option>
                        <option value="external">组织外</option>
                      </select>
                    </label>
                    <label className="text-xs font-bold text-gray-500">
                      权限级别
                      <select
                        value={share.permission}
                        onChange={(event) => onUpdateShare(share.id, { permission: event.target.value })}
                        disabled={isRevoked}
                        className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white disabled:bg-gray-100"
                      >
                        {options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {share.permission === 'delegate' && !isRevoked && (
                    <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
                      <label className="flex items-center justify-between text-sm text-gray-700">
                        <span className="font-bold">可查看私人项目</span>
                        <input
                          type="checkbox"
                          checked={share.canViewPrivate}
                          onChange={(event) => onUpdateShare(share.id, { canViewPrivate: event.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600"
                        />
                      </label>
                      <label className="text-xs font-bold text-gray-500 block">
                        会议请求处理
                        <select
                          value={share.meetingResponses}
                          onChange={(event) => onUpdateShare(share.id, { meetingResponses: event.target.value })}
                          className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-800 bg-white"
                        >
                          {DELEGATE_MEETING_OPTIONS.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-black text-gray-900">权限升级申请</div>
                <div className="mt-1 text-xs text-gray-500">共享对象权限不足时，会在这里收到升级申请，审批结果会同步通知对方。</div>
              </div>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-600">
                待处理 {pendingRequests.length}
              </span>
            </div>
            {pendingRequests.length > 0 ? (
              <div className="mt-4 space-y-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900">
                          {request.requesterName} · 申请升级到 {getCalendarPermissionLabel(request.requestedPermissionId)}
                        </div>
                        <div className="mt-1 text-xs text-slate-500 break-all">
                          {request.requesterEmail} · {formatShareTimeLabel(request.createdAt)}
                        </div>
                      </div>
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        {getCalendarPermissionLabel(request.currentPermissionId)} → {getCalendarPermissionLabel(request.requestedPermissionId)}
                      </span>
                    </div>
                    <div className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                      {request.reason}
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => onHandlePermissionRequest(request.id, 'reject')}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        拒绝
                      </button>
                      <button
                        onClick={() => onHandlePermissionRequest(request.id, 'approve')}
                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
                      >
                        批准并升级
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                当前没有待处理的权限升级申请。
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => onAddShare('internal')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold inline-flex items-center"
            >
              <Plus size={16} className="mr-2" />
              添加组织内成员
            </button>
            <button
              onClick={() => onAddShare('external')}
              className="px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-bold inline-flex items-center"
            >
              <Plus size={16} className="mr-2" />
              添加外部对象
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MailboxPermissionModal({
  account,
  onClose,
  onUpdateMember,
  onToggleMemberPermission,
  onAddMember,
  onRemoveMember,
  onToggleSetting,
}) {
  if (!account) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[720px] max-w-[92vw] max-h-[88vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-5">
          <div>
            <div className="text-lg font-black text-gray-900">账户详情</div>
            <div className="text-sm text-gray-500 mt-1">{account.name} · {account.email}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[72vh] space-y-5">
          {/* 成员权限 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-black text-gray-900">成员权限</div>
              <button
                onClick={onAddMember}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1"
              >
                <Plus size={12} />
                添加成员
              </button>
            </div>
            <div className="space-y-2">
              {account.mailboxMembers.map((member) => (
                <div key={member.id} className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                        {member.name?.[0] || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{member.name}</div>
                        <div className="text-xs text-gray-400">{member.email}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className="px-2 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      移除
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ['fullAccess', '完全访问'],
                      ['sendAs', '作为此邮箱发送'],
                      ['sendOnBehalf', '代表此邮箱发送'],
                    ].map(([key, label]) => (
                      <label key={key} className="rounded-lg border border-gray-200 px-3 py-2 flex items-center justify-between text-xs font-bold text-gray-700 cursor-pointer hover:bg-slate-50 transition">
                        <span>{label}</span>
                        <input
                          type="checkbox"
                          checked={member[key]}
                          onChange={() => onToggleMemberPermission(member.id, key)}
                          className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 账户设置 */}
          <div>
            <div className="text-sm font-black text-gray-900 mb-3">账户设置</div>
            <div className="rounded-xl border border-gray-200 divide-y divide-gray-100">
              {[
                ['showInAddressList', '显示在全局地址列表'],
                ['saveSentItems', '在共享邮箱中保存已发送邮件'],
                ['automap', '自动映射到 Outlook'],
                ['mobileAccess', '允许移动端访问'],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 cursor-pointer hover:bg-slate-50 first:rounded-t-xl last:rounded-b-xl">
                  <span className="font-bold">{label}</span>
                  <input
                    type="checkbox"
                    checked={account.mailboxSettings[key]}
                    onChange={() => onToggleSetting(key)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddSharedCalendarModal({
  open,
  draft,
  invitations,
  onClose,
  onChange,
  onApplyTemplate,
  onSubmit,
  onAcceptInvitation,
  onIgnoreInvitation,
}) {
  if (!open) return null;

  const pendingInvitations = invitations.filter((item) => item.status === 'pending');
  const resolvedInvitations = invitations.filter((item) => item.status !== 'pending');

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div
        className="w-[640px] max-w-[92vw] max-h-[88vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-4">
          <div className="text-lg font-black text-gray-900">共享账户</div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[72vh] space-y-5">
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {[
              ['inbox', `收到的共享${pendingInvitations.length > 0 ? ` (${pendingInvitations.length})` : ''}`],
              ['manual', '手动添加'],
            ].map(([tabId, label]) => (
              <button
                key={tabId}
                onClick={() => onChange({ tab: tabId })}
                className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${
                  draft.tab === tabId ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {draft.tab === 'inbox' ? (
            <div className="space-y-4">
              {pendingInvitations.length > 0 ? (
                <div className="space-y-2.5">
                  {pendingInvitations.map((invite) => (
                    <div key={invite.id} className="group/invite flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${invite.color}`}></span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 truncate">{invite.calendarName}</span>
                          <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2 py-[2px] text-[10px] font-bold text-amber-700">
                            {getCalendarPermissionLabel(invite.permissionId)}
                          </span>
                        </div>
                        <div className="mt-0.5 text-xs text-slate-400 truncate">{invite.senderName} · {invite.senderEmail}</div>
                      </div>
                      <div className="flex items-center shrink-0 gap-1.5 opacity-0 transition group-hover/invite:opacity-100">
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
                          接收
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center text-sm text-slate-400">
                  暂无待处理的共享邀请
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-xs font-bold text-gray-500">
                  显示名称
                  <input
                    value={draft.name}
                    onChange={(event) => onChange({ name: event.target.value })}
                    placeholder="例如：领导助理"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>
                <label className="text-xs font-bold text-gray-500">
                  账号 / 邮箱
                  <input
                    value={draft.email}
                    onChange={(event) => onChange({ email: event.target.value })}
                    placeholder="例如：name@company.com"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </label>
                <label className="text-xs font-bold text-gray-500">
                  默认权限
                  <select
                    value={draft.permissionId}
                    onChange={(event) => onChange({ permissionId: event.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {CALENDAR_PERMISSION_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-bold text-gray-500">
                  视图颜色
                  <div className="mt-1 flex items-center flex-wrap gap-2 rounded-xl border border-gray-300 bg-white px-3 py-2.5">
                    {['bg-orange-500', 'bg-cyan-500', 'bg-teal-500', 'bg-fuchsia-500', 'bg-amber-500', 'bg-emerald-500'].map((color) => (
                      <button
                        key={color}
                        onClick={() => onChange({ color })}
                        className={`w-7 h-7 rounded-full ${color} ${draft.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                      />
                    ))}
                  </div>
                </label>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-bold text-gray-700">
            取消
          </button>
          {draft.tab === 'manual' && (
            <button onClick={onSubmit} className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold inline-flex items-center">
              <Plus size={14} className="mr-2" />
              添加共享账户
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SharedCalendarAccessModal({ calendar, account, accountCalendars, pendingRequest, onClose, onRequestUpgrade }) {
  if (!calendar) return null;

  const permissionId = getCalendarPermissionId(calendar.receivedPermissionId || calendar.permission);
  const permissionLabel = getCalendarPermissionLabel(permissionId);
  const nextPermissionId = getNextPermissionLevel(permissionId);
  const nextPermissionLabel = getCalendarPermissionLabel(nextPermissionId);
  const receivedStatusMeta = CALENDAR_SHARE_STATUS_META[calendar.receivedStatus || 'accepted'] || CALENDAR_SHARE_STATUS_META.accepted;
  const capabilities = CALENDAR_PERMISSION_CAPABILITIES[permissionId] || [];
  const canEdit = canEditCalendarContent(permissionId);
  const canManage = canManageCalendarSharing(permissionId);
  const canShareAgain = canReshareCalendar(permissionId);
  const showUpgrade = pendingRequest?.status === 'pending' || permissionId !== nextPermissionId;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="w-[640px] max-w-[92vw] max-h-[88vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-5">
          <div className="flex items-center gap-3">
            <span className={`h-4 w-4 rounded-full ${calendar.color || 'bg-gray-400'}`}></span>
            <div>
              <div className="text-lg font-black text-gray-900">{account?.name || calendar.name}</div>
              <div className="text-sm text-gray-500">{account?.email || calendar.receivedFrom || '共享日历'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${receivedStatusMeta.tone}`}>
              {receivedStatusMeta.label}
            </span>
            <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="max-h-[72vh] overflow-y-auto p-6 space-y-5">
          {/* 基本信息 */}
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm font-black text-slate-900 mb-3">基本信息</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400 mb-1">共享方</div>
                <div className="text-sm font-bold text-slate-900">{calendar.receivedFromName || calendar.owner || '—'}</div>
                <div className="text-xs text-slate-500 mt-0.5">{calendar.receivedFrom || '—'}</div>
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400 mb-1">当前权限</div>
                <div className="text-sm font-bold text-slate-900">{permissionLabel}</div>
                <div className="text-xs text-slate-500 mt-0.5">更新于 {formatShareTimeLabel(calendar.updatedAt)}</div>
              </div>
            </div>
            {capabilities.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                {capabilities.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 shrink-0"></span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 该共享账户下的日历 */}
          {accountCalendars.length > 0 && (
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-black text-slate-900 mb-3">共享日历列表</div>
              <div className="space-y-2">
                {accountCalendars.map((cal) => {
                  const calPermId = getCalendarPermissionId(cal.receivedPermissionId || cal.permission);
                  const calPermLabel = getCalendarPermissionLabel(calPermId);
                  return (
                    <div key={cal.id} className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-slate-50 hover:bg-slate-100 transition">
                      <span className={`h-2.5 w-2.5 rounded-full ${cal.color || 'bg-gray-400'}`}></span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-800 truncate">{cal.name}</div>
                      </div>
                      <span className="text-xs font-bold text-slate-500 shrink-0">{calPermLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 操作区 */}
          {showUpgrade && (
            <div className="rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-black text-slate-900 mb-2">权限升级</div>
              {pendingRequest?.status === 'pending' ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                  <div className="text-sm font-bold text-amber-800">已发送升级申请</div>
                  <div className="text-xs text-amber-700 mt-1">
                    等待 {calendar.owner} 审批 · 申请 {getCalendarPermissionLabel(pendingRequest.requestedPermissionId)}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3">
                  <div className="text-sm text-slate-600">
                    可向 {calendar.owner} 申请升级为「{nextPermissionLabel}」
                  </div>
                  <button
                    onClick={onRequestUpgrade}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700 shrink-0"
                  >
                    申请更高权限
                  </button>
                </div>
              )}
            </div>
          )}

          {!showUpgrade && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 text-center">
              当前已是最高可申请权限
            </div>
          )}
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
        className="w-[720px] max-w-[92vw] max-h-[88vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-5">
          <div>
            <div className="text-lg font-black text-gray-900">近期提醒</div>
            <div className="text-sm text-gray-500 mt-1">查看近期日程、会议邀请和待处理事项。</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[72vh] space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
              <div className="text-xs font-black text-orange-700 uppercase">待响应邀请</div>
              <div className="mt-2 text-2xl font-black text-orange-900">{pendingEvents.length}</div>
              <div className="mt-1 text-sm text-orange-800">需要尽快确认的会议邀请</div>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="text-xs font-black text-blue-700 uppercase">近期会议</div>
              <div className="mt-2 text-2xl font-black text-blue-900">{upcomingEvents.length}</div>
              <div className="mt-1 text-sm text-blue-800">接下来几天内的日程与会面安排</div>
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
      ['?', '打开快捷键说明'],
      ['Esc', '关闭弹窗 / 返回上一级'],
      ['Delete', '删除当前详情中的日程'],
      ['双击空白时间', '快速创建日程'],
    ],
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div
        className="w-[560px] max-w-[92vw] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#fcfcfb] px-6 py-5">
          <div>
            <div className="text-lg font-black text-gray-900">快捷键</div>
            <div className="text-sm text-gray-500 mt-1">参考 Google Calendar 和 Notion Calendar 的桌面操作方式做了常用键盘交互。</div>
          </div>
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

function AvailabilityProposalCard({ proposal, onPickSlot, onRemove, actionLabel = '确认这个时间' }) {
  if (!proposal) return null;

  const confirmedSlot = proposal.confirmedSlotId ? proposal.slots.find((slot) => slot.id === proposal.confirmedSlotId) : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">可用时间</div>
          <div className="mt-1 text-xs text-slate-500">{proposal.reason || '勾选几个空闲时段后，可直接插入到邮件正文中。'}</div>
        </div>
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
                    <div className="mt-1 text-xs text-slate-500">{slot.summary || '工作时间内可直接锁定'}</div>
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

        {proposal.privacyNote && <div className="text-xs text-slate-400">{proposal.privacyNote}</div>}
      </div>
    </div>
  );
}

function AvailabilityProposalModal({
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
          <div>
            <div className="text-lg font-semibold text-slate-900">插入可用时间</div>
            <div className="mt-1 text-sm text-slate-500">
              先选 3-5 个你自己的空闲时段，系统会把它们变成一张结构化时间卡片。
            </div>
          </div>
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
                      <div className="mt-1 text-xs text-slate-500">{slot.summary || '工作时间内可直接分享'}</div>
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

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="text-xs text-slate-500">建议选 3-5 个时间，收件人可以直接在邮件里点选确认。</div>
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

function MainApp() {
  const [activeProduct, setActiveProduct] = useState('calendar');
  const [currentScreen, setCurrentScreen] = useState('calendar');
  const [calendarReturnScreen, setCalendarReturnScreen] = useState('calendar');
  const [calendarLayout, setCalendarLayout] = useState('week');
  const [accountDisplayMode, setAccountDisplayMode] = useState('overlay');
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [calendars, setCalendars] = useState(MOCK_CALENDARS);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [mails, setMails] = useState(MOCK_MAILS);
  const [focusDate, setFocusDate] = useState(stripTime(TODAY_DATE));
  const [calendarSidebarCollapsed, setCalendarSidebarCollapsed] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, payload: null });
  const [contextMenu, setContextMenu] = useState(null);
  const [calendarSearchQuery, setCalendarSearchQuery] = useState('');
  const [calendarSearchFilters, setCalendarSearchFilters] = useState({
    field: 'all',
    status: 'all',
    timeframe: 'all',
    accountId: 'all',
  });
  const [permissionPanel, setPermissionPanel] = useState({ type: null, targetId: null });
  const [sharedCalendarDialog, setSharedCalendarDialog] = useState({
    open: false,
    tab: 'manual',
    name: '',
    email: '',
    permissionId: 'all_details',
    color: 'bg-cyan-500',
  });
  const [shareInvitations, setShareInvitations] = useState(MOCK_SHARE_INVITATIONS);
  const [permissionRequests, setPermissionRequests] = useState(MOCK_PERMISSION_REQUESTS);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);
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
  const [availabilityPicker, setAvailabilityPicker] = useState({
    open: false,
    source: 'composer',
    mailId: null,
    accountId: MOCK_ACCOUNTS[0]?.id || 'acc1',
    selectedSlotIds: [],
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

  const accountMap = useMemo(() => Object.fromEntries(accounts.map((account) => [account.id, account])), [accounts]);
  const calendarMap = useMemo(() => Object.fromEntries(calendars.map((calendar) => [calendar.id, calendar])), [calendars]);
  const activeAccountIds = useMemo(() => accounts.filter((account) => account.checked).map((account) => account.id), [accounts]);
  const activeAccounts = useMemo(() => accounts.filter((account) => account.checked), [accounts]);
  const normalizedCalendarSearch = calendarSearchQuery.trim().toLowerCase();
  const calendarSearchAccountOptions = useMemo(() => activeAccounts.map((account) => ({ id: account.id, label: account.email || account.name })), [activeAccounts]);
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
  const selectedEvent = useMemo(() => events.find((event) => event.id === selectedEventId), [events, selectedEventId]);
  const selectedPermissionCalendar = useMemo(
    () => (permissionPanel.type === 'calendar' ? calendars.find((calendar) => calendar.id === permissionPanel.targetId) : null),
    [calendars, permissionPanel],
  );
  const selectedPermissionMailbox = useMemo(
    () => (permissionPanel.type === 'mailbox' ? accounts.find((account) => account.id === permissionPanel.targetId) : null),
    [accounts, permissionPanel],
  );
  const selectedSharedAccessCalendar = useMemo(
    () =>
      permissionPanel.type === 'shared_access'
        ? calendars.find((calendar) => calendar.accountId === permissionPanel.targetId && calendar.type === 'shared') ||
          calendars.find((calendar) => calendar.accountId === permissionPanel.targetId)
        : null,
    [calendars, permissionPanel],
  );
  const selectedSharedPermissionRequest = useMemo(
    () =>
      selectedSharedAccessCalendar
        ? permissionRequests.find(
            (request) => request.targetSharedCalendarId === selectedSharedAccessCalendar.id && request.status === 'pending',
          ) || null
        : null,
    [permissionRequests, selectedSharedAccessCalendar],
  );
  const selectedSharedAccountCalendars = useMemo(
    () =>
      selectedSharedAccessCalendar
        ? calendars.filter((cal) => cal.accountId === selectedSharedAccessCalendar.accountId)
        : [],
    [calendars, selectedSharedAccessCalendar],
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
      permission: '仅查看',
      accountId: '',
      owner: '我',
    };
  const selectedEventAccountInfo = selectedEventCalInfo.accountId ? accountMap[selectedEventCalInfo.accountId] : null;
  const selectedEventKindLabel = selectedEvent ? EVENT_KIND_LABELS[selectedEvent.kind || 'event'] || '日程' : '';
  const selectedEventMeetingLabel =
    selectedEvent && selectedEvent.meetingProvider && selectedEvent.meetingProvider !== 'none'
      ? MEETING_PROVIDER_LABELS[selectedEvent.meetingProvider] || '在线会议'
      : '';
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
        tag: account.ownership === 'self' ? '我的账户' : '共享账户',
      });
      register(account.name, {
        title: account.name || account.email,
        subtitle: account.email,
        tag: account.ownership === 'self' ? '我的账户' : '共享账户',
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
  const scheduleSuggestions = useMemo(() => {
    const maxStart = Math.max(WORK_START_HOUR, WORK_END_HOUR - draftForm.durationH);
    const requiredSet = new Set(draftRequiredAccountIds);
    const optionalSet = new Set(draftOptionalAccountIds);
    const relevantAccountIds = new Set(draftRelevantAccountIds);
    const candidates = [];
    const privacyLimitedCount = draftRelevantAccountIds.filter((accountId) => getAccountPermissionMode(accountId) === 'busy_only').length;

    for (let dayOffset = 0; dayOffset < 5; dayOffset += 1) {
      const date = addDays(draftForm.date, dayOffset);
      const day = date.getDay();
      if (day === 0 || day === 6) continue;

      for (let startH = WORK_START_HOUR; startH <= maxStart; startH += HALF_HOUR_STEP) {
        const conflicts = collectSlotConflicts(date, startH, draftForm.durationH, draftRelevantAccountIds, draftForm.eventId);
        const requiredConflicts = conflicts.filter((event) => requiredSet.has(event.accountId));
        const optionalConflicts = conflicts.filter((event) => optionalSet.has(event.accountId));
        const requiredBusyCount = new Set(requiredConflicts.map((event) => event.accountId)).size;
        const optionalBusyCount = new Set(optionalConflicts.map((event) => event.accountId)).size;

        candidates.push({
          date,
          dayOffset,
          startH,
          conflicts,
          requiredBusyCount,
          optionalBusyCount,
          privacyLimitedCount,
          distance: dayOffset * 24 + Math.abs(startH - draftForm.startH),
          matchedRequiredCount: Math.max(draftRequiredAccountIds.length - requiredBusyCount, 0),
          matchedOptionalCount: Math.max(draftOptionalAccountIds.length - optionalBusyCount, 0),
        });
      }
    }

    return candidates
      .sort(
        (left, right) =>
          left.requiredBusyCount - right.requiredBusyCount ||
          left.optionalBusyCount - right.optionalBusyCount ||
          left.dayOffset - right.dayOffset ||
          left.distance - right.distance ||
          left.startH - right.startH,
      )
      .slice(0, 5);
  }, [
    calendarMap,
    draftForm.date,
    draftForm.durationH,
    draftForm.eventId,
    draftForm.startH,
    draftOptionalAccountIds,
    draftRelevantAccountIds,
    draftRequiredAccountIds,
    events,
  ]);
  const bestScheduleSuggestion = scheduleSuggestions[0] || null;
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
  const buildPersonalAvailabilityCandidates = (accountId, baseDate = TODAY_DATE, limit = 8) => {
    if (!accountId) return [];
    const slots = [];

    for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
      const date = addDays(stripTime(baseDate), dayOffset);
      const weekday = date.getDay();
      if (weekday === 0 || weekday === 6) continue;

      for (let startH = 9; startH <= 16; startH += 1) {
        const conflicts = collectSlotConflicts(date, startH, 1, [accountId], null);
        if (conflicts.length > 0) continue;
        slots.push({
          id: `${accountId}-${formatDateLabel(date)}-${startH}`,
          dateMs: date.getTime(),
          startH,
          durationH: 1,
          summary: '工作时间内空闲，可直接分享',
        });
        if (slots.length >= limit) return slots;
      }
    }

    return slots;
  };
  const buildRescheduleSuggestions = (event) => {
    if (!event) return [];
    const optionalParticipants = event.optionalAttendees || [];
    const requiredIds = Array.from(
      new Set([
        ...(calendarMap[event.calId]?.accountId ? [calendarMap[event.calId].accountId] : []),
        ...resolveParticipantAccountIds([event.organizer, ...(event.attendees || [])]),
      ]),
    );
    const optionalIds = resolveParticipantAccountIds(optionalParticipants).filter((accountId) => !requiredIds.includes(accountId));
    const candidates = [];
    const durationH = event.durationH || 1;
    const startDate = stripTime(eventToDate(event));
    const maxStart = Math.max(WORK_START_HOUR, WORK_END_HOUR - durationH);

    for (let dayOffset = 0; dayOffset < 5; dayOffset += 1) {
      const date = addDays(startDate, dayOffset);
      const weekday = date.getDay();
      if (weekday === 0 || weekday === 6) continue;

      for (let startH = WORK_START_HOUR; startH <= maxStart; startH += HALF_HOUR_STEP) {
        if (sameDay(date, startDate) && Math.abs(startH - (event.startH || 0)) < 0.01) continue;
        const conflicts = collectSlotConflicts(date, startH, durationH, [...requiredIds, ...optionalIds], event.id);
        const requiredBusyCount = new Set(conflicts.filter((entry) => requiredIds.includes(entry.accountId)).map((entry) => entry.accountId)).size;
        const optionalBusyCount = new Set(conflicts.filter((entry) => optionalIds.includes(entry.accountId)).map((entry) => entry.accountId)).size;
        candidates.push({
          date,
          startH,
          durationH,
          requiredBusyCount,
          optionalBusyCount,
          distance: dayOffset * 24 + Math.abs(startH - (event.startH || WORK_START_HOUR)),
        });
      }
    }

    return candidates
      .sort(
        (left, right) =>
          left.requiredBusyCount - right.requiredBusyCount ||
          left.optionalBusyCount - right.optionalBusyCount ||
          left.distance - right.distance ||
          left.startH - right.startH,
      )
      .slice(0, 3);
  };
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
  const availabilityPickerAccount = accountMap[availabilityPicker.accountId] || null;
  const availabilityPickerCandidates = useMemo(
    () => buildPersonalAvailabilityCandidates(availabilityPicker.accountId, TODAY_DATE, 8),
    [availabilityPicker.accountId, events, calendars],
  );
  const selectedMailRescheduleEvent = useMemo(
    () => events.find((event) => event.id === selectedMail?.rescheduleRequestForEventId) || null,
    [events, selectedMail],
  );
  const selectedMailRescheduleSuggestions = useMemo(
    () => buildRescheduleSuggestions(selectedMailRescheduleEvent),
    [selectedMailRescheduleEvent, events, calendars, accounts],
  );
  const selectedEventRescheduleSuggestions = useMemo(
    () => buildRescheduleSuggestions(selectedEvent?.status === '已拒绝' ? selectedEvent : null),
    [selectedEvent, events, calendars, accounts],
  );
  const calendarSearchResults = useMemo(() => {
    if (!normalizedCalendarSearch) return [];

    return activeEvents
      .map((event) => {
        const calendar = calendarMap[event.calId];
        const account = calendar ? accountMap[calendar.accountId] : null;
        if (calendarSearchFilters.accountId !== 'all' && account?.id !== calendarSearchFilters.accountId) return null;
        if (calendarSearchFilters.status !== 'all' && getNormalizedSearchStatus(event) !== calendarSearchFilters.status) return null;
        if (!eventMatchesSearchTimeframe(event, calendarSearchFilters.timeframe)) return null;

        const match = getEventSearchMatchMeta(event, calendar, account, normalizedCalendarSearch, calendarSearchFilters.field);
        if (!match) return null;

        const uniqueAttendees = Array.from(new Set([...(event.attendees || []), ...(event.optionalAttendees || [])])).filter(Boolean);
        const attendeeCount = uniqueAttendees.length;
        const date = eventToDate(event);
        const distance = Math.abs(stripTime(date).getTime() - stripTime(TODAY_DATE).getTime()) / DAY_MS;
        const participantPreview =
          attendeeCount === 0
            ? ''
            : attendeeCount <= 2
              ? uniqueAttendees.join('、')
              : `${uniqueAttendees.slice(0, 2).join('、')} 等 ${attendeeCount} 人`;
        const relationshipLabel = match.matchedFields.includes('organizer')
          ? `组织者：${event.organizer || '未填写'}`
          : match.matchedFields.includes('attendees')
            ? `参与人：${participantPreview || '未填写'}`
            : event.organizer
              ? `组织者：${event.organizer}${participantPreview ? ` · 参与人：${participantPreview}` : ''}`
              : participantPreview
                ? `参与人：${participantPreview}`
                : '未填写组织者和参与人';
        const sourceLabel = account
          ? `${account.ownership === 'self' ? '我的账户' : '共享账户'}${calendar?.name ? ` · ${calendar.name}` : ''}`
          : calendar?.name || '未知来源';
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
          locationLabel: locationParts.length > 0 ? locationParts.join(' · ') : '未填写地点或方式',
          attendeesLabel:
            attendeeCount > 0
              ? `${event.organizer || '组织者'}，另有 ${attendeeCount} 位参会人`
              : `${event.organizer || '组织者'} 组织`,
          relationshipLabel,
          sourceLabel,
        };
      })
      .filter(Boolean)
      .sort(
        (left, right) =>
          right.match.score - left.match.score ||
          left.distance - right.distance ||
          eventToDate(left.event).getTime() - eventToDate(right.event).getTime() ||
          (left.event.startH || 0) - (right.event.startH || 0),
      );
  }, [activeEvents, accountMap, calendarMap, normalizedCalendarSearch, calendarSearchFilters]);

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

  const openMailboxPermissions = (accountId) => {
    setPermissionPanel({ type: 'mailbox', targetId: accountId });
    setContextMenu(null);
  };

  const openSharedCalendarAccess = (accountId) => {
    setPermissionPanel({ type: 'shared_access', targetId: accountId });
    setContextMenu(null);
  };

  const closePermissionPanel = () => setPermissionPanel({ type: null, targetId: null });

  const getNextSharedTemplate = () => {
    const existingEmails = new Set(accounts.map((account) => account.email));
    return SHARED_ACCOUNT_TEMPLATES.find((item) => !existingEmails.has(item.email)) || SHARED_ACCOUNT_TEMPLATES[0];
  };

  const openSharedCalendarDialog = (prefill = null) => {
    const template = prefill || null;
    setSharedCalendarDialog({
      open: true,
      tab: 'manual',
      name: '',
      email: '',
      permissionId: 'all_details',
      color: 'bg-cyan-500',
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
        prev.map((account) => (account.id === existingCalendar.accountId ? { ...account, checked: true } : account)),
      );
    } else {
      const stamp = Date.now();
      const nextAccountId = `acc-${stamp}`;
      const nextCalendarId = `c-${stamp}`;
      setAccounts((prev) => [
        ...prev,
        {
          id: nextAccountId,
          name: invite.senderName,
          email: invite.senderEmail,
          role: '共享账户',
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
          name: invite.calendarName,
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
      msg: `已添加到共享账户 · 当前权限：${permissionLabel}`,
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

  const submitSharedCalendarDialog = () => {
    const draft = sharedCalendarDialog;
    const name = draft.name.trim();
    const email = draft.email.trim().toLowerCase();

    if (!name || !email) {
      triggerFeedback('L3', {
        msg: '请输入邮箱或日历地址',
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
      msg: '该共享账户已存在',
      icon: <AlertCircle size={16} />,
      color: 'bg-red-600',
    });
      return;
    }

    const stamp = Date.now();
    const nextAccountId = `acc-${stamp}`;
    const nextCalendarId = `c-${stamp}`;
    const permissionLabel = getCalendarPermissionLabel(draft.permissionId);
    const currentUser = accounts.find((account) => account.ownership === 'self');

    setAccounts((prev) => [
      ...prev,
        {
          id: nextAccountId,
        name,
        email,
        role: '共享账户',
          ownership: 'shared',
          color: draft.color,
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
            name,
            email,
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
        name: `${name} 日历`,
        type: 'shared',
        owner: name,
        color: draft.color,
        checked: true,
        permission: permissionLabel,
        isPrimary: true,
        receivedFrom: email,
        receivedFromName: name,
        receivedPermissionId: draft.permissionId,
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
            permission: draft.permissionId,
            canViewPrivate: false,
            meetingResponses: 'delegate_only',
          },
        ],
      },
    ]);
    setSharedCalendarDialog((prev) => ({ ...prev, open: false, tab: 'inbox' }));
    triggerFeedback('L3', {
      msg: `已添加到共享账户 · 当前权限：${permissionLabel}`,
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

  const requestPermissionUpgrade = (calendarId, options = {}) => {
    const calendar = calendars.find((item) => item.id === calendarId);
    const account = calendar ? accountMap[calendar.accountId] : null;
    if (!calendar || calendar.type !== 'shared') return;

    const currentPermissionId = getCalendarPermissionId(calendar.receivedPermissionId || calendar.permission);
    const requestedPermissionId = options.requestedPermissionId || getNextPermissionLevel(currentPermissionId);
    const currentUser = accounts.find((item) => item.ownership === 'self');
    const matchedShare = calendar.sharing.find(
      (share) =>
        normalizeParticipantIdentity(share.email) === normalizeParticipantIdentity(currentUser?.email || '') ||
        normalizeParticipantIdentity(share.name) === normalizeParticipantIdentity(currentUser?.name || ''),
    );
    const existingPending = permissionRequests.find(
      (request) => request.targetSharedCalendarId === calendarId && request.status === 'pending',
    );
    if (existingPending) {
      triggerFeedback('L3', {
        msg: '已存在待处理的权限升级申请',
        icon: <AlertCircle size={16} />,
        color: 'bg-slate-900',
      });
      return;
    }

    setPermissionRequests((prev) => [
      {
        id: `perm-request-${Date.now()}`,
        calendarId: matchedShare ? calendar.id : null,
        shareId: matchedShare?.id || null,
        targetSharedCalendarId: calendarId,
        ownerName: calendar.owner,
        ownerEmail: calendar.receivedFrom || account?.email || '',
        requesterName: currentUser?.name || '我',
        requesterEmail: currentUser?.email || 'me@calendarpro.io',
        calendarName: calendar.name,
        currentPermissionId,
        requestedPermissionId,
        status: 'pending',
        createdAt: Date.now(),
        reason: options.reason || '需要编辑或调整共享日历中的日程。',
      },
      ...prev,
    ]);
    triggerFeedback('L3', {
      msg: `已向 ${calendar.owner} 发送权限升级申请`,
      icon: <ArrowRight size={16} />,
      color: 'bg-blue-600',
    });
  };

  const promptPermissionUpgrade = (calendarId) => {
    const calendar = calendars.find((item) => item.id === calendarId);
    if (!calendar || calendar.type !== 'shared') return;
    const currentPermissionId = getCalendarPermissionId(calendar.receivedPermissionId || calendar.permission);
    const nextPermissionId = getNextPermissionLevel(currentPermissionId);
    const currentPermissionLabel = getCalendarPermissionLabel(currentPermissionId);
    const nextPermissionLabel = getCalendarPermissionLabel(nextPermissionId);
    if (currentPermissionId === nextPermissionId) {
      triggerFeedback('L3', {
        msg: '当前已经是可申请的最高权限',
        icon: <AlertCircle size={16} />,
        color: 'bg-slate-900',
      });
      return;
    }
    triggerFeedback('L4', {
      title: '当前权限不足',
      desc: `您当前拥有"${currentPermissionLabel}"权限，无法执行这项操作。可以向 ${calendar.owner} 申请升级到"${nextPermissionLabel}"。`,
      cancelText: '取消',
      confirmText: '申请更高权限',
      onConfirm: () => {
        setFeedback({ type: null, payload: null });
        requestPermissionUpgrade(calendarId);
      },
    });
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

  const showEventPreview = (entry, eventId) => {
    if (eventInteractionRef.current || !eventId) return;
    const { x, y } = getPreviewPosition(entry.clientX, entry.clientY);
    setHoverPreview({ eventId, x, y });
  };

  const hideEventPreview = (eventId = null) => {
    setHoverPreview((prev) => {
      if (!prev) return prev;
      if (eventId && prev.eventId !== eventId) return prev;
      return null;
    });
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
      if (calendar.type === 'shared') promptPermissionUpgrade(calendar.id);
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
      if (calendar.type === 'shared') promptPermissionUpgrade(calendar.id);
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
    setShowRightSidebar(true);
  };
  const locateEventInCalendar = (eventId) => {
    const targetEvent = events.find((event) => event.id === eventId);
    if (!targetEvent) return;

    setFocusDate(stripTime(eventToDate(targetEvent)));
    setSelectedEventId(eventId);
    setShowRightSidebar(false);
    setCurrentScreen('calendar');
    setCalendarReturnScreen('calendar');

    if (calendarLayout === 'day' || calendarLayout === 'week') {
      queueTimelineScrollToWorkStart(calendarLayout);
    }
  };
  const executeCalendarSearch = (query = calendarSearchQuery) => {
    if (!query.trim()) {
      setCurrentScreen('calendar');
      setCalendarReturnScreen('calendar');
      return;
    }

    clearTimeSelection();
    hideEventPreview();
    setShowRightSidebar(false);
    setSelectedEventId(null);
    setCurrentScreen('search');
    setCalendarReturnScreen('search');
  };
  const clearCalendarSearch = () => {
    setCalendarSearchQuery('');
    setCalendarSearchFilters({
      field: 'all',
      status: 'all',
      timeframe: 'all',
      accountId: 'all',
    });
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
    if (availabilityPicker.open) closeAvailabilityPicker();
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

  const openAvailabilityPicker = (source = 'composer', mailId = null) => {
    const sourceMail = mailId ? mails.find((mail) => mail.id === mailId) : null;
    const accountId =
      source === 'composer'
        ? mailComposer.draft.accountId || activeAccountIds[0] || accounts[0]?.id || 'acc1'
        : sourceMail?.accountId || selectedMail?.accountId || activeAccountIds[0] || accounts[0]?.id || 'acc1';
    const seededCandidates = buildPersonalAvailabilityCandidates(accountId, TODAY_DATE, 6);

    setAvailabilityPicker({
      open: true,
      source,
      mailId: mailId || sourceMail?.id || selectedMail?.id || null,
      accountId,
      selectedSlotIds: seededCandidates.slice(0, 3).map((slot) => slot.id),
    });
  };

  const closeAvailabilityPicker = () => {
    setAvailabilityPicker((prev) => ({ ...prev, open: false, selectedSlotIds: [] }));
  };

  const toggleAvailabilityPickerSlot = (slotId) => {
    setAvailabilityPicker((prev) => {
      const current = prev.selectedSlotIds.includes(slotId)
        ? prev.selectedSlotIds.filter((id) => id !== slotId)
        : [...prev.selectedSlotIds, slotId].slice(0, 5);
      return {
        ...prev,
        selectedSlotIds: current,
      };
    });
  };

  const applyAvailabilityProposal = () => {
    const selectedSlots = availabilityPickerCandidates.filter((slot) => availabilityPicker.selectedSlotIds.includes(slot.id)).slice(0, 5);
    if (selectedSlots.length === 0) return;

    const proposal = {
      id: `avail-${Date.now()}`,
      createdByAccountId: availabilityPicker.accountId,
      status: 'open',
      confirmedSlotId: null,
      lockedEventId: null,
      reason: `建议时间 · ${availabilityPickerAccount?.email || availabilityPickerAccount?.name || '当前账户'} 的工作时间与空闲时段`,
      privacyNote: '收件人确认时只需选择时间，系统会在后台自动生成日历邀请并通知双方。',
      slots: selectedSlots,
    };

    if (availabilityPicker.source === 'composer') {
      patchMailComposer({ availabilityProposal: proposal });
    } else {
      const sourceMail = mails.find((mail) => mail.id === availabilityPicker.mailId) || selectedMail;
      const fallbackAccountId = sourceMail?.accountId || availabilityPicker.accountId || activeAccountIds[0] || accounts[0]?.id || 'acc1';
      setMailComposer({
        open: true,
        mode: 'reply',
        sourceMailId: sourceMail?.id || null,
        draft: {
          ...buildMailDraft({
            mode: 'reply',
            mail: sourceMail,
            fallbackAccountId,
          }),
          accountId: fallbackAccountId,
          availabilityProposal: proposal,
        },
      });
      setActiveProduct('mail');
      if (sourceMail?.id) setSelectedMailId(sourceMail.id);
    }

    closeAvailabilityPicker();
    triggerFeedback('L3', {
      msg: '已插入可用时间卡片',
      icon: <Clock size={16} />,
      color: 'bg-blue-600',
    });
  };

  const removeComposerAvailabilityProposal = () => {
    patchMailComposer({ availabilityProposal: null });
  };

  const confirmAvailabilityProposalSlot = (mailId, slotId) => {
    const sourceMail = mails.find((mail) => mail.id === mailId);
    const proposal = sourceMail?.availabilityProposal;
    const slot = proposal?.slots?.find((item) => item.id === slotId);
    if (!sourceMail || !proposal || !slot) return;

    const accountId = proposal.createdByAccountId || sourceMail.accountId || activeAccountIds[0] || accounts[0]?.id || 'acc1';
    const targetCalendarId =
      getDefaultEditableCalendarId(calendars, [accountId], accountId) ||
      getDefaultEditableCalendarId(calendars, activeAccountIds, accountId);
    const targetCalendar = calendars.find((calendar) => calendar.id === targetCalendarId) || calendars[0];
    const account = accountMap[accountId] || accounts[0];
    const date = stripTime(new Date(slot.dateMs));
    const parts = dateToEventParts(date);
    const title = stripMailSubjectPrefixes(sourceMail.subject) || '邮件沟通同步';
    const attendees = Array.from(
      new Set([sourceMail.fromEmail, ...(sourceMail.to || []), ...(sourceMail.cc || [])].filter(Boolean)),
    ).filter((person) => person !== (account?.email || ''));
    const optionalAttendees = Array.from(new Set(sourceMail.cc || [])).filter(Boolean);
    const nextEventId = `e${Date.now()}`;
    const payload = {
      id: nextEventId,
      title,
      day: parts.day,
      weekOffset: parts.weekOffset,
      startH: slot.startH,
      durationH: slot.durationH,
      calId: targetCalendar?.id || '',
      location: '',
      organizer: account?.email || targetCalendar?.owner || '我',
      status: '待响应',
      description: `来自邮件中的可用时间确认。\n\n原邮件主题：${sourceMail.subject}\n确认时间：${formatSuggestedSlotLabel(date, slot.startH, slot.durationH)}`,
      type: 'normal',
      attendees,
      kind: 'event',
      meetingProvider: 'none',
      meetingLink: '',
      optionalAttendees,
      repeat: 'does_not_repeat',
      reminder: '30m',
      availability: 'busy',
      visibility: 'default',
      attachments: [],
    };
    const confirmationMail = {
      id: `mail-${Date.now()}`,
      accountId,
      folder: 'sent',
      category: 'focused',
      unread: false,
      starred: false,
      subject: `已确认时间：${title}`,
      fromName: account?.name || '我',
      fromEmail: account?.email || 'me@calendarpro.io',
      to: Array.from(new Set([sourceMail.fromEmail, ...(sourceMail.to || [])].filter(Boolean))),
      cc: Array.from(new Set(sourceMail.cc || [])),
      preview: `已确认 ${formatSuggestedSlotLabel(date, slot.startH, slot.durationH)}，系统已生成日历邀请。`,
      body: `已确认以下时间，并已同步生成日历邀请：\n${formatSuggestedSlotLabel(date, slot.startH, slot.durationH)}\n\n如需改期，可直接在邀请或邮件里再次寻找新时间。`,
      attachments: [],
      timestamp: Date.now(),
      linkedEventId: nextEventId,
    };

    setEvents((prev) => [...prev, payload]);
    setMails((prev) => [
      confirmationMail,
      ...prev.map((mail) =>
        mail.id === mailId
          ? {
              ...mail,
              linkedEventId: nextEventId,
              availabilityProposal: {
                ...proposal,
                status: 'confirmed',
                confirmedSlotId: slotId,
                lockedEventId: nextEventId,
              },
            }
          : mail,
      ),
    ]);
    triggerFeedback('L3', {
      msg: '已锁定时间并生成日历邀请',
      icon: <Check size={16} />,
      color: 'bg-emerald-600',
    });
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
      preview: draft.body.trim().split('\n').find(Boolean) || (draft.availabilityProposal ? '已插入可用时间卡片' : '(无正文)'),
      body: draft.body.trim(),
      attachments: draft.attachments,
      timestamp: Date.now(),
      linkedEventId: mails.find((mail) => mail.id === mailComposer.sourceMailId)?.linkedEventId || null,
      availabilityProposal: draft.availabilityProposal || null,
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

  const setAccountGroupChecked = (ownership) => {
    setAccounts((prev) =>
      prev.map((account) => (account.ownership === ownership ? { ...account, checked: true } : account)),
    );
    triggerFeedback('L3', {
      msg: `${ownership === 'self' ? '我的日历' : '共享日历'}已全部选中`,
      icon: <Check size={16} />,
      color: 'bg-slate-900',
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
    setCalendars((prev) =>
      prev.map((calendar) => {
        if (calendar.id !== calendarId) return calendar;

        const sharing = calendar.sharing.map((share) => {
          if (share.id !== shareId) return share;

          const nextShare = { ...share, ...patch, updatedAt: Date.now() };
          const allowedOptions =
            nextShare.scope === 'external'
              ? EXTERNAL_CALENDAR_PERMISSION_OPTIONS
              : calendar.isPrimary
                ? CALENDAR_PERMISSION_OPTIONS
                : CALENDAR_PERMISSION_OPTIONS.filter((item) => item.id !== 'delegate');

          if (!allowedOptions.some((option) => option.id === nextShare.permission)) {
            nextShare.permission = allowedOptions[allowedOptions.length - 1].id;
          }

          if (nextShare.permission !== 'delegate') {
            nextShare.canViewPrivate = false;
            nextShare.meetingResponses = 'delegate_only';
          }

          return nextShare;
        });

        return { ...calendar, sharing };
      }),
    );
    const shouldNotify = ['permission', 'scope', 'canViewPrivate', 'meetingResponses'].some((key) => key in patch);
    if (shouldNotify) {
      triggerFeedback('L3', {
        msg: '日历共享权限已更新',
        icon: <Check size={16} />,
        color: 'bg-blue-600',
      });
    }
  };

  const addCalendarShare = (calendarId, scope = 'internal') => {
    setCalendars((prev) =>
      prev.map((calendar) =>
        calendar.id === calendarId
          ? {
              ...calendar,
              sharing: [
                ...calendar.sharing,
                {
                  id: `share-${Date.now()}`,
                  name: scope === 'external' ? '外部共享对象' : '新共享成员',
                  email: scope === 'external' ? 'external.partner@vendor.com' : 'new.member@calendarpro.io',
                  scope,
                  permission: scope === 'external' ? 'titles_locations' : calendar.isPrimary ? 'all_details' : 'edit',
                  status: 'pending',
                  updatedAt: Date.now(),
                  canViewPrivate: false,
                  meetingResponses: 'delegate_only',
                },
              ],
            }
          : calendar,
      ),
    );
    triggerFeedback('L3', {
      msg: '共享通知已发送，对方接收后会出现在共享日历中',
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
    const currentUser = accounts.find((account) => account.ownership === 'self');
    setCalendars((prev) =>
      prev.map((item) => {
        if (item.id === calendarId) {
          return {
            ...item,
            sharing: item.sharing.map((share) =>
              share.id === shareId ? { ...share, status: 'revoked', updatedAt: Date.now() } : share,
            ),
          };
        }

        if (
          targetShare &&
          item.type === 'shared' &&
          normalizeParticipantIdentity(item.receivedFrom || '') === normalizeParticipantIdentity(targetShare.email || '') &&
          normalizeParticipantIdentity(item.owner || '') === normalizeParticipantIdentity(calendar?.owner || '')
        ) {
          return {
            ...item,
            checked: false,
            receivedStatus: 'revoked',
            updatedAt: Date.now(),
          };
        }

        if (
          targetShare &&
          item.type === 'shared' &&
          normalizeParticipantIdentity(targetShare.email || '') === normalizeParticipantIdentity(currentUser?.email || '') &&
          item.id === calendarId
        ) {
          return {
            ...item,
            checked: false,
            receivedStatus: 'revoked',
            updatedAt: Date.now(),
          };
        }

        return item;
      }),
    );
    setAccounts((prev) =>
      prev.map((account) =>
        targetShare && normalizeParticipantIdentity(account.email || '') === normalizeParticipantIdentity(targetShare.email || '') && account.ownership === 'shared'
          ? { ...account, checked: false }
          : account,
      ),
    );
    triggerFeedback('L3', {
      msg: '共享权限已撤回，对方将收到撤回通知',
      icon: <Trash size={16} />,
      color: 'bg-slate-900',
    });
  };

  const resendCalendarShare = (calendarId, shareId) => {
    setCalendars((prev) =>
      prev.map((calendar) =>
        calendar.id === calendarId
          ? {
              ...calendar,
              sharing: calendar.sharing.map((share) =>
                share.id === shareId ? { ...share, status: 'pending', updatedAt: Date.now() } : share,
              ),
            }
          : calendar,
      ),
    );
    triggerFeedback('L3', {
      msg: '已重发共享通知',
      icon: <RefreshCw size={16} />,
      color: 'bg-blue-600',
    });
  };

  const handlePermissionRequest = (requestId, action) => {
    const request = permissionRequests.find((item) => item.id === requestId);
    if (!request) return;

    setPermissionRequests((prev) =>
      prev.map((item) =>
        item.id === requestId
          ? { ...item, status: action === 'approve' ? 'approved' : 'rejected', resolvedAt: Date.now() }
          : item,
      ),
    );

    if (action === 'approve') {
      if (request.calendarId && request.shareId) {
        setCalendars((prev) =>
          prev.map((calendar) =>
            calendar.id === request.calendarId
              ? {
                  ...calendar,
                  sharing: calendar.sharing.map((share) =>
                    share.id === request.shareId
                      ? {
                          ...share,
                          permission: request.requestedPermissionId,
                          status: 'accepted',
                          updatedAt: Date.now(),
                        }
                      : share,
                  ),
                }
              : calendar,
          ),
        );
      }
      if (request.targetSharedCalendarId) {
        const approvedPermissionLabel = getCalendarPermissionLabel(request.requestedPermissionId);
        setCalendars((prev) =>
          prev.map((calendar) =>
            calendar.id === request.targetSharedCalendarId
              ? {
                  ...calendar,
                  permission: approvedPermissionLabel,
                  receivedPermissionId: request.requestedPermissionId,
                  receivedStatus: 'accepted',
                  updatedAt: Date.now(),
                }
              : calendar,
          ),
        );
      }
      triggerFeedback('L3', {
        msg: `已批准 ${request.requesterName} 的权限升级申请`,
        icon: <Check size={16} />,
        color: 'bg-emerald-600',
      });
      return;
    }

    if (action === 'reject') {
      triggerFeedback('L3', {
        msg: `已拒绝 ${request.requesterName} 的权限升级申请`,
        icon: <X size={16} />,
        color: 'bg-slate-900',
      });
    }
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
      if (editingCalendar.type === 'shared') promptPermissionUpgrade(editingCalendar.id);
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
    setAccounts((prev) => prev.map((account) => (account.id === id ? { ...account, checked: !account.checked } : account)));
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
      if (targetCalendar.type === 'shared') promptPermissionUpgrade(targetCalendar.id);
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

  const openRescheduleView = (eventId, suggestion = null) => {
    const sourceEvent = events.find((event) => event.id === eventId);
    if (!sourceEvent) return;

    const nextDraft = buildDraftForm({
      event: sourceEvent,
      slot: null,
      focusDate,
      calendars,
      activeAccountIds,
    });

    if (suggestion) {
      const nextDate = stripTime(suggestion.date);
      const parts = dateToEventParts(nextDate);
      nextDraft.date = nextDate;
      nextDraft.weekOffset = parts.weekOffset;
      nextDraft.day = parts.day;
      nextDraft.startH = suggestion.startH;
      nextDraft.durationH = suggestion.durationH;
      nextDraft.timeText = formatDraftTime(nextDate, suggestion.startH, suggestion.durationH);
    }

    setDraftForm(nextDraft);
    setCreateDraft({
      isDirty: false,
      saveStatus: 'idle',
      mode: 'reschedule',
      eventId: sourceEvent.id,
    });
    setCreateDraftPanels(INITIAL_CREATE_DRAFT_PANELS);
    setCreateDraftBulkInputs(INITIAL_CREATE_DRAFT_BULK_INPUTS);
    setFocusDate(stripTime(nextDraft.date));
    setSelectedEventId(sourceEvent.id);
    setActiveProduct('calendar');
    setCurrentScreen('create');
  };

  const applyRescheduleSuggestion = (eventId, suggestion) => {
    const sourceEvent = events.find((event) => event.id === eventId);
    if (!sourceEvent || !suggestion) return;

    const nextDate = stripTime(suggestion.date);
    const parts = dateToEventParts(nextDate);
    const nextPatch = {
      day: parts.day,
      weekOffset: parts.weekOffset,
      startH: suggestion.startH,
      durationH: suggestion.durationH,
      status: '待响应',
    };
    const organizerAccountId = calendarMap[sourceEvent.calId]?.accountId || activeAccountIds[0] || accounts[0]?.id || 'acc1';
    const organizerAccount = accountMap[organizerAccountId] || accounts[0];
    const notificationMail = {
      id: `mail-${Date.now()}`,
      accountId: organizerAccountId,
      folder: 'sent',
      category: 'focused',
      unread: false,
      starred: false,
      subject: `已更新会议时间：${sourceEvent.title}`,
      fromName: organizerAccount?.name || '我',
      fromEmail: organizerAccount?.email || 'me@calendarpro.io',
      to: Array.from(new Set((sourceEvent.attendees || []).filter(Boolean))),
      cc: Array.from(new Set(sourceEvent.optionalAttendees || [])),
      preview: `已改到 ${formatSuggestedSlotLabel(nextDate, suggestion.startH, suggestion.durationH)}，新的日历邀请将发送给所有参会者。`,
      body: `会议已重新安排为：\n${formatSuggestedSlotLabel(nextDate, suggestion.startH, suggestion.durationH)}\n\n系统已根据最新忙闲状态完成重排，并重新向所有参会者发出邀请。`,
      attachments: [],
      timestamp: Date.now(),
      linkedEventId: sourceEvent.id,
    };

    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, ...nextPatch } : event)));
    setMails((prev) => [
      notificationMail,
      ...prev.map((mail) =>
        mail.rescheduleRequestForEventId === eventId
          ? {
              ...mail,
              unread: false,
              linkedEventId: eventId,
              rescheduleResolvedAt: Date.now(),
            }
          : mail,
      ),
    ]);
    setActiveProduct('calendar');
    setSelectedEventId(eventId);
    setCurrentScreen('details');
    setFocusDate(nextDate);
    triggerFeedback('L3', {
      msg: `已改到 ${formatSuggestedSlotLabel(nextDate, suggestion.startH, suggestion.durationH)}`,
      icon: <RefreshCw size={16} />,
      color: 'bg-blue-600',
    });
  };

  const handleRespondToEvent = (id, action) => {
    const nextStatus = action === 'accept' ? '已接受' : '已拒绝';
    setEvents((prev) => prev.map((event) => (event.id === id ? { ...event, status: nextStatus } : event)));
    if (action === 'reject') {
      const sourceEvent = events.find((event) => event.id === id);
      if (sourceEvent) {
        const organizerAccountId = calendarMap[sourceEvent.calId]?.accountId || activeAccountIds[0] || accounts[0]?.id || 'acc1';
        const organizerAccount = accountMap[organizerAccountId] || accounts[0];
        const responderAccount =
          accounts.find((account) => account.email && account.email !== sourceEvent.organizer && (sourceEvent.attendees || []).includes(account.email)) ||
          activeAccounts.find((account) => account.email && account.email !== sourceEvent.organizer) ||
          organizerAccount;
        const rejectionMail = {
          id: `mail-${Date.now()}`,
          accountId: organizerAccountId,
          folder: 'inbox',
          category: 'focused',
          unread: true,
          starred: false,
          subject: `需要重新安排：${sourceEvent.title}`,
          fromName: responderAccount?.name || '参会人',
          fromEmail: responderAccount?.email || 'participant@calendarpro.io',
          to: [sourceEvent.organizer].filter(Boolean),
          cc: [],
          preview: `${responderAccount?.email || responderAccount?.name || '有参会人'} 已拒绝当前邀请，建议直接寻找新时间。`,
          body: `${responderAccount?.email || responderAccount?.name || '有参会人'} 已拒绝本次邀请。\n\n可以直接点击"寻找新时间"，系统会基于所有参会者最新的工作时间与忙闲状态重新推荐 2-3 个时间。`,
          attachments: [],
          timestamp: Date.now(),
          linkedEventId: sourceEvent.id,
          rescheduleRequestForEventId: sourceEvent.id,
        };
        setMails((prev) => [rejectionMail, ...prev]);
      }
    }
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
          : createDraft.mode === 'reschedule'
          ? mode === 'send'
            ? '待响应'
            : selectedEvent?.status || '已拒绝'
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
          ? createDraft.mode === 'reschedule'
            ? `已重新安排到 ${selectedCalendar?.name || '目标日历'}${successDetail}`
            : createDraft.mode === 'edit'
            ? `已更新 ${selectedCalendar?.name || '目标日历'}${successDetail}`
            : `已创建到 ${selectedCalendar?.name || '目标日历'}${successDetail}`
          : createDraft.mode === 'reschedule'
            ? '改期待确认'
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
  const createDraftPermissionLimitedCount = currentSlotAccountStates.filter((state) => state.permissionMode === 'busy_only').length;
  const createDraftInviteeCount = draftForm.attendees.length + (draftForm.optionalAttendees || []).length;
  const createDraftLargeAudience = createDraftInviteeCount >= 20;
  const createDraftMassAudience = createDraftInviteeCount >= 80;
  const createDraftRequiredMatchedCount = draftMatchedRequiredParticipantIds.length;
  const createDraftOptionalMatchedCount = draftMatchedOptionalParticipantIds.length;
  const createDraftScopeRequiredCount = currentSlotAccountStates.filter((state) => state.scope === 'required').length;
  const createDraftScopeOptionalCount = currentSlotAccountStates.filter((state) => state.scope === 'optional').length;
  const createDraftMatchedInviteeCount = createDraftRequiredMatchedCount + createDraftOptionalMatchedCount;
  const createDraftUnmatchedInviteeCount = Math.max(createDraftInviteeCount - createDraftMatchedInviteeCount, 0);
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
  const createDraftBestSuggestion =
    bestScheduleSuggestion &&
    (!sameDay(bestScheduleSuggestion.date, draftForm.date) || Math.abs(bestScheduleSuggestion.startH - draftForm.startH) > 0.01)
      ? bestScheduleSuggestion
      : null;
  const createDraftBusyStates = currentSlotAccountStates.filter((state) => state.conflicts.length > 0);
  const createDraftRequiredBusyCount = currentSlotAccountStates.filter((state) => state.scope === 'required' && state.conflicts.length > 0).length;
  const createDraftOptionalBusyCount = currentSlotAccountStates.filter((state) => state.scope === 'optional' && state.conflicts.length > 0).length;
  const createDraftRequiredFreeCount = Math.max(draftRequiredAccountIds.length - createDraftRequiredBusyCount, 0);
  const createDraftOptionalFreeCount = Math.max(draftOptionalAccountIds.length - createDraftOptionalBusyCount, 0);
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
      : '先添加需要参加的人，支持一次粘贴多人';
  const createDraftOptionalText =
    (draftForm.optionalAttendees || []).length > 0
      ? `已添加 ${(draftForm.optionalAttendees || []).length} 位可选参与人${createDraftOptionalUnmatchedCount > 0 ? `，其中 ${createDraftOptionalUnmatchedCount} 位暂未识别到组织内日历` : ''}`
      : '没有可选参与人也可以直接发送，支持批量粘贴';
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
  const createDraftSuggestionReason =
    createDraftScopeRequiredCount + createDraftScopeOptionalCount > 0
      ? formatSuggestedTimeReason({
          requiredCount: createDraftScopeRequiredCount,
          optionalCount: createDraftScopeOptionalCount,
          permissionLimitedCount: createDraftPermissionLimitedCount,
        })
      : `暂未识别到组织内可检查忙闲的参会人，先按 ${createDraftAccountLabel} 的工作时间给出建议。`;
  const createDraftPrimarySuggestion = createDraftBestSuggestion || scheduleSuggestions[0] || null;
  const createDraftPrimarySuggestionMeta = createDraftPrimarySuggestion
    ? getSuggestedTimeStatusMeta(createDraftPrimarySuggestion, createDraftRequiredMatchedCount, createDraftOptionalMatchedCount)
    : null;
  const createDraftDirectSuggestions = scheduleSuggestions
    .filter(
      (suggestion) =>
        (!createDraftPrimarySuggestion ||
          !(
            sameDay(suggestion.date, createDraftPrimarySuggestion.date) &&
            Math.abs(suggestion.startH - createDraftPrimarySuggestion.startH) < 0.01
          )) &&
        suggestion.requiredBusyCount === 0,
    )
    .slice(0, 3);
  const createDraftCoordinationSuggestions = scheduleSuggestions
    .filter(
      (suggestion) =>
        (!createDraftPrimarySuggestion ||
          !(
            sameDay(suggestion.date, createDraftPrimarySuggestion.date) &&
            Math.abs(suggestion.startH - createDraftPrimarySuggestion.startH) < 0.01
          )) &&
        suggestion.requiredBusyCount > 0,
    )
    .slice(0, 3);
  const createDraftCurrentSelectionMeta = getSuggestedTimeStatusMeta(
    {
      requiredBusyCount: createDraftRequiredBusyCount,
      optionalBusyCount: createDraftOptionalBusyCount,
    },
    createDraftRequiredMatchedCount,
    createDraftOptionalMatchedCount,
  );
  const createDraftCurrentMatchesPrimary =
    !!createDraftPrimarySuggestion &&
    sameDay(createDraftPrimarySuggestion.date, draftForm.date) &&
    Math.abs(createDraftPrimarySuggestion.startH - draftForm.startH) < 0.01;
  const createDraftRecommendationSummary =
    createDraftScopeRequiredCount + createDraftScopeOptionalCount > 0
      ? `系统已纳入 ${createDraftScopeRequiredCount} 位必需成员${createDraftScopeOptionalCount > 0 ? `、${createDraftScopeOptionalCount} 位可选成员` : ''} 的忙闲状态。`
      : `当前还没有组织内忙闲数据，推荐结果仅基于 ${createDraftAccountLabel} 的工作时间。`;
  const createDraftVisibilitySummary =
    createDraftUnmatchedInviteeCount > 0
      ? `另有 ${createDraftUnmatchedInviteeCount} 位外部或未匹配成员会收到会议邀请，但不会进入忙闲计算。`
      : createDraftPermissionLimitedCount > 0
        ? `${createDraftPermissionLimitedCount} 位成员仅提供忙闲权限，不展示具体会议内容。`
        : '当前已覆盖可识别到的组织内成员忙闲。';
  const createDraftDirectSuggestionHeading = createDraftCurrentMatchesPrimary ? '其他可直接发出的时间' : '可直接发出的时间';
  const createDraftSuggestionPrivacyText =
    createDraftPermissionLimitedCount > 0
      ? `其中 ${createDraftPermissionLimitedCount} 位仅授予忙闲权限，因此这里只展示建议时间，不暴露他人的具体会议内容。`
      : createDraftLargeAudience
        ? '人数较多时默认先展示忙闲汇总和推荐结果，避免上百人名单带来认知负担。'
        : '需要微调时，仍可继续手动调整开始和结束时间。';

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
        if (availabilityPicker.open) {
          closeAvailabilityPicker();
          return;
        }
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
    availabilityPicker.open,
    mails,
    timeSelection,
    sharedCalendarDialog.open,
    reminderDialogOpen,
    shortcutHelpOpen,
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

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#f7f7f5] text-gray-900 antialiased">
      {activeProduct === 'calendar' ? (
        <CalendarSidebar
          accounts={accounts}
          miniMonthEventMap={miniMonthEventMap}
          focusDate={focusDate}
          calendarLayout={calendarLayout}
          collapsed={calendarSidebarCollapsed}
          onNewEvent={() => navTo('create')}
          onShiftMonth={(delta) => setFocusDate((prev) => stripTime(addMonths(prev, delta)))}
          onSelectDate={(date) => selectDate(date, calendarLayout === 'month' ? 'day' : null)}
          onToggleAccount={toggleAccount}
          onSetAccountGroupChecked={setAccountGroupChecked}
          onOpenMailboxPermissions={openMailboxPermissions}
          onOpenSharedCalendarAccess={openSharedCalendarAccess}
          onOpenSharingSettings={handleOpenSharingSettings}
          onAddSharedCalendar={handleAddSharedCalendar}
          onToggleCollapsed={() => setCalendarSidebarCollapsed((prev) => !prev)}
          onAccountContextMenu={handleAccountContextMenu}
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
        <header className="relative flex min-h-16 shrink-0 flex-row items-center justify-between gap-3 border-b border-slate-200 bg-[#fcfcfb] px-4 py-3 sm:px-6" style={{ zIndex: 40 }}>
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {activeProduct === 'calendar' ? (
              <div className="flex items-center gap-2 min-w-0 pr-1 whitespace-nowrap">
                <div className="flex h-10 w-[324px] shrink-0 items-center rounded-xl border border-slate-200 bg-white px-3">
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
                    onChange={(event) => setCalendarSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        executeCalendarSearch(event.currentTarget.value);
                      }
                    }}
                    placeholder="搜索日程"
                    className="ml-2 w-full border-none bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
                  />
                  {calendarSearchQuery && (
                    <button
                      onClick={clearCalendarSearch}
                      className="ml-2 rounded-full p-1 text-gray-400 transition hover:bg-slate-100 hover:text-gray-600"
                      title="清空搜索"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button
                  onClick={handleCalendarSync}
                  className="inline-flex h-10 shrink-0 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-gray-700 transition hover:bg-slate-50"
                >
                  <RefreshCw size={14} className="mr-1.5" />
                  同步日历
                </button>
                <button
                  onClick={handleOpenReminders}
                  className="inline-flex h-10 shrink-0 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-gray-700 transition hover:bg-slate-50"
                >
                  <Bell size={14} className="mr-1.5" />
                  提醒
                </button>
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
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <HelpCircle size={16} />
            </button>
            <div className="mx-1 h-6 w-px bg-slate-200" />
            <button
              type="button"
              aria-label="最小化窗口"
              title="最小化"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <Minus size={16} />
            </button>
            <button
              type="button"
              aria-label="全屏窗口"
              title="全屏"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <Square size={14} />
            </button>
            <button
              type="button"
              aria-label="关闭窗口"
              title="关闭"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        <div className="relative flex flex-1 min-w-0 min-h-0 overflow-hidden bg-[#f8f8f7]">
          {activeProduct === 'calendar' ? (
              <div className="relative flex flex-1 min-w-0 min-h-0 overflow-hidden bg-[#f8f8f7]">
                {currentScreen === 'calendar' && (
                  <div className="relative flex flex-1 min-w-0 min-h-0 flex-col bg-[#f8f8f7]">
                    <header className="relative flex shrink-0 flex-col gap-3 border-b border-slate-200 bg-[#fcfcfb] px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:px-8" style={{ zIndex: 10 }}>
                      <div className="flex items-center gap-3 min-w-0 flex-1 flex-wrap sm:flex-nowrap">
                        <button
                          onClick={jumpToToday}
                          className="hidden shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-slate-50 sm:inline-flex sm:min-w-[72px]"
                        >
                          今天
                        </button>
                        <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                          <button className="rounded-xl p-1 text-gray-600 transition hover:bg-slate-50" onClick={() => changeRange(-1)}>
                            <ChevronLeft size={20} />
                          </button>
                          <button className="rounded-xl p-1 text-gray-600 transition hover:bg-slate-50" onClick={() => changeRange(1)}>
                            <ChevronRight size={20} />
                          </button>
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-lg sm:text-xl font-black text-gray-800 truncate">{formatRangeTitle(calendarLayout, focusDate)}</h2>
                        </div>
                      </div>

                        <div className="flex items-center gap-2 flex-wrap min-w-0 sm:justify-end">
                        <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5">
                            {VIEW_OPTIONS.map((option) => (
                              <button
                                key={option.id}
                                onClick={() => {
                                  setCalendarLayout(option.id);
                                  if (option.id === 'day' || option.id === 'week') {
                                    queueTimelineScrollToWorkStart(option.id);
                                  }
                                }}
                                className={`rounded-lg px-3 py-1.5 text-sm font-bold transition ${
                                  calendarLayout === option.id
                                    ? 'bg-slate-900 text-white'
                                    : 'text-gray-700 hover:bg-slate-50'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>

                        {activeAccounts.length > 1 && (
                          <div className="hidden md:inline-flex items-center rounded-xl border border-slate-200 bg-white p-1">
                            <button
                              onClick={() => setAccountDisplayMode('overlay')}
                              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                                effectiveAccountDisplayMode === 'overlay'
                                  ? 'bg-slate-900 text-white'
                                  : 'text-gray-700 hover:bg-slate-50'
                              }`}
                              aria-pressed={effectiveAccountDisplayMode === 'overlay'}
                            >
                              叠加视图
                            </button>
                            <button
                              onClick={() => setAccountDisplayMode('split')}
                              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                                effectiveAccountDisplayMode === 'split'
                                  ? 'bg-slate-900 text-white'
                                  : 'text-gray-700 hover:bg-slate-50'
                              }`}
                              aria-pressed={effectiveAccountDisplayMode === 'split'}
                            >
                              拆分视图
                            </button>
                          </div>
                        )}

                        {activeAccounts.length > MAX_SPLIT_ACCOUNTS && effectiveAccountDisplayMode === 'split' && (
                          <div className="hidden xl:flex items-center max-w-[320px] overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 space-x-1">
                            {activeAccounts.map((account) => {
                              const selected = splitAccountIds.includes(account.id);
                              return (
                                <button
                                  key={account.id}
                                  onClick={() => toggleSplitAccount(account.id)}
                                  className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap ${
                                    selected ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
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
	                          <p className="text-sm mt-2">请先在左侧勾选至少一个账户。</p>
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
                        onSelectEvent={selectCalendarEvent}
                        onOpenEvent={openEventDetails}
                        onSelectDate={(date) => selectDate(date, 'day')}
                        onQuickCreate={(slot) => navTo('create', null, slot)}
                        onSlotContextMenu={openSlotContextMenu}
                        showAccountLabel={showAccountLabel}
                        onPreviewEvent={showEventPreview}
                        onHidePreview={hideEventPreview}
                        onHideAccount={hideAccountFromCalendarView}
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
	                      />
		                    ) : (
	                      <WeekView
	                        key={`week-${focusDate.getTime()}-${timelineScrollToken}-${effectiveAccountDisplayMode}-${displayAccounts.map((account) => account.id).join('-')}`}
	                        days={weekDays}
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
	                      />
	                    )}
                  </div>
                )}

                {currentScreen === 'search' && (
                  <CalendarSearchResults
                    query={calendarSearchQuery}
                    filters={calendarSearchFilters}
                    accountOptions={calendarSearchAccountOptions}
                    onQueryChange={setCalendarSearchQuery}
                    onSearch={executeCalendarSearch}
                    onChangeFilters={(patch) => setCalendarSearchFilters((prev) => ({ ...prev, ...patch }))}
                    onClear={clearCalendarSearch}
                    results={calendarSearchResults}
                    onBack={() => navTo('calendar')}
                    onLocateEvent={locateEventInCalendar}
                    onOpenEvent={openEventDetails}
                  />
                )}

                {showRightSidebar && currentScreen === 'calendar' && selectedEvent && (
                  <CalendarEventSidebar
                    event={selectedEvent}
                    calendar={selectedEventCalInfo}
                    account={selectedEventAccountInfo}
                    onBackToAgenda={() => setSelectedEventId(null)}
                    onOpenDetails={() => openEventDetails(selectedEvent.id)}
                    onDeleteEvent={handleDeleteEvent}
                    onRespond={handleRespondToEvent}
                  />
                )}

                {currentScreen === 'details' && selectedEvent && (
	                  <div className="relative flex h-full w-full justify-center overflow-y-auto bg-white px-6 py-4 md:px-10 md:py-6">
	                    <div
	                      className="flex h-max w-full flex-col overflow-hidden bg-white"
	                      style={{ maxWidth: '860px' }}
	                    >
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

                      {selectedEvent.status === '已拒绝' && (
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-slate-700 text-sm font-bold">
                          <div className="flex items-center">
                            <X size={16} className="mr-2" />
                            您已拒绝本次邀请，系统已准备新的可用时间。
                          </div>
                          <button
                            onClick={() => openRescheduleView(selectedEvent.id)}
                            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            <RefreshCw size={15} className="mr-2" />
                            寻找新时间
                          </button>
                        </div>
                      )}

	                      <div className="flex flex-col gap-3 border-b border-slate-200 bg-[#fcfcfb] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <button onClick={() => navTo(calendarReturnScreen || 'calendar')} className="text-gray-600 hover:text-gray-900 flex items-center text-sm font-bold">
                          <ChevronLeft size={16} className="mr-1" />
                          {calendarReturnScreen === 'search' ? '返回搜索结果' : '返回日历'}
                        </button>
                        <div className="flex space-x-2">
                          {selectedEvent.status === '已拒绝' && (
                            <button
                              onClick={() => openRescheduleView(selectedEvent.id)}
                              className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl bg-white border border-gray-200"
                              title="寻找新时间"
                            >
                              <RefreshCw size={16} />
                            </button>
                          )}
                          {selectedEvent.type !== 'busy_only' && selectedEvent.status !== '已取消' && (
                            <button
                              onClick={() => navTo('create', selectedEvent.id)}
                              className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl bg-white border border-gray-200"
                            >
                              <Edit size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteEvent(selectedEvent.id)}
                            className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl bg-white border border-gray-200"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="p-6 md:p-8">
                        {selectedEvent.type === 'busy_only' ? (
                          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
                            <Lock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h2 className="text-xl font-black text-gray-800">仅查看忙闲</h2>
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
                                  <button
                                    onClick={() => openExternalLink(selectedEvent.meetingLink, '已打开会议链接')}
                                    className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white"
                                  >
                                    <ArrowRight size={14} className="mr-2" />
                                    加入会议
                                  </button>
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

                            {selectedEvent.status === '已拒绝' && selectedEventRescheduleSuggestions.length > 0 && (
                              <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                                <div className="flex items-center justify-between gap-4">
                                  <div>
                                    <div className="text-sm font-semibold text-slate-900">寻找新时间</div>
                                    <div className="mt-1 text-xs text-slate-500">
                                      基于当前参与人的最新忙闲状态，再推荐 2-3 个新的可用时段。
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => openRescheduleView(selectedEvent.id)}
                                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                                  >
                                    在编辑页微调
                                  </button>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {selectedEventRescheduleSuggestions.map((suggestion, index) => (
                                    <button
                                      key={`${selectedEvent.id}-retry-${index}`}
                                      onClick={() => applyRescheduleSuggestion(selectedEvent.id, suggestion)}
                                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-blue-200 hover:bg-blue-50"
                                    >
                                      <div className="text-sm font-semibold text-slate-900">
                                        {formatSuggestedSlotLabel(suggestion.date, suggestion.startH, suggestion.durationH)}
                                      </div>
                                      <div className="mt-1 text-[11px] text-slate-500">
                                        {suggestion.requiredBusyCount === 0 ? '必需参会者可参加' : `仍有 ${suggestion.requiredBusyCount} 位必需参会者冲突`}
                                      </div>
                                    </button>
                                  ))}
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
                )}

                {currentScreen === 'create' && (
                  <div className="relative z-50 h-full w-full overflow-hidden bg-[#f6f8fb]">
                    <div className="h-full overflow-y-auto px-4 py-5 md:px-6 md:py-6">
                      <div className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-[1220px] flex-col overflow-hidden rounded-[14px] border border-slate-200 bg-white">
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
                                {createDraft.mode === 'edit'
                                  ? '编辑日程'
                                  : createDraft.mode === 'reschedule'
                                    ? '重新安排日程'
                                    : '新建日程'}
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
                                placeholder="请输入标题"
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
                                {createDraftLargeAudience && (
                                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-semibold text-blue-700">
                                    大会场景已自动折叠名单
                                  </span>
                                )}
                              </div>
                              {createDraftLargeAudience ? (
                                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
                                    <div className="text-xs text-slate-500">
                                      默认只展示前 {createDraftRequiredPreviewCount} 位，先让组织者确认总量和覆盖率，再按需展开完整名单。
                                    </div>
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
                                    placeholder="输入名字或邮箱，回车添加；支持一次粘贴多位（分号 / 换行分隔）"
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
                                  <div className="text-xs font-medium text-slate-600">每行一个姓名或邮箱，也支持分号分隔；适合从邮件、Excel 或群组名单直接粘贴。</div>
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
                                    placeholder="继续追加名字或邮箱，回车即可添加"
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
                              <div className="mt-2 text-xs text-slate-400">{createDraftRequiredText}</div>
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
                                    <div className="text-xs text-slate-500">
                                      可选名单默认折叠，避免和必需参会人混在一起。只有需要核对时再展开查看。
                                    </div>
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
                                    placeholder="输入可选参与人，支持批量粘贴"
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
                                  <div className="text-xs font-medium text-slate-600">适合粘贴观察员、抄送名单或可选参与人列表，系统会自动去重。</div>
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
                                    placeholder="继续追加可选参与人，回车即可添加"
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
                              <div className="mt-2 text-xs text-slate-400">{createDraftOptionalText}</div>
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
                            <div className="pt-2 text-slate-500">建议时间</div>
                            <div className="space-y-3">
                              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <div className="text-sm font-semibold text-slate-900">建议时间</div>
                                    <div className="mt-1 text-xs text-slate-500">{createDraftSuggestionReason}</div>
                                    <div className="mt-2 text-xs text-slate-500">{createDraftRecommendationSummary}</div>
                                  </div>
                                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${createDraftCurrentSelectionMeta.tone}`}>
                                    {createDraftCurrentMatchesPrimary ? '当前时间可直接发出' : `当前时间：${createDraftCurrentSelectionMeta.emphasis}`}
                                  </span>
                                </div>
                                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                  {createDraftScopeRequiredCount > 0 && (
                                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                                      组织内必需 {createDraftScopeRequiredCount} 位
                                    </span>
                                  )}
                                  {createDraftScopeOptionalCount > 0 && (
                                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700">
                                      组织内可选 {createDraftScopeOptionalCount} 位
                                    </span>
                                  )}
                                  {createDraftUnmatchedInviteeCount > 0 && (
                                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600">
                                      仅发送邀请 {createDraftUnmatchedInviteeCount} 位
                                    </span>
                                  )}
                                  {createDraftPermissionLimitedCount > 0 && (
                                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600">
                                      仅忙闲权限 {createDraftPermissionLimitedCount} 位
                                    </span>
                                  )}
                                </div>
                                {createDraftPrimarySuggestion && createDraftPrimarySuggestionMeta && (
                                  <div className="mt-3 rounded-lg border border-blue-200 bg-white px-4 py-3">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <div className="text-[11px] font-semibold uppercase tracking-wide text-blue-500">
                                          {createDraftCurrentMatchesPrimary ? '推荐结果' : '系统建议改到'}
                                        </div>
                                        <div className="mt-1 text-base font-semibold text-slate-900">
                                          {formatSuggestedSlotLabel(createDraftPrimarySuggestion.date, createDraftPrimarySuggestion.startH, draftForm.durationH)}
                                        </div>
                                        <div className="mt-1 text-sm text-slate-600">
                                          {createDraftCurrentMatchesPrimary ? createDraftCurrentSelectionMeta.summary : createDraftPrimarySuggestionMeta.summary}
                                        </div>
                                      </div>
                                      {!createDraftCurrentMatchesPrimary && (
                                        <button
                                          onClick={() =>
                                            updateDraftSchedule({
                                              date: createDraftPrimarySuggestion.date,
                                              startH: createDraftPrimarySuggestion.startH,
                                              durationH: draftForm.durationH,
                                            })
                                          }
                                          className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-slate-800"
                                        >
                                          应用此建议
                                        </button>
                                      )}
                                    </div>
                                    {!createDraftCurrentMatchesPrimary && (
                                      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">当前时间</div>
                                        <div className="mt-1 text-sm font-semibold text-slate-900">
                                          {formatSuggestedSlotLabel(draftForm.date, draftForm.startH, draftForm.durationH)}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">{createDraftCurrentSelectionMeta.summary}</div>
                                      </div>
                                    )}
                                    <div className="mt-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                                      {createDraftVisibilitySummary}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {createDraftDirectSuggestions.length > 0 && (
                                <div>
                                  <div className="mb-2 text-xs font-semibold text-slate-500">
                                    {createDraftDirectSuggestionHeading} · {createDraftDirectSuggestions.length} 个
                                  </div>
                                  <div className="grid gap-2 lg:grid-cols-3">
                                    {createDraftDirectSuggestions.map((suggestion, index) => {
                                      const meta = getSuggestedTimeStatusMeta(suggestion, createDraftRequiredMatchedCount, createDraftOptionalMatchedCount);
                                      return (
                                        <button
                                          key={`direct-${formatDateLabel(suggestion.date)}-${suggestion.startH}-${index}`}
                                          onClick={() =>
                                            updateDraftSchedule({
                                              date: suggestion.date,
                                              startH: suggestion.startH,
                                              durationH: draftForm.durationH,
                                            })
                                          }
                                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-left transition hover:bg-white"
                                        >
                                          <div className="text-sm font-semibold text-slate-900">
                                            {formatSuggestedSlotLabel(suggestion.date, suggestion.startH, draftForm.durationH)}
                                          </div>
                                          <div className="mt-1 text-xs font-medium text-emerald-700">{meta.summary}</div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {createDraftCoordinationSuggestions.length > 0 && (
                                <div>
                                  <div className="mb-2 text-xs font-semibold text-slate-500">需要协调的备选 · {createDraftCoordinationSuggestions.length} 个</div>
                                  <div className="grid gap-2 lg:grid-cols-3">
                                    {createDraftCoordinationSuggestions.map((suggestion, index) => {
                                      const meta = getSuggestedTimeStatusMeta(suggestion, createDraftRequiredMatchedCount, createDraftOptionalMatchedCount);
                                      return (
                                        <button
                                          key={`coord-${formatDateLabel(suggestion.date)}-${suggestion.startH}-${index}`}
                                          onClick={() =>
                                            updateDraftSchedule({
                                              date: suggestion.date,
                                              startH: suggestion.startH,
                                              durationH: draftForm.durationH,
                                            })
                                          }
                                          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-left transition hover:bg-white"
                                        >
                                          <div className="text-sm font-semibold text-slate-900">
                                            {formatSuggestedSlotLabel(suggestion.date, suggestion.startH, draftForm.durationH)}
                                          </div>
                                          <div className="mt-1 text-xs font-medium text-amber-700">{meta.summary}</div>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                                  组织内必需可用 {createDraftRequiredFreeCount}
                                </span>
                                <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 font-semibold text-red-700">
                                  组织内必需冲突 {createDraftRequiredBusyCount}
                                </span>
                                {draftOptionalAccountIds.length > 0 && (
                                  <>
                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                                      组织内可选可用 {createDraftOptionalFreeCount}
                                    </span>
                                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-semibold text-amber-700">
                                      组织内可选冲突 {createDraftOptionalBusyCount}
                                    </span>
                                  </>
                                )}
                              </div>

                              <div className="text-xs text-slate-500">{createDraftSuggestionPrivacyText}</div>

                              {createDraftConflictSourceStates.length > 0 ? createDraftLargeAudience ? (
                                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
                                    <div>
                                      <div className="text-xs font-semibold text-slate-700">冲突明细</div>
                                      <div className="text-[11px] text-slate-500">人数较多时默认只列出有冲突的参与人，避免用一整屏展示全部可用成员。</div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700">
                                        当前冲突 {createDraftConflictSourceStates.length} 位
                                      </span>
                                      {createDraftHiddenConflictStateCount > 0 && (
                                        <button
                                          onClick={() => setCreateDraftPanels((prev) => ({ ...prev, conflictsExpanded: true }))}
                                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                          还有 {createDraftHiddenConflictStateCount} 位，展开查看
                                        </button>
                                      )}
                                      {createDraftPanels.conflictsExpanded && createDraftConflictSourceStates.length > 10 && (
                                        <button
                                          onClick={() => setCreateDraftPanels((prev) => ({ ...prev, conflictsExpanded: false }))}
                                          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                        >
                                          收起明细
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  {createDraftConflictDetailStates.length > 0 ? (
                                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-100">
                                      {createDraftConflictDetailStates.map((state) => {
                                        const firstConflict = state.conflicts[0];
                                        return (
                                          <div key={state.account.id} className="flex items-center justify-between gap-3 px-3 py-2">
                                            <div className="min-w-0">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <span className="truncate text-sm font-medium text-slate-800">{state.account.email || state.account.name}</span>
                                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                                                  {state.scope === 'required' ? '必需' : '可选'}
                                                </span>
                                                {state.permissionMode === 'busy_only' && (
                                                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                                                    <Lock size={10} />
                                                    仅忙闲
                                                  </span>
                                                )}
                                              </div>
                                              <div className="mt-1 truncate text-xs text-slate-400">
                                                {firstConflict
                                                  ? `${formatTimeRange(firstConflict.startH || 0, firstConflict.durationH || 1)} · ${
                                                      state.permissionMode === 'busy_only' || firstConflict.type === 'busy_only'
                                                        ? '忙碌'
                                                        : firstConflict.title || '忙碌'
                                                    }`
                                                  : '当前无冲突'}
                                              </div>
                                            </div>
                                            <span className="shrink-0 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700">
                                              忙碌
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <div className="px-3 py-4 text-sm text-slate-500">当前已识别到的组织内参会者都可参加，可以优先使用推荐时间。</div>
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {createDraftConflictDetailStates.map((state) => (
                                    <span
                                      key={state.account.id}
                                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                                        state.conflicts.length > 0 ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                      }`}
                                      title={
                                        state.conflicts.length > 0
                                          ? `${state.account.email || state.account.name} 忙碌：${state.conflicts
                                              .map((event) => event.title || '忙碌')
                                              .join('、')}`
                                          : `${state.account.email || state.account.name} 当前空闲`
                                      }
                                    >
                                      <span>{state.account.email || state.account.name}</span>
                                      <span className="text-[11px] opacity-80">{state.scope === 'required' ? '必需' : '可选'}</span>
                                      {state.permissionMode === 'busy_only' && <Lock size={11} />}
                                      <span>{state.conflicts.length > 0 ? '忙碌' : '可用'}</span>
                                    </span>
                                  ))}
                                </div>
                              ) : null}
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
                              <div className="text-xs text-slate-400">
                                {draftForm.repeat === 'does_not_repeat' ? '当前只创建这一场日程' : `当前规则：${REPEAT_LABELS[draftForm.repeat] || '每周'}`}
                              </div>
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
                                    placeholder="补充地点或会议室"
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
              onOpenAvailabilityPicker={(mailId) => openAvailabilityPicker('reader', mailId)}
              onConfirmAvailabilitySlot={confirmAvailabilityProposalSlot}
              rescheduleSuggestions={selectedMailRescheduleSuggestions}
              onOpenReschedule={openRescheduleView}
              onApplyRescheduleSuggestion={applyRescheduleSuggestion}
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
        onOpenAvailabilityPicker={() => openAvailabilityPicker('composer')}
        onRemoveAvailabilityProposal={removeComposerAvailabilityProposal}
      />

      <AvailabilityProposalModal
        open={availabilityPicker.open}
        account={availabilityPickerAccount}
        candidates={availabilityPickerCandidates}
        selectedSlotIds={availabilityPicker.selectedSlotIds}
        onToggleSlot={toggleAvailabilityPickerSlot}
        onClose={closeAvailabilityPicker}
        onApply={applyAvailabilityProposal}
      />

      <AddSharedCalendarModal
        open={sharedCalendarDialog.open}
        draft={sharedCalendarDialog}
        invitations={shareInvitations}
        onClose={closeSharedCalendarDialog}
        onChange={patchSharedCalendarDialog}
        onApplyTemplate={(template) => patchSharedCalendarDialog(template)}
        onSubmit={submitSharedCalendarDialog}
        onAcceptInvitation={acceptShareInvitation}
        onIgnoreInvitation={ignoreShareInvitation}
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

      {activeProduct === 'calendar' && currentScreen === 'calendar' && hoverPreview && previewedEvent && !eventInteraction && (
        <EventPreviewCard
          event={previewedEvent}
          calendar={calendarMap[previewedEvent.calId]}
          account={accountMap[calendarMap[previewedEvent.calId]?.accountId]}
          x={hoverPreview.x}
          y={hoverPreview.y}
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
              openSharedCalendarDialog();
              setContextMenu(null);
              clearTimeSelection();
            }}
            className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
          >
            <Calendar size={14} className="mr-2" />
            添加共享账户
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
          className="fixed z-50 w-48 rounded-[18px] border border-slate-200 bg-white py-1 shadow-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-1 border-b border-slate-100 px-3 py-2">
            <div className="text-xs font-bold text-gray-800 truncate">{contextMenu.account.name || contextMenu.account.email || '未知账号'}</div>
            <div className="text-[11px] text-gray-400 mt-0.5 truncate">{contextMenu.account.email || ''}</div>
          </div>
          <button
            onClick={() => {
              if (contextMenu.account.ownership === 'shared') {
                openSharedCalendarAccess(contextMenu.account.id);
              } else {
                openMailboxPermissions(contextMenu.account.id);
              }
              setContextMenu(null);
            }}
            className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-slate-50"
          >
            <Eye size={14} className="mr-2" />
            查看详情
          </button>
          {contextMenu.account.ownership === 'shared' && (
            <button
              onClick={() => {
                const nextAccounts = accounts.filter((a) => a.id !== contextMenu.account.id);
                setAccounts(nextAccounts);
                setCalendars((prev) => prev.filter((c) => c.accountId !== contextMenu.account.id));
                setContextMenu(null);
              }}
              className="flex w-full items-center px-3 py-2 text-left text-sm font-bold text-red-600 transition hover:bg-red-50/90"
            >
              <Trash size={14} className="mr-2" />
              移除账号
            </button>
          )}
        </div>
      )}

      {permissionPanel.type === 'calendar' && selectedPermissionCalendar && (
        <CalendarPermissionModal
          calendar={selectedPermissionCalendar}
          permissionRequests={permissionRequests}
          onClose={closePermissionPanel}
          onUpdateShare={(shareId, patch) => updateCalendarShare(selectedPermissionCalendar.id, shareId, patch)}
          onUpdateDefaultSharing={(key, value) => updateCalendarDefaultSharing(selectedPermissionCalendar.id, key, value)}
          onUpdatePublishing={(patch) => updateCalendarPublishing(selectedPermissionCalendar.id, patch)}
          onResetPublishLinks={() => resetCalendarPublishLinks(selectedPermissionCalendar.id)}
          onCopyPublishingLink={(key) => copyCalendarPublishLink(selectedPermissionCalendar.id, key)}
          onAddShare={(scope) => addCalendarShare(selectedPermissionCalendar.id, scope)}
          onRemoveShare={(shareId) => removeCalendarShare(selectedPermissionCalendar.id, shareId)}
          onResendShare={(shareId) => resendCalendarShare(selectedPermissionCalendar.id, shareId)}
          onHandlePermissionRequest={handlePermissionRequest}
        />
      )}

      {permissionPanel.type === 'mailbox' && selectedPermissionMailbox && (
        <MailboxPermissionModal
          account={selectedPermissionMailbox}
          onClose={closePermissionPanel}
          onUpdateMember={(memberId, patch) => updateMailboxMember(selectedPermissionMailbox.id, memberId, patch)}
          onToggleMemberPermission={(memberId, key) => toggleMailboxMemberPermission(selectedPermissionMailbox.id, memberId, key)}
          onAddMember={() => addMailboxMember(selectedPermissionMailbox.id)}
          onRemoveMember={(memberId) => removeMailboxMember(selectedPermissionMailbox.id, memberId)}
          onToggleSetting={(key) => toggleMailboxSetting(selectedPermissionMailbox.id, key)}
        />
      )}

      {permissionPanel.type === 'shared_access' && selectedSharedAccessCalendar && (
        <SharedCalendarAccessModal
          calendar={selectedSharedAccessCalendar}
          account={accountMap[selectedSharedAccessCalendar.accountId]}
          accountCalendars={selectedSharedAccountCalendars}
          pendingRequest={selectedSharedPermissionRequest}
          onClose={closePermissionPanel}
          onRequestUpgrade={() => requestPermissionUpgrade(selectedSharedAccessCalendar.id)}
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
