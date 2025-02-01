export async function fetchClients() {
    const response = await fetch('http://127.0.0.1:8000/clients');
    if (!response.ok) {
      throw new Error('Error al obtener los clientes');
    }
    return response.json();
  }