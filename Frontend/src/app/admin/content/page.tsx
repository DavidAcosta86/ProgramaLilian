'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/lib/config';

const SECTION_TYPES = [
  'events',
  'talks',
] as const;

const SECTION_LABELS = {
  'events': 'Evento',
  'talks': 'Charla',
};

type SectionType = typeof SECTION_TYPES[number];

interface FormData {
  section: string;
  title: string;
  content: string;
  subtitle: string;
  buttonText1: string;
  buttonUrl1: string;
  date: string;
  published: boolean;
  image: File | null;
}

export default function ContentAdminPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageSizeWarning, setImageSizeWarning] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    section: '',
    title: '',
    content: '',
    subtitle: '',
    buttonText1: '',
    buttonUrl1: '',
    date: '',
    published: true,
    image: null,
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Handle image file validation
    if (field === 'image' && value) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (value.size > maxSize) {
        setImageSizeWarning(`La imagen es demasiado grande. El tamaño máximo permitido es 5MB. Tamaño actual: ${(value.size / (1024 * 1024)).toFixed(2)}MB`);
      } else {
        setImageSizeWarning('');
      }
    }
  };

  const handleSectionChange = (section: string) => {
    setFormData(prev => ({ ...prev, section: section }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'image' && value !== null) {
          formDataToSend.append(key, value as string);
        }
      });

      // Add image if present
      if (formData.image) {
        formDataToSend.append('imageFile', formData.image);
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/content/with-image`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Contenido creado",
          description: `Contenido ${formData.section} creado exitosamente`,
        });

        // Reset form
        setFormData({
          section: '',
          title: '',
          content: '',
          subtitle: '',
          buttonText1: '',
          buttonUrl1: '',
          date: '',
          published: true,
          image: null,
        });

      } else {
        throw new Error('Error al crear contenido');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el contenido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedSectionValue = () => {
    return formData.section;
  };

  return (
    <div className="container mx-auto py-16 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">Gestión de Contenido</h1>
        <p className="text-lg text-muted-foreground">
          Crear y gestionar contenido del sitio web sin tocar código
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Contenido</CardTitle>
          <CardDescription>
            Selecciona una sección y completa los campos requeridos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section Select with double confirmation for hero/about */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sección</label>
              <select
                value={getSelectedSectionValue()}
                onChange={(e) => handleSectionChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md w-full"
              >
                <option value="">Seleccionar sección</option>
                {SECTION_TYPES.map((section) => (
                  <option key={section} value={section}>
                    {SECTION_LABELS[section]}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Título principal"
                />
              </div>
            </div>

            {/* Content - Rich Text Area */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Contenido</label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                placeholder="Escribe el contenido principal..."
                rows={4}
                className="flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              />
            </div>

            {/* Events/Talks specific fields */}
            {(formData.section === 'events' || formData.section === 'talks') && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fecha</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>

                {/* Events can have buttons like "Register", "Learn more", etc. */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Botón Texto</label>
                    <Input
                      value={formData.buttonText1}
                      onChange={(e) => handleInputChange('buttonText1', e.target.value)}
                      placeholder="Por ejemplo: 'Inscribirse', 'Ver detalles'"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Botón URL</label>
                    <Input
                      value={formData.buttonUrl1}
                      onChange={(e) => handleInputChange('buttonUrl1', e.target.value)}
                      placeholder="https://ejemplo.com o /ruta-local"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Imagen (opcional)</label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange('image', e.target.files?.[0] || null)}
              />
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">
                  Tamaño máximo: 5MB. La imagen se comprimirá automáticamente.
                </p>
                {imageSizeWarning && (
                  <p className="text-xs text-red-600 font-medium">
                    ⚠️ {imageSizeWarning}
                  </p>
                )}
              </div>
            </div>

            {/* Published Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => handleInputChange('published', e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="published"
                className="text-sm font-medium leading-none"
              >
                Publicar contenido
              </label>
            </div>

            <Button type="submit" disabled={!formData.section || isLoading || !!imageSizeWarning} className="w-full">
              {isLoading ? 'Creando...' : 'Crear Contenido'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
