import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";

export const Logo = () => {
  return (
    <div className="center z-50 gap-4 test">
      <ThemeToggle />

      <Image
        //src={`/images/logo-${theme === "dark" ? "white" : "black"}.png`}
        src={`/images/logo-dark.png`}
        width={200}
        height={100}
        className="h-9 w-auto"
      />
    </div>
  );
};
