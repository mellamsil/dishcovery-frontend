import React, { useState, useContext } from "react";
import ItemCard from "../components/ItemCard";
import AddItem from "../modals/AddItem";
import DeleteConfirm from "../modals/DeleteConfirm";
import SideBar from "../components/SideBar";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { currentUser, userRecipes } = useContext(CurrentUserContext);

  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(null);

  // Handle Add
  const handleAdd = (newItem) => {
    const newItemWithId = {
      ...newItem,
      _id: Date.now().toString(),
      image: newItem.image || "/placeholder.png",
    };
    setItems([...items, newItemWithId]);
  };

  // Handle Delete
  const handleDelete = (id) => {
    setItems(items.filter((item) => item._id !== id));
    setShowDelete(null);
  };

  // Open Add Item Modal from Sidebar
  const openAddItemModal = () => setShowAdd(true);

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <SideBar
        currentUser={currentUser}
        userRecipes={userRecipes}
        onAddItem={openAddItemModal}
      />

      {/* Main Content */}
      <main className="dashboard-main">
        <h1 className="dashboard__title">{currentUser.name}'s Dashboard</h1>
        <p className="dashboard__intro">
          Welcome! Manage your saved items below.
        </p>

        <section className="dashboard__cards items-grid">
          {items.length === 0 ? (
            <p>No items yet. Add one to get started!</p>
          ) : (
            items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onClick={() => console.log("Open item", item)}
                onDeleteClick={() => setShowDelete(item)}
              />
            ))
          )}
        </section>
      </main>

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
    </div>
  );
};

export default Dashboard;
