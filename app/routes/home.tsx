import type { Route } from "./+types/home";
import Navbar from "~/components/nav";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumKnight" },
    { name: "description", content: "Smart feedback for your resume to land your dream job" },
  ];
}

export default function Home() {
  return <main className="bg-[url('./images/bg-main.svg')] bg-cover"> 
  <Navbar />
    <section className="main-section">
      <div className="page-heading">
        <h1> Track your Applications & Resume Ratings</h1>
        <h2>Review your submissions and check Ai-powered feedback.</h2>
      </div>
    </section>
  </main>
}
