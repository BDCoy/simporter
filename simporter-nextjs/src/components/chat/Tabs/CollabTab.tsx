"use client";

import React, { useState, useRef } from "react";

interface User {
  id: number;
  name: string;
  initials: string;
  email: string;
  role: "owner" | "editor" | "viewer";
  color: string;
  online?: boolean;
}

interface Reply {
  id: string;
  author: {
    name: string;
    initials: string;
    color: string;
    email: string;
  };
  text: string;
  timestamp: Date;
  mentions: string[]; // Emails
}

interface Comment {
  id: string;
  author: {
    name: string;
    initials: string;
    color: string;
    email: string;
  };
  text: string;
  timestamp: Date;
  location?: {
    tab: string;
    id: string;
    title: string;
  };
  resolved?: boolean;
  mentions: string[]; // Emails
  replies: Reply[];
}

interface CollabTabProps {
  onSelectComment?: (location: { tab: string; id: string }) => void;
}

const CollabTab: React.FC<CollabTabProps> = ({ onSelectComment }) => {
  // Sample users
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Dillon",
      initials: "DH",
      email: "dillon@example.com",
      role: "owner",
      color: "bg-blue-500",
      online: true,
    },
    {
      id: 2,
      name: "Sarah",
      initials: "SC",
      email: "sarah@example.com",
      role: "editor",
      color: "bg-purple-500",
      online: true,
    },
    {
      id: 3,
      name: "Mike",
      initials: "MJ",
      email: "mike@example.com",
      role: "viewer",
      color: "bg-green-500",
      online: false,
    },
  ]);

  // Sample comments
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "comment-1",
      author: { 
        name: "Sarah", 
        initials: "SC", 
        color: "bg-purple-500", 
        email: "sarah@example.com" 
      },
      text: "Can we add more details about the market growth in this slide?",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      location: { tab: "slides", id: "slide-2", title: "Market Overview" },
      resolved: false,
      mentions: [],
      replies: [
        {
          id: "reply-1",
          author: { 
            name: "Dillon", 
            initials: "DH", 
            color: "bg-blue-500", 
            email: "dillon@example.com" 
          },
          text: "Good point. I'll update it with more industry data.",
          timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
          mentions: ["sarah@example.com"]
        }
      ]
    },
    {
      id: "comment-2",
      author: { 
        name: "Mike", 
        initials: "MJ", 
        color: "bg-green-500", 
        email: "mike@example.com" 
      },
      text: "The chart colors should match our brand guidelines",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      location: { tab: "slides", id: "slide-3", title: "Monthly Sales Trends" },
      resolved: true,
      mentions: ["dillon@example.com"],
      replies: []
    },
    {
      id: "comment-3",
      author: { 
        name: "Dillon", 
        initials: "DH", 
        color: "bg-blue-500", 
        email: "dillon@example.com" 
      },
      text: "We should include year-over-year comparisons in this section",
      timestamp: new Date(Date.now() - 43200000), // 12 hours ago
      location: { tab: "document", id: "section-2", title: "Analysis" },
      resolved: false,
      mentions: ["sarah@example.com", "mike@example.com"],
      replies: [
        {
          id: "reply-2",
          author: { 
            name: "Sarah", 
            initials: "SC", 
            color: "bg-purple-500", 
            email: "sarah@example.com" 
          },
          text: "I agree. Let's also include quarterly breakdowns.",
          timestamp: new Date(Date.now() - 21600000), // 6 hours ago
          mentions: []
        },
        {
          id: "reply-3",
          author: { 
            name: "Mike", 
            initials: "MJ", 
            color: "bg-green-500", 
            email: "mike@example.com" 
          },
          text: "Should we focus on specific industry segments too?",
          timestamp: new Date(Date.now() - 18000000), // 5 hours ago
          mentions: ["dillon@example.com"]
        }
      ]
    },
  ]);

  // States for new users
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<"editor" | "viewer">("viewer");

  // States for comments
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [newReply, setNewReply] = useState("");
  
  // Mentions system
  const [mentionsOpen, setMentionsOpen] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [selectedMentions, setSelectedMentions] = useState<string[]>([]);
  const [isCommentInput, setIsCommentInput] = useState(true); // Whether mentions are for comment or reply
  
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  // Filter for showing either all or only unresolved comments
  const [showOnlyUnresolved, setShowOnlyUnresolved] = useState(false);

  // Handler for clicking on a comment
  const handleCommentClick = (comment: Comment) => {
    if (onSelectComment && comment.location) {
      onSelectComment(comment.location);
    }
  };

  // Add a new user
  const addUser = () => {
    if (!newUserEmail.trim()) return;

    // Check if user already exists
    if (users.some(user => user.email.toLowerCase() === newUserEmail.toLowerCase())) {
      alert("This user is already added to the project.");
      return;
    }

    // Generate random color
    const colors = [
      "bg-blue-500",
      "bg-purple-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-teal-500",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Generate initials from email
    const emailName = newUserEmail.split("@")[0];
    let initials = "";
    
    if (emailName.includes(".")) {
      // If email has format like "first.last@example.com"
      const nameParts = emailName.split(".");
      initials = nameParts.map(part => part.charAt(0).toUpperCase()).join("").slice(0, 2);
    } else {
      // Just use first 2 chars of email name
      initials = emailName.substring(0, 2).toUpperCase();
    }

    // Generate name from email (capitalize parts)
    let name = "";
    if (emailName.includes(".")) {
      name = emailName.split(".").map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      ).join(" ");
    } else {
      name = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }

    const newUser: User = {
      id: users.length + 1,
      name,
      initials,
      email: newUserEmail,
      role: newUserRole,
      color: randomColor,
      online: false,
    };

    setUsers([...users, newUser]);
    setNewUserEmail("");
  };

  // Toggle comment resolved status
  const toggleCommentResolved = (id: string) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? { ...comment, resolved: !comment.resolved }
          : comment
      )
    );
  };

  // Format date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHour / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour !== 1 ? "s" : ""} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }
  };

  // Handle key press for mentions
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, isComment: boolean) => {
    if (e.key === '@') {
      setMentionsOpen(true);
      setMentionFilter("");
      setIsCommentInput(isComment);
      
      // Calculate position for dropdown
      if (isComment && commentInputRef.current) {
        const position = getCaretCoordinates(commentInputRef.current, commentInputRef.current.selectionStart);
        setMentionPosition({
          top: position.top + 20,
          left: position.left
        });
      } else if (!isComment && replyInputRef.current) {
        const position = getCaretCoordinates(replyInputRef.current, replyInputRef.current.selectionStart);
        setMentionPosition({
          top: position.top + 20,
          left: position.left
        });
      }
    } else if (mentionsOpen && e.key === 'Escape') {
      setMentionsOpen(false);
    }
  };

  // Utility to get caret position in textarea
  const getCaretCoordinates = (element: HTMLTextAreaElement, position: number) => {
    // Simplified - in a real app you'd need a more sophisticated approach
    return { 
      top: element.offsetTop + 20, 
      left: element.offsetLeft + (position * 8) // Rough approximation
    };
  };

  // Handle input change for comments/replies with mention handling
  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>, 
    isComment: boolean,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(e.target.value);
    
    if (mentionsOpen) {
      // Extract text after @ to filter mentions
      const cursorPos = e.target.selectionStart;
      const textBeforeCursor = e.target.value.substring(0, cursorPos);
      const atSymbolIndex = textBeforeCursor.lastIndexOf('@');
      
      if (atSymbolIndex !== -1) {
        const filterText = textBeforeCursor.substring(atSymbolIndex + 1);
        setMentionFilter(filterText);
      } else {
        setMentionsOpen(false);
      }
    }
  };

  // Select a mention from dropdown
  const selectMention = (email: string) => {
    // Get user display name from email
    const user = users.find(u => u.email === email);
    const displayText = user ? `@${user.name}` : `@${email}`;
    
    const updateTextAndMentions = (
      inputRef: React.RefObject<HTMLTextAreaElement>,
      text: string,
      setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
      if (inputRef.current) {
        const cursorPos = inputRef.current.selectionStart;
        const textBeforeCursor = text.substring(0, cursorPos);
        const atSymbolIndex = textBeforeCursor.lastIndexOf('@');
        
        if (atSymbolIndex !== -1) {
          const newText = 
            text.substring(0, atSymbolIndex) + 
            displayText + " " + 
            text.substring(cursorPos);
          
          setter(newText);
          setSelectedMentions([...selectedMentions, email]);
        }
      }
    };
    
    if (isCommentInput) {
      updateTextAndMentions(commentInputRef, newComment, setNewComment);
    } else {
      updateTextAndMentions(replyInputRef, newReply, setNewReply);
    }
    
    setMentionsOpen(false);
    
    // Focus back on the correct input
    if (isCommentInput) {
      commentInputRef.current?.focus();
    } else {
      replyInputRef.current?.focus();
    }
  };

  // Extract mentions from text (emails)
  const extractMentions = (text: string): string[] => {
    const matches = text.match(/@[\w\s.@]+/g);
    if (!matches) return [];
    
    return matches.map(match => {
      // Extract email from mention format
      const mentionText = match.substring(1).trim(); // Remove @ and trim
      
      // Check if it's a name or email
      if (mentionText.includes('@')) {
        // It's already an email
        return mentionText;
      } else {
        // It's a name, lookup email
        const user = users.find(u => u.name === mentionText);
        return user ? user.email : mentionText;
      }
    });
  };

  // Post a new comment
  const postComment = () => {
    if (!newComment.trim()) return;

    const mentions = extractMentions(newComment);
    
    const newCommentObj: Comment = {
      id: `comment-${Date.now()}`,
      author: { 
        name: "Dillon", // Current user
        initials: "DH", 
        color: "bg-blue-500",
        email: "dillon@example.com"
      },
      text: newComment,
      timestamp: new Date(),
      resolved: false,
      mentions,
      replies: []
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");
    setSelectedMentions([]);
  };

  // Post a reply to a comment
  const postReply = (commentId: string) => {
    if (!newReply.trim()) return;

    const mentions = extractMentions(newReply);
    
    const newReplyObj: Reply = {
      id: `reply-${Date.now()}`,
      author: { 
        name: "Dillon", // Current user
        initials: "DH", 
        color: "bg-blue-500",
        email: "dillon@example.com"
      },
      text: newReply,
      timestamp: new Date(),
      mentions
    };

    setComments(comments.map(comment => 
      comment.id === commentId
        ? { ...comment, replies: [...comment.replies, newReplyObj] }
        : comment
    ));

    setNewReply("");
    setReplyingTo(null);
    setSelectedMentions([]);
  };

  // Get user by email (for mentions)
  const getUserByEmail = (email: string) => {
    return users.find(user => user.email === email);
  };

  // Check if email exists in users
  const isExistingUser = (email: string): boolean => {
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  };

  // Filter users based on mention filter
  const filteredUsers = mentionFilter 
    ? users.filter(user => 
        user.name.toLowerCase().includes(mentionFilter.toLowerCase()) ||
        user.email.toLowerCase().includes(mentionFilter.toLowerCase()))
    : users;

  // Filter comments based on resolved/unresolved
  const filteredComments = showOnlyUnresolved
    ? comments.filter(comment => !comment.resolved)
    : comments;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Header section */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Project Collaboration</h2>
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
              <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - Grid layout with comments and team members */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Left column - Comments */}
          <div className="md:col-span-2 space-y-6">
            {/* Comment input */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="mb-3 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">New Comment</h3>
                <button 
                  onClick={() => setShowOnlyUnresolved(!showOnlyUnresolved)}
                  className={`text-xs px-3 py-1 rounded-full ${
                    showOnlyUnresolved ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {showOnlyUnresolved ? 'Showing Unresolved' : 'Show All'}
                </button>
              </div>
              <div className="relative">
                <textarea
                  ref={commentInputRef}
                  value={newComment}
                  onChange={(e) => handleInputChange(e, true, setNewComment)}
                  onKeyDown={(e) => handleInputKeyDown(e, true)}
                  placeholder="Type your comment here... Use @ to mention someone by email"
                  className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 min-h-20"
                  rows={3}
                ></textarea>
                
                {/* Mentions dropdown */}
                {mentionsOpen && isCommentInput && (
                  <div 
                    className="absolute z-10 bg-white shadow-lg rounded-md border border-gray-200 max-h-40 overflow-y-auto w-64"
                    style={{ top: mentionPosition.top, left: mentionPosition.left }}
                  >
                    {filteredUsers.length > 0 ? (
                      <ul className="py-1">
                        {filteredUsers.map(user => (
                          <li 
                            key={user.id} 
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => selectMention(user.email)}
                          >
                            <div className={`h-6 w-6 rounded-full ${user.color} flex items-center justify-center text-white text-xs mr-2`}>
                              {user.initials}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm">{user.name}</span>
                              <span className="text-xs text-gray-500">{user.email}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-3 flex flex-col">
                        <div className="text-gray-500 text-sm">No matching users</div>
                        {mentionFilter.includes('@') && (
                          <button 
                            className="mt-2 text-blue-600 text-sm flex items-center"
                            onClick={() => selectMention(mentionFilter)}
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Mention {mentionFilter}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-3 flex justify-end">
                <button
                  onClick={postComment}
                  disabled={!newComment.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>
            
            {/* Comments list */}
            <div className="space-y-4">
              {filteredComments.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500">No comments yet</p>
                </div>
              ) : (
                filteredComments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className={`bg-white rounded-lg border ${comment.resolved ? 'border-gray-200' : 'border-gray-300'} shadow-sm overflow-hidden ${comment.resolved ? 'opacity-75' : ''}`}
                  >
                    {/* Main comment */}
                    <div className="p-4">
                      <div className="flex">
                        <div className={`h-10 w-10 rounded-full ${comment.author.color} flex items-center justify-center text-white font-medium text-sm flex-shrink-0`}>
                          {comment.author.initials}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900">
                                {comment.author.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(comment.timestamp)}
                              </div>
                            </div>
                            <button
                              onClick={() => toggleCommentResolved(comment.id)}
                              className={`p-1 rounded-full ${
                                comment.resolved 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {comment.resolved ? (
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </div>
                          
                          <div className="mt-2 text-gray-800">
                            {comment.text}
                          </div>
                          
                          {/* Mentions */}
                          {comment.mentions.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {comment.mentions.map(email => {
                                const user = getUserByEmail(email);
                                return (
                                  <span key={email} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    @{user ? user.name : email}
                                    {!isExistingUser(email) && (
                                      <button 
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                        onClick={() => {
                                          setNewUserEmail(email);
                                          // Simulate click on "Add" button
                                          setTimeout(() => {
                                            const addUserBtn = document.getElementById('add-user-btn');
                                            if (addUserBtn) addUserBtn.click();
                                          }, 100);
                                        }}
                                      >
                                        Invite
                                      </button>
                                    )}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          
                          {/* Comment location */}
                          {comment.location && (
                            <button
                              onClick={() => handleCommentClick(comment)}
                              className="mt-2 inline-flex items-center text-xs text-blue-600 hover:text-blue-800"
                            >
                              <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              Go to {comment.location.title}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Replies */}
                    {comment.replies.length > 0 && (
                      <div className="border-t border-gray-100">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="p-3 pl-12 border-b border-gray-100 bg-gray-50">
                            <div className="flex">
                              <div className={`h-8 w-8 rounded-full ${reply.author.color} flex items-center justify-center text-white font-medium text-xs flex-shrink-0`}>
                                {reply.author.initials}
                              </div>
                              <div className="ml-3 flex-1">
                                <div className="flex items-center">
                                  <div className="font-medium text-sm text-gray-900">
                                    {reply.author.name}
                                  </div>
                                  <div className="text-xs text-gray-500 ml-2">
                                    {formatDate(reply.timestamp)}
                                  </div>
                                </div>
                                
                                <div className="mt-1 text-sm text-gray-800">
                                  {reply.text}
                                </div>
                                
                                {/* Reply mentions */}
                                {reply.mentions.length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {reply.mentions.map(email => {
                                      const user = getUserByEmail(email);
                                      return (
                                        <span key={email} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                          @{user ? user.name : email}
                                          {!isExistingUser(email) && (
                                            <button 
                                              className="ml-1 text-blue-600 hover:text-blue-800 text-xs"
                                              onClick={() => {
                                                setNewUserEmail(email);
                                                // Simulate click on "Add" button
                                                setTimeout(() => {
                                                  const addUserBtn = document.getElementById('add-user-btn');
                                                  if (addUserBtn) addUserBtn.click();
                                                }, 100);
                                              }}
                                            >
                                              Invite
                                            </button>
                                          )}
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reply input */}
                    {replyingTo === comment.id ? (
                      <div className="p-3 pl-12 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-xs flex-shrink-0">
                            DH
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="relative">
                              <textarea
                                ref={replyInputRef}
                                value={newReply}
                                onChange={(e) => handleInputChange(e, false, setNewReply)}
                                onKeyDown={(e) => handleInputKeyDown(e, false)}
                                placeholder="Type your reply... Use @ to mention someone"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                rows={2}
                              ></textarea>
                              
                              {/* Mentions dropdown for reply */}
                              {mentionsOpen && !isCommentInput && (
                                <div 
                                  className="absolute z-10 bg-white shadow-lg rounded-md border border-gray-200 max-h-40 overflow-y-auto w-64"
                                  style={{ top: mentionPosition.top, left: mentionPosition.left }}
                                >
                                  {filteredUsers.length > 0 ? (
                                    <ul className="py-1">
                                      {filteredUsers.map(user => (
                                        <li 
                                          key={user.id} 
                                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                          onClick={() => selectMention(user.email)}
                                        >
                                          <div className={`h-6 w-6 rounded-full ${user.color} flex items-center justify-center text-white text-xs mr-2`}>
                                            {user.initials}
                                          </div>
                                          <div className="flex flex-col">
                                            <span className="text-sm">{user.name}</span>
                                            <span className="text-xs text-gray-500">{user.email}</span>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <div className="p-3 flex flex-col">
                                      <div className="text-gray-500 text-sm">No matching users</div>
                                      {mentionFilter.includes('@') && (
                                        <button 
                                          className="mt-2 text-blue-600 text-sm flex items-center"
                                          onClick={() => selectMention(mentionFilter)}
                                        >
                                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                          </svg>
                                          Mention {mentionFilter}
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="mt-2 flex justify-end space-x-2">
                              <button
                                onClick={() => setReplyingTo(null)}
                                className="px-3 py-1 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => postReply(comment.id)}
                                disabled={!newReply.trim()}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setReplyingTo(comment.id);
                            setNewReply("");
                            setSelectedMentions([]);
                            // Focus the reply input after a brief delay
                            setTimeout(() => {
                              replyInputRef.current?.focus();
                            }, 100);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Right column - Team members */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                <p className="mt-1 text-sm text-gray-500">People with access to this project</p>
              </div>
              
              {/* Add people form */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex flex-col space-y-2">
                  <input
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Add people by email"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as "editor" | "viewer")}
                      className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white flex-1"
                    >
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button
                      id="add-user-btn"
                      onClick={addUser}
                      disabled={!newUserEmail.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              
              {/* People list */}
              <ul className="max-h-96 overflow-y-auto">
                {users.length === 0 ? (
                  <li className="p-4 text-center text-gray-500">No team members yet</li>
                ) : (
                  users.map((user) => (
                    <li key={user.id} className="p-4 flex items-center justify-between border-b border-gray-100">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full ${user.color} flex items-center justify-center text-white font-medium text-sm flex-shrink-0`}>
                          {user.initials}
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">{user.name}</span>
                            {user.online && (
                              <span className="ml-2 h-2 w-2 rounded-full bg-green-500" title="Online"></span>
                            )}
                            {user.role === "owner" && (
                              <span className="ml-2 text-xs text-gray-500">(You)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "owner"
                            ? "bg-gray-100 text-gray-800"
                            : user.role === "editor"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </div>
            
            {/* Shareable link */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-md font-medium text-gray-900 mb-2">Share Link</h3>
              <div className="flex flex-col space-y-3">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value="https://yourapp.com/projects/shared/abc123"
                    className="pr-16 w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-800"
                  />
                  <button
                    className="absolute right-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    onClick={() => {
                      navigator.clipboard.writeText("https://yourapp.com/projects/shared/abc123");
                    }}
                  >
                    Copy
                  </button>
                </div>
                <select className="p-2 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white w-full">
                  <option value="viewer">Anyone with link can view</option>
                  <option value="editor">Anyone with link can edit</option>
                  <option value="none">Disable link sharing</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollabTab;