"use client";

import type React from "react";
import {
  Users,
  Trophy,
  History,
  Settings,
  Bell,
  Home,
  LogOut,
  Link,
  Menu,
  Award,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudentSidebar: React.FC<StudentSidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  const { unreadCount } = useNotificationContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1); // Triggers re-animation on route change
  }, [location.pathname]);

  const menuItems = [
    { id: "", label: "Dashboard", icon: Home },
    { id: "join-poll", label: "Join Poll", icon: Link },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "history", label: "Poll History", icon: History },
    { id: "profile", label: "Profile", icon: User },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleItemClick = (itemId: string) => {
    navigate(itemId ? `/student/${itemId}` : "/student");
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const isActive = (itemId: string) => {
    if (itemId === "")
      return location.pathname === "/student" || location.pathname === "/student/";
    return location.pathname === `/student/${itemId}`;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const sidebarContent = (
    <div className="p-6 flex flex-col h-full relative">
      {/* Brand */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center space-x-3 mb-4 flex-shrink-0"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg tracking-wide">Student Portal</h1>
          <p className="text-gray-400 text-sm">Learning Hub</p>
        </div>
      </motion.div>

      {/* Switch to Host Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6 flex-shrink-0"
      >
        <button
          onClick={() => navigate("/host")}
          className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-all duration-200"
        >
          Switch to Host
        </button>
      </motion.div>

      {/* Fade Top */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-6 z-10 bg-gradient-to-b from-black/80 to-transparent" />

      {/* Scrollable Navigation */}
      <motion.nav
        key={animationKey}
        className="space-y-2 flex-1 overflow-y-auto pr-2 hide-scrollbar relative z-0"
        tabIndex={0}
      >
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
            >
              <button
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-primary-500/30 to-secondary-500/10 text-primary-400 border border-primary-500/30 shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="flex items-center space-x-3">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      active ? "animate-pulse" : ""
                    }`}
                  />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </span>
                {item.id === "notifications" && unreadCount > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-2" />
                )}
              </button>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 * menuItems.length }}
        >
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 font-medium tracking-wide mt-2"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </motion.div>
      </motion.nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:fixed md:left-0 md:top-0 md:h-full md:w-64 md:bg-black/20 md:backdrop-blur-xl md:border-r md:border-white/10 md:z-40 md:block"
      >
        {sidebarContent}
      </motion.div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-64 bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 md:hidden"
            >
              <button
                type="button"
                className="absolute top-4 right-4 z-50 text-gray-400 hover:text-white text-xl"
                onClick={onClose}
              >
                ✕
              </button>
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentSidebar;
