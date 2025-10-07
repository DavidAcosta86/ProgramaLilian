"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { MessageCircle, Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { useState } from 'react';

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link
    href={href}
    onClick={onClick}
    className="text-foreground/80 hover:text-primary transition-colors font-medium"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
    <SheetClose asChild>
        <Link href={href} onClick={onClick} className="block py-3 text-lg font-medium hover:text-primary transition-colors">{children}</Link>
    </SheetClose>
)

export function Header() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/#about">Nosotros</NavLink>
          <NavLink href="/#news">Actividades</NavLink>
          <NavLink href="/socios">Hazte Socio</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild className="flex items-center gap-2">
            <a href="https://wa.me/5492915757598" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-5" />
              <span>+54 9 291 575-7598</span>
            </a>
          </Button>
          <Button asChild>
            <Link href="/donate">Donar</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw]">
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center border-b pb-4">
                        <Logo />
                        <SheetClose asChild>
                            <Button variant="ghost" size="icon">
                                <X/>
                                <span className="sr-only">Cerrar menú</span>
                            </Button>
                        </SheetClose>
                    </div>
                    <nav className="flex flex-col gap-4 mt-8">
                        <MobileNavLink href="/#about" onClick={() => setSheetOpen(false)}>Nosotros</MobileNavLink>
                        <MobileNavLink href="/#news" onClick={() => setSheetOpen(false)}>Actividades</MobileNavLink>
                        <MobileNavLink href="/socios" onClick={() => setSheetOpen(false)}>Hazte Socio</MobileNavLink>
                    </nav>
                    <div className="mt-auto flex flex-col gap-4">
                        <Button asChild size="lg">
                            <Link href="/donate" onClick={() => setSheetOpen(false)}>Donar</Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                            <a href="https://wa.me/5492915757598" target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="mr-2 size-5" />
                                Contacto WhatsApp
                            </a>
                        </Button>
                    </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
