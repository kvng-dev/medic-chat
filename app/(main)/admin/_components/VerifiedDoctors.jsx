"use client";
import { updateDoctorActiveStatus } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetch } from "@/hooks/use-fetch";
import { Ban, Loader2, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const VerifiedDoctors = ({ doctors }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [targetDoctor, setTargetDoctor] = useState(null);

  const filteredDocs = doctors.filter((doc) => {
    const query = searchTerm.toLowerCase();
    return (
      doc.name.toLowerCase().includes(query) ||
      doc.specialty.toLowerCase().includes(query) ||
      doc.email.toLowerCase().includes(query)
    );
  });

  const {
    loading,
    data,
    fn: submitStatusUpdate,
  } = useFetch(updateDoctorActiveStatus);

  const handleStatusChange = async (doctor) => {
    const confirmed = window.confirm(
      `Are you sure you want to suspend ${doctor.name}?`
    );
    if (!confirmed || loading) return;
    const formData = new FormData();
    formData.append("doctorId", doctor.id);
    formData.append("suspend", "true");

    setTargetDoctor(doctor);
    await submitStatusUpdate(formData);
  };

  useEffect(() => {
    if (data?.success && targetDoctor) {
      toast.success(`Suspended ${targetDoctor.name} successfully`);
      setTargetDoctor(null);
    }
  }, [data]);
  return (
    <div>
      <Card className="bg-muted/20 border-emerald-900/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-white">
                Manage Doctors
              </CardTitle>
              <CardDescription>
                View & Manage all verified doctors
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                placeholder="Search doctors..."
                className="pl-8 bg-background border-emerald-900/20"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? "No doctors match your search criteria"
                : "No verified doctors available"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocs.map((doc) => (
                <Card
                  key={doc.id}
                  className="bg-background border-emerald-900/20 hover:border-emerald-700/30 transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-muted/20 rounded-full p-2">
                          <User className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{doc.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {doc.specialty} • {doc.experience} years experience
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 self-end md:self-auto">
                        <Badge
                          variant="outline"
                          className="bg-emerald-900/20 border-emerald-900/30 text-emerald-400"
                        >
                          Active
                        </Badge>
                        <Button
                          variant="outline"
                          size={"sm"}
                          onClick={() => handleStatusChange(doc)}
                          className="border-red-900/30 hover:bg-red-800/10 text-red-400"
                        >
                          {loading && targetDoctor?.id === doc.id ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Ban className="h-4 w-4 mr-1" />
                          )}
                          Suspend
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default VerifiedDoctors;
