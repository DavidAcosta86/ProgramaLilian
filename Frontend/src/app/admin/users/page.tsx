'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Search, Eye, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  createdAt: string;
}

export default function UsersAdminPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/member/all`);
      if (!response.ok) throw new Error('Error al cargar usuarios');
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Error al cargar usuarios');
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-lg">Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={fetchUsers} className="mt-4">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4 flex items-center gap-3">
          <Users className="h-8 w-8" />
          Gestión de Usuarios
        </h1>
        <p className="text-lg text-muted-foreground">
          Administra y gestiona los miembros registrados en Programa Lilian
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Teléfono</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.phone).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((users.filter(u => u.phone).length / users.length) * 100)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(u.createdAt) > weekAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Nuevos registros
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Búsqueda de Usuarios</CardTitle>
          <CardDescription>
            Busca usuarios por nombre, email o teléfono
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar usuarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios ({filteredUsers.length})</CardTitle>
          <CardDescription>
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los usuarios registrados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paginatedUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados aún'}
            </p>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      {user.phone && (
                        <p className="text-sm text-muted-foreground">📱 {user.phone}</p>
                      )}
                      {user.birthDate && (
                        <p className="text-xs text-muted-foreground">
                          🎂 {new Date(user.birthDate).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-2">
                        ID: {user.id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Registrado: {new Date(user.createdAt).toLocaleDateString('es-ES')}
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
