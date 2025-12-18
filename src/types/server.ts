/**
 * 서버 정보 타입 정의
 */
export interface ServerInfo {
  id: string;
  name: string;
  host: string;
  port: number;
  protocol: 'http' | 'https';
  status?: 'active' | 'inactive';
  metadata?: Record<string, unknown>;
}

/**
 * Offering 정보 타입 정의
 */
export interface Offering {
  id: string;
  name: string;
  description?: string;
  type: string;
  serverId?: string;
  metadata?: Record<string, unknown>;
}














