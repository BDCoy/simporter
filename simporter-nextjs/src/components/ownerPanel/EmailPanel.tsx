'use client';

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import {
  Plus,
  Trash,
  Mail,
  Calendar,
  Clock,
  RefreshCw,
  Check,
  Edit,
  Search,
  Copy,
  AlertCircle,
  X,
  BarChart3,
  Send,
  DollarSign,
} from 'lucide-react';
import ReactQuill from 'react-quill'; // Install using: npm install react-quill --legacy-peer-deps
import 'react-quill/dist/quill.snow.css';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- Types for email campaigns ---
// targetAudience is now an array for multi-select.
interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  targetAudience: string[];
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
  createdAt: Date;
}

const audienceOptions = [
  'All Users',
  'New Users',
  'Free Tier',
  'Pro Tier',
  'Enterprise Tier',
  'Active Users',
  'Inactive Users',
];

export default function EmailPanel() {
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([
    {
      id: '1',
      name: 'Welcome Series',
      subject: 'Welcome to our platform!',
      content:
        'Thank you for joining our platform. Here are some tips to get started...',
      targetAudience: ['New Users'],
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'active',
      stats: { sent: 340, opened: 280, clicked: 150, converted: 42 },
      isABTest: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      name: 'Feature Announcement',
      subject: 'New Feature Release',
      content: "We're excited to announce our new feature that helps you...",
      targetAudience: ['All Users'],
      scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'scheduled',
      stats: { sent: 0, opened: 0, clicked: 0, converted: 0 },
      isABTest: true,
      variants: {
        a: {
          subject: 'New Feature Release',
          content: "We're excited to announce our new feature that helps you...",
        },
        b: {
          subject: 'Try Our New Feature Today!',
          content: 'Our newest feature is now available for you to try...',
        },
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: '3',
      name: 'Monthly Newsletter',
      subject: 'Your Monthly Update',
      content: 'Check out what happened this month and upcoming features...',
      targetAudience: ['Active Users'],
      scheduledFor: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'completed',
      stats: { sent: 1240, opened: 856, clicked: 423, converted: 78 },
      isABTest: false,
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [isAddingCampaign, setIsAddingCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<EmailCampaign>>({
    name: '',
    subject: '',
    content: '',
    targetAudience: ['All Users'],
    scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'draft',
    isABTest: false,
    stats: { sent: 0, opened: 0, clicked: 0, converted: 0 },
  });
  const [isABTest, setIsABTest] = useState(false);
  const [variantA, setVariantA] = useState({ subject: '', content: '' });
  const [variantB, setVariantB] = useState({ subject: '', content: '' });
  const [useHtmlEditor, setUseHtmlEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // --- Modal Close ---
  const closeModal = useCallback(() => {
    setIsAddingCampaign(false);
    resetForm();
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [closeModal]);

  const resetForm = () => {
    setNewCampaign({
      name: '',
      subject: '',
      content: '',
      targetAudience: ['All Users'],
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'draft',
      isABTest: false,
      stats: { sent: 0, opened: 0, clicked: 0, converted: 0 },
    });
    setIsABTest(false);
    setVariantA({ subject: '', content: '' });
    setVariantB({ subject: '', content: '' });
    setEditorContent('');
    setUseHtmlEditor(false);
  };

  const testCampaign = () => {
    alert('Test email sent to owner@example.com');
  };

  const handleTargetAudienceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setNewCampaign(prev => ({ ...prev, targetAudience: selectedOptions }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCampaign(prev => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCampaign(prev => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setNewCampaign(prev => ({ ...prev, content }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewCampaign(prev => ({
      ...prev,
      scheduledFor: new Date(e.target.value),
    }));
  };

  const handleSubmit = () => {
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
      targetAudience: newCampaign.targetAudience || [],
      scheduledFor: newCampaign.scheduledFor || new Date(),
      status: 'scheduled',
      stats: { sent: 0, opened: 0, clicked: 0, converted: 0 },
      isABTest,
      createdAt: new Date(),
    };

    if (isABTest) {
      campaign.variants = {
        a: { subject: variantA.subject, content: variantA.content },
        b: { subject: variantB.subject, content: variantB.content },
      };
    }

    setEmailCampaigns(prev => [...prev, campaign]);
    setIsAddingCampaign(false);
    resetForm();
  };

  const duplicateCampaign = (campaign: EmailCampaign) => {
    const newCamp = {
      ...campaign,
      id: crypto.randomUUID(),
      name: `${campaign.name} (Copy)`,
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'draft' as const,
      stats: { sent: 0, opened: 0, clicked: 0, converted: 0 },
      createdAt: new Date(),
    };
    setEmailCampaigns(prev => [...prev, newCamp]);
  };

  const deleteCampaign = (id: string) => {
    setEmailCampaigns(prev => prev.filter(c => c.id !== id));
    setConfirmDelete(null);
  };

  const getFilteredCampaigns = () => {
    let filtered = emailCampaigns;
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter) {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }
    if (activeTab !== 'all') {
      if (activeTab === 'ab-test') {
        filtered = filtered.filter(campaign => campaign.isABTest);
      } else {
        filtered = filtered.filter(campaign => campaign.status === activeTab);
      }
    }
    return filtered;
  };

  const filteredCampaigns = getFilteredCampaigns();

  const campaignStats = {
    total: emailCampaigns.length,
    totalSent: emailCampaigns.reduce((sum, campaign) => sum + campaign.stats.sent, 0),
    totalOpened: emailCampaigns.reduce((sum, campaign) => sum + campaign.stats.opened, 0),
    totalClicked: emailCampaigns.reduce((sum, campaign) => sum + campaign.stats.clicked, 0),
    totalConverted: emailCampaigns.reduce((sum, campaign) => sum + campaign.stats.converted, 0),
  };

  const conversionValue = 50;
  const totalEarned = campaignStats.totalConverted * conversionValue;
  const previousMonthConverted = campaignStats.totalConverted * 0.9;
  const monthlyGrowth =
    previousMonthConverted > 0
      ? Math.round(((campaignStats.totalConverted - previousMonthConverted) / previousMonthConverted) * 100)
      : 0;

  return (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Email Campaigns</h2>
              <p className="text-sm text-gray-500">
                Create, schedule, and track your email campaigns
              </p>    
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsAddingCampaign(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
          >
            <Plus className="w-4 h-4" /> Create Campaign
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sent</p>
                <h3 className="text-2xl font-bold mt-1">{campaignStats.totalSent.toLocaleString()}</h3>
              </div>
              <Send className="h-8 w-8 text-blue-600 bg-blue-50 p-1.5 rounded-lg" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Opened</p>
                <h3 className="text-2xl font-bold mt-1">{campaignStats.totalOpened.toLocaleString()}</h3>
              </div>
              <Mail className="h-8 w-8 text-green-600 bg-green-50 p-1.5 rounded-lg" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Clicked</p>
                <h3 className="text-2xl font-bold mt-1">{campaignStats.totalClicked.toLocaleString()}</h3>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600 bg-purple-50 p-1.5 rounded-lg" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">Converted</p>
                <h3 className="text-2xl font-bold mt-1">{campaignStats.totalConverted.toLocaleString()}</h3>
              </div>
              <Check className="h-8 w-8 text-orange-600 bg-orange-50 p-1.5 rounded-lg" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-500">$ Earned</p>
                <h3 className="text-2xl font-bold mt-1">${totalEarned.toLocaleString()}</h3>
                <p className="text-xs text-gray-500">
                  {monthlyGrowth >= 0 ? '+' : '-'}{monthlyGrowth}%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600 bg-blue-50 p-1.5 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid grid-cols-5 md:w-auto w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="ab-test">A/B Tests</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search campaigns..."
              className="pl-9 w-full md:w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <select
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
            className="border border-gray-300 rounded p-1"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Campaign Cards */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <Card key={campaign.id} className="relative overflow-hidden border transition-all">
              <CardHeader className="pb-3 bg-white border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <div className="text-xs text-gray-500 flex items-center mt-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {campaign.isABTest ? 'A/B Test Campaign' : 'Standard Campaign'}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                      <Button onClick={() => { /* Edit logic */ }} className="h-8 w-8 p-0 bg-blue-600 text-white rounded">
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button onClick={() => duplicateCampaign(campaign)} className="h-8 w-8 p-0 bg-blue-600 text-white rounded">
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => setConfirmDelete(campaign.id)} className="h-8 w-8 p-0 bg-blue-600 text-white rounded">
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3">
                  {campaign.status === 'scheduled' ? (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
                      <Clock className="w-3 h-3 mr-1" /> Scheduled
                    </div>
                  ) : campaign.status === 'active' ? (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                      <RefreshCw className="w-3 h-3 mr-1" /> Active
                    </div>
                  ) : campaign.status === 'completed' ? (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                      <Check className="w-3 h-3 mr-1" /> Completed
                    </div>
                  ) : (
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                      <Edit className="w-3 h-3 mr-1" /> Draft
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-4">
                {!campaign.isABTest ? (
                  <div>
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-500">Subject:</span>
                      <p className="text-sm font-medium">{campaign.subject}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500">Content:</span>
                      <p className="text-sm text-gray-700 mt-1 line-clamp-2">{campaign.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-md p-2">
                      <div className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                          A
                        </div>
                        <h4 className="text-xs font-medium ml-2">Variant A</h4>
                      </div>
                      <p className="text-xs font-medium mt-1">
                        Subject: {campaign.variants?.a.subject}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                        {campaign.variants?.a.content}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-md p-2">
                      <div className="flex items-center">
                        <div className="h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                          B
                        </div>
                        <h4 className="text-xs font-medium ml-2">Variant B</h4>
                      </div>
                      <p className="text-xs font-medium mt-1">
                        Subject: {campaign.variants?.b.subject}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                        {campaign.variants?.b.content}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">Sent</div>
                    <div className="text-gray-700">{campaign.stats.sent.toLocaleString()}</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">Opened</div>
                    <div className="text-gray-700">{campaign.stats.opened.toLocaleString()}</div>
                    {campaign.stats.sent > 0 && (
                      <div className="text-gray-500 text-xs">
                        {Math.round((campaign.stats.opened / campaign.stats.sent) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">Clicked</div>
                    <div className="text-gray-700">{campaign.stats.clicked.toLocaleString()}</div>
                    {campaign.stats.opened > 0 && (
                      <div className="text-gray-500 text-xs">
                        {Math.round((campaign.stats.clicked / campaign.stats.opened) * 100)}%
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="font-medium">Converted</div>
                    <div className="text-gray-700">{campaign.stats.converted.toLocaleString()}</div>
                    {campaign.stats.clicked > 0 && (
                      <div className="text-gray-500 text-xs">
                        {Math.round((campaign.stats.converted / campaign.stats.clicked) * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <div className="border-t bg-gray-50 py-3 px-4 text-xs">
                <div className="flex justify-between items-center w-full">
                  <div className="text-gray-500">
                    Target: <span className="font-medium">{campaign.targetAudience.join(', ')}</span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    {campaign.scheduledFor.toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              {confirmDelete === campaign.id && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center p-4">
                  <div className="bg-white rounded-md shadow-md p-4 max-w-xs w-full border">
                    <div className="flex flex-col items-center text-center">
                      <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                      <h3 className="font-medium">Delete Campaign?</h3>
                      <p className="text-sm text-gray-500 mt-1 mb-4">
                        This action cannot be undone.
                      </p>
                      <div className="flex space-x-3 w-full">
                        <Button onClick={() => setConfirmDelete(null)} className="flex-1 bg-blue-600 text-white rounded">
                          Cancel
                        </Button>
                        <Button onClick={() => deleteCampaign(campaign.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-white">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Mail className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-1">No campaigns found</h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm || statusFilter ? 'Try adjusting your filters' : 'Create your first email campaign to get started'}
            </p>
            <Button onClick={() => setIsAddingCampaign(true)} className="bg-blue-600 text-white rounded px-4 py-2">
              <Plus className="w-4 h-4 mr-2" /> Create Campaign
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal for creating new campaign */}
      {isAddingCampaign && (
        <div 
          id="modal-backdrop"
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-auto"
          onClick={(e) => {
            if ((e.target as HTMLElement).id === 'modal-backdrop') closeModal();
          }}
        >
          <Card 
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <CardTitle>Create New Email Campaign</CardTitle>
              <button onClick={closeModal} className="p-2 text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardContent className="py-6">
              <div className="space-y-5">
                {/* Campaign Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={newCampaign.name}
                    onChange={handleInputChange}
                    placeholder="Enter campaign name"
                    required
                    className="border-gray-300"
                  />
                </div>

                {/* Target Audience Multi-Select */}
                <div>
                  <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    multiple
                    value={newCampaign.targetAudience as string[]}
                    onChange={handleTargetAudienceChange}
                    className="border border-gray-300 rounded p-2 w-full"
                  >
                    {audienceOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Rich Text Editor Toggle */}
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded border">
                  <span className="text-sm font-medium text-gray-700">Email Content</span>
                  <button
                    onClick={() => setUseHtmlEditor(prev => !prev)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {useHtmlEditor ? 'WYSIWYG Editor' : 'HTML Editor'}
                  </button>
                </div>
                {useHtmlEditor ? (
                  <Textarea
                    id="content"
                    name="content"
                    value={newCampaign.content}
                    onChange={handleTextareaChange}
                    rows={6}
                    placeholder="Enter email content in HTML"
                    required
                    className="border-gray-300"
                  />
                ) : (
                  <ReactQuill
                    theme="snow"
                    value={editorContent}
                    onChange={handleEditorChange}
                  />
                )}

                {/* A/B Test Toggle */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="isABTest" className="font-medium">A/B Test Campaign</label>
                      <p className="text-sm text-gray-500 mt-1">
                        Create two variants to test which performs better
                      </p>
                    </div>
                    <div className="relative inline-flex items-center">
                      <input
                        type="checkbox"
                        id="isABTest"
                        checked={isABTest}
                        onChange={(e) => setIsABTest(e.target.checked)}
                        className="sr-only"
                      />
                      <div 
                        className={`h-6 w-11 rounded-full transition-colors ${isABTest ? 'bg-blue-600' : 'bg-gray-200'}`}
                        onClick={() => setIsABTest(!isABTest)}
                      >
                        <span 
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${isABTest ? 'translate-x-5' : 'translate-x-1'} mt-0.5`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* A/B Test Variants */}
                {isABTest && (
                  <div className="space-y-4">
                    <div className="border p-4 rounded">
                      <h4 className="text-sm font-medium mb-2">Variant A</h4>
                      <div className="mb-2">
                        <label htmlFor="variantASubject" className="block text-xs font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <Input
                          id="variantASubject"
                          name="variantASubject"
                          value={variantA.subject}
                          onChange={(e) => setVariantA(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Enter subject for variant A"
                          className="border-gray-300"
                        />
                      </div>
                      <div>
                        <label htmlFor="variantAContent" className="block text-xs font-medium text-gray-700 mb-1">
                          Content
                        </label>
                        <Textarea
                          id="variantAContent"
                          name="variantAContent"
                          value={variantA.content}
                          onChange={(e) => setVariantA(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Enter content for variant A"
                          className="border-gray-300"
                        />
                      </div>
                    </div>

                    <div className="border p-4 rounded">
                      <h4 className="text-sm font-medium mb-2">Variant B</h4>
                      <div className="mb-2">
                        <label htmlFor="variantBSubject" className="block text-xs font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <Input
                          id="variantBSubject"
                          name="variantBSubject"
                          value={variantB.subject}
                          onChange={(e) => setVariantB(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Enter subject for variant B"
                          className="border-gray-300"
                        />
                      </div>
                      <div>
                        <label htmlFor="variantBContent" className="block text-xs font-medium text-gray-700 mb-1">
                          Content
                        </label>
                        <Textarea
                          id="variantBContent"
                          name="variantBContent"
                          value={variantB.content}
                          onChange={(e) => setVariantB(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Enter content for variant B"
                          className="border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Schedule */}
                <div>
                  <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 mb-1">
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

                {/* Test and Submit Buttons */}
                <div className="flex items-center justify-between">
                  <Button onClick={testCampaign} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Test Email
                  </Button>
                  <Button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Create Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
