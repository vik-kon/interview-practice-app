import InterviewPractice from '@/components/InterviewPractice';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className = "text-center mb-8">
        <h1 className="text-5xl font-bold text-blue-900 mb-3">Interview Practice</h1>
        <p className="text-slate-600 text-lg">
          Practice behavioral interview questions!
        </p>
        </div>
        <InterviewPractice />
      </div>
    </main>
  );
}