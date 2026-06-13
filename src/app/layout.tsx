import './globals.css'
import type { Metadata } from 'next'
import { Lexend_Deca } from 'next/font/google'
import { ReactNode } from "react";
import metadatalogo from "@/assets/nekotech-metadatalogo.png";
import { url } from 'inspector';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend-deca',
})

export const metadata: Metadata = {
  title: 'Home - NekoTech Foundation',
  description: 'NekoTech Foundation - simply advanced your technology',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://neko.tech',
    siteName: 'Home - NekoTech Foundation',
    images: [
      {
        url: metadatalogo.src,
        width: 256,
        height: 256,
        alt: 'NekoTech Foundation',
      }
    ],
  },
}

import SmoothScroll from '@/components/utils/SmoothScroll';

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={lexendDeca.variable}>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
