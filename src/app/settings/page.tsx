import React from "react";

const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Account Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Account Information</h2>
          <p className="text-gray-500 mb-4">Manage your account details.</p>
          <div>
            <label className="block mb-2 text-sm">Email:</label>
            <input
              type="email"
              className="w-full p-2 border rounded-lg"
              value="john.doe@example.com"
              readOnly
            />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Privacy Settings</h2>
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm">Public Profile:</label>
            <input type="checkbox" className="w-4 h-4" disabled />
            <span className="text-gray-500">(Available for paid users)</span>
          </div>
        </div>

        {/* Subscription Management */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold">Subscription</h2>
          <button className="px-4 py-2 bg-violet-600 text-white rounded-lg">
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
