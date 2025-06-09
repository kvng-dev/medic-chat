import { PricingTable } from "@clerk/nextjs";
import { Card, CardContent } from "./ui/card";

const Pricing = () => {
  return (
    <Card className="bg-gradient-to-r from-emerald-950/30 to-transparent">
      <CardContent className="p-6 md:p-8">
        <PricingTable
          checkoutProps={{
            appearance: {
              elements: {
                drawerRoot: {
                  zIndex: 200,
                },
              },
            },
          }}
        />
      </CardContent>
    </Card>
  );
};
export default Pricing;
