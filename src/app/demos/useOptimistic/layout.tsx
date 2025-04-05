export default function UseOptimisticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">useOptimistic Hook Demo</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {children}
      </div>
      <div className="mt-6">
        <a 
          href="/" 
          className="inline-block px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
}
