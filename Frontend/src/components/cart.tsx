import { useCart } from "./carritoContext";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsBag } from "react-icons/bs";

const Cart = () => {
  const { items, getTotalPrice, clearCart, removeItem, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  // Efecto para abrir automáticamente la bolsa cuando se agrega un producto
  useEffect(() => {
    if (items.length > 0) {
      setIsOpen(true);
    }
  }, [items]);

  const handleCheckout = () => {
    const queryParams = new URLSearchParams(location.search || "");
    const ref = queryParams.get("ref");
    const checkoutUrl = `/checkout${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`;
    navigate(checkoutUrl, {
      state: {
        items,
        totalPrice: getTotalPrice(),
      },
    });
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
        <div className="cart-content">
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
                        className="w-16 h-16 object-contain"
                      />
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        MXN{item.price * item.quantity}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <button
                          className="bg-[#F198C0] text-white px-2 py-1 text-sm rounded-md hover:bg-[#e87ca9]"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          className="bg-[#F198C0] text-white px-2 py-1 text-sm rounded-md hover:bg-[#e87ca9]"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <button
                          className="text-[#F198C0] text-sm hover:underline"
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
                  Total: MXN {getTotalPrice().toLocaleString()}
                </h4>
                <div className="mt-4 flex space-x-2">
                  <button
                    className="w-full bg-[#F198C0] text-white py-2 rounded-md hover:bg-[#e87ca9]"
                    onClick={handleCheckout}
                  >
                    Comprar
                  </button>
                  <button
                    className="w-full bg-[#F198C0] text-white py-2 rounded-md hover:bg-[#e87ca9]"
                    onClick={clearCart}
                  >
                    Vaciar bolsa
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