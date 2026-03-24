import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">Page Not Found</h2>
          <p className="text-slate-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors"
          >
            Go Home
          </Link>
          
          <div className="text-sm text-slate-500">
            <Link href="/latest" className="text-rose-600 hover:text-rose-700">
              Latest Transfers
            </Link>
            {' • '}
            <Link href="/search" className="text-rose-600 hover:text-rose-700">
              Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
