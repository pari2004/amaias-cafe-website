import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-dark">
      <Navbar />
      <Hero />
      
      {/* Placeholder for future sections */}
      <section className="h-screen flex items-center justify-center border-t border-white/5">
        <p className="text-cream/50 text-xl font-light">More sections coming soon...</p>
      </section>
    </main>
  );
}
