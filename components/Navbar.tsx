import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-teal">
              QuestionAndAnswerHQ
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/questions"
              className="text-gray-700 hover:text-teal transition-colors"
            >
              Browse Questions
            </Link>
            <Link
              href="/admin"
              className="text-gray-500 hover:text-teal transition-colors text-sm"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

