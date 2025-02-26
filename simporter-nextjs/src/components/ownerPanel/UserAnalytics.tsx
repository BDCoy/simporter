'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';

type SortDirection = 'asc' | 'desc';
interface SortConfig {
  column: string;
  direction: SortDirection;
}

interface FilterConfig {
  email: string;
  type: string;
}

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
}

export default function UserAnalytics() {
  const [userData] = useState<User[]>([
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
      margin: '75%'
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
      margin: '71%'
    }
    // Add more user objects as needed...
  ]);

  const [userSortConfig, setUserSortConfig] = useState<SortConfig>({ column: '', direction: 'asc' });
  const [userFilters, setUserFilters] = useState<FilterConfig>({ email: '', type: '' });

  // Filtering
  function filterData(data: User[], filters: FilterConfig) {
    return data.filter((user) => {
      const matchEmail =
        !filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase());
      const matchType =
        !filters.type ||
        user.subscriptionType.toLowerCase().includes(filters.type.toLowerCase());
      return matchEmail && matchType;
    });
  }

  // Sorting
  function sortData(data: User[], config: SortConfig) {
    if (!config.column) return data;
    return [...data].sort((a, b) => {
      const aValue = (a as any)[config.column];
      const bValue = (b as any)[config.column];

      // if it's currency strings like "$499", parse out the number
      if (typeof aValue === 'string' && aValue.startsWith('$')) {
        const parseA = parseFloat(aValue.replace(/[$,]/g, ''));
        const parseB = parseFloat(bValue.replace(/[$,]/g, ''));
        return config.direction === 'asc' ? parseA - parseB : parseB - parseA;
      }

      // otherwise do a basic comparison
      if (config.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }

  // Combined filter + sort
  const filteredAndSortedUsers = useMemo(() => {
    const filtered = filterData(userData, userFilters);
    return sortData(filtered, userSortConfig);
  }, [userData, userFilters, userSortConfig]);

  const handleSort = (column: string) => {
    if (userSortConfig.column === column) {
      setUserSortConfig((prev) => ({
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
        <Input
          placeholder="Filter by subscription type"
          value={userFilters.type}
          onChange={(e) => setUserFilters({ ...userFilters, type: e.target.value })}
          className="max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {Object.keys(userData[0]).map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer"
                >
                  {key.replace(/([A-Z])/g, ' $1').trim()} {getSortIndicator(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedUsers.map((user, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {Object.entries(user).map(([key, value]) => (
                  <td key={key} className="px-3 py-4 text-sm text-gray-500">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
