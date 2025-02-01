import React, { useEffect, useState } from "react";

interface WompiButtonProps {
    total: number;
    expiration_time?: string; // Puedes pasar la fecha de expiración como prop opcional
}

const WompiButton: React.FC<WompiButtonProps> = ({ total, expiration_time }) => {
    const [reference, setReference] = useState<string>("");
    const [signature, setSignature] = useState<string>("");

    useEffect(() => {
        // Llamar al backend para generar la referencia y la firma
        const fetchSignature = async () => {
            try {
                const response = await fetch("http://localhost:8000/create_transaction", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ total, expiration_time }),
                });
                const data = await response.json();
                setReference(data.reference);
                setSignature(data.signature);
            } catch (error) {
                console.error("Error fetching Wompi signature:", error);
            }
        };

        fetchSignature();
    }, [total, expiration_time]); // Agregar expiration_time a las dependencias

    useEffect(() => {
        if (reference && signature) {
            const script = document.createElement("script");
            script.src = "https://checkout.wompi.co/widget.js";
            script.setAttribute("data-render", "button");
            script.setAttribute("data-public-key", "pub_test_J8Zt3NHZqOz0JjCY8SCtXtmK2jV1RojW");
            script.setAttribute("data-currency", "COP");
            script.setAttribute("data-amount-in-cents", (total * 100).toString());
            script.setAttribute("data-reference", reference);
            script.setAttribute("data-signature:integrity", signature);
            script.async = true;

            const container = document.getElementById("wompi-button");
            if (container) {
                container.innerHTML = ""; // Limpia el contenedor antes de agregar el nuevo script
                container.appendChild(script);
            }

            return () => {
                if (container) {
                    container.innerHTML = ""; // Limpia el contenedor al desmontar el componente
                }
            };
        }
    }, [reference, signature, total]);

    return <div id="wompi-button"></div>;
};

export default WompiButton;
