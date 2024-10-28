import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:underline">
              首頁
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className="hover:underline">
              我的印章
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}