"use client";

import {useEffect , useState} from "react";
import api from "@/lib/api";


export default function RecruiterDashboard() {
    
    const [candidates , setCandidates] = useState([]);

    useEffect(() => {
        api.get("/recruiter/dashboard?job_id=3")
        .then((response) =>{
            setCandidates(response.data.candidates);
        })
        .catch((error) => {
            console.log(error)
        })
    }, []);
    
    return (

        <main className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-900">
            Recruiter Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
            Ranked candidates for Job #{3}
            </p>

            <div className="mt-8 overflow-hidden rounded-xl bg-white shadow">
                <table className="w-full text-gray-900">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 text-left font-semibold text-gray-900">
                        Candidate
                        </th>

                        <th className="p-4 text-left font-semibold text-gray-900">
                        ATS Score
                        </th>

                        <th className="p-4 text-left font-semibold text-gray-900">
                        Matched Skills
                        </th>

                        <th className="p-4 text-left font-semibold text-gray-900">
                        Missing Skills
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {candidates.map((candidate) => (
                        <tr
                        key={candidate.resume_id}
                        className="border-t border-gray-200"
                        >
                        <td className="p-4 font-medium text-gray-900">
                            Resume #{candidate.resume_id}
                        </td>

                        <td className="p-4">
                            <div className="flex items-center gap-3">
                            <div className="h-3 w-32 overflow-hidden rounded-full bg-gray-200">
                                <div
                                className="h-full rounded-full bg-blue-600"
                                style={{ width: `${candidate.score}%` }}
                                />
                            </div>

                            <span className="font-bold text-gray-900">
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
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
        </main>
        );
    
    }
