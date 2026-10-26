import { MessageCircle, PhoneCall } from 'lucide-react';
import { formatBangladeshPhone, toBangladeshTel } from '@/lib/phone';
import { SALES_PHONE, whatsappHref } from '@/lib/site';

const WHATSAPP_MESSAGE = 'Hi, I need help finding a part or equipment for my engine. Could you assist me?';

export function MobileContactBar() {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-[#d8d5ca] bg-[#f8f7f3]/95 backdrop-blur-xl lg:hidden"
    >
      <div className="grid grid-cols-2 pb-[env(safe-area-inset-bottom)]">
        <a
          href={toBangladeshTel(SALES_PHONE)}
          data-analytics="mobile-bar"
          className="flex min-h-14 items-center justify-center gap-2 border-r border-[#d8d5ca] px-3 text-sm font-semibold text-[#17221f] transition-colors hover:bg-[#ebe7dc]"
        >
          <PhoneCall className="h-4 w-4" />
          <span>Call us</span>
          <span className="sr-only">{formatBangladeshPhone(SALES_PHONE)}</span>
        </a>
        <a
          href={whatsappHref(WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics="mobile-bar"
          className="flex min-h-14 items-center justify-center gap-2 bg-[#25D366] px-3 text-sm font-semibold text-white transition-colors hover:bg-[#20ba5a]"
        >
          <MessageCircle className="h-4 w-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
