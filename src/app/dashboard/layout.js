"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavigationDashboard from "../Components/MainComponents/NavigationDashboard";
import { useRouter } from "next/navigation";
import FooterDashboard from "../Components/MainComponents/FooterDashboard";

export default function RootLayout({ children }) {
  const [isNav, setIsNav] = useState(true);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [myLink, setMyLink] = useState("");
  const router = useRouter();

  // Compute myLink directly in the render to avoid unnecessary state updates
  const myLinkFormatted = pathname
    .slice(1) // Remove the first "/"
    .split("/")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("/");

  useEffect(() => {
    const token = localStorage.getItem("Token");
    if (!token) {
      router.push("/dashboard/login");
    }
  }, [router]); // Added 'router' to the dependency array

  useEffect(() => {
    // Only update navigation visibility based on pathname
    setIsNav(!pathname.includes("/dashboard/login"));
  }, [pathname]);

  return (
    <div className="w-[100vw] flex flex-col items-center bg-green-100">
      <div className="w-[97%] md:w-[90%]">
        {isNav && <NavigationDashboard open={open} setOpen={setOpen} />}
      </div>
      <div className="flex w-[97%] md:w-[90%] flex-col ">
        <div className="w-full min-h-[85vh]">
          {isNav && <h2 className="text-l px-3 my-5"> {myLinkFormatted}</h2>}
          <div>{children}</div>
        </div>
        {isNav && <FooterDashboard />}
      </div>
    </div>
  );
}
