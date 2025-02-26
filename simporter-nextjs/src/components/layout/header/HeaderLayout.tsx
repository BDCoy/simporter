"use client"

import { useState, useRef, useEffect } from "react"
import ReferralModal from "@/components/layout/header/ReferralModal"
import { GamificationPanel } from "@/components/layout/header/Gamify/GamificationPanel"
import AllAchievementsModal from "@/components/layout/header/Gamify/AllAchievementsModal"
import NotificationsPanel from "@/components/layout/header/Notifications"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { AuthModal } from "@/components/auth/AuthModal"
import { useNotifications } from "@/context/NotificationContext"

export default function HeaderLayout() {
  const router = useRouter()
  const [showReferralModal, setShowReferralModal] = useState(false)
  const [showGamificationPanel, setShowGamificationPanel] = useState(false)
  const [showAllAchievements, setShowAllAchievements] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { pendingNotifications, pastNotifications, markAsRead, clearAll } = useNotifications();

  const profileDropdownRef = useRef<HTMLDivElement>(null)

  const { user, userData, signOut } = useAuth()
  console.log("User object:", user)
  console.log("User data:", userData)

  const progressPercentage = (userData.current_xp / userData.xp_for_next_level) * 100

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleProfileAction = async (action: "knowledge" | "billing" | "settings" | "logout") => {
    setShowProfileDropdown(false)
    switch (action) {
      case "knowledge":
        router.push("/knowledge")
        break
      case "billing":
        router.push("/billing")
        break
      case "settings":
        router.push("/settings")
        break
      case "logout":
        try {
          console.log("Logging out...")
          await signOut()
        } catch (error) {
          console.error("Error logging out:", error)
        }
        break
    }
  }

  return (
    <>
      <header className="flex items-center px-5 h-16 bg-white/90 backdrop-blur-sm border-b border-gray-100 justify-between">
        {/* Logo (40% larger - adjust h-14 as you wish) */}
        <div className="flex items-center">
          <img
            src="https://simporter.com/wp-content/uploads/2025/01/Simporter-Logo-Black-Text.svg"
            alt="Simporter Logo"
            className="h-14 w-auto cursor-pointer"
            onClick={() => router.push('/')}
          />
        </div>

        {!user ? (
          // Not logged in - show auth buttons
          <div className="flex items-center">
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign in
            </button>
          </div>
        ) : (
          // Logged in - show existing header content
          <div className="flex items-center space-x-4">
            {/* Button: Show Referral Modal */}
            <button
              onClick={() => setShowReferralModal(true)}
              className="hidden md:flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Get Free Tokens
            </button>

            {/* Level Progress */}
            <button
              onClick={() => {
                setShowGamificationPanel(!showGamificationPanel)
                setShowNotifications(false)
                setShowProfileDropdown(false)
              }}
              className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {userData.level}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-bold">🐕</span>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {userData.current_xp}/{userData.xp_for_next_level} XP
                </div>
              </div>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowGamificationPanel(false)
                setShowProfileDropdown(false)
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {/* Bell icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 
                  2.032 0 0118 14.158V11a6.002 
                  6.002 0 00-4-5.659V5a2 2 
                  0 10-4 0v.341C7.67 6.165 
                  6 8.388 6 11v3.159c0 
                  .538-.214 1.055-.595 
                  1.436L4 17h5m6 0v1a3 
                  3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {pendingNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => {
                  setShowProfileDropdown(!showProfileDropdown)
                  setShowNotifications(false)
                  setShowGamificationPanel(false)
                }}
                className="flex items-center hover:bg-gray-100 rounded-lg p-1 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                  {user?.email?.[0].toUpperCase() || "?"}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ml-1 text-gray-500 transition-transform duration-200 ${
                    showProfileDropdown ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 
                    7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 
                    1 0 111.414 1.414l-4 4a1 1 0 
                    01-1.414 0l-4-4a1 1 0 
                    010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  {/* Knowledge Base */}
                  <button
                    onClick={() => handleProfileAction("knowledge")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M9 4.804A7.968 
                      7.968 0 005.5 4c-1.255 
                      0-2.443.29-3.5.804v10A7.969 
                      7.969 0 015.5 14c1.669 
                      0 3.218.51 4.5 1.385A7.962 
                      7.962 0 0114.5 14c1.255 
                      0 2.443.29 3.5.804v-10A7.968 
                      7.968 0 0014.5 4c-1.255 
                      0-2.443.29-3.5.804V12a1 
                      1 0 11-2 0V4.804z"
                      />
                    </svg>
                    Knowledge Base
                  </button>
                  {/* Billing */}
                  <button
                    onClick={() => handleProfileAction("billing")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M4 
                      4a2 2 0 00-2 2v1h16V6a2 
                      2 0 00-2-2H4z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M18 
                        9H2v5a2 2 0 
                        002 2h12a2 2 0 
                        002-2V9zm-14 
                        4a1 1 0 011-1h1a1 
                        1 0 110 2H5a1 
                        1 0 01-1-1zm5-1a1 
                        1 0 100 2h1a1 
                        1 0 100-2H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Billing
                  </button>
                  {/* Settings */}
                  <button
                    onClick={() => handleProfileAction("settings")}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.49 
                        3.17c-.38-1.56-2.6-1.56-2.98 
                        0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 
                        2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 
                        2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 
                        1.372.734 2.942 2.106 2.106a1.532 1.532 0 
                        012.287.947c.379 1.561 2.6 1.561 2.978 
                        0a1.533 1.533 0 012.287-.947c1.372.836 
                        2.942-.734 2.106-2.106a1.533 1.533 0 
                        01.947-2.287c1.561-.379 
                        1.561-2.6 0-2.978a1.532 
                        1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 
                        1.532 0 01-2.287-.947zM10 
                        13a3 3 0 100-6 
                        3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Settings
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  {/* Logout */}
                  <button
                    onClick={() => handleProfileAction("logout")}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3 text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 
                        3a1 1 0 
                        00-1 1v12a1 1 0 
                        102 0V4a1 1 0 
                        00-1-1zm10.293 
                        9.293a1 1 
                        0 001.414 
                        1.414l3-3a1 
                        1 0 000-1.414l-3-3a1 1 
                        0 10-1.414 
                        1.414L14.586 
                        9H7a1 1 0 
                        100 2h7.586l-1.293 
                        1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modals and Panels */}
      {showReferralModal && <ReferralModal onClose={() => setShowReferralModal(false)} />}
      {showGamificationPanel && (
        <GamificationPanel
          onClose={() => setShowGamificationPanel(false)}
          onViewAllAchievements={() => {
            setShowGamificationPanel(false)
            setShowAllAchievements(true)
          }}
        />
      )}
      {showNotifications && <NotificationsPanel onClose={() => setShowNotifications(false)} />}
      {showAllAchievements && <AllAchievementsModal onClose={() => setShowAllAchievements(false)} />}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}

