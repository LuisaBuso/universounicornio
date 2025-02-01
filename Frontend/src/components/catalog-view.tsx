import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Link, useLocation } from "react-router-dom"; // Importar useLocation
import logoRSF from "../assets/logoRFS.png";
import prePro from "../assets/Rectangle 48.png";
import product1Img from "../assets/Acondicionador.png";
import product2Img from "../assets/Shampoo.png";
import product3Img from "../assets/Aceite.png";
import product4Img from "../assets/Crema 3 en 1.png";
import product5Img from "../assets/Defining Gel.png";
import { useCart } from "./carritoContext";

// Definición de la interfaz Product
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// Lista de productos con precios ajustados
const products: Product[] = [
  { id: 1, name: "Acondicionador", description: "shine & softness", price: 507.00, image: product1Img, category: "Lavado" },
  { id: 2, name: "Shampoo", description: "cleaning & freshness", price: 507.00, image: product2Img, category: "Lavado" },
  { id: 3, name: "Aceite", description: "pre lavado", price: 427.00, image: product3Img, category: "Tratamiento" },
  { id: 4, name: "Crema 3 en 1", description: "repair moisturize & define", price: 507.00, image: product4Img, category: "Definición" },
  { id: 5, name: "Gel", description: "shine & hold", price: 507.00, image: product5Img, category: "Definición" },
];

// Componente ProductCard
const ProductCard = ({ product, onAddToCart, isDesktop = false }: { product: Product; onAddToCart: (product: Product) => void; isDesktop?: boolean }) => {
  // Formatear el precio con dos decimales y agregar "MXN"
  const formattedPrice = `${product.price.toFixed(2)} MXN`;

  return (
    <div className={`flex flex-col items-center space-y-3 border p-4 rounded-lg shadow-sm ${isDesktop ? "hover:shadow-md" : ""}`}>
      <img
        src={product.image}
        alt={product.name}
        className={`object-contain rounded-lg ${isDesktop ? "w-32 h-32 mb-4 mt-2" : "w-full h-40"} `}
      />
      <div className="text-center">
        <h3 className={`font-medium ${isDesktop ? "text-xl" : "text-sm"}`} style={{ color: '#F198C0' }}>{product.name}</h3>
        <p className={`${isDesktop ? "text-sm" : "text-xs"}`} style={{ color: '#F198C0' }}>{product.description}</p>
      </div>
      <div className="flex justify-between items-center w-full mt-8">
        <span className={`${isDesktop ? "text-lg" : "text-sm"} font-semibold`} style={{ color: '#F198C0' }}>
          {formattedPrice} {/* Precio formateado con "MXN" */}
        </span>
        <Button
          className="bg-[#F198C0] hover:bg-[#E87FAF] text-white px-4 py-1 rounded-full text-xs lg:px-6 lg:py-2 lg:text-sm"
          onClick={() => onAddToCart(product)}
        >
          Lo quiero
        </Button>
      </div>
    </div>
  );
};

// Componente ProductSection
const ProductSection = ({ title, products, onAddToCart }: { title: string; products: Product[]; onAddToCart: (product: Product) => void }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#F198C0' }}>{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

// Componente PreProSection
const PreProSection = () => {
  return (
    <div className="relative h-72 rounded-lg overflow-hidden">
      <img
        src={prePro}
        alt="Pre-poo Tratamiento"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#F198C0]/40 to-transparent"></div>
      <div className="absolute bottom-6 left-6 text-white">
        <h3 className="text-2xl font-bold">Pre-poo</h3>
        <p className="text-lg">Tratamiento</p>
      </div>
    </div>
  );
};

// Componente EcommercePage
const EcommercePage = () => {
  const { addItem } = useCart();

  // Obtener la ubicación actual (URL)
  const location = useLocation();

  // Extraer el parámetro "ref" de la URL actual
  const searchParams = new URLSearchParams(location.search);
  const ref = searchParams.get("ref"); // Obtener el valor de "ref"

  // Generar el enlace al catálogo con el parámetro ref (si existe)
  const catalogLink = ref ? `/catalog-view-men?ref=${encodeURIComponent(ref)}` : "/catalog";

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header con redirección y parámetro ref */}
      <Link to={catalogLink}>
        <Card className="rounded-xl shadow-sm mx-4 mt-4 mb-6 cursor-pointer hover:shadow-md transition-shadow">
          <div className="relative p-4">
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <img src={logoRSF} alt="RSF Logo" className="h-6 object-contain" />
            </div>
            <div className="text-right">
              <span className="text-xs tracking-wide" style={{ color: '#F198C0' }}>Línea Men</span>
            </div>
          </div>
        </Card>
      </Link>

      {/* Mobile View (para pantallas pequeñas) */}
      <div className="md:hidden px-4">
        <ProductSection
          title="Lavado"
          products={products.filter((p) => p.category === "Lavado")}
          onAddToCart={handleAddToCart}
        />
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#F198C0' }}>Tratamiento</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <PreProSection />
            {products
              .filter((p) => p.category === "Tratamiento")
              .map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
          </div>
        </div>
        <ProductSection
          title="Definición"
          products={products.filter((p) => p.category === "Definición")}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Tablet/Desktop View (pantallas md o mayores) */}
      <div className="hidden md:block px-6">
        <h2 className="text-2xl font-bold mb-6" style={{ color: '#F198C0' }}>Linea Special</h2>
        <div className="grid grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} isDesktop />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EcommercePage;