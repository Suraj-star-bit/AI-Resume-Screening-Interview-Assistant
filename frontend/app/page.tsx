"use client";

import { useEffect, useState } from "react";

interface Candidate {
  resume_id: number;
  score: number;
  matched_skills: string;
  missing_skills: string;
  status: string;
}

interface DashboardData {
  job_id: number;
  candidates: Candidate[];
}

export default function Home() {
  const [jobId, setJobId] = useState("3");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    if (!jobId) {
      setError("Please enter a Job ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/recruiter/dashboard?job_id=${jobId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recruiter dashboard");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b bg-white px-8 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI Resume Screening
            </h1>
            <p className="text-sm text-gray-500">
              Recruiter Dashboard
            </p>
          </div>

          <div className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white">
            Recruiter
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-8 py-8">
        {/* Job selector */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-xl font-semibold text-gray-900">
            Candidate Screening
          </h2>

          <p className="mb-5 text-sm text-gray-500">
            Enter a Job ID to view ranked candidates.
          </p>

          <div className="flex max-w-md gap-3">
            <input
              type="number"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              placeholder="Enter Job ID"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-900 outline-none focus:border-gray-900"
            />

            <button
              onClick={fetchDashboard}
              disabled={loading}
              className="rounded-lg bg-gray-900 px-5 py-2 font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Screen Candidates"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Dashboard stats */}
        {data && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">Job ID</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  #{data.job_id}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Candidates
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {data.candidates.length}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                  Top Score
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {data.candidates.length > 0
                    ? Math.max(
                        ...data.candidates.map(
                          (candidate) => candidate.score
                        )
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>

            {/* Candidates */}
            <div className="rounded-xl bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Ranked Candidates
                </h2>
              </div>

              {data.candidates.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No candidates found for this job.
                </div>
              ) : (
                <div className="divide-y">
                  {data.candidates.map((candidate) => (
                    <div
                      key={candidate.resume_id}
                      className="p-6"
                    >
                      <div className="flex flex-col justify-between gap-5 md:flex-row">
                        {/* Candidate */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Resume #{candidate.resume_id}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            Status: {candidate.status}
                          </p>
                        </div>

                        {/* Score */}
                        <div className="text-left md:text-right">
                          <p className="text-sm text-gray-500">
                            ATS Score
                          </p>

                          <p className="text-3xl font-bold text-gray-900">
                            {candidate.score}%
                          </p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mt-5 grid gap-5 md:grid-cols-2">
                        <div>
                          <p className="mb-2 text-sm font-semibold text-gray-700">
                            Matched Skills
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {candidate.matched_skills
                              .split(",")
                              .map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                                >
                                  ✓ {skill.trim()}
                                </span>
                              ))}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-sm font-semibold text-gray-700">
                            Missing Skills
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {candidate.missing_skills
                              .split(",")
                              .map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-700"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}