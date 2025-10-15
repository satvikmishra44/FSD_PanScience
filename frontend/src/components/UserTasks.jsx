import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; 
import TaskDetailModal from '../components/modals/TaskDetailModal';
import { useLocation } from 'react-router-dom';

const priorityOptions = ['All', 'low', 'medium', 'high'];
const statusOptions = ['All', 'pending', 'in-progress', 'completed'];

const getStatusClasses = (status) => {
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const getPriorityClasses = (priority) => {
    switch (priority) {
        case 'high': return 'text-red-600 font-bold';
        case 'medium': return 'text-orange-500';
        case 'low': return 'text-green-500';
        default: return 'text-gray-500';
    }
};

const getSafeUser = () => {
    const defaultUser = { id: null, name: "Guest" };
    const userString = localStorage.getItem("taskUser");

    if (!userString) return defaultUser;

    try {
        return JSON.parse(userString);
    } catch (e) {
        console.error("Local storage 'taskUser' is corrupted:", e);
        return defaultUser;
    }
};

const UserTasks = ({ 
    backendUrl,
    // Removed initialPriority, initialStatus, initialDueDate props as they are now read from router state
}) => {
    // 🎯 NEW HOOK USAGE 🎯
    const location = useLocation();
    const passedState = location.state || {}; // State passed from Dashboard

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 🎯 CHANGE: Initialize filter status from router state 🎯
    const [filterPriority, setFilterPriority] = useState(passedState.initialPriority || 'All');
    const [filterStatus, setFilterStatus] = useState(passedState.initialStatus || 'All');
    const [filterDueDate, setFilterDueDate] = useState(passedState.initialDueDate || '');
    
    // Note: Due to React's lifecycle, on subsequent visits, filter states might 
    // retain the previous value. If you want the filter to ONLY apply on the first 
    // click and then be manually controllable, this initialization is correct.
    // To ensure the filter resets on EVERY /tasks page load, we use the key in App.jsx.

    // Modal States
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const user = getSafeUser();

    // Use useCallback to memoize the fetch function
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);
        if (!user.id) {
            setError("User not authenticated or ID is missing.");
            setLoading(false);
            return;
        }

        try {
            // Updated API call to fetch tasks associated with the user ID
            const res = await axios.get(`${backendUrl}/auth/tasks?id=${user.id}`);
            console.log(res.data);
            // The response data is expected to be the array of tasks
            setTasks(res.data);
        } catch(err) {
            console.error("Error fetching user tasks:", err);
            setError("Failed to fetch tasks. Please check the network or backend connection.");
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [backendUrl, user.id]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]); 

    // HANDLERS FOR TASK DETAIL MODAL
    const openDetailModal = (task) => {
        setSelectedTask(task);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = (shouldRefresh = false) => {
        setSelectedTask(null);
        setIsDetailModalOpen(false);
        if (shouldRefresh) {
            fetchTasks(); // Re-fetch tasks if the modal indicates a change (e.g., delete/update)
        }
    };

    // --- Filtering Logic ---
    const filteredTasks = useMemo(() => {
        let currentTasks = Array.isArray(tasks) ? tasks : [];

        // 1. Filter by Status
        if (filterStatus !== 'All') {
            currentTasks = currentTasks.filter(task => task.status === filterStatus);
        }

        // 2. Filter by Priority
        if (filterPriority !== 'All') {
            currentTasks = currentTasks.filter(task => task.priority === filterPriority);
        }

        // 3. Filter by Due Date
        if (filterDueDate) {
            const selectedDate = new Date(filterDueDate);
            currentTasks = currentTasks.filter(task => {
                const taskDueDate = new Date(task.dueDate);
                taskDueDate.setHours(0, 0, 0, 0); 
                selectedDate.setHours(0, 0, 0, 0);
                return taskDueDate <= selectedDate;
            });
        }
        
        return currentTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    }, [tasks, filterStatus, filterPriority, filterDueDate]);
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar currentUser={user} />
            
            <div className="pt-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">My Tasks</h2>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-medium mb-4">Filter Tasks</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                            >
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Priority</label>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                            >
                                {priorityOptions.map(priority => (
                                    <option key={priority} value={priority}>
                                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex flex-col">
                            <label className="text-sm font-medium mb-1">Due On/Before</label>
                            <input
                                type="date"
                                value={filterDueDate}
                                onChange={(e) => setFilterDueDate(e.target.value)}
                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                            />
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="text-center py-10">Loading tasks...</div>
                )}

                {error && (
                    <div className="text-center py-10 text-red-500">{error}</div>
                )}
                
                {!loading && !error && filteredTasks.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        {tasks.length === 0 ? "You have no tasks assigned to you yet." : "No tasks match the current filters. Try adjusting your selections."}
                    </div>
                )}

                {!loading && filteredTasks.length > 0 && (
                    <div className="space-y-4">
                        {filteredTasks.map(task => (
                            <div 
                                key={task._id} 
                                onClick={() => openDetailModal(task)}
                                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition duration-200 cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                                        {task.title}
                                    </h3>
                                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusClasses(task.status)}`}>
                                        {task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3 line-clamp-2">
                                    {task.description}
                                </p>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                                        </span>
                                        <span className={getPriorityClasses(task.priority)}>
                                            {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)} Priority
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {selectedTask && (
                <TaskDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={closeDetailModal}
                    task={selectedTask}
                    backendUrl={backendUrl}
                />
            )}
        </div>
    );
};

export default UserTasks;