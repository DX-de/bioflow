import { AuthForm } from "@/components/auth/auth-form";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { PageWith3DBackground } from "@/components/background/background-3d";

export const metadata = {
  title: "Inscription",
};

export default function SignupPage() {
  return (
    <PageWith3DBackground overlay={0.78} className="flex flex-col">
      <div className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
        >
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-slate-900">{APP_NAME}</span>
        </Link>
      </div>
      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <AuthForm mode="signup" />
      </main>
    </PageWith3DBackground>
  );
}
