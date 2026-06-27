import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Upload,
  Files,
  History,
  Download,
  Settings,
  User,
  HelpCircle,
  Zap,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Upload, label: 'Upload', href: '/dashboard/upload' },
  { icon: Files, label: 'Files', href: '/dashboard/files' },
  { icon: History, label: 'History', href: '/dashboard/history' },
  { icon: Download, label: 'Downloads', href: '/dashboard/downloads' },
]

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: HelpCircle, label: 'Help', href: '/help' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function DashboardSidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth()

  return (
    <aside
      className={[
        'fixed left-0 top-0 bottom-0 z-30 flex flex-col',
        'bg-surface-900 border-r border-surface-700/50',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-60',
      ].join(' ')}
      aria-label="Dashboard sidebar"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-surface-700/50 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2.5 min-w-0" aria-label="GlotSync AI">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-900/40">
            <Zap size={15} className="text-white" fill="white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-base text-white tracking-tight overflow-hidden whitespace-nowrap"
              >
                Glot<span className="gradient-text">Sync</span>
                <span className="text-gray-400 font-normal"> AI</span>
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto hide-scrollbar" aria-label="Main">
        <ul className="space-y-1" role="list">
          {navItems.map(({ icon: Icon, label, href }) => (
            <li key={href}>
              <NavLink
                to={href}
                end={href === '/dashboard'}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                    'transition-all duration-150',
                    isActive
                      ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-surface-800',
                    collapsed ? 'justify-center' : '',
                  ].join(' ')
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom nav */}
      <div className="px-2 py-4 border-t border-surface-700/50">
        <ul className="space-y-1 mb-3" role="list">
          {bottomItems.map(({ icon: Icon, label, href }) => (
            <li key={href}>
              <NavLink
                to={href}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                    'transition-all duration-150',
                    isActive
                      ? 'bg-brand-500/15 text-brand-300 border border-brand-500/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-surface-800',
                    collapsed ? 'justify-center' : '',
                  ].join(' ')
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* User avatar */}
        {user && (
          <div
            className={[
              'flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-800',
              collapsed ? 'justify-center' : '',
            ].join(' ')}
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-7 h-7 rounded-full flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                {(user.displayName || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="min-w-0 flex-1 overflow-hidden"
                >
                  <p className="text-sm font-medium text-gray-200 truncate">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={[
            'mt-2 w-full flex items-center justify-center py-2 rounded-xl',
            'text-gray-500 hover:text-gray-300 hover:bg-surface-800 transition-colors',
            'text-xs gap-1',
          ].join(' ')}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={14} /> : (
            <>
              <ChevronLeft size={14} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
