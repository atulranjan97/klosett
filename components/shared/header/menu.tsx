import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';
import { EllipsisVertical, ShoppingCart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import UserButton from './user-button';

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      {/* Regular menu */}
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ModeToggle />
        {/* cart */}
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart /> Cart
          </Link>
        </Button>
        {/* user button */}
        <UserButton />
      </nav>
      {/* Responsive sheet menu */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle className="mt-5 ml-3">Menu</SheetTitle>
            <ModeToggle />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart /> Cart
              </Link>
            </Button>
            {/* user button */}
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;

// you have to have <SheetTitle> and <SheetDescription> which we put at the bottom, if you don't do that I believe it gives you the warning
