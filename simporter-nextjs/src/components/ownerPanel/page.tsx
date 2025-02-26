'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import your owner panel components
import LibraryPanel from '@/components/ownerPanel/LibraryPanelt';
import AppAnalytics from '@/components/ownerPanel/AppAnalytics';
import NotificationOwner from '@/components/ownerPanel/NotificationOwner';
import EmailPanel from '@/components/ownerPanel/EmailPanel';
import UserAnalytics from '@/components/ownerPanel/UserAnalytics';

export default function OwnerPage() {
  const [activeTab, setActiveTab] = useState('library');

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Owner Panel</h1>
      <Tabs defaultValue="library" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex space-x-4 mb-4">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="useranalytics">User Analytics</TabsTrigger>
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
