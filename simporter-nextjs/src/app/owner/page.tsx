'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import your owner panel components
import LibraryPanel from '@/components/ownerPanel/LibraryPanel';
import AppAnalytics from '@/components/ownerPanel/AppAnalytics';
import NotificationOwner from '@/components/ownerPanel/NotificationOwner';
import EmailPanel from '@/components/ownerPanel/EmailPanel';
import UserAnalytics from '@/components/ownerPanel/UserAnalytics';

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState('library');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Modern Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Owner Panel</h1>
          <p className="mt-2 text-lg">Manage your The Library, Analytics, Notifications, Emails, and User Analytics</p>
        </div>
      </header>

      {/* Tabs Section */}
      <Tabs defaultValue="library" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex space-x-4 mb-4 border-b border-gray-200">
          <TabsTrigger value="library" className="px-4 py-2">The Library</TabsTrigger>
          <TabsTrigger value="analytics" className="px-4 py-2">Analytics</TabsTrigger>
          <TabsTrigger value="notifications" className="px-4 py-2">Notifications</TabsTrigger>
          <TabsTrigger value="emails" className="px-4 py-2">Emails</TabsTrigger>
          <TabsTrigger value="useranalytics" className="px-4 py-2">User Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <LibraryPanel />
        </TabsContent>

        <TabsContent value="analytics">
          <AppAnalytics />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationOwner />
        </TabsContent>

        <TabsContent value="emails">
          <EmailPanel />
        </TabsContent>

        <TabsContent value="useranalytics">
          <UserAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
