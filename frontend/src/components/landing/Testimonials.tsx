import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useState, useEffect, useCallback, memo } from "react";

const testimonials = [
  {
    name: "Sarah & Michael Johnson",
    event: "Wedding Celebration",
    rating: 5,
    text: "TikTechno made our dream wedding come true! Every detail was perfect, from the stunning lighting to the beautiful décor. Our guests are still talking about how magical everything looked.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "David Chen",
    event: "Corporate Annual Gala",
    rating: 5,
    text: "Professional, creative, and flawless execution. TikTechno transformed our venue into something spectacular. The event was a huge success and helped strengthen our company culture.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Priya Sharma",
    event: "Cultural Festival",
    rating: 5,
    text: "They understood our cultural requirements perfectly and created an authentic yet modern celebration. The attention to detail and respect for our traditions was remarkable.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    name: "Mark & Jessica Williams",
    event: "Anniversary Party",
    rating: 5,
    text: "From planning to execution, everything was seamless. The team's creativity and professionalism made our 25th anniversary celebration absolutely unforgettable.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  }
];

const StarRating = memo(({ rating }: { rating: number }) => (
  <div className="flex">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-landing-accent fill-current" : "text-landing-muted-foreground"
        }`}
      />
    ))}
  </div>
));

StarRating.displayName = "StarRating";

const TestimonialCard = memo(({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <Card 
    className="hover:shadow-glow transition-shadow duration-300 bg-landing-card border-landing-border"
    style={{ contain: 'layout paint' }}
  >
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <StarRating rating={testimonial.rating} />
        <Quote className="w-6 h-6 text-landing-accent/40" />
      </div>
      <p className="text-landing-muted-foreground mb-4 leading-relaxed">
        "{testimonial.text}"
      </p>
      <div className="flex items-center space-x-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover border border-landing-border"
          loading="lazy"
          decoding="async"
          width={48}
          height={48}
        />
        <div>
          <div className="font-semibold text-landing-foreground">
            {testimonial.name}
          </div>
          <div className="text-sm text-landing-accent">
            {testimonial.event}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
));

TestimonialCard.displayName = "TestimonialCard";

const Testimonials = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleIndicatorClick = useCallback((index: number) => {
    setCurrentTestimonial(index);
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-landing-background" style={{ contain: 'layout' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-landing-foreground">
            What Our <span className="text-gradient-purple">Clients Say</span>
          </h2>
          <p className="text-xl text-landing-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our satisfied clients have to say 
            about their experience with TikTechno.
          </p>
        </header>

        {/* Featured Testimonial */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="relative overflow-hidden shadow-elegant bg-landing-card border-landing-border">
            <div className="absolute top-4 left-4 text-landing-accent/20">
              <Quote size={64} />
            </div>
            <CardContent className="p-8 md:p-12 relative">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <StarRating rating={testimonials[currentTestimonial].rating} />
                </div>
                <blockquote className="text-2xl md:text-3xl font-medium text-landing-foreground mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-landing-accent"
                    loading="lazy"
                    decoding="async"
                    width={64}
                    height={64}
                  />
                  <div className="text-left">
                    <div className="font-semibold text-lg text-landing-foreground">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-landing-accent font-medium">
                      {testimonials[currentTestimonial].event}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentTestimonial
                  ? "bg-landing-accent shadow-gold"
                  : "bg-landing-muted-foreground/30 hover:bg-landing-muted-foreground/50"
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* All Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
