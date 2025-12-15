import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountView from "./AccountView";

export default async function AccountInfoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    redirect("/pending");
  }

  return <AccountView profile={profile} userId={user.id} />;
}
