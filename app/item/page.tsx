"use client";

import { useEffect, useState } from "react";

type Item = {
  _id: string;
  itemName: string;
  itemCategory: string;
  itemPrice: number;
  status: string;
};

export default function ItemPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);

  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemPrice, setItemPrice] = useState<number>(0);

  /* ================= FETCH ================= */
  const fetchItems = async (p = page) => {
    const res = await fetch(`/api/item?page=${p}&limit=${limit}`);
    const data = await res.json();

    setItems(data.items);
    setTotal(data.total);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems(page);
  }, [page]);

  /* ================= ADD ================= */
  const handleAdd = async () => {
    if (!itemName || !itemCategory) return alert("กรอกข้อมูลให้ครบ");

    await fetch("/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemName,
        itemCategory,
        itemPrice,
        status: "available",
      }),
    });

    setItemName("");
    setItemCategory("");
    setItemPrice(0);

    fetchItems(1);
    setPage(1);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("ลบรายการนี้?")) return;

    await fetch(`/api/item/${id}`, {
      method: "DELETE",
    });

    fetchItems(page);
  };

  const totalPages = Math.ceil(total / limit);

  /* ================= UI ================= */
  return (
    <div style={{ padding: 24 }}>
      <h1>Item Management</h1>

      {/* ===== ADD FORM ===== */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          placeholder="Category"
          value={itemCategory}
          onChange={(e) => setItemCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={itemPrice}
          onChange={(e) => setItemPrice(Number(e.target.value))}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {/* ===== TABLE ===== */}
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td>{item.itemName}</td>
              <td>{item.itemCategory}</td>
              <td>{item.itemPrice}</td>
              <td>{item.status}</td>
              <td>
                <button onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== PAGINATION ===== */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} / {totalPages || 1}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
