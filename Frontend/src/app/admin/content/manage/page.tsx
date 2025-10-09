'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FileText,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Settings,
  Filter,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

// Simple Badge component
function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
  const variantClasses = variant === "default"
    ? "bg-green-100 text-green-800"
    : variant === "secondary"
    ? "bg-gray-100 text-gray-800"
    : "border border-gray-300 text-gray-700";

  return (
    <span className={`${baseClasses} ${variantClasses} ${className || ''}`}>
      {children}
    </span>
  );
}

interface ContentItem {
  id: number;
  section: string;
  title?: string;
  content?: string;
  subtitle?: string;
  buttonText1?: string;
  buttonUrl1?: string;
  buttonText2?: string;
  buttonUrl2?: string;
  imageData?: string;
  imageType?: string;
  date?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const SECTIONS = [
  { value: 'hero', label: 'Hero' },
  { value: 'about', label: 'Sobre Nosotros' },
  { value: 'events', label: 'Eventos' },
  { value: 'talks', label: 'Charlas' },
  { value: 'social-posts', label: 'Redes Sociales' },
];

export default function ContentManagementPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/content`);
      if (!response.ok) throw new Error('Error al cargar contenido');
      const data = await response.json();
      // Ordenar por fecha de creación, más reciente primero
      data.sort((a: any, b: any) =>
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setContents(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError('Error al cargar contenido. Verifica que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const filteredContents = contents.filter((content: any) => {
    // Excluir las secciones que deben quedar hardcodeadas
    const isHardcoded = content.section === 'hero' || content.section === 'about';
    if (isHardcoded) return false; // No mostrarlas en la administración

    const matchesSearch =
      content.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.section?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSection = sectionFilter === 'all' || content.section === sectionFilter;

    return matchesSearch && matchesSection;
  });

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/content/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Contenido eliminado exitosamente');
        setDeleteConfirm(null);
        fetchContent(); // Refresh the list
      } else {
        throw new Error('Error al eliminar contenido');
      }
    } catch (err) {
      alert('No se pudo eliminar el contenido');
    }
  };

  const handleUpdate = async () => {
    if (!editingContent) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/content/${editingContent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingContent),
      });

      if (response.ok) {
        alert('Contenido actualizado exitosamente');
        setEditingContent(null);
        fetchContent(); // Refresh the list
      } else {
        throw new Error('Error al actualizar contenido');
      }
    } catch (err) {
      alert('No se pudo actualizar el contenido');
    }
  };

  const getSectionLabel = (section: string) => {
    const sectionObj = SECTIONS.find((s: any) => s.value === section);
    return sectionObj?.label || section;
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-lg">Cargando contenido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchContent} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button asChild variant="outline">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4 flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Administración de Contenido
        </h1>
        <p className="text-lg text-muted-foreground">
          Gestiona, edita y elimina todo el contenido del sitio web
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Búsqueda y Filtros</CardTitle>
          <CardDescription>
            Encuentra contenido específico por título, contenido o sección
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-2 block">Buscar</Label>
              <Input
                placeholder="Buscar por título, contenido o sección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">Sección</Label>
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md w-48"
              >
                <option value="all">Todas las secciones</option>
                {SECTIONS.map((section: any) => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Button onClick={fetchContent} variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle>Contenido del Sitio ({filteredContents.length})</CardTitle>
          <CardDescription>
            {searchTerm || sectionFilter !== 'all'
              ? `Resultados filtrados - ${filteredContents.length} elementos encontrados`
              : `Todo el contenido - ${contents.length} elementos totales`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredContents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm || sectionFilter !== 'all'
                  ? 'No se encontraron elementos que coincidan con los filtros'
                  : 'No hay contenido registrado aún'}
              </p>
              <p className="mt-4">
                <a href="/admin/content" className="text-primary hover:underline">
                  Crear primer contenido →
                </a>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContents.map((content: any) => (
                <Card key={content.id} className="border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant={content.published ? "default" : "secondary"}>
                            {content.published ? "Publicado" : "Borrador"}
                          </Badge>
                          <Badge variant="outline">
                            {getSectionLabel(content.section)}
                          </Badge>
                          {content.imageData && (
                            <Badge variant="outline" className="text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Con imagen
                            </Badge>
                          )}
                        </div>

                        {content.title && (
                          <h3 className="font-semibold text-lg mb-2">{content.title}</h3>
                        )}

                        {content.subtitle && (
                          <p className="text-muted-foreground mb-2">{content.subtitle}</p>
                        )}

                        {content.content && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {content.content.length > 200
                              ? `${content.content.substring(0, 200)}...`
                              : content.content}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Creado: {new Date(content.createdAt || 0).toLocaleDateString('es-ES')}
                          </span>
                          <span>ID: {content.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedContent(content)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingContent(content)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteConfirm(content.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1 text-red-600" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Modal */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedContent.title || `Contenido ${selectedContent.id}`}
              </h2>
              <button
                onClick={() => setSelectedContent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={selectedContent.published ? "default" : "secondary"}>
                  {selectedContent.published ? "Publicado" : "Borrador"}
                </Badge>
                <Badge variant="outline">
                  {getSectionLabel(selectedContent.section)}
                </Badge>
              </div>

              {selectedContent.subtitle && (
                <div>
                  <Label className="text-sm font-medium">Subtítulo</Label>
                  <p className="text-lg">{selectedContent.subtitle}</p>
                </div>
              )}

              {selectedContent.content && (
                <div>
                  <Label className="text-sm font-medium">Contenido</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="whitespace-pre-wrap">{selectedContent.content}</p>
                  </div>
                </div>
              )}

              {(selectedContent.buttonText1 || selectedContent.buttonText2) && (
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Botones</Label>
                  <div className="space-y-2">
                    {selectedContent.buttonText1 && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Botón 1:</span>
                        <span>{selectedContent.buttonText1}</span>
                        {selectedContent.buttonUrl1 && (
                          <span className="text-sm text-muted-foreground">- {selectedContent.buttonUrl1}</span>
                        )}
                      </div>
                    )}
                    {selectedContent.buttonText2 && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Botón 2:</span>
                        <span>{selectedContent.buttonText2}</span>
                        {selectedContent.buttonUrl2 && (
                          <span className="text-sm text-muted-foreground">- {selectedContent.buttonUrl2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedContent.date && (
                <div>
                  <Label className="text-sm font-medium">Fecha</Label>
                  <p>{selectedContent.date}</p>
                </div>
              )}

              {selectedContent.imageData && (
                <div>
                  <Label className="text-sm font-medium">Imagen</Label>
                  <div className="mt-2">
                    <img
                      src={`${API_BASE_URL}/api/content/image/${selectedContent.id}`}
                      alt="Contenido"
                      className="max-w-full h-auto rounded-md border"
                    />
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
                <div>Creado: {new Date(selectedContent.createdAt).toLocaleString('es-ES')}</div>
                <div>Actualizado: {new Date(selectedContent.updatedAt).toLocaleString('es-ES')}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Editar Contenido</h2>
              <button
                onClick={() => setEditingContent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sección</Label>
                  <select
                    value={editingContent.section}
                    onChange={(e) => setEditingContent({ ...editingContent, section: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                  >
                    {SECTIONS.map((section: any) => (
                      <option key={section.value} value={section.value}>
                        {section.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Estado</Label>
                  <select
                    value={editingContent.published ? 'true' : 'false'}
                    onChange={(e) => setEditingContent({ ...editingContent, published: e.target.value === 'true' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                  >
                    <option value="true">Publicado</option>
                    <option value="false">Borrador</option>
                  </select>
                </div>
              </div>

              <div>
                <Label>Título</Label>
                <Input
                  value={editingContent.title || ''}
                  onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Subtítulo</Label>
                <Input
                  value={editingContent.subtitle || ''}
                  onChange={(e) => setEditingContent({ ...editingContent, subtitle: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Contenido</Label>
                <textarea
                  value={editingContent.content || ''}
                  onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Texto Botón 1</Label>
                  <Input
                    value={editingContent?.buttonText1 || ''}
                    onChange={(e) => {
                      if (editingContent) {
                        const newContent = { ...editingContent, buttonText1: e.target.value };
                        console.log('Nuevo contenido buttonText1:', newContent.buttonText1);
                        setEditingContent(newContent);
                      }
                    }}
                    className="mt-1"
                    placeholder="Ej: Ver más, Inscribirse..."
                  />
                </div>
                <div>
                  <Label>URL Botón 1</Label>
                  <Input
                    value={editingContent?.buttonUrl1 || ''}
                    onChange={(e) => {
                      if (editingContent) {
                        const newContent = { ...editingContent, buttonUrl1: e.target.value };
                        console.log('Nuevo contenido buttonUrl1:', newContent.buttonUrl1);
                        setEditingContent(newContent);
                      }
                    }}
                    className="mt-1"
                    placeholder="Ej: /eventos, https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditingContent(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdate}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">¿Eliminar contenido?</h3>
              <p className="text-muted-foreground mb-6">
                Esta acción no se puede deshacer. El contenido será eliminado permanentemente.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
