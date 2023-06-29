import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header>
      <nav className="flex justify-between bg-emerald-900  py-4 px-24  text-white">
        <Link className="flex items-center text-3xl" href="/">
          <p className=" px-3 py-1 border rounded-full">K</p>
          <div className="ms-4 gap-3 ">
            <p>SHOP</p>
          </div>
        </Link>
        <ul className="flex justify-between items-center w-40 ">
          <li>hola hola</li>
          <li>
            <Link href="/create-product">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Link>
          </li>
          <li>
            <UserButton afterSignOutUrl="/" />
          </li>
        </ul>
      </nav>
    </header>
  );
}
