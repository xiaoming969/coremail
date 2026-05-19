import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Calendar, ChevronDown, Clock, FileText, Mail, MapPin, Paperclip, RefreshCw, Search, Users } from 'lucide-react';
import {
  DAY_MS,
  HUAWEI_CALENDAR_ID,
  MEETING_PROVIDER_LABELS,
  REPEAT_LABELS,
  SEARCH_ACCOUNT_SCOPE_OPTIONS,
  SEARCH_ATTACHMENT_OPTIONS,
  SEARCH_COLOR_CATEGORY_OPTIONS,
  SEARCH_MEETING_TYPE_OPTIONS,
  SEARCH_SORT_OPTIONS,
  SEARCH_TIMEFRAME_OPTIONS,
  TODAY_DATE,
  WEEKDAY_NAMES,
  WORK_START_HOUR,
  canJoinCalendarEvent,
  eventToDate,
  formatHour,
  formatTimeRange,
  getColorCategoryMeta,
  getEventColorCategories,
  getEventEndTimestamp,
  getEventStartTimestamp,
  getPrimarySearchAccountId,
  getSearchAccountLabel,
  getSearchSelectedAccountIds,
  stripTime,
  tokenizeKeywordQuery,
} from '../../domain/appModel.js';

export default function CalendarSearchResults({
  query,
  filters,
  accountOptions,
  peopleOptions,
  onChangeFilters,
  colorCategoryLabels,
  onRenameColorCategory,
  results,
  onBack,
  onOpenEvent,
}) {
  const trimmedQuery = query.trim();
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [editingColorCategory, setEditingColorCategory] = useState(null);
  const [visibleResultCount, setVisibleResultCount] = useState(20);
  const searchResultsScrollRef = useRef(null);
  const highlightTokens = useMemo(() => tokenizeKeywordQuery(trimmedQuery), [trimmedQuery]);
  const isMultiAccount = accountOptions.length > 1;
  const selectedAccountIds = useMemo(
    () => getSearchSelectedAccountIds(filters, accountOptions),
    [accountOptions, filters.accountId, filters.accountIds],
  );
  const isCrossAccountSearch = isMultiAccount && selectedAccountIds.length > 1;

  const renderHighlighted = (value) => {
    const text = String(value || '');
    if (!text || highlightTokens.length === 0) return text;

    const lowerText = text.toLowerCase();
    const matches = [];

    highlightTokens.forEach((token) => {
      let searchFrom = 0;
      while (token && searchFrom < lowerText.length) {
        const index = lowerText.indexOf(token, searchFrom);
        if (index === -1) break;
        matches.push({ start: index, end: index + token.length });
        searchFrom = index + Math.max(1, token.length);
      }
    });

    if (matches.length === 0) return text;

    const merged = matches
      .sort((left, right) => left.start - right.start || right.end - left.end)
      .reduce((items, match) => {
        const last = items[items.length - 1];
        if (last && match.start <= last.end) {
          last.end = Math.max(last.end, match.end);
          return items;
        }
        items.push({ ...match });
        return items;
      }, []);

    const parts = [];
    let cursor = 0;

    merged.forEach((match, index) => {
      if (match.start > cursor) parts.push(text.slice(cursor, match.start));
      parts.push(
        <mark key={`${text}-${match.start}-${index}`} className="rounded bg-yellow-200/80 px-0.5 text-inherit">
          {text.slice(match.start, match.end)}
        </mark>,
      );
      cursor = match.end;
    });

    if (cursor < text.length) parts.push(text.slice(cursor));
    return parts;
  };

  const resultBucketCounts = useMemo(() => {
    const now = TODAY_DATE.getTime();
    const nearFutureCutoff = now + 30 * DAY_MS;

    return results.reduce(
      (counts, result) => {
        const start = getEventStartTimestamp(result.event);
        const end = getEventEndTimestamp(result.event);

        if (end < now) counts.past += 1;
        else if (start <= nearFutureCutoff) counts.nearFuture += 1;
        else counts.laterFuture += 1;

        return counts;
      },
      { nearFuture: 0, laterFuture: 0, past: 0 },
    );
  }, [results]);

  const rankedResults = useMemo(() => {
    const now = TODAY_DATE.getTime();
    const nearFutureCutoff = now + 30 * DAY_MS;
    const getBucketRank = (result) => {
      const start = getEventStartTimestamp(result.event);
      const end = getEventEndTimestamp(result.event);
      if (end < now) return 2;
      if (start <= nearFutureCutoff) return 0;
      return 1;
    };

    return [...results].sort((left, right) => {
      const leftStart = getEventStartTimestamp(left.event);
      const rightStart = getEventStartTimestamp(right.event);

      if (filters.sort === 'time_desc') return rightStart - leftStart || right.match.score - left.match.score;
      if (filters.sort === 'time_asc') {
        return Math.abs(leftStart - now) - Math.abs(rightStart - now) || right.match.score - left.match.score;
      }

      return (
        right.match.score - left.match.score ||
        getBucketRank(left) - getBucketRank(right) ||
        Math.abs(leftStart - now) - Math.abs(rightStart - now)
      );
    });
  }, [results, filters.sort]);

  const firstCurrentResultId = useMemo(() => {
    return rankedResults[0]?.event.id || null;
  }, [rankedResults]);

  useEffect(() => {
    if (results.length === 0) {
      setSelectedResultId(null);
      return;
    }

    setSelectedResultId((prev) =>
      results.some((result) => result.event.id === prev) ? prev : firstCurrentResultId,
    );
  }, [firstCurrentResultId, results]);

  useLayoutEffect(() => {
    if (!firstCurrentResultId || !searchResultsScrollRef.current) return undefined;

    const timer = window.setTimeout(() => {
      const target = searchResultsScrollRef.current?.querySelector(
        `[data-search-result-id="${firstCurrentResultId}"]`,
      );

      if (target) {
        target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' });
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [
    firstCurrentResultId,
    filters.accountId,
    filters.accountIds,
    filters.calendarScope,
    filters.colorCategory,
    filters.person,
    filters.sort,
    filters.timeframe,
    trimmedQuery,
  ]);

  useEffect(() => {
    setVisibleResultCount(20);
  }, [
    filters.accountId,
    filters.accountIds,
    filters.calendarScope,
    filters.colorCategory,
    filters.meetingType,
    filters.person,
    filters.sort,
    filters.timeframe,
    filters.attachment,
    trimmedQuery,
  ]);

  const getResultTimeState = (event) => {
    const date = eventToDate(event);
    const diffDays = Math.round((stripTime(date).getTime() - stripTime(TODAY_DATE).getTime()) / DAY_MS);

    if (!event.isAllDay) {
      const startH = event.startH || WORK_START_HOUR;
      const endH = startH + (event.durationH || 1);
      const start = new Date(date);
      const end = new Date(date);
      start.setHours(Math.floor(startH), Math.round((startH % 1) * 60), 0, 0);
      end.setHours(Math.floor(endH), Math.round((endH % 1) * 60), 0, 0);

      if (TODAY_DATE >= start && TODAY_DATE <= end) {
        return { label: '进行中', className: 'border-blue-200 bg-blue-50 text-blue-700' };
      }

      const diffMinutes = Math.round((start.getTime() - TODAY_DATE.getTime()) / (60 * 1000));
      if (diffMinutes > 0 && diffMinutes <= 60) {
        return {
          label: `${diffMinutes} 分钟后开始`,
          className: diffMinutes <= 15 ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-orange-200 bg-orange-50 text-orange-700',
        };
      }

      if (diffDays === 0 && start > TODAY_DATE) {
        return { label: `今天 ${formatHour(startH)}`, className: 'border-emerald-200 bg-emerald-50 text-emerald-700' };
      }

      if (diffDays === 1) {
        return { label: `明天 ${formatHour(startH)}`, className: 'border-emerald-200 bg-emerald-50 text-emerald-700' };
      }
    }

    if (diffDays < 0) return null;
    if (diffDays === 0) return { label: '今天', className: 'border-blue-200 bg-blue-50 text-blue-700' };
    if (diffDays <= 7) return { label: `${diffDays} 天后`, className: 'bg-slate-100 text-slate-600' };
    return null;
  };

  const getEventDateMeta = (event) => {
    const date = eventToDate(event);
    const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
    return {
      day: date.getDate(),
      weekday: WEEKDAY_NAMES[dayIndex],
      dateLabel: `${date.getMonth() + 1}月${date.getDate()}日 ${WEEKDAY_NAMES[dayIndex]}`,
      timeLabel: event.isAllDay ? '全天' : formatTimeRange(event.startH || WORK_START_HOUR, event.durationH || 1),
    };
  };

  const formatParticipants = (event) => {
    if (event.type === 'holiday' || event.calId === HUAWEI_CALENDAR_ID) return '';

    const names = Array.from(new Set([...(event.attendees || []), ...(event.optionalAttendees || [])]))
      .filter(Boolean)
      .filter((name) => name !== event.organizer);

    if (names.length === 0) return '';
    if (names.length <= 3) return `参与人：${names.join('、')}`;
    return `参与人：${names.slice(0, 2).join('、')} 等 ${names.length} 人`;
  };

  const getOrganizerLabel = (event) => {
    if (event.type === 'holiday' || event.calId === HUAWEI_CALENDAR_ID || !event.organizer) return '';
    return `组织者：${event.organizer}`;
  };

  const getMatchedSnippet = (event, match) => {
    if (match?.matchedFields?.includes('description') && event.description) {
      return {
        type: 'description',
        icon: FileText,
        text: `正文：${String(event.description).slice(0, 90)}${String(event.description).length > 90 ? '……' : ''}`,
      };
    }

    if (match?.matchedFields?.includes('attachments') && event.attachments?.length) {
      const attachmentNames = (event.attachments || [])
        .map((attachment) => (typeof attachment === 'string' ? attachment : attachment?.name))
        .filter(Boolean);
      const matchedNames = attachmentNames.filter((name) =>
        highlightTokens.some((token) => String(name).toLowerCase().includes(token)),
      );
      const names = matchedNames.length > 0 ? matchedNames : attachmentNames;
      if (names.length === 0) return null;
      return {
        type: 'attachments',
        icon: Paperclip,
        text: names.length > 1 ? `附件：${names[0]} 等 ${names.length} 个` : `附件：${names[0]}`,
      };
    }

    return null;
  };

  const getMeetingMeta = (event) => {
    const items = [];
    if (event.location) items.push({ icon: MapPin, label: `地点：${event.location}` });
    if (event.meetingLink && event.meetingProvider && event.meetingProvider !== 'none') {
      items.push({ icon: Calendar, label: `线上：${MEETING_PROVIDER_LABELS[event.meetingProvider] || '在线会议'}` });
    }
    return items;
  };

  const openMeetingLink = (event) => {
    if (!event.meetingLink) return;
    window.open(event.meetingLink, '_blank', 'noopener,noreferrer');
  };

  const isDefaultAccountFilter =
    !isMultiAccount ||
    filters.accountId === 'all' ||
    filters.accountId === 'current' ||
    (!filters.accountId && selectedAccountIds.length === 1 && selectedAccountIds[0] === getPrimarySearchAccountId(accountOptions));
  const hasActiveFilters =
    !isDefaultAccountFilter ||
    (filters.calendarScope || 'all') !== 'all' ||
    (filters.timeframe || 'all') !== 'all' ||
    (filters.person || 'all') !== 'all' ||
    (filters.colorCategory || 'all') !== 'all' ||
    (filters.meetingType || 'all') !== 'all' ||
    (filters.attachment || 'all') !== 'all' ||
    (filters.sort || 'relevance') !== 'relevance';
  const resetFilters = () =>
    onChangeFilters({
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

  const getOptionLabel = (options, value) => options.find((option) => option.id === value)?.label || '';
  const filterSummary = [
    isMultiAccount && !isDefaultAccountFilter ? getSearchAccountLabel(filters, accountOptions) : '',
    (filters.calendarScope || 'all') !== 'all' ? `搜索范围：${getOptionLabel(SEARCH_ACCOUNT_SCOPE_OPTIONS, filters.calendarScope)}` : '',
    (filters.timeframe || 'all') !== 'all' ? getOptionLabel(SEARCH_TIMEFRAME_OPTIONS, filters.timeframe) : '',
    (filters.person || 'all') !== 'all' ? peopleOptions.find((option) => option.id === filters.person)?.label : '',
    (filters.colorCategory || 'all') !== 'all' ? `颜色分类：${getColorCategoryMeta(filters.colorCategory, colorCategoryLabels)?.shortLabel || '无分类'}` : '',
    (filters.meetingType || 'all') !== 'all' ? getOptionLabel(SEARCH_MEETING_TYPE_OPTIONS, filters.meetingType) : '',
    (filters.attachment || 'all') !== 'all' ? getOptionLabel(SEARCH_ATTACHMENT_OPTIONS, filters.attachment) : '',
    (filters.sort || 'relevance') !== 'relevance' ? getOptionLabel(SEARCH_SORT_OPTIONS, filters.sort) : '',
  ].filter(Boolean);
  const secondaryFilterCount = [
    (filters.person || 'all') !== 'all',
    (filters.meetingType || 'all') !== 'all',
    (filters.attachment || 'all') !== 'all',
  ].filter(Boolean).length;
  const groupSummaries = [
    { label: '未来30天', count: resultBucketCounts.nearFuture },
    { label: '30天后', count: resultBucketCounts.laterFuture },
    { label: '以前', count: resultBucketCounts.past },
  ];
  const visibleResults = rankedResults.slice(0, visibleResultCount);

  const filterSelectClass =
    'h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-sm font-black text-slate-700 shadow-sm outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
  const filterShellClass = 'relative shrink-0';
  const renderFilterSelect = ({ value, onChange, options, className = 'w-[180px]' }) => (
    <div className={`${filterShellClass} ${className}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${filterSelectClass} w-full`}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
      <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
    </div>
  );
  const colorCategoryFilterOptions = useMemo(
    () =>
      SEARCH_COLOR_CATEGORY_OPTIONS.map((option) =>
        colorCategoryLabels?.[option.id]
          ? { ...option, label: colorCategoryLabels[option.id], shortLabel: colorCategoryLabels[option.id] }
          : option,
      ),
    [colorCategoryLabels],
  );

  const finishColorCategoryEdit = () => {
    if (!editingColorCategory) return;
    const nextLabel = editingColorCategory.value.trim();
    if (nextLabel) onRenameColorCategory?.(editingColorCategory.id, nextLabel);
    setEditingColorCategory(null);
  };

  const renderColorCategoryBadge = (category, extraCount = 0, size = 'sm') => {
    if (!category) return null;

    const editing = editingColorCategory?.id === category.id;
    const heightClass = size === 'lg' ? 'h-7 text-xs' : 'h-6 text-[11px]';
    const dotClass = size === 'lg' ? 'h-2.5 w-2.5' : 'h-2 w-2';

    if (editing) {
      return (
        <span
          className={`inline-flex ${heightClass} shrink-0 items-center rounded-lg bg-slate-100 px-2 font-black text-slate-700`}
          onClick={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
        >
          <span className={`mr-1.5 shrink-0 rounded-full ${dotClass} ${category.colorClass}`}></span>
          <input
            autoFocus
            value={editingColorCategory.value}
            onChange={(event) => setEditingColorCategory({ id: category.id, value: event.target.value })}
            onBlur={finishColorCategoryEdit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                finishColorCategoryEdit();
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                setEditingColorCategory(null);
              }
            }}
            className="h-5 w-16 border-none bg-transparent p-0 text-xs font-black text-slate-800 outline-none"
          />
        </span>
      );
    }

    return (
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setEditingColorCategory({ id: category.id, value: category.label });
        }}
        onDoubleClick={(event) => event.stopPropagation()}
        className={`inline-flex ${heightClass} shrink-0 items-center rounded-lg bg-slate-100 px-2 font-black text-slate-700 transition hover:bg-slate-200`}
        title="点击修改颜色分类名称"
      >
        <span className={`mr-1.5 shrink-0 rounded-full ${dotClass} ${category.colorClass}`}></span>
        {category.label}{extraCount > 0 ? ` +${extraCount}` : ''}
      </button>
    );
  };

  const renderResultActions = (event, isCard = false) => {
    const joinable = canJoinCalendarEvent(event);

    return (
      <div className={`flex shrink-0 items-center gap-2 ${isCard ? 'w-full' : 'w-full justify-start sm:w-auto sm:justify-end'}`}>
        <button
          type="button"
          onClick={(entry) => {
            entry.stopPropagation();
            onOpenEvent(event.id);
          }}
          onDoubleClick={(entry) => entry.stopPropagation()}
          className={`${isCard ? 'h-9 flex-1 justify-center px-3' : 'h-8 px-2.5'} inline-flex shrink-0 items-center rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:bg-slate-50`}
        >
          查看详情
        </button>
        {joinable && (
          <button
            type="button"
            onClick={(entry) => {
              entry.stopPropagation();
              openMeetingLink(event);
            }}
            onDoubleClick={(entry) => entry.stopPropagation()}
            className={`${isCard ? 'h-9 flex-1 justify-center px-3' : 'h-8 px-2.5'} inline-flex shrink-0 items-center rounded-lg bg-blue-600 text-xs font-bold text-white transition hover:bg-blue-700`}
          >
            <ArrowRight size={14} className="mr-1" />
            一键入会
          </button>
        )}
      </div>
    );
  };

  const renderSearchResult = (result, variant = 'list') => {
    const { event, calendar, sourceLabel } = result;
    const isSelected = selectedResultId === event.id;
    const dateMeta = getEventDateMeta(event);
    const timeState = getResultTimeState(event);
    const organizerLabel = getOrganizerLabel(event);
    const participantLabel = formatParticipants(event);
    const meetingMeta = getMeetingMeta(event);
    const snippet = getMatchedSnippet(event, result.match);
    const sourceText = isCrossAccountSearch ? sourceLabel : '';
    const colorCategories = getEventColorCategories(event, colorCategoryLabels);
    const primaryCategory = colorCategories[0];
    const extraCategoryCount = Math.max(0, colorCategories.length - 1);
    const repeatLabel = event.repeat && event.repeat !== 'does_not_repeat' ? `循环 · ${REPEAT_LABELS[event.repeat] || '重复'}` : '';

    if (variant === 'cards') {
      return (
        <article
          key={event.id}
          role="button"
          tabIndex={0}
          data-search-result-id={event.id}
          onClick={() => setSelectedResultId(event.id)}
          onDoubleClick={() => onOpenEvent(event.id)}
          onKeyDown={(entry) => {
            if (entry.key === 'Enter') {
              entry.preventDefault();
              onOpenEvent(event.id);
            }
          }}
          className={`group flex min-h-[286px] flex-col rounded-xl border px-4 py-4 text-left outline-none transition ${
            isSelected ? 'border-blue-200 bg-blue-50/70 shadow-sm' : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:bg-slate-50/70'
          }`}
        >
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {timeState && (
              <span className={`inline-flex h-7 items-center rounded-md border px-2 text-xs font-black ${timeState.className}`}>
                <Clock size={14} className="mr-1" />
                {timeState.label}
              </span>
            )}
            {!timeState && (
              <span className="inline-flex h-7 items-center rounded-md border border-slate-200 bg-slate-50 px-2 text-xs font-black text-slate-500">
                <Clock size={14} className="mr-1" />
                {dateMeta.dateLabel}
              </span>
            )}
          </div>

          <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2">
            <h3 className="min-w-0 truncate text-xl font-black leading-7 text-slate-950">
              {renderHighlighted(event.title || '无标题')}
            </h3>
            {renderColorCategoryBadge(primaryCategory, extraCategoryCount, 'lg')}
            {repeatLabel && (
              <span className="inline-flex h-7 shrink-0 items-center rounded-lg bg-slate-100 px-2 text-xs font-black text-slate-700">
                <RefreshCw size={12} className="mr-1.5" />
                {repeatLabel}
              </span>
            )}
          </div>

          <div className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
            <div className="flex min-w-0 items-center gap-2">
              <Calendar size={15} className="shrink-0 text-slate-400" />
              <span className="truncate">{dateMeta.dateLabel} · {dateMeta.timeLabel}</span>
            </div>
            {meetingMeta.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex min-w-0 items-center gap-2">
                  <Icon size={15} className="shrink-0 text-slate-400" />
                  <span className="truncate">{renderHighlighted(item.label)}</span>
                </div>
              );
            })}
            {organizerLabel && (
              <div className="flex min-w-0 items-center gap-2">
                <Users size={15} className="shrink-0 text-slate-400" />
                <span className="truncate">{renderHighlighted(organizerLabel)}</span>
              </div>
            )}
            {participantLabel && (
              <div className="flex min-w-0 items-center gap-2">
                <Users size={15} className="shrink-0 text-slate-400" />
                <span className="truncate">{renderHighlighted(participantLabel)}</span>
              </div>
            )}
            {sourceText && (
              <div className="flex min-w-0 items-center gap-2">
                <Mail size={15} className="shrink-0 text-slate-400" />
                <span className="truncate">{renderHighlighted(sourceText)}</span>
              </div>
            )}
          </div>

          {snippet && (() => {
            const SnippetIcon = snippet.icon;
            return (
              <div className="mt-4 flex min-w-0 items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2 text-sm font-semibold text-slate-600">
                <SnippetIcon size={14} className="mt-0.5 shrink-0 text-slate-400" />
                <span className="min-w-0 truncate">{renderHighlighted(snippet.text)}</span>
              </div>
            );
          })()}

          <div className="mt-auto pt-4">
            {renderResultActions(event, true)}
          </div>
        </article>
      );
    }

    return (
      <div
        key={event.id}
        role="button"
        tabIndex={0}
        data-search-result-id={event.id}
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
        className={`group grid w-full grid-cols-1 items-start gap-2.5 border-b border-slate-100 px-3 py-2.5 text-left outline-none transition last:border-b-0 sm:px-4 lg:grid-cols-[206px_minmax(0,1fr)_max-content] lg:items-center xl:grid-cols-[190px_minmax(220px,1.35fr)_140px_minmax(150px,0.9fr)_140px_minmax(150px,1fr)_max-content] ${
          isSelected ? 'bg-blue-50/70' : 'bg-white hover:bg-slate-50'
        }`}
      >
        <div className="min-w-0 text-sm font-bold text-slate-600">
          <div className="truncate">{dateMeta.dateLabel} {dateMeta.timeLabel}</div>
          {timeState && (
            <span className={`mt-1 inline-flex w-fit rounded-md border px-2 py-0.5 text-[11px] font-black ${timeState.className}`}>
              {timeState.label}
            </span>
          )}
        </div>

        <div className="min-w-0 lg:pr-3 xl:pr-0">
          <div className="flex min-w-0 items-center gap-2">
            <div className="truncate text-sm font-black leading-6 text-slate-950">
              {renderHighlighted(event.title || '无标题')}
            </div>
            {renderColorCategoryBadge(primaryCategory, extraCategoryCount)}
            {repeatLabel && (
              <span className="inline-flex h-6 shrink-0 items-center rounded-lg bg-slate-100 px-2 text-[11px] font-black text-slate-700">
                <RefreshCw size={11} className="mr-1" />
                {repeatLabel}
              </span>
            )}
          </div>
          <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-slate-500 xl:hidden">
            {organizerLabel && (
              <span className="min-w-0 truncate">
                <span className="text-slate-400">组织者：</span>
                {renderHighlighted(organizerLabel.replace(/^组织者：/, ''))}
              </span>
            )}
            {participantLabel && (
              <span className="flex min-w-0 items-center gap-1 truncate">
                <Users size={13} className="shrink-0 text-slate-400" />
                <span className="text-slate-400">参与人：</span>
                <span className="truncate">{renderHighlighted(participantLabel.replace(/^参与人：/, ''))}</span>
              </span>
            )}
            {meetingMeta[0] && (() => {
              const MeetingIcon = meetingMeta[0].icon;
              return (
                <span className="flex min-w-0 items-center gap-1 truncate">
                  <MeetingIcon size={13} className="shrink-0 text-slate-400" />
                  <span className="truncate">{renderHighlighted(meetingMeta[0].label)}</span>
                </span>
              );
            })()}
            {sourceText && (
              <span className="flex min-w-0 items-center gap-1 truncate">
                <Mail size={13} className="shrink-0 text-slate-400" />
                <span className="truncate">{renderHighlighted(sourceText)}</span>
              </span>
            )}
          </div>
          {sourceText && (
            <div className="mt-1 hidden truncate text-xs font-semibold text-slate-400 xl:block">{renderHighlighted(sourceText)}</div>
          )}
          {snippet && (() => {
            const SnippetIcon = snippet.icon;
            return (
              <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs font-semibold text-slate-500 xl:hidden">
                <SnippetIcon size={13} className="shrink-0 text-slate-400" />
                <span className="min-w-0 truncate">{renderHighlighted(snippet.text)}</span>
              </div>
            );
          })()}
        </div>

        <div className={`hidden min-w-0 truncate text-sm font-semibold text-slate-600 xl:block`}>
          {organizerLabel ? renderHighlighted(organizerLabel.replace(/^组织者：/, '')) : <span className="text-slate-300">-</span>}
        </div>

        <div className="hidden min-w-0 text-sm font-semibold text-slate-600 xl:block">
          {participantLabel ? (
            <div className="flex min-w-0 items-center gap-1.5">
              <Users size={14} className="shrink-0 text-slate-400" />
              <span className="truncate">{renderHighlighted(participantLabel.replace(/^参与人：/, ''))}</span>
            </div>
          ) : (
            <span className="text-slate-300">-</span>
          )}
        </div>

        <div className="hidden min-w-0 text-sm font-semibold text-slate-600 xl:block">
          {meetingMeta.length > 0 ? (
            <div className="flex min-w-0 items-center gap-1.5">
              {meetingMeta[0].icon === MapPin ? <MapPin size={14} className="shrink-0 text-slate-400" /> : <Calendar size={14} className="shrink-0 text-slate-400" />}
              <span className="truncate">{renderHighlighted(meetingMeta[0].label.replace(/^地点：|^线上：/, ''))}</span>
            </div>
          ) : (
            <span className="text-slate-300">-</span>
          )}
        </div>

        <div className="hidden min-w-0 text-sm font-semibold text-slate-600 xl:block">
          {snippet ? (() => {
            const SnippetIcon = snippet.icon;
            return (
              <div className="flex min-w-0 items-center gap-1.5">
                <SnippetIcon size={14} className="shrink-0 text-slate-400" />
                <span className="truncate">{renderHighlighted(snippet.text)}</span>
              </div>
            );
          })() : (
            <span className="text-slate-300">-</span>
          )}
        </div>

        <div className="flex items-center justify-start gap-2 lg:justify-end">
          {renderResultActions(event)}
        </div>
      </div>
    );
  };

  const renderSection = ({ id, title, subtitle, items, totalCount, variant = 'list' }) => {
    if (items.length === 0) return null;

    return (
      <section key={id} className="mb-6 last:mb-0">
        <div className="mb-2 flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-sm font-black text-slate-900">{title}</h3>
            {subtitle && <div className="mt-1 text-xs font-semibold text-slate-400">{subtitle}</div>}
          </div>
          <span className="text-xs font-bold text-slate-400">显示 {items.length}/{totalCount}</span>
        </div>
        <div className={variant === 'cards' ? 'grid gap-4' : 'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm'}>
          {variant !== 'cards' && (
            <div className="hidden grid-cols-[190px_minmax(220px,1.35fr)_140px_minmax(150px,0.9fr)_140px_minmax(150px,1fr)_max-content] border-b border-slate-100 bg-slate-50 px-4 py-2 text-[11px] font-black text-slate-400 xl:grid">
              <span>时间</span>
              <span>会议</span>
              <span>组织者</span>
              <span>参与人</span>
              <span>地点/线上</span>
              <span>相关内容</span>
              <span className="text-right">操作</span>
            </div>
          )}
          {items.map((result) => renderSearchResult(result, variant))}
          {totalCount > items.length && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2.5">
              <span className="text-xs font-semibold text-slate-400">还有 {totalCount - items.length} 条未显示</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisibleResultCount((prev) => Math.min(prev + 20, totalCount))}
                  className="text-xs font-black text-blue-600 transition hover:text-blue-700"
                >
                  继续显示 20 条
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleResultCount(totalCount)}
                  className="text-xs font-black text-blue-600 transition hover:text-blue-700"
                >
                  显示全部 {totalCount} 条
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="border-b border-slate-200 bg-white px-4 py-3 sm:px-8">
        <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center">
          {renderFilterSelect({
            value: filters.calendarScope || 'all',
            onChange: (value) => onChangeFilters({ calendarScope: value }),
            options: SEARCH_ACCOUNT_SCOPE_OPTIONS,
            className: 'w-full sm:w-[180px]',
          })}
          {renderFilterSelect({
            value: filters.timeframe || 'all',
            onChange: (value) => onChangeFilters({ timeframe: value }),
            options: SEARCH_TIMEFRAME_OPTIONS,
            className: 'w-full sm:w-[158px]',
          })}
          {renderFilterSelect({
            value: filters.colorCategory || 'all',
            onChange: (value) => onChangeFilters({ colorCategory: value }),
            options: colorCategoryFilterOptions,
            className: 'w-full sm:w-[180px]',
          })}
          {renderFilterSelect({
            value: filters.sort || 'relevance',
            onChange: (value) => onChangeFilters({ sort: value }),
            options: SEARCH_SORT_OPTIONS,
            className: 'w-full sm:w-[190px]',
          })}
          <details className="group/more relative w-full shrink-0 sm:w-auto">
            <summary className="flex h-9 cursor-pointer list-none items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:justify-start">
              更多筛选{secondaryFilterCount > 0 ? ` · ${secondaryFilterCount}` : ''}
              <ChevronDown size={15} className="text-slate-500" />
            </summary>
            <div className="absolute left-0 top-[calc(100%+6px)] z-30 grid w-[min(720px,calc(100vw-48px))] gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg sm:left-auto sm:right-0 md:grid-cols-3">
              {renderFilterSelect({
                value: filters.person || 'all',
                onChange: (value) => onChangeFilters({ person: value }),
                options: peopleOptions,
                className: 'w-full',
              })}
              {renderFilterSelect({
                value: filters.meetingType || 'all',
                onChange: (value) => onChangeFilters({ meetingType: value }),
                options: SEARCH_MEETING_TYPE_OPTIONS,
                className: 'w-full',
              })}
              {renderFilterSelect({
                value: filters.attachment || 'all',
                onChange: (value) => onChangeFilters({ attachment: value }),
                options: SEARCH_ATTACHMENT_OPTIONS,
                className: 'w-full',
              })}
            </div>
          </details>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-black text-slate-900">共找到 {results.length} 条结果</span>
              {groupSummaries.map((item) => (
                <span key={item.label} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                  {item.label} {item.count}
                </span>
              ))}
            </div>
            {filterSummary.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {filterSummary.map((item) => (
                  <span key={item} className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                    {item}
                  </span>
                ))}
              </div>
            )}
            {results.length > 30 && (
              <div className="mt-2 text-xs font-semibold text-orange-600">
                结果较多，建议先用时间、人员或搜索范围缩小结果。
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className={`h-9 shrink-0 rounded-lg px-3 text-sm font-bold transition ${
              hasActiveFilters ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            清除筛选
          </button>
        </div>
        </div>
      </div>

      <div ref={searchResultsScrollRef} className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-4 sm:px-8">
        {!trimmedQuery ? (
          <div className="flex min-h-[320px] items-center justify-center px-6 text-center text-slate-400">
            <div>
              <Search className="mx-auto mb-4 h-10 w-10" />
              <div className="text-base font-bold text-slate-700">搜索日程</div>
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center px-6 text-center text-slate-500">
            <div className="max-w-md">
              <Search className="mx-auto mb-4 h-10 w-10" />
              <div className="text-base font-black text-slate-800">没有找到与“{trimmedQuery}”相关的日程</div>
              <div className="mt-4 text-left text-sm font-medium leading-7 text-slate-500">
                <div>你可以尝试：</div>
                <div>1. 扩大时间范围</div>
                <div>2. 调整搜索范围，例如加入共享日历或群组日历</div>
                <div>3. 换用组织者、参与人、地点或附件名称搜索</div>
                {isMultiAccount && <div>4. 检查是否选择了正确账号</div>}
                <div>{isMultiAccount ? '5' : '4'}. 清除筛选条件</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[1280px]">
            {renderSection({
              id: 'results',
              title: '相关日程',
              subtitle: '按相关性和时间综合排序，时间范围用上方筛选控制',
              items: visibleResults,
              totalCount: rankedResults.length,
            })}
          </div>
        )}
      </div>
    </div>
  );
}

