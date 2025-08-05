import { redirect } from "next/navigation";

export default function Home() {
  const dataset = true;

  if (!dataset) {
    redirect("/upload");
  } else {
    redirect("/dashboard");
  }
}
