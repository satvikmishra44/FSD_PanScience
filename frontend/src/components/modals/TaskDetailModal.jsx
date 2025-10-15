import React, { useState, useEffect } from "react";
import axios from "axios";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-medium capitalize">{label}</span>
    <span className="text-gray-700 dark:text-gray-300">{value}</span>
  </div>
);

const SelectInput = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="font-medium capitalize text-sm mb-1">{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  </div>
);

const AttachmentSection = ({ attachments, backendUrl }) => {
  if (!attachments || attachments.length === 0) return null;

  const getAttachmentLink = (localPath) => {
    const pathParts = localPath.split('uploads\\');
    const filePart = pathParts.length > 1 ? pathParts[1].replace(/\\/g, '/') : null;
    return filePart ? `${backendUrl}/uploads/${filePart}` : null;
  };

  const getFileName = (localPath) => {
    const parts = localPath.split(/[\\/]/);
    return parts[parts.length - 1].replace(/\d+-/, '');
  };

  return (
    <div className="space-y-2 border-t pt-4 border-gray-200 dark:border-gray-700">
      <h4 className="font-semibold text-gray-800 dark:text-gray-100">Attachments (PDF)</h4>
      {attachments.map((path, index) => {
        const url = getAttachmentLink(path);
        const fileName = getFileName(path);

        return url ? (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md"
          >
            <span className="truncate text-sm mr-4">{fileName}</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm ml-auto"
            >
              View / Download
            </a>
          </div>
        ) : null;
      })}
    </div>
  );
};

const TaskDetailModal = ({ isOpen, onClose, task, backendUrl }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      setEditFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "pending",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      });
      setIsEditing(false);
      setError(null);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put(`${backendUrl}/task/${task._id}`, editFormData);
      if (response.status === 200) {
        onClose();
        window.location.reload();
      }
    } catch {
      setError("Failed to update task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    setIsLoading(true);
    try {
      const response = await axios.delete(`${backendUrl}/task/${task._id}`);
      if (response.status === 200) {
        onClose();
        window.location.reload();
      }
    } catch {
      setError("Failed to delete task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayedDetails = [
    { key: "Title", value: task.title },
    { key: "Description", value: task.description },
    { key: "Priority", value: task.priority.charAt(0).toUpperCase() + task.priority.slice(1) },
    { key: "Status", value: task.status.charAt(0).toUpperCase() + task.status.slice(1) },
    { key: "Due Date", value: new Date(task.dueDate).toLocaleDateString() },
    { key: "Assigned To", value: task.assignedTo?.name || "This User" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center p-5 border-b border-gray-300 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {isEditing ? "Edit Task" : "Task Details"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
            disabled={isLoading}
          >
            &times;
          </button>
        </div>

        <div className="p-5 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm" role="alert">
              {error}
            </div>
          )}

          {isEditing ? (
            <form className="space-y-4" onSubmit={handleUpdate}>
              <div className="flex flex-col">
                <label htmlFor="title" className="font-medium text-sm mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={editFormData.title}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="description" className="font-medium text-sm mb-1">Description</label>
                <textarea
                  name="description"
                  id="description"
                  value={editFormData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <SelectInput label="Status" name="status" value={editFormData.status} onChange={handleInputChange} options={['pending', 'in-progress', 'completed']} />
              <SelectInput label="Priority" name="priority" value={editFormData.priority} onChange={handleInputChange} options={['low', 'medium', 'high']} />

              <div className="flex flex-col">
                <label htmlFor="dueDate" className="font-medium text-sm mb-1">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={editFormData.dueDate}
                  onChange={handleInputChange}
                  required
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {displayedDetails.map(detail => (
                <DetailRow key={detail.key} label={detail.key} value={detail.value} />
              ))}
              <AttachmentSection attachments={task.attachments} backendUrl={backendUrl} />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={isLoading}
          >
            Close
          </button>

          {isEditing ? (
            <button
              onClick={handleUpdate}
              className={`px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
                disabled={isLoading}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className={`px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;