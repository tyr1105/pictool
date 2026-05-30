'use client';

interface ToolPageProps {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
}

export default function ToolPage({ title, description, icon, children }: ToolPageProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{icon}</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 ml-12">{description}</p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
