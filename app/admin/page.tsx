import { redirect } from "next/navigation";

export default function AdminIndexPage() {
  // Langsung arahkan (redirect) dari /admin ke /admin/dashboard
  redirect("/admin/dashboard");
}
