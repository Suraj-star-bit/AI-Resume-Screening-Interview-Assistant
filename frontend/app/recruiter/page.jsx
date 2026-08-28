"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RecruiterDashboard() {
    const router = useRouter();

    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [interviews, setInterviews] = useState({});
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [loadingCandidates, setLoadingCandidates] = useState(false);
    const [loadingInterviews, setLoadingInterviews] = useState(false);


    const updateCandidateStatus = async (resumeId, status) => {
    try {
        await api.patch(
            `/candidates/${resumeId}/status?job_id=${selectedJobId}`,
            {
                status: status
            }
        );

        setCandidates((currentCandidates) =>
            currentCandidates.map((candidate) =>
                candidate.resume_id === resumeId
                    ? {
                        ...candidate,
                        status: status
                    }
                    : candidate
            )
        );
    } catch (error) {
        console.log("Failed to update candidate status:", error);
        alert("Failed to update candidate status");
    }
};


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
        setInterviews({});

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

    // Get interview results for candidates
    useEffect(() => {
        if (!selectedJobId || candidates.length === 0) {
            return;
        }

        const fetchInterviewResults = async () => {
            setLoadingInterviews(true);

            const results = {};

            await Promise.all(
                candidates.map(async (candidate) => {
                    try {
                        const response = await api.get(
                            `/interviews/candidate/${candidate.resume_id}/${selectedJobId}/result`
                        );

                        results[candidate.resume_id] = response.data;
                    } catch (error) {
                        // 404 means the candidate has not completed an interview
                        results[candidate.resume_id] = null;
                    }
                })
            );

            setInterviews(results);
            setLoadingInterviews(false);
        };

        fetchInterviewResults();
    }, [candidates, selectedJobId]);

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
                        <div className="overflow-x-auto">

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
                                            Interview Score
                                        </th>

                                        <th className="p-4 text-left font-semibold">
                                            Interview Recommendation
                                        </th>
                                        <th className="p-4 text-left font-semibold">
                                            Final Score
                                        </th>

                                        <th className="p-4 text-left font-semibold">
                                            Final Recommendation
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

                                        <th className="p-4 text-left font-semibold">
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {candidates.map((candidate) => {

                                        const interview =
                                            interviews[candidate.resume_id];

                                        return (
                                            <tr
                                                key={candidate.resume_id}
                                                className="border-t border-gray-200"
                                            >

                                                {/* Candidate */}
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

                                                {/* ATS Score */}
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

                                                {/* Interview Score */}
                                                <td className="p-4">

                                                    {loadingInterviews ? (
                                                        <span className="text-gray-400">
                                                            Loading...
                                                        </span>
                                                    ) : interview ? (
                                                        <span className="font-bold text-gray-900">
                                                            {interview.overall_score}/10
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">
                                                            Not Taken
                                                        </span>
                                                    )}

                                                </td>

                                                {/* Interview Recommendation */}
                                                <td className="p-4">

                                                    {interview ? (
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                                                interview.recommendation === "Strong Candidate"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : interview.recommendation === "Needs Improvement"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {interview.recommendation}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            —
                                                        </span>
                                                    )}

                                                </td>

                                                {/* Final Score */}
                                                <td className="p-4">

                                                    {candidate.final_score !== null ? (
                                                        <span className="font-bold text-gray-900">
                                                            {candidate.final_score}%
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">
                                                            Pending
                                                        </span>
                                                    )}

                                                </td>
                                                
                                                {/* Final Recommendation */}
                                                <td className="p-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                                            candidate.final_recommendation === "Recommended"
                                                                ? "bg-green-100 text-green-800"
                                                                : candidate.final_recommendation === "Review"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : candidate.final_recommendation === "Reject"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-gray-100 text-gray-700"
                                                        }`}
                                                    >
                                                        {candidate.final_recommendation}
                                                    </span>

                                                </td>

                                                {/* Matched Skills */}
                                                <td className="p-4 text-gray-700">
                                                    {candidate.matched_skills || "—"}
                                                </td>

                                                {/* Missing Skills */}
                                                <td className="p-4 text-gray-700">
                                                    {candidate.missing_skills || "—"}
                                                </td>

                                                {/* ATS Status */}
                                                <td className="p-4">

                                                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                                                        {candidate.status}
                                                    </span>

                                                </td>

                                                {/* Action */}
                                                <td className="p-4">

                                                    {interview ? (
                                                        <td className="p-4">
                                                            <div className="flex flex-col gap-2">

                                                                {interview && (
                                                                    <button
                                                                        onClick={() =>
                                                                            router.push(
                                                                                `/recruiter/interviews/${interview.id}`
                                                                            )
                                                                        }
                                                                        className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                                                    >
                                                                        View Interview
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() =>
                                                                        updateCandidateStatus(
                                                                            candidate.resume_id,
                                                                            "Shortlisted"
                                                                        )
                                                                    }
                                                                    disabled={candidate.status === "Shortlisted"}
                                                                    className="whitespace-nowrap rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    Shortlist
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        updateCandidateStatus(
                                                                            candidate.resume_id,
                                                                            "Rejected"
                                                                        )
                                                                    }
                                                                    disabled={candidate.status === "Rejected"}
                                                                    className="whitespace-nowrap rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    Reject
                                                                </button>

                                                            </div>
                                                        </td>
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            —
                                                        </span>
                                                    )}

                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>
            </div>

        </main>
    );
}