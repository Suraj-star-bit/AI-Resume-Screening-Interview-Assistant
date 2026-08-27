"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function CandidateDetails() {

    const router = useRouter();

    const params = useParams();
    const searchParams = useSearchParams();

    const resumeId = params.resumeId;
    const jobId = searchParams.get("job_id");

    const [candidate, setCandidate] = useState(null);
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingInterview, setLoadingInterview] = useState(true);
    const [error, setError] = useState("");

    const [updatingStatus, setUpdatingStatus] = useState(false);

const updateStatus = async (status) => {
    try {
        setUpdatingStatus(true);

        await api.patch(
            `/candidates/${resumeId}/status?job_id=${jobId}`,
            {
                status: status
            }
        );

        setCandidate((previous) => ({
            ...previous,
            status: status
        }));

    } catch (error) {
        console.log("Failed to update status:", error);
        alert("Failed to update candidate status");
    } finally {
        setUpdatingStatus(false);
    }
};

    useEffect(() => {
    if (!resumeId || !jobId) {
        return;
    }

    api.get(`/candidates/${resumeId}?job_id=${jobId}`)
        .then((response) => {
            setCandidate(response.data);
        })
        .catch((error) => {
            console.log(error);
            setError("Failed to load candidate");
        })
        .finally(() => {
            setLoading(false);
        });

    api.get(`/interviews/candidate/${resumeId}/${jobId}/result`)
        .then((response) => {
            setInterview(response.data);
        })
        .catch((error) => {
            console.log("No completed interview found:", error);
            setInterview(null);
        })
        .finally(() => {
            setLoadingInterview(false);
        });

}, [resumeId, jobId]);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-100 p-8">
                <p className="text-gray-600">
                    Loading candidate...
                </p>
            </main>
        );
    }

    if (error || !candidate) {
        return (
            <main className="min-h-screen bg-gray-100 p-8">
                <p className="text-red-600">
                    {error || "Candidate not found"}
                </p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-8">

            <h1 className="text-3xl font-bold text-gray-900">
                Candidate Details
            </h1>

            <div className="mt-8 max-w-4xl rounded-xl bg-white p-8 shadow">

                <h2 className="text-2xl font-bold text-gray-900">
                    {candidate.email || "Candidate"}
                </h2>

                <p className="mt-1 text-gray-500">
                    {candidate.filename}
                </p>

                <div className="mt-8">
                    <h3 className="font-semibold text-gray-900">
                        ATS Score
                    </h3>

                    <p className="mt-2 text-4xl font-bold text-blue-600">
                        {candidate.score}%
                    </p>
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-gray-900">
                        Matched Skills
                    </h3>

                    <p className="mt-2 text-gray-700">
                        {candidate.matched_skills}
                    </p>
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-gray-900">
                        Missing Skills
                    </h3>

                    <p className="mt-2 text-gray-700">
                        {candidate.missing_skills}
                    </p>
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-gray-900">
                        Status
                    </h3>

                    <span className="mt-2 inline-block rounded-full bg-yellow-100 px-4 py-2 font-semibold text-yellow-800">
                        {candidate.status}
                    </span>
                </div>

                <div className="mt-8">
                    <h3 className="font-semibold text-gray-900">
                        Actions
                    </h3>

                    <div className="mt-4 flex gap-3">

                        <button
                            onClick={() => updateStatus("Shortlisted")}
                            disabled={updatingStatus}
                            className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
                        >
                            Shortlist
                        </button>

                        <button
                            onClick={() => updateStatus("Rejected")}
                            disabled={updatingStatus}
                            className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                        >
                            Reject
                        </button>

                        <button
                            onClick={async () => {
                                try {
                                    const response = await api.post("/interviews/", {
                                        resume_id: Number(resumeId),
                                        job_id: Number(jobId),
                                    });

                                    router.push(`/interviews/${response.data.id}`);

                                } catch (error) {
                                    console.log("Failed to create interview:", error);
                                    alert("Failed to create interview");
                                }
                            }}
                            disabled={updatingStatus}
                            className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
                        >
                            Move to Interview
                        </button>

                    </div>
                </div>

                {!loadingInterview && interview && (
                    <div className="mt-8">

                        <h3 className="font-semibold text-gray-900">
                            Interview Result
                        </h3>

                        <div className="mt-4 rounded-xl bg-gray-50 p-6">

                            <div className="grid gap-4 sm:grid-cols-3">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Status
                                    </p>

                                    <p className="mt-1 font-bold text-green-600">
                                        {interview.status}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Overall Score
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-blue-600">
                                        {interview.overall_score}/10
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Recommendation
                                    </p>

                                    <p className="mt-1 font-bold text-orange-600">
                                        {interview.recommendation}
                                    </p>
                                </div>

                            </div>

                            <div className="mt-6">

                                <h4 className="font-semibold text-gray-900">
                                    Question Scores
                                </h4>

                                <div className="mt-4 space-y-4">

                                    {interview.questions.map((question, index) => (
                                        <div
                                            key={question.id}
                                            className="rounded-lg bg-white p-4 shadow-sm"
                                        >

                                            <p className="font-semibold text-gray-900">
                                                Question {index + 1}
                                            </p>

                                            <p className="mt-1 text-gray-700">
                                                {question.question}
                                            </p>

                                            <p className="mt-2 font-semibold text-blue-600">
                                                Score: {question.score}/10
                                            </p>

                                            <p className="mt-2 text-sm text-gray-600">
                                                {question.feedback}
                                            </p>

                                        </div>
                                    ))}

                                </div>

                            </div>

                            <button
                                onClick={() =>
                                    router.push(`/recruiter/interviews/${interview.id}`)
                                }
                                className="mt-6 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
                            >
                                View Full Interview
                            </button>

                        </div>

                    </div>
                )}

                <div className="mt-8">
                    <a
                        href={`http://127.0.0.1:8000/uploads/${candidate.filename}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        View Resume
                    </a>
                </div>

            </div>
        </main>
    );
}