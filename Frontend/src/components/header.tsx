"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { MessageCircle, Menu, X, Settings, FileText, BarChart3, Users, Mail } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import { useState } from 'react';
import { usePathname } from 'next/navigation';

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

// Componente específico para navbar de admin
const AdminNavBar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-3 text-white hover:text-blue-100 transition-colors">
            <Settings className="h-6 w-6" />
            <span className="font-bold text-xl">Panel Administrativo</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/admin"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              pathname === '/admin'
                ? 'text-white bg-blue-700 px-3 py-2 rounded-md'
                : 'text-blue-100 hover:text-white hover:bg-blue-700 px-3 py-2 rounded-md'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>

          <Link
            href="/admin/content"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              pathname === '/admin/content'
                ? 'text-white bg-blue-700 px-3 py-2 rounded-md'
                : 'text-blue-100 hover:text-white hover:bg-blue-700 px-3 py-2 rounded-md'
            }`}
          >
            <FileText className="h-4 w-4" />
            Crear Contenido
          </Link>

          <Link
            href="/admin/content/manage"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              pathname === '/admin/content/manage'
                ? 'text-white bg-blue-700 px-3 py-2 rounded-md'
                : 'text-blue-100 hover:text-white hover:bg-blue-700 px-3 py-2 rounded-md'
            }`}
          >
            <Settings className="h-4 w-4" />
            Gestionar Contenido
          </Link>

          <Link
            href="/admin/users"
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
              pathname.startsWith('/admin/users')
                ? 'text-white bg-blue-700 px-3 py-2 rounded-md'
                : 'text-blue-100 hover:text-white hover:bg-blue-700 px-3 py-2 rounded-md'
            }`}
          >
            <Users className="h-4 w-4" />
            Usuarios
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-blue-100 hover:text-white transition-colors bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-md"
          >
            ← Volver al Sitio Público
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-blue-600 text-white border-blue-500">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between border-b border-blue-500 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <span className="font-bold">Admin Panel</span>
                  </div>
                </div>
                <nav className="flex flex-col gap-4">
                  <Link href="/admin" className="flex items-center gap-3 py-3 px-3 rounded-md hover:bg-blue-700 transition-colors">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link href="/admin/content" className="flex items-center gap-3 py-3 px-3 rounded-md hover:bg-blue-700 transition-colors">
                    <FileText className="h-4 w-4" />
                    <span>Crear Contenido</span>
                  </Link>
                  <Link href="/admin/content/manage" className="flex items-center gap-3 py-3 px-3 rounded-md hover:bg-blue-700 transition-colors">
                    <Settings className="h-4 w-4" />
                    <span>Gestionar Contenido</span>
                  </Link>
                  <Link href="/admin/users" className="flex items-center gap-3 py-3 px-3 rounded-md hover:bg-blue-700 transition-colors">
                    <Users className="h-4 w-4" />
                    <span>Usuarios</span>
                  </Link>
                </nav>
                <div className="mt-auto">
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 w-full text-blue-600 bg-white hover:bg-gray-100 transition-colors px-4 py-3 rounded-md font-medium"
                  >
                    ← Sitio Público
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  // Si estamos en rutas admin, mostrar navbar especial
  if (isAdmin) {
    return <AdminNavBar />;
  }

  // Navbar normal para sitio público
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
