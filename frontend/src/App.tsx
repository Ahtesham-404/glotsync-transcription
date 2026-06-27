import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import { queryClient } from '@/lib/queryClient'
import { PageLoader } from '@/components/ui/Spinner'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

// Public pages
const HomePage = lazy(() => import('@/pages/public/HomePage').then((m) => ({ default: m.HomePage })))
const FeaturesPage = lazy(() => import('@/pages/public/FeaturesPage').then((m) => ({ default: m.FeaturesPage })))
const PricingPage = lazy(() => import('@/pages/public/PricingPage').then((m) => ({ default: m.PricingPage })))
const AboutPage = lazy(() => import('@/pages/public/AboutPage').then((m) => ({ default: m.AboutPage })))
const ContactPage = lazy(() => import('@/pages/public/ContactPage').then((m) => ({ default: m.ContactPage })))
const BlogPage = lazy(() => import('@/pages/public/BlogPage').then((m) => ({ default: m.BlogPage })))
const DocsPage = lazy(() => import('@/pages/public/DocsPage').then((m) => ({ default: m.DocsPage })))
const HelpPage = lazy(() => import('@/pages/public/HelpPage').then((m) => ({ default: m.HelpPage })))
const ApiDocsPage = lazy(() => import('@/pages/public/ApiDocsPage').then((m) => ({ default: m.ApiDocsPage })))
const PrivacyPage = lazy(() => import('@/pages/public/PrivacyPage').then((m) => ({ default: m.PrivacyPage })))
const TermsPage = lazy(() => import('@/pages/public/TermsPage').then((m) => ({ default: m.TermsPage })))
const CookiePolicyPage = lazy(() => import('@/pages/public/CookiePolicyPage').then((m) => ({ default: m.CookiePolicyPage })))
const SecurityPage = lazy(() => import('@/pages/public/SecurityPage').then((m) => ({ default: m.SecurityPage })))
const NotFoundPage = lazy(() => import('@/pages/public/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })))
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })))

// Dashboard pages
const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome').then((m) => ({ default: m.DashboardHome })))
const UploadPage = lazy(() => import('@/pages/dashboard/UploadPage').then((m) => ({ default: m.UploadPage })))
const FilesPage = lazy(() => import('@/pages/dashboard/FilesPage').then((m) => ({ default: m.FilesPage })))
const HistoryPage = lazy(() => import('@/pages/dashboard/HistoryPage').then((m) => ({ default: m.HistoryPage })))
const DownloadsPage = lazy(() => import('@/pages/dashboard/DownloadsPage').then((m) => ({ default: m.DownloadsPage })))
const TranscriptPage = lazy(() => import('@/pages/dashboard/TranscriptPage').then((m) => ({ default: m.TranscriptPage })))
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage').then((m) => ({ default: m.SettingsPage })))

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route element={<PublicLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="features" element={<FeaturesPage />} />
                  <Route path="pricing" element={<PricingPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="docs" element={<DocsPage />} />
                  <Route path="help" element={<HelpPage />} />
                  <Route path="api-docs" element={<ApiDocsPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="cookies" element={<CookiePolicyPage />} />
                  <Route path="security" element={<SecurityPage />} />
                </Route>

                {/* Auth routes (no layout) */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="verify-email" element={<VerifyEmailPage />} />

                {/* Dashboard routes (protected) */}
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardHome />} />
                  <Route path="upload" element={<UploadPage />} />
                  <Route path="files" element={<FilesPage />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="downloads" element={<DownloadsPage />} />
                  <Route path="transcript/:id" element={<TranscriptPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
