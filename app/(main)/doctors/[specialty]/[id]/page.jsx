import {
  getAvailabilityTimeSlots,
  getDoctorById,
} from "@/actions/appointments";
import { redirect } from "next/navigation";
import DoctorProfile from "./_component/doctor-profile";

const DoctorProfilePage = async ({ params }) => {
  const { id } = await params;

  try {
    const [doctorData, slotsData] = await Promise.all([
      getDoctorById(id),
      getAvailabilityTimeSlots(id),
    ]);

    return (
      <DoctorProfile
        doctor={doctorData.doctor}
        availableDays={slotsData.days || []}
      />
    );
  } catch (error) {
    console.error("Error loading doctor profile:", error);
    redirect("/doctors");
  }
};
export default DoctorProfilePage;
