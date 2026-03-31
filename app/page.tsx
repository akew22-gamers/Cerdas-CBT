import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8">
        <h1 className="text-5xl font-bold text-indigo-900 mb-4">
          Cerdas-CBT
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Platform Computer Based Test
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
        >
          Masuk
        </Link>
      </div>
    </div>
  );
}
