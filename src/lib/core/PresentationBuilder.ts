import { marked } from 'marked';
import { v4 as uuidv4 } from 'uuid';

export interface Slide {
  id: string;
  title: string;
  content: string;
  notes?: string;
  layout: 'title' | 'content' | 'twoColumn' | 'comparison' | 'chart';
  elements: SlideElement[];
}

export interface SlideElement {
  type: 'text' | 'chart' | 'table' | 'image';
  content: any;
}

class PresentationBuilder {
  private slides: Slide[] = [];

  generateFromOutline(content: string): Slide[] {
    // Split content into sections based on headers
    const sections = content.split(/(?=^#\s)/m);
    
    return sections.map(section => {
      const [title, ...contentParts] = section.split('\n');
      const content = contentParts.join('\n');
      
      return {
        id: uuidv4(),
        title: title.replace(/^#\s+/, ''),
        content: marked.parse(content.trim()),
        layout: 'content',
        elements: [{
          type: 'text',
          content: marked.parse(content.trim())
        }]
      };
    }).filter(slide => slide.content.trim() !== '');
  }
}

export const presentationBuilder = new PresentationBuilder();