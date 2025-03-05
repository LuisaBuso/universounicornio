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

// types.ts
export interface Distributor {
  id: string; // Asegúrate de que el tipo de `id` sea consistente (en este caso, `string`)
  name: string;
  location: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  ambassadorsCount: number;
}

// types.ts
export interface Distributor {
  id: string;
  nombre: string;
  telefono: string;
  correo_electronico: string;
  pais: string;
  status: "active" | "inactive";
  password?: string; // Opcional, ya que no siempre se actualiza
}
export interface Ambassador {
  id: string; // También asegúrate de que el tipo de `id` sea consistente
  name: string;
  email: string;
  phone: string;
  salesCount: number;
  status: "active" | "inactive";
}