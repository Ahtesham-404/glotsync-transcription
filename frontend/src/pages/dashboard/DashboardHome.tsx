import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Upload, Files, CheckCircle2, HardDrive, TrendingUp,
  Clock, AlertCircle, ArrowRight, Activity,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useDashboardStats } from '@/hooks/useDashboard'
import { Spinner } from '@/components/ui/Spinner'
import { fadeUpProps } from '@/lib/motion'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

const activityIcons: Record<string, React.ReactNode> = {
  upload: <Upload size={14} className="text-blue-400" />,
  complete: <CheckCircle2 size={14} className="text-emerald-400" />,
  download: <Files size={14} className="text-brand-400" />,
  delete: <AlertCircle size={14} className="text-gray-400" />,
  failed: <AlertCircle size={14} className="text-red-400" />,
}

export function DashboardHome() {
  const { user } = useAuth()
  const { data: stats, isLoading } = useDashboardStats()

  const storagePercent = stats
    ? Math.min((stats.storageUsedBytes / stats.storageQuotaBytes) * 100, 100)
    : 0

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome */}
      <motion.div {...fadeUpProps(0)}>
        <h1 className="text-2xl font-bold text-gray-100">
          Welcome back, {user?.displayName?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-gray-400 text-sm mt-1">Here's what's happening with your transcriptions.</p>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Upload, label: 'Total Uploads', value: stats?.totalUploads ?? 0,
                color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', delay: 0,
              },
              {
                icon: CheckCircle2, label: 'Completed', value: stats?.completedJobs ?? 0,
                color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', delay: 0.05,
              },
              {
                icon: Clock, label: 'Processing', value: stats?.processingJobs ?? 0,
                color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', delay: 0.1,
              },
              {
                icon: TrendingUp, label: 'Failed', value: stats?.failedJobs ?? 0,
                color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', delay: 0.15,
              },
            ].map(({ icon: Icon, label, value, color, bg, delay }) => (
              <motion.div key={label} {...fadeUpProps(delay)}>
                <Card className="flex items-center gap-4">
                  <div className={['w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0', bg].join(' ')}>
                    <Icon size={18} className={color} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-100">{value}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Storage + Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Storage */}
            <motion.div {...fadeUpProps(0.2)}>
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <HardDrive size={16} className="text-brand-400" />
                  <h2 className="font-semibold text-gray-200">Storage Used</h2>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">
                      {formatBytes(stats?.storageUsedBytes ?? 0)}
                    </span>
                    <span className="text-gray-500">
                      {stats?.storageQuotaBytes
                        ? formatBytes(stats.storageQuotaBytes)
                        : 'Unlimited'}
                    </span>
                  </div>
                  <ProgressBar
                    value={storagePercent}
                    color={storagePercent > 85 ? 'error' : storagePercent > 65 ? 'warning' : 'brand'}
                    size="lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">{storagePercent.toFixed(1)}% of your storage used</p>
                </div>
                {storagePercent > 80 && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <AlertCircle size={14} className="text-amber-400" />
                    <p className="text-xs text-amber-300">Storage nearly full. Consider upgrading your plan.</p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Quick actions */}
            <motion.div {...fadeUpProps(0.25)}>
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Activity size={16} className="text-brand-400" />
                  <h2 className="font-semibold text-gray-200">Quick Actions</h2>
                </div>
                <div className="space-y-3">
                  <Link to="/dashboard/upload">
                    <Button variant="primary" fullWidth icon={<Upload size={16} />} iconRight={<ArrowRight size={14} />}>
                      Upload New File
                    </Button>
                  </Link>
                  <Link to="/dashboard/files">
                    <Button variant="secondary" fullWidth icon={<Files size={16} />}>
                      View All Files
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Recent Activity */}
          {stats?.recentActivity && stats.recentActivity.length > 0 && (
            <motion.div {...fadeUpProps(0.3)}>
              <Card>
                <h2 className="font-semibold text-gray-200 mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {stats.recentActivity.slice(0, 8).map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-surface-700/30 last:border-0">
                      <div className="w-7 h-7 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0">
                        {activityIcons[item.type] ?? <Activity size={14} className="text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300 truncate">{item.filename}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                      </div>
                      <span className="text-xs text-gray-600 flex-shrink-0">{timeAgo(item.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
