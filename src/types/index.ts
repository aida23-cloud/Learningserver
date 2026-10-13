export type DistroType = 'debian' | 'ubuntu' | 'both';

export interface LabStep {
  id: string;
  stepNumber: number;
  title: string;
  distro: DistroType;
  description: string;
  conceptNote?: string;
  command?: string;
  expectedOutput?: string;
  explanation: string;
  warningNote?: string;
  configFilePath?: string;
  configFileContent?: string;
}

export interface LabModule {
  id: string;
  moduleNumber: number;
  title: string;
  shortDesc: string;
  category: 'persiapan' | 'jaringan' | 'instalasi' | 'layanan' | 'testing';
  estimatedMinutes: number;
  difficulty: 'Pemula' | 'Menengah';
  steps: LabStep[];
}

export interface DistroComparisonItem {
  feature: string;
  category: string;
  ubuntu: {
    title: string;
    description: string;
    codeSnippet?: string;
  };
  debian: {
    title: string;
    description: string;
    codeSnippet?: string;
  };
  keyTakeaway: string;
}

export interface TroubleshootingItem {
  id: string;
  category: 'network' | 'vmware' | 'service' | 'permission' | 'syntax';
  title: string;
  symptoms: string[];
  cause: string;
  distro: DistroType;
  solutionSteps: string[];
  quickFixCommand?: string;
  verificationCommand: string;
}

export interface TerminalOutputItem {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'info';
  text: string;
  prompt?: string;
}
