"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RecruiterInterviewAnalysis() {
    const params = useParams();
    const router = useRouter();

    const interviewId = params.interviewId;

    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!interviewId) {
            return;
        }

        api.get(`/interviews/${interviewId}/result`)
            .then((response) => {
                setInterview(response.data);
            })
            .catch((error) => {
                console.log(
                    "Failed to load interview result:",
                    error
                );

                setError("Failed to load interview analysis");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [interviewId]);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-100 p-8">
                <p className="text-gray-600">
                    Loading interview analysis...
                </p>
            </main>
        );
    }

    if (error || !interview) {
        return (
            <main className="min-h-screen bg-gray-100 p-8">
                <p className="text-red-600">
                    {error || "Interview not found"}
                </p>
            </main>
        );
    }

    const questions = interview.questions || [];

    return (
        <main className="min-h-screen bg-gray-100 p-8">

            {/* Header */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Interview Analysis
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Recruiter view of candidate interview
                    </p>
                </div>

                <button
                    onClick={() => router.back()}
                    className="rounded-lg bg-gray-700 px-5 py-3 font-semibold text-white hover:bg-gray-800"
                >
                    Back
                </button>

            </div>

            {/* Interview Summary */}
            <div className="mt-8 grid gap-6 md:grid-cols-3">

                {/* Status */}
                <div className="rounded-xl bg-white p-6 shadow">

                    <p className="text-sm font-semibold text-gray-500">
                        Interview Status
                    </p>

                    <p className="mt-2 text-xl font-bold text-green-600">
                        {interview.status}
                    </p>

                </div>

                {/* Overall Score */}
                <div className="rounded-xl bg-white p-6 shadow">

                    <p className="text-sm font-semibold text-gray-500">
                        Overall Score
                    </p>

                    <p className="mt-2 text-3xl font-bold text-blue-600">
                        {interview.overall_score}/10
                    </p>

                </div>

                {/* Recommendation */}
                <div className="rounded-xl bg-white p-6 shadow">

                    <p className="text-sm font-semibold text-gray-500">
                        Recommendation
                    </p>

                    <span
                        className={`mt-2 inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                            interview.recommendation === "Recommended"
                                ? "bg-green-100 text-green-800"
                                : interview.recommendation === "Needs Improvement"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        {interview.recommendation}
                    </span>

                </div>

            </div>

            {/* Interview Details */}
            <div className="mt-8 rounded-xl bg-white p-8 shadow">

                <h2 className="text-xl font-bold text-gray-900">
                    Interview Details
                </h2>

                <div className="mt-6 grid gap-6 md:grid-cols-3">

                    <div>
                        <p className="text-sm text-gray-500">
                            Interview ID
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                            {interview.id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Resume ID
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                            {interview.resume_id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Job ID
                        </p>

                        <p className="mt-1 font-bold text-gray-900">
                            {interview.job_id}
                        </p>
                    </div>

                </div>

            </div>

            {/* Questions & Answers */}
            <div className="mt-8">

                <div className="flex items-center justify-between">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Interview Questions & Evaluation
                        </h2>

                        <p className="mt-1 text-gray-600">
                            Review each candidate response and AI evaluation.
                        </p>
                    </div>

                    <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
                        {questions.length} Questions
                    </span>

                </div>

                <div className="mt-6 space-y-6">

                    {questions.map((question, index) => (

                        <div
                            key={question.id}
                            className="rounded-xl bg-white p-6 shadow"
                        >

                            {/* Question Header */}
                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <p className="text-sm font-semibold text-gray-500">
                                        Question {index + 1}
                                    </p>

                                    <p className="mt-2 text-lg font-semibold text-gray-900">
                                        {question.question}
                                    </p>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Type: {question.question_type}
                                    </p>

                                </div>

                                {/* Score Badge */}
                                <div className="shrink-0 rounded-lg bg-blue-50 px-4 py-3 text-center">

                                    <p className="text-xs font-semibold text-gray-500">
                                        SCORE
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-blue-600">
                                        {question.score ?? "N/A"}
                                        {question.score !== null && "/10"}
                                    </p>

                                </div>

                            </div>

                            {/* Candidate Answer */}
                            <div className="mt-6">

                                <h3 className="font-semibold text-gray-900">
                                    Candidate Answer
                                </h3>

                                <div className="mt-2 rounded-lg bg-gray-50 p-4">

                                    <p className="leading-7 text-gray-700">
                                        {question.answer || "No answer provided"}
                                    </p>

                                </div>

                            </div>

                            {/* Score Progress */}
                            {question.score !== null && (
                                <div className="mt-6">

                                    <div className="flex items-center justify-between">

                                        <h3 className="font-semibold text-gray-900">
                                            Performance
                                        </h3>

                                        <span className="text-sm font-semibold text-gray-600">
                                            {question.score}/10
                                        </span>

                                    </div>

                                    <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">

                                        <div
                                            className="h-full rounded-full bg-blue-600"
                                            style={{
                                                width: `${question.score * 10}%`
                                            }}
                                        />

                                    </div>

                                </div>
                            )}

                            {/* AI Feedback */}
                            <div className="mt-6">

                                <h3 className="font-semibold text-gray-900">
                                    AI Feedback
                                </h3>

                                <div className="mt-2 rounded-lg bg-blue-50 p-4">

                                    <p className="leading-7 text-gray-700">
                                        {question.feedback || "No feedback available"}
                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {/* Back Button */}
            <div className="mt-8">

                <button
                    onClick={() => router.back()}
                    className="rounded-lg bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-800"
                >
                    Back to Candidate
                </button>

            </div>

        </main>
    );
}