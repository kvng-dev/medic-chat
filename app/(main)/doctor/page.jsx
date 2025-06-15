import { getCurrentUser } from "@/actions/onboarding";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import AppointmentSettings from "./_components/appointments";
import { getDoctorAppointments, getDoctorAvailability } from "@/actions/doctor";
import AvailabilitySettings from "./_components/availabilty";
import DoctorAppointmentList from "./_components/appointment-list";

const DoctorDashboard = async () => {
  const user = await getCurrentUser();

  const [appointmentsData, availabilityData] = await Promise.all([
    getDoctorAppointments(),
    getDoctorAvailability(),
  ]);

  if (user?.role !== "DOCTOR") redirect("/onboarding");
  if (user?.verificationStatus !== "VERIFIED") redirect("/doctor/verification");
  return (
    <Tabs
      defaultValue="appointments"
      className="grid grid-cols-1 md:grid-cols-4 gap-6"
    >
      <TabsList className="md:col-span-1 bg-muted/30 border h-14 md:h-28 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-b-md md:space-y-2 sm:space-x-2 md:space-x-0">
        <TabsTrigger
          value="appointments"
          className="w-full flex items-center justify-start px-4"
        >
          <Calendar className="h-4 w-4 mr-2 hidden md:inline" />
          <span>Appointments</span>
        </TabsTrigger>
        <TabsTrigger
          value="availability"
          className="w-full flex  items-center justify-start px-4"
        >
          <Clock className="h-4 w-4 mr-2 hidden md:inline" />
          <span>Availability</span>
        </TabsTrigger>
      </TabsList>

      <div className="md:col-span-3">
        <TabsContent className="border-none p-0" value="appointments">
          <DoctorAppointmentList
            appointments={appointmentsData.appointments || []}
          />
        </TabsContent>
        <TabsContent className="border-none p-0" value="availability">
          <AvailabilitySettings slots={availabilityData.slots} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
export default DoctorDashboard;
