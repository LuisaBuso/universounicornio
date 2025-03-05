import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { toast } from "../hooks/use-toast"
import { Distributor, Ambassador } from "./types"

interface DistributorDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  distributor: Distributor
}

export function DistributorDetailsModal({ isOpen, onClose, distributor }: DistributorDetailsModalProps) {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAmbassadors = async () => {
      setLoading(true)

      try {
        // 🔹 Verificar si los embajadores ya están en localStorage
        const storedAmbassadors = localStorage.getItem(`ambassadors_${distributor.id}`)
        if (storedAmbassadors) {
          setAmbassadors(JSON.parse(storedAmbassadors))
          setLoading(false)
          return
        }

        const response = await fetch(`http://127.0.0.1:8000/distribuidores/${distributor.id}/embajadores`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al obtener los embajadores")
        }

        const data = await response.json()

        // ✅ Transformar los datos para que coincidan con la UI
        const transformedData = data.map((ambassador: any) => ({
          id: ambassador._id,
          name: ambassador.full_name,
          email: ambassador.email,
          phone: ambassador.whatsapp_number,
          country: ambassador.pais,
          role: ambassador.rol,
          status: "active",
          salesCount: 0,
        }))

        // 🔹 Guardar en localStorage
        localStorage.setItem(`ambassadors_${distributor.id}`, JSON.stringify(transformedData))

        setAmbassadors(transformedData)
      } catch (error) {
        console.error("Error:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los embajadores.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchAmbassadors()
    }
  }, [isOpen, distributor.id])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Embajadores de {distributor.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {loading ? (
            <p>Cargando embajadores...</p>
          ) : ambassadors.length === 0 ? (
            <p>No hay embajadores asociados a este distribuidor.</p>
          ) : (
            ambassadors.map((ambassador) => (
              <Card key={ambassador.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{ambassador.name}</h3>
                      <p className="text-sm text-muted-foreground">{ambassador.email}</p>
                    </div>
                    <Badge variant={ambassador.status === "active" ? "default" : "secondary"}>
                      {ambassador.status === "active" ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Teléfono:</span> {ambassador.phone}
                    </div>
                    <div>
                      <span className="font-medium">Ventas:</span> {ambassador.salesCount}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
