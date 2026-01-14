export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Finance Tracker
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Comprehensive Business Finance Management
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Transaction Management
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Track income and expenses with detailed categorization and client linking
                </p>
              </div>

              <div className="bg-green-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-300 mb-2">
                  Invoice Tracking
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Manage invoices with status tracking, due dates, and PDF generation
                </p>
              </div>

              <div className="bg-purple-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-300 mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Visualize your finances with charts, trends, and actionable insights
                </p>
              </div>

              <div className="bg-orange-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-300 mb-2">
                  Google Sheets Integration
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Your data syncs directly with Google Sheets for easy access and backup
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>Setup Required:</strong> You need to configure Google Cloud Project and Sheets API before using this application.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/dashboard"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </a>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Authentication will be enabled in the next phase
              </p>
            </div>
          </div>

          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            <p className="text-sm">
              Phase 1 Complete: Project Structure & Base Setup
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
