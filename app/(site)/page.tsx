import Hero from "@/components/home/Hero";
import PackageFan from "@/components/home/PackageFan";
import Stats from "@/components/home/Stats";
import PopularDestinations from "@/components/home/PopularDestinations";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseVMF from "@/components/home/WhyChooseVMF";
import TripCategories from "@/components/home/TripCategories";
import TripBuilderCTA from "@/components/home/TripBuilderCTA";
import Testimonials from "@/components/home/Testimonials";
import HowItWorks from "@/components/home/HowItWorks";
import CTABanner from "@/components/home/CTABanner";
import { getAllDestinations, getAllPackages } from "@/lib/queries";

export default async function HomePage() {
  const [destinations, packages] = await Promise.all([
    getAllDestinations(),
    getAllPackages(),
  ]);

  const suggestions = packages.map((p) => ({
    title: p.title,
    slug: p.slug,
    destination: p.destination,
    heroImage: p.heroImage,
    fromPrice: p.fromPrice,
    duration: p.duration,
  }));

  const featured = packages.filter((p) => p.featured);
  const fanPackages = featured.length >= 3 ? featured : packages;

  return (
    <main>
      <Hero suggestions={suggestions} destinations={destinations} />
      <PackageFan packages={fanPackages} />
      <Stats />
      <TripCategories />
      <PopularDestinations destinations={destinations} />
      <TripBuilderCTA />
      <FeaturedPackages />
      <WhyChooseVMF />
      <Testimonials />
      <HowItWorks />
      <CTABanner />
    </main>
  );
}
