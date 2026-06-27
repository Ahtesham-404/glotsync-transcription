import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { History, Eye, ChevronRight } from 'lucide-react'
import { JobStatusBadge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useFiles } from '@/hooks/useFiles'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function HistoryPage() {
  const { data, isLoading } = useFiles(1, 50)

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <History size={22} className="text-brand-400" />
        <h1 className="text-2xl font-bold text-gray-100">History</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !data?.items.length ? (
        <div className="text-center py-20 text-gray-500">
          <History size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No history yet</p>
          <Link to="/dashboard/upload" className="mt-4 inline-block">
            <Button variant="primary" size="sm">Upload a file</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {data.items.map((file, i) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">{file.originalName}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(file.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {file.job && <JobStatusBadge status={file.job.status} />}
                {file.job?.status === 'completed' && file.job.transcriptId && (
                  <Link to={`/dashboard/transcript/${file.job.transcriptId}`}>
                    <Button variant="ghost" size="xs" icon={<Eye size={13} />} iconRight={<ChevronRight size={12} />}>
                      View
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
