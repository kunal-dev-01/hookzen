"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ResetForm from "@/components/auth/ResetForm";
import { Suspense, useEffect } from "react";
import FormHead from "@/common/FormHead";

function ResetContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/auth/forgot");
    }
  }, [token, router]);

  if (!token) {
    return (
      <div className="w-full max-w-md space-y-4 text-center">
        <FormHead title="INVALID_REQUEST" />
        <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
          [!] Error: Authorization token missing. Redirecting...
        </p>
      </div>
    );
  }

  return <ResetForm token={token} />;
}

export default function Reset() {
  return (
    <main className="flex items-center justify-center p-6 relative overflow-hidden">
      <div className="relative z-10 w-full flex justify-center">
        <Suspense
          fallback={
            <div className="text-cyan-500 font-mono text-[10px] animate-pulse uppercase tracking-[0.3em]">
              Scanning_For_Credentials...
            </div>
          }
        >
          <ResetContent />
        </Suspense>
      </div>
    </main>
  );
}
