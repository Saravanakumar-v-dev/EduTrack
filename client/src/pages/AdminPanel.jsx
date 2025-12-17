import React, { useState, useEffect } from "react";
import axios from "../api/api";
import { FaUserPlus, FaTrashAlt, FaEdit } from "react-icons/fa"; // ✅ correct import path
import { toast } from "react-hot-toast";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "student" });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return toast.error("All fields are required");

    try {
      setLoading(true);
      await axios.post("/admin/users", newUser);
      toast.success("User added successfully");
      setNewUser({ name: "", email: "", role: "student" });
      fetchUsers();
    } catch (err) {
      toast.error("Error adding user");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Error deleting user");
    }
  };

  // ✅ Edit user
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser.name || !editingUser.email) return toast.error("All fields are required");

    try {
      await axios.put(`/admin/users/${editingUser._id}`, editingUser);
      toast.success("User updated successfully");
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Error updating user");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Panel</h2>

      {/* Add New User */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaUserPlus className="text-blue-600" /> Add New User
        </h3>
        <form
          onSubmit={editingUser ? handleUpdate : handleAddUser}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={editingUser ? editingUser.name : newUser.name}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, name: e.target.value })
                : setNewUser({ ...newUser, name: e.target.value })
            }
            className="border p-2 rounded-md flex-1"
          />
          <input
            type="email"
            placeholder="Email"
            value={editingUser ? editingUser.email : newUser.email}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, email: e.target.value })
                : setNewUser({ ...newUser, email: e.target.value })
            }
            className="border p-2 rounded-md flex-1"
          />
          <select
            value={editingUser ? editingUser.role : newUser.role}
            onChange={(e) =>
              editingUser
                ? setEditingUser({ ...editingUser, role: e.target.value })
                : setNewUser({ ...newUser, role: e.target.value })
            }
            className="border p-2 rounded-md"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className={`px-4 py-2 rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingUser ? "Update User" : "Add User"}
          </button>

          {editingUser && (
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 rounded-md bg-gray-400 text-white hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* User List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">User Management</h3>
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Role</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 text-center space-x-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
