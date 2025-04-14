'use client';

import React from 'react';

// Define TypeScript interfaces for data structures
interface Bounty {
  id: string;
  icon: string; // Allow any string/emoji for icon
  text: string;
  builders?: string;
  reward?: string;
  details?: {
    description: string;
    expectations: string[];
    checklist: {id: string; text: string; completed: boolean}[];
  };
}

interface Project {
  id: string;
  iconColor: string; // Color for the placeholder icon background
  iconInitial: string; // Initial letter for the icon
  name: string;
  description: string;
  tag: {
    text: string;
    bgColor: string; // Specific background color for the tag
    textColor: string; // Specific text color for the tag
  };
  bounties: Bounty[];
}

// Dummy data matching the structure
const projectsData: Project[] = [
  {
    id: 'oris',
    iconColor: 'bg-yellow-500',
    iconInitial: 'O',
    name: 'Oris',
    description: 'Building a better way to timeblock (hybrid)',
    tag: { text: 'Startup', bgColor: 'bg-yellow-400', textColor: 'text-black' },
    bounties: [
      { 
        id: 'b1', 
        icon: '❓', 
        text: 'User Feedback Asked', 
        builders: '(10) Digital Builders',
        details: {
          description: 'We need to gather user feedback on our current prototype to improve our product.',
          expectations: ['Interview at least 10 users', 'Document feedback in a structured manner', 'Identify key pain points'],
          checklist: [
            {id: 'c1', text: 'Create user interview script', completed: false},
            {id: 'c2', text: 'Schedule interviews', completed: false},
            {id: 'c3', text: 'Compile findings', completed: false}
          ]
        }
      },
      { 
        id: 'b2', 
        icon: '🔥', 
        text: 'Build AI Integration', 
        builders: '(10) Digital Builders',
        details: {
          description: 'Integrate AI capabilities into our timeblocking feature.',
          expectations: ['Implement smart scheduling algorithm', 'Add ML-based time prediction', 'Create user-friendly AI controls'],
          checklist: [
            {id: 'c1', text: 'Research AI solutions', completed: false},
            {id: 'c2', text: 'Create API specifications', completed: false},
            {id: 'c3', text: 'Build prototype', completed: false}
          ]
        }
      },
      { id: 'b3', icon: '❓', text: 'Create MVP', builders: '(10) Digital Builders' },
    ],
  },
  {
    id: 'pamgm',
    iconColor: 'bg-blue-500',
    iconInitial: 'P',
    name: 'PamGM',
    description: 'Clothing Apparel Manufacturer',
    tag: { text: 'Apparel Manufacturer', bgColor: 'bg-blue-400', textColor: 'text-white' },
    bounties: [
      { id: 'b1', icon: '❓', text: 'Update Landing Page', builders: '(1-3 builders)', reward: '$1500 CAD' },
      { id: 'b2', icon: '❓', text: 'Improve SMS System', builders: '(1-3 builders)', reward: '$100 CAD' },
      { id: 'b3', icon: '🔥', text: 'AI Integrations?', builders: '(1-3 builders)' },
    ],
  },
  {
      id: 'sagacity',
      iconColor: 'bg-teal-500',
      iconInitial: 'S',
      name: 'SagaCity',
      description: 'Building a better internet infrastructure',
      tag: { text: 'Digital ecosystem', bgColor: 'bg-gray-600', textColor: 'text-white' },
      bounties: [
          { id: 'b1', icon: '❓', text: 'Create Board', builders: '(1-3 builders)', reward: '$1500 SAGA' },
          { id: 'b2', icon: '❓', text: 'Create Reward System', builders: '(1-3 builders)', reward: '$2500 SAGA' },
          { id: 'b3', icon: '❓', text: 'Implement PM', builders: '(1-3 builders)', reward: '$2500 SAGA' },
      ],
  },
  {
      id: 'omi',
      iconColor: 'bg-gray-300',
      iconInitial: 'O',
      name: 'Omi',
      description: 'Your Digital AI Necklace',
      tag: { text: 'Startup', bgColor: 'bg-yellow-400', textColor: 'text-black' },
      bounties: [
          { id: 'b1', icon: '❓', text: 'Improve CR', builders: '(10) Digital Builders', reward: '$2000 USD' },
          { id: 'b2', icon: '🔥', text: 'Build IOS App', builders: '(10) Digital Builders', reward: '$4500 USD' },
          { id: 'b3', icon: '🔥', text: 'AI Integrations?', builders: '(1-3 builders)' },
      ],
  },
  {
      id: 'gmarket',
      iconColor: 'bg-green-600',
      iconInitial: 'G',
      name: 'GMarket',
      description: 'A marketplace that is crypto native',
      tag: { text: 'Digital ecosystem', bgColor: 'bg-gray-600', textColor: 'text-white' },
      bounties: [
          { id: 'b1', icon: '❓', text: 'Get 10 listings', builders: '(1-3 builders)', reward: '$1500 YCN' },
          { id: 'b2', icon: '❓', text: 'Recruit team members', builders: '(1-3 builders)', reward: '$2500 YCN' },
          { id: 'b3', icon: '❓', text: 'Integrate Stripe Pay', builders: '(1-3 builders)', reward: '$2500 YCN' },
      ],
  },
  {
    id: 'placeholder1',
    iconColor: 'bg-purple-500',
    iconInitial: 'P',
    name: 'Placeholder 1',
    description: 'Description for placeholder project',
    tag: { text: 'Testing', bgColor: 'bg-purple-300', textColor: 'text-black' },
    bounties: [
      { id: 'b1', icon: '💡', text: 'Placeholder Bounty 1' },
      { id: 'b2', icon: '💡', text: 'Placeholder Bounty 2' },
    ],
  },
  {
    id: 'placeholder2',
    iconColor: 'bg-indigo-500',
    iconInitial: 'P',
    name: 'Placeholder 2',
    description: 'Another placeholder description',
    tag: { text: 'Example', bgColor: 'bg-indigo-300', textColor: 'text-black' },
    bounties: [
      { id: 'b1', icon: '💡', text: 'Example Bounty' },
    ],
  },
].filter(project => !['network-skool', 'gumroad', 'goose', 'js7ab633pye8k2g9987e53kdwh7dpd9a', 'js78mxz4163s6gbnxa4xtgnzcn7dq0dn', 'js789ftfb2cx06han5b87vh1197dpfr2'].includes(project.id));


const BoardPage = () => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedBounty, setSelectedBounty] = React.useState<{projectId: string, bountyId: string} | null>(null);

  const handleBountyClick = (projectId: string, bountyId: string) => {
    setSelectedBounty({projectId, bountyId});
  };

  const closeBountyDetails = () => {
    setSelectedBounty(null);
  };

  const selectedProject = selectedBounty ? projectsData.find(p => p.id === selectedBounty.projectId) : null;
  const selectedBountyDetails = selectedProject?.bounties.find(b => b.id === selectedBounty?.bountyId);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 md:p-8 font-sans">
      <div className="mx-auto">
        {/* Header and controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Board</h1>
            <p className="text-gray-400">
              From the intergalactic computer network. <br />
              Enter bounties, grok, GTD, earn equity or cash, gain XP & skills (to join team visit @Space)
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
            <button 
              className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition"
            >
              Add Organization
            </button>
            
            <div className="flex space-x-1 bg-gray-900 p-1 rounded-md">
              <button 
                className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {projectsData.map((project) => (
              <div key={project.id} className="bg-black rounded-lg p-4 flex flex-col space-y-4 border border-gray-800 hover:border-gray-700 transition-colors">
                {/* Header section */}
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${project.iconColor} flex items-center justify-center text-black font-bold text-sm`}>
                    {project.iconInitial}
                  </div>
                  <h2 className="font-semibold text-lg">{project.name}</h2>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm">{project.description}</p>

                {/* Tag */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.tag.bgColor} ${project.tag.textColor}`}>
                    {project.tag.text}
                  </span>
                  
                  {/* <button className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800 transition">
                    + Add Task
                  </button> */}
                </div>

                {/* Bounties section */}
                <div className="flex flex-col space-y-3 pt-2">
                  {project.bounties.map((bounty) => (
                    <button 
                      key={bounty.id} 
                      className="flex items-center justify-between text-sm bg-gray-900 p-2 rounded hover:bg-gray-800 transition text-left w-full"
                      onClick={() => handleBountyClick(project.id, bounty.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{bounty.icon}</span>
                        <div>
                          <p className="text-gray-200">{bounty.text}</p>
                          {bounty.builders && <p className="text-gray-500 text-xs">{bounty.builders}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {bounty.reward && <span className="text-gray-400 text-xs font-mono">{bounty.reward}</span>}
                        <span className="text-gray-500">{'>'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List view
          <div className="space-y-4">
            {projectsData.map((project) => (
              <div key={project.id} className="bg-black rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${project.iconColor} flex items-center justify-center text-black font-bold text-sm`}>
                      {project.iconInitial}
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">{project.name}</h2>
                      <p className="text-gray-300 text-sm">{project.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.tag.bgColor} ${project.tag.textColor}`}>
                      {project.tag.text}
                    </span>
                    <button className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-gray-800 transition">
                      + Add Task
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {project.bounties.map((bounty) => (
                    <button 
                      key={bounty.id} 
                      className="flex items-center justify-between w-full text-sm bg-gray-900 p-3 rounded hover:bg-gray-800 transition text-left"
                      onClick={() => handleBountyClick(project.id, bounty.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{bounty.icon}</span>
                        <div>
                          <p className="text-gray-200">{bounty.text}</p>
                          {bounty.builders && <p className="text-gray-500 text-xs">{bounty.builders}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {bounty.reward && <span className="text-gray-400 text-xs font-mono">{bounty.reward}</span>}
                        <span className="text-gray-500">{'>'}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bounty Detail Modal */}
        {selectedBounty && selectedBountyDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedBountyDetails.icon}</span>
                    <h3 className="text-xl font-bold">{selectedBountyDetails.text}</h3>
                  </div>
                  <button 
                    onClick={closeBountyDetails}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedBountyDetails.details ? (
                    <>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Description</h4>
                        <p className="text-gray-300">{selectedBountyDetails.details.description}</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-2">Expectations</h4>
                        <ul className="list-disc pl-5 text-gray-300 space-y-1">
                          {selectedBountyDetails.details.expectations.map((exp, i) => (
                            <li key={i}>{exp}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold mb-2">Checklist</h4>
                        <div className="space-y-2">
                          {selectedBountyDetails.details.checklist.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2 text-gray-300">
                              <input 
                                type="checkbox" 
                                id={item.id} 
                                checked={item.completed} 
                                className="h-4 w-4 rounded border-gray-700 text-blue-600 focus:ring-blue-500"
                                readOnly
                              />
                              <label htmlFor={item.id}>{item.text}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400">No detailed information available for this task.</p>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-sm text-gray-400">Builders: {selectedBountyDetails.builders || "Not specified"}</p>
                      {selectedBountyDetails.reward && (
                        <p className="text-sm text-gray-400">Reward: <span className="font-mono">{selectedBountyDetails.reward}</span></p>
                      )}
                    </div>
                    <button className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition">
                      Apply for Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardPage;
