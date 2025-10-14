import { useState } from "react";
import Navbar from "./Navbar";
import TaskModal from "../components/modals/TaskModal";

const Dashboard = ({ router, backendUrl }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("taskUser")) || { name: "Amit", role: "admin" };

  const openTaskModal = () => setIsTaskModalOpen(true);
  const closeTaskModal = () => setIsTaskModalOpen(false);

  const stats = [
    { id: "total-tasks", label: "Total Tasks", value: 0, bg: "bg-purple-100" },
    { id: "pending-tasks", label: "Pending", value: 0, bg: "bg-yellow-100" },
    { id: "progress-tasks", label: "In Progress", value: 0, bg: "bg-blue-100" },
    { id: "completed-tasks", label: "Completed", value: 0, bg: "bg-green-100" },
  ];

  const recentTasks = [
    { id: 1, title: "Design Homepage", meta: "Due: Today | Assigned to: John" },
    { id: 2, title: "Setup Backend", meta: "Due: Tomorrow | Assigned to: Alice" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar currentUser={user} />

      <div className="pt-24 px-6">
        <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
          {stats.map((s) => (
            <div key={s.id} className={`p-6 rounded-lg border border-gray-200 ${s.bg}`}>
              <h3 className="text-sm font-medium text-gray-500 mb-2">{s.label}</h3>
              <div className="text-4xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Actions & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="mb-4 text-lg font-medium">Quick Actions</h3>
            <div className="flex flex-col gap-4">
              <button
                onClick={openTaskModal}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Create New Task
              </button>
              <button
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                onClick={() => router.navigate("tasks")}
              >
                View All Tasks
              </button>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="col-span-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="mb-4 text-lg font-medium">Recent Tasks</h3>
            <div className="flex flex-col gap-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex-1">
                    <div className="font-medium mb-1">{task.title}</div>
                    <div className="text-xs text-gray-500">{task.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="mb-4 text-lg font-medium">Task Status Overview</h3>
          <div className="h-72 relative">
            <canvas id="taskChart" className="w-full h-full"></canvas>
          </div>
        </div>
      </div>

      {/* Modal */}
      <TaskModal isOpen={isTaskModalOpen} onClose={closeTaskModal} backendUrl={backendUrl} />
    </div>
  );
};

export default Dashboard;
