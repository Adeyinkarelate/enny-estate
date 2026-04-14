import { Phone, MapPin, Mail, Share2, MessageCircle, Camera } from 'lucide-react';
import { SITE_PUBLIC_EMAIL, whatsAppChatUrl } from '@/lib/site-contact';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const ceoWhatsAppHref = whatsAppChatUrl();

  return (
    <footer className="bg-[#0a1a14] text-gray-300 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4 font-heading">Enny Estate Agent</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Your trusted real estate partner in Lagos & across Nigeria. Premium properties,
              transparent deals, and professional service.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4 font-heading">Contact Us</h3>
            <ul className="space-y-3 list-none p-0 m-0">
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-[#d4af37] shrink-0" aria-hidden="true" />
                <a
                  href="tel:+2349027677640"
                  className="text-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded"
                >
                  +234 902 767 7640
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-[#d4af37] shrink-0" aria-hidden="true" />
                <a
                  href={`mailto:${SITE_PUBLIC_EMAIL}`}
                  className="text-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded"
                >
                  {SITE_PUBLIC_EMAIL}
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle size={18} className="text-[#d4af37] shrink-0" aria-hidden="true" />
                <a
                  href={ceoWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-[#d4af37] rounded"
                >
                  WhatsApp (+234 902 767 7640)
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin size={18} className="text-[#d4af37] shrink-0" aria-hidden="true" />
                <span className="text-sm">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-4 font-heading">Follow Us</h3>
            <ul className="flex flex-wrap gap-4 list-none p-0 m-0">
              <li>
                <a
                  href="#"
                  className="inline-flex p-2 bg-white/10 rounded-full hover:bg-[#d4af37] hover:text-[#0a1a14] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  aria-label="Follow us on Facebook"
                >
                  <Share2 size={20} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={ceoWhatsAppHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex p-2 bg-white/10 rounded-full hover:bg-[#d4af37] hover:text-[#0a1a14] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  aria-label="Chat with our CEO on WhatsApp"
                >
                  <MessageCircle size={20} aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="inline-flex p-2 bg-white/10 rounded-full hover:bg-[#d4af37] hover:text-[#0a1a14] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
                  aria-label="Follow us on Instagram"
                >
                  <Camera size={20} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Enny Estate Agent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
