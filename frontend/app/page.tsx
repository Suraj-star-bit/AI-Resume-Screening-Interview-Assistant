"use client";

import { useRouter } from "next/navigation";

export default function Home() {
const router = useRouter();

return ( <main className="flex min-h-screen flex-col bg-gray-50 text-gray-900"> <header className="border-b border-gray-200 bg-white"> <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5"> <h1 className="text-xl font-bold tracking-tight">
AI Resume Screening </h1>


      <button
        onClick={() => router.push("/login")}
        className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
      >
        Login
      </button>
    </div>
  </header>

  <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-16">
    <div className="max-w-3xl">
      <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-700">
        AI-powered recruitment
      </p>

      <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
        Smarter hiring.
        <span className="block text-gray-500">
          Better opportunities.
        </span>
      </h2>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
        Screen resumes, evaluate candidate skills, conduct AI-assisted
        interviews, and manage hiring decisions in one place.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-semibold">I'm a Candidate</h3>

        <p className="mt-3 leading-7 text-gray-600">
          Explore job opportunities, apply with your resume, and track
          your application status.
        </p>

        <button
          onClick={() => router.push("/login?role=candidate")}
          className="mt-6 w-full rounded-lg border border-gray-300 px-5 py-3 font-semibold hover:bg-gray-50"
        >
          Candidate Login
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-semibold">I'm a Recruiter</h3>

        <p className="mt-3 leading-7 text-gray-600">
          Create job listings, screen applicants, review interview
          results, and manage hiring decisions.
        </p>

        <button
          onClick={() => router.push("/login?role=recruiter")}
          className="mt-6 w-full rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700"
        >
          Recruiter Login
        </button>
      </div>
    </div>
  </section>

  <footer className="border-t border-gray-200 bg-white px-6 py-5 text-center text-sm text-gray-500">
    AI Resume Screening &amp; Interview Assistant
  </footer>
</main>


);
}