"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle, Heart, Loader2 } from "lucide-react";
import { useState } from "react";

const sociosImage = PlaceHolderImages.find(p => p.id === 'socios-page-image');

// For local development, hardcoded API URL
const API_URL = 'http://localhost:8080';

const formSchema = z.object({
  fullName: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, ingresa un email válido." }),
  phone: z.string().optional(),
  birthDate: z.string().optional(), // Optional birth date
});

export default function SociosPage() {
  const { toast } = useToast();
  const [isRegistered, setIsRegistered] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      birthDate: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          birthDate: values.birthDate ? new Date(values.birthDate).toISOString().split('T')[0] : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los datos');
      }

      const user = await response.json();

      setUserId(user.id);
      setIsRegistered(true);

      toast({
        title: "¡Registro exitoso!",
        description: "Tus datos han sido guardados. Ahora puedes elegir tu plan de suscripción.",
      });

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Error al registrar",
        description: "No se pudieron guardar tus datos. Inténtalo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubscription(plan: 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual') {
    if (!isRegistered || !userId) {
      toast({
        title: "Registro requerido",
        description: "Por favor, completa tus datos antes de elegir un plan.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update subscription plan in backend
      const response = await fetch(`${API_URL}/api/members/${userId}/subscription?subscriptionId=${plan}&planType=${plan}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Error al actualizar suscripción');
      }

      toast({
        title: `¡Suscripción activada!`,
        description: `Plan ${plan} activado exitosamente.`,
      });

    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Error en suscripción",
        description: "No se pudo completar la suscripción. Inténtalo nuevamente.",
        variant: "destructive",
      });
    }
  }


  return (
    <div className="container mx-auto py-16 md:py-24">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-6">
          <h1 className="font-headline text-4xl md:text-5xl text-primary">Conviértete en Socio</h1>
          <p className="text-lg text-muted-foreground">
            Al hacerte socio, nos brindas un apoyo constante que nos permite planificar y sostener nuestra ayuda a largo plazo. Únete a nuestra comunidad de corazones solidarios y sé parte del cambio.
          </p>
          {sociosImage && (
            <div className="rounded-lg overflow-hidden shadow-lg mt-8">
              <Image
                src={sociosImage.imageUrl}
                alt={sociosImage.description}
                data-ai-hint={sociosImage.imageHint}
                width={800}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">1. Completa tus datos</CardTitle>
            <CardDescription>Esta información es necesaria para enviarte el recibo y mantenerte informado.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu nombre y apellido" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="tu.email@ejemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Tu número de teléfono" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento (Opcional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={!form.formState.isDirty}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Guardar mis datos
                </Button>
              </form>
            </Form>
            
            <div className="mt-8 pt-8 border-t">
                <h3 className="text-2xl font-bold mb-4">2. Elige tu plan de aporte</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle>Plan Mensual</CardTitle>
                            <CardDescription>Un aporte continuo que nos ayuda a planificar.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-3xl font-bold">$1.500 <span className="text-sm font-normal text-muted-foreground">/mes</span></p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleSubscription('Mensual')} disabled={!isRegistered}>
                                <Heart className="mr-2 size-4"/> Suscribirme
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle>Plan Trimestral</CardTitle>
                            <CardDescription>Apoyo sostenido con menos transacciones.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-3xl font-bold">$4.500 <span className="text-sm font-normal text-muted-foreground">/trimestre</span></p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleSubscription('Trimestral')} disabled={!isRegistered}>
                               <Heart className="mr-2 size-4"/> Suscribirme
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle>Plan Semestral Trimestral</CardTitle>
                            <CardDescription>Apoyo sostenido con menos transacciones.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-3xl font-bold">$9000 <span className="text-sm font-normal text-muted-foreground">/semestre</span></p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleSubscription('Semestral')} disabled={!isRegistered}>
                               <Heart className="mr-2 size-4"/> Suscribirme
                            </Button>
                        </CardFooter>
                    </Card>
                     <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle>Plan Anual</CardTitle>
                            <CardDescription>Apoyo sostenido con menos transacciones.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-3xl font-bold">$18.000 <span className="text-sm font-normal text-muted-foreground">/año</span></p>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => handleSubscription('Anual')} disabled={!isRegistered}>
                               <Heart className="mr-2 size-4"/> Suscribirme
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
