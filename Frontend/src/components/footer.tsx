import Link from 'next/link';
import { Logo } from './logo';
import { Icons } from './icons';

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Logo />
            <p className="text-muted-foreground max-w-sm">
              Apoyando a pacientes oncológicos y sus familias en Bahía Blanca con amor y esperanza.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold">Navegación</h4>
            <ul className="space-y-2">
              <li><Link href="/#about" className="text-muted-foreground hover:text-primary">Nosotros</Link></li>
              <li><Link href="/#news" className="text-muted-foreground hover:text-primary">Actividades</Link></li>
              <li><Link href="/donate" className="text-muted-foreground hover:text-primary">Donar</Link></li>
              <li><Link href="/socios" className="text-muted-foreground hover:text-primary">Hazte Socio</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold">Contacto</h4>
            <p className="text-muted-foreground">
              Para voluntariado y consultas:
            </p>
            <a href="https://wa.me/5492915757598" target="_blank" rel="noopener noreferrer" className="inline-block font-semibold text-primary hover:underline">
              WhatsApp: +54 9 291 575-7598
            </a>
            <div className="flex justify-center md:justify-start gap-4 pt-2">
              <a href="https://www.facebook.com/lilianprograma" target="_blank" rel="noopener noreferrer" aria-label="Facebook de Lilian Program">
                <Icons.facebook className="size-6 text-muted-foreground hover:text-primary" />
              </a>
              <a href="https://www.instagram.com/lilianprograma" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Lilian Program">
                <Icons.instagram className="size-6 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Lilian Program Web Hub. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
