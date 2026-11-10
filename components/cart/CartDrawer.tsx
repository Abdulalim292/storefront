import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ClipboardList, ShoppingBag, Copy, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { CatalogImage } from '@/components/ui/CatalogImage';
import { trackEvent } from '@/lib/analytics';
import { whatsappHref } from '@/lib/site';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, changeQuantity } = useCart();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [engineDetails, setEngineDetails] = useState('');
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prepareButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const wasInquiryOpen = useRef(false);

  useEffect(() => {
    if (wasInquiryOpen.current && !isInquiryOpen) {
      prepareButtonRef.current?.focus();
    }
    wasInquiryOpen.current = isInquiryOpen;
  }, [isInquiryOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isInquiryOpen) setIsInquiryOpen(false);
        else onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const container = isInquiryOpen ? modalRef.current : drawerRef.current;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isInquiryOpen, onClose]);

  const inquiryText = [
    'Parts inquiry for Noor Alam Machineries',
    '',
    ...cart.map((item) => `${item.quantity} × ${item.name}`),
    '',
    `Engine name / model / serial: ${engineDetails || 'To be provided'}`,
  ].join('\n');

  const copyInquiry = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(inquiryText);
      } else {
        // Fallback for non-secure contexts or unsupported browsers
        const textArea = document.createElement('textarea');
        textArea.value = inquiryText;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          const successful = document.execCommand('copy');
          if (!successful) throw new Error('execCommand returned false');
        } finally {
          document.body.removeChild(textArea);
        }
      }
      setCopied(true);
      setCopyError(false);
    } catch (err) {
      console.error('Failed to copy inquiry:', err);
      setCopied(false);
      setCopyError(true);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close inquiry list"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        className={cn(
          "fixed inset-0 z-[70] bg-paper-3/80 transition-opacity duration-300",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div ref={drawerRef} role="dialog" aria-modal={isOpen || undefined} aria-hidden={!isOpen || isInquiryOpen || undefined} inert={!isOpen || isInquiryOpen} aria-labelledby="inquiry-drawer-title" className={cn(
        "sheet-light fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-rule-2 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-rule-2 p-4">
            <h2 id="inquiry-drawer-title" className="text-lg text-ink">Parts inquiry list</h2>
            <button ref={closeButtonRef} type="button" aria-label="Close inquiry list" onClick={onClose} className="masthead__icon">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 border border-rule-2 p-4">
                  <ShoppingBag className="h-8 w-8 text-muted" />
                </div>
                <p className="font-medium text-ink">Your inquiry list is empty</p>
                <Button variant="outline" onClick={onClose} className="mt-4">
                  Start shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-rule-2 pb-4">
                    <div className="plate h-20 w-20 flex-shrink-0">
                      <CatalogImage productId={item.id} src={item.images[0]} alt={item.name} sizes="80px" className="h-full w-full object-contain p-1" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-ink">{item.name}</h3>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name} from inquiry list`}
                          onClick={() => removeFromCart(item.id)}
                          className="grid h-10 w-10 shrink-0 place-items-center text-muted hover:text-error"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-rule-2">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.name} quantity`}
                            onClick={() => changeQuantity(item.id, -1)}
                            className="grid h-10 w-10 place-items-center text-ink-2 hover:bg-paper-2"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 font-outlier text-xs font-medium text-ink">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.name} quantity`}
                            onClick={() => changeQuantity(item.id, 1)}
                            disabled={item.quantity >= 99}
                            className="grid h-10 w-10 place-items-center text-ink-2 hover:bg-paper-2 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="space-y-4 border-t border-rule-2 p-4">
              <p className="text-sm text-muted">Pricing and availability are confirmed after part and engine fitment details are reviewed.</p>
              <Button
                ref={prepareButtonRef}
                className="w-full"
                onClick={() => { setIsInquiryOpen(true); setCopied(false); setCopyError(false); }}
              >
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                Prepare parts inquiry
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {isInquiryOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-paper-3/90 p-4">
          <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="inquiry-modal-title" className="sheet-light max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto border border-rule-2 p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 id="inquiry-modal-title" className="text-xl text-ink">Prepare a parts inquiry</h3>
              <button type="button" aria-label="Close inquiry form" onClick={() => setIsInquiryOpen(false)} className="masthead__icon">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-sm leading-6 text-muted">
              Add the engine name, model or serial number, then copy the inquiry details to share with Noor Alam Machineries.
            </p>
            <div className="space-y-4">
              <div className="field">
                <label htmlFor="engine-details" className="label">Engine name, model or serial number</label>
                <input
                  id="engine-details"
                  type="text"
                  autoFocus
                  value={engineDetails}
                  onChange={(event) => setEngineDetails(event.target.value)}
                  placeholder="Enter engine name, model or serial number"
                  className="input"
                />
              </div>
              <textarea
                aria-label="Parts inquiry details"
                readOnly
                value={inquiryText}
                className="input h-36 resize-none font-outlier text-xs"
              />
              <a
                href={whatsappHref(inquiryText)}
                target="_blank"
                rel="noopener noreferrer"
                data-analytics="cart-whatsapp"
                onClick={() => trackEvent('generate_lead', { method: 'whatsapp', source: 'cart' })}
                className="btn w-full"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Send on WhatsApp
              </a>
              <Button variant="outline" className="w-full" onClick={copyInquiry}>
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                {copied ? 'Inquiry copied' : 'Copy inquiry details'}
              </Button>
              {copyError && <p role="status" className="text-sm text-error">Copy was unavailable. Select and copy the inquiry text above.</p>}
              <p className="text-xs leading-5 text-muted">WhatsApp opens with this list ready to send. Prices and availability are confirmed after fitment details are reviewed.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
