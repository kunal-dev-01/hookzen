"use client";

import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <main className="flex items-center justify-center p-6 relative overflow-hidden">
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </main>
  );
}
