"use client";

import { useState } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import ResendVerify from "@/components/auth/ResendVerify";

export default function Register() {
  const [step, setStep] = useState<"register" | "verify">("register");
  const [email, setEmail] = useState("");

  const handleRegisterSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setStep("verify");
  };

  const handleBackToRegister = () => {
    setStep("register");
  };

  return (
    <main className="flex items-center justify-center p-6 relative overflow-hidden">
      <div className="relative z-10 w-full flex justify-center">
        {step === "register" ? (
          <RegisterForm onSuccess={handleRegisterSuccess} />
        ) : (
          <ResendVerify email={email} onBack={handleBackToRegister} />
        )}
      </div>
    </main>
  );
}
