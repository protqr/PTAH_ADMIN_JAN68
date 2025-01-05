import React from "react";
import { ChartsContainer, StatsContainer } from "../assets/components";
import customFetch from "../utils/customFetch";
import { useLoaderData } from "react-router-dom";

export const loader = async () => {
  try {
    const response = await customFetch.get("/allusers/stats");
    return response.data;
  } catch (error) {
    console.error("Error loading stats:", error);
    return { error: "Failed to load stats" };
  }
};


const Stats = () => {
  const { defaultStats, monthlyApplications } = useLoaderData();

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 1 && (
        <ChartsContainer data={monthlyApplications} />
      )}

    </>
  );
};

export default Stats;
