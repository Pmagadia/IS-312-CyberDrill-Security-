import type { ModuleId } from './scoring'

/** One entry per practice module. Used by the navigation, home page and dashboard. */
export interface ModuleInfo {
  id: ModuleId
  name: string
  path: string
  description: string
  owner: string
}

export const MODULES: ModuleInfo[] = [
  {
    id: 'incident-response',
    name: 'Incident Response Simulator',
    path: '/incident-response',
    description: 'Play a security analyst and choose how to respond to a live incident.',
    owner: 'Peterson',
  },
  {
    id: 'port-protocol',
    name: 'Port & Protocol Match',
    path: '/port-protocol',
    description: 'Drag each protocol to its port and learn the secure alternatives.',
    owner: 'Karen',
  },
  {
    id: 'log-analysis',
    name: 'Log Analysis Challenge',
    path: '/log-analysis',
    description: 'Read simulated logs and flag the suspicious activity.',
    owner: 'Roland',
  },
  {
    id: 'link-analyzer',
    name: 'Suspicious Link Analyzer',
    path: '/link-analyzer',
    description: 'Check a web address for common phishing warning signs.',
    owner: 'Hector',
  },
]
