import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import MeetPISection from "./components/MeetPISection";
import BenefitsSection from "./components/BenefitsSection";
import EnrollmentSection from "./components/EnrollmentSection";
import ConsultationSection from "./components/ConsultationSection";
import ContactSection from "./components/ContactSection";
import FloatingCTA from "./components/FloatingCTA";
import FAQSection from "./components/FAQSection";
import ParticipationBenefitsSection from "./components/ParticipationBenefitsSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ParticipationBenefitsSection />
      <AboutSection />
      <MeetPISection />
      <BenefitsSection />
      <EnrollmentSection />
      <FAQSection />
      <ConsultationSection />
      <ContactSection />
      <Footer />
      <FloatingCTA />
    </>
  );
}
