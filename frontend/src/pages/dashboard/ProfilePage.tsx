import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Lock, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const nameSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'At least 8 characters').regex(/[A-Z]/, 'Needs uppercase').regex(/[0-9]/, 'Needs number'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  path: ['confirmPassword'], message: 'Passwords do not match',
})

const deleteSchema = z.object({
  password: z.string().min(1, 'Password required'),
  confirm: z.string().min(1, 'Please type DELETE to confirm'),
})

type NameForm = z.infer<typeof nameSchema>
type PasswordForm = z.infer<typeof passwordSchema>
type DeleteForm = z.infer<typeof deleteSchema>

export function ProfilePage() {
  const { user, updateDisplayName, changePassword, deleteAccount } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const nameForm = useForm<NameForm>({
    resolver: zodResolver(nameSchema),
    defaultValues: { displayName: user?.displayName ?? '' },
  })

  const pwForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })
  const deleteForm = useForm<DeleteForm>({ resolver: zodResolver(deleteSchema) })

  const onNameSubmit = async (values: NameForm) => {
    try {
      await updateDisplayName(values.displayName)
      toast.success('Profile updated')
    } catch {
      toast.error('Update failed', 'Please try again.')
    }
  }

  const onPasswordSubmit = async (values: PasswordForm) => {
    try {
      await changePassword(values.currentPassword, values.newPassword)
      toast.success('Password changed', 'Your password has been updated.')
      pwForm.reset()
    } catch (err) {
      const code = (err as { code?: string }).code
      if (code === 'auth/wrong-password') {
        pwForm.setError('currentPassword', { message: 'Incorrect current password' })
      } else {
        toast.error('Password change failed', 'Please try again.')
      }
    }
  }

  const onDeleteSubmit = async (values: DeleteForm) => {
    if (values.confirm !== 'DELETE') {
      deleteForm.setError('confirm', { message: 'Type DELETE to confirm' })
      return
    }
    try {
      await deleteAccount(values.password)
      navigate('/')
    } catch (err) {
      const code = (err as { code?: string }).code
      if (code === 'auth/wrong-password') {
        deleteForm.setError('password', { message: 'Incorrect password' })
      } else {
        toast.error('Delete failed', 'Please try again.')
      }
    }
  }

  const isGoogleUser = user?.providerData.some((p) => p.providerId === 'google.com')

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Profile</h1>

      {/* Avatar */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="relative">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-16 h-16 rounded-2xl" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-bold">
                {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-100">{user?.displayName || 'No name set'}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              {user?.emailVerified
                ? <span className="text-xs text-emerald-400 flex items-center gap-1">✓ Email verified</span>
                : <span className="text-xs text-amber-400">Email not verified</span>}
            </div>
          </div>
        </div>
      </Card>

      {/* Display name */}
      <Card>
        <h2 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <User size={16} className="text-brand-400" /> Display Name
        </h2>
        <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="space-y-4">
          <Input
            label="Full name"
            type="text"
            error={nameForm.formState.errors.displayName?.message}
            fullWidth
            {...nameForm.register('displayName')}
          />
          <Button type="submit" variant="primary" size="sm" loading={nameForm.formState.isSubmitting}>
            Save Name
          </Button>
        </form>
      </Card>

      {/* Password (only for email users) */}
      {!isGoogleUser && (
        <Card>
          <h2 className="font-semibold text-gray-100 mb-4 flex items-center gap-2">
            <Lock size={16} className="text-brand-400" /> Change Password
          </h2>
          <form onSubmit={pwForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <Input
              label="Current password" type="password" fullWidth required
              error={pwForm.formState.errors.currentPassword?.message}
              {...pwForm.register('currentPassword')}
            />
            <Input
              label="New password" type="password" fullWidth required
              error={pwForm.formState.errors.newPassword?.message}
              {...pwForm.register('newPassword')}
            />
            <Input
              label="Confirm new password" type="password" fullWidth required
              error={pwForm.formState.errors.confirmPassword?.message}
              {...pwForm.register('confirmPassword')}
            />
            <Button type="submit" variant="primary" size="sm" loading={pwForm.formState.isSubmitting}>
              Change Password
            </Button>
          </form>
        </Card>
      )}

      {isGoogleUser && (
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">Signed in with Google</p>
              <p className="text-xs text-gray-500">Password management is handled by Google.</p>
            </div>
          </div>
        </Card>
      )}

      {/* Danger zone */}
      <Card className="border-red-500/20">
        <h2 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
          <AlertCircle size={16} /> Danger Zone
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setDeleteOpen(true)}>
          Delete Account
        </Button>
      </Card>

      {/* Delete modal */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete account permanently"
        description="All your files, transcripts, and data will be deleted. This cannot be undone."
        size="sm"
      >
        <form onSubmit={deleteForm.handleSubmit(onDeleteSubmit)} className="space-y-4">
          {!isGoogleUser && (
            <Input
              label="Enter your password to confirm"
              type="password"
              fullWidth required
              error={deleteForm.formState.errors.password?.message}
              {...deleteForm.register('password')}
            />
          )}
          <Input
            label='Type "DELETE" to confirm'
            type="text"
            placeholder="DELETE"
            fullWidth required
            error={deleteForm.formState.errors.confirm?.message}
            {...deleteForm.register('confirm')}
          />
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button type="submit" variant="danger" fullWidth loading={deleteForm.formState.isSubmitting}>
              Delete Forever
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
