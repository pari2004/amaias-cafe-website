import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import CoffeeExperience from "@/components/CoffeeExperience";
import FoodExperience from "@/components/FoodExperience";
import FindYourCorner from "@/components/FindYourCorner";
import GreenEscape from "@/components/GreenEscape";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Visit from "@/components/Visit";
import FinalCTA from "@/components/FinalCTA";

/**
 * The page is sequenced as a single arc rather than a stack of sections:
 *
 *   curiosity → comfort → taste → immersion → calm → trust → discovery → action
 *
 * Each section owns a distinct motion language (unmasking, pinned
 * sequence, assembling bento, stacked cinema, breathing, editorial
 * layering, drifting discovery) so the scroll never repeats itself.
 */

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative bg-ink">
        <Hero />
        <Story />
        <CoffeeExperience />
        <FoodExperience />
        <FindYourCorner />
        <GreenEscape />
        <Reviews />
        <Gallery />
        <Visit />
        <FinalCTA />
      </main>
    </>
  );
}
