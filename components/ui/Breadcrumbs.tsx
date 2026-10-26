import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type BreadcrumbEntry = {
  name: string;
  path: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbEntry[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-[#777b72]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-[#a9a79f]" />}
              {isLast ? (
                <span aria-current="page" className="font-medium text-[#48534c]">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="transition-colors hover:text-[#17221f]">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
