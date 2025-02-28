"use client";

import React, { useState } from "react";

interface Sheet {
  id: string;
  name: string;
  data: string[][];
  active?: boolean;
}

interface DataTabProps {
  isEditable?: boolean;
}

const DataTab: React.FC<DataTabProps> = ({ isEditable = true }) => {
  // Sample data for the sheets
  const [sheets, setSheets] = useState<Sheet[]>([
    {
      id: "sheet1",
      name: "Sales Data",
      data: [
        ["Month", "Revenue", "Costs", "Profit", "Growth %"],
        ["January", "$120,450", "$78,230", "$42,220", "12.3%"],
        ["February", "$132,580", "$81,750", "$50,830", "20.4%"],
        ["March", "$141,670", "$85,420", "$56,250", "10.7%"],
        ["April", "$156,890", "$92,340", "$64,550", "14.8%"],
        ["May", "$148,920", "$89,550", "$59,370", "-8.0%"],
        ["June", "$163,750", "$94,280", "$69,470", "17.0%"],
        ["July", "$178,450", "$102,340", "$76,110", "9.6%"],
        ["August", "$189,730", "$108,520", "$81,210", "6.7%"],
        ["September", "$175,620", "$99,840", "$75,780", "-6.7%"],
        ["October", "$190,450", "$107,230", "$83,220", "9.8%"],
        ["November", "$203,670", "$114,550", "$89,120", "7.1%"],
        ["December", "$241,890", "$146,730", "$95,160", "6.8%"],
      ],
      active: true
    },
    {
      id: "sheet2",
      name: "Marketing Metrics",
      data: [
        ["Channel", "Traffic", "Conversion Rate", "CAC", "ROI"],
        ["Organic Search", "45,600", "3.2%", "$24", "6.4x"],
        ["Paid Search", "32,450", "2.8%", "$38", "3.2x"],
        ["Social Media", "28,900", "1.9%", "$32", "2.8x"],
        ["Email", "18,700", "4.5%", "$12", "9.6x"],
        ["Referral", "14,350", "3.8%", "$18", "7.2x"],
        ["Direct", "22,800", "3.4%", "$0", "∞"],
      ],
      active: false
    },
    {
      id: "sheet3",
      name: "Product Performance",
      data: [
        ["Product", "Units Sold", "Revenue", "Profit Margin", "Returns %"],
        ["Product A", "12,450", "$248,000", "32%", "1.2%"],
        ["Product B", "8,600", "$215,000", "40%", "2.4%"],
        ["Product C", "15,750", "$196,875", "28%", "3.1%"],
        ["Product D", "6,820", "$136,400", "45%", "0.8%"],
        ["Product E", "10,260", "$153,900", "36%", "1.9%"],
      ],
      active: false
    }
  ]);

  const [editCell, setEditCell] = useState<{row: number, col: number, value: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{column: number, direction: 'asc' | 'desc'} | null>(null);

  // Get active sheet
  const activeSheet = sheets.find(sheet => sheet.active) || sheets[0];

  // Switch between sheets
  const switchSheet = (id: string) => {
    setSheets(sheets.map(sheet => ({
      ...sheet,
      active: sheet.id === id
    })));
    setEditCell(null); // Cancel any active editing
    setSortConfig(null); // Reset sorting
  };

  // Add a new sheet
  const addSheet = () => {
    const newSheet: Sheet = {
      id: `sheet${sheets.length + 1}`,
      name: `New Sheet ${sheets.length + 1}`,
      data: [["", "", "", "", ""], ["", "", "", "", ""], ["", "", "", "", ""]],
      active: false
    };
    
    setSheets([...sheets, newSheet]);
  };

  // Start editing a cell
  const startEditing = (row: number, col: number) => {
    if (!isEditable) return;
    
    setEditCell({
      row,
      col,
      value: activeSheet.data[row][col]
    });
  };

  // Update cell value
  const updateCell = (value: string) => {
    if (!editCell) return;
    
    const updatedCell = { ...editCell, value };
    setEditCell(updatedCell);
  };

  // Save edited cell
  const saveCell = () => {
    if (!editCell) return;
    
    const { row, col, value } = editCell;
    
    const updatedSheets = sheets.map(sheet => {
      if (sheet.active) {
        const newData = [...sheet.data];
        newData[row][col] = value;
        return { ...sheet, data: newData };
      }
      return sheet;
    });
    
    setSheets(updatedSheets);
    setEditCell(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditCell(null);
  };

  // Handle key presses in the edit field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveCell();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // Sort the data by column
  const sortData = (columnIndex: number) => {
    const direction = 
      sortConfig?.column === columnIndex && sortConfig.direction === 'asc' 
        ? 'desc' 
        : 'asc';
    
    setSortConfig({ column: columnIndex, direction });
    
    const updatedSheets = sheets.map(sheet => {
      if (sheet.active) {
        const header = sheet.data[0];
        const dataRows = [...sheet.data.slice(1)];
        
        const sortedRows = dataRows.sort((a, b) => {
          const aValue = a[columnIndex];
          const bValue = b[columnIndex];
          
          // Try to sort as numbers if possible
          const aNum = parseFloat(aValue.replace(/[$,%]/g, ''));
          const bNum = parseFloat(bValue.replace(/[$,%]/g, ''));
          
          if (!isNaN(aNum) && !isNaN(bNum)) {
            return direction === 'asc' ? aNum - bNum : bNum - aNum;
          }
          
          // Fall back to string comparison
          return direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        });
        
        return { ...sheet, data: [header, ...sortedRows] };
      }
      return sheet;
    });
    
    setSheets(updatedSheets);
  };

  // Filter data based on search term
  const getFilteredData = () => {
    if (!searchTerm.trim()) return activeSheet.data;
    
    const term = searchTerm.toLowerCase();
    
    // Always keep the header row
    const headerRow = activeSheet.data[0];
    const filteredRows = activeSheet.data.slice(1).filter(row => 
      row.some(cell => cell.toLowerCase().includes(term))
    );
    
    return [headerRow, ...filteredRows];
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex justify-between items-center p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex space-x-2">
          {/* Sheet tabs */}
          <div className="flex items-center overflow-x-auto hide-scrollbar">
            {sheets.map(sheet => (
              <button
                key={sheet.id}
                onClick={() => switchSheet(sheet.id)}
                className={`px-3 py-1.5 text-xs font-medium border-b-2 whitespace-nowrap ${
                  sheet.active
                    ? 'border-blue-500 text-blue-700 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                }`}
              >
                {sheet.name}
              </button>
            ))}
            
            {isEditable && (
              <button
                onClick={addSheet}
                className="px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Search & Actions */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-40 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {isEditable && (
            <button className="p-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Import
            </button>
          )}
          
          <button className="p-1.5 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>
      
      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 sticky top-0">
              {activeSheet.data[0].map((header, index) => (
                <th 
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300"
                  onClick={() => sortData(index)}
                >
                  <div className="flex items-center cursor-pointer">
                    {header}
                    
                    {sortConfig && sortConfig.column === index && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-1 ${sortConfig.direction === 'asc' ? 'transform rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getFilteredData().slice(1).map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-800 dark:text-gray-200"
                    onClick={() => startEditing(rowIndex + 1, colIndex)} // +1 because we're skipping the header row
                  >
                    {editCell && editCell.row === (rowIndex + 1) && editCell.col === colIndex ? (
                      <input
                        type="text"
                        value={editCell.value}
                        onChange={(e) => updateCell(e.target.value)}
                        onBlur={saveCell}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      />
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTab;