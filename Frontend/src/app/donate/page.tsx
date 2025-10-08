"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import { Gift, Heart } from 'lucide-react';

const donationImage = PlaceHolderImages.find(p => p.id === 'donate-page-image');
const donationOptions = [
  { amount: 1000, label: '$1.000' },
  { amount: 2500, label: '$2.500' },
  { amount: 5000, label: '$5.000' },
  { amount: 10000, label: '$10.000' },
];

export default function DonatePage() {
  const [amount, setAmount] = useState('2500');
  const [customAmount, setCustomAmount] = useState('');
  const { toast } = useToast();

  const handleDonate = () => {
    const finalAmount = amount === 'custom' ? customAmount : amount;
    if (!finalAmount || Number(finalAmount) <= 0) {
        toast({
            title: "Error",
            description: "Por favor, ingrese un monto válido para donar.",
            variant: "destructive",
        });
        return;
    }
    toast({
        title: "Redirigiendo a Mercado Pago...",
        description: `Gracias por tu donación de $${finalAmount}.`,
    });
    // In a real app, you would redirect to Mercado Pago here.
    // window.location.href = `https://mercadopago.com/...?amount=${finalAmount}`;
  };

  const selectedAmountIsCustom = amount === 'custom';

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-4xl">
        <Card className="overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="font-headline text-4xl text-primary">Haz una Donación</CardTitle>
                <CardDescription className="text-lg pt-2">
                  Tu generosidad nos permite continuar nuestra labor. Cada aporte, por pequeño que sea, hace una gran diferencia.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <RadioGroup value={amount} onValueChange={setAmount}>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {donationOptions.map(option => (
                      <Label
                        key={option.amount}
                        htmlFor={`amount-${option.amount}`}
                        className={`flex items-center justify-center p-4 border rounded-md cursor-pointer transition-colors ${amount === String(option.amount) ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}
                      >
                        <RadioGroupItem value={String(option.amount)} id={`amount-${option.amount}`} className="sr-only" />
                        <span className="font-bold text-lg">{option.label}</span>
                      </Label>
                    ))}
                  </div>

                  <div className="mb-6">
                      <Label
                        htmlFor="amount-custom-radio"
                        className={`flex items-center p-4 border rounded-md cursor-pointer transition-colors ${selectedAmountIsCustom ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}`}
                        >
                        <RadioGroupItem value="custom" id="amount-custom-radio" className="sr-only" />
                        <span className="font-bold text-lg">Otro Monto</span>
                      </Label>
                  </div>

                  {selectedAmountIsCustom && (
                      <div className="mb-6">
                          <Label htmlFor="custom-amount-input" className="sr-only">Monto Personalizado</Label>
                          <Input
                              id="custom-amount-input"
                              type="number"
                              placeholder="Ingresa tu monto"
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              className="text-lg h-12"
                          />
                      </div>
                  )}
                </RadioGroup>
              </CardContent>
              <CardFooter className="p-0 mt-8">
                <Button size="lg" className="w-full font-bold text-xl" onClick={handleDonate}>
                  <Gift className="mr-2 size-6" /> Donar con Mercado Pago
                </Button>
              </CardFooter>
            </div>
            <div className="hidden md:block relative">
              {donationImage && (
                <Image
                  src={donationImage.imageUrl}
                  alt={donationImage.description}
                  data-ai-hint={donationImage.imageHint}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center p-8">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg text-center shadow-lg">
                    <Heart className="mx-auto size-12 text-primary mb-4"/>
                    <p className="font-bold text-lg text-primary-dark">"El amor es la única cosa que crece cuando se comparte."</p>
                    <p className="text-sm text-muted-foreground mt-2">- Antoine de Saint-Exupéry</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
