import Hero from "@/components/home/Hero";
import PopularDestinations from "@/components/home/PopularDestinations";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseVMF from "@/components/home/WhyChooseVMF";
import TripCategories from "@/components/home/TripCategories";
import Testimonials from "@/components/home/Testimonials";
import HowItWorks from "@/components/home/HowItWorks";
import CTABanner from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <PopularDestinations />
      <FeaturedPackages />
      <WhyChooseVMF />
      <TripCategories />
      <Testimonials />
      <HowItWorks />
      <CTABanner />
    </main>
  );
}
