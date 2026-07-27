import { useEffect, useMemo, useRef, useState } from 'react'
import YooptaEditor, {
  createYooptaEditor,
  useYooptaEditor,
  Blocks,
  Marks,
} from '@yoopta/editor'
import {
  FloatingToolbar,
  FloatingBlockActions,
  BlockOptions,
  ActionMenuList,
  SlashCommandMenu,
} from '@yoopta/ui'
import { ChevronDown } from 'lucide-react'
import Paragraph from '@yoopta/paragraph'
import Headings from '@yoopta/headings'
import Blockquote from '@yoopta/blockquote'
import Lists from '@yoopta/lists'
import { Bold, Italic, Underline, Strike, CodeMark, Highlight } from '@yoopta/marks'
import { applyTheme } from '@yoopta/themes-shadcn'
import { markdown } from '@yoopta/exports'

const PLUGINS = applyTheme([
  Paragraph,
  Headings.HeadingOne,
  Headings.HeadingTwo,
  Headings.HeadingThree,
  Blockquote,
  Lists.BulletedList,
  Lists.NumberedList,
  Lists.TodoList,
])

const MARKS = [Bold, Italic, Underline, Strike, CodeMark, Highlight]

function Toolbar() {
  const editor = useYooptaEditor()
  const [turnIntoOpen, setTurnIntoOpen] = useState(false)
  const turnIntoRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <FloatingToolbar frozen={turnIntoOpen}>
        <FloatingToolbar.Content>
          <FloatingToolbar.Group>
            <FloatingToolbar.Button
              ref={turnIntoRef}
              onClick={() => setTurnIntoOpen(true)}
            >
              Convertir en
              <ChevronDown size={14} />
            </FloatingToolbar.Button>
          </FloatingToolbar.Group>
          <FloatingToolbar.Group>
            <FloatingToolbar.Button
              onClick={() => Marks.toggle(editor, { type: 'bold' })}
              active={Marks.isActive(editor, { type: 'bold' })}
            >
              B
            </FloatingToolbar.Button>
            <FloatingToolbar.Button
              onClick={() => Marks.toggle(editor, { type: 'italic' })}
              active={Marks.isActive(editor, { type: 'italic' })}
            >
              I
            </FloatingToolbar.Button>
            <FloatingToolbar.Button
              onClick={() => Marks.toggle(editor, { type: 'underline' })}
              active={Marks.isActive(editor, { type: 'underline' })}
            >
              U
            </FloatingToolbar.Button>
            <FloatingToolbar.Button
              onClick={() => Marks.toggle(editor, { type: 'strike' })}
              active={Marks.isActive(editor, { type: 'strike' })}
            >
              S
            </FloatingToolbar.Button>
            <FloatingToolbar.Button
              onClick={() => Marks.toggle(editor, { type: 'code' })}
              active={Marks.isActive(editor, { type: 'code' })}
            >
              {'</>'}
            </FloatingToolbar.Button>
          </FloatingToolbar.Group>
        </FloatingToolbar.Content>
      </FloatingToolbar>

      <ActionMenuList
        open={turnIntoOpen}
        onOpenChange={setTurnIntoOpen}
        anchor={turnIntoRef.current}
        view="small"
      >
        <ActionMenuList.Content />
      </ActionMenuList>
    </>
  )
}

function BlockActions() {
  const editor = useYooptaEditor()
  const [blockOptionsOpen, setBlockOptionsOpen] = useState(false)
  const [actionMenuOpen, setActionMenuOpen] = useState(false)
  const dragHandleRef = useRef<HTMLButtonElement>(null)
  const turnIntoRef = useRef<HTMLButtonElement>(null)
  const currentBlockId = useRef<string | null>(null)

  const onActionMenuClose = (open: boolean) => {
    setActionMenuOpen(open)
    if (!open) setBlockOptionsOpen(false)
  }

  return (
    <FloatingBlockActions frozen={blockOptionsOpen}>
      {({ blockId }: { blockId: string }) => {
        currentBlockId.current = blockId
        return (
          <>
            <FloatingBlockActions.Button
              onClick={() => {
                if (!blockId) return
                const block = Blocks.getBlock(editor, { id: blockId })
                if (block) {
                  editor.insertBlock('Paragraph', { at: block.meta.order + 1, focus: true })
                }
              }}
            >
              +
            </FloatingBlockActions.Button>
            <FloatingBlockActions.Button
              ref={dragHandleRef}
              onClick={() => setBlockOptionsOpen(true)}
            >
              ⋮⋮
            </FloatingBlockActions.Button>

            <BlockOptions
              open={blockOptionsOpen}
              onOpenChange={setBlockOptionsOpen}
              anchor={dragHandleRef.current}
            >
              <BlockOptions.Content>
                <BlockOptions.Item
                  ref={turnIntoRef}
                  onSelect={() => setActionMenuOpen(true)}
                  keepOpen
                >
                  Convertir en
                </BlockOptions.Item>
                <BlockOptions.Item
                  onClick={() => {
                    if (blockId) Blocks.duplicateBlock(editor, { blockId })
                    setBlockOptionsOpen(false)
                  }}
                >
                  Duplicar
                </BlockOptions.Item>
                <BlockOptions.Item
                  onClick={() => {
                    if (blockId) Blocks.deleteBlock(editor, { blockId })
                    setBlockOptionsOpen(false)
                  }}
                >
                  Eliminar
                </BlockOptions.Item>
              </BlockOptions.Content>
            </BlockOptions>

            <ActionMenuList
              open={actionMenuOpen}
              onOpenChange={onActionMenuClose}
              anchor={turnIntoRef.current}
              blockId={blockId}
              view="small"
              placement="right-start"
            >
              <ActionMenuList.Content />
            </ActionMenuList>
          </>
        )
      }}
    </FloatingBlockActions>
  )
}

type MarkdownEditorProps = {
  value?: string
  onChange?: (markdown: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

export function MarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Escribe / para abrir el menu',
  autoFocus = true,
  className,
}: MarkdownEditorProps) {
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
    <div className="w-full p-4 shadow-lg">
      <YooptaEditor
        editor={editor}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={className}
        style={{ width: '100%', paddingBottom: 150 }}
      >
        <Toolbar />
        <BlockActions />
        <SlashCommandMenu />
      </YooptaEditor>
    </div>
  )
}
