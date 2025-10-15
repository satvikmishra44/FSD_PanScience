// import React, { useState, useEffect, useMemo } from "react";
// import axios from 'axios';

// // Helper function to render task status for visual consistency
// const getStatusClasses = (status) => {
//     switch (status?.toLowerCase()) {
//         case 'completed':
//             return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
//         case 'in-progress':
//             return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
//         case 'todo':
//         default:
//             return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
//     }
// };

// const UserModal = ({ isOpen, onClose, userId, currentUserRole, backendUrl }) => {
//     const isEditMode = useMemo(() => !!userId, [userId]);
//     const isCurrentUserAdmin = useMemo(() => currentUserRole === 'admin', [currentUserRole]);
    
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         role: 'user', 
//     });
//     // Password is now handled separately in the form for Create mode only
//     const [password, setPassword] = useState('');

//     const [userTasks, setUserTasks] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [fetchError, setFetchError] = useState(null);
//     const [formError, setFormError] = useState(null);

//     // Effect to fetch user data if in edit mode
//     useEffect(() => {
//         if (!backendUrl) return;

//         if (isEditMode && isOpen) {
//             const fetchUserDetails = async () => {
//                 setIsLoading(true);
//                 setFetchError(null);
//                 try {
//                     // Use the passed backendUrl, updated endpoint for fetching details
//                     const response = await axios.get(`${backendUrl}/admin/users/${userId}`);
//                     const user = response.data;
                    
//                     const [firstName, ...lastNameParts] = user.name.split(' ');
//                     const lastName = lastNameParts.join(' ');
                    
//                     setFormData({
//                         firstName,
//                         lastName,
//                         email: user.email,
//                         role: user.role,
//                     });
//                     setUserTasks(user.tasks || []);
//                 } catch (err) {
//                     console.error('Failed to fetch user details:', err);
//                     setFetchError('Failed to load user details.');
//                 } finally {
//                     setIsLoading(false);
//                 }
//             };
//             fetchUserDetails();
//         } else if (!isEditMode && isOpen) {
//             // Reset form for create mode
//              setFormData({ firstName: '', lastName: '', email: '', role: 'user' });
//              setPassword('');
//              setUserTasks([]);
//              setFetchError(null);
//         }
//     }, [isEditMode, isOpen, userId, backendUrl]);

//     if (!isOpen) return null;

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({ ...prev, [name]: value }));
//     };
    
//     const handleSaveUser = async (e) => {
//         e.preventDefault();
//         setFormError(null);
//         setIsLoading(true);

//         if (isEditMode) {
//              // In this version, we prevent form submission in edit mode.
//              setFormError("Editing user details is not permitted via this button.");
//              setIsLoading(false);
//              return;
//         }

//         // --- Creation Logic ---
//         if (!password) {
//              setFormError('Password is required for new users.');
//              setIsLoading(false);
//              return;
//         }

//         const userName = `${formData.firstName} ${formData.lastName}`.trim();
//         const payload = {
//             name: userName,
//             email: formData.email,
//             role: formData.role,
//             password: password, // Use the separate password state
//         };

//         try {
//             // Updated endpoint for user creation: /auth/register
//             await axios.post(`${backendUrl}/auth/register`, payload);
//             onClose(); 
//         } catch (err) {
//             const errorMessage = err.response?.data?.message || 'An unexpected error occurred during creation.';
//             setFormError(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
//     const handlePromote = async () => {
//         if (!isCurrentUserAdmin || !userId) return;
//         setIsLoading(true);
//         setFetchError(null);
        
//         try {
//             // Use the passed backendUrl
//             await axios.put(`${backendUrl}/admin/users/${userId}`, { role: 'admin' }); // Backend expects lowercase
//             onClose(); 
//         } catch (err) {
//             const errorMessage = err.response?.data?.message || 'Failed to promote user.';
//             setFetchError(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleDelete = async () => {
//         if (!isCurrentUserAdmin || !userId || !window.confirm(`Are you sure you want to delete ${formData.firstName} ${formData.lastName}?`)) return;
        
//         setIsLoading(true);
//         setFetchError(null);

//         try {
//             // Use the passed backendUrl
//             await axios.delete(`${backendUrl}/admin/users/${userId}`);
//             onClose(); 
//         } catch (err) {
//             const errorMessage = err.response?.data?.message || 'Failed to delete user.';
//             setFetchError(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
//     const isUserAdmin = formData.role.toLowerCase() === 'admin';

//     return (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
//                 <form onSubmit={handleSaveUser}>
//                     <div className="flex justify-between items-center p-5 border-b border-gray-300 dark:border-gray-700">
//                         <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
//                             {isEditMode ? 'User Details' : 'Create User'}
//                         </h3>
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
//                             disabled={isLoading}
//                         >
//                             &times;
//                         </button>
//                     </div>

//                     {isLoading && <div className="text-center p-4">Loading...</div>}
//                     {fetchError && <div className="text-center p-4 text-red-500">{fetchError}</div>}
//                     {formError && <div className="text-center p-4 text-red-500">{formError}</div>}
                    
//                     <div className="p-5 space-y-4">
//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">First Name</label>
//                                 <input
//                                     type="text"
//                                     name="firstName"
//                                     value={formData.firstName}
//                                     onChange={handleChange}
//                                     className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
//                                     placeholder="John"
//                                     required
//                                     disabled={isEditMode} // Disabled in edit mode
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Last Name</label>
//                                 <input
//                                     type="text"
//                                     name="lastName"
//                                     value={formData.lastName}
//                                     onChange={handleChange}
//                                     className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
//                                     placeholder="Doe"
//                                     disabled={isEditMode} // Disabled in edit mode
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
//                                 placeholder="example@mail.com"
//                                 required
//                                 disabled={isEditMode} // Disabled in edit mode
//                             />
//                         </div>

//                         <div>
//                             <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Role</label>
//                             <select 
//                                 name="role"
//                                 value={formData.role}
//                                 onChange={handleChange}
//                                 className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
//                                 disabled={isEditMode} // Disabled in edit mode
//                             >
//                                 <option value="user">User</option>
//                                 <option value="admin">Admin</option>
//                             </select>
//                         </div>

//                         {/* Password input is ONLY shown in Create Mode */}
//                         {!isEditMode && (
//                             <div>
//                                 <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
//                                 <input
//                                     type="password"
//                                     name="password"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
//                                     required={!isEditMode}
//                                 />
//                                 <small className="text-gray-500 text-sm">
//                                     Required for new user
//                                 </small>
//                             </div>
//                         )}
                        
//                         {/* Assigned Tasks Section (Only in Edit/View Mode) */}
//                         {isEditMode && userTasks.length > 0 && (
//                             <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
//                                 <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
//                                     Last {userTasks.length} Assigned Tasks
//                                 </h4>
//                                 <div className="space-y-3">
//                                     {userTasks.map((task) => (
//                                         <div 
//                                             key={task._id} 
//                                             className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600"
//                                         >
//                                             <div className="flex justify-between items-start">
//                                                 <p className="font-medium text-sm text-indigo-600 dark:text-indigo-400 truncate">
//                                                     {task.title}
//                                                 </p>
//                                                 <span className={`px-2 py-0.5 text-xs rounded-full ml-2 flex-shrink-0 ${getStatusClasses(task.status)}`}>
//                                                     {task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
//                                                 </span>
//                                             </div>
//                                             <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
//                                                 {task.description}
//                                             </p>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                     </div>

//                     <div className="flex justify-between gap-3 p-5 border-t border-gray-300 dark:border-gray-700">
//                         <div className="flex gap-3">
//                             {/* Delete Button - Admin only, Edit Mode only */}
//                             {isEditMode && isCurrentUserAdmin && !isUserAdmin && (
//                                 <button
//                                     type="button"
//                                     onClick={handleDelete}
//                                     className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
//                                     disabled={isLoading}
//                                 >
//                                     Delete User
//                                 </button>
//                             )}

                            
//                             {/* Promote Button - Admin only, User role only, Edit Mode only */}
//                             {isEditMode && isCurrentUserAdmin && !isUserAdmin && (
//                                 <button
//                                     type="button"
//                                     onClick={handlePromote}
//                                     className="px-4 py-2 rounded-md bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50"
//                                     disabled={isLoading}
//                                 >
//                                     Promote to Admin
//                                 </button>
//                             )}
//                         </div>

//                         <div className="flex gap-3">
//                             <button
//                                 type="button"
//                                 onClick={onClose}
//                                 className="px-4 py-2 rounded-md border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
//                                 disabled={isLoading}
//                             >
//                                 Cancel
//                             </button>
                            
//                             {/* Create User Button - Only in Create Mode */}
//                             {!isEditMode && ( 
//                                 <button 
//                                     type="submit" 
//                                     className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
//                                     disabled={isLoading}
//                                 >
//                                     Create User
//                                 </button>
//                             )}
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UserModal;

import React, { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import TaskDetailModal from './TaskDetailModal'; // Assumed component path

// Helper function to render task status for visual consistency
const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
        case 'completed':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'in-progress':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'todo':
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const UserModal = ({ isOpen, onClose, userId, currentUserRole, backendUrl }) => {
    const isEditMode = useMemo(() => !!userId, [userId]);
    const isCurrentUserAdmin = useMemo(() => currentUserRole === 'admin', [currentUserRole]);
    
    // State for UserModal content
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'user', 
    });
    const [password, setPassword] = useState(''); // Separate state for password (Create mode only)
    const [userTasks, setUserTasks] = useState([]);
    
    // State for task modal interaction
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // General state
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [formError, setFormError] = useState(null);

    // Function to fetch user details (can be called after promotions/deletions)
    const fetchUserDetails = async (id) => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const response = await axios.get(`${backendUrl}/admin/users/${id}`);
            const user = response.data;
            
            const [firstName, ...lastNameParts] = user.name.split(' ');
            const lastName = lastNameParts.join(' ');
            
            setFormData({
                firstName,
                lastName,
                email: user.email,
                role: user.role,
            });
            setUserTasks(user.tasks || []);
        } catch (err) {
            console.error('Failed to fetch user details:', err);
            setFetchError('Failed to load user details.');
        } finally {
            setIsLoading(false);
        }
    };

    // Effect to fetch user data if in edit mode
    useEffect(() => {
        if (!backendUrl) return;

        if (isEditMode && isOpen && userId) {
            fetchUserDetails(userId);
        } else if (!isEditMode && isOpen) {
            // Reset form for create mode
             setFormData({ firstName: '', lastName: '', email: '', role: 'user' });
             setPassword('');
             setUserTasks([]);
             setFetchError(null);
        }
    }, [isEditMode, isOpen, userId, backendUrl]);

    if (!isOpen) return null;
    
    // --- Task Modal Handlers ---
    const openTaskModal = (task) => {
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const closeTaskModal = () => {
        setSelectedTask(null);
        setIsTaskModalOpen(false);
        // Re-fetch user details to refresh task list if changes were made in TaskDetailModal
        if (isEditMode && userId) {
            fetchUserDetails(userId);
        }
    };
    
    // --- User Modal Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSaveUser = async (e) => {
        e.preventDefault();
        setFormError(null);
        setIsLoading(true);

        if (isEditMode) {
             // Block form submission in view/edit mode as requested
             setFormError("Editing user details is not permitted via this button.");
             setIsLoading(false);
             return;
        }

        // --- Creation Logic ---
        if (!password) {
             setFormError('Password is required for new users.');
             setIsLoading(false);
             return;
        }

        const userName = `${formData.firstName} ${formData.lastName}`.trim();
        const payload = {
            name: userName,
            email: formData.email,
            role: formData.role,
            password: password,
        };

        try {
            // Updated endpoint for user creation: /auth/register
            await axios.post(`${backendUrl}/auth/register`, payload);
            onClose(); // Close UserModal and trigger UserList refresh
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred during creation.';
            setFormError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handlePromote = async () => {
        if (!isCurrentUserAdmin || !userId) return;
        setIsLoading(true);
        setFetchError(null);
        
        try {
            await axios.put(`${backendUrl}/admin/users/${userId}`, { role: 'admin' }); 
            onClose(); // Close UserModal and trigger UserList refresh
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to promote user.';
            setFetchError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!isCurrentUserAdmin || !userId || !window.confirm(`Are you sure you want to delete ${formData.firstName} ${formData.lastName}?`)) return;
        
        setIsLoading(true);
        setFetchError(null);

        try {
            await axios.delete(`${backendUrl}/admin/users/${userId}`);
            onClose(); // Close UserModal and trigger UserList refresh
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to delete user.';
            setFetchError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const isUserAdmin = formData.role.toLowerCase() === 'admin';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
                <form onSubmit={handleSaveUser}>
                    <div className="flex justify-between items-center p-5 border-b border-gray-300 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                            {isEditMode ? 'User Details' : 'Create User'}
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
                            disabled={isLoading}
                        >
                            &times;
                        </button>
                    </div>

                    {isLoading && <div className="text-center p-4">Loading...</div>}
                    {fetchError && <div className="text-center p-4 text-red-500">{fetchError}</div>}
                    {formError && <div className="text-center p-4 text-red-500">{formError}</div>}
                    
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                    placeholder="John"
                                    required
                                    disabled={isEditMode} // Disabled in edit mode
                                />
                            </div>
                            <div>
                                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                    placeholder="Doe"
                                    disabled={isEditMode} // Disabled in edit mode
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                placeholder="example@mail.com"
                                required
                                disabled={isEditMode} // Disabled in edit mode
                            />
                        </div>

                        <div>
                            <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Role</label>
                            <select 
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                disabled={isEditMode} // Disabled in edit mode
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        {/* Password input is ONLY shown in Create Mode */}
                        {!isEditMode && (
                            <div>
                                <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                                    required
                                />
                                <small className="text-gray-500 text-sm">
                                    Required for new user
                                </small>
                            </div>
                        )}
                        
                        {/* Assigned Tasks Section (Only in Edit/View Mode) */}
                        {isEditMode && userTasks.length > 0 && (
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-100">
                                    Last {userTasks.length} Assigned Tasks
                                </h4>
                                <div className="space-y-3">
                                    {userTasks.map((task) => (
                                        <div 
                                            key={task._id} 
                                            onClick={() => openTaskModal(task)} // Clicking redirects to TaskDetailModal
                                            className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150"
                                        >
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium text-sm text-indigo-600 dark:text-indigo-400 truncate">
                                                    {task.title}
                                                </p>
                                                <span className={`px-2 py-0.5 text-xs rounded-full ml-2 flex-shrink-0 ${getStatusClasses(task.status)}`}>
                                                    {task.status?.charAt(0).toUpperCase() + task.status?.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                                {task.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="flex justify-between gap-3 p-5 border-t border-gray-300 dark:border-gray-700">
                        <div className="flex gap-3">
                            {/* Delete Button - Admin only, Edit Mode only, CANNOT DELETE ADMINS */}
                            {isEditMode && isCurrentUserAdmin && !isUserAdmin && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    Delete User
                                </button>
                            )}
                            
                            {/* Promote Button - Admin only, User role only, Edit Mode only */}
                            {isEditMode && isCurrentUserAdmin && !isUserAdmin && (
                                <button
                                    type="button"
                                    onClick={handlePromote}
                                    className="px-4 py-2 rounded-md bg-yellow-600 text-white hover:bg-yellow-700 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    Promote to Admin
                                </button>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-md border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            
                            {/* Create User Button - Only in Create Mode */}
                            {!isEditMode && ( 
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    Create User
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Render the Task Detail Modal when a task is selected */}
            {isTaskModalOpen && (
                <TaskDetailModal 
                    isOpen={isTaskModalOpen}
                    onClose={closeTaskModal}
                    task={selectedTask}
                    backendUrl={backendUrl}
                />
            )}
        </div>
    );
};

export default UserModal;