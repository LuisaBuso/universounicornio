"use client"

import { useState } from "react"
import { AmbassadorList } from "../../components/ambassador-list"
import { Button } from "../../components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddAmbassadorModal } from "../../components/add-ambassador-modal"

export default function AmbassadorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Embajadores</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Embajador
        </Button>
      </div>
      <AmbassadorList />
      <AddAmbassadorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

