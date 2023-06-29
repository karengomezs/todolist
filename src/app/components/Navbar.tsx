import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header>
      <nav className="flex justify-between items-center py-4 px-6 text-white">
        <h3 className="font-bold text-xl text-slate-500">Remembering</h3>
        <UserButton afterSignOutUrl="/" />
      </nav>
    </header>
  );
}
