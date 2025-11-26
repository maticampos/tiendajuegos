import { Link, useNavigate } from "react-router-dom";
import CarritoCompras from "./Carrito";
import { useCartContext } from "../context/CartContext";
import { useAuthContext } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";
import { useState } from "react";

export default function Productos() {
  const { productos, cargando, error } = useProducts();
  const { agregarAlCarrito } = useCartContext();
  const { esAdmin } = useAuthContext();
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");

  const manejarEliminar = (producto) => {
    // Navegar a la página de confirmación de eliminación
    navigate('/eliminar-producto', { state: { producto } });
  };

  const manejarEditar = (producto) => {
    // Navegar al formulario de edición
    navigate('/formulario-producto', { state: { producto } });
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (producto.categoria && producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
)
  );


  if (cargando) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <div className="row mb-4">
          <div className="col-12 col-md-6">
            <label className="form-label fw-bold">Buscar productos</label>
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              className="form-control"
              aria-label="Ingrese el producto o la categoría para buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <small className="text-muted">
                Mostrando {productosFiltrados.length} de {productos.length} productos
              </small>
            )}
          </div>
        </div>

      <ul id="lista-productos">
        {productosFiltrados.map((producto) => (
          <ProductoItem
            key={producto.id}
            producto={producto}
            esAdmin={esAdmin}
            onEditar={() => manejarEditar(producto)}
            onEliminar={() => manejarEliminar(producto)}
            onAgregarCarrito={() => agregarAlCarrito(producto)}
          />
        ))}
      </ul>
       { /*<CarritoCompras /> */ }
    </>
  );
}

const ProductoItem = ({ producto, esAdmin, onEditar, onEliminar, onAgregarCarrito }) => (
  <li>
    <h2>{producto.nombre}</h2>
    <p>Descripción: {producto.descripcion}</p>
    <p>Categoría: {producto.categoria}</p>
    <img src={producto.avatar} alt={producto.nombre} width="50%" />
    <p><strong>Precio: ${producto.precio}</strong></p>
   
    <Link to={`/productos/${producto.id}`} state={{producto}}>
      <button aria-label="Mas detalles">Más detalles</button>
    </Link>
   
    <button onClick={onAgregarCarrito}>Comprar</button>

    {/* BOTONES ADMIN - Agregar contenedor */}
    {esAdmin && (
      <div className="btn-admin-container">
        <hr/>
        <button aria-label="Editar producto" onClick={onEditar} className="btn-editar">
          Editar
        </button>
        <button aria-label="Eliminar producto" onClick={onEliminar} className="btn-eliminar">
          Eliminar
        </button>
      </div>
    )}
  </li>
);