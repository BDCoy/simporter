'use client';

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import {
  Calendar,
  Clock,
  Check,
  Edit,
  Trash,
  Plus,
  RefreshCw,
  AlertCircle,
  X,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Notification {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  scheduledFor: Date;
  status: 'scheduled' | 'sent' | 'draft';
  link?: string;
  // Additional stats for each notification:
  stats: {
    sent: number;
    opened: number;
    clicked: number;
  };
}

export default function NotificationOwner() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'New Feature Release',
      message:
        'We just launched our new data analysis feature. Check it out!',
      targetAudience: 'All Users',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'scheduled',
      link: 'https://example.com/new-feature',
      stats: { sent: 500, opened: 400, clicked: 200 },
    },
    {
      id: '2',
      title: 'Maintenance Notification',
      message:
        'Scheduled maintenance on March 1st from 2-4 AM EST.',
      targetAudience: 'All Users',
      scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: 'scheduled',
      stats: { sent: 300, opened: 250, clicked: 100 },
    },
  ]);

  const [isAddingNotification, setIsAddingNotification] = useState(false);
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    title: '',
    message: '',
    targetAudience: 'All Users',
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'draft',
    link: '',
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewNotification(prev => ({
      ...prev,
      scheduledFor: new Date(e.target.value),
    }));
  };

  const handleSubmit = () => {
    if (!newNotification.title || !newNotification.message) {
      return;
    }
    const notification: Notification = {
      id: crypto.randomUUID(),
      title: newNotification.title || '',
      message: newNotification.message || '',
      targetAudience: newNotification.targetAudience || 'All Users',
      scheduledFor: newNotification.scheduledFor || new Date(),
      status: 'scheduled',
      link: newNotification.link || undefined,
      stats: { sent: 0, opened: 0, clicked: 0 },
    };

    setNotifications(prev => [...prev, notification]);
    setIsAddingNotification(false);
    setNewNotification({
      title: '',
      message: '',
      targetAudience: 'All Users',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'draft',
      link: '',
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // A helper to calculate additional stats
  const calculateStats = (stats: Notification['stats']) => {
    const openRate = stats.sent > 0 ? Math.round((stats.opened / stats.sent) * 100) : 0;
    const clickRate = stats.opened > 0 ? Math.round((stats.clicked / stats.opened) * 100) : 0;
    // Dummy engagement: average of open and click rate
    const engagement = Math.round((openRate + clickRate) / 2);
    return { openRate, clickRate, engagement };
  };

  // Assume each conversion earns $50
  const conversionValue = 50;

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Push Notifications</h2>
        <Button
          onClick={() => setIsAddingNotification(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Notification
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notifications.map(notification => {
          const { openRate, clickRate, engagement } = calculateStats(notification.stats);
          // For demonstration, assume Earned equals a dummy value from engagement percentage multiplied by conversionValue
          const earned = notification.stats.clicked * conversionValue;
          // For growth, we assume previous month had 90% of current conversions (dummy calculation)
          const growth = notification.stats.clicked > 0 
            ? Math.round(((notification.stats.clicked - notification.stats.clicked * 0.9) / (notification.stats.clicked * 0.9)) * 100)
            : 0;
          return (
            <Card key={notification.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  {notification.link ? (
                    <a
                      href={notification.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      <CardTitle className="text-lg">{notification.title}</CardTitle>
                    </a>
                  ) : (
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                  )}
                  <Button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  Scheduled for: {notification.scheduledFor.toLocaleDateString()} at{' '}
                  {notification.scheduledFor.toLocaleTimeString()}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                <div className="flex justify-between items-center">
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {notification.targetAudience}
                  </div>
                  <div className="text-xs">
                    {notification.status === 'scheduled' ? (
                      <span className="text-amber-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Scheduled
                      </span>
                    ) : notification.status === 'sent' ? (
                      <span className="text-green-500 flex items-center">
                        <Check className="w-3 h-3 mr-1" /> Sent
                      </span>
                    ) : (
                      <span className="text-gray-500 flex items-center">
                        <Edit className="w-3 h-3 mr-1" /> Draft
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
                  <div>Sent: {notification.stats.sent}</div>
                  <div>Open Rate: {openRate}%</div>
                  <div>Click Rate: {clickRate}%</div>
                  <div>Engagement: {engagement}%</div>
                </div>
                {/* Earned Section on individual card */}
                <div className="mt-4 flex justify-between items-center text-sm text-gray-700">
                  <span className="font-medium">
                    $ Earned: ${earned.toLocaleString()}
                  </span>
                  {notification.stats.clicked > 0 && (
                    <span className="text-xs">
                      Growth: +{growth}%
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add New Notification Modal */}
      {isAddingNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New Notification</CardTitle>
            </CardHeader>
            <div className="px-4 pb-4">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={newNotification.title}
                    onChange={handleInputChange}
                    placeholder="Notification title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={newNotification.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Notification content"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <Select
                    name="targetAudience"
                    value={newNotification.targetAudience}
                    onValueChange={(value) =>
                      setNewNotification(prev => ({ ...prev, targetAudience: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Users">All Users</SelectItem>
                      <SelectItem value="Free Tier">Free Tier</SelectItem>
                      <SelectItem value="Pro Tier">Pro Tier</SelectItem>
                      <SelectItem value="Enterprise Tier">Enterprise Tier</SelectItem>
                      <SelectItem value="Active Users">Active Users (last 30 days)</SelectItem>
                      <SelectItem value="Inactive Users">Inactive Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
                    Link URL (Optional)
                  </label>
                  <Input
                    id="link"
                    name="link"
                    value={newNotification.link}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 mb-1">
                    Schedule Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    id="scheduledFor"
                    name="scheduledFor"
                    value={newNotification.scheduledFor?.toISOString().slice(0, 16)}
                    onChange={handleDateChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => {
                    setIsAddingNotification(false);
                    setNewNotification({
                      title: '',
                      message: '',
                      targetAudience: 'All Users',
                      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
                      status: 'draft',
                      link: '',
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Schedule Notification
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
