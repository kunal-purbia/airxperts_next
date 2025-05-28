"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="container">
      <button className="button" onClick={() => router.push("/auth/login")}>
        Login
      </button>
      <button className="button" onClick={() => router.push("/auth/register")}>
        Sign Up
      </button>
    </div>
  );
}
