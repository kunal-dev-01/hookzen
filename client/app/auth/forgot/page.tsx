"use client";

import { useState } from "react";
import ForgotForm from "@/components/auth/ForgotForm";
import ResetResend from "@/components/auth/ResetResend";
import { useRouter } from "next/navigation";

export default function Forgot() {
  const [step, setStep] = useState<"forgot" | "success">("forgot");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleForgotSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setStep("success");
  };

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <main className="flex items-center justify-center p-6 relative overflow-hidden">
      <div className="relative z-10 w-full flex justify-center">
        {step === "forgot" ? (
          <ForgotForm onSuccess={handleForgotSuccess} />
        ) : (
          <ResetResend email={email} onBack={handleBackToLogin} />
        )}
      </div>
    </main>
  );
}
