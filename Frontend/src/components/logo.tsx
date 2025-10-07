import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="text-xl md:text-2xl font-bold font-headline text-primary hover:text-primary/90 transition-colors" aria-label="Prograna Lilian - Página de inicio">
        <img src="images/logo.png" alt="Logo de Programa Lilian" width={70} height={70} className="inline-block ml-2" />
      Programa Lilian 
   
    </Link>
  );
}

