"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "./product-list";
import { Button } from "../../../components/ui/button";
import { Share2 } from "lucide-react";
import { ShareCatalogDialog } from "../../../components/share-catalog-dialog";
import { validateAndCleanToken } from "../../../lib/auth";

interface ProductsPageProps {
  pais: string | null;
}

export default function ProductsPage({  }: ProductsPageProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    validateAndCleanToken();

    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/"); // Redirige al inicio (login)
    }
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold mr-4">Productos</h1>
        <Button
          onClick={() => setIsShareDialogOpen(true)}
          className="text-xs px-2 py-1 flex items-center justify-center space-x-2"
        >
          <Share2 className="mr-2 h-3 w-3" />
          <span>Compartir Catálogo</span>
        </Button>
      </div>
      <ProductList pais={localStorage.getItem("pais")} />
      <ShareCatalogDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
      />
    </div>
  );
}
