'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Select component not available, using native select instead
import { DollarSign, Search, Calendar, TrendingUp, CreditCard } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';

interface Donation {
  id: number;
  donorName?: string;
  email?: string;
  amount: number;
  transactionId: string;
  type: 'ONE_TIME' | 'SUBSCRIPTION';
  createdAt: string;
  updatedAt: string;
}

export default function DonationsAdminPage() {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const donationsPerPage = 15;

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/donations`);
      if (!response.ok) throw new Error('Error al cargar donaciones');
      const data = await response.json();
      setDonations(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Error al cargar donaciones');
      toast({
        title: "Error",
        description: "No se pudieron cargar las donaciones",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const filteredDonations = donations.filter(donation => {
    const matchesSearch =
      donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.amount.toString().includes(searchTerm);

    const matchesType = filterType === 'all' || donation.type === filterType;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredDonations.length / donationsPerPage);
  const paginatedDonations = filteredDonations.slice(
    (currentPage - 1) * donationsPerPage,
    currentPage * donationsPerPage
  );

  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const oneTimeDonations = donations.filter(d => d.type === 'ONE_TIME');
  const subscriptionDonations = donations.filter(d => d.type === 'SUBSCRIPTION');
  const recentDonations = donations.filter(d => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(d.createdAt) > weekAgo;
  });

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-lg">Cargando donaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchDonations} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4 flex items-center gap-3">
          <DollarSign className="h-8 w-8" />
          Gestión de Donaciones
        </h1>
        <p className="text-lg text-muted-foreground">
          Administra y supervisa las donaciones realizadas a Programa Lilian
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donaciones</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">
              Registradas en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Recaudado en total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unicas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{oneTimeDonations.length}</div>
            <p className="text-xs text-muted-foreground">
              Donaciones puntuales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentDonations.length}</div>
            <p className="text-xs text-muted-foreground">
              Donaciones recientes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Búsqueda de Donaciones</CardTitle>
          <CardDescription>
            Busca por nombre del donante, email, ID de transacción o monto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <Input
                placeholder="Buscar donaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md w-48"
              >
                <option value="all">Todos los tipos</option>
                <option value="ONE_TIME">Única</option>
                <option value="SUBSCRIPTION">Suscripción</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Donaciones ({filteredDonations.length})</CardTitle>
          <CardDescription>
            {searchTerm || filterType !== 'all'
              ? 'Resultados filtrados'
              : 'Todas las donaciones registradas (ordenadas por fecha reciente)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedDonations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchTerm || filterType !== 'all'
                ? 'No se encontraron donaciones que coincidan con los filtros'
                : 'No hay donaciones registradas aún'}
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{donation.donorName || 'Donante Anónimo'}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          donation.type === 'ONE_TIME'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {donation.type === 'ONE_TIME' ? 'Única' : 'Suscripción'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{donation.email || 'Sin email'}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        TX: {donation.transactionId}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ${donation.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        ID: {donation.id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(donation.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="px-3 py-1 text-sm text-muted-foreground flex items-center">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Siguiente
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
