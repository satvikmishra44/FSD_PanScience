import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; // Assuming Navbar is available
import TaskDetailModal from '../components/modals/TaskDetailModal'; // Imported and used

// Configuration for select inputs
const priorityOptions = ['All', 'low', 'medium', 'high'];
const statusOptions = ['All', 'pending', 'in-progress', 'completed'];

const AllTask = ({ backendUrl }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter States
    const [filterPriority, setFilterPriority] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDueDate, setFilterDueDate] = useState('');

    // === MODAL STATE ===
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    // ===================

    const getSafeUser = () => {
        const defaultUser = { name: "Guest" };
        const userString = localStorage.getItem("taskUser");

        if (!userString) {
            return defaultUser;
        }

        try {
            return JSON.parse(userString);
        } catch (e) {
            console.error("Local storage 'taskUser' is corrupted:", e);
            return defaultUser;
        }
    };

    const user = getSafeUser();

    const fetchTasks = async (req, res) => {
        try{
            const res = await axios.get(`${backendUrl}/admin/tasks`);
            console.log(res);
            setTasks(res.data);
        } catch(err){
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []); // fetchTasks is now stable via useCallback

    // === MODAL HANDLERS ===
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
    // =====================

    // --- Filtering Logic (No change needed) ---
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

        // 3. Filter by Due Date (only show tasks due on or before the selected date)
        if (filterDueDate) {
            const selectedDate = new Date(filterDueDate);
            // Convert to a comparable format, ignoring time component for consistency
            currentTasks = currentTasks.filter(task => {
                const taskDueDate = new Date(task.dueDate);
                // Set the time part to midnight for accurate day comparison
                taskDueDate.setHours(0, 0, 0, 0); 
                selectedDate.setHours(0, 0, 0, 0);
                return taskDueDate <= selectedDate;
            });
        }
        
        // Sort for better view (e.g., by Due Date ascending)
        return currentTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    }, [tasks, filterStatus, filterPriority, filterDueDate]);
    
    // --- Render Helpers (No change needed) ---
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

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar currentUser={user} />
            
            <div className="pt-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">All Tasks</h2>

                {/* --- Filters Section (Code omitted for brevity) --- */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-medium mb-4">Filter Tasks</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        {/* Status Filter */}
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

                        {/* Priority Filter */}
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
                        
                        {/* Due Date Filter */}
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


                {/* --- Task List --- */}
                {loading && (
                    <div className="text-center py-10">Loading tasks...</div>
                )}

                {error && (
                    <div className="text-center py-10 text-red-500">{error}</div>
                )}
                
                {!loading && !error && filteredTasks.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        {tasks.length === 0 ? "No tasks have been created yet." : "No tasks match the current filters. Try adjusting your selections."}
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
                                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3 line-clamp-2">
                                    {task.description}
                                </p>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                        <span className={getPriorityClasses(task.priority)}>
                                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                        </span>
                                    </div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        {/* You may need to fetch assigned user details separately if 'assignedTo' is just an ID */}
                                        Assigned: {task.assignedTo.name || 'N/A'} 
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
            
            {/* --- Task Detail Modal (NEW) --- */}
            {selectedTask && (
                <TaskDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={closeDetailModal} // Pass the handler
                    task={selectedTask}
                    backendUrl={backendUrl}
                    // You might need an onUpdate or onDelete prop here 
                    // to tell the modal what to do after an operation.
                />
            )}
            {/* --------------------------------- */}
        </div>
    );
};

export default AllTask;