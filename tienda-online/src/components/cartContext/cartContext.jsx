import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoAnterior) => {
      const index = carritoAnterior.findIndex(
        (p) => p.id === producto.id
      );

      if (index !== -1) {
        const copia = [...carritoAnterior];
        copia[index] = {
          ...copia[index],
          cantidad: copia[index].cantidad + 1,
        };
        return copia;
      }

      return [...carritoAnterior, { ...producto, cantidad: 1 }];
    });
  };

  const actualizarCantidad = (id, incremento) => {
    setCarrito((carritoAnterior) => {
      return carritoAnterior.map((producto) => {
        if (producto.id === id) {
          const nuevaCantidad = producto.cantidad + incremento;
          return {
            ...producto,
            cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1,
          };
        }
        return producto;
      });
    });
  };

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, actualizarCantidad }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
};
