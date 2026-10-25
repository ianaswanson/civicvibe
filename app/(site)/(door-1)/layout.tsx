import { SiteFrame } from "@/components/SiteFrame";

// Behind door 1: /start and /story.
export default function DoorOneLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteFrame door={1}>{children}</SiteFrame>;
}
