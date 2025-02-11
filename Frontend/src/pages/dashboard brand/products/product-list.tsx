import { useEffect, useState } from "react";

interface ProductListProps {
  pais?: string | null;
}

const products = [
  {
    id: 1,
    name: "Shampoo",
    description: "cleaning & freshness",
    price: 507,
    image:
      "https://u-niverse.s3.us-east-1.amazonaws.com/RF_Rosa_Shampoo_Mesa+de+trabajo+1.png",
  },
  {
    id: 2,
    name: "Acondicionador",
    description: "shine & softness",
    price: 507,
    image:
      "https://u-niverse.s3.us-east-1.amazonaws.com/RF_Rosa_Conditioner_Mesa+de+trabajo+1+1.png",
  },
  {
    id: 3,
    name: "Gel",
    description: "shine & hold",
    price: 507,
    image:
      "https://u-niverse.s3.us-east-1.amazonaws.com/RF_Rosa_DefiningGel_Mesa+de+trabajo+1.png",
  },
  {
    id: 4,
    name: "Crema 3 en 1",
    description: "repair moisturize & define",
    price: 507,
    image:
      "https://u-niverse.s3.us-east-1.amazonaws.com/RF_Rosa_CurlingCream_Mesa+de+trabajo+1.png",
  },
  {
    id: 5,
    name: "Shampoo Special Men",
    description: "cleaning & freshness",
    price: 507,
    image: "https://u-niverse.s3.us-east-1.amazonaws.com/SHAMPOO+MEN.png",
  },
  {
    id: 6,
    name: "Aceite",
    description: "pre lavado",
    price: 427,
    image:
      "https://u-niverse.s3.us-east-1.amazonaws.com/RF_Rosa_MoisturizingOil_Mesa+de+trabajo+1.png",
  },
  {
    id: 7,
    name: "Cream 3 in 1 Men",
    description: "repair & define",
    price: 507,
    image: "https://u-niverse.s3.us-east-1.amazonaws.com/CREAM+3+IN+1.png",
  },
  {
    id: 8,
    name: "Gel Men",
    description: "shine & hold",
    price: 507,
    image: "https://u-niverse.s3.us-east-1.amazonaws.com/GEL+MEN.png",
  },
];

const ProductList = ({ pais }: ProductListProps) => {
  const [currentPais, setCurrentPais] = useState<string | null>(pais ?? null);

  useEffect(() => {
    if (!currentPais) {
      setCurrentPais(localStorage.getItem("pais"));
    }
  }, [currentPais]);

  const formatPrice = (price: number, pais: string | null) => {
    if (pais === "Colombia") {
      if (price === 427) return "59.400";
      return "77.350";
    }
    return price.toString(); // Sin decimales para MXN
  };

  const currencySymbol = currentPais === "Colombia" ? "COP" : "MXN";

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <div key={product.id} className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-0 relative" style={{ width: "100%", height: "150px" }}>
            <img
              src={product.image}
              alt={product.name}
              className="object-contain w-full h-full rounded-t-lg"
            />
          </div>

          <div className="flex-grow p-2">
            <h3 className="mb-1 text-sm font-semibold">{product.name}</h3>
            <p className="text-xs text-gray-600">{product.description}</p>
          </div>

          <div className="p-2">
            <span className="text-sm font-bold">
              {currencySymbol} {formatPrice(product.price, currentPais)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
