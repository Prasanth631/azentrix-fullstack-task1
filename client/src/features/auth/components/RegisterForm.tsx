import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (password.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      showToast("Command key created! Welcome to FlowLedger.", "success");
      navigate("/dashboard");
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Registration failed. Please try again.";
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-md bg-brand-card/75 border border-brand-border shadow-2xl backdrop-blur-md relative overflow-hidden text-brand-text">
      {/* Background glow overlay */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-brand-accent/5 blur-xl pointer-events-none" />

      {/* Brand logo for mobile view */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center justify-center text-brand-text">
          <Activity size={28} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold tracking-tight text-brand-text">FlowLedger</span>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-brand-text animate-fade-in">
          Create command key
        </h2>
        <p className="text-xs text-brand-muted font-light mt-0.5">
          Establish your access identity for local ledger command tracking.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
            />
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Prasanth Golla"
              className="w-full pl-9 pr-4 py-2.5 rounded-md text-xs bg-brand-bg border border-brand-border text-brand-text placeholder-brand-muted/40 focus:border-brand-accent focus:outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
            />
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. prasanth@flowledger.com"
              className="w-full pl-9 pr-4 py-2.5 rounded-md text-xs bg-brand-bg border border-brand-border text-brand-text placeholder-brand-muted/40 focus:border-brand-accent focus:outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
            />
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full pl-9 pr-10 py-2.5 rounded-md text-xs bg-brand-bg border border-brand-border text-brand-text placeholder-brand-muted/40 focus:border-brand-accent focus:outline-none transition-all"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-muted hover:text-brand-text transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <Lock
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted"
            />
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full pl-9 pr-4 py-2.5 rounded-md text-xs bg-brand-bg border border-brand-border text-brand-text placeholder-brand-muted/40 focus:border-brand-accent focus:outline-none transition-all"
              required
              minLength={8}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          id="register-submit"
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-md bg-brand-text text-brand-bg text-xs font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Generating command key...
            </>
          ) : (
            "Create Command Key"
          )}
        </button>
      </form>

      <p className="text-center mt-6 text-xs text-brand-muted">
        Already have a key?{" "}
        <Link
          to="/login"
          className="font-bold text-brand-accent hover:text-brand-accent/80 transition-colors pl-1"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
