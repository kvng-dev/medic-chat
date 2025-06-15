import {
  getPendingDoctors,
  getPendingPayouts,
  getVerifiedDoctors,
} from "@/actions/admin";
import { TabsContent } from "@/components/ui/tabs";
import PendingDoctors from "./_components/PendingDoctors";
import VerifiedDoctors from "./_components/VerifiedDoctors";
import PendingPayout from "./_components/pending-payout";

const AdminPage = async () => {
  const [pendingDoctorsData, verifiedDoctorsData, pendingPayoutData] =
    await Promise.all([
      getPendingDoctors(),
      getVerifiedDoctors(),
      getPendingPayouts(),
    ]);
  return (
    <>
      <TabsContent value="pending">
        <PendingDoctors doctors={pendingDoctorsData.doctors || []} />
      </TabsContent>
      <TabsContent value="doctors">
        <VerifiedDoctors doctors={verifiedDoctorsData.doctors || []} />
      </TabsContent>
      <TabsContent value="payouts">
        <PendingPayout payouts={pendingPayoutData.payouts || []} />
      </TabsContent>
    </>
  );
};
export default AdminPage;
