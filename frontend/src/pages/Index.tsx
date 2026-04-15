import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import AIFeatures from "@/components/landing/AIFeatures";
import Services from "@/components/landing/Services";
import Registration from "@/components/landing/Registration";
import Gallery from "@/components/landing/Gallery";
import About from "@/components/landing/About";
import Testimonials from "@/components/landing/Testimonials";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";
import SEOHead from "@/components/SEOHead";

const Index = () => {
  return (
    <>
      <SEOHead
        title="TikTechno | AI Wedding Planner - Plan Your Dream Wedding"
        description="Plan your perfect wedding with TikTechno's AI-powered wedding planner. Smart checklists, guest management, budget tracking, and custom invitations - all in one place."
        keywords="AI wedding planner, wedding planning app, guest management, wedding budget, digital invitations, wedding checklist, AI assistant"
        canonicalUrl="https://tiktechno.com/"
      />
      <div className="min-h-screen landing-theme">
        <header>
          <Navigation />
        </header>
        <main>
          <Hero />
          <AIFeatures />
          <Services />
          <Registration />
          <Gallery />
          <About />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
