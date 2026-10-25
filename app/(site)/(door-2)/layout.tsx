import { SiteFrame } from "@/components/SiteFrame";

// Behind door 2: /system and /templates.
export default function DoorTwoLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteFrame door={2}>{children}</SiteFrame>;
}
