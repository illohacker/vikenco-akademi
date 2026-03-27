import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vikenco Akademi',
  description: 'Training platform for Vikenco employees',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
