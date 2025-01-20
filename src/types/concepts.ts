export interface Attribute {
    name: string;
    impact: "good" | "ok" | "bad";
  }
  
  export interface Concept {
    id: number;
    title: string;
    description: string;
    attributes: Attribute[];
    aiScore: number;
  }
  