import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "How It Works", href: "/how-it-works" },
    ],
    company: [
      { name: "My Wardrobe", href: "/my-wardrobe" },
      { name: "Generate Look", href: "/get-started" },
      { name: "Profile", href: "/profile" },
    ],
  };

  return (
    <footer className="w-full bg-card border-t border-border transition-colors duration-300">
      <div className="mx-auto px-4 py-16 sm:px-6 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-xl">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <Link href="/" className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-yellow-500 bg-clip-text text-transparent">
                LibassAI
              </Link>
            </div>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground">
              Your intelligent wardrobe assistant, bringing the perfect blend of
              Pakistani fashion heritage and cutting-edge AI technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="min-w-[200px]">
            <h3 className="mb-6 text-xl font-black text-foreground uppercase tracking-widest">
              Explore
            </h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-lg font-bold text-muted-foreground hover:text-emerald-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm font-bold text-muted-foreground">
            © {currentYear} LibassAI. Crafted with passion for Pakistani fashion.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-muted-foreground hover:text-emerald-600 transition-all font-bold">Twitter</a>
            <a href="#" className="text-muted-foreground hover:text-emerald-600 transition-all font-bold">Instagram</a>
            <a href="#" className="text-muted-foreground hover:text-emerald-600 transition-all font-bold">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

