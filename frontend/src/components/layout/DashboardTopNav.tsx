import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Search,
  LogOut,
  User,
  Settings,
  ChevronDown,
  CheckCircle2,
  Info,
  AlertTriangle,
  XCircle,
  Check,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/components/ui/Toast'
import type { Notification } from '@/types'

// ── No hardcoded mock notifications ──────────────────────────────────────────
// Notifications start empty. They will be populated in a future backend
// endpoint (/api/notifications). For now the panel shows "No notifications"
// which is honest — no fake data shown to users.

const notifIcons = {
  success: <CheckCircle2 size={14} className="text-emerald-400" />,
  info: <Info size={14} className="text-sky-400" />,
  warning: <AlertTriangle size={14} className="text-amber-400" />,
  error: <XCircle size={14} className="text-red-400" />,
}

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function DashboardTopNav() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  // Start with empty notifications — no fake data
  const [notifications, setNotifications] = useState<Notification[]>([])
  const userMenuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch {
      toast.error('Failed to sign out', 'Please try again.')
    }
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <header className="h-16 bg-surface-900 border-b border-surface-700/50 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search files and transcripts..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface-800 border border-surface-600/50 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
            aria-label="Search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-9 h-9 rounded-xl bg-surface-800 border border-surface-600/50 flex items-center justify-center text-gray-400 hover:text-gray-200 hover:border-surface-500 transition-all"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-expanded={notifOpen}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl border border-surface-600/50 shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-surface-700/50">
                  <h3 className="text-sm font-semibold text-gray-200">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                    >
                      <Check size={12} />
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center">
                      <Bell size={24} className="mx-auto mb-2 text-gray-600" />
                      <p className="text-sm text-gray-500">No notifications yet</p>
                      <p className="text-xs text-gray-600 mt-1">
                        You'll be notified when a transcription completes.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={[
                          'flex gap-3 px-4 py-3 border-b border-surface-700/30 last:border-0',
                          'hover:bg-surface-700/30 transition-colors cursor-pointer',
                          !notif.read ? 'bg-brand-500/5' : '',
                        ].join(' ')}
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.map((n) => n.id === notif.id ? { ...n, read: true } : n)
                          )
                          if (notif.link) {
                            navigate(notif.link)
                            setNotifOpen(false)
                          }
                        }}
                      >
                        <span className="flex-shrink-0 mt-0.5">
                          {notifIcons[notif.type]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-gray-200 leading-tight">
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-brand-400 flex-shrink-0 mt-1" />
                            )}
                          </div>
                          {notif.message && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {notif.message}
                            </p>
                          )}
                          <p className="text-xs text-gray-600 mt-1">
                            {timeAgo(notif.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-surface-800 transition-colors"
            aria-label="User menu"
            aria-expanded={userMenuOpen}
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-7 h-7 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <span className="hidden sm:block text-sm font-medium text-gray-300 max-w-24 truncate">
              {user?.displayName || user?.email?.split('@')[0]}
            </span>
            <ChevronDown size={14} className="text-gray-500 hidden sm:block" />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl border border-surface-600/50 shadow-2xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-surface-700/50">
                  <p className="text-sm font-semibold text-gray-200 truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-700/50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User size={15} />
                    Profile
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-gray-200 hover:bg-surface-700/50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings size={15} />
                    Settings
                  </Link>
                </div>
                <div className="border-t border-surface-700/50 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
