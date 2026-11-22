import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FrancEye AI — Şube Sağlık Yönetimi',
  description: 'Yapay Zeka Destekli Şube Sağlık ve İtibar Takibi',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
