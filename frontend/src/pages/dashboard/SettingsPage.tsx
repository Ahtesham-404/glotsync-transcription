import React, { useState } from 'react'
import { Settings, Bell, Shield, Globe, Download } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export function SettingsPage() {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    email: true, browser: true, jobComplete: true, jobFailed: true, weeklyReport: false,
  })
  const [privacy, setPrivacy] = useState<Record<string, boolean>>({
    shareUsageData: false, marketingEmails: false,
  })
  const [language, setLanguage] = useState('en')
  const [defaultFormat, setDefaultFormat] = useState('txt')

  const handleSave = () => {
    toast.success('Settings saved')
  }

  const ToggleRow = ({
    label, description, value, onChange,
  }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-surface-700/30 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-200">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={[
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 flex-shrink-0',
          value ? 'bg-brand-500' : 'bg-surface-600',
        ].join(' ')}
      >
        <span
          className={[
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow',
            value ? 'translate-x-6' : 'translate-x-1',
          ].join(' ')}
        />
      </button>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Settings</h1>

      {/* Language */}
      <Card>
        <h2 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <Globe size={16} className="text-brand-400" /> Language & Formats
        </h2>
        <div className="space-y-4">
          <Select
            label="Interface Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
              { value: 'de', label: 'German' },
              { value: 'pt', label: 'Portuguese' },
              { value: 'ja', label: 'Japanese' },
              { value: 'zh', label: 'Chinese' },
              { value: 'ar', label: 'Arabic' },
            ]}
            fullWidth
          />
          <Select
            label="Default Download Format"
            value={defaultFormat}
            onChange={(e) => setDefaultFormat(e.target.value)}
            options={[
              { value: 'txt', label: 'Plain Text (.txt)' },
              { value: 'srt', label: 'SubRip Subtitles (.srt)' },
              { value: 'vtt', label: 'WebVTT Captions (.vtt)' },
            ]}
            fullWidth
          />
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <h2 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <Bell size={16} className="text-brand-400" /> Notifications
        </h2>
        <div>
          {([
            { key: 'email', label: 'Email notifications', description: 'Receive emails for important events' },
            { key: 'browser', label: 'Browser notifications', description: 'Show browser push notifications' },
            { key: 'jobComplete', label: 'Job complete', description: 'Notify when a transcript is ready' },
            { key: 'jobFailed', label: 'Job failed', description: 'Notify when a transcription fails' },
            { key: 'weeklyReport', label: 'Weekly digest', description: 'Weekly summary of your usage' },
          ] as const).map(({ key, label, description }) => (
            <ToggleRow
              key={key}
              label={label}
              description={description}
              value={notifications[key]}
              onChange={(v) => setNotifications((prev) => ({ ...prev, [key]: v }))}
            />
          ))}
        </div>
      </Card>

      {/* Privacy */}
      <Card>
        <h2 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <Shield size={16} className="text-brand-400" /> Privacy
        </h2>
        <div>
          {([
            { key: 'shareUsageData', label: 'Share anonymized usage data', description: 'Help us improve GlotSync AI by sharing anonymized usage statistics' },
            { key: 'marketingEmails', label: 'Marketing emails', description: 'Receive product updates, tips, and promotional emails' },
          ] as const).map(({ key, label, description }) => (
            <ToggleRow
              key={key}
              label={label}
              description={description}
              value={privacy[key]}
              onChange={(v) => setPrivacy((prev) => ({ ...prev, [key]: v }))}
            />
          ))}
        </div>
      </Card>

      <Button variant="primary" size="md" onClick={handleSave}>
        Save Settings
      </Button>
    </div>
  )
}
