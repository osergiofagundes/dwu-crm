import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="shadow-md bg-sky-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">
              DWU - CRM
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-2">
            <Link
              href="/"
              className="text-white hover:bg-sky-700 px-3 py-2 rounded-md font-medium transition-colors"
            >
              Início
            </Link>
            <Link
              href="/clientes"
              className="text-white hover:bg-sky-700 px-3 py-2 rounded-md font-medium transition-colors"
            >
              Clientes
            </Link>
            <Link
              href="/oportunidades"
              className="text-white hover:bg-sky-700 px-3 py-2 rounded-md font-medium transition-colors"
            >
              Oportunidades
            </Link>
            <Link
              href="/kanban"
              className="text-white hover:bg-sky-700 px-3 py-2 rounded-md font-medium transition-colors"
            >
              Kanban
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
