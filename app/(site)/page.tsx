import Hero from "@/components/home/Hero";
import PackageFan from "@/components/home/PackageFan";
import Stats from "@/components/home/Stats";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseVMF from "@/components/home/WhyChooseVMF";
import TripCategories from "@/components/home/TripCategories";
import TripBuilderCTA from "@/components/home/TripBuilderCTA";
import OffersStrip from "@/components/home/OffersStrip";
import Testimonials from "@/components/home/Testimonials";
import HowItWorks from "@/components/home/HowItWorks";
import CTABanner from "@/components/home/CTABanner";
import { getAllDestinations, getAllPackages, getPublishedOffers } from "@/lib/queries";

export default async function HomePage() {
  const [destinations, packages, offers] = await Promise.all([
    getAllDestinations(),
    getAllPackages(),
    getPublishedOffers(),
  ]);

  const suggestions = packages.map((p) => ({
    title: p.title,
    slug: p.slug,
    destination: p.destination,
    heroImage: p.heroImage,
    fromPrice: p.fromPrice,
    priceOnRequest: p.priceOnRequest,
    duration: p.duration,
  }));

  const featured = packages.filter((p) => p.featured);
  // Show 5 cards in the Featured Journeys fan: featured first, then top up with
  // other packages so it's always full even if fewer than 5 are flagged featured.
  const fanPackages = [
    ...featured,
    ...packages.filter((p) => !p.featured),
  ].slice(0, 5);

  return (
    <main>
      <Hero suggestions={suggestions} destinations={destinations} />
      <PackageFan packages={fanPackages} />
      <OffersStrip offers={offers} />
      <Stats />
      <TripCategories />
      <TripBuilderCTA />
      <FeaturedPackages />
      <WhyChooseVMF />
      <Testimonials />
      <HowItWorks />
      <CTABanner />
    </main>
  );
}
