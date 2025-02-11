import { useCart } from "./carritoContext";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsBag } from "react-icons/bs";

const Cart = () => {
  const { items, getTotalPrice, removeItem, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [currency, setCurrency] = useState("MXN"); // Moneda por defecto
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search || "");
  const ref = queryParams.get("ref");

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (items.length > 0) {
      setIsOpen(true);
    }
  }, [items]);

  // Obtener el país y ajustar la moneda
  useEffect(() => {
    const fetchCountry = async () => {
      if (ref) {
        try {
          const response = await fetch(`https://api.unicornio.tech/api/pais?ref=${encodeURIComponent(ref)}`);
          const data = await response.json();
          const country = data.pais;

          // Ajustar la moneda según el país
          if (country === "Colombia") {
            setCurrency("COP");
          } else {
            setCurrency("MXN");
          }
        } catch (error) {
          console.error("Error fetching country:", error);
        }
      }
    };

    fetchCountry();
  }, [ref]);

  const handleCheckout = () => {
    const checkoutUrl = `/checkout${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`;
    navigate(checkoutUrl, {
      state: {
        items,
        totalPrice: getTotalPrice(),
      },
    });
  };

  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <>
      <button
        className="fixed bottom-4 right-4 bg-[#F198C0] text-white rounded-full p-3 shadow-lg hover:bg-[#e87ca9]"
        onClick={toggleCart}
      >
        <div className="relative">
          <BsBag size={24} />
          {totalQuantity > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1 transform translate-x-1/2 -translate-y-1/2">
              {totalQuantity}
            </span>
          )}
        </div>
      </button>

      <div className={`cart-overlay ${isOpen ? "open" : ""}`}>
        <div className="cart-content w-96 max-h-[80vh] overflow-y-auto p-4 bg-white rounded-lg shadow-lg">
          <button
            className="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-xl"
            onClick={toggleCart}
          >
            ✕
          </button>

          <h3 className="font-bold text-lg mb-4">Bolsa</h3>

          {items.length === 0 ? (
            <p>No hay productos en tu bolsa</p>
          ) : (
            <div>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain"
                      />
                      <div>
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {currency} {formatPrice(item.price * item.quantity)}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <button
                          className="bg-[#F198C0] text-white px-2 py-1 text-xs rounded-md hover:bg-[#e87ca9]"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          className="bg-[#F198C0] text-white px-2 py-1 text-xs rounded-md hover:bg-[#e87ca9]"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <button
                          className="text-[#F198C0] text-xs hover:underline"
                          onClick={() => removeItem(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <h4 className="font-bold text-lg">
                  Total: {currency} {formatPrice(getTotalPrice())}
                </h4>
                <div className="mt-4 flex space-x-2">
                  <button
                    className="w-full bg-[#F198C0] text-white py-2 rounded-md hover:bg-[#e87ca9]"
                    onClick={handleCheckout}
                  >
                    Pagar
                  </button>
                  <button
                    className="w-full bg-[#F198C0] text-white py-2 rounded-md hover:bg-[#e87ca9]"
                    onClick={toggleCart}
                  >
                    Seguir comprando
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;