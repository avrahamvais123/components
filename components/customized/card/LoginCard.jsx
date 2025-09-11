import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function LoginCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="">יצירת חשבון</CardTitle>
        <CardDescription>התחבר או צור חשבון חדש</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                placeholder="הכנס את האימייל שלך"
              />
            </div>
            <Button>התחבר</Button>
          </div>
          <div className="relative my-4 flex items-center justify-center overflow-hidden">
            <Separator />
            <div className="px-2 text-center bg-background text-sm">או</div>
            <Separator />
          </div>
          <div className="grid w-full gap-2">
            <Button variant="outline">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 488 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
              >
                <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              התחבר עם גוגל
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
