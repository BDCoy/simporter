import React from 'react';
import { useStore } from './lib/store';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { WelcomePage } from './pages/WelcomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { MyProjectsPage } from './pages/MyProjectsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { SettingsPage } from './pages/SettingsPage';
import { TeamPage } from './pages/TeamPage';
import { TokenUsagePage } from './pages/TokenUsagePage';
import { ContentLibrary } from './pages/ContentLibrary';
import { ConceptTestPage } from './pages/ConceptTestPage';
import { ApiPage } from './pages/ApiPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { CustomFeaturePage } from './pages/CustomFeaturePage';
import { Walkthrough } from './components/Walkthrough';

import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import { set } from 'zod';


function App() {
  const { currentView, hasSeenWalkthrough } = useStore();
  const [user, setUser] = React.useState<User | null>(null);

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomePage user={user} />;
      case 'home':
        return <HomePage />;
      case 'projects':
        return <ProjectsPage />;
      case 'my-projects':
        return <MyProjectsPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'team':
        return <TeamPage />;
      case 'settings':
        return <SettingsPage user={user}/>;
      case 'token-usage':
        return <TokenUsagePage />;
      case 'library':
        return <ContentLibrary />;
      case 'concept-test':
        return <ConceptTestPage />;
      case 'api':
        return <ApiPage />;
      case 'knowledge-base':
        return <KnowledgeBasePage />;
      case 'custom-feature':
        return <CustomFeaturePage />;
      default:
        return <WelcomePage user={user} />;
    }
  };

  React.useEffect(() => {
      const fetchUser = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            // No user session, proceed without user
            setUser(null);
        } else {
          setUser(data.user);
        }
      };
  
      fetchUser();
    }, []);

  return (
    <>
      {!hasSeenWalkthrough && <Walkthrough />}
      <Layout user={user} setUser={setUser}>
        {renderView()}
      </Layout>
    </>
  );
}

export default App;