import axios from 'axios'
import { useState, useEffect } from 'react';
import { showToast } from '../Toast';

const TaskModal = ({ isOpen, onClose, backendUrl }) => {
    if (!isOpen) return null;

    const [users, setUsers] = useState([]);
    const [files, setFiles] = useState([]);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState("Low");
    const [status, setStatus] = useState("Pending");
    const [dueDate, setDueDate] = useState("");
    const [assignedTo, setAssignedTo] = useState(""); 
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const maxFiles = 3;

        if (selectedFiles.length > maxFiles) {
            alert(`You can only upload a maximum of ${maxFiles} files.`);
            e.target.value = null;
            setFiles([]);
            return;
        }

        if (selectedFiles.length === 0) {
            setFiles([]);
            return;
        }

        setFiles(selectedFiles);
    }

    const getUsers = async () => {
        try {
            const res = await axios.get(`${backendUrl}/admin/users`);
            setUsers(res.data)
            if (res.data.length > 0) {
                setAssignedTo(res.data[0]._id);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    }

    useEffect(() => {
        if (isOpen) {
            getUsers();
        }
    }, [isOpen])

    const handleSubmit = async () => {

        if (!title || !desc || !dueDate || !assignedTo) {
            showToast("Please fill in all task details.", 'error');
            return;
        }
        if (files.length === 0) {
            showToast("At least one PDF attachment is required.", 'error');
            return;
        }
        
        setIsLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', desc);
        formData.append('priority', priority.toLowerCase());
        formData.append('status', status.toLowerCase().replace(' ', '-'));
        formData.append('dueDate', dueDate);
        formData.append('assignedTo', assignedTo);
        
        files.forEach(file => {
            formData.append('attachments', file);
        });

        try {
            await axios.post(`${backendUrl}/task/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            showToast("Task created and assigned successfully!", 'success');
            onClose(); 
        } catch (err) {
            console.error(err);
            showToast(err.response?.data?.message || "Failed to create task.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto m-4 animate-fadeIn">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-300 dark:border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Create Task
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Title</label>
                        <input
                            type="text"
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900"
                            placeholder="Enter task title"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Description</label>
                        <textarea
                            rows="3"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900"
                            placeholder="Enter description"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Priority</label>
                            <select 
                                value={priority} 
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Urgent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Status</label>
                            <select 
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900"
                            >
                                <option>Pending</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                                <option>Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900"
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1">Assign To</label>
                            <select 
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900"
                                disabled={users.length === 0} 
                            >
                                {users.length === 0 ? (
                                    <option value="" disabled>No user registered yet</option>
                                ) : (
                                    <>
                                        {users.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block font-medium mb-1">
                            Attachments (PDF only, max 3)
                        </label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept=".pdf"
                            className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900"
                        />
                        <small className="text-gray-500 text-sm">
                            You can upload up to 3 PDF files. ({files.length} selected)
                        </small>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-5 border-t border-gray-300 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Task'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;