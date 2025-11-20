import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              QuestionAndAnswerHQ
            </h3>
            <p className="text-sm">
              Research-backed answers to your questions, updated daily.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/questions" className="hover:text-teal transition-colors">
                  All Questions
                </Link>
              </li>
              <li>
                <Link href="/category/general_health" className="hover:text-teal transition-colors">
                  Health
                </Link>
              </li>
              <li>
                <Link href="/category/nutrition" className="hover:text-teal transition-colors">
                  Nutrition
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <p className="text-sm">
              We provide evidence-based answers to help you make informed
              decisions.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} QuestionAndAnswerHQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

