import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { remarkAutoLinkReferences } from './autoLinkReferences.js';

// Custom components for consistent markdown rendering across the app
const markdownComponents = {
  h1: ({children}) => <h1 className="text-4xl lg:text-5xl font-bold mt-12 mb-8 text-primary border-b-2 border-base-300 pb-2">{children}</h1>,
  h2: ({children}) => <h2 className="text-3xl lg:text-4xl font-bold mt-10 mb-6 text-secondary border-b-2 border-base-300 pb-2">{children}</h2>,
  h3: ({children}) => <h3 className="text-2xl lg:text-3xl font-bold mt-8 mb-5 text-accent border-b-2 border-base-300 pb-2">{children}</h3>,
  h4: ({children}) => <h4 className="text-xl lg:text-2xl font-bold mt-6 mb-4 text-primary border-b-2 border-base-300 pb-2">{children}</h4>,
  h5: ({children}) => <h5 className="text-lg lg:text-xl font-bold mt-4 mb-3 text-secondary">{children}</h5>,
  h6: ({children}) => <h6 className="text-base lg:text-lg font-bold mt-3 mb-2 text-accent">{children}</h6>,
  
  ul: ({children}) => <ul className="space-y-2 my-6">{children}</ul>,
  ol: ({children}) => <ol className="space-y-2 my-6">{children}</ol>,
  li: ({children}) => (
    <li className="relative pl-2 pb-2 border-l-4 border-accent/30 hover:border-accent/60 transition-colors duration-200 bg-base-100/50 rounded-r p-3 -ml-2">
      {children}
    </li>
  ),
  
  p: ({children}) => <p className="my-4 leading-relaxed">{children}</p>,
  
  strong: ({children}) => <strong className="text-primary font-bold">{children}</strong>,
  em: ({children}) => <em className="text-secondary italic">{children}</em>,
  
  blockquote: ({children}) => (
    <blockquote className="border-l-4 border-primary bg-base-100/50 pl-6 py-4 my-6 rounded-r-lg italic">
      {children}
    </blockquote>
  ),
  
  code: ({inline, children, ...props}) => {
    if (inline) {
      return (
        <code className="bg-base-200 text-accent px-2 py-1 rounded text-sm font-medium" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-base-200 text-base-content p-4 rounded-lg overflow-x-auto my-6 border-l-4 border-accent font-mono text-sm" {...props}>
        {children}
      </code>
    );
  },
  
  pre: ({children}) => (
    <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto my-6 border-l-4 border-accent">
      {children}
    </pre>
  ),
  
  table: ({children}) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full bg-base-100/50 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),
  
  thead: ({children}) => (
    <thead className="bg-primary/10">
      {children}
    </thead>
  ),
  
  th: ({children}) => (
    <th className="px-6 py-4 font-semibold text-left">
      {children}
    </th>
  ),
  
  td: ({children}) => (
    <td className="px-6 py-4 border-b border-base-200">
      {children}
    </td>
  ),
  
  tr: ({children}) => (
    <tr className="border-b border-base-200 last:border-b-0">
      {children}
    </tr>
  ),
  
  a: ({href, children}) => {
    const className = "text-primary hover:text-primary-focus underline transition-colors duration-200";

    return href?.startsWith("/") ? (
      <Link to={href} className={className}>
        {children}
      </Link>
    ) : (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  },
  
  hr: () => <hr className="my-8 border-t-2 border-base-300" />,
  
  img: ({src, alt, ...props}) => (
    <img 
      src={src} 
      alt={alt || ''} 
      className="rounded-lg shadow-md my-6 max-w-full h-auto object-contain"
      {...props} 
    />
  ),
};

/**
 * Reusable Markdown component with consistent styling
 * @param {Object} props
 * @param {string} props.content - Markdown content to render
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.components - Custom components to override defaults
 * @param {Array} props.references - Wiki pages to link when their names appear
 */
export function MarkdownRenderer({
  content,
  className = "prose prose-lg max-w-none",
  components = {},
  references = [],
}) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{ ...markdownComponents, ...components }}
        remarkPlugins={[remarkAutoLinkReferences(references)]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Compact version for cards and smaller spaces
 */
export function CompactMarkdown({ content, className = "prose prose-sm max-w-none" }) {
  return (
    <MarkdownRenderer 
      content={content} 
      className={className}
      components={{
        h1: ({children}) => <h1 className="text-xl font-bold mt-4 mb-2 text-primary">{children}</h1>,
        h2: ({children}) => <h2 className="text-lg font-semibold mt-3 mb-2 text-secondary">{children}</h2>,
        h3: ({children}) => <h3 className="text-base font-medium mt-2 mb-1 text-accent">{children}</h3>,
      }}
    />
  );
}

export default MarkdownRenderer;
