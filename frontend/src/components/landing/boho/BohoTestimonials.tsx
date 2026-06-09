import React, { useState, useEffect, useCallback, memo } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah & Michael Johnson",
    event: "Wedding Celebration",
    rating: 5,
    text: "TikTechno made our dream wedding come true! Every detail was perfect, from the stunning lighting to the beautiful décor. Our guests are still talking about how magical everything looked.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "David Chen",
    event: "Corporate Annual Gala",
    rating: 5,
    text: "Professional, creative, and flawless execution. TikTechno transformed our venue into something spectacular. The event was a huge success and helped strengthen our company culture.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Priya Sharma",
    event: "Cultural Festival",
    rating: 5,
    text: "They understood our cultural requirements perfectly and created an authentic yet modern celebration. The attention to detail and respect for our traditions was remarkable.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Mark & Jessica Williams",
    event: "Anniversary Party",
    rating: 5,
    text: "From planning to execution, everything was seamless. The team's creativity and professionalism made our 25th anniversary celebration absolutely unforgettable.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  },
];

const StarRating = memo(({ rating }: { rating: number }) => (
  <div className="flex">
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? "fill-current" : "text-gray-300"}`}
        style={i < rating ? { color: "#C9973A" } : undefined}
      />
    ))}
  </div>
));
StarRating.displayName = "StarRating";

const TestimonialCard = memo(({ testimonial }: { testimonial: typeof testimonials[0] }) => (
  <div
    className="p-6 rounded-2xl border text-left shadow-sm hover:shadow-md transition-all duration-300"
    style={{ background: "#FFFFFF", borderColor: "rgba(201,151,58,0.2)" }}
  >
    <div className="flex justify-between items-center mb-4">
      <StarRating rating={testimonial.rating} />
      <Quote className="w-7 h-7 opacity-10" style={{ color: "#C9973A" }} />
    </div>
    <p className="text-sm leading-relaxed italic mb-4" style={{ color: "#6B5744" }}>
      "{testimonial.text}"
    </p>
    <div className="flex items-center gap-3 pt-2" style={{ borderTop: "1px solid rgba(201,151,58,0.1)" }}>
      <img
        src={testimonial.image}
        alt={testimonial.name}
        className="w-10 h-10 rounded-full object-cover"
        style={{ border: "2px solid rgba(201,151,58,0.3)" }}
        loading="lazy"
      />
      <div>
        <div className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}>
          {testimonial.name}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#C9973A" }}>
          {testimonial.event}
        </div>
      </div>
    </div>
  </div>
));
TestimonialCard.displayName = "TestimonialCard";

export const BohoTestimonials: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleIndicatorClick = useCallback((index: number) => {
    setCurrentTestimonial(index);
  }, []);

  return (
    <section
      id="testimonials"
      className="py-28"
      style={{ background: "#F7F0E6", borderTop: "1px solid rgba(201,151,58,0.1)", borderBottom: "1px solid rgba(201,151,58,0.1)" }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#C9973A" }}>
            Client Praises
          </p>
          <h2
            className="text-4xl sm:text-5xl font-black uppercase mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}
          >
            Words of{" "}
            <span style={{ color: "#C9973A" }}>Endearment</span>
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#6B5744" }}>
            Discover what our beautiful couples and corporate clients say about their bespoke experiences.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-3xl mx-auto mb-10">
          <div
            className="rounded-2xl p-8 sm:p-12 text-left relative shadow-lg overflow-hidden"
            style={{ background: "#FFFFFF", border: "1px solid rgba(201,151,58,0.2)" }}
          >
            <Quote
              className="absolute top-8 right-8 w-16 h-16 opacity-[0.07]"
              style={{ color: "#C9973A" }}
            />
            <div className="space-y-6">
              <StarRating rating={testimonials[currentTestimonial].rating} />
              <p
                className="text-base sm:text-lg italic leading-relaxed"
                style={{ color: "#3B2A1A" }}
              >
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="flex items-center gap-4 pt-3" style={{ borderTop: "1px solid rgba(201,151,58,0.12)" }}>
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-14 h-14 rounded-full object-cover"
                  style={{ border: "2px solid #C9973A" }}
                  loading="lazy"
                />
                <div>
                  <div className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif", color: "#1A1208" }}>
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#C9973A" }}>
                    {testimonials[currentTestimonial].event}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2.5 mb-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className="h-2.5 rounded-full transition-all duration-300"
              style={{
                background: index === currentTestimonial ? "#C9973A" : "rgba(201,151,58,0.25)",
                width: index === currentTestimonial ? "20px" : "10px",
              }}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* All Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BohoTestimonials;
