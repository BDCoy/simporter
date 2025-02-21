export interface Task {
  id: string;
  type: 'data' | 'analysis' | 'visualization' | 'report';
  status: 'pending' | 'running' | 'completed' | 'error';
  title: string;
  description: string;
  progress: number;
  result?: any;
  error?: string;
  startTime?: Date;
  endTime?: Date;
  debug?: {
    startTime: Date;
    endTime?: Date;
    steps: DebugStep[];
    variables: Record<string, any>;
  };
}

export interface DebugStep {
  id: string;
  timestamp: Date;
  action: string;
  progress: number;
  details: Record<string, any>;
}

export interface DebugInfo {
  taskId: string;
  step: DebugStep;
  canModify: boolean;
  variables: Record<string, any>;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'database' | 'file' | 'scraping';
  status: 'pending' | 'loading' | 'ready' | 'error';
  data: any;
  metadata: {
    rowCount?: number;
    lastUpdated?: Date;
    schema?: Record<string, string>;
  };
}

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: any;
}

export interface ReportState {
  tasks: Task[];
  dataSources: DataSource[];
  logs: ExecutionLog[];
  currentStep: number;
  isRunning: boolean;
  canModifyData: boolean;
}