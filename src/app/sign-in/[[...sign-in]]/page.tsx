import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="mt-10 flex justify-center">
      <SignIn />
    </main>
  );
}
