import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [store, setStore] = useState([]);
  const [socketMessage, setSocketMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/products");
        setStore(response.data.products);
      } catch (error) {
        console.log("Error fetching products:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const socket = new WebSocket("wss://your-backend-url.com/socket"); // Replace with actual WebSocket URL

    socket.onopen = () => {
      console.log("WebSocket Connected");
      socket.send("Subscribe to stock updates");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Update stock in real-time if the update is related to stock
      setStore((prevStore) =>
        prevStore.map((item) =>
          item.id === data.productId ? { ...item, stock: data.newStock } : item
        )
      );

      setSocketMessage(data);
    };

    socket.onerror = () => {
      console.log("WebSocket Error Occurred");
    };

    socket.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      {store.map((eachItem) => (
        <div key={eachItem.id}>
          <h3>
            {eachItem.id}. {eachItem.title}
          </h3>
          <p>Price: {eachItem.price}</p>
          <p>In Stock: {eachItem.stock}</p>
        </div>
      ))}

      {socketMessage && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid red" }}>
          <h3>Live Update:</h3>
          <p>Product ID: {socketMessage.productId} - New Stock: {socketMessage.newStock}</p>
        </div>
      )}
    </div>
  );
};

export default App;
