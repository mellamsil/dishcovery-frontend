import React, { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import ItemCard from "../components/ItemCard";
import AddItem from "../modals/AddItem";
import DeleteConfirm from "../modals/DeleteConfirm";
import "../styles/Profile.css";

const Profile = () => {
  const { currentUser } = useContext(CurrentUserContext);
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [showDelete, setShowDelete] = useState(null);

  // Mock initial cookbook items
  const MOCK_ITEMS = [
    {
      _id: "1",
      title: "Spaghetti Bolognese",
      description: "Classic pasta dish",
      image: "https://via.placeholder.com/150?text=Spaghetti",
    },
    {
      _id: "2",
      title: "Chicken Curry",
      description: "Spicy and creamy curry",
      image: "https://via.placeholder.com/150?text=Curry",
    },
    {
      _id: "3",
      title: "Caesar Salad",
      description: "Fresh and healthy",
      image: "https://via.placeholder.com/150?text=Salad",
    },
  ];

  // Simulate API delay
  const fakeApi = (result, delay = 600) =>
    new Promise((resolve) => setTimeout(() => resolve(result), delay));

  // Load cookbook automatically when user logs in
  useEffect(() => {
    if (!currentUser) return;
    fakeApi(MOCK_ITEMS).then((data) => setItems(data));
  }, [currentUser]);

  // Add new recipe
  const handleAdd = (newItem) => {
    const savedItem = { ...newItem, _id: Date.now().toString() };
    if (!savedItem.image)
      savedItem.image = "https://via.placeholder.com/150?text=Recipe";
    fakeApi(savedItem).then((item) => setItems((prev) => [...prev, item]));
  };

  // Edit existing recipe
  const handleEdit = (updatedItem) => {
    fakeApi(updatedItem).then((savedItem) =>
      setItems((prev) =>
        prev.map((item) => (item._id === savedItem._id ? savedItem : item))
      )
    );
  };

  // Delete recipe
  const handleDelete = (itemToDelete) => {
    fakeApi(true).then(() =>
      setItems((prev) => prev.filter((item) => item._id !== itemToDelete._id))
    );
    setShowDelete(null);
  };

  // If user is not logged in
  if (!currentUser) {
    return (
      <p className="text-center">
        Please sign in to view your profile and cookbook.
      </p>
    );
  }

  return (
    <div className="profile container">
      <h1>{currentUser.name || currentUser.email}'s Profile & Cookbook</h1>

      {/* User Avatar */}
      <div className="profile-avatar">
        <img
          src={currentUser.avatar || "https://via.placeholder.com/80?text=User"}
          alt="User Avatar"
          className="avatar"
        />
      </div>

      <section className="cookbook">
        <h2>My Cookbook</h2>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          + Add Item
        </button>

        <div className="items-grid">
          {items.length === 0 ? (
            <p>No recipes in your cookbook yet.</p>
          ) : (
            items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onClick={() => {
                  setEditItem(item);
                  setShowAdd(true);
                }}
                onDeleteClick={() => setShowDelete(item)}
              />
            ))
          )}
        </div>
      </section>

      {/* Add/Edit Modal */}
      {showAdd && (
        <AddItem
          item={editItem}
          onClose={() => {
            setShowAdd(false);
            setEditItem(null);
          }}
          onAdd={editItem ? handleEdit : handleAdd}
        />
      )}

      {/* Delete Confirm */}
      {showDelete && (
        <DeleteConfirm
          item={showDelete}
          onDelete={() => handleDelete(showDelete)}
          onCancel={() => setShowDelete(null)}
        />
      )}
    </div>
  );
};

export default Profile;
