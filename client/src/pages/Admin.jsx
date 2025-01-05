import React from "react";
import { useLoaderData, redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
import Wrapper from "../assets/wrappers/StatsContainer";
import { toast } from "react-toastify";
import { StatItem } from "../assets/components";
import { IoPeople } from "react-icons/io5";

export const loader = async () => {
  try {
    const response = await customFetch.get("/users/admin/app-stats");
    return response.data;
  } catch (error) {
    toast.error("Admin Only");
    return redirect("/dashboard");
  }
};

const Admin = () => {
  const { users, patient } = useLoaderData();
  return (
    <Wrapper>
      <StatItem
        title="จำนวน Admin ในระบบ"
        count={`${users} คน`}
        color="#e9b949"
        bcg="#fcefc7"
        icon={<IoPeople />}
      />
      <StatItem
        title="จำนวนคนไข้ในระบบ"
        count={`${patient} คน`}
        color="#647acb"
        bcg="#e0e8f9"
        icon={<IoPeople />}
      />
    </Wrapper>
  );
};

export default Admin;
