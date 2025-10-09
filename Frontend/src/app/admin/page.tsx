"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, Calendar, FileText, Settings } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/config';

interface AdminStats {
  totalMembers: number;
  totalDonations: number;
  totalDonationAmount: number;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  createdAt: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
      if (!response.ok) throw new Error('Error al cargar estadísticas');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Error al cargar estadísticas');
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/members/recent`);
      if (!response.ok) throw new Error('Error al cargar miembros');
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Error al cargar miembros');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchMembers()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-lg">Cargando datos administrativos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-16 text-center">
        <p className="text-lg text-red-600">{error}</p>
        <p className="text-sm text-gray-600 mt-2">
          Verifica que el backend esté corriendo en http://localhost:8080
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-4">Panel Administrativo</h1>
        <p className="text-lg text-muted-foreground">
          Estadísticas y gestión de miembros de Programa Lilian
        </p>
      </div>

      {/* Main Navigation */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-xl">
              <Settings className="h-6 w-6 text-primary" />
              Gestión de Usuarios y Donaciones
            </CardTitle>
            <CardDescription>
              Administra miembros, donaciones y datos del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Gestiona usuarios, visualiza donaciones, administra accesos y configura el sistema.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/users">
                  <Users className="h-4 w-4 mr-2" />
                  Usuarios
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/donations">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Donaciones
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-xl">
              <FileText className="h-6 w-6 text-primary" />
              Creación de Contenido
            </CardTitle>
            <CardDescription>
              Gestiona el contenido del sitio web
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Actualiza secciones del sitio, crea eventos, administra publicaciones y contenido multimedia.
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/content/manage">
                  <Settings className="h-4 w-4 mr-2" />
                  Administrar Contenido
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/admin/content">
                  <FileText className="h-4 w-4 mr-2" />
                  Crear Contenido
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Miembros</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registrados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donaciones</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalDonations || 0}</div>
            <p className="text-xs text-muted-foreground">
              Procesadas por el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalDonationAmount ? stats.totalDonationAmount.toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Recaudado en total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Members */}
      <Card>
        <CardHeader>
          <CardTitle>Miembros Recientes</CardTitle>
          <CardDescription>
            Últimos miembros registrados en Programa Lilian
          </CardDescription>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay miembros registrados aún
            </p>
          ) : (
            <div className="space-y-4">
              {members.slice(0, 10).map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex flex-col">
                    <p className="font-medium">{member.fullName}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    {member.phone && (
                      <p className="text-sm text-muted-foreground">{member.phone}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      ID: {member.id}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(member.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
