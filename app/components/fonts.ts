import { Geist_Mono as GeistMonoFont, Geist } from "next/font/google";

export const Geist_Sans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });
  
  export const Geist_Mono = GeistMonoFont({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });