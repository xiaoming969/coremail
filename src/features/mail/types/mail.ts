export type MailAddress = {
  id?: string;
  name?: string;
  email: string;
  organization?: string;
  isExternal?: boolean;
};

export type MailAttachmentStatus = 'scanning' | 'safe' | 'warning' | 'blocked' | 'unavailable';

export type MailAttachment = {
  id: string;
  name: string;
  type: string;
  size: string | number;
  status: MailAttachmentStatus;
  canPreview: boolean;
  canDownload: boolean;
  riskReason?: string;
};

export type MailSecurityLevel = 'none' | 'info' | 'warning' | 'danger';

export type MailSecurityInfo = {
  level: MailSecurityLevel;
  isExternalSender?: boolean;
  hasExternalRecipients?: boolean;
  hasExternalLinks?: boolean;
  hasRiskyAttachments?: boolean;
  isSensitive?: boolean;
  isBlocked?: boolean;
  message?: string;
};

export type MailReadingState =
  | 'normal'
  | 'loading'
  | 'empty'
  | 'error'
  | 'attachmentError'
  | 'deleted'
  | 'blocked'
  | 'externalImagesBlocked';

export type MailReadingPaneMail = {
  id: string;
  accountId?: string;
  folder?: string;
  unread?: boolean;
  starred?: boolean;
  subject: string;
  fromName?: string;
  fromEmail?: string;
  from?: MailAddress;
  to?: Array<string | MailAddress>;
  cc?: Array<string | MailAddress>;
  bcc?: Array<string | MailAddress>;
  preview?: string;
  body?: string;
  bodyText?: string;
  quotedHistory?: string;
  attachments?: Array<Partial<MailAttachment> & { name: string; size?: string | number }>;
  timestamp?: number;
  sentAt?: string;
  linkedEventId?: string;
  isSystemMail?: boolean;
  isImportant?: boolean;
  hasFollowUp?: boolean;
  labels?: string[];
  security?: MailSecurityInfo;
  readingState?: MailReadingState;
  deleted?: boolean;
  externalImagesBlocked?: boolean;
};

export type MailReaderActionHandlers = {
  onReply?: () => void;
  onReplyAll?: () => void;
  onForward?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onMove?: () => void;
  onToggleRead?: () => void;
  onToggleFollowUp?: () => void;
  onCreateTask?: () => void;
  onCreateEvent?: () => void;
  onRetry?: () => void;
  onBackToList?: () => void;
  onViewNext?: () => void;
  onMarkReadAfterViewing?: () => void;
  onPreviewAttachment?: (attachment: MailAttachment) => void;
  onDownloadAttachment?: (attachment: MailAttachment) => void;
  onQuickReplySend?: (body: string) => void;
  onSecurityAction?: (action: string) => void;
};
