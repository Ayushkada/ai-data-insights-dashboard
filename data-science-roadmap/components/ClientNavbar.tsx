"use client";
import { Navbar } from "@/components/tabs/navbar";
import { useDataContext } from "@/components/data-provider";

export function ClientNavbar() {
  const { navbarRefreshKey } = useDataContext();
  return <Navbar key={navbarRefreshKey} />;
} 