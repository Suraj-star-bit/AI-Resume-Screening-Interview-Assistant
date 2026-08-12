"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RecruiterDashboard() {
    const router = useRouter();

    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingCandidates, setLoadingCandidates] = useState(false);

    // Get recruiter's jobs
    useEffect(() => {
        api.get("/job-descriptions/")
            .then((response) => {
                const jobList = response.data;

                setJobs(jobList);

                // Select newest job automatically
                if (jobList.length > 0) {
                    setSelectedJobId(String(jobList[0].id));
                }
            })
            .catch((error) => {
                console.log("Failed to fetch jobs:", error);
            })
            .finally(() => {
                setLoadingJobs(false);
            });
    }, []);

    // Get candidates whenever selected job changes
    useEffect(() => {
        if (!selectedJobId) {
            return;
        }

        setLoadingCandidates(true);

        api.get(
            `/recruiter/dashboard?job_id=${selectedJobId}`
        )
            .then((response) => {
                setCandidates(response.data.candidates);
            })
            .catch((error) => {
                console.log("Failed to fetch candidates:", error);
                setCandidates([]);
            })
            .finally(() => {
                setLoadingCandidates(false);
            });
    }, [selectedJobId]);

    return (
        <main className="min-h-screen bg-gray-100 p-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Recruiter Dashboard
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage jobs and review candidates
                    </p>
                </div>

                <button
                    onClick={() => router.push("/create-job")}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                    + Create Job
                </button>
            </div>

            {/* Job Selector */}
            <div className="mt-8 rounded-xl bg-white p-6 shadow">

                <label className="mb-2 block font-semibold text-gray-900">
                    Select Job
                </label>

                {loadingJobs ? (
                    <p className="text-gray-500">
                        Loading jobs...
                    </p>
                ) : jobs.length === 0 ? (
                    <p className="text-gray-500">
                        No jobs found. Create a job first.
                    </p>
                ) : (
                    <select
                        value={selectedJobId}
                        onChange={(event) =>
                            setSelectedJobId(event.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600"
                    >
                        {jobs.map((job) => (
                            <option
                                key={job.id}
                                value={job.id}
                            >
                                Job #{job.id} — {job.title}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Candidate Section */}
            <div className="mt-8">

                <h2 className="text-xl font-bold text-gray-900">
                    Ranked Candidates
                </h2>

                {selectedJobId && (
                    <p className="mt-1 text-gray-600">
                        Candidates for Job #{selectedJobId}
                    </p>
                )}

                <div className="mt-4 overflow-hidden rounded-xl bg-white shadow">

                    {loadingCandidates ? (
                        <div className="p-8 text-center text-gray-500">
                            Loading candidates...
                        </div>
                    ) : candidates.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            No candidates found for this job.
                        </div>
                    ) : (
                        <table className="w-full text-gray-900">

                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-4 text-left font-semibold">
                                        Candidate
                                    </th>

                                    <th className="p-4 text-left font-semibold">
                                        ATS Score
                                    </th>

                                    <th className="p-4 text-left font-semibold">
                                        Matched Skills
                                    </th>

                                    <th className="p-4 text-left font-semibold">
                                        Missing Skills
                                    </th>

                                    <th className="p-4 text-left font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {candidates.map((candidate) => (
                                    <tr
                                        key={candidate.resume_id}
                                        className="border-t border-gray-200"
                                    >
                                        <td className="p-4 font-medium">
                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `/candidates/${candidate.resume_id}?job_id=${selectedJobId}`
                                                    )
                                                }
                                                className="text-blue-600 hover:underline"
                                            >
                                                Resume #{candidate.resume_id}
                                            </button>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-3">

                                                <div className="h-3 w-32 overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className="h-full rounded-full bg-blue-600"
                                                        style={{
                                                            width: `${candidate.score}%`
                                                        }}
                                                    />
                                                </div>

                                                <span className="font-bold">
                                                    {candidate.score}%
                                                </span>

                                            </div>
                                        </td>

                                        <td className="p-4 text-gray-700">
                                            {candidate.matched_skills}
                                        </td>

                                        <td className="p-4 text-gray-700">
                                            {candidate.missing_skills}
                                        </td>

                                        <td className="p-4">
                                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                                                {candidate.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    )}

                </div>
            </div>

        </main>
    );
}