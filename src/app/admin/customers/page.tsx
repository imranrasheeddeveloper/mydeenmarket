import { getCustomers } from "@/lib/admin-data";
import AdminCustomersClient from "./AdminCustomersClient";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();
  return <AdminCustomersClient customers={customers} />;
}
