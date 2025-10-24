import 'bootstrap/dist/css/bootstrap.min.css'
import './globals.css'

export const metadata = {
  title: 'Minesweeper - Next.js',
  description: 'A modern Minesweeper game built with Next.js and React',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-bs-theme="dark">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      <body className="bg-dark text-light">
        {children}
      </body>
    </html>
  )
}