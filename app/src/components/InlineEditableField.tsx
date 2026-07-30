import { useState } from 'react'

interface InlineEditableTextProps {
  value: string
  onSave: (value: string) => void
  type?: 'text' | 'number' | 'date' | 'url'
  placeholder?: string
  className?: string
}

export function InlineEditableText({ value, onSave, type = 'text', placeholder, className }: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  function startEditing(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDraft(value)
    setIsEditing(true)
  }

  function commit() {
    setIsEditing(false)
    if (draft !== value) onSave(draft)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') e.currentTarget.blur()
    if (e.key === 'Escape') {
      setDraft(value)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <input
        type={type}
        value={draft}
        autoFocus
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        onFocus={(e) => e.currentTarget.select()}
        className={className ?? "px-1 -mx-1 border rounded outline-none"}
      />
    )
  }

  return (
    <span onClick={startEditing} className={className ?? "cursor-text hover:bg-gray-100 px-1 -mx-1 rounded"}>
      {value || placeholder}
    </span>
  )
}

interface InlineEditableSelectProps {
  value: string
  options: readonly { value: string, label: string }[]
  onSave: (value: string) => void
  className?: string
}

export function InlineEditableSelect({ value, options, onSave, className }: InlineEditableSelectProps) {
  const [isEditing, setIsEditing] = useState(false)
  const currentLabel = options.find((o) => o.value === value)?.label ?? value

  function startEditing(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(true)
  }

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setIsEditing(false)
    if (e.target.value !== value) onSave(e.target.value)
  }

  if (isEditing) {
    return (
      <select
        value={value}
        autoFocus
        onChange={handleChange}
        onBlur={() => setIsEditing(false)}
        className={className ?? "px-1 -mx-1 border rounded outline-none"}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    )
  }

  return (
    <span onClick={startEditing} className={className ?? "cursor-text hover:bg-gray-100 px-1 -mx-1 rounded"}>
      {currentLabel}
    </span>
  )
}
