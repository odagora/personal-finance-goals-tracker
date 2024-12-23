import { Link } from 'react-router-dom';
import { TwitterIcon, FacebookIcon, InstagramIcon, LinkedInIcon } from '@/assets/icons/social';

interface FooterColumnProps {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              to={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    about: [
      { label: 'Company', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ],
    resources: [
      { label: 'Blog', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'Guides', href: '#' },
    ],
    legal: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Security', href: '#' },
    ],
  };

  return (
    <footer className="border-t bg-slate-950 text-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 justify-items-center">
          {/* Footer Columns */}
          <FooterColumn title="About" links={footerLinks.about} />
          <FooterColumn title="Resources" links={footerLinks.resources} />
          <FooterColumn title="Legal" links={footerLinks.legal} />

          {/* Logo and Social Links */}
          <div className="space-y-4">
            <Link to="/" className="text-lg font-semibold">
              Stay Connected
            </Link>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <TwitterIcon />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <FacebookIcon />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <InstagramIcon />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} Personal Finance Goals Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
