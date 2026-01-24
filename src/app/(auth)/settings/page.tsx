import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { businesses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateSettings } from "@/server/actions/update-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await currentUser();
  if (!user) redirect("/login");

  const business = await db.query.businesses.findFirst({
    where: eq(businesses.ownerId, user.id),
  });

  if (!business) return <div>Business not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your business preferences and integrations.
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reputation Management</CardTitle>
            <CardDescription>
              Control where your happy customers are sent.
            </CardDescription>
          </CardHeader>
          <form action={async (formData: FormData) => {
            await updateSettings(formData);
          }}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleReviewLink">Google Review Link</Label>
                <Input 
                    id="googleReviewLink" 
                    name="googleReviewLink" 
                    placeholder="https://g.page/r/..." 
                    defaultValue={business.googleReviewLink || ''}
                />
                <p className="text-[0.8rem] text-muted-foreground">
                    Copy the &quot;Share Review Form&quot; link from your Google Business Profile.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Integration</CardTitle>
            <CardDescription>
              Your connected WhatsApp Business Account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label>Phone Number ID</Label>
                <div className="p-3 bg-slate-100 rounded-md font-mono text-sm text-slate-600">
                    {process.env.WHATSAPP_PHONE_NUMBER_ID || 'Not Configured'}
                </div>
             </div>
             <p className="text-[0.8rem] text-muted-foreground">
                To update this, contact support or changing your Environment Variables.
             </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
