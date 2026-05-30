import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-6 gap-4">
      <h1 className="text-xl font-bold">My Dashboard</h1>
      <nav className="flex flex-col gap-2">
        <Link href="/" className="hover:bg-gray-700 px-3 py-2 rounded">Home</Link>
        <Link href="/case" className="hover:bg-gray-700 px-3 py-2 rounded">
          Job List
        </Link>
        <Link href="/reporter" className="hover:bg-gray-700 px-3 py-2 rounded">Reporter</Link>
        <Link href="/editor" className="hover:bg-gray-700 px-3 py-2 rounded">Editor</Link>
        <Link href="/assigned-case" className="hover:bg-gray-700 px-3 py-2 rounded">Assigned Case</Link>
      </nav>
    </aside>
  );
}