import { MessageCircle, PhoneCall } from 'lucide-react';
import { formatBangladeshPhone, toBangladeshTel } from '@/lib/phone';
import { SALES_PHONE, whatsappHref } from '@/lib/site';

const WHATSAPP_MESSAGE = 'Hi, I need help finding a part or equipment for my engine. Could you assist me?';

export function MobileContactBar() {
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-rule-2 bg-paper-2 lg:hidden"
    >
      <div className="grid grid-cols-2 pb-[env(safe-area-inset-bottom)]">
        <a
          href={toBangladeshTel(SALES_PHONE)}
          data-analytics="mobile-bar"
          className="flex min-h-14 items-center justify-center gap-2 border-r border-rule-2 px-3 text-sm font-medium text-ink transition-colors hover:bg-paper-3"
        >
          <PhoneCall className="h-4 w-4" aria-hidden="true" />
          <span>Call us</span>
          <span className="visually-hidden">{formatBangladeshPhone(SALES_PHONE)}</span>
        </a>
        <a
          href={whatsappHref(WHATSAPP_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          data-analytics="mobile-bar"
          className="flex min-h-14 items-center justify-center gap-2 bg-accent px-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent/85"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
      </div>
    </nav>
  );
}
