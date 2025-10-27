"use client";
import { Alert, Snackbar } from "@mui/material";
import { getToken } from "next-auth/jwt";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [docData, setDocData] = useState();
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();
  const accessToken = session?.user?.token;

  const fetchData = async () => {
    try {
      if (!accessToken) {
        console.log("No token found!");
        return;
      }

      const response = await fetch(process.env.NEXT_PUBLIC_DOCTORS_API, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data.data);
      setDocData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && accessToken) {
      fetchData();
    }
  }, [status, session, router]);

  // console.log("Session result", session);
  if (status === "loading" || loadingData) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!docData) {
    return <p className="text-center mt-10 text-red-600">No data available</p>;
  }

  const firstDoc = docData?.docData?.[0];

  async function handleSignOut() {
    const res = signOut({ callbackUrl: "/login" });

    if (!res) {
      console.log("Error while signing out");
    } else {
      localStorage.setItem("Name", "");
      localStorage.setItem("Username", "");
      localStorage.setItem("Password", "");
      console.log("Signed Out");
      router.push("/login");
    }
  }

  const {
    is_available,
    consultation_fee,
    consultation_mode,
    doctor_type,
    experience,
    qualifications,
    specialization,
    waiting_time,
    rating,
    license_number,
    reference_number,
    user,
    serviceCharges = [],
    hospitals = [],
  } = docData?.data?.[0] || {};

  console.log("AVA", serviceCharges[0].service_charges);
  // console.log("Session:", session.user.token);

  return (
    <>
      <h1>Welcome</h1>

      <div className="main-div w-[1200px] h-[300px] rounded-lg my-5 mx-28 border border-black flex justify-between">
        <div className="left-div">
          <div className="flex">
          <img className="h-20 w-20" src={"https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg"}></img>
          <div>
          <h1>{user.first_name} {user.last_name} | {is_available ? "Available" : "Not Available"} </h1>
          <p>{doctor_type}</p>
          <p>
            {qualifications}, {specialization}
          </p>
          <p>
            {experience} Experience | {rating} rating
          </p>
          </div>
          </div>
          <div className="left-box w-[350px] h-[100px] border border-black rounded-lg flex justify-between items-center">
            <div>
              <p>Online Consultation</p>
              <p>{consultation_mode}</p>
            </div>
            <p>Rs. {consultation_fee}</p>
          </div>
        </div>
        <div className="right-div flex flex-col items-center">
          <button className="border boder-black w-[200px] h-[50px] rounded-lg">
            Online consultation
          </button>
          <button className="border boder-black w-[200px] h-[50px] rounded-lg">
            Book an appointment
          </button>
          <p>Waiting Time: {waiting_time}</p>
          
          {hospitals.length > 0 ? (
            <div className="hospitals mt-5 border border-gray-400 rounded-lg p-4 w-[400px] mx-28">
              {hospitals.map((h, index) => (
                <div
                  key={index}
                  className="border-b border-gray-300 py-2 last:border-b-0"
                >
                  <p>
                    <strong>Hospital Name:</strong> {h.name || "N/A"}
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {h.department?.medical_department?.name || "N/A"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mx-28 mt-3 text-gray-500">No hospitals found</p>
          )}
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="w-full h-12 bg-[#BEEBD4] text-[#1D3D27] font-semibold rounded-md hover:bg-[#809D8E] hover:text-white"
      >
        Sign Out
      </button>
    </>
  );
}
