import HeroSection from "./home/heroSection";
import FeaturesSection from "./home/featuresSection";
import HowItWorksSection from "./home/howItWorksSection";
import Slider from "./home/slider";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Slider />
      <FeaturesSection />
      <HowItWorksSection />
    </div>
  );
}
