import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Settings, 
  AlertTriangle, 
  Download, 
  Upload,
  TrendingUp,
  DollarSign,
  Bell,
  UserPlus,
  Filter,
  Search,
  ChevronDown,
  MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface UserTokenUsage {
  id: string;
  name: string;
  email: string;
  role: string;
  tokenUsage: number;
  limit: number;
  lastActive: Date;
  status: 'active' | 'warning' | 'exceeded';
}

interface UsageDataPoint {
  date: string;
  tokens: number;
  user?: string;
}

export function TokenUsagePage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [selectedView, setSelectedView] = useState<'overview' | 'users' | 'settings'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserComparison, setShowUserComparison] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data
  const organizationUsage = {
    total: 1500000,
    limit: 2000000,
    used: 750000,
    remaining: 1250000,
    cost: 150,
    projectedUsage: 1800000,
    alerts: [
      { type: 'warning', message: 'Approaching monthly limit (75%)' },
      { type: 'info', message: 'Usage increased by 25% this week' }
    ]
  };

  const mockUsers: UserTokenUsage[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      role: 'Admin',
      tokenUsage: 150000,
      limit: 200000,
      lastActive: new Date(),
      status: 'active'
    },
    {
      id: '2',
      name: 'Michael Torres',
      email: 'michael@company.com',
      role: 'Member',
      tokenUsage: 180000,
      limit: 200000,
      lastActive: new Date(),
      status: 'warning'
    }
  ];

  const generateMockData = (days: number, baseValue: number, variance: number): UsageDataPoint[] => {
    const data: UsageDataPoint[] = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        tokens: Math.max(0, baseValue + Math.random() * variance - variance / 2)
      });
    }
    
    return data;
  };

  const generateUserData = (userId: string, days: number): UsageDataPoint[] => {
    const user = mockUsers.find(u => u.id === userId);
    const baseValue = user ? user.tokenUsage / 30 : 5000;
    return generateMockData(days, baseValue, 2000).map(point => ({
      ...point,
      user: user?.name
    }));
  };

  const getDaysForPeriod = (period: string): number => {
    switch (period) {
      case 'daily':
        return 7;
      case 'weekly':
        return 12;
      case 'monthly':
        return 12;
      default:
        return 30;
    }
  };

  const getLabels = (period: string): string[] => {
    const days = getDaysForPeriod(period);
    const labels: string[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      if (period === 'daily') {
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      } else if (period === 'weekly') {
        labels.push(`Week ${Math.floor(i / 7) + 1}`);
      } else {
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }
    }

    return labels;
  };

  const organizationData = generateMockData(
    getDaysForPeriod(selectedPeriod),
    25000,
    10000
  );

  const chartData = {
    labels: getLabels(selectedPeriod),
    datasets: [
      {
        label: 'Organization Total',
        data: organizationData.map(d => d.tokens),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        hidden: showUserComparison && selectedUsers.length > 0
      },
      ...selectedUsers.map((userId, index) => {
        const colors = [
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)'
        ];
        const userData = generateUserData(userId, getDaysForPeriod(selectedPeriod));
        return {
          label: mockUsers.find(u => u.id === userId)?.name || 'User',
          data: userData.map(d => d.tokens),
          backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.5)'),
          borderColor: colors[index % colors.length],
          borderWidth: 1
        };
      })
    ]
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Tokens Used'
        }
      }
    }
  };

  const renderUsageGraph = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Usage Trends</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {['daily', 'weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as any)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md",
                  selectedPeriod === period
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUserComparison(!showUserComparison)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md",
                showUserComparison
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showUserComparison && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Compare Users
          </label>
          <div className="flex flex-wrap gap-2">
            {mockUsers.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUsers(prev => 
                  prev.includes(user.id) 
                    ? prev.filter(id => id !== user.id)
                    : [...prev, user.id]
                )}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  selectedUsers.includes(user.id)
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                )}
              >
                {user.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="h-[400px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Usage Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usage</h3>
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {organizationUsage.used.toLocaleString()}
            </span>
            <span className="ml-2 text-sm text-gray-500">/ {organizationUsage.limit.toLocaleString()}</span>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${(organizationUsage.used / organizationUsage.limit) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Cost</h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${organizationUsage.cost}
            </span>
            <span className="ml-2 text-sm text-green-600">-12% vs last month</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
              Projected: ${(organizationUsage.cost * 1.25).toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</h3>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">12</span>
            <span className="ml-2 text-sm text-purple-600">+2 this month</span>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2" />
              8 currently online
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Alerts</h3>
            <Bell className="w-5 h-5 text-orange-600" />
          </div>
          <div className="space-y-2">
            {organizationUsage.alerts.map((alert, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center text-sm p-2 rounded-md",
                  alert.type === 'warning' 
                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                )}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      </div>

      {renderUsageGraph()}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Limit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Last Active
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {user.tokenUsage.toLocaleString()}
                  </div>
                  <div className="w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        user.status === 'warning' ? "bg-orange-500" : "bg-green-500"
                      )}
                      style={{ width: `${(user.tokenUsage / user.limit) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {user.limit.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                    user.status === 'active' && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                    user.status === 'warning' && "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
                    user.status === 'exceeded' && "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  )}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {user.lastActive.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-500">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Usage Policies
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default User Limit
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                defaultValue="200000"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
              />
              <span className="text-sm text-gray-500">tokens/month</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Usage Warning Threshold
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
              <option value="75">75% of limit</option>
              <option value="80">80% of limit</option>
              <option value="90">90% of limit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Automatic Actions
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Notify users when approaching limit
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Automatically pause usage when limit is reached
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Send weekly usage reports to admins
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Export Options
        </h3>
        <div className="space-y-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export Usage Data
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Upload className="w-4 h-4 mr-2" />
            Import User List
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Token Usage
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage your organization's token usage
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Settings className="w-4 h-4 mr-2" />
            Configure Limits
          </button>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedView(item.id as any)}
              className={cn(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                selectedView === item.id
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'users' && renderUsers()}
      {selectedView === 'settings' && renderSettings()}
    </div>
  );
}