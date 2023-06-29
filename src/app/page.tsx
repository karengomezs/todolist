"use client";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  return (
    <main className="px-6 mt-6">
      <p className="font-extrabold text-3xl text-slate-800">
        What's up, {user?.firstName}!
      </p>
    </main>
  );
}
