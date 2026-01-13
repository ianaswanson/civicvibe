export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: string;
  url: string;
  github?: string;
  tags: string[];
}

export const tools: Tool[] = [
  {
    slug: "quick-fill",
    title: "Quick Fill",
    description:
      "Chrome extension that automatically fills form fields with realistic test data. Zero configuration - just click to populate all visible form fields for quick manual testing.",
    category: "Testing",
    url: "https://github.com/ianaswanson/quick-fill",
    github: "https://github.com/ianaswanson/quick-fill",
    tags: ["chrome extension", "testing", "forms", "developer tools"],
  },
];

export function getTools(): Tool[] {
  return tools;
}

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
