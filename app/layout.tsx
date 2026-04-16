import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"], 
  variable: "--font-space-grotesk" 
});

export const metadata: Metadata = {
  title: "FRUOR | Software Architect & Developer",
  description: "Scalable Software Architecture & Custom Enterprise Solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Tailwind CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
        {/* Custom Tailwind Configuration injected via CDN */}
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    sans: ["var(--font-inter)", "sans-serif"],
                    display: ["var(--font-space-grotesk)", "sans-serif"],
                  },
                  colors: {
                    fruor: {
                      dark: "#1A1A1A",
                      copper: "#D97757",
                      light: "#F9F9F9",
                    },
                  },
                  animation: {
                    spotlight: "spotlight 2s ease .75s 1 forwards",
                  },
                  keyframes: {
                    spotlight: {
                      "0%": {
                        opacity: "0",
                        transform: "translate(-72%, -62%) scale(0.5)",
                      },
                      "100%": {
                        opacity: "1",
                        transform: "translate(-50%,-40%) scale(1)",
                      },
                    },
                  },
                }
              }
            }
          `
        }} />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-[#FAFAFA]`}>
        {children}
      </body>
    </html>
  );
}