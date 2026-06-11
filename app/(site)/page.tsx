import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import PopularDestinations from "@/components/home/PopularDestinations";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseVMF from "@/components/home/WhyChooseVMF";
import TripCategories from "@/components/home/TripCategories";
import Testimonials from "@/components/home/Testimonials";
import HowItWorks from "@/components/home/HowItWorks";
import CTABanner from "@/components/home/CTABanner";
import { getAllDestinations } from "@/lib/queries";

export default async function HomePage() {
  const destinations = await getAllDestinations();

  return (
    <main>
      <Hero />
      <Stats />
      <PopularDestinations destinations={destinations} />
      <FeaturedPackages />
      <WhyChooseVMF />
      <TripCategories />
      <Testimonials />
      <HowItWorks />
      <CTABanner />
    </main>
  );
}
