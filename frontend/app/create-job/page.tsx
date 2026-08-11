"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function CreateJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/job-descriptions/", {
        title,
        description,
      });

      console.log("Created job:", response.data);

      // Go back to recruiter dashboard
      router.push("/recruiter");
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/login");
        return;
      }

      setError(
        error.response?.data?.detail ||
          "Failed to create job description."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/recruiter")}
            className="mb-4 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Create Job Description
          </h1>

          <p className="mt-2 text-gray-600">
            Create a job and let the system automatically extract
            the required skills.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-xl bg-white p-8 shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="mb-2 block font-semibold text-gray-900">
                Job Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Python Backend Developer"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block font-semibold text-gray-900">
                Job Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Enter the complete job description, required skills, responsibilities, experience, etc."
                required
                rows={12}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Job..." : "Create Job"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}