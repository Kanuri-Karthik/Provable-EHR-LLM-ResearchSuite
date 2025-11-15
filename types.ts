

import React from 'react';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  Icon: React.ElementType;
  description: string;
  component: React.ComponentType;
}

export interface ProvenanceResult {
    summary: string;
    provenance: { text: string; source: string }[];
}

export interface ValidationResult {
    passed: boolean;
    message: string;
}

export interface SavedSummary {
  id: string;
  timestamp: number;
  ehrData: string;
  result: ProvenanceResult;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}