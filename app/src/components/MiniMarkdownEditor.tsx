import { useEffect, useMemo, useRef } from 'react'
import YooptaEditor, { createYooptaEditor, useYooptaEditor, Marks, Blocks } from '@yoopta/editor'
import { FloatingToolbar } from '@yoopta/ui/floating-toolbar'
import { SlashCommandMenu } from '@yoopta/ui'
import Paragraph from '@yoopta/paragraph'
import Lists from '@yoopta/lists'
import Link from '@yoopta/link'
import Steps from '@yoopta/steps'
import { Bold, Italic, Strike, Highlight } from '@yoopta/marks'
import { applyTheme } from '@yoopta/themes-shadcn'
import { markdown } from '@yoopta/exports'
import {
  BoldIcon,
  ItalicIcon,
  Strikethrough,
  Highlighter,
  List,
  ListOrdered,
  ListChecks,
} from 'lucide-react'

const PLUGINS = applyTheme([Paragraph, Lists.BulletedList, Lists.NumberedList, Link, Steps])

const MARKS = [Bold, Italic, Strike, Highlight]

const MARK_BUTTONS = [
  { type: 'bold', icon: BoldIcon, title: 'Negrita' },
  { type: 'italic', icon: ItalicIcon, title: 'Italica' },
  { type: 'strike', icon: Strikethrough, title: 'Tachado' },
  { type: 'highlight', icon: Highlighter, title: 'Resaltar' },
]

const BLOCK_BUTTONS = [
  { type: 'BulletedList', icon: List, title: 'Lista' },
  { type: 'NumberedList', icon: ListOrdered, title: 'Lista numerada' },
  { type: 'Steps', icon: ListChecks, title: 'Pasos' },
]

function Toolbar() {
  const editor = useYooptaEditor()
  const currentBlockType = Blocks.getBlock(editor, { at: editor.path.current })?.type

  return (
    <FloatingToolbar>
      <FloatingToolbar.Content>
        <FloatingToolbar.Group>
          {MARK_BUTTONS.map(({ type, icon: Icon, title }) =>
            editor.formats[type] ? (
              <FloatingToolbar.Button
                key={type}
                onClick={() => Marks.toggle(editor, { type })}
                active={Marks.isActive(editor, { type })}
                title={title}
              >
                <Icon size={14} />
              </FloatingToolbar.Button>
            ) : null
          )}
        </FloatingToolbar.Group>
        <FloatingToolbar.Separator />
        <FloatingToolbar.Group>
          {BLOCK_BUTTONS.map(({ type, icon: Icon, title }) => (
            <FloatingToolbar.Button
              key={type}
              onClick={() => Blocks.toggleBlock(editor, type, { preserveContent: true, focus: true })}
              active={currentBlockType === type}
              title={title}
            >
              <Icon size={14} />
            </FloatingToolbar.Button>
          ))}
        </FloatingToolbar.Group>
      </FloatingToolbar.Content>
    </FloatingToolbar>
  )
}

type Props = {
  value?: string
  onChange?: (markdown: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export function MiniMarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Escribe / para abrir el menu',
  autoFocus = true,
  className,
}: Props) {
  const editor = useMemo(() => createYooptaEditor({ plugins: PLUGINS, marks: MARKS }), [])
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    if (!value) return
    const content = markdown.deserialize(editor, value)
    editor.setEditorValue(content)
  }, [editor, value])

  function handleChange() {
    const data = editor.getEditorValue()
    const markdownString = markdown.serialize(editor, data)
    onChange?.(markdownString)
  }

  return (
    <div className="w-full">
      <YooptaEditor
        editor={editor}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={className}
        style={{ width: '100%', paddingBottom: 5, }}
      >
        <Toolbar />
        <SlashCommandMenu />
      </YooptaEditor>
    </div>
  )
}
