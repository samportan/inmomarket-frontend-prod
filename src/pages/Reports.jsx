import React, { useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { useReportsStore } from "@/stores/useReportsStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

export default function Reports() {
  const { token } = useAuthStore();
  const { reports, loading, error, fetchReports, resolveReport, currentPage, totalPages, totalElements } = useReportsStore();

  useEffect(() => {
    if (token) {
      fetchReports(token);
    }
  }, [token]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchReports(token, newPage);
    }
  };

  const handleResolveReport = async (reportId, action) => {
    const result = await resolveReport(token, reportId, action);
    
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 min-h-screen mt-4 pt-[--header-height]">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 min-h-screen mt-4 pt-[--header-height]">
        <div className="text-red-500 text-center py-10">
          <p>Error al cargar los reportes: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fetchReports(token, currentPage)}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 min-h-screen mt-4 pt-[--header-height]">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <PageHeader
            title="Reportes"
            description={`Total de reportes: ${totalElements}`}
          />
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No hay reportes disponibles</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Reporte #{report.id}</CardTitle>
                    <Badge className={getStatusVariant(report.status)}>
                      {report.status === 'PENDING' ? 'PENDIENTE' : 
                       report.status === 'RESOLVED' ? 'RESUELTO' : 'RECHAZADO'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Publicación: {report.publicationId}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Motivo</p>
                      <p className="text-sm">{report.reason}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Descripción</p>
                      <p className="text-sm">{report.description || 'Sin descripción'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reportado por</p>
                      <p className="text-sm">{report.reporterName || 'Anónimo'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dirección</p>
                      <p className="text-sm">{report.address || 'No especificada'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha</p>
                      <p className="text-sm">
                        {report.localDateTime ? (
                          format(new Date(report.localDateTime), 'PPPp', { locale: es })
                        ) : (
                          'Fecha no disponible'
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Link to={`/property/${report.publicationId}`}>
                    <Button variant="outline" size="sm">
                      Ver Publicación
                    </Button>
                  </Link>
                  {report.status === 'PENDING' && (
                    <>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleResolveReport(report.id, 'DISMISS')}
                        disabled={loading}
                      >
                        Rechazar
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleResolveReport(report.id, 'APPROVE')}
                        disabled={loading}
                      >
                        Resolver
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              Anterior
            </Button>
            <span className="px-4">
              Página {currentPage + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
