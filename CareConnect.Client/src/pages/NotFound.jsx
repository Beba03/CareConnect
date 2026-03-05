export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-10 text-center">
        <div className="text-4xl mb-4">🩺</div>

        <h1 className="text-7xl font-bold text-blue-600">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-blue-900">
          Page Not Found
        </h2>

        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
          We couldn’t locate the page you were looking for. It may have been
          moved, removed, or is temporarily unavailable.
        </p>

        <a
          href="/"
          className="inline-block mt-8 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
