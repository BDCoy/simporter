'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash,
  Mail,
  Calendar,
  Clock,
  RefreshCw,
  Check,
  Edit
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Types for email campaigns
interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  targetAudience: string;
  scheduledFor: Date;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  stats: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
  variants?: {
    a: { subject: string; content: string };
    b: { subject: string; content: string };
  };
  isABTest: boolean;
}

export default function EmailPanel() {
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([
    {
      id: '1',
      name: 'Welcome Series',
      subject: 'Welcome to our platform!',
      content:
        'Thank you for joining our platform. Here are some tips to get started...',
      targetAudience: 'New Users',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'active',
      stats: {
        sent: 340,
        opened: 280,
        clicked: 150,
        converted: 42
      },
      isABTest: false
    },
    {
      id: '2',
      name: 'Feature Announcement',
      subject: 'New Feature Release',
      content: "We're excited to announce our new feature that helps you...",
      targetAudience: 'All Users',
      scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'scheduled',
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0
      },
      isABTest: true,
      variants: {
        a: {
          subject: 'New Feature Release',
          content: "We're excited to announce our new feature that helps you..."
        },
        b: {
          subject: 'Try Our New Feature Today!',
          content: 'Our newest feature is now available for you to try...'
        }
      }
    }
  ]);

  const [isAddingCampaign, setIsAddingCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<EmailCampaign>>({
    name: '',
    subject: '',
    content: '',
    targetAudience: 'All Users',
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'draft',
    isABTest: false,
    stats: {
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0
    }
  });
  const [isABTest, setIsABTest] = useState(false);
  const [variantA, setVariantA] = useState({ subject: '', content: '' });
  const [variantB, setVariantB] = useState({ subject: '', content: '' });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewCampaign((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCampaign((prev) => ({
      ...prev,
      scheduledFor: new Date(e.target.value)
    }));
  };

  const handleVariantChange = (
    variant: 'a' | 'b',
    field: 'subject' | 'content',
    value: string
  ) => {
    if (variant === 'a') {
      setVariantA((prev) => ({ ...prev, [field]: value }));
    } else {
      setVariantB((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    // Basic validation
    if (
      !newCampaign.name ||
      (!isABTest && (!newCampaign.subject || !newCampaign.content)) ||
      (isABTest &&
        (!variantA.subject || !variantA.content || !variantB.subject || !variantB.content))
    ) {
      return;
    }

    const campaign: EmailCampaign = {
      id: crypto.randomUUID(),
      name: newCampaign.name || '',
      subject: isABTest ? '' : newCampaign.subject || '',
      content: isABTest ? '' : newCampaign.content || '',
      targetAudience: newCampaign.targetAudience || 'All Users',
      scheduledFor: newCampaign.scheduledFor || new Date(),
      status: 'scheduled',
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0
      },
      isABTest
    };

    if (isABTest) {
      campaign.variants = {
        a: { subject: variantA.subject, content: variantA.content },
        b: { subject: variantB.subject, content: variantB.content }
      };
    }

    setEmailCampaigns((prev) => [...prev, campaign]);
    setIsAddingCampaign(false);
    resetForm();
  };

  const resetForm = () => {
    setNewCampaign({
      name: '',
      subject: '',
      content: '',
      targetAudience: 'All Users',
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'draft',
      isABTest: false,
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        converted: 0
      }
    });
    setIsABTest(false);
    setVariantA({ subject: '', content: '' });
    setVariantB({ subject: '', content: '' });
  };

  const deleteCampaign = (id: string) => {
    setEmailCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Email Campaigns</h2>
        <Button onClick={() => setIsAddingCampaign(true)} variant="default">
          <Plus className="w-4 h-4 mr-2" /> Create New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {emailCampaigns.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden">
            <CardHeader className="pb-2 bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <Mail className="w-3 h-3 mr-1" />
                    {campaign.isABTest ? 'A/B Test Campaign' : 'Standard Campaign'}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteCampaign(campaign.id)}>
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="py-4">
              {/* If not A/B test, show single subject/content */}
              {!campaign.isABTest ? (
                <div>
                  <h4 className="text-sm font-medium mb-1">Subject: {campaign.subject}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{campaign.content}</p>
                </div>
              ) : (
                // A/B test variants
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium">Variant A</h4>
                    <p className="text-xs text-gray-600">
                      Subject: {campaign.variants?.a.subject}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {campaign.variants?.a.content}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Variant B</h4>
                    <p className="text-xs text-gray-600">
                      Subject: {campaign.variants?.b.subject}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {campaign.variants?.b.content}
                    </p>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-gray-100 p-2 rounded">
                  <div className="font-medium">Sent</div>
                  <div className="text-gray-700">{campaign.stats.sent}</div>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <div className="font-medium">Opened</div>
                  <div className="text-gray-700">{campaign.stats.opened}</div>
                  {campaign.stats.sent > 0 && (
                    <div className="text-gray-500 text-xs">
                      {Math.round((campaign.stats.opened / campaign.stats.sent) * 100)}%
                    </div>
                  )}
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <div className="font-medium">Clicked</div>
                  <div className="text-gray-700">{campaign.stats.clicked}</div>
                  {campaign.stats.opened > 0 && (
                    <div className="text-gray-500 text-xs">
                      {Math.round((campaign.stats.clicked / campaign.stats.opened) * 100)}%
                    </div>
                  )}
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <div className="font-medium">Converted</div>
                  <div className="text-gray-700">{campaign.stats.converted}</div>
                  {campaign.stats.clicked > 0 && (
                    <div className="text-gray-500 text-xs">
                      {Math.round((campaign.stats.converted / campaign.stats.clicked) * 100)}%
                    </div>
                  )}
                </div>
              </div>

              {/* Scheduling & Status */}
              <div className="mt-4 flex justify-between items-center text-xs">
                <div className="text-gray-500">
                  Target: <span className="font-medium">{campaign.targetAudience}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {campaign.scheduledFor.toLocaleDateString()}
                </div>
                <div>
                  {campaign.status === 'scheduled' ? (
                    <span className="text-amber-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> Scheduled
                    </span>
                  ) : campaign.status === 'active' ? (
                    <span className="text-green-500 flex items-center">
                      <RefreshCw className="w-3 h-3 mr-1" /> Active
                    </span>
                  ) : campaign.status === 'completed' ? (
                    <span className="text-blue-500 flex items-center">
                      <Check className="w-3 h-3 mr-1" /> Completed
                    </span>
                  ) : (
                    <span className="text-gray-500 flex items-center">
                      <Edit className="w-3 h-3 mr-1" /> Draft
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal for creating new campaign */}
      {isAddingCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Email Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Campaign Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Campaign Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={newCampaign.name}
                    onChange={handleInputChange}
                    placeholder="Enter campaign name"
                    required
                  />
                </div>

                {/* Target Audience */}
                <div>
                  <label
                    htmlFor="targetAudience"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Target Audience
                  </label>
                  <Select
                    name="targetAudience"
                    value={newCampaign.targetAudience}
                    onValueChange={(value) =>
                      setNewCampaign((prev) => ({ ...prev, targetAudience: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Users">All Users</SelectItem>
                      <SelectItem value="New Users">New Users (last 7 days)</SelectItem>
                      <SelectItem value="Free Tier">Free Tier</SelectItem>
                      <SelectItem value="Pro Tier">Pro Tier</SelectItem>
                      <SelectItem value="Enterprise Tier">Enterprise Tier</SelectItem>
                      <SelectItem value="Active Users">Active Users (last 30 days)</SelectItem>
                      <SelectItem value="Inactive Users">Inactive Users (90+ days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Schedule */}
                <div>
                  <label
                    htmlFor="scheduledFor"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Schedule Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    id="scheduledFor"
                    name="scheduledFor"
                    value={newCampaign.scheduledFor?.toISOString().slice(0, 16)}
                    onChange={handleDateChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                {/* A/B Test Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isABTest"
                    checked={isABTest}
                    onChange={(e) => setIsABTest(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isABTest" className="text-sm font-medium text-gray-700">
                    Create A/B Test Campaign
                  </label>
                </div>

                {/* Standard Campaign Fields */}
                {!isABTest ? (
                  <>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={newCampaign.subject}
                        onChange={handleInputChange}
                        placeholder="Enter email subject"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="content"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email Content *
                      </label>
                      <Textarea
                        id="content"
                        name="content"
                        value={newCampaign.content}
                        onChange={handleInputChange}
                        rows={8}
                        placeholder="Enter email content"
                        required
                      />
                    </div>
                  </>
                ) : (
                  // A/B Test Fields
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Variant A</h3>
                      <div>
                        <label
                          htmlFor="variantASubject"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Subject *
                        </label>
                        <Input
                          id="variantASubject"
                          value={variantA.subject}
                          onChange={(e) => handleVariantChange('a', 'subject', e.target.value)}
                          placeholder="Variant A subject"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="variantAContent"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Content *
                        </label>
                        <Textarea
                          id="variantAContent"
                          value={variantA.content}
                          onChange={(e) => handleVariantChange('a', 'content', e.target.value)}
                          rows={6}
                          placeholder="Variant A content"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Variant B</h3>
                      <div>
                        <label
                          htmlFor="variantBSubject"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Subject *
                        </label>
                        <Input
                          id="variantBSubject"
                          value={variantB.subject}
                          onChange={(e) => handleVariantChange('b', 'subject', e.target.value)}
                          placeholder="Variant B subject"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="variantBContent"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Content *
                        </label>
                        <Textarea
                          id="variantBContent"
                          value={variantB.content}
                          onChange={(e) => handleVariantChange('b', 'content', e.target.value)}
                          rows={6}
                          placeholder="Variant B content"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingCampaign(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Schedule Campaign</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
