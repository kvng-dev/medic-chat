"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Stethoscope, User } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setUserRole } from "@/actions/onboarding";
import { Label } from "@/components/ui/label";
import { SPECIALTIES } from "@/lib/specialities";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const doctorSchema = z.object({
  specialty: z.string().min(1, "specialty is required"),
  experience: z
    .number()
    .min(1, "experience must be at least 1 year")
    .max(70, "experience must be at least 70 years"),
  credentialUrl: z
    .string()
    .url("Please enter a valid URL")
    .min(1, "credential URL is required"),
  description: z
    .string()
    .min(20, "description must be at least 20 characters")
    .max(1000, "description must be at least 1000 characters"),
});
const OnboardingPage = () => {
  const [step, setStep] = useState("choose-role");
  const router = useRouter();
  const { data, fn: submitUserRole, loading } = useFetch(setUserRole);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      specialty: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  const specialtyValue = watch("specialty");

  const handlePatientSelection = async () => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "PATIENT");

    await submitUserRole(formData);
  };

  const onDocSubmit = async (data) => {
    if (loading) return;

    const formData = new FormData();
    formData.append("role", "DOCTOR");
    formData.append("specialty", data.specialty);
    formData.append("experience", data.experience);
    formData.append("credentialUrl", data.credentialUrl);
    formData.append("description", data.description);

    await submitUserRole(formData);
  };

  useEffect(() => {
    if (data && data.success) {
      toast.success("Role Selected");
      router.push(data.redirect);
    }
  }, [data]);

  if (step === "choose-role") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
          onClick={() => !loading && handlePatientSelection()}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <User className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className={`text-xl font-semibold text-white mb-2`}>
              Join as a Patient
            </CardTitle>
            <CardDescription className="mb-4">
              Book appointments, consult with doctors, manage your healthcare
              journey
            </CardDescription>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                " Continue as a Patient"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
          onClick={() => !loading && setStep("doctor-form")}
        >
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <Stethoscope className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className={`text-xl font-semibold text-white mb-2`}>
              Join as Doctor
            </CardTitle>
            <CardDescription className="mb-4">
              Create your professional profile, set your availability, and
              provide consultations
            </CardDescription>
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 mt-2"
              disabled={loading}
            >
              Continue as Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "doctor-form") {
    return (
      <Card className="border-emerald-900/20">
        <CardContent className="pt-6">
          <div className="mb-6">
            <CardTitle className={`text-2xl font-semibold text-white mb-2`}>
              Complete Your Doctor Profile
            </CardTitle>
            <CardDescription className="mb-4">
              Please provide your professional details for verification
            </CardDescription>
            <form className="space-y-6" onSubmit={handleSubmit(onDocSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="specialty">Medical Specialty</Label>
                <Select
                  value={specialtyValue}
                  onValueChange={(value) => setValue("specialty", value)}
                >
                  <SelectTrigger id="specialty" className="w-full">
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map((specialty) => (
                      <SelectItem key={specialty.name} value={specialty.name}>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">
                            {specialty.icon}
                          </span>
                        </div>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.specialty && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.specialty.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  placeholder="eg. 5"
                  {...register("experience", { valueAsNumber: true })}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.experience.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentialUrl">
                  Link to Credential Document
                </Label>
                <Input
                  id="credentialUrl"
                  type="url"
                  placeholder="https://example.com/my-medical-degree.pdf"
                  {...register("credentialUrl")}
                />
                {errors.credentialUrl && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.credentialUrl.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Please provide a link to your medical degree or certification
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description of your Services
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your expertise, services, & approach to patient care..."
                  rows="4"
                  className="resize-none"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("choose-role")}
                  className="border-emerald-900/30"
                  disabled={loading}
                >
                  Back
                </Button>

                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Verification"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    );
  }
  return <div>OnboardingPage</div>;
};
export default OnboardingPage;
