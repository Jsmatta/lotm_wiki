import { useMemo } from 'preact/hooks';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import HoverLink from '../components/hoverLink.jsx';
import { remarkAutoLinkReferences } from './autoLinkReferences.js';

// Custom components for consistent markdown rendering across the app
const markdownComponents = {
  h1: ({children}) => (
    <h1 className="text-3xl lg:text-4xl font-black uppercase font-mono mt-10 mb-6 text-primary border-b-2 border-base-content/30 pb-2">
      {children}
    </h1>
  ),
  h2: ({children}) => (
    <h2 className="text-2xl lg:text-3xl font-black uppercase font-mono mt-8 mb-4 text-secondary border-b-2 border-base-content/20 pb-2 flex items-center gap-2">
      <span className="text-primary font-mono">//</span>
      {children}
    </h2>
  ),
  h3: ({children}) => (
    <h3 className="text-xl lg:text-2xl font-bold uppercase font-mono mt-6 mb-3 text-accent flex items-center gap-2">
      <span className="text-accent">■</span>
      {children}
    </h3>
  ),
  h4: ({children}) => (
    <h4 className="text-lg lg:text-xl font-bold uppercase font-mono mt-5 mb-2 text-primary">
      {children}
    </h4>
  ),
  h5: ({children}) => <h5 className="text-base font-bold uppercase font-mono mt-4 mb-2 text-secondary">{children}</h5>,
  h6: ({children}) => <h6 className="text-sm font-bold uppercase font-mono mt-3 mb-1 text-accent">{children}</h6>,
  
  ul: ({children}) => <ul className="space-y-2 my-5 list-none">{children}</ul>,
  ol: ({children}) => <ol className="space-y-2 my-5 list-decimal list-inside">{children}</ol>,
  li: ({children}) => (
    <li className="relative pl-3 pb-2 border-l-4 border-accent bg-base-100 p-3 my-2 border-t border-r border-b border-base-content/20 font-sans text-sm sm:text-base leading-relaxed">
      {children}
    </li>
  ),
  
  p: ({children}) => <p className="my-4 leading-relaxed font-sans text-sm sm:text-base text-base-content/90">{children}</p>,
  
  strong: ({children}) => <strong className="text-primary font-bold font-mono uppercase tracking-wide">{children}</strong>,
  em: ({children}) => <em className="text-secondary italic font-serif">{children}</em>,
  
  blockquote: ({children}) => (
    <blockquote className="border-l-4 border-primary bg-base-100 p-4 my-6 border-t border-r border-b border-base-content/20 font-mono text-sm brutal-shadow-xs italic">
      <div className="text-primary font-bold text-xs uppercase mb-1 tracking-widest">[OCCULT INSCRIPTION]</div>
      {children}
    </blockquote>
  ),
  
  code: ({inline, children, ...props}) => {
    if (inline) {
      return (
        <code className="bg-base-100 text-accent px-1.5 py-0.5 border border-base-content/30 font-mono text-xs font-bold" {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-base-100 text-base-content p-4 overflow-x-auto my-6 border-2 border-base-content font-mono text-xs brutal-shadow-xs" {...props}>
        {children}
      </code>
    );
  },
  
  pre: ({children}) => (
    <pre className="bg-base-100 p-4 overflow-x-auto my-6 border-2 border-base-content brutal-shadow-xs">
      {children}
    </pre>
  ),
  
  table: ({children}) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full bg-base-100 border-2 border-base-content font-mono text-xs">
        {children}
      </table>
    </div>
  ),
  
  thead: ({children}) => (
    <thead className="bg-base-300 border-b-2 border-base-content text-base-content uppercase">
      {children}
    </thead>
  ),
  
  th: ({children}) => (
    <th className="px-4 py-3 font-bold text-left border-r-2 border-base-content last:border-r-0 tracking-wider">
      {children}
    </th>
  ),
  
  td: ({children}) => (
    <td className="px-4 py-3 border-b border-r-2 border-base-content/20 last:border-r-0">
      {children}
    </td>
  ),
  
  tr: ({children}) => (
    <tr className="border-b border-base-content/20 last:border-b-0 hover:bg-base-200/50">
      {children}
    </tr>
  ),
  
  a: ({href, children}) => {
    const className = "text-primary hover:text-accent font-bold underline decoration-2 transition-colors duration-150";

    return href?.startsWith("/") ? (
      <HoverLink href={href} className={className}>
        {children}
      </HoverLink>
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
  
  hr: () => <hr className="my-8 border-t-2 border-base-content/30" />,
  
  img: ({src, alt, ...props}) => (
    <img 
      src={src} 
      alt={alt || ''} 
      className="border-2 border-base-content brutal-shadow my-6 max-w-full h-auto object-contain bg-base-100"
      {...props} 
    />
  ),
};

const NO_REFERENCES = [];
const NO_OVERRIDES = {};

/**
 * Reusable Markdown component with consistent styling.
 *
 * Both `components` and `remarkPlugins` are memoized: react-markdown reparses
 * whenever either identity changes, so building them inline would re-run the
 * full markdown pipeline on every render.
 *
 * @param {Object} props
 * @param {string} props.content - Markdown content to render
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.components - Custom components to override defaults
 * @param {Array} props.references - Wiki pages to link when their names appear
 * @param {string} props.currentPath - Route of the page being rendered; its own
 *   name is left unlinked rather than linking back to itself
 */
export function MarkdownRenderer({
  content,
  className = "prose prose-lg max-w-none",
  components = NO_OVERRIDES,
  references = NO_REFERENCES,
  currentPath = null,
}) {
  const mergedComponents = useMemo(
    () => (components === NO_OVERRIDES
      ? markdownComponents
      : { ...markdownComponents, ...components }),
    [components],
  );

  const remarkPlugins = useMemo(
    () => [remarkAutoLinkReferences(references, { currentPath })],
    [references, currentPath],
  );

  return (
    <div className={className}>
      <ReactMarkdown components={mergedComponents} remarkPlugins={remarkPlugins}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
