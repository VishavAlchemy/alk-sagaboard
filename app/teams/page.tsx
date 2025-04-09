'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useAuth } from "@clerk/nextjs"
import { useRouter } from 'next/navigation'

// Team interface
interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
}

interface Team {
  id: string
  name: string
  description: string
  color: string
  avatar: string
  members: TeamMember[]
  createdAt: string
}

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  senderAvatar: string
  timestamp: string
}

// Helper function to get team border color (reusing from profile page)
const getTeamBorderColor = (color: string) => {
  const colors = {
    // Primary Colors
    red: "border-t-red-500",
    orange: "border-t-orange-500",
    amber: "border-t-amber-500",
    yellow: "border-t-yellow-500",
    lime: "border-t-lime-500",
    green: "border-t-green-500",
    emerald: "border-t-emerald-500",
    teal: "border-t-teal-500",
    cyan: "border-t-cyan-500",
    sky: "border-t-sky-500",
    blue: "border-t-blue-500",
    indigo: "border-t-indigo-500",
    violet: "border-t-violet-500",
    purple: "border-t-purple-500",
    fuchsia: "border-t-fuchsia-500",
    pink: "border-t-pink-500",
    rose: "border-t-rose-500",
    
    // Grayscale
    slate: "border-t-slate-500",
    gray: "border-t-gray-500",
    zinc: "border-t-zinc-500",
    neutral: "border-t-neutral-500",
    stone: "border-t-stone-500"
  };
  return colors[color as keyof typeof colors] || "border-t-gray-500";
};

// Sample data
const sampleTeams: Team[] = [
  {
    id: "1",
    name: "Design Team",
    description: "Frontend and UI/UX design team",
    color: "purple",
    avatar: "/teams/design-team.svg",
    members: [
      { id: "1", name: "Alex Johnson", role: "UI Designer", avatar: "/profilev1/pp.svg" },
      { id: "2", name: "Taylor Swift", role: "UX Researcher", avatar: "/profilev1/pp.svg" }
    ],
    createdAt: "2023-07-15"
  },
  {
    id: "2",
    name: "Development Team",
    description: "Backend and infrastructure team",
    color: "blue",
    avatar: "/teams/dev-team.svg",
    members: [
      { id: "3", name: "Jordan Lee", role: "Backend Developer", avatar: "/profilev1/pp.svg" },
      { id: "4", name: "Morgan Chen", role: "DevOps Engineer", avatar: "/profilev1/pp.svg" }
    ],
    createdAt: "2023-08-22"
  }
];

const sampleMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      content: "Hey team, I've uploaded the new design files",
      senderId: "1",
      senderName: "Alex Johnson",
      senderAvatar: "/profilev1/pp.svg",
      timestamp: "2023-09-10T14:22:00Z"
    },
    {
      id: "m2",
      content: "Thanks! I'll take a look at them now",
      senderId: "2",
      senderName: "Taylor Swift",
      senderAvatar: "/profilev1/pp.svg",
      timestamp: "2023-09-10T14:25:00Z"
    }
  ],
  "2": [
    {
      id: "m3",
      content: "Server deployment complete",
      senderId: "3",
      senderName: "Jordan Lee",
      senderAvatar: "/profilev1/pp.svg",
      timestamp: "2023-09-11T09:15:00Z"
    },
    {
      id: "m4",
      content: "Great job! All tests are passing",
      senderId: "4",
      senderName: "Morgan Chen",
      senderAvatar: "/profilev1/pp.svg",
      timestamp: "2023-09-11T09:17:00Z"
    }
  ]
};

// Chat Message Component
const ChatMessage = ({ message, isOwn }: { message: Message, isOwn: boolean }) => (
  <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
    {!isOwn && (
      <div className="flex-shrink-0 mr-2">
        <Image 
          src={message.senderAvatar}
          alt={message.senderName}
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>
    )}
    <div className={`${isOwn ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-white'} rounded-2xl px-4 py-2 max-w-[70%]`}>
      {!isOwn && <p className="text-xs font-semibold text-gray-300 mb-1">{message.senderName}</p>}
      <p>{message.content}</p>
      <span className="text-xs opacity-70 block text-right">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
    {isOwn && (
      <div className="flex-shrink-0 ml-2">
        <Image 
          src={message.senderAvatar}
          alt={message.senderName}
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>
    )}
  </div>
);

const TeamsPage = () => {
  const { userId, isLoaded: isAuthLoaded } = useAuth();
  const router = useRouter();
  
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '', color: 'blue' });
  const [newMember, setNewMember] = useState({ name: '', role: '' });
  const [newMessage, setNewMessage] = useState('');
  
  // For demo purposes, use the first user ID as the current user
  const currentUserId = userId || "1";
  
  // Show loading state while auth is loading
  if (!isAuthLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  const handleCreateTeam = () => {
    const newTeamObject: Team = {
      id: (teams.length + 1).toString(),
      name: newTeam.name,
      description: newTeam.description,
      color: newTeam.color,
      avatar: "/teams/default-team.svg",
      members: [{ id: currentUserId, name: "You", role: "Team Creator", avatar: "/profilev1/pp.svg" }],
      createdAt: new Date().toISOString()
    };
    
    setTeams([...teams, newTeamObject]);
    setShowCreateModal(false);
    setNewTeam({ name: '', description: '', color: 'blue' });
  };

  const handleAddMember = () => {
    if (!selectedTeam) return;
    
    const updatedMember: TeamMember = {
      id: (selectedTeam.members.length + 5).toString(), // Simple ID generation for demo
      name: newMember.name,
      role: newMember.role,
      avatar: "/profilev1/pp.svg"
    };
    
    const updatedTeam = {
      ...selectedTeam,
      members: [...selectedTeam.members, updatedMember]
    };
    
    setTeams(teams.map(team => team.id === selectedTeam.id ? updatedTeam : team));
    setSelectedTeam(updatedTeam);
    setShowAddMemberModal(false);
    setNewMember({ name: '', role: '' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !newMessage.trim()) return;
    
    const newMessageObj: Message = {
      id: `m${Math.random().toString().substr(2, 8)}`,
      content: newMessage,
      senderId: currentUserId,
      senderName: "You",
      senderAvatar: "/profilev1/pp.svg",
      timestamp: new Date().toISOString()
    };
    
    sampleMessages[selectedTeam.id] = [...(sampleMessages[selectedTeam.id] || []), newMessageObj];
    setNewMessage('');
  };

  return (
    <div className="flex flex-col bg-black min-h-screen text-white py-6">
      <div className="px-4 md:px-6 w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">(Preview) - Coming Soon, for now discord</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-black hover:bg-gray-200 px-5 py-2 rounded text-sm"
          >
            Create Team
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Teams List (2/5 width) */}
          <div className="md:col-span-2 bg-black rounded-lg p-4">
            <h2 className="text-2xl font-semibold mb-4">Your Teams</h2>
            
            <div className="space-y-3">
              {teams.map((team) => (
                <div 
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`cursor-pointer border border-gray-700 p-3 rounded-lg transition-colors hover:bg-gray-900 border-t-2 ${getTeamBorderColor(team.color)} ${
                    selectedTeam?.id === team.id ? 'bg-gray-900' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-lg font-bold">{team.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{team.name}</h3>
                      <p className="text-sm text-gray-400">{team.members.length} members</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {teams.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p>You don't have any teams yet.</p>
                  <p>Create a team to get started!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Team Details and Chat (3/5 width) */}
          <div className="md:col-span-3 bg-black rounded-lg border border-gray-800">
            {selectedTeam ? (
              <div className="flex flex-col h-full">
                {/* Team Header */}
                <div className={`p-4 border-b border-gray-800 border-t-2 ${getTeamBorderColor(selectedTeam.color)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-lg font-bold">{selectedTeam.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{selectedTeam.name}</h2>
                        <p className="text-sm text-gray-400">{selectedTeam.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddMemberModal(true)}
                      className="bg-gray-800 text-white hover:bg-gray-700 px-3 py-1 rounded text-sm"
                    >
                      Add Member
                    </button>
                  </div>
                  
                  {/* Team Members */}
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">MEMBERS</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTeam.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-2 bg-gray-800 rounded-full pl-1 pr-3 py-1">
                          <Image 
                            src={member.avatar}
                            alt={member.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <span className="text-sm">{member.name}</span>
                          <span className="text-xs text-gray-400">({member.role})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Team Chat */}
                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">TEAM CHAT</h3>
                  
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4 py-2">
                    {(sampleMessages[selectedTeam.id] || []).map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isOwn={message.senderId === currentUserId}
                      />
                    ))}
                    
                    {(!sampleMessages[selectedTeam.id] || sampleMessages[selectedTeam.id].length === 0) && (
                      <div className="text-center py-8 text-gray-400">
                        <p>No messages yet.</p>
                        <p>Start the conversation!</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="mt-auto">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:border-gray-500"
                      />
                      <button
                        type="submit"
                        className="bg-white text-black px-5 py-2 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-400">
                <div className="text-center">
                  <p className="mb-2">Select a team to view details and chat</p>
                  <p>or create a new team to get started.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Team</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-gray-500"
                  placeholder="Enter team name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-gray-500 resize-none"
                  placeholder="Enter team description"
                  rows={3}
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Team Color</label>
                <select
                  value={newTeam.color}
                  onChange={(e) => setNewTeam({...newTeam, color: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-gray-500"
                >
                  <option value="red">Red</option>
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="purple">Purple</option>
                  <option value="yellow">Yellow</option>
                  <option value="pink">Pink</option>
                  <option value="indigo">Indigo</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!newTeam.name}
                className={`px-4 py-2 rounded-md transition-colors ${
                  newTeam.name ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-gray-500"
                  placeholder="Enter member name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                <input
                  type="text"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-gray-500"
                  placeholder="Enter member role"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMember}
                disabled={!newMember.name || !newMember.role}
                className={`px-4 py-2 rounded-md transition-colors ${
                  newMember.name && newMember.role ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamsPage
