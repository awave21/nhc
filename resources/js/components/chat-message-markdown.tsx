import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

type ChatMessageMarkdownProps = {
    content: string;
    variant: 'user' | 'agent';
};

/**
 * Renders assistant / user message bodies that may contain Markdown (incl. GFM tables, lists).
 */
export function ChatMessageMarkdown({
    content,
    variant,
}: ChatMessageMarkdownProps) {
    const inlineCodeBg =
        variant === 'user'
            ? 'bg-background/90 text-foreground dark:bg-background/50'
            : 'bg-background/70 text-foreground dark:bg-background/40';

    return (
        <div className="chat-md [&_a]:break-all">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    p: ({ children }) => (
                        <p className="mb-2 break-words whitespace-pre-wrap last:mb-0">
                            {children}
                        </p>
                    ),
                    ul: ({ children }) => (
                        <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">
                            {children}
                        </ul>
                    ),
                    ol: ({ children }) => (
                        <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">
                            {children}
                        </ol>
                    ),
                    li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                    ),
                    strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                        <em className="italic">{children}</em>
                    ),
                    a: ({ href, children }) => (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                        >
                            {children}
                        </a>
                    ),
                    code: ({ className, children, ...props }) => {
                        const isBlock = /language-/.test(className ?? '');

                        if (isBlock) {
                            return (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        }

                        return (
                            <code
                                className={cn(
                                    'rounded px-1 py-px font-mono text-[0.9em]',
                                    inlineCodeBg,
                                )}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    pre: ({ children }) => (
                        <pre className="mb-2 max-w-full overflow-x-auto rounded-lg border border-border/60 bg-black/[0.04] p-3 text-xs leading-relaxed last:mb-0 dark:bg-white/[0.06]">
                            {children}
                        </pre>
                    ),
                    h1: ({ children }) => (
                        <h1 className="mb-2 text-base font-semibold last:mb-0">
                            {children}
                        </h1>
                    ),
                    h2: ({ children }) => (
                        <h2 className="mb-2 text-[0.95rem] font-semibold last:mb-0">
                            {children}
                        </h2>
                    ),
                    h3: ({ children }) => (
                        <h3 className="mb-1.5 text-sm font-semibold last:mb-0">
                            {children}
                        </h3>
                    ),
                    blockquote: ({ children }) => (
                        <blockquote className="mb-2 border-l-2 border-primary/35 pl-3 text-muted-foreground italic last:mb-0">
                            {children}
                        </blockquote>
                    ),
                    hr: () => <hr className="my-3 border-border/60" />,
                    table: ({ children }) => (
                        <div className="mb-2 max-w-full overflow-x-auto last:mb-0">
                            <table className="w-max min-w-full border-collapse text-left text-xs">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => (
                        <thead className="border-b border-border/80">
                            {children}
                        </thead>
                    ),
                    tbody: ({ children }) => <tbody>{children}</tbody>,
                    tr: ({ children }) => (
                        <tr className="border-b border-border/40">
                            {children}
                        </tr>
                    ),
                    th: ({ children }) => (
                        <th className="px-2 py-1.5 font-semibold text-foreground">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-2 py-1.5">{children}</td>
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
