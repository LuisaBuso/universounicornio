// types.ts
export interface Purchase {
  id: number;
  date: string;
  total: number;
  product: string; // Asegúrate de incluir esta propiedad
  amount: number;  // Asegúrate de incluir esta propiedad
}

export interface Contact {
  id: number;  // Asegúrate de que el tipo de id sea consistente
  name: string;
  email: string;
  whatsapp_phone: string;
  instagram?: string;
  whatsapp?: string;
  purchaseHistory?: any[];
}