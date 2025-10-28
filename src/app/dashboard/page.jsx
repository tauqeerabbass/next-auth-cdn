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

  const doctorData = docData?.data;

  // console.log("doctors: ", doctorData);
  // console.log("AVA", serviceCharges[0]?.currency);
  // console.log("Session:", session.user.token);

  return (
    <>
      {doctorData.map((doctor, index) => (
        <div
          key={index}
          className="main-div rounded-lg my-6 mx-4 shadow-md flex flex-col md:flex-row flex-wrap md:mx-10 p-4 lg:py-10"
        >
          <div className="left-div flex-1 min-w-[250px] lg:mx-28">
            <div className="flex gap-4 ">
              <img
                className="h-16 w-16 md:h-20 md:w-20 rounded-full object-cover"
                src={
                  doctor?.user?.profile_picture_url ||
                  "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg"
                }
              ></img>
              <div>
                <h1 className="text-[#202c39] mb-1">
                  {doctor?.user?.first_name} {doctor?.user?.last_name} |{" "}
                  <span className="text-[#a3a9b0] text-sm">
                    {doctor?.is_available ? "Available" : "Not Available"}{" "}
                  </span>
                </h1>
                <p className="text-[#4f5b67]">{doctor?.doctor_type}</p>
                <p className="font-semibold text-[#283845] bg-gray-300 rounded-md px-1 flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="green"
                    className="size-4.5 mt-0.5 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {doctor?.qualifications}, {doctor?.specialization}
                </p>
                <p className="text-[#4f5b67] md:flex md:gap-1 md:items-center">
                  <span className="font-semibold text-[#283845]">
                    {doctor?.experience}
                  </span>{" "}
                  Experience |{" "}
                  <br></br>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="#ffb955"
                    className="size-4 inline mt-[-5px] mr-1 md:mr-0 md:mt-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold text-[#283845]">
                    {doctor?.rating}
                  </span>{" "}
                  rating
                </p>
              </div>
            </div>
            {doctor?.serviceCharges.length > 0 ? (
              <div className="left-box-services min-h-[60px] w-full md:w-[350px] border border-[#d0d3d7] rounded-lg px-2 py-1 my-3">
                {doctor?.serviceCharges.map((services, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b border-gray-300 py-2 last:border-b-0"
                  >
                    <div className="text-[#283845]">
                      <p className="font-semibold">{services?.service?.name}</p>
                      <p>{services?.service?.description}</p>
                    </div>
                    <p className="font-medium text-[#283845]">
                      {services?.currency} {services?.service_charges}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="m-4 sm:mx-8 md:mx-16 lg:mx-28 mt-3 text-gray-500">
                No Services found
              </p>
            )}
            <div className="left-box px-2 py-1 w-full md:w-[350px] min-h-[70px] border border-[#d0d3d7] rounded-lg flex justify-between items-center text-[#283845]">
              <div>
                <p className="font-medium">Online Consultation</p>
                <p
                  className={
                    doctor?.consultation_mode === "online"
                      ? "text-green-500"
                      : "text-red-600"
                  }
                >
                  {doctor?.consultation_mode}
                </p>
              </div>
              <p className="font-medium">Rs. {doctor?.consultation_fee}</p>
            </div>
          </div>
          <div className="right-div flex flex-col items-center flex-1 mt-4 md:mt-5 md:ml-5 gap-1 md:items-start lg:justify-center lg:items-start">
            <button className="border border-[#283845] w-full md:w-[200px] h-[50px] rounded-lg hover:bg-[#283845] hover:text-white">
              Online consultation
            </button>
            <button className="border boder-black w-full md:w-[200px] h-[50px] rounded-lg bg-[#f29559] hover:bg-[#f5b387]">
              Book an appointment
            </button>
            <p className="text-[#4f5b67]">
              Waiting Time:{" "}
              <span className="text-[#283845] font-medium">
                {doctor?.waiting_time}
              </span>
            </p>

            {doctor?.hospitals.length > 0 ? (
              <div className="hospitals mt-5 border border-[#d0d3d7] rounded-lg px-2 py-1 w-full md:w-[400px] mx-4 sm:mx-8 md:mx-0 lg:mx-0">
                {doctor?.hospitals.map((h, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-300 py-2 last:border-b-0 text-[#283845]"
                  >
                    <p>
                      <span className="font-medium">Hospital Name:</span>{" "}
                      {h.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Department:</span>{" "}
                      {h.department?.medical_department?.name || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mx-4 sm:mx-8 md:mx-16 lg:mx-28 mt-3 text-gray-500">
                No hospitals found
              </p>
            )}
          </div>
        </div>
      ))}

      <button
        onClick={handleSignOut}
        className="w-full h-12 bg-[#BEEBD4] text-[#1D3D27] font-semibold rounded-md hover:bg-[#809D8E] hover:text-white"
      >
        Sign Out
      </button>
    </>
  );
}
