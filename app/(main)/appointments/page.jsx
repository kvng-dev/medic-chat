import { getCurrentUser } from "@/actions/onboarding";
import { getPatientAppointments } from "@/actions/patient";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/page-header";
import { CalendarHeart, CalendarRange } from "lucide-react";
import { redirect } from "next/navigation";
import AppointmentCard from "../doctor/_components/appointments";

const PatientAppointmentPage = async () => {
  const user = await getCurrentUser();

  if (!user || user.role !== "PATIENT") {
    redirect("/onboarding");
  }

  const { appointments, error } = await getPatientAppointments();

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        icon={<CalendarRange />}
        title="My Appointments"
        backLink="/doctors"
        backLabel="Find Doctors"
      />

      <Card className="border-emerald-900/20">
        <CardContent className="pt-4">
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : appointments?.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((app) => (
                <AppointmentCard
                  key={app.id}
                  appointment={app}
                  userRole="PATIENT"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarHeart className="h-12 w-12 mb-3 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-medium text-white mb-2">
                No appointments scheduled
              </h3>
              <p className="text-muted-foreground">
                You currently have no appointments. Use the "Find Doctors"
                button to schedule one.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default PatientAppointmentPage;
