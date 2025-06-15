"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  AlertCircleIcon,
  CalendarCheck,
  ChartBar,
  Coins,
  CreditCard,
  Loader2,
  TrendingUp,
  TrendingUpDownIcon,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFetch } from "@/hooks/use-fetch";
import { requestPayout } from "@/actions/payout";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
const DoctorEarning = ({ earnings, payouts }) => {
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");

  // Custom hook for payout request
  const { loading, data, fn: submitPayoutRequest } = useFetch(requestPayout);

  const {
    thisMonthEarnings = 0,
    completedAppointments = 0,
    averageEarningsPerMonth = 0,
    availableCredits = 0,
    availablePayout = 0,
  } = earnings;

  // Check if there's any pending payout
  const pendingPayout = payouts.find(
    (payout) => payout.status === "PROCESSING"
  );

  const handlePayoutRequest = async (e) => {
    e.preventDefault();

    if (!paypalEmail) {
      toast.error("PayPal email is required");
      return;
    }

    const formData = new FormData();
    formData.append("paypalEmail", paypalEmail);

    await submitPayoutRequest(formData);
  };

  useEffect(() => {
    if (data?.success) {
      setShowPayoutDialog(false);
      setPaypalEmail("");
      toast.success("Payout request submitted successfully!");
    }
  }, [data]);

  const platformFee = earnings.availableCredits * 2;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-muted-foreground text-sm">Available Credits</p>
              <div className="flex justify-between items-center">
                <p className="text-white text-2xl font-semibold">
                  {earnings.availableCredits}
                </p>

                <div className="p-3 bg-emerald-900/20 rounded-full">
                  <Coins className="text-emerald-400 h-5 w-5" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                ${earnings.availablePayout.toFixed(2)} available for payout
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-muted-foreground text-sm">This Month</p>
              <div className="flex justify-between items-center">
                <p className="text-white text-2xl font-semibold">
                  ${earnings.thisMonthEarnings.toFixed(2)}
                </p>

                <div className="p-3 bg-emerald-900/20 rounded-full">
                  <TrendingUp className="text-emerald-400 h-5 w-5" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-muted-foreground text-sm">
                Total Appointments
              </p>
              <div className="flex justify-between items-center">
                <p className="text-white text-2xl font-semibold">
                  {earnings.completedAppointment}
                </p>

                <div className="p-3 bg-emerald-900/20 rounded-full">
                  <CalendarCheck className="text-emerald-400 h-5 w-5" />
                </div>
              </div>
              <p className="text-muted-foreground text-sm">completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-muted-foreground text-sm">Avg/ Month</p>
              <div className="flex justify-between items-center">
                <p className="text-white text-2xl font-semibold">
                  ${earnings.avgEarningPerMonth.toFixed(2)}
                </p>

                <div className="p-3 bg-emerald-900/20 rounded-full">
                  <ChartBar className="text-emerald-400 h-5 w-5 rotate-270" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <CreditCard className="text-emerald-400 h-6 w-6 mr-2" />
            Payout Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/20 p-4 rounded-lg border border-emerald-900/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-white">
                Available for Payout
              </h3>
              {pendingPayout ? (
                <Badge
                  variant="outline"
                  className="bg-amber-900/20 border-amber-900/30 text-amber-400"
                >
                  PROCESSING
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-emerald-900/20 border-emerald-900/30 text-emerald-400"
                >
                  Available
                </Badge>
              )}
            </div>
            {pendingPayout ? (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Pending Credits</p>
                    <p className="text-white font-medium">
                      {pendingPayout.credits}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pending Amount</p>
                    <p className="text-white font-medium">
                      ${pendingPayout.netAmount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PayPal Email</p>
                    <p className="text-white font-medium text-xs">
                      {pendingPayout.paypalEmail}
                    </p>
                  </div>
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Your payout request is being processed. You'll receive the
                    payment once an admin approves it. Your credits will be
                    deducted after processing.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Available Credits</p>
                  <p className="text-white font-medium">{availableCredits}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payout Amount</p>
                  <p className="text-white font-medium">
                    ${availablePayout.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Platform Fee</p>
                  <p className="text-white font-medium">
                    ${platformFee.toFixed(2)}
                  </p>
                </div>
              </div>
            )}

            {!pendingPayout && availableCredits > 0 && (
              <Button
                onClick={() => setShowPayoutDialog(true)}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700"
              >
                Request Payout for All Credits
              </Button>
            )}

            {availableCredits === 0 && !pendingPayout && (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  No credits available for payout. Complete more appointments to
                  earn credits.
                </p>
              </div>
            )}
          </div>

          {/* Payout Information */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Payout Structure:</strong> You earn $8 per credit.
              Platform fee is $2 per credit. Payouts include all your available
              credits and are processed via PayPal.
            </AlertDescription>
          </Alert>

          {/* Payout History */}
          {payouts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">Payout History</h3>
              <div className="space-y-2">
                {payouts.slice(0, 5).map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/10 border border-emerald-900/10"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {format(new Date(payout.createdAt), "MMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payout.credits} credits • $
                        {payout.netAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payout.paypalEmail}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        payout.status === "PROCESSED"
                          ? "bg-emerald-900/20 border-emerald-900/30 text-emerald-400"
                          : "bg-amber-900/20 border-amber-900/30 text-amber-400"
                      }
                    >
                      {payout.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Request Payout
            </DialogTitle>
            <DialogDescription>
              Request payout for all your available credits
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePayoutRequest} className="space-y-4">
            <div className="bg-muted/20 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Available credits:
                </span>
                <span className="text-white">{availableCredits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross amount:</span>
                <span className="text-white">
                  ${(availableCredits * 10).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Platform fee (20%):
                </span>
                <span className="text-white">-${platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-emerald-900/20 pt-2 flex justify-between font-medium">
                <span className="text-white">Net payout:</span>
                <span className="text-emerald-400">
                  ${availablePayout.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paypalEmail">PayPal Email</Label>
              <Input
                id="paypalEmail"
                type="email"
                placeholder="your-email@paypal.com"
                value={paypalEmail}
                onChange={(e) => setPaypalEmail(e.target.value)}
                className="bg-background border-emerald-900/20"
                required
              />
              <p className="text-sm text-muted-foreground">
                Enter the PayPal email where you want to receive the payout.
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Once processed by admin, {availableCredits} credits will be
                deducted from your account and ${availablePayout.toFixed(2)}{" "}
                will be sent to your PayPal.
              </AlertDescription>
            </Alert>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPayoutDialog(false)}
                disabled={loading}
                className="border-emerald-900/30"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  "Request Payout"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default DoctorEarning;
