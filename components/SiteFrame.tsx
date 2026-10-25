import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export type Door = 1 | 2;

// Every page except the homepage, which draws its own masthead and footer.
// The door decides the light: green behind door 1, pink behind door 2.
export function SiteFrame({ door, children }: { door: Door; children: React.ReactNode }) {
  return (
    <div className={`door-${door} flex min-h-screen flex-col`}>
      <Header door={door} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
