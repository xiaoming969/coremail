import type { MailReadingState } from '../types/mail';

export type MailReadingScenario = {
  id: string;
  mailId: string;
  label: string;
  state: MailReadingState;
};

export const MAIL_READING_STATE_BY_MAIL_ID: Record<string, MailReadingState> = {
  m50: 'loading',
  m53: 'externalImagesBlocked',
  m54: 'attachmentError',
  m55: 'blocked',
  m56: 'deleted',
  m57: 'error',
  m61: 'empty',
};

export const MAIL_READING_SCENARIOS: MailReadingScenario[] = [
  { id: 'internal', mailId: 'm1', label: '普通内部邮件', state: 'normal' },
  { id: 'attachment', mailId: 'm1', label: '带附件邮件', state: 'normal' },
  { id: 'external', mailId: 'm7', label: '外部发件人邮件', state: 'normal' },
  { id: 'external-link', mailId: 'm7', label: '外部发件人 + 外部链接邮件', state: 'normal' },
  { id: 'risky-attachment', mailId: 'm7', label: '风险附件邮件', state: 'normal' },
  { id: 'long-thread', mailId: 'm35', label: '长邮件链邮件', state: 'normal' },
  { id: 'system', mailId: 'm40', label: '系统通知邮件', state: 'normal' },
  { id: 'loading', mailId: 'm50', label: '正文加载中状态', state: 'loading' },
  { id: 'deleted', mailId: 'm56', label: '邮件已删除状态', state: 'deleted' },
  { id: 'load-error', mailId: 'm57', label: '正文加载失败状态', state: 'error' },
  { id: 'blocked', mailId: 'm55', label: '安全拦截状态', state: 'blocked' },
  { id: 'external-images', mailId: 'm53', label: '外部图片拦截状态', state: 'externalImagesBlocked' },
  { id: 'empty-body', mailId: 'm61', label: '空正文状态', state: 'empty' },
];
