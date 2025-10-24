"use client";
import { Alert, Snackbar } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(()=>{
    if (status === "unauthenticated"){
      router.push("/login");
    }
  },[status, router]);


  console.log("Session result", session);
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null;

  async function handleSignOut() {
    const res = signOut({ callbackUrl: "/login" });

    if (!res) {
      console.log("Error while signing out");
    } else {
      console.log("Signed Out");
      router.push("/login");
    }
  }

  return (
    <>
      <h1>Welcome</h1>
      <button
        onClick={handleSignOut}
        className="w-full h-12 bg-[#BEEBD4] text-[#1D3D27] font-semibold rounded-md hover:bg-[#809D8E] hover:text-white"
      >
        Sign Out
      </button>
    </>
  );
}
