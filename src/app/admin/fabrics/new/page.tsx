import Link from "next/link";

import { FabricForm } from "@/components/admin/fabric-form";

export const metadata = { title: "Add fabric" };

export default function NewFabric() {
  return (
    <div className="px-5 py-10 md:px-12 md:py-12">
      <nav className="text-muted mb-8 text-[0.6rem] tracking-[0.2em] uppercase">
        <Link href="/admin/fabrics" className="hover:text-cream">
          Fabrics
        </Link>
        <span className="mx-2">/</span>
        <span className="text-cream-soft">New</span>
      </nav>

      <h1 className="mb-10 text-[clamp(1.4rem,5vw,2.2rem)]">Add cloth</h1>

      <FabricForm />
    </div>
  );
}
