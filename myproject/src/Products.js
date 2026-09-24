import { useState, useEffect } from "react";

function Products() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [products, setProducts] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // GET - Load products
  useEffect(() => {
    fetch("http://localhost:5000/api/products", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log("Error fetching products:", error);
      });
  }, [token]);

  // POST - Add product
  const addProduct = () => {
    if (name === "" || price === "" || stock === "") {
      alert("Please fill all fields");
      return;
    }

    const newProduct = {
      name: name,
      price: Number(price),
      stock: Number(stock)
    };

    fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newProduct)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.product) {
          setProducts([...products, data.product]);

          setName("");
          setPrice("");
          setStock("");
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.log("Error adding product:", error);
      });
  };

  // PUT - Edit product
  const editProduct = (product) => {
    const newPrice = prompt(
      "Enter new price:",
      product.price
    );

    const newStock = prompt(
      "Enter new stock:",
      product.stock
    );

    if (newPrice === null || newStock === null) {
      return;
    }

    const updatedProduct = {
      price: Number(newPrice),
      stock: Number(newStock)
    };

    fetch(
      `http://localhost:5000/api/products/${product.name}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.product) {
          const updatedProducts = products.map((item) => {
            if (item.id === product.id) {
              return {
                ...item,
                price: data.product.price,
                stock: data.product.stock
              };
            }

            return item;
          });

          setProducts(updatedProducts);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.log("Error updating product:", error);
      });
  };

  // DELETE - Delete product
  const deleteProduct = (productId) => {
    fetch(
      `http://localhost:5000/api/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.message === "Product deleted successfully") {
          const updatedProducts = products.filter(
            (product) => product.id !== productId
          );

          setProducts(updatedProducts);
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.log("Error deleting product:", error);
      });
  };

  return (
    <div className="products">
      <h2>Products</h2>

      {/* Admin and Manager can add */}
      {(user?.role === "Admin" ||
        user?.role === "Manager") && (
        <div>
          <input
            type="text"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <button onClick={addProduct}>
            Add Product
          </button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.stock}</td>

              <td>
                {/* Admin and Manager can edit */}
                {(user?.role === "Admin" ||
                  user?.role === "Manager") && (
                  <button
                    onClick={() => editProduct(product)}
                  >
                    Edit
                  </button>
                )}

                {/* Only Admin can delete */}
                {user?.role === "Admin" && (
                  <button
                    onClick={() =>
                      deleteProduct(product.id)
                    }
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products;