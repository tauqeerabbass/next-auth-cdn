"use client";
import React, { useEffect, useState } from "react";
import { Table, Divider, Button } from "antd";
import { useRouter } from "next/navigation";

const columns = [
  { title: "Name", dataIndex: "fullName", key: "1" },
  { title: "Username", dataIndex: "username", key: "2" },
  { title: "Email", dataIndex: "email", key: "3" },
  { title: "Phone", dataIndex: "phone", key: "4" },
  { title: "DOB", dataIndex: "dob", key: "5" },
  { title: "Gender", dataIndex: "gender", key: "6" },
  { title: "Ref. No.", dataIndex: "referenceNumber", key: "7" },
  { title: "Is Active", dataIndex: "isActive", key: "8" },
];

const data = [
  {
    key: "1",
    fullName: "John Brown",
    username: "johnb123",
    email: "john.brown@example.com",
    phone: "(123) 456-7890",
    dob: "1990-05-12",
    gender: "Male",
    referenceNumber: "REF12345",
    isActive: "Yes",
  },
  {
    key: "2",
    fullName: "Jim Green",
    username: "jimg456",
    email: "jim.green@example.com",
    phone: "(987) 654-3210",
    dob: "1985-07-30",
    gender: "Male",
    referenceNumber: "REF67890",
    isActive: "No",
  },
];

const PatientComponent = () => {
  const [patientsInfo, setPatientsInfo] = useState([]);
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard");
  }

  useEffect(() => {
    const patients = localStorage.getItem("PatientsData");
    if (patients) {
      const parsedData = JSON.parse(patients);

      const arrangedData = parsedData.map((patient, index) => {
        const fullName = `${patient?.user?.first_name || ""} ${
          patient?.user?.last_name || ""
        }`;
        const username = patient?.user?.username;
        const email = patient?.user?.email;
        const phone = patient?.phone_number;
        const dob = patient?.date_of_birth;
        const gender = patient?.gender;
        const referenceNumber = patient?.reference_number;
        const isActive = patient?.user?.is_active ? "Yes" : "No";

        return {
          key: index.toString(),
          fullName,
          username,
          email,
          phone,
          dob,
          gender,
          referenceNumber,
          isActive,
        };
      });

      setPatientsInfo(arrangedData);
    }
  }, []);

  return (
    <>
      <Divider>Patient Data</Divider>
      <Table
        columns={columns}
        dataSource={patientsInfo}
        style={{ marginTop: 24 }}
      />
      <button onClick={handleBack} className="bg-blue-200 border border-blue-400 w-28 h-10 rounded-lg fixed right-2 font-semibold cursor-pointer">Go Back</button>
    </>
  );
};

export default PatientComponent;
