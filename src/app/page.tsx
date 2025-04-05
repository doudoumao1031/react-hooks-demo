import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Next.js Hooks Demo</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DemoCard 
          title="useOptimistic" 
          description="Demonstrates optimistic UI updates before server responses"
          href="/demos/useOptimistic"
        />
        <DemoCard 
          title="useTransition" 
          description="Shows how to keep the UI responsive during expensive operations"
          href="/demos/useTransition"
        />
        {/* Add more demo cards here as you create them */}
      </div>
    </div>
  );
}

function DemoCard({ 
  title, 
  description, 
  href 
}: { 
  title: string; 
  description: string; 
  href: string;
}) {
  return (
    <Link 
      href={href}
      className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50 transition-colors"
    >
      <h5 className="mb-2 text-xl font-bold tracking-tight">{title}</h5>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}
