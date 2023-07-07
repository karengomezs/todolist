import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header>
      <nav className="flex justify-between items-center bg-orange-500 py-4 px-6 md:px-56 text-white">
        <h3 className="font-bold text-xl ">Remembering</h3>
        <UserButton afterSignOutUrl="/" />
      </nav>
    </header>
  );
}
