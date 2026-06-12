import type { MailAddress, MailAttachment, MailReadingPaneMail, MailReadingState, MailSecurityInfo } from '../types/mail';

const INTERNAL_DOMAIN = 'calendarpro.io';
const ME_EMAILS = new Set(['me@calendarpro.io']);

export const isExternalEmail = (email = '') => {
  const normalized = email.toLowerCase();
  return Boolean(normalized && !normalized.endsWith(`@${INTERNAL_DOMAIN}`));
};

export const normalizeAddress = (value: string | MailAddress): MailAddress => {
  if (typeof value !== 'string') {
    return {
      ...value,
      name: value.name || value.email,
      isExternal: value.isExternal ?? isExternalEmail(value.email),
    };
  }

  return {
    name: value,
    email: value,
    isExternal: isExternalEmail(value),
  };
};

export const getMailSender = (mail: MailReadingPaneMail): MailAddress => {
  if (mail.from) return normalizeAddress(mail.from);
  const fromScope = mail.fromScope;

  return normalizeAddress({
    name: mail.fromName || mail.fromEmail || '未知发件人',
    email: mail.fromEmail || '',
    isExternal: fromScope === 'external' ? true : fromScope === 'internal' || fromScope === 'system' ? false : undefined,
  });
};

export const getMailRecipients = (mail: MailReadingPaneMail, field: 'to' | 'cc' | 'bcc') =>
  (mail[field] || []).map((recipient) => normalizeAddress(recipient));

export const getRecipientSummary = (mail: MailReadingPaneMail) => {
  const to = getMailRecipients(mail, 'to');
  const cc = getMailRecipients(mail, 'cc');
  const total = to.length + cc.length + getMailRecipients(mail, 'bcc').length;
  const meInTo = to.some((recipient) => ME_EMAILS.has(recipient.email.toLowerCase()));
  const meInCc = cc.some((recipient) => ME_EMAILS.has(recipient.email.toLowerCase()));

  if (meInTo) return total > 1 ? `发给我等 ${total} 人` : '发给我';
  if (meInCc) return total > 1 ? `抄送我等 ${total} 人` : '抄送我';
  if (to[0]) return total > 1 ? `发给 ${to[0].name || to[0].email} 等 ${total} 人` : `发给 ${to[0].name || to[0].email}`;
  return '未显示收件人';
};

const getAttachmentType = (name = '') => {
  const extension = name.split('.').pop()?.toUpperCase() || 'FILE';
  return extension.length > 8 ? 'FILE' : extension;
};

const getDefaultAttachmentStatus = (attachment: Partial<MailAttachment> & { name: string }): MailAttachment['status'] => {
  if (attachment.status) return attachment.status;
  if (/\.(html|exe|scr|bat|cmd)$/i.test(attachment.name)) return 'warning';
  return 'safe';
};

export const normalizeAttachments = (mail: MailReadingPaneMail): MailAttachment[] =>
  (mail.attachments || []).map((attachment, index) => {
    const status = getDefaultAttachmentStatus(attachment);
    const id = attachment.id || `att-${mail.id}-${index}`;
    const canDownload = attachment.canDownload ?? (status === 'safe' || status === 'warning');
    const canPreview = attachment.canPreview ?? (status !== 'blocked' && status !== 'unavailable');

    return {
      id,
      name: attachment.name,
      type: attachment.type || getAttachmentType(attachment.name),
      size: attachment.size || '未知大小',
      status,
      canPreview,
      canDownload,
      riskReason: attachment.riskReason,
    };
  });

export const getSecurityInfo = (mail: MailReadingPaneMail, attachments = normalizeAttachments(mail)): MailSecurityInfo => {
  if (mail.security) return mail.security;

  const sender = getMailSender(mail);
  const allRecipients = [...getMailRecipients(mail, 'to'), ...getMailRecipients(mail, 'cc'), ...getMailRecipients(mail, 'bcc')];
  const hasExternalRecipients = allRecipients.some((recipient) => recipient.isExternal);
  const hasRiskyAttachments = attachments.some((attachment) => attachment.status === 'warning' || attachment.status === 'blocked');
  const hasExternalLinks = /https?:\/\/(?![^/\s]+calendarpro\.io)/i.test(`${mail.body || ''} ${mail.preview || ''}`);

  if (mail.readingState === 'blocked') {
    return {
      level: 'danger',
      isBlocked: true,
      isExternalSender: sender.isExternal,
      hasExternalLinks,
      hasExternalRecipients,
      hasRiskyAttachments: true,
      message: '系统检测到该邮件存在安全风险，已限制部分操作。',
    };
  }

  if (hasRiskyAttachments || hasExternalLinks) {
    return {
      level: 'warning',
      isExternalSender: sender.isExternal,
      hasExternalRecipients,
      hasExternalLinks,
      hasRiskyAttachments,
      message: '邮件包含外部链接或敏感附件，请确认来源后处理。',
    };
  }

  if (sender.isExternal || hasExternalRecipients) {
    return {
      level: 'info',
      isExternalSender: sender.isExternal,
      hasExternalRecipients,
      message: '这是来自公司外部的邮件，请注意识别发件人身份。',
    };
  }

  return { level: 'none' };
};

export const getEffectiveReadingState = (mail: MailReadingPaneMail | null, requestedState?: MailReadingState): MailReadingState => {
  if (!mail) return 'empty';
  if (requestedState) return requestedState;
  if (mail.deleted || mail.folder === 'deleted') return 'deleted';
  if (mail.externalImagesBlocked) return 'externalImagesBlocked';
  if (mail.readingState) return mail.readingState;
  return 'normal';
};

export const hasReplyAllRisk = (mail: MailReadingPaneMail) => {
  const recipients = [...getMailRecipients(mail, 'to'), ...getMailRecipients(mail, 'cc'), ...getMailRecipients(mail, 'bcc')];
  const security = getSecurityInfo(mail);
  return recipients.length > 4 || recipients.some((recipient) => recipient.isExternal) || security.level === 'warning' || security.level === 'danger';
};
