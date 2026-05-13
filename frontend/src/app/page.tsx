"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userRaw = Cookies.get("user");
    if (!userRaw) {
      router.push("/login");
    } else {
      const user = JSON.parse(userRaw);
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-height-screen bg-slate-50 dark:bg-slate-950">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 bg-blue-600 rounded-2xl"></div>
        <p className="text-slate-500 font-medium">Redirigiendo...</p>
      </div>
    </div>
  );
}
