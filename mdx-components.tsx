import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Apply prose styling wrapper to MDX content
    wrapper: ({ children }) => <div className="prose">{children}</div>,
    ...components,
  };
}
