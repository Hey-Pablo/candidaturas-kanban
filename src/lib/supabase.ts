// Cliente Supabase para o Candidaturas Kanban
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pajmbdckrjbfnqcsrszr.supabase.co";
const supabaseAnonKey =
  "sb_publishable_VAiUdeWMKikC17K4uxAv2Q_KMJc0geW";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseCard = {
  id: string;
  board_id: string;
  empresa: string;
  cargo: string;
  link: string;
  data: string;
  validade: string;
  notas: string;
  coluna: string;
  created_at: string;
  updated_at: string;
};
