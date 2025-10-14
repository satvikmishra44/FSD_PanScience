import React from "react";

const TaskDetailModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const dummyTask = {
    title: "Frontend Revamp",
    description: "Update landing page and navbar UI.",
    priority: "High",
    status: "In Progress",
    dueDate: "2025-10-20",
    assignedTo: "Satvik",
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center p-5 border-b border-gray-300 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Task Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-3">
          {Object.entries(dummyTask).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium capitalize">{key}</span>
              <span className="text-gray-700 dark:text-gray-300">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Close
          </button>
          <button className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600">
            Edit
          </button>
          <button className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
