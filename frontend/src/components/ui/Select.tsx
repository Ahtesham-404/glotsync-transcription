import React, { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
  fullWidth?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder,
      fullWidth = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-300 mb-1.5"
          >
            {label}
            {props.required && (
              <span className="text-red-400 ml-1" aria-label="required">*</span>
            )}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={[
              'block w-full rounded-xl border bg-surface-800 text-gray-100',
              'transition-all duration-200 appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500',
              error
                ? 'border-red-500/70 focus:ring-red-500/50 focus:border-red-500'
                : 'border-surface-600 hover:border-surface-500',
              'pl-4 pr-10 py-2.5 text-sm',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className,
            ].join(' ')}
            aria-invalid={Boolean(error)}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>
        {error && (
          <p role="alert" className="mt-1.5 text-xs text-red-400">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
