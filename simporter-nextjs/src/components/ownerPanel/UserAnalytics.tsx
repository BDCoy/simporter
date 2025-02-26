'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { X, Trash, /* other icons if needed */ } from 'lucide-react';

// Update FilterConfig so that subscription type filter is an array of strings
interface FilterConfig {
  email: string;
  type: string[];
}

// Extend the User interface to include a suspended flag
interface User {
  email: string;
  subscriptionType: string;
  signupDate: string;
  daysSignedUp: number;
  mrr: string;
  xp: number;
  avgSessionDuration: string;
  reportsCreated: number;
  reportShares: number;
  slidesCreated: number;
  totalPaid: string;
  totalCost: string;
  margin: string;
  topUpsPaid: string;
  suspended: boolean;
}

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  column: string;
  direction: SortDirection;
}

const columns = [
  { key: 'email', label: 'Email' },
  { key: 'subscriptionType', label: 'Subscription Type' },
  { key: 'signupDate', label: 'Signup Date' },
  { key: 'daysSignedUp', label: 'Days Signed Up' },
  { key: 'mrr', label: 'MRR' },
  { key: 'xp', label: 'XP' },
  { key: 'avgSessionDuration', label: 'Avg Session Duration' },
  { key: 'reportsCreated', label: 'Reports Created' },
  { key: 'reportShares', label: 'Report Shares' },
  { key: 'slidesCreated', label: 'Slides Created' },
  { key: 'totalPaid', label: 'Total Paid' },
  { key: 'totalCost', label: 'Total Cost' },
  { key: 'margin', label: 'Margin' },
  { key: 'topUpsPaid', label: 'Top Ups Paid' },
  { key: 'actions', label: 'Actions' }
];

export default function UserAnalytics() {
  const [userData, setUserData] = useState<User[]>([
    {
      email: 'user1@example.com',
      subscriptionType: 'Enterprise',
      signupDate: '2024-01-15',
      daysSignedUp: 40,
      mrr: '$499',
      xp: 1250,
      avgSessionDuration: '28m 15s',
      reportsCreated: 15,
      reportShares: 28,
      slidesCreated: 65,
      totalPaid: '$1,497',
      totalCost: '$374',
      margin: '75%',
      topUpsPaid: '$250',
      suspended: false,
    },
    {
      email: 'user2@example.com',
      subscriptionType: 'Pro',
      signupDate: '2024-02-01',
      daysSignedUp: 23,
      mrr: '$49',
      xp: 850,
      avgSessionDuration: '22m 45s',
      reportsCreated: 10,
      reportShares: 15,
      slidesCreated: 42,
      totalPaid: '$98',
      totalCost: '$28',
      margin: '71%',
      topUpsPaid: '$30',
      suspended: true,
    }
    // Add more user objects as needed...
  ]);

  const [userSortConfig, setUserSortConfig] = useState<SortConfig>({ column: '', direction: 'asc' });
  // Initialize filters so that email is empty and subscription types is an empty array (no filter)
  const [userFilters, setUserFilters] = useState<FilterConfig>({ email: '', type: [] });

  // Filtering function updated for multi-select on subscription type.
  function filterData(data: User[], filters: FilterConfig) {
    return data.filter((user) => {
      const matchEmail =
        !filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchType =
        filters.type.length === 0 ||
        filters.type.some(selectedType => 
          user.subscriptionType.toLowerCase() === selectedType.toLowerCase()
        );
      return matchEmail && matchType;
    });
  }

  function sortData(data: User[], config: SortConfig) {
    if (!config.column) return data;
    return [...data].sort((a, b) => {
      let aValue = (a as any)[config.column];
      let bValue = (b as any)[config.column];

      // If the values are dates, compare as dates
      if (config.column === 'signupDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      // If it's currency strings like "$499", parse out the number
      if (typeof aValue === 'string' && aValue.startsWith('$')) {
        const parseA = parseFloat(aValue.replace(/[$,]/g, ''));
        const parseB = parseFloat(bValue.replace(/[$,]/g, ''));
        return config.direction === 'asc' ? parseA - parseB : parseB - parseA;
      }

      // Otherwise do a basic comparison
      if (config.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = filterData(userData, userFilters);
    return sortData(filtered, userSortConfig);
  }, [userData, userFilters, userSortConfig]);

  const handleSort = (column: string) => {
    if (userSortConfig.column === column) {
      setUserSortConfig(prev => ({
        column,
        direction: prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setUserSortConfig({ column, direction: 'asc' });
    }
  };

  const getSortIndicator = (column: string) => {
    if (userSortConfig.column !== column) return '↕️';
    return userSortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // --- Action Handlers ---
  const handleDeleteUser = (email: string) => {
    if (confirm(`Are you sure you want to delete user ${email}?`)) {
      setUserData(prev => prev.filter(user => user.email !== email));
    }
  };

  // Toggle suspension state for a user.
  const handleToggleSuspension = (email: string) => {
    setUserData(prev =>
      prev.map(user =>
        user.email === email ? { ...user, suspended: !user.suspended } : user
      )
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">User Activity</h3>

      {/* Filters */}
      <div className="flex space-x-4 mb-4">
        <Input
          placeholder="Filter by email"
          value={userFilters.email}
          onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
          className="max-w-xs"
        />
        <select
          multiple
          value={userFilters.type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
            setUserFilters({ ...userFilters, type: selected });
          }}
          className="border border-gray-300 rounded p-2 max-w-xs"
        >
          {['Enterprise', 'Pro', 'Free'].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.key !== 'actions' && handleSort(col.key)}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer select-none"
                >
                  {col.label} {col.key !== 'actions' && getSortIndicator(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedUsers.map((user, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.subscriptionType}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{new Date(user.signupDate).toLocaleDateString()}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.daysSignedUp}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.mrr}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.xp}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.avgSessionDuration}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.reportsCreated}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.reportShares}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.slidesCreated}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.totalPaid}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.totalCost}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.margin}</td>
                <td className="px-3 py-4 text-sm text-gray-500">{user.topUpsPaid}</td>
                <td className="px-3 py-4 text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleToggleSuspension(user.email)}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                      title={user.suspended ? "Unsuspend User" : "Suspend User"}
                    >
                      {user.suspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.email)}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                      title="Delete User"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
