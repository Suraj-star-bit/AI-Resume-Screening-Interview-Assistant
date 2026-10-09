"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function LoginPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
event.preventDefault();


setLoading(true);
setError("");

try {
  const response = await api.post("/users/login", {
    email,
    password,
  });

  const token = response.data.access_token;

  localStorage.setItem("access_token", token);

  const payload = JSON.parse(atob(token.split(".")[1]));

  if (payload.role === "recruiter") {
    router.push("/recruiter");
  } else {
    router.push("/candidate");
  }
} catch (error: any) {
  console.error(error);
  setError(
    error.response?.data?.detail || "Invalid email or password"
  );
} finally {
  setLoading(false);
}


};

return ( <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 text-gray-900"> <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"> <div className="mb-8 text-center">
<button
type="button"
onClick={() => router.push("/")}
className="mb-6 text-sm font-medium text-gray-500 hover:text-gray-900"
>
← Back to Home </button>

```
      <h1 className="text-3xl font-bold tracking-tight">
        AI Resume Screening
      </h1>

      <p className="mt-3 text-gray-600">
        Sign in to your account
      </p>

      <p className="mt-2 text-sm text-gray-600">
        Access your candidate or recruiter dashboard.
      </p>
    </div>

    <form onSubmit={handleLogin} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Email address
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-200"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-gray-900 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>

    <p className="mt-6 text-center text-xs leading-5 text-gray-500">
      Your dashboard is selected automatically based on your account role.
    </p>
  </div>
</main>


);
}
