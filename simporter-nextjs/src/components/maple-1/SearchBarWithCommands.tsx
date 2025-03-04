"use client";

import React, {
  useState,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  DragEvent,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Loader2,
  AlertCircle,
  Command,
  Sparkles,
  Paperclip,
  Trash2,
  X,
  MessageCircle,
  PenLine,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { commandCategories, getAllCommands } from "@/data/commands";

////////////////////////////////////////////////////////////////////////////////
// Type Definitions
////////////////////////////////////////////////////////////////////////////////

type FileWithPreview = {
  file: File;
  id: string;
  preview?: string;
  uploading: boolean;
  progress: number;
};

type CommandItem = {
  command: string;
  description: string;
  placeholder?: string;
  category: string;
  color: string; // e.g. "text-blue-600"
};

////////////////////////////////////////////////////////////////////////////////
// Flatten commandCategories into a flat array of CommandItem
////////////////////////////////////////////////////////////////////////////////

const commandList: CommandItem[] = commandCategories.flatMap((cat) =>
  cat.commands.map((cmd) => ({
    command: cmd.command,
    description: cmd.description,
    placeholder: cmd.placeholder,
    category: cat.name,
    // Convert category color (e.g., "blue") to Tailwind text color, e.g. "text-blue-600"
    color: `text-${cat.color}-600`,
  }))
);

// Generate all prompts from the categories with more variety
const allPrompts = getAllCommands().map((cmd, index) => {
  // Create a unique color based on category and command
  const category = commandCategories.find(cat => 
    cat.commands.some(c => c.command === cmd.command)
  );
  
  // Add variety to colors
  const colorOptions = ['blue', 'green', 'purple', 'red', 'yellow', 'indigo', 'pink', 
                        'amber', 'emerald', 'cyan', 'teal', 'lime', 'sky', 'orange',
                        'rose', 'fuchsia', 'violet'];
  const colorIndex = (index + (category?.id.length || 0)) % colorOptions.length;
  
  return {
    text: cmd.placeholder ? cmd.description.replace("{placeholder}", `{${cmd.placeholder}}`) : cmd.description,
    color: colorOptions[colorIndex]
  };
});

////////////////////////////////////////////////////////////////////////////////
// Helper: Format command description using the placeholder value
// Replace literal "{placeholder}" with "{" + placeholder + "}" (with no extra styling)
////////////////////////////////////////////////////////////////////////////////
function formatCommandDescription(cmd: CommandItem): string {
  return cmd.placeholder
    ? cmd.description.replace("{placeholder}", `{${cmd.placeholder}}`)
    : cmd.description;
}

////////////////////////////////////////////////////////////////////////////////
// Main Component
////////////////////////////////////////////////////////////////////////////////
export default function SearchBarWithCommands() {
  // -------------------------------------------------------------------------
  // State Declarations
  // -------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const [selectedCommandIdx, setSelectedCommandIdx] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeButtons, setActiveButtons] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<FileWithPreview[]>([]);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [carouselPosition, setCarouselPosition] = useState(0);

  // Create duplicate prompts for infinite looping effect
  const duplicatedPrompts = [...allPrompts, ...allPrompts];
  
  // Calculate items per row and total rows
  const itemsPerRow = 2;
  const totalRows = 2;
  const visibleItems = itemsPerRow * totalRows;

  // Refs for handling outside clicks
  const containerRef = useRef<HTMLDivElement | null>(null);
  const commandsRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------
  // Removed this interval since we're using the autoScroll effect instead

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        commandsRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !commandsRef.current.contains(e.target as Node)
      ) {
        setShowCommands(false);
        setSelectedCommandIdx(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -------------------------------------------------------------------------
  // Utility: Filter commands based on the searchQuery
  // -------------------------------------------------------------------------
  function filteredCommands(query: string = searchQuery): CommandItem[] {
    if (!query || !query.startsWith("/")) return [];
    const q = query.slice(1).toLowerCase().trim();
    return commandList.filter(
      (cmd) =>
        cmd.command.toLowerCase().includes(q) ||
        cmd.description.toLowerCase().includes(q)
    );
  }

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setShowCommands(false);
      setSelectedCommandIdx(-1);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (showCommands && selectedCommandIdx >= 0) {
        const cmds = filteredCommands();
        if (cmds[selectedCommandIdx]) {
          pickCommand(cmds[selectedCommandIdx]);
        }
      } else {
        handleSearch();
      }
      return;
    }
    if (showCommands) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedCommandIdx((prev) =>
          prev < filteredCommands().length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedCommandIdx((prev) =>
          prev > 0 ? prev - 1 : filteredCommands().length - 1
        );
      }
    }
  }

  function pickCommand(cmd: CommandItem) {
    const fullText = `${cmd.command}  ${formatCommandDescription(cmd)}`;
    setSearchQuery(fullText);
    setShowCommands(false);
    setSelectedCommandIdx(-1);
  }

  function handlePromptClick(text: string) {
    setSearchQuery(text);
  }

  function handleCarouselNavigation(direction: 'left' | 'right') {
    if (direction === 'left') {
      setCarouselPosition(prev => 
        prev === 0 ? allPrompts.length - 1 : prev - 1
      );
    } else {
      setCarouselPosition(prev => 
        (prev + 1) % allPrompts.length
      );
    }
  }
  
  // For continuous horizontal scrolling animation
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (!autoScroll) return;
    
    const animation = setInterval(() => {
      setCarouselPosition(prev => (prev + 1) % (allPrompts.length || 1));
    }, 2250); // Increased delay for slower animation
    
    return () => clearInterval(animation);
  }, [autoScroll, allPrompts.length]);
  
  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!searchQuery.trim() || isProcessing) return;
    setIsProcessing(true);
    setError(null);
    // Simulate async operation (replace with your real logic)
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Search executed with query:", searchQuery);
    console.log("Attachments:", attachments.map((a) => a.file.name));
    setIsProcessing(false);
  }

  function toggleButton(btnId: string) {
    if (btnId === "attachments") {
      setShowAttachments(true);
      return;
    }
    setActiveButtons((prev) =>
      prev.includes(btnId)
        ? prev.filter((id) => id !== btnId)
        : [...prev, btnId]
    );
  }

  // -------------------------------------------------------------------------
  // Drag-and-Drop Handlers for Attachments
  // -------------------------------------------------------------------------
  function handleDragEnter(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }
  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
      setShowAttachments(true);
    }
  }
  function addFiles(files: File[]) {
    const newAttachments = files.map((file) => ({
      file,
      id: Math.random().toString(36).substring(2, 9),
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      uploading: true,
      progress: 0,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    newAttachments.forEach((att) => simulateFileUpload(att.id));
  }
  function simulateFileUpload(fileId: string) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setAttachments((prev) =>
        prev.map((att) =>
          att.id === fileId ? { ...att, progress: Math.min(progress, 100) } : att
        )
      );
      if (progress >= 100) {
        clearInterval(interval);
        setAttachments((prev) =>
          prev.map((att) => (att.id === fileId ? { ...att, uploading: false } : att))
        );
      }
    }, 300);
  }
  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const updated = prev.filter((att) => att.id !== id);
      if (updated.length === 0) setShowAttachments(false);
      return updated;
    });
  }

  // Function to get pastel background color based on the color string
  function getBackgroundColor(colorName: string) {
    const colorMap: Record<string, string> = {
      'blue': 'bg-blue-100',
      'green': 'bg-green-100',
      'purple': 'bg-purple-100',
      'red': 'bg-red-100',
      'yellow': 'bg-yellow-100',
      'indigo': 'bg-indigo-100',
      'pink': 'bg-pink-100',
      'amber': 'bg-amber-100',
      'emerald': 'bg-emerald-100',
      'cyan': 'bg-cyan-100',
      'gray': 'bg-gray-100',
      'teal': 'bg-teal-100',
      'lime': 'bg-lime-100',
      'sky': 'bg-sky-100',
      'orange': 'bg-orange-100',
      'rose': 'bg-rose-100',
      'fuchsia': 'bg-fuchsia-100',
      'violet': 'bg-violet-100',
    };
    
    // Add more color variety by creating a deterministic but varied color assignment
    const sum = colorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorKeys = Object.keys(colorMap);
    const colorIndex = sum % colorKeys.length;
    
    return colorMap[colorKeys[colorIndex]] || colorMap[colorName] || 'bg-gray-100';
  }

  // Get visible items for carousel - shows complete cards
  const getVisibleItems = () => {
    // Ensure we have enough prompts by making multiple copies 
    const multipliedPrompts = [...allPrompts, ...allPrompts, ...allPrompts];
    
    // Create a section of the duplicated array starting from the current position
    // Make sure to include enough items to fill the view (considering we show 4 items at a time)
    const startIndex = carouselPosition % allPrompts.length;
    const visibleSection = [...multipliedPrompts.slice(startIndex), ...multipliedPrompts].slice(0, visibleItems + 4);
    
    // Split into rows
    const rows = [];
    for (let i = 0; i < totalRows; i++) {
      rows.push(visibleSection.slice(i * itemsPerRow, (i + 1) * itemsPerRow));
    }
    
    return rows;
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto mb-6 relative"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center z-10 pointer-events-none">
          <div className="flex flex-col items-center text-blue-600 dark:text-blue-400">
            <Sparkles className="w-12 h-12 mb-2" />
            <p className="font-medium">Drop files to attach</p>
          </div>
        </div>
      )}

      {/* Main search input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(e.target.value);
              if (e.target.value.startsWith("/")) {
                setShowCommands(true);
                setSelectedCommandIdx(0);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type '/' for commands or your question..."
            className={cn(
              "w-full px-5 py-3 text-base rounded-lg pr-28",
              "border-2 border-gray-200 dark:border-gray-700",
              "bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-white",
              "focus:outline-none focus:border-blue-500 transition-colors",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500"
            )}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowCommands(true);
                setSearchQuery("/");
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Show commands"
            >
              <Command className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              type="submit"
              disabled={!searchQuery.trim() || isProcessing}
              className={cn(
                "p-2 rounded-full transition-colors",
                !searchQuery.trim() || isProcessing
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400"
                  : "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              )}
              aria-label="Run search"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-2 flex items-center justify-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}

        {/* Commands overlay */}
        <AnimatePresence>
          {showCommands &&
            searchQuery.startsWith("/") &&
            filteredCommands().length > 0 && (
              <motion.div
                ref={commandsRef}
                className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-auto z-50"
                style={{ maxHeight: "55vh" }}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                    Discovery Commands
                  </h4>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCommands().map((cmd, idx) => {
                    const isSelected = selectedCommandIdx === idx;
                    return (
                      <motion.button
                        key={`${cmd.command}-${idx}`}
                        onClick={() => pickCommand(cmd)}
                        className={cn(
                          "w-full flex items-center gap-2 px-4 py-2 transition-colors group rounded-md",
                          isSelected
                            ? "bg-gray-100 dark:bg-gray-700"
                            : "hover:bg-transparent hover:text-black"
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className={cn("font-semibold", cmd.color)}>
                          {cmd.command}
                        </span>
                        <span className="text-gray-600 dark:text-gray-300">
                          {formatCommandDescription(cmd)}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </form>

      {/* Action Buttons row */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={() => {
            toggleButton("discover");
            console.log("Run AI Discovery clicked with query:", searchQuery);
          }}
          className={cn(
            "px-4 py-2 rounded-md text-base font-medium flex items-center justify-center transition-colors",
            activeButtons.includes("discover")
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "bg-white text-gray-900 border border-gray-900 hover:bg-gray-100"
          )}
        >
          <Sparkles className="w-5 h-5 mr-1" />
          Run AI Discovery
        </button>
        <button
          onClick={() => {
            toggleButton("improve");
            console.log("Let AI Improve My Input clicked with query:", searchQuery);
          }}
          className={cn(
            "px-4 py-2 rounded-md text-base font-medium flex items-center justify-center transition-colors",
            activeButtons.includes("improve")
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "bg-white text-gray-900 border border-gray-900 hover:bg-gray-100"
          )}
        >
          <PenLine className="w-5 h-5 mr-1" />
          Let AI Improve My Input
        </button>
        <a
          href="/TheLibrary"
          className="px-4 py-2 rounded-md text-base font-medium flex items-center justify-center transition-colors bg-white text-gray-900 border border-gray-900 hover:bg-gray-100"
        >
          <ExternalLink className="w-5 h-5 mr-1" />
          Get Data
        </a>
        <button
          onClick={() => toggleButton("attachments")}
          className="p-2 rounded-md text-base font-medium flex items-center justify-center transition-colors bg-white text-gray-900 border border-gray-900 hover:bg-gray-100"
          aria-label="Add attachment"
        >
          <Paperclip className="w-5 h-5" />
        </button>
      </div>

      {/* Prompts Carousel */}
      <div className="mt-6 relative w-full max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Suggested prompts:
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => handleCarouselNavigation('left')}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-700"
              aria-label="Previous prompts"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleCarouselNavigation('right')}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-700"
              aria-label="Next prompts"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div ref={carouselRef} className="overflow-hidden">
          <motion.div
            animate={{ 
              x: `-${(carouselPosition % allPrompts.length) * 2}px` 
            }}
            transition={{ 
              ease: "linear", 
              duration: 0.2 
            }}
            className="space-y-3"
          >
            {getVisibleItems().map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid grid-cols-2 gap-3">
                {row.map((prompt, idx) => (
                  <div
                    key={`prompt-${rowIndex}-${idx}`}
                    onClick={() => handlePromptClick(prompt.text)}
                    className={cn(
                      getBackgroundColor(prompt.color),
                      "p-4 rounded-md cursor-pointer hover:opacity-80 transition-opacity",
                      "text-gray-800 text-sm flex items-center min-h-12",
                      "border border-gray-200",
                      "min-w-64 max-w-80"
                    )}
                    style={{ minWidth: '300px' }}
                  >
                    {prompt.text}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Attachments Preview */}
      <AnimatePresence>
        {showAttachments && attachments.length > 0 && (
          <motion.div
            className="mt-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Attachments ({attachments.length})
              </h3>
              <button
                onClick={() => setShowAttachments(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="relative border border-gray-200 dark:border-gray-700 rounded p-2 group"
                >
                  <div className="aspect-square flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded mb-1 overflow-hidden">
                    {att.preview ? (
                      <img
                        src={att.preview}
                        alt={att.file.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <MessageCircle className="w-10 h-10 text-gray-400" />
                    )}
                    {att.uploading && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-full px-3">
                          <div className="h-1 w-full bg-gray-300 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${att.progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-white text-center mt-1">
                            {att.progress}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs truncate">{att.file.name}</div>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={att.uploading}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}