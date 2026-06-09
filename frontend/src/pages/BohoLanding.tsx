import React from "react";
import SEOHead from "@/components/SEOHead";
import BohoNavigation from "@/components/landing/boho/BohoNavigation";
import BohoHero from "@/components/landing/boho/BohoHero";
import BohoAIFeatures from "@/components/landing/boho/BohoAIFeatures";
import BohoServices from "@/components/landing/boho/BohoServices";
import BohoRegistration from "@/components/landing/boho/BohoRegistration";
import BohoGallery from "@/components/landing/boho/BohoGallery";
import BohoAbout from "@/components/landing/boho/BohoAbout";
import BohoTestimonials from "@/components/landing/boho/BohoTestimonials";
import BohoContact from "@/components/landing/boho/BohoContact";
import BohoFooter from "@/components/landing/boho/BohoFooter";

export const BohoLanding: React.FC = () => {
  return (
    <>
      <SEOHead
        title="TikTechno | Romantic Boho AI Wedding & Event Planner"
        description="Curate your dream event with TikTechno's AI planner. Soft floral decorations, intelligent budget tracking, seating charts, and elegant invitations."
        keywords="romantic wedding planner, boho wedding events, AI wedding organizer, floral event designs"
        canonicalUrl="https://tiktechno.com/"
      />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-500 font-display">
        <BohoNavigation />
        <main>
          <BohoHero />
          <BohoAIFeatures />
          <BohoServices />
          <BohoRegistration />
          <BohoGallery />
          <BohoAbout />
          <BohoTestimonials />
          <BohoContact />
        </main>
        <BohoFooter />
      </div>
    </>
  );
};

export default BohoLanding;

