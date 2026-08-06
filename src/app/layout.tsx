import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";
import { IntroModal } from "@/components/intro-modal";
import { DemoProvider } from "@/store/demo-store";

export const metadata: Metadata = {
  title: "Casino Terravida · CRECIENDO SANO — Demo",
  description: "Demo referencial para la gestión digital de almuerzos escolares de Casino Terravida.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f2e7",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" data-scroll-behavior="smooth">
      <body>
        <a
          href="#contenido-principal"
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-[var(--navy-dark)] px-4 py-3 font-bold text-[var(--paper)] transition-transform focus:translate-y-0"
        >
          Ir al contenido
        </a>
        <DemoProvider>{children}</DemoProvider>
        <IntroModal />
      </body>
    </html>
  );
}
