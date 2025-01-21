"use client";

import * as React from "react";

interface TabsContextValue {
  selectedTab?: string;
  onTabChange?: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue>({});

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value, onValueChange, className = "", children }, ref) => {
    const [selectedTab, setSelectedTab] = React.useState(value || defaultValue);

    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedTab(value);
      }
    }, [value]);

    const handleTabChange = React.useCallback((newValue: string) => {
      if (value === undefined) {
        setSelectedTab(newValue);
      }
      onValueChange?.(newValue);
    }, [value, onValueChange]);

    const contextValue = React.useMemo(
      () => ({
        selectedTab,
        onTabChange: handleTabChange,
      }),
      [selectedTab, handleTabChange]
    );

    return (
      <TabsContext.Provider value={contextValue}>
        <div ref={ref} className={className} data-state={selectedTab}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = "Tabs";

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className = "", children }, ref) => {
    return (
      <div 
        ref={ref} 
        className={`flex gap-6 ${className}`}
        role="tablist"
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className = "", disabled = false, children }, ref) => {
    const { selectedTab, onTabChange } = React.useContext(TabsContext);
    const isSelected = selectedTab === value;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isSelected}
        aria-controls={`panel-${value}`}
        disabled={disabled}
        className={`text-sm font-medium pb-2 border-b-2 ${
          isSelected
            ? "border-violet-600 text-violet-600"
            : "border-transparent text-gray-600 hover:text-gray-900"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
        onClick={() => !disabled && onTabChange?.(value)}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className = "", children }, ref) => {
    const { selectedTab } = React.useContext(TabsContext);

    if (selectedTab !== value) {
      return null;
    }

    return (
      <div 
        ref={ref}
        role="tabpanel"
        id={`panel-${value}`}
        className={className}
        tabIndex={0}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = "TabsContent";

export type { TabsProps, TabsListProps, TabsTriggerProps, TabsContentProps };