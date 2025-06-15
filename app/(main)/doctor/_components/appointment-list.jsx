"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, CalendarSearch } from "lucide-react";
import AppointmentCard from "./appointments";

const DoctorAppointmentList = ({ appointments }) => {
  return (
    <div>
      <Card className="border-emerald-900/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center">
            <CalendarCheck className="h-5 w-5 mr-2 text-emerald-400" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  userRole="DOCTOR"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarSearch className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-xl font-medium text-white mb-2">
                No upcoming appointmnents
              </h3>
              <p className="text-shadow-muted">
                You&apos;t have any scheduled appointments yet. Make sure
                you&apos;ve set your availability to allow patients to book
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default DoctorAppointmentList;
