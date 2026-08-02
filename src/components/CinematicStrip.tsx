import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const brands = [
  { name: "Alazab Group", logo: "/brands/logo1.png", url: "https://alazab.com" },
  { name: "UberFix", logo: "/brands/logo2.png", url: "https://uberfix.alazab.com" },
  { name: "Luxury Finishing", logo: "/brands/logo3.png", url: "https://luxury-finishing.alazab.com" },
  { name: "Brand Identity", logo: "/brands/logo4.png", url: "https://brand-identity.alazab.com" },
  { name: "Laban Alasfour", logo: "/brands/laban-alasfour.png", url: "https://laban-alasfour.alazab.com" },
  { name: "Alazab", logo: "/brands/logo5.png", url: "https://alazab.com" },
];

const CinematicStrip = () => {
  const { lang } = useLanguage();
  const group = [...brands, ...brands];


  const title = lang === "ar" ? "علاماتنا التجارية" : "Our Brands";
  const subtitle =
    lang === "ar"
      ? "شركاء النجاح تحت مظلة مجموعة العزب"
      : "Success partners under the Alazab Group umbrella";

  return (
    <section id="platforms" className="py-20 overflow-hidden bg-background">
      <div className="container text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mb-3">
            {title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

        <div className="flex items-center animate-scroll-strip w-max">
          {doubled.map((brand, i) => (
            <a
              key={`${brand.name}-${i}`}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 mx-10 md:mx-14"
              aria-label={brand.name}
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-24 md:h-28 w-auto object-contain"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CinematicStrip;
