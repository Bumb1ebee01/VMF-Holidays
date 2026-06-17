import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import PopularDestinations from "@/components/home/PopularDestinations";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseVMF from "@/components/home/WhyChooseVMF";
import TripCategories from "@/components/home/TripCategories";
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
  }));

  return (
    <main>
      <Hero suggestions={suggestions} />
      <Stats />
      <WhyChooseVMF />
      <PopularDestinations destinations={destinations} />
      <FeaturedPackages />
      <TripCategories />
      <Testimonials />
      <HowItWorks />
      <CTABanner />
    </main>
  );
}
