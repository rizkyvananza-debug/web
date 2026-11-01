
"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmailAuth(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (error) throw error;

        setMessage(
          "Pendaftaran berhasil! Silakan periksa email untuk verifikasi akun."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        window.location.href = "/";
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) throw error;
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Login Google gagal. Silakan coba lagi."
      );
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#100d10] text-[#f5e9e9] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-[#67404d] bg-[#191318] p-7 shadow-2xl">

        <div className="text-center mb-8">
          <p className="text-[#c99b79] tracking-[0.4em] text-sm mb-4">
            N✦E
          </p>

          <h1 className="text-3xl font-serif">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>

          <p className="text-sm text-[#b8a6ad] mt-3">
            Enter your world of stories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={loading}
          className="w-full rounded-xl border border-[#765260] py-3 mb-6 hover:bg-[#35232c] disabled:opacity-50"
        >
          {loading ? "Please wait..." : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3 mb-6 text-xs text-[#927d85]">
          <div className="h-px flex-1 bg-[#49323b]" />
          OR CONTINUE WITH EMAIL
          <div className="h-px flex-1 bg-[#49323b]" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">
              Email Address
            </label>

            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3 outline-none focus:border-[#c99b79]"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">
              Password
            </label>

            <input
              type="password"
              required
              minLength={6}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl border border-[#67404d] bg-[#100d10] p-3 outline-none focus:border-[#c99b79]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#713c50] py-3 font-semibold hover:bg-[#895069] disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "SIGN IN"
                : "CREATE ACCOUNT"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-center text-sm text-[#e5b6a7]">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-[#b8a6ad] mt-7">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
            }}
            className="ml-2 text-[#d5a77f] underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>

      </div>
    </main>
  );
}
