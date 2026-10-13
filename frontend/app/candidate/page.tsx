"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";

type Job = {
  id: number;
  title: string;
  description?: string;
};

type Resume = {
  id: number;
  filename: string;
};

type Application = {
  id: number;
  candidate_id: number;
  job_id: number;
  resume_id: number;
  status: string;
  applied_at: string;
};

export default function CandidateDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        jobsResponse,
        resumesResponse,
        applicationsResponse,
      ] = await Promise.all([
        api.get("/jobs/"),
        api.get("/resumes/my"),
        api.get("/applications/my"),
      ]);

      setJobs(jobsResponse.data);
      setResumes(resumesResponse.data);
      setApplications(applicationsResponse.data);

      if (resumesResponse.data.length > 0) {
        setSelectedResume(String(resumesResponse.data[0].id));
      }
    } catch (error) {
      console.error(error);
      setMessage("Could not load candidate data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const uploadResume = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
    setMessage("Please upload a PDF resume.");
    event.target.value = "";
    return;
  }

  try {
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    await api.post("/resumes/upload", formData);

    setMessage("Resume uploaded successfully!");
    await loadData();
  } catch (error: any) {
    console.error(error);
    setMessage(
      error?.response?.data?.detail ||
      "Failed to upload resume. Please try again."
    );
  } finally {
    setUploading(false);
    event.target.value = "";
  }
};

  const hasApplied = (jobId: number) => {
    return applications.some(
      (application) => application.job_id === jobId
    );
  };

  const applyForJob = async (jobId: number) => {
    if (!selectedResume) {
      setMessage("Please select a resume first.");
      return;
    }

    try {
      setMessage("");

      await api.post("/applications/", {
        job_id: jobId,
        resume_id: Number(selectedResume),
      });

      setMessage("Application submitted successfully.");

      await loadData();
    } catch (error: any) {
      console.error(error);

      const detail = error?.response?.data?.detail;

      setMessage(detail || "Failed to apply for this job.");
    }
  };


  const openInterview = async (
    resumeId: number,
    jobId: number
  ) => {
    try {
      setMessage("");

      let interviewId: number;

      try {
        const response = await api.get(
          `/interviews/candidate/${resumeId}/${jobId}`
        );

        interviewId = response.data.id;
      } catch (error: any) {
        if (error.response?.status !== 404) {
          throw error;
        }

        const response = await api.post("/interviews/", {
          resume_id: resumeId,
          job_id: jobId,
        });

        interviewId = response.data.id;
      }

      window.location.href = `/interviews/${interviewId}`;
    } catch (error: any) {
      console.error(error);
      setMessage(
        error?.response?.data?.detail ||
        "Could not open the interview."
      );
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">
          Candidate Dashboard
        </h1>

        <p className="mt-4">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold text-gray-900">
          Candidate Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Browse jobs and track your applications.
        </p>

        {message && (
          <div className="mt-6 rounded-lg bg-blue-100 p-4 text-blue-800">
            {message}
          </div>
        )}

        {/* Resume Selection */}

        <section className="mt-8 rounded-xl bg-white p-6 shadow">

          <h2 className="text-xl font-semibold text-gray-900">
            Upload Resume
          </h2>

          <p className="mt-2 text-gray-600">
            Choose your resume in PDF format.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={uploadResume}
              disabled={uploading}
              className="block max-w-full text-sm text-gray-700"
            />

            {uploading && (
              <span className="text-blue-600">
                Uploading...
              </span>
            )}
          </div>

          <div className="my-6 border-t" />

          <h2 className="text-xl font-semibold text-gray-900">
            Select Resume
          </h2>

          {resumes.length === 0 ? (
            <p className="mt-3 text-gray-600">
              You have not uploaded a resume yet.
            </p>
          ) : (
            <select
              value={selectedResume}
              onChange={(e) =>
                setSelectedResume(e.target.value)
              }
              className="mt-4 w-full rounded-lg border p-3 md:w-96"
            >
              {resumes.map((resume) => (
                <option
                  key={resume.id}
                  value={resume.id}
                >
                  {resume.filename} (Resume #{resume.id})
                </option>
              ))}
            </select>
          )}

        </section>

        {/* Available Jobs */}

        <section className="mt-8">

          <h2 className="text-2xl font-semibold text-gray-900">
            Available Jobs
          </h2>

          <div className="mt-4 grid gap-6 md:grid-cols-2">

            {jobs.map((job) => (

              <div
                key={job.id}
                className="rounded-xl bg-white p-6 shadow"
              >

                <h3 className="text-xl font-bold">
                  {job.title}
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Job ID: {job.id}
                </p>

                {job.description && (
                  <p className="mt-4 text-gray-700">
                    {job.description}
                  </p>
                )}

                <div className="mt-6">

                  {hasApplied(job.id) ? (

                    <button
                      disabled
                      className="rounded-lg bg-gray-300 px-5 py-2 font-semibold text-gray-700"
                    >
                      Already Applied
                    </button>

                  ) : (

                    <button
                      onClick={() => applyForJob(job.id)}
                      disabled={resumes.length === 0}
                      className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      Apply
                    </button>

                  )}

                </div>

              </div>

            ))}

          </div>

          {jobs.length === 0 && (
            <p className="mt-4 text-gray-600">
              No jobs available.
            </p>
          )}

        </section>

        {/* My Applications */}

        <section className="mt-12">

          <h2 className="text-2xl font-semibold text-gray-900">
            My Applications
          </h2>

          <div className="mt-4 overflow-hidden rounded-xl bg-white shadow">

            {applications.length === 0 ? (

              <p className="p-6 text-gray-600">
                You have not applied to any jobs yet.
              </p>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-100">

                    <tr>
                      <th className="p-4 text-left font-semibold text-gray-800">
                        Application ID
                      </th>

                      <th className="p-4 text-left font-semibold text-gray-800">
                        Job ID
                      </th>

                      <th className="p-4 text-left font-semibold text-gray-800">
                        Resume
                      </th>

                      <th className="p-4 text-left font-semibold text-gray-800">
                        Status
                      </th>

                      <th className="p-4 text-left font-semibold text-gray-800">
                        Applied At
                      </th>


                      <th className="p-4 text-left font-semibold text-gray-800">
                        Interview
                      </th>
                      

                    </tr>

  

                  </thead>

                  <tbody>

                    {applications.map((application) => (

                      <tr
                        key={application.id}
                        className="border-t"
                      >

                        <td className="p-4">
                          #{application.id}
                        </td>

                        <td className="p-4">
                          {application.job_id}
                        </td>

                        <td className="p-4">
                          Resume #{application.resume_id}
                        </td>

                        <td className="p-4">

                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                            {application.status}
                          </span>

                        </td>

                        <td className="p-4">
                          {new Date(
                            application.applied_at
                          ).toLocaleString()}
                        </td>


                      <td className="p-4">
                        {new Date(
                          application.applied_at
                        ).toLocaleString()}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() =>
                            openInterview(
                              application.resume_id,
                              application.job_id
                            )
                          }
                          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                        >
                          Open Interview
                        </button>
                      </td>


                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </section>

      </div>
    </div>
  );
}