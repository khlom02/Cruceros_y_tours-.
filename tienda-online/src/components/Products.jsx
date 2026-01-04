import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "./header.jsx";
import Footer from "./footer.jsx";
import TopVentas from "./topVentas.jsx";
import { useCart } from "../components/cartContext/cartContext.jsx"; // Corregido: Ruta correcta para useCart

import {
  fetchProducts,
  fetchCategories,
  fetchBrands,
  applyFilters,
} from "../backend/supabase_client";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    categoria: "todos",
    marca: "todos",
    buscar: "",
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Obtener la función agregarAlCarrito del contexto
  const { agregarAlCarrito } = useCart();

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Cargar productos al iniciar
  useEffect(() => {
    const loadProductsData = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    loadProductsData();
  }, []);

  // Cargar categorías y marcas
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [fetchedCategories, fetchedBrands] = await Promise.all([
          fetchCategories(),
          fetchBrands(),
        ]);

        setCategories(fetchedCategories);
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Error al cargar categorías o marcas:", error);
      }
    };

    loadFilters();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    const apply = async () => {
      const filteredProducts = await applyFilters(filters);
      setProducts(filteredProducts);
    };

    apply();
  }, [filters]);

  return (
    <>
      {/* Imagen header */}
      <img
        src="./src/imagenes/image01.jpg"
        className="imagen_header_productos"
        alt=""
      />

      <div className="container-fluid mt-4 position-relative">
        {/* PANEL LATERAL */}
        <aside
          className="col-md-3 col-lg-2 mb-4 mt-5 position-absolute top-0 start-0"
          style={{ transform: "translateY(-25px)" }}
        >
          <h5 className="fw-bold mb-3">Filtrar por:</h5>

          {/* Filtro categoría */}
          <div className="mb-3">
            <label htmlFor="categoria" className="form-label">
              Productos
            </label>
            <select
              id="categoria"
              className="form-select"
              value={filters.categoria}
              onChange={handleFilterChange}
            >
              <option value="todos">Todos</option>
              {categories.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro marca */}
          <div className="mb-3">
            <label htmlFor="marca" className="form-label">
              Marcas
            </label>
            <select
              id="marca"
              className="form-select"
              value={filters.marca}
              onChange={handleFilterChange}
            >
              <option value="todos">Todos</option>
              {brands.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro búsqueda */}
          <div className="mb-3">
            <label htmlFor="buscar" className="form-label">
              Buscar
            </label>
            <input
              type="text"
              id="buscar"
              className="form-control"
              placeholder="Buscar producto..."
              value={filters.buscar}
              onChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* SECCIÓN PRODUCTOS */}
        <section className="offset-md-3 offset-lg-2 col-md-9 col-lg-10">
          {/* BREADCRUMB */}
          <div className="d-flex flex-wrap align-items-center justify-content-between bg-light p-3 rounded-3 mb-4 shadow-sm">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <a href="#" id="breadcrumb-inicio">
                    Inicio
                  </a>
                </li>
                <li
                  className="breadcrumb-item active fw-semibold"
                  id="breadcrumb-categoria"
                  aria-current="page"
                >
                  Todos los productos
                </li>
              </ol>
            </nav>

            <div className="text-muted fw-semibold">
              <span id="categoria-seleccionada">
                Mostrando: Todos los productos
              </span>
            </div>
          </div>

          {/* GRID PRODUCTOS */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {products.length === 0 ? (
              <p className="text-center w-100 text-muted">
                No hay productos disponibles.
              </p>
            ) : (
              products.map((product) => (
                <div className="col" key={product.id}>
                  <div className="card h-100">
                    <Link
                      to={`/detalles/${product.id}`}
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <img
                        src={
                          product.imagen_url || "static/imagenes/default.jpg"
                        }
                        className="card-img-top"
                        alt={product.nombre}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.nombre}</h5>
                        <p className="card-text">
                          {product.descripcion || "Sin descripción disponible."}
                        </p>
                        <p className="card-text fw-bold">
                          {product.precio
                            ? `$${product.precio}`
                            : "Precio no disponible"}
                        </p>
                      </div>
                    </Link>
                    {/* Botón de Agregar al Carrito */}
                    <div className="card-footer bg-white border-0 pt-0">
                    <button
                        onClick={() => {
                          alert("Producto agregado al carrito");
                          agregarAlCarrito(product); // Lógica existente para agregar al carrito
                        }}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <TopVentas />
    </>
  );
};

export default Products;
