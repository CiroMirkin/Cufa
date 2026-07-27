import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

const inlineComponents: Components = {
  h1: ({ children }) => <span className="font-semibold">{children}</span>,
  h2: ({ children }) => <span className="font-semibold">{children}</span>,
  h3: ({ children }) => <span className="font-semibold">{children}</span>,
  p: ({ children }) => <>{children}</>,
  strong: ({ children }) => <span className="font-semibold">{children}</span>,
  em: ({ children }) => <span className="italic">{children}</span>,
  del: ({ children }) => <span className="line-through">{children}</span>,
  code: ({ children }) => (
    <code className="px-1 rounded bg-gray-100 text-[0.85em]">{children}</code>
  ),
  ul: ({ children }) => <>{children}</>,
  ol: ({ children }) => <>{children}</>,
  li: ({ children }) => <span>{children} </span>,
  blockquote: ({ children }) => <span className="italic">{children}</span>,
  a: ({ children }) => <span className="underline">{children}</span>,
  br: () => <> </>,
}

type MarkdownPreviewProps = {
  content: string
  maxLength?: number
  className?: string
}

export function MarkdownPreview({ content, maxLength = 120, className }: MarkdownPreviewProps) {
  const truncated =
    content.length > maxLength ? `${content.slice(0, maxLength)}...` : content

  return (
    <div className={`truncate ${className ?? ''}`}>
      <ReactMarkdown components={inlineComponents}>{truncated}</ReactMarkdown>
    </div>
  )
}
