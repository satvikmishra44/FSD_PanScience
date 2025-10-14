import React from "react";

const UserModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center p-5 border-b border-gray-300 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Create User
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">First Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Last Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Role</label>
            <select className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900">
              <option>User</option>
              <option>Admin</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900"
            />
            <small className="text-gray-500 text-sm">
              Leave empty to keep current password
            </small>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            Save User
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
