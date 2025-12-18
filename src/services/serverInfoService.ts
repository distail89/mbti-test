import { ServerInfo } from '../types/server';

/**
 * 서버 정보를 관리하는 서비스
 * 서버 정보를 메모리에 저장하고 조회할 수 있는 기능 제공
 */
class ServerInfoService {
  private serverInfo: ServerInfo | null = null;
  private storageKey = 'server-info';
  private initialized = false;

  /**
   * 서버 정보를 초기화합니다.
   * 실제 구현에서는 환경 변수, 설정 파일, 또는 데이터베이스에서 로드할 수 있습니다.
   */
  async initialize(): Promise<void> {
    // 이미 초기화되어 있고 서버 정보가 있으면 건너뛰기
    if (this.initialized && this.serverInfo !== null) {
      console.log('[info] Server info already initialized');
      return;
    }

    console.log('[info] Initializing server info...');
    
    try {
      // TODO: 실제 구현에서는 환경 변수나 설정 파일에서 로드
      // 예시: 환경 변수에서 로드
      const serverInfoFromEnv = this.loadFromEnvironment();
      
      if (serverInfoFromEnv) {
        this.serverInfo = serverInfoFromEnv;
        this.initialized = true;
        console.log('[info] Server info loaded from environment');
        return;
      }

      // 로컬 스토리지나 파일에서 로드 시도
      const storedInfo = this.loadFromStorage();
      if (storedInfo) {
        this.serverInfo = storedInfo;
        this.initialized = true;
        console.log('[info] Server info loaded from storage');
        return;
      }

      // 기본값 설정 (개발용) - 항상 기본값을 설정하여 초기화 보장
      const defaultInfo = this.getDefaultServerInfo();
      this.serverInfo = defaultInfo;
      this.initialized = true;
      console.log('[info] Server info initialized with default values:', {
        id: defaultInfo.id,
        host: defaultInfo.host,
        port: defaultInfo.port,
      });
    } catch (error) {
      console.error('[error] Failed to initialize server info:', error);
      // 오류 발생 시에도 기본값으로 초기화하여 애플리케이션이 계속 실행되도록 함
      try {
        const defaultInfo = this.getDefaultServerInfo();
        this.serverInfo = defaultInfo;
        this.initialized = true;
        console.log('[info] Server info initialized with default values after error:', {
          id: defaultInfo.id,
          host: defaultInfo.host,
          port: defaultInfo.port,
        });
      } catch (fallbackError) {
        console.error('[error] Failed to initialize with default values:', fallbackError);
        this.initialized = false;
        this.serverInfo = null;
        throw new Error('Failed to initialize server info');
      }
    }
  }

  /**
   * 서버 정보를 가져옵니다.
   */
  getServerInfo(): ServerInfo | null {
    return this.serverInfo;
  }

  /**
   * 서버 정보가 저장되어 있는지 확인합니다.
   */
  isServerStored(): boolean {
    return this.serverInfo !== null && this.initialized;
  }

  /**
   * 서버 정보를 설정합니다.
   */
  setServerInfo(serverInfo: ServerInfo): void {
    this.serverInfo = serverInfo;
    this.initialized = true; // initialized 플래그도 설정
    this.saveToStorage(serverInfo);
    console.log('[info] Server info updated:', {
      id: serverInfo.id,
      host: serverInfo.host,
      port: serverInfo.port,
    });
  }

  /**
   * 환경 변수에서 서버 정보를 로드합니다.
   */
  private loadFromEnvironment(): ServerInfo | null {
    const host = process.env.SERVER_HOST;
    const port = process.env.SERVER_PORT;
    const protocol = process.env.SERVER_PROTOCOL as 'http' | 'https' | undefined;

    if (!host || !port) {
      return null;
    }

    return {
      id: process.env.SERVER_ID || 'default-server',
      name: process.env.SERVER_NAME || 'Default Server',
      host,
      port: parseInt(port, 10),
      protocol: protocol || 'http',
      status: 'active',
    };
  }

  /**
   * 스토리지에서 서버 정보를 로드합니다.
   * 실제 구현에서는 파일 시스템, 데이터베이스, 또는 다른 스토리지를 사용할 수 있습니다.
   */
  private loadFromStorage(): ServerInfo | null {
    // TODO: 실제 스토리지 구현
    // 예: 파일 시스템
    // try {
    //   const data = fs.readFileSync('server-info.json', 'utf-8');
    //   return JSON.parse(data);
    // } catch {
    //   return null;
    // }
    return null;
  }

  /**
   * 서버 정보를 스토리지에 저장합니다.
   */
  private saveToStorage(serverInfo: ServerInfo): void {
    // TODO: 실제 스토리지 구현
    // 예: 파일 시스템
    // fs.writeFileSync('server-info.json', JSON.stringify(serverInfo, null, 2));
  }

  /**
   * 기본 서버 정보를 반환합니다.
   */
  private getDefaultServerInfo(): ServerInfo {
    return {
      id: 'default-server',
      name: 'Default Server',
      host: 'localhost',
      port: 3000,
      protocol: 'http',
      status: 'active',
    };
  }

  /**
   * 서버 정보를 초기화합니다 (테스트용).
   */
  reset(): void {
    this.serverInfo = null;
    this.initialized = false;
  }
}

// 싱글톤 인스턴스 내보내기
export const serverInfoService = new ServerInfoService();














