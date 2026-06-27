// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  plan: PlanTier
  storageUsedBytes: number
  storageQuotaBytes: number
  totalUploads: number
  completedJobs: number
}

export type PlanTier = 'free' | 'starter' | 'pro' | 'enterprise'

// ─── Files & Jobs ─────────────────────────────────────────────────────────────

export type JobStatus = 'queued' | 'uploading' | 'processing' | 'completed' | 'failed'

export type SupportedMimeType =
  | 'audio/mpeg'
  | 'audio/wav'
  | 'audio/aac'
  | 'audio/m4a'
  | 'audio/x-m4a'
  | 'audio/flac'
  | 'audio/ogg'
  | 'video/mp4'
  | 'video/quicktime'
  | 'video/x-msvideo'
  | 'video/x-matroska'
  | 'video/webm'

export type SupportedExtension =
  | 'mp3' | 'wav' | 'aac' | 'm4a' | 'flac' | 'ogg'
  | 'mp4' | 'mov' | 'avi' | 'mkv' | 'webm'

export interface UploadedFile {
  id: string
  userId: string
  filename: string
  originalName: string
  mimeType: string
  sizeBytes: number
  s3Key: string
  createdAt: string
  updatedAt: string
  job?: TranscriptionJob
}

export interface TranscriptionJob {
  id: string
  fileId: string
  status: JobStatus
  progress: number
  errorMessage?: string
  transcriptId?: string
  durationSeconds?: number
  wordCount?: number
  language?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
}

export interface Transcript {
  id: string
  jobId: string
  fileId: string
  text: string
  segments: TranscriptSegment[]
  language: string
  durationSeconds: number
  wordCount: number
  createdAt: string
}

export interface TranscriptSegment {
  id: number
  start: number
  end: number
  text: string
  words?: TranscriptWord[]
}

export interface TranscriptWord {
  word: string
  start: number
  end: number
  confidence: number
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface UploadResponse {
  fileId: string
  jobId: string
  uploadUrl: string
  message: string
}

export interface DownloadResponse {
  downloadUrl: string
  expiresAt: string
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  version: string
  timestamp: string
  database: 'connected' | 'disconnected'
  storage: 'connected' | 'disconnected'
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalUploads: number
  completedJobs: number
  processingJobs: number
  failedJobs: number
  storageUsedBytes: number
  storageQuotaBytes: number
  recentActivity: ActivityItem[]
  usageByDay: UsageDataPoint[]
}

export interface ActivityItem {
  id: string
  type: 'upload' | 'complete' | 'download' | 'delete' | 'failed'
  filename: string
  timestamp: string
  metadata?: Record<string, string | number>
}

export interface UsageDataPoint {
  date: string
  uploads: number
  completed: number
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

// ─── Settings ────────────────────────────────────────────────────────────────

export interface UserSettings {
  theme: 'dark' | 'light' | 'system'
  language: string
  notifications: {
    email: boolean
    browser: boolean
    jobComplete: boolean
    jobFailed: boolean
    weeklyReport: boolean
  }
  privacy: {
    shareUsageData: boolean
    marketingEmails: boolean
  }
  defaultDownloadFormat: 'txt' | 'srt' | 'vtt'
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

export interface PricingPlan {
  id: PlanTier
  name: string
  description: string
  monthlyPrice: number | null
  yearlyPrice: number | null
  features: PricingFeature[]
  limits: PlanLimits
  popular?: boolean
  cta: string
  ctaVariant: 'primary' | 'secondary' | 'outline'
}

export interface PricingFeature {
  text: string
  included: boolean
  tooltip?: string
}

export interface PlanLimits {
  minutesPerMonth: number | null
  maxFileSizeMb: number
  storageGb: number | null
  concurrentJobs: number
  retentionDays: number | null
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export interface UploadItem {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error'
  progress: number
  error?: string
  fileId?: string
  jobId?: string
}
