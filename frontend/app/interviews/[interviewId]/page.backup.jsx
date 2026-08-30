"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function InterviewPage() {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const params = useParams();
    const interviewId = params.interviewId;

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [interview, setInterview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [loadingResult, setLoadingResult] = useState(true);
    const [submitting, setSubmitting] = useState({});
    const [evaluating, setEvaluating] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        if (interviewId) {
            loadInterviewResult();
        }
    }, [interviewId]);

    const loadInterviewResult = async () => {
        try {
            setLoadingResult(true);
            setError("");

            const response = await api.get(
                `/interviews/${interviewId}/result`
            );

            setInterview(response.data);
            setQuestions(response.data.questions || []);

            const existingAnswers = {};

            (response.data.questions || []).forEach((question) => {
                if (question.answer) {
                    existingAnswers[question.id] = question.answer;
                }
            });

            setAnswers(existingAnswers);

        } catch (error) {
            console.log("Failed to load interview result:", error);

            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else {
                setError("Failed to load interview.");
            }
        } finally {
            setLoadingResult(false);
        }
    };

    const generateQuestions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                `/interviews/${interviewId}/generate-questions`
            );

            setQuestions(response.data);

        } catch (error) {
            console.log("Failed to generate questions:", error);
            setError("Failed to generate interview questions.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers((previous) => ({
            ...previous,
            [questionId]: value,
        }));
    };

    const submitAnswer = async (questionId) => {
        const answer = answers[questionId];

        if (!answer || !answer.trim()) {
            alert("Please enter an answer first.");
            return;
        }

        try {
            setSubmitting((previous) => ({
                ...previous,
                [questionId]: true,
            }));

            const response = await api.post(
                `/interview-questions/${questionId}/answer`,
                {
                    answer: answer,
                }
            );

            setQuestions((previous) =>
                previous.map((question) =>
                    question.id === questionId
                        ? response.data
                        : question
                )
            );

            alert("Answer submitted successfully!");

        } catch (error) {
            console.log("Failed to submit answer:", error);
            alert("Failed to submit answer.");
        } finally {
            setSubmitting((previous) => ({
                ...previous,
                [questionId]: false,
            }));
        }
    };

    const evaluateAnswer = async (questionId) => {
        try {
            setEvaluating((previous) => ({
                ...previous,
                [questionId]: true,
            }));

            const response = await api.post(
                `/interview-questions/${questionId}/evaluate`
            );

            setQuestions((previous) =>
                previous.map((question) =>
                    question.id === questionId
                        ? response.data
                        : question
                )
            );

            alert("Answer evaluated successfully!");

            await loadInterviewResult();

        } catch (error) {
            console.log("Failed to evaluate answer:", error);

            if (error.response?.data?.detail) {
                alert(error.response.data.detail);
            } else {
                alert("Failed to evaluate answer.");
            }
        } finally {
            setEvaluating((previous) => ({
                ...previous,
                [questionId]: false,
            }));
        }
    };

    if (loadingResult) {
        return (
            <main className="min-h-screen bg-gray-100 p-8">
                <div className="mx-auto max-w-4xl">
                    <p className="text-gray-600">
                        Loading interview...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-8">

            <div className="mx-auto max-w-4xl">

                <h1 className="text-3xl font-bold text-gray-900">
                    AI Interview
                </h1>

                <p className="mt-2 text-gray-600">
                    Interview ID: {interviewId}
                </p>

                {error && (
                    <p className="mt-4 text-red-600">
                        {error}
                    </p>
                )}

                {interview && interview.status === "Completed" && (
                    <div className="mt-6 rounded-xl bg-white p-6 shadow">

                        <h2 className="text-xl font-bold text-gray-900">
                            Interview Result
                        </h2>

                        <div className="mt-5 grid gap-4 sm:grid-cols-3">

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">
                                    Overall Score
                                </p>

                                <p className="mt-1 text-3xl font-bold text-blue-600">
                                    {interview.overall_score}/10
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">
                                    Recommendation
                                </p>

                                <p className="mt-2 font-bold text-orange-600">
                                    {interview.recommendation}
                                </p>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <p className="text-sm text-gray-500">
                                    Status
                                </p>

                                <p className="mt-2 font-bold text-green-600">
                                    {interview.status}
                                </p>
                            </div>

                        </div>

                    </div>
                )}

                <button
                    onClick={generateQuestions}
                    disabled={loading}
                    className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading
                        ? "Generating..."
                        : "Generate Interview Questions"}
                </button>

                <div className="mt-8 space-y-6">

                    {questions.map((question, index) => (
                        <div
                            key={question.id}
                            className="rounded-xl bg-white p-6 shadow"
                        >

                            <p className="text-sm font-semibold text-blue-600">
                                Question {index + 1}
                            </p>

                            <h2 className="mt-2 text-lg font-semibold text-gray-900">
                                {question.question}
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                Type: {question.question_type}
                            </p>

                            <textarea
                                value={
                                    answers[question.id] ||
                                    question.answer ||
                                    ""
                                }
                                onChange={(event) =>
                                    handleAnswerChange(
                                        question.id,
                                        event.target.value
                                    )
                                }
                                placeholder="Write your answer here..."
                                rows={5}
                                className="mt-4 w-full rounded-lg border border-gray-300 p-4 text-gray-900 outline-none focus:border-blue-600"
                            />

                            <button
                                onClick={() =>
                                    submitAnswer(question.id)
                                }
                                disabled={submitting[question.id]}
                                className="mt-4 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                            >
                                {submitting[question.id]
                                    ? "Submitting..."
                                    : "Submit Answer"}
                            </button>

                            {question.answer && (
                                <button
                                    onClick={() =>
                                        evaluateAnswer(question.id)
                                    }
                                    disabled={evaluating[question.id]}
                                    className="ml-3 rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                                >
                                    {evaluating[question.id]
                                        ? "Evaluating..."
                                        : "Evaluate Answer"}
                                </button>
                            )}

                            {question.score !== null &&
                                question.score !== undefined && (
                                    <div className="mt-6 rounded-lg bg-gray-50 p-4">

                                        <p className="font-semibold text-gray-900">
                                            Score: {question.score}/10
                                        </p>

                                        <p className="mt-2 text-gray-700">
                                            {question.feedback}
                                        </p>

                                    </div>
                                )}

                        </div>
                    ))}

                </div>

            </div>

        </main>
    );
}