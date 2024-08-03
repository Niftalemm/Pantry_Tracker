"use client";
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  collection,
  addDoc,
  getDocs,
  querySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  getFirestore
} from "firebase/firestore";
import { db } from "./firebase";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
// Description: This is the main page of the app. It will display the main content of the app.
// Libraries: React, useState, useEffect
// Components: None
// Custom Components: None

/**
 * Represents the Home component of the inventory management app.
 * @returns {JSX.Element} The rendered Home component.
 */
export default function Home() {
  const [items, setItems] = useState([
    // { name: "Apples", quantity: 5 },
    // { name: "Banana", quantity: 4 },
    // { name: "Orange", quantity: 1 },
  ]);

  /**
   * Represents the state of a new item.
   * @typedef {Object} NewItemState
   * @property {string} name - The name of the new item.
   * @property {string} quantity - The quantity of the new item.
   */

  /**
   * The state and setter for the new item.
   * @type {[NewItemState, function]} newItem
   */
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [newQuantity, setNewQuantity] = useState({ quantity: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);

  // Function to add a new item to the database
const addItemToDatabase = async (newItem) => {
  try {
    await addDoc(collection(db, "items"), {
      name: newItem.name.trim(),
      quantity: newItem.quantity,
    });
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};


  // Function to update an existing item in the database
  const updateItemInDatabase = async (item) => {
    try {
      const q = query(collection(db, "items"), where("name", "==", item.name));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnapshot) => {
        const itemRef = doc(db, "items", docSnapshot.id);
        await updateDoc(itemRef, {
          quantity: item.quantity,
        });
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Add item to the list
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== "" && newItem.quantity !== "") {
      const itemExists = items.find(item => item.name === newItem.name);
      if (itemExists) {
        itemExists.quantity = newItem.quantity;
        await updateItemInDatabase(itemExists);
      } else {
        await addItemToDatabase(newItem);
      }
      setNewItem({ name: "", quantity: "" });
    } else {
      if (newItem.name === "") {
        alert("Please enter an item name");
      }
      if (newItem.quantity === "" || newItem.quantity === 0 || newItem.quantity < 0) {
        alert("Please enter a quantity");
      }
      if (newItem.name === "" && newItem.quantity === "") {
        alert("Please enter an item name and quantity");
      }
    }
  };
  //   e.preventDefault();
  //   if (newItem.name !== "" && newItem.quantity !== "") {
  //     //setItems([...items, newItem]);
  //     await addDoc(collection(db, "items"), {
  //       name: newItem.name.trim(),
  //       quantity: newItem.quantity,
  //     });
  //     setNewItem({ name: "", quantity: "" });
  //   }
  //   if (newItem.name === "") {
  //     alert("Please enter an item name");
  //   }
  //   if (newItem.quantity === "" || newItem.quantity === 0 || newItem.quantity < 0) {
  //     alert("Please enter a quantity");
  //   }
  //   if (newItem.name === "" && newItem.quantity === "") {
  //     alert("Please enter an item name and quantity");
  //   }
  //   const itemExists = items.find(item => item.name === newItem.name);
  //   if (itemExists) {
  //     setNewItem({ name: "", quantity: "" });
  //     alert("Item already exists in the database.");
  //     return;
  //   }

  // };
  //Read the data from the database
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];
      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);
    });
  });

  // Read total number of items
  const calculateTotal = () => {
    const totalItems = items.reduce((acc, item) => {
      (sum, Items) => sum + parseInt(items.quantity);
      0; // initial value
    });
    calculateTotal();
    return () => unsubscribe();
  };

  //delete the item from the list
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };
  //update the item from the list

  const updateItem = async (id) => {
    if (!id) {
      console.error("Item ID is required to update the item.");
      return;
    }
    if (!newQuantity) {
      console.error("New quantity is required to update the item.");
      return;
    }
    try {
      const itemRef = doc(db, "items", id); // Reference to the item
      await updateDoc(itemRef, {
        quantity: newQuantity,
      });
      console.log("Item with id: ${id}updated successfully");
    } catch (e) {
      console.error("Error updating item:", e);
    }
  };


  // Search the item from the list
  

  return (
    
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="bg-secondary rounded-3xl Container">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <div className="bg-antiquewhite p-4 rounded-2xl">
          <form className="grid grid-cols-6 items-center text-black">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-1 border rounded-md"
              type="text"
              placeholder="Enter an item"
            />
            <input
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className="col-span-2 p-1 border mx-3 rounded-md"
              type="number"
              placeholder="Enter quantity"
            />
            <button
              onClick={addItem}
              className = "btn btn-outline-light"
              type="submit"
            >
              +
            </button>
          </form>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery((e.target.value))}
            className="text-black p-1 border rounded"
            pattern="Search"
            placeholder="Search for an item"
          />
          <button
            className="btn btn-outline-light"
            type="Submit">
            <FaSearch/>

            

          </button>
          <ul>
            {items.map((item, id) => (
              <li key={id} className="p-4 bg-gray-600 my-2 rounded-lg">
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span className="float-right">{item.quantity}</span>
                </div>
                <button
                  onClick={() => {
                    console.log("Updating item with id:", item.id);
                    updateItem(item.id);
                  }}
                  className="bg-slate-950 hover:bg-slate-900 p-2 text-white hover:bg-slate-900 w-7 h-7 rounded-full float-left"
                >
                  <FaEdit />
                </button>
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(Number(e.target.value))}
                  className="p-1 border rounded"
                  placeholder="Enter new quantity"
                />

                <button
                  onClick={() => {
                    console.log("Deleting item with id:", item.id);
                    deleteItem(item.id);
                  }}
                  className="bg-slate-950 hover:bg-slate-900 p-2 text-white hover:bg-slate-900 w-7 h-7 rounded-full float-right"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? (
            "No items in your pantry"
          ) : (
            <div className="flex justify-between p-3">
              <span>Total types of Items:</span>
              <span>{items.length}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
