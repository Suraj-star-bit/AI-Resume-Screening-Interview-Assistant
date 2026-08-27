"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function InterviewPage() {
    const params = useParams();
    const interviewId = params.interviewId;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [interview, setInterview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [loadingResult, setLoadingResult] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [evaluating, setEvaluating] = useState(false);
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

            const loadedQuestions = response.data.questions || [];
            setQuestions(loadedQuestions);

            const existingAnswers = {};

            loadedQuestions.forEach((question) => {
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
            setCurrentQuestionIndex(0);

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

    const submitAndEvaluate = async () => {
        const question = questions[currentQuestionIndex];

        if (!question) {
            return;
        }

        const answer = answers[question.id];

        if (!answer || !answer.trim()) {
            alert("Please enter an answer first.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            // Step 1: Save answer
            const answerResponse = await api.post(
                `/interview-questions/${question.id}/answer`,
                {
                    answer: answer,
                }
            );

            setQuestions((previous) =>
                previous.map((item) =>
                    item.id === question.id
                        ? answerResponse.data
                        : item
                )
            );

            // Step 2: Evaluate answer with Llama
            setEvaluating(true);

            const evaluationResponse = await api.post(
                `/interview-questions/${question.id}/evaluate`
            );

            setQuestions((previous) =>
                previous.map((item) =>
                    item.id === question.id
                        ? evaluationResponse.data
                        : item
                )
            );

            // Refresh overall interview result
            await loadInterviewResult();

            // Move to next question after evaluation
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(
                    (previous) => previous + 1
                );
            }

        } catch (error) {
            console.log("Failed to submit/evaluate answer:", error);

            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else {
                setError("Failed to submit answer.");
            }
        } finally {
            setSubmitting(false);
            setEvaluating(false);
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

    const currentQuestion = questions[currentQuestionIndex];

    const interviewFinished =
    interview?.status === "Completed" ||
    (
        questions.length > 0 &&
        currentQuestionIndex >= questions.length - 1 &&
        questions.every(
            (question) =>
                question.score !== null &&
                question.score !== undefined
        )
    );

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

                {questions.length === 0 && (
                    <button
                        onClick={generateQuestions}
                        disabled={loading}
                        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Generating..."
                            : "Generate Interview Questions"}
                    </button>
                )}

                {currentQuestion && !interviewFinished && (
                    <div className="mt-8 rounded-xl bg-white p-8 shadow">

                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-blue-600">
                                Question {currentQuestionIndex + 1} of{" "}
                                {questions.length}
                            </p>

                            <p className="text-sm text-gray-500">
                                {currentQuestion.question_type}
                            </p>
                        </div>

                        <h2 className="mt-4 text-xl font-semibold leading-relaxed text-gray-900">
                            {currentQuestion.question}
                        </h2>

                        <textarea
                            value={answers[currentQuestion.id] || ""}
                            onChange={(event) =>
                                handleAnswerChange(
                                    currentQuestion.id,
                                    event.target.value
                                )
                            }
                            placeholder="Write your answer here..."
                            rows={8}
                            className="mt-6 w-full rounded-lg border border-gray-300 p-4 text-gray-900 outline-none focus:border-blue-600"
                        />

                        <button
                            onClick={submitAndEvaluate}
                            disabled={submitting || evaluating}
                            className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting
                                ? "Submitting..."
                                : evaluating
                                ? "AI is evaluating..."
                                : "Submit Answer"}
                        </button>

                        {currentQuestion.score !== null &&
                            currentQuestion.score !== undefined && (
                                <div className="mt-6 rounded-lg bg-gray-50 p-5">

                                    <p className="font-semibold text-gray-900">
                                        Score: {currentQuestion.score}/10
                                    </p>

                                    <p className="mt-2 text-gray-700">
                                        {currentQuestion.feedback}
                                    </p>

                                </div>
                            )}

                    </div>
                )}

                {interviewFinished && interview && (
                    <div className="mt-8 rounded-xl bg-white p-8 shadow">

                        <h2 className="text-2xl font-bold text-gray-900">
                            Interview Complete 🎉
                        </h2>

                        <div className="mt-6 rounded-lg bg-gray-50 p-6">

                            <p className="text-sm text-gray-500">
                                Overall Score
                            </p>

                            <p className="mt-2 text-4xl font-bold text-blue-600">
                                {interview.overall_score}/10
                            </p>

                            <p className="mt-4 text-sm text-gray-500">
                                Recommendation
                            </p>

                            <p className="mt-1 text-xl font-bold text-orange-600">
                                {interview.recommendation}
                            </p>

                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Question Results
                            </h3>

                            <div className="mt-4 space-y-4">

                                {questions.map((question, index) => (
                                    <div
                                        key={question.id}
                                        className="rounded-lg border border-gray-200 p-4"
                                    >
                                        <p className="font-semibold text-gray-900">
                                            Question {index + 1}
                                        </p>

                                        <p className="mt-2 text-gray-700">
                                            {question.question}
                                        </p>
                                        {question.answer && (
                                            <div className="mt-4 rounded-lg bg-gray-50 p-4">
                                                <p className="text-sm font-semibold text-gray-500">
                                                    Candidate Answer
                                                </p>

                                                <p className="mt-2 whitespace-pre-wrap text-gray-700">
                                                    {question.answer}
                                                </p>
                                            </div>
                                        )}

                                        <p className="mt-3 font-semibold text-blue-600">
                                            Score: {question.score}/10
                                        </p>

                                        <p className="mt-2 text-gray-600">
                                            {question.feedback}
                                        </p>
                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>
                )}

            </div>
        </main>
    );
}