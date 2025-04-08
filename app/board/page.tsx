import React from 'react';

// Define TypeScript interfaces for data structures
interface Bounty {
  id: string;
  icon: '❓' | '🔥' | '💡'; // Placeholder icons
  text: string;
  builders?: string;
  reward?: string;
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
      { id: 'b1', icon: '❓', text: 'User Feedback Asked', builders: '(10) Digital Builders' },
      { id: 'b2', icon: '🔥', text: 'Build AI Integration', builders: '(10) Digital Builders' },
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
      id: 'network-skool',
      iconColor: 'bg-gray-700', // Using gray as a placeholder, adjust if needed
      iconInitial: 'N',
      name: 'Network Skool',
      description: 'A place for digital network state builders',
      tag: { text: 'Digital ecosystem', bgColor: 'bg-gray-600', textColor: 'text-white' },
      bounties: [
          { id: 'b1', icon: '❓', text: 'Create Hackathon', builders: '(1-3 builders)' },
          { id: 'b2', icon: '❓', text: 'Create NS Wiki', builders: '(1-3 builders)' },
          { id: 'b3', icon: '❓', text: 'Host Build Session', builders: '(1-3 builders)' },
      ],
  },
  {
      id: 'sagacity',
      iconColor: 'bg-teal-500', // Placeholder color
      iconInitial: 'S',
      name: 'SagaCity',
      description: 'Building a better internet infrastructure',
      tag: { text: 'Digital ecosystem', bgColor: 'bg-gray-600', textColor: 'text-white' }, // Reusing tag style
      bounties: [
          { id: 'b1', icon: '❓', text: 'Create Board', builders: '(1-3 builders)', reward: '$1500 SAGA' },
          { id: 'b2', icon: '❓', text: 'Create Reward System', builders: '(1-3 builders)', reward: '$2500 SAGA' },
          { id: 'b3', icon: '❓', text: 'Implement PM', builders: '(1-3 builders)', reward: '$2500 SAGA' },
      ],
  },
  {
      id: 'omi',
      iconColor: 'bg-gray-300', // Placeholder color
      iconInitial: 'O',
      name: 'Omi',
      description: 'Your Digital AI Necklace',
      tag: { text: 'Startup', bgColor: 'bg-yellow-400', textColor: 'text-black' }, // Reusing tag style
      bounties: [
          { id: 'b1', icon: '❓', text: 'Improve CR', builders: '(10) Digital Builders', reward: '$2000 USD' },
          { id: 'b2', icon: '🔥', text: 'Build IOS App', builders: '(10) Digital Builders', reward: '$4500 USD' },
          { id: 'b3', icon: '🔥', text: 'AI Integrations?', builders: '(1-3 builders)' }, // Added a missing bounty for structure
      ],
  },
  {
      id: 'goose',
      iconColor: 'bg-black',
      iconInitial: 'G',
      name: 'Goose',
      description: 'AI Agents Deployed',
      tag: { text: 'AI Open Source', bgColor: 'bg-gray-700', textColor: 'text-white' },
      bounties: [
          { id: 'b1', icon: '❓', text: 'Get User Feedback', builders: '(1-3 builders)', reward: '$1500 USD' },
          { id: 'b2', icon: '❓', text: 'Improve SMS System', builders: '(1-3 builders)', reward: '$2500 USD' },
          { id: 'b3', icon: '🔥', text: 'AI Integrations?', builders: '(1-3 builders)', reward: '$2500 USD' },
      ],
  },
  {
      id: 'gmarket',
      iconColor: 'bg-green-600',
      iconInitial: 'G',
      name: 'GMarket',
      description: 'A marketplace that is crypto native',
      tag: { text: 'Digital ecosystem', bgColor: 'bg-gray-600', textColor: 'text-white' }, // Reusing tag style
      bounties: [
          { id: 'b1', icon: '❓', text: 'Get 10 listings', builders: '(1-3 builders)', reward: '$1500 YCN' },
          { id: 'b2', icon: '❓', text: 'Recruit team members', builders: '(1-3 builders)', reward: '$2500 YCN' },
          { id: 'b3', icon: '❓', text: 'Integrate Stripe Pay', builders: '(1-3 builders)', reward: '$2500 YCN' },
      ],
  },
  {
      id: 'gumroad',
      iconColor: 'bg-pink-500',
      iconInitial: 'G',
      name: 'Gumroad',
      description: 'A marketplace for digital creators to sell',
      tag: { text: 'Digital marketplace', bgColor: 'bg-pink-300', textColor: 'text-black' },
      bounties: [
          { id: 'b1', icon: '❓', text: 'Migrate to Stripe Payment Element', builders: '(1-3 builders)', reward: '$1500 USD' },
          { id: 'b2', icon: '❓', text: 'Add video reviews', builders: '(1-3 builders)', reward: '$1500 USD' },
          { id: 'b3', icon: '❓', text: 'Implement PM', builders: '(1-3 builders)', reward: '$2500 SAGA' }, // Using SAGA from image
      ],
  },
   // Add more projects here to fill rows if needed...
   // Example placeholder to potentially reach 10 items for 2 full rows of 5
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
];


const BoardPage = () => {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <h1 className="text-4xl font-bold mb-2">Board</h1>
      <p className="text-gray-400 mb-8">
        From the intergalactic computer network. <br />
        Enter bounties, grok, GTD, earn equity or cash, gain XP & skills (to join team visit @Space)
      </p>

      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* Map over the project data */}
        {projectsData.map((project) => (
          <div key={project.id} className="bg-[#1C1C1E] rounded-lg p-4 flex flex-col space-y-4 border border-gray-700">
            {/* Header section */}
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full ${project.iconColor} flex items-center justify-center text-black font-bold text-sm`}>
                {/* In a real app, replace this with an actual Icon component or img tag */}
                {project.iconInitial}
              </div>
              <h2 className="font-semibold text-lg">{project.name}</h2>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm">{project.description}</p>

            {/* Tag */}
            <div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.tag.bgColor} ${project.tag.textColor}`}>
                {project.tag.text}
              </span>
            </div>

            {/* Bounties section */}
            <div className="flex flex-col space-y-3 pt-2">
              {project.bounties.map((bounty) => (
                <div key={bounty.id} className="flex items-center justify-between text-sm bg-[#2C2C2E] p-2 rounded">
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
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardPage;
