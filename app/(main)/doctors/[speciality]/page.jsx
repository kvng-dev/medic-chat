"use client";

import { useParams } from "next/navigation";

const SpecialityPage = async ({ params }) => {
  const { speciality } = await params;
  return <div>SpecialityPage: {speciality}</div>;
};
export default SpecialityPage;
