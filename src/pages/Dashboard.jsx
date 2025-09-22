import React, { useState } from "react";
import ItemCard from "../components/ItemCard";
import AddItem from "../modals/AddItem";
import DeleteConfirm from "../modals/DeleteConfirm";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(null);

  // Handle Add
  const handleAdd = (newItem) => {
    setItems([
      ...items,
      { ...newItem, _id: Date.now().toString(), image: "/placeholder.png" },
    ]);
  };

  // Handle Delete
  const handleDelete = (id) => {
    setItems(items.filter((item) => item._id !== id));
    setShowDelete(null);
  };

  return (
    <main className="dashboard">
      <h1 className="dashboard__title">Dashboard</h1>
      <p className="dashboard__intro">
        Welcome! Manage your saved items below.
      </p>

      <button className="btn-primary" onClick={() => setShowAdd(true)}>
        + Add Item
      </button>

      <section className="dashboard__cards items-grid">
        {items.length === 0 ? (
          <p>No items yet. Add one to get started!</p>
        ) : (
          items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              onClick={() => console.log("Open item", item)}
              onDeleteClick={(item) => setShowDelete(item)}
            />
          ))
        )}
      </section>

      {/* Add Item Modal */}
      {showAdd && (
        <AddItem onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      )}

      {/* Delete Confirm Modal */}
      {showDelete && (
        <DeleteConfirm
          item={showDelete}
          onDelete={handleDelete}
          onCancel={() => setShowDelete(null)}
        />
      )}
    </main>
  );
};

export default Dashboard;
