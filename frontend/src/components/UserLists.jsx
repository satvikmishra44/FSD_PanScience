import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import UserModal from './modals/UserModal';
import Navbar from './Navbar';

const UserList = ({ backendUrl }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const user = JSON.parse(localStorage.getItem("taskUser")) || { id: null, name: "Guest", role: "user" }; 

    const fetchUsers = useCallback(async () => {
        if (!backendUrl) return; 
        
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${backendUrl}/admin/users`); 
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to load users. Please ensure the backend server is running and the URL is correct.');
        } finally {
            setIsLoading(false);
        }
    }, [backendUrl]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // --- Memoized and Filtered User List ---
    const filteredUsers = useMemo(() => {
        let currentUsers = users;

        // 1. Role Filtering
        if (roleFilter !== 'all') {
            currentUsers = currentUsers.filter(user => 
                user.role?.toLowerCase() === roleFilter
            );
        }

        // 2. Search Filtering (by name or email)
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            currentUsers = currentUsers.filter(user => 
                user.name.toLowerCase().includes(lowerCaseSearch) ||
                user.email.toLowerCase().includes(lowerCaseSearch)
            );
        }

        return currentUsers;
    }, [users, roleFilter, searchTerm]);
   
    const openCreateModal = () => {
        setSelectedUserId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (userId) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUserId(null);
        fetchUsers(); 
    };

    if (isLoading) {
        return <div className="text-center p-8 text-gray-500">Loading users...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 dark:bg-gray-900 min-h-screen">
            <Navbar currentUser={user} />
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">User Management</h2>
            
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white transition duration-150"
                />

                <div className="flex space-x-4 w-full sm:w-auto">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white transition duration-150"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition duration-150 flex-shrink-0"
                        >
                            + New User
                        </button>
              
                </div>
            </div>
            
            <div className="space-y-4">
                {filteredUsers.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">No users match your criteria.</p>
                ) : (
                    filteredUsers.map((user) => (
                        <div 
                            key={user._id} 
                            onClick={() => openEditModal(user._id)}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition duration-200 cursor-pointer flex justify-between items-center"
                        >

                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {user.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.email}
                                </p>
                            </div>
                            
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                user.role?.toLowerCase() === 'admin' 
                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            }`}>
                                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                            </span>
                        </div>
                    ))
                )}
            </div>

            <UserModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                userId={selectedUserId} 
                currentUserRole={user.role} 
                backendUrl={backendUrl}
            />
        </div>
    );
};

export default UserList;