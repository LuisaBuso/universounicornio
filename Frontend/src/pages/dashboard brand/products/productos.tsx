"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Necesitamos useNavigate para redirigir
import ProductList from "./product-list";
import { Button } from "../../../components/ui/button";
import { Share2 } from 'lucide-react';
import { ShareCatalogDialog } from "../../../components/share-catalog-dialog";
import { validateAndCleanToken } from "../../../lib/auth"; // Importar la función de validación

export default function ProductsPage() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const navigate = useNavigate(); // hook para navegar

  useEffect(() => {
    // Verificar y limpiar el token si no es válido
    validateAndCleanToken();

    // Verificar si el token de acceso existe en localStorage
    const token = localStorage.getItem('access_token');
    
    // Si no existe el token, redirigir al usuario a la página de login
    if (!token) {
      navigate('/'); // Redirige al inicio (login)
    }
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Productos</h1>
        <Button onClick={() => setIsShareDialogOpen(true)}>
          <Share2 className="mr-2 h-4 w-4" />
          Compartir Catálogo
        </Button>
      </div>
      <ProductList />
      <ShareCatalogDialog 
        isOpen={isShareDialogOpen} 
        onClose={() => setIsShareDialogOpen(false)} 
      />
    </div>
  );
}