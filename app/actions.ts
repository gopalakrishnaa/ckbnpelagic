"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Booking } from "./admin/page";

export const fetchNotes = async () => {
  const supabase = await createClient();
  const { data: notes } = await supabase.from("notes").select();
  return notes;
};

export const submitForm = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const name = formData.get("name")?.toString();
  const contact = Number(formData.get("phone"));
  const experience = Number(formData.get("exp"));

  const tripTypes = formData.getAll("trip") as string[];
  const tripDates = formData.getAll("date") as string[];

  const supabase = await createClient();

  await supabase.from("user").insert({ email, name, contact, experience });

  const trips = tripTypes.map((type, index) => {
    return { user_contact: contact, type, date: new Date(tripDates[index]) };
  });

  await supabase.from("trips").insert(trips).select();
};

export const fetchSpots = async (tripType: number, date: Date) => {
  const supabase = await createClient();
  const spotsFilled = await supabase
    .from("trips")
    .select("*", { count: "exact", head: true })
    .eq("type", tripType)
    .eq("date", date.toISOString().substring(0, 10));

  return !spotsFilled.count ? 10 : 10 - spotsFilled.count;
};

export const fetchBookings = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("trips")
    .select("type,date,user(name,email,contact,experience)")
    .order("date");

  return data as Booking[] | null;
};