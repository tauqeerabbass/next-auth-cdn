"use client";
import { Alert, Snackbar } from "@mui/material";
import { getToken } from "next-auth/jwt";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Router } from "next/router";
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

  const getPatients = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_PATIENTS_API, {
      headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch patients");
    }

    const data = await res.json();
    console.log("Patients Data (Server Action):", data.data[0]);

    localStorage.setItem("PatientsData", JSON.stringify(data?.data))
    router.push("/Tables", data);
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
      <div className="xl:grid xl:grid-cols-2">
        {doctorData.map((doctor, index) => (
          <div
            key={index}
            className="m-3 shadow-md md:border md:border-gray-100 xl:border-none rounded-lg my-12 flex flex-col lg:flex lg:flex-col gap-5 py-4 px-6 max-w-[750px] xl:min-w-[750px] mx-auto"
          >
            <div className="upper-div flex flex-col md:flex md:flex-row flex-1">
              <div className="upper-left-div flex-1">
                <div className="upper-left-upper-div flex mb-5 lg:border-none my-2 gap-3">
                  <img
                    className="h-16 w-16 rounded-full md:h-20 md:w-20 object-contain"
                    src={
                      doctor?.user?.profile_picture_url ||
                      "https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg"
                    }
                  ></img>
                  <div className="flex flex-col gap-5">
                    <div className="upper-left-upper-right-div">
                      <h1 className="text-[#053c5e] font-bold text-[18px]">
                        {doctor?.user?.first_name} {doctor?.user?.last_name}{" "}
                      </h1>
                      <p>
                        {doctor?.qualifications}, {doctor?.specialization}
                      </p>
                      <p>{doctor?.doctor_type}</p>
                    </div>
                    <div className="upper-left-lower-div flex gap-12 justify-evenly lg:items-start lg:justify-start">
                      <p>
                        <span className="font-semibold">Reviews</span>
                        <br></br>
                        <span className="flex gap-1">
                          {doctor?.rating}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="#ffb955"
                            className="size-4 self-center"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold">Experience</span>
                        <br></br>
                        {doctor?.experience || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="upper-right-div flex-1">
                <button className="cursor-pointer border boder-black w-full md:w-[250px] h-[50px] rounded-lg bg-[#1f7a8c] hover:bg-[#50828b] text-white">
                  Book an appointment
                </button>
                {doctor?.hospitals.length > 0 ? (
                  <div className="hospitals mt-2 border border-[#d0d3d7] rounded-lg px-2 py-1 w-full md:w-[250px] sm:mx-8 md:mx-0 lg:mx-0">
                    {doctor?.hospitals.map((h, index) => (
                      <div
                        key={index}
                        className="border-b border-gray-300 py-2 last:border-b-0 text-[#283845] "
                      >
                        <p className="font-medium">
                          {/* <span className="font-medium">Hospital Name:</span>{" "} */}
                          {h.name || "N/A"}
                        </p>
                        <p>
                          <span className="font-medium">Dep:</span>{" "}
                          {h.department?.medical_department?.name || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mx-4 sm:mx-8 md:mx-16 lg:mx-2 mt-3 text-gray-500">
                    No hospitals found
                  </p>
                )}
              </div>
            </div>
            <div className="lower-div flex flex-col md:flex md:flex-row flex-1 md:gap-5 md:items-stretch">
              <div className="left-box p-2 md:my-3 w-full md:w-[350px] min-h-[60px] md:h-[70px] border border-[#d0d3d7] rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center md:self-end text-[#283845]">
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
                <p className="font-medium self-end">
                  PKR {doctor?.consultation_fee}
                </p>
              </div>
              {doctor?.serviceCharges.length > 0 ? (
                <div className="left-box-services flex-col min-h-[60px] w-full md:w-[350px] md:min-w-[350px] lg:w-auto border border-[#d0d3d7] rounded-lg my-3 lg:flex ">
                  {doctor?.serviceCharges.map((services, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-start border-b border-gray-300 p-2 last:border-b-0 lg:border-gray-300 lg:last:border-r-0"
                    >
                      <div className="text-[#283845] flex-1">
                        <p className="font-semibold">
                          {services?.service?.name}
                        </p>
                        <p>{services?.service?.description}</p>
                      </div>
                      <p className="font-medium text-[#283845] self-end">
                        {services?.currency} {services?.service_charges}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="m-4 sm:mx-8 md:mx-16 lg:mx-28 mt-3 text-gray-500">
                  {/* No Services found */}
                </p>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={handleSignOut}
          className="w-full h-12  bg-[#BEEBD4] text-[#1D3D27] font-semibold rounded-md hover:bg-[#809D8E] hover:text-white cursor-pointer"
        >
          Sign Out
        </button>
        <button
          onClick={getPatients}
          className="w-full h-12 bg-[#BEEBD4] text-[#1D3D27] font-semibold rounded-md hover:bg-[#809D8E] hover:text-white cursor-pointer"
        >
          Go to Tables page
        </button>
      </div>
    </>
  );
}
