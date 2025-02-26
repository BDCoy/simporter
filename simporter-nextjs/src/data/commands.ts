// src/data/commands.ts

export interface CommandPrompt {
    command: string;
    description: string;
    placeholder?: string;
  }
  
  export interface CommandCategory {
    id: string;
    name: string;
    color: string;
    commands: CommandPrompt[];
  }
  
  export const commandCategories: CommandCategory[] = [
    {
      id: "key-drivers",
      name: "Key Drivers Analysis",
      color: "blue",
      commands: [
        {
          command: "/KPI",
          description: "What motivates consumers to choose {placeholder}?",
          placeholder: "plant-based foods"
        },
        {
          command: "/Switch",
          description: "Why are customers switching to {placeholder}?",
          placeholder: "subscription services"
        },
        {
          command: "/Loyalty",
          description: "Which factors drive brand loyalty in the {placeholder}?",
          placeholder: "beauty industry"
        }
      ]
    },
    {
      id: "brand-awareness",
      name: "Brand Awareness Measurement",
      color: "green",
      commands: [
        {
          command: "/Recognition",
          description: "How well do consumers recognize our {placeholder}?",
          placeholder: "logo and packaging"
        },
        {
          command: "/Recall",
          description: "What percentage of shoppers recall our {placeholder}?",
          placeholder: "recent ad campaign"
        },
        {
          command: "/Compare",
          description: "How does our brand reputation compare to {placeholder}?",
          placeholder: "competitors"
        }
      ]
    },
    {
      id: "journey-mapping",
      name: "Consumer Journey Mapping",
      color: "purple",
      commands: [
        {
          command: "/Discovery",
          description: "How do consumers discover new {placeholder}?",
          placeholder: "skincare products"
        },
        {
          command: "/Decision",
          description: "What touchpoints influence {placeholder} decisions?",
          placeholder: "car-buying"
        },
        {
          command: "/Dropoff",
          description: "Where do online shoppers drop off during {placeholder}?",
          placeholder: "checkout"
        }
      ]
    },
    {
      id: "voc",
      name: "Voice of the Customer (VoC)",
      color: "red",
      commands: [
        {
          command: "/Complaints",
          description: "What complaints do users have about our {placeholder}?",
          placeholder: "app"
        },
        {
          command: "/Experience",
          description: "How do customers describe their ideal {placeholder}?",
          placeholder: "shopping experience"
        },
        {
          command: "/Requests",
          description: "What product features are customers requesting most often in {placeholder}?",
          placeholder: "category"
        }
      ]
    },
    {
      id: "trends",
      name: "Cultural Trend Monitoring",
      color: "yellow",
      commands: [
        {
          command: "/Sustainability",
          description: "How are attitudes toward {placeholder} evolving?",
          placeholder: "sustainability"
        },
        {
          command: "/GenZ",
          description: "What {placeholder} trends are gaining traction with Gen Z?",
          placeholder: "wellness"
        },
        {
          command: "/Remote",
          description: "How is remote work impacting {placeholder} spending?",
          placeholder: "home improvement"
        }
      ]
    },
    {
      id: "segmentation",
      name: "Segmentation",
      color: "indigo",
      commands: [
        {
          command: "/Users",
          description: "Who are the heavy users of {placeholder}?",
          placeholder: "energy drinks"
        },
        {
          command: "/Demographics",
          description: "How do suburban vs. urban customers differ in {placeholder}?",
          placeholder: "grocery shopping"
        },
        {
          command: "/Interest",
          description: "Which demographics are most interested in {placeholder}?",
          placeholder: "electric vehicles"
        }
      ]
    },
    {
      id: "feature-testing",
      name: "Feature Testing",
      color: "pink",
      commands: [
        {
          command: "/Usage",
          description: "Would customers use a {placeholder}?",
          placeholder: "voice-activated coffee machine"
        },
        {
          command: "/Preference",
          description: "Do users prefer a {placeholder} in cars?",
          placeholder: "touch screen or physical buttons"
        },
        {
          command: "/Priority",
          description: "How important is {placeholder} for water filters?",
          placeholder: "automatic refilling"
        }
      ]
    },
    {
      id: "package-testing",
      name: "Package Testing",
      color: "amber",
      commands: [
        {
          command: "/Usability",
          description: "Do customers find the new {placeholder} easier to open?",
          placeholder: "cereal box"
        },
        {
          command: "/Design",
          description: "Which {placeholder} is most ergonomic for athletes?",
          placeholder: "bottle shape"
        },
        {
          command: "/Sustainable",
          description: "How does {placeholder} influence purchase decisions?",
          placeholder: "sustainable packaging"
        }
      ]
    },
    {
      id: "price-testing",
      name: "Price Testing",
      color: "emerald",
      commands: [
        {
          command: "/Willingness",
          description: "How much are consumers willing to pay for {placeholder}?",
          placeholder: "plant-based burgers"
        },
        {
          command: "/Premium",
          description: "Would a premium version of our {placeholder} be appealing?",
          placeholder: "subscription service"
        },
        {
          command: "/Threshold",
          description: "What is the price threshold where demand drops off for {placeholder}?",
          placeholder: "fitness trackers"
        }
      ]
    },
    {
      id: "message-testing",
      name: "Message Testing",
      color: "cyan",
      commands: [
        {
          command: "/Slogan",
          description: "Which slogan resonates most with {placeholder}?",
          placeholder: "eco-conscious consumers"
        },
        {
          command: "/Engagement",
          description: "Does {placeholder} improve engagement with our social media ads?",
          placeholder: "humor"
        },
        {
          command: "/Click",
          description: "Which headline drives more clicks for {placeholder}?",
          placeholder: "online retailers"
        }
      ]
    }
  ];
  
  // Helper function to get all commands as a flat array
  export const getAllCommands = (): CommandPrompt[] => {
    return commandCategories.flatMap(category => category.commands);
  };
  
  // Helper function to get a specific command by its command string
  export const getCommandByName = (commandName: string): CommandPrompt | undefined => {
    return getAllCommands().find(cmd => cmd.command === commandName);
  };