import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header>
      <nav className="flex justify-between py-4 px-6 text-white">
        <h3 className="">Remembering App</h3>
        <UserButton afterSignOutUrl="/" />
      </nav>
    </header>
  );
}
