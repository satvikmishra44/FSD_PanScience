import { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import TaskModal from "../components/modals/TaskModal";
import axios from "axios";
import TaskDetailModal from "./modals/TaskDetailModal";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from "react-router";


const Dashboard = ({ router, backendUrl }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [userTasks, setUserTasks] = useState([]);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0,
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const user = JSON.parse(localStorage.getItem("taskUser")) || { id: null, name: "Guest", role: "user" }; 

  const navigate = useNavigate();

    const handleStatClick = (statusKey) => {
        if (statusKey) {
            navigate('/tasks', { 
                state: { 
                    initialStatus: statusKey 
                } 
            });
        }
    };

   const openTaskModal = () => setIsTaskModalOpen(true);
    const closeTaskModal = (shouldRefresh = false) => {
        setIsTaskModalOpen(false);
        if (shouldRefresh) {
            fetchUserData(); 
        }
    };
    
    const openDetailModal = (task) => {
        setSelectedTask(task);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = (shouldRefresh = false) => {
        setSelectedTask(null);
        setIsDetailModalOpen(false);
        if (shouldRefresh) {
            fetchUserData(); 
        }
    };

    const calculateTaskStats = useCallback((tasks) => {
        const stats = { total: tasks.length, pending: 0, 'in-progress': 0, completed: 0 };
        tasks.forEach(task => {
            if (stats[task.status] !== undefined) {
                stats[task.status]++;
            }
        });
        setTaskStats(stats);
    }, [setTaskStats]);

    const fetchUserData = useCallback(async () => {
        if (!user.id) {
            console.warn("User ID not found. Cannot fetch tasks.");
            return;
        } 
        try {
            const response = await axios.get(`${backendUrl}/auth/me`, { params : {id: user.id}});
            const tasks = response.data.tasks || []; 
            setUserTasks(tasks); 
            calculateTaskStats(tasks);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }, [backendUrl, user.id, calculateTaskStats]);
    
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]); 

  const stats = [
    { id: "total-tasks", label: "Total Tasks", value: taskStats.total, statusKey: null, bg: "bg-purple-100" }, // Use null/undefined for Total to mean no filter
    { id: "pending-tasks", label: "Pending", value: taskStats.pending, statusKey: "pending", bg: "bg-yellow-100" },
    { id: "progress-tasks", label: "In Progress", value: taskStats['in-progress'], statusKey: "in-progress", bg: "bg-blue-100" }, 
    { id: "completed-tasks", label: "Completed", value: taskStats.completed, statusKey: "completed", bg: "bg-green-100" },
  ];

  const recentTasks = userTasks
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
    .slice(0, 5)
    .map(task => ({
        _id: task._id,
      attachments:task.attachments, 
      description: task.description, 
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      title: task.title
    }));

    const chartData = [
    { name: 'Pending', value: taskStats.pending, color: '#fcd34d' },
    { name: 'In Progress', value: taskStats['in-progress'], color: '#60a5fa' },
    { name: 'Completed', value: taskStats.completed, color: '#34d399' },
  ].filter(item => item.value > 0); 

  const TaskPieChart = () => {
    if (chartData.length === 0 || taskStats.total === 0) {
      return (
        <div className="text-center py-20 text-gray-500">
          No tasks found to generate a chart.
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
        >

            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.9)', border: 'none', borderRadius: '4px', color: 'white' }}
            formatter={(value, name) => [`${value} tasks`, name]}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }} 
            iconType="circle" 
            layout="horizontal" 
            align="center" 
            verticalAlign="bottom" 
            className="text-xs"
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <Navbar currentUser={user} />

    <div className="pt-24 px-6">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
        {stats.map((s) => (
          <div 
            key={s.id} 
            className={`p-6 rounded-lg border border-gray-200 ${s.bg} cursor-pointer hover:shadow-lg transition duration-150`}
            onClick={() => handleStatClick(s.statusKey)} 
          >
            <h3 className="text-sm font-medium text-gray-500 mb-2">{s.label}</h3>
            <div className="text-4xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="mb-4 text-lg font-medium">Quick Actions</h3>
          <div className="flex flex-col gap-4">
            {user.role === "admin" && (
              <button
                onClick={openTaskModal}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Create New Task
              </button>
            )}

            <button
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              onClick={() => navigate("/tasks")}
            >
              View All Tasks
            </button>
          </div>
        </div>

        <div className="col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="mb-4 text-lg font-medium">Recent Tasks</h3>
          <div className="flex flex-col gap-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => openDetailModal(task)}
                  className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex-1">
                    <div className="font-medium mb-1">{task.title}</div>
                    <div className="text-xs text-gray-500"></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No recent tasks found.</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="mb-4 text-lg font-medium">Task Status Overview</h3>
        <div className="h-72 relative">
          <TaskPieChart />
        </div>
        
      </div>
    </div>

    <TaskModal isOpen={isTaskModalOpen} onClose={closeTaskModal} backendUrl={backendUrl} />
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

export default Dashboard;