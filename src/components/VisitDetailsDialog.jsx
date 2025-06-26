import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, MessageSquare, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function VisitDetailsDialog({ visit, children }) {
  const [open, setOpen] = useState(false)

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "APPROVED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200"
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return timeString.substring(0, 5)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon(visit.status)}
            Detalles de la Solicitud de Visita
          </DialogTitle>
          <DialogDescription>
            Información completa sobre tu solicitud de visita
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex justify-center">
            <Badge className={`${getStatusColor(visit.status)} border`}>
              {visit.status === "PENDING" && "Pendiente"}
              {visit.status === "APPROVED" && "Aprobada"}
              {visit.status === "REJECTED" && "Rechazada"}
            </Badge>
          </div>

          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Propiedad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium text-lg">{visit.publicationTitle}</h4>
                <p className="text-sm text-muted-foreground">{visit.publicationAddress}</p>
              </div>
            </CardContent>
          </Card>

          {/* Visit Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Detalles de la Visita
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Fecha</p>
                    <p className="text-sm text-muted-foreground">{formatDate(visit.visitDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Hora</p>
                    <p className="text-sm text-muted-foreground">{formatTime(visit.visitTime)}</p>
                  </div>
                </div>
              </div>
              {visit.meetingLocation && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Punto de Encuentro</p>
                    <p className="text-sm text-muted-foreground">{visit.meetingLocation}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Owner Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Propietario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{visit.ownerName}</p>
                  <p className="text-sm text-muted-foreground">Propietario</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Mensajes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Message */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Tu mensaje:</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm">{visit.userMessage}</p>
                </div>
              </div>

              {/* Owner Response */}
              {visit.ownerResponse && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Respuesta del propietario:</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                    <p className="text-sm">{visit.ownerResponse}</p>
                    {visit.responseDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Respondido el {formatDate(visit.responseDate)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Rejection Reason */}
              {visit.rejectionReason && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <p className="text-sm font-medium text-red-600">Motivo del rechazo:</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700">{visit.rejectionReason}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Request Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Información de la Solicitud</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Solicitud creada: {new Date(visit.createdAt).toLocaleString('es-ES')}</p>
              {visit.updatedAt !== visit.createdAt && (
                <p>Última actualización: {new Date(visit.updatedAt).toLocaleString('es-ES')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 