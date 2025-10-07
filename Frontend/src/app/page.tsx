import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight, Calendar, HeartHandshake, Users } from 'lucide-react';
import { Icons } from '@/components/icons';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
const eventImages = PlaceHolderImages.filter(p => p.imageHint.includes('event'));
const talkImages = PlaceHolderImages.filter(p => p.imageHint.includes('talk'));
const socialImages = PlaceHolderImages.filter(p => p.imageHint.includes('social'));
const aboutImage = PlaceHolderImages.find(p => p.id === 'about-us-image');


const events = [
  { id: 1, title: 'Feria Solidaria de Diseño', date: '15 de Agosto, 2024', image: eventImages[0], description: 'Moda, arte y diseño se unen para apoyar nuestra causa.' },
  { id: 2, title: 'Cena Anual a Beneficio', date: '22 de Septiembre, 2024', image: eventImages[1], description: 'Una noche para celebrar logros y recaudar fondos.' },
];

const talks = [
  { id: 1, title: 'Prevención: Cáncer de Mama', date: '5 de Octubre, 2024', image: talkImages[0], description: 'Charla informativa con especialistas sobre detección temprana.' },
  { id: 2, title: 'Nutrición y Cáncer', date: '19 de Octubre, 2024', image: talkImages[1], description: 'Mitos y realidades de la alimentación durante el tratamiento.' },
];

const socialPosts = [
  { id: 1, image: socialImages[0], caption: '¡Gracias a nuestros increíbles voluntarios por su dedicación en la feria de hoy! Su energía es nuestra fuerza. ❤️' },
  { id: 2, image: socialImages[1], caption: '¡Qué noche tan especial en nuestra cena anual! Juntos, estamos logrando un gran impacto. ✨' },
  { id: 3, image: socialImages[2], caption: 'Hoy en nuestra charla de prevención. Informarse es el primer paso para cuidarse. #PrevenciónEsAmor' },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover "
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center gap-4 px-4">
          <h1 className="text-4xl md:text-6xl font-headline drop-shadow-md">
            No podemos evitar tu tormenta, pero si acompañarte a enfrentarla
          </h1>
          <p className="max-w-2xl text-lg md:text-xl font-body drop-shadow-sm">
            Apoyamos a pacientes oncológicos y sus familias. Tu ayuda marca la diferencia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild size="lg" className="font-bold text-lg">
              <Link href="/donate">Donar Ahora</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold text-lg">
              <Link href="/socios">Hazte Socio</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* About Us Section */}
      <section id="about" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-headline text-primary">Nuestra Misión</h2>
            <p className="text-lg text-muted-foreground">
              El Programa Lilian es una organización sin fines de lucro dedicada a brindar apoyo integral a pacientes con cáncer y sus familias en Bahía Blanca. 
            </p>
            <p className="text-muted-foreground">
              Desde contención emocional hasta ayuda material, nuestro objetivo es acompañar en cada etapa del proceso, aliviando cargas y sembrando esperanza. Creemos en el poder de la comunidad para sanar y sostener.
            </p>
            <div className="flex gap-8 pt-4">
              <div className="flex items-center gap-3">
                <HeartHandshake className="size-8 text-primary" />
                <span className="font-bold">Apoyo Emocional</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="size-8 text-primary" />
                <span className="font-bold">Ayuda Comunitaria</span>
              </div>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            {aboutImage && (
              <Image
                src={aboutImage.imageUrl}
                alt={aboutImage.description}
                data-ai-hint={aboutImage.imageHint}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            )}
          </div>
        </div>
      </section>

      {/* News & Events Section */}
      <section id="news" className="py-16 md:py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-headline mb-8">Novedades y Actividades</h2>
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="events">Próximos Eventos</TabsTrigger>
              <TabsTrigger value="talks">Charlas de Prevención</TabsTrigger>
            </TabsList>
            <TabsContent value="events">
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {events.map((event) => (
                  <Card key={event.id} className="text-left overflow-hidden">
                    {event.image && (
                      <Image src={event.image.imageUrl} alt={event.image.description} data-ai-hint={event.image.imageHint} width={600} height={400} className="w-full h-48 object-cover"/>
                    )}
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{event.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-4" />
                        <span>{event.date}</span>
                      </div>
                      <Button variant="link">Ver más <ArrowRight className="ml-2 size-4" /></Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="talks">
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {talks.map((talk) => (
                  <Card key={talk.id} className="text-left overflow-hidden">
                    {talk.image && (
                      <Image src={talk.image.imageUrl} alt={talk.image.description} data-ai-hint={talk.image.imageHint} width={600} height={400} className="w-full h-48 object-cover"/>
                    )}
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl">{talk.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{talk.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                       <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-4" />
                        <span>{talk.date}</span>
                      </div>
                      <Button variant="link">Inscribirse <ArrowRight className="ml-2 size-4" /></Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Social Media Section */}
      <section id="social" className="py-16 md:py-24 bg-card">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-headline mb-2">Sigue Nuestra Actividad</h2>
          <p className="text-muted-foreground mb-8">Encuéntranos en redes como @lilianprograma</p>
          <div className="grid md:grid-cols-3 gap-6">
            {socialPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden group">
                <CardContent className="p-0">
                  <div className="relative">
                    {post.image && (
                      <Image src={post.image.imageUrl} alt={post.image.description} data-ai-hint={post.image.imageHint} width={400} height={400} className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105"/>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-4 text-white text-left">
                       <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8 border-2 border-white">
                           <AvatarImage src="https://picsum.photos/seed/logo/40/40" alt="@lilianprograma" />
                           <AvatarFallback>LP</AvatarFallback>
                        </Avatar>
                        <span className="font-bold">@lilianprograma</span>
                       </div>
                       <p className="text-sm">{post.caption}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section id="involve" className="py-20 md:py-32 text-center bg-primary text-primary-foreground">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline mb-4">Tu apoyo transforma vidas.</h2>
          <p className="max-w-2xl mx-auto text-lg mb-8">
            Conviértete en socio, haz una donación o súmate como voluntario. Cada gesto cuenta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button asChild size="lg" variant="secondary" className="font-bold text-lg">
              <Link href="/socios">Quiero ser Socio</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-bold text-lg bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <a href="https://wa.me/5492915757598" target="_blank" rel="noopener noreferrer">Ser Voluntario</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
