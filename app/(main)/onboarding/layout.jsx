import { getCurrentUser } from "@/actions/onboarding";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Onboarding - MedicChat",
  description: "Complete your profile to get started with MedicChat",
};

const OnboardingLayout = async ({ children }) => {
  const user = await getCurrentUser();

  if (user) {
    if (user.role === "PATIENT") {
      redirect("/doctors");
    } else if (user.role === "DOCTOR") {
      if (user.verificationStatus === "VERIFIED") {
        redirect("/doctor");
      } else {
        redirect("/doctor/verification");
      }
    } else if (user.role === "ADMIN") {
      redirect("/admin");
    }
  }
  return (
    <div className="container mx-auto py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl gradient-title mb-2">
            Welcome to MediChat
          </h1>
          <p className="text-lg text-muted-foreground">
            Tell us how you want to use the platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};
export default OnboardingLayout;
