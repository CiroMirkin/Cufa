import { useEffect, useRef, useCallback, useMemo } from 'react'
import YooptaEditor, { createYooptaEditor, type YooEditor, type YooptaContentValue } from '@yoopta/editor'
import { markdown } from '@yoopta/exports'
import Paragraph from '@yoopta/paragraph'
import Headings from '@yoopta/headings'
import Lists from '@yoopta/lists'
import Code from '@yoopta/code'
import Blockquote from '@yoopta/blockquote'
import { Bold, Italic, Underline, Strike, CodeMark, Highlight } from '@yoopta/marks'

const plugins = [Paragraph, Headings.HeadingOne, Headings.HeadingTwo, Headings.HeadingThree, Lists.BulletedList, Lists.NumberedList, Lists.TodoList, Code.Code, Blockquote]

const marks = [Bold, Italic, Underline, Strike, CodeMark, Highlight]

interface MarkdownEditorProps {
  content: string
  onChange: (md: string) => void
  placeholder?: string
}

export function MarkdownEditor({ content, onChange, placeholder }: MarkdownEditorProps) {
  const editor: YooEditor = useMemo(() => createYooptaEditor({ plugins, marks }), [])
  const initialized = useRef(false)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const value = markdown.deserialize(editor, content)
    editor.setEditorValue(value)
  }, [editor, content])

  const handleChange = useCallback(
    (value: YooptaContentValue) => {
      const md = markdown.serialize(editor, value)
      onChangeRef.current(md)
    },
    [editor],
  )

  return (
    <YooptaEditor
      editor={editor}
      onChange={handleChange}
      placeholder={placeholder}
    />
  )
}
