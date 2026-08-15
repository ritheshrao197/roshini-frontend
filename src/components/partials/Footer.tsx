import React from "react";
import Link from "next/link";
import IndianBorder from "@/components/decorative/IndianBorder";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
];

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect vectorEffect="non-scaling-stroke" x="3" y="3" width="18" height="18" rx="5" />
      <circle vectorEffect="non-scaling-stroke" cx="12" cy="12" r="4.2" />
      <circle vectorEffect="non-scaling-stroke" cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path vectorEffect="non-scaling-stroke" d="M14.5 8.5h2V5.3c-.35-.05-1.5-.15-2.85-.15-2.82 0-4.75 1.72-4.75 4.9V13H6v3.5h3.4V23h3.6v-6.5h3.4l.5-3.5h-3.9v-2.6c0-1 .28-1.9 1.5-1.9Z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, () => React.JSX.Element> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
};

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path vectorEffect="non-scaling-stroke" d="M12 21c-4.2-4.6-6.5-8.2-6.5-11.2A6.5 6.5 0 0 1 12 3a6.5 6.5 0 0 1 6.5 6.5c0 3-2.3 6.6-6.5 11.5Z" />
      <circle vectorEffect="non-scaling-stroke" cx="12" cy="9.5" r="2.25" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path vectorEffect="non-scaling-stroke" d="M7 3.5 9.5 8 7 10c1 2.7 3.3 5 6 6l2-2.5 4.5 2.5v3a1.5 1.5 0 0 1-1.6 1.5C10.3 20.6 3.4 13.7 3 7.1A1.5 1.5 0 0 1 4.5 5.5H7Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect vectorEffect="non-scaling-stroke" x="3" y="5" width="18" height="14" rx="2" />
      <path vectorEffect="non-scaling-stroke" d="m4 6.5 8 6 8-6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle vectorEffect="non-scaling-stroke" cx="12" cy="12" r="8.5" />
      <path vectorEffect="non-scaling-stroke" d="M12 7.5V12l3 2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <>
      <IndianBorder variant="kolam" position="top" className="px-4 sm:px-6 lg:px-8" />
      <footer className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto" style={{ background: "var(--brand-brown-dark, #3C2015)", color: "var(--brand-cream)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12" style={{ borderBottom: "1px solid rgba(246, 238, 225, 0.2)" }}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center font-bold text-xl shadow-sm" style={{ borderRadius: "var(--radius-lg)", background: "var(--brand-cream)", color: "var(--brand-brown-dark, #3C2015)" }}>R</div>
                <div>
                  <div className="font-bold text-lg leading-none" style={{ fontFamily: "var(--font-serif, 'Fraunces', Georgia, serif)", color: "var(--brand-cream)" }}>Roshini&rsquo;s</div>
                  <div className="text-[10px] tracking-widest uppercase mt-1" style={{ color: "var(--brand-cream-dark)" }}>Home Products</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed max-w-xs" style={{ color: "var(--brand-cream-dark)" }}>
                Traditional nutrition crafted with love in Karnataka. Homemade quality, delivered to your door.
              </p>
              <div className="flex items-center gap-3 pt-2">
                {SOCIAL_LINKS.map(({ label, href }) => {
                  const Icon = SOCIAL_ICONS[label];
                  return (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-8 h-8 flex items-center justify-center transition-colors hover:opacity-80"
                      style={{ borderRadius: "var(--radius-md)", border: "1px solid rgba(246, 238, 225, 0.3)", color: "var(--brand-cream)" }}
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Shop</h4>
              <ul className="space-y-2.5">
                {[["All Products", "/shop"], ["Health Mixes", "/shop?category=health-mixes"], ["Herbal Teas", "/shop?category=herbal-tea"], ["Spice Powders", "/shop?category=spice"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-xs transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Account */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Account</h4>
              <ul className="space-y-2.5">
                {[["Sign In", "/login"], ["Register", "/register"], ["My Orders", "/account/dashboard"]].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-xs transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "var(--brand-cream)" }}>Contact</h4>
              <ul className="space-y-3 text-xs" style={{ color: "var(--brand-cream-dark)" }}>
                <li className="flex items-center gap-2"><MapPinIcon /><span>Karnataka, India</span></li>
                <li className="flex items-center gap-2"><PhoneIcon /><span>+91 95918 96917</span></li>
                <li className="flex items-center gap-2"><MailIcon /><span>roshinishomeproducts@gmail.com</span></li>
                <li className="flex items-center gap-2"><ClockIcon /><span>Mon–Sat: 9am – 7pm IST</span></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs" style={{ color: "var(--brand-cream-dark)" }}>
            <div>© 2026 Roshini&rsquo;s Home Products. All rights reserved.</div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <Link href="/privacy-policy" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Privacy Policy</Link>
              <Link href="/terms-of-service" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Terms of Service</Link>
              <Link href="/refund-policy" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Refund Policy</Link>
              <Link href="/shipping-policy" className="transition-colors hover:underline" style={{ color: "var(--brand-cream-dark)" }}>Shipping Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
