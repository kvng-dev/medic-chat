import { verifyAdmin } from "@/actions/admin";
import PageHeader from "@/components/page-header";
import { AlertCircle, CreditCard, ShieldCheck, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Admin Settings - MedicChat",
  description: "Manage doctors, patients, & platform settings",
};
const AdminLayout = async ({ children }) => {
  const isAdmin = await verifyAdmin();

  if (!isAdmin) redirect("/onboarding");
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader icon={<ShieldCheck />} title={"Admin Settings"} />

      <Tabs
        defaultValue="pending"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <TabsList className="md:col-span-1 bg-muted/30 border h-14 md:h-36 flex sm:flex-row md:flex-col w-full p-2 md:p-1 rounded-b-md md:space-y-2 sm:space-x-2 md:space-x-0">
          <TabsTrigger
            value="pending"
            className="w-full flex items-center justify-start px-4 py-2"
          >
            <AlertCircle className="h-4 w-4 mr-2 hidden md:inline" />
            <span>Pending Verification</span>
          </TabsTrigger>
          <TabsTrigger
            value="doctors"
            className="w-full flex  items-center justify-start px-4 py-2"
          >
            <Users className="h-4 w-4 mr-2 hidden md:inline" />
            <span>Doctors</span>
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="w-full flex  items-center justify-start px-4 py-2"
          >
            <CreditCard className="h-4 w-4 mr-2 hidden md:inline" />
            <span>Payouts</span>
          </TabsTrigger>
        </TabsList>
        <div className="md:col-span-3">{children}</div>
      </Tabs>
    </div>
  );
};
export default AdminLayout;
