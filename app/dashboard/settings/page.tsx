import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SettingsView from "./SettingsView";
import type { Database } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const metadata = {
  title: "Settings - Erki Dashboard",
  description: "Manage your account settings and preferences",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (error || !profile) {
    console.error("Error fetching profile:", error);
    redirect("/");
  }

  // On passe le profil au composant Client pour l'affichage animé
  return <SettingsView profile={profile} />;
}