export const loadProducts = async () => {
  try {
    const response = await fetch("/api/productos");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al cargar productos:", error);
    throw error;
  }
};

export const applyFilters = async (filters) => {
  try {
    const params = new URLSearchParams();

    if (filters.buscar.trim()) {
      params.append("buscar", filters.buscar.trim());
    }

    if (filters.categoria !== "todos") {
      params.append("categoria_id", filters.categoria);
    }

    if (filters.marca !== "todos") {
      params.append("marca_id", filters.marca);
    }

    const url = `/productos/filtrar?${params.toString()}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al aplicar filtros:", error);
    throw error;
  }
};
