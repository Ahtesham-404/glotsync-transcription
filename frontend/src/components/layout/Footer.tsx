import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, ExternalLink } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

const footerLinks = {
  Product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Roadmap', href: '/roadmap' },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs' },
    { label: 'API Reference', href: '/api-docs' },
    { label: 'Blog', href: '/blog' },
    { label: 'Help Center', href: '/help' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Security', href: '/security' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

const socials = [
  { icon: ExternalLink, href: 'https://twitter.com/glotsyncai', label: 'Twitter', text: '𝕏' },
  { icon: ExternalLink, href: 'https://github.com/glotsyncai', label: 'GitHub', text: 'GH' },
  { icon: ExternalLink, href: 'https://linkedin.com/company/glotsync', label: 'LinkedIn', text: 'in' },
  { icon: Mail, href: 'mailto:hello@glotsync.online', label: 'Email', text: null },
]

export function Footer() {
  return (
    <footer className="bg-surface-950 border-t border-surface-800" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center mb-4" aria-label="GlotSync AI home">
              <Logo size={34} />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
              Transform audio and video into accurate, searchable transcripts. Built for creators, businesses, and professionals.
            </p>
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label, text }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-surface-800 border border-surface-600/50 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:border-surface-500 transition-all duration-150 text-xs font-bold"
                  aria-label={label}
                >
                  {text ?? <Icon size={16} />}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-surface-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} GlotSync AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
