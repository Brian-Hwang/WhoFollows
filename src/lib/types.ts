// All TypeScript interfaces for the WhoFollows app

export interface CastMember {
  id: string;              // kebab-case, e.g., "seong-baekhyun"
  nameKo: string;          // Korean name: 성백현
  nameEn: string;          // English: Seong Baek-hyun
  instagram: string;       // handle without @: baekhyun_s
  occupation: string;      // in Korean
  age: number;
  gender: 'M' | 'F';
  color: string;           // hex color for node
  initial: string;         // Korean initial for node display (first char of nameKo)
  profileImage?: string;   // path to profile image in /public, e.g., "/profiles/seong-baekhyun.jpg"
}

export interface Relationship {
  source: string;          // cast member id
  target: string;          // cast member id
  type: 'ex-couple' | 'final-couple' | 'confirmed-couple' | 'not-together';
  label?: string;          // optional label like "8년 연애"
}

export interface Follow {
  source: string;          // follower id
  target: string;          // followed id
}

export interface ShowData {
  id: string;
  nameKo: string;
  nameEn: string;
  network: string;
  episodes: number;
  airDateStart: string;
  airDateEnd: string;
  cast: CastMember[];
  relationships: Relationship[];
  follows: Follow[];
}

// ForceGraph types
export interface GraphNode {
  id: string;
  nameKo: string;
  nameEn: string;
  instagram: string;
  occupation: string;
  age: number;
  gender: 'M' | 'F';
  color: string;
  initial: string;
  val: number;             // node size
  profileImage?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'follow' | 'mutual-follow' | 'ex-couple' | 'final-couple' | 'confirmed-couple' | 'not-together';
  color: string;
  width: number;
  dashed: boolean;
  label?: string;
  curvature?: number;      // for parallel edges between same nodes
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
