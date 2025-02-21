import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export interface Project {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  status: 'active' | 'archived';
  category: 'Category Analysis' | 'Innovation' | 'Trends' | 'Consumer Profile' | 'Competitive Landscape' | 'Product Concept';
  settings: {
    metadata: {
      query: string;
      aiDiscovery?: boolean;
      command?: string;
      category?: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export async function createProjectFromSearch(
  query: string,
  aiDiscovery: boolean = false
): Promise<Project> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Authentication required');
    }

    // Determine project category based on command
    const command = query.startsWith('/') ? query.split(' ')[0] : null;
    let category: Project['category'] = 'Category Analysis'; // default

    switch (command) {
      case '/category':
        category = 'Category Analysis';
        break;
      case '/innovation':
        category = 'Innovation';
        break;
      case '/trends':
        category = 'Trends';
        break;
      case '/profile':
        category = 'Consumer Profile';
        break;
      case '/landscape':
        category = 'Competitive Landscape';
        break;
      case '/concept':
        category = 'Product Concept';
        break;
    }

    // Create project name from query
    const name = query.startsWith('/')
      ? query.split(' ').slice(1).join(' ') // Remove command
      : query;

    // TEMPORARY: Return mock project instead of creating in Supabase
    const mockProject: Project = {
      id: crypto.randomUUID(),
      name: name || 'Untitled Project',
      description: `Analysis generated from query: ${query}`,
      owner_id: user.id,
      status: 'active',
      category,
      settings: {
        metadata: {
          query,
          aiDiscovery,
          command,
          category
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return mockProject;

    /* COMMENTED OUT: Supabase project creation
    // Create project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name: name || 'Untitled Project',
        description: `Analysis generated from query: ${query}`,
        owner_id: user.id,
        status: 'active',
        category,
        settings: {
          metadata: {
            query,
            aiDiscovery,
            command,
            category
          }
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }

    if (!project) {
      throw new Error('No project data returned');
    }

    return project as Project;
    */

  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Authentication required') {
        throw error; // Re-throw auth errors
      }
      console.error('Error creating project:', error);
      throw new Error('Failed to create project');
    }
    throw error;
  }
}