import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/upload")
  return null
}
