import { serverInfoService } from '../services/serverInfoService';
import { Offering, ServerInfo } from '../types/server';

/**
 * ListOfferings 액션을 처리합니다.
 * 서버 정보가 필요한 경우, 먼저 서버 정보가 있는지 확인하고 없으면 초기화를 시도합니다.
 */
export async function handleListOfferingsAction(): Promise<Offering[]> {
  // 서버 정보가 저장되어 있는지 확인
  let serverStored = serverInfoService.isServerStored();
  console.log(`[info] Handling ListOfferings action, server stored: ${serverStored}`);

  // 서버 정보가 없으면 초기화 시도
  if (!serverStored) {
    console.log('[info] Server info not found, attempting to initialize...');
    try {
      await serverInfoService.initialize();
      // 초기화 후 다시 확인
      serverStored = serverInfoService.isServerStored();
      console.log(`[info] After initialization, server stored: ${serverStored}`);
      
      // 초기화 후에도 서버 정보가 없으면 강제로 기본값 설정
      let serverInfo = serverInfoService.getServerInfo();
      if (!serverInfo || !serverStored) {
        console.log('[info] Server info still not available, setting default values...');
        const defaultInfo = {
          id: 'default-server',
          name: 'Default Server',
          host: 'localhost',
          port: 3000,
          protocol: 'http' as const,
          status: 'active' as const,
        };
        serverInfoService.setServerInfo(defaultInfo);
        serverInfo = defaultInfo;
        serverStored = true;
        console.log('[info] Default server info set successfully');
      }
    } catch (error) {
      console.error('[error] Failed to initialize server info:', error);
      // 오류가 발생해도 기본값으로 설정
      const defaultInfo = {
        id: 'default-server',
        name: 'Default Server',
        host: 'localhost',
        port: 3000,
        protocol: 'http' as const,
        status: 'active' as const,
      };
      serverInfoService.setServerInfo(defaultInfo);
      serverStored = true;
      console.log('[info] Set default server info after initialization error');
    }
  }

  // 서버 정보 가져오기
  const serverInfo = serverInfoService.getServerInfo();
  if (!serverInfo) {
    // 최후의 수단: 기본값 직접 사용
    console.warn('[warn] No server info found, using fallback default values');
    const fallbackInfo = {
      id: 'default-server',
      name: 'Default Server',
      host: 'localhost',
      port: 3000,
      protocol: 'http' as const,
      status: 'active' as const,
    };
    // fallback 정보를 사용하되, 서비스에도 저장
    serverInfoService.setServerInfo(fallbackInfo);
    return getOfferingsWithServerInfo(fallbackInfo);
  }

  return getOfferingsWithServerInfo(serverInfo);
}

/**
 * 서버 정보를 사용하여 offerings 목록을 반환합니다.
 */
function getOfferingsWithServerInfo(serverInfo: ServerInfo): Offering[] {
  // TODO: 실제 구현에서는 서버에서 offerings 목록을 가져옵니다.
  // 예: API 호출
  // const response = await fetch(`${serverInfo.protocol}://${serverInfo.host}:${serverInfo.port}/api/offerings`);
  // const offerings = await response.json();

  // 임시 데이터 반환
  const offerings: Offering[] = [
    {
      id: 'offering-1',
      name: 'Sample Offering 1',
      description: 'This is a sample offering',
      type: 'basic',
      serverId: serverInfo.id,
    },
    {
      id: 'offering-2',
      name: 'Sample Offering 2',
      description: 'This is another sample offering',
      type: 'premium',
      serverId: serverInfo.id,
    },
  ];

  console.log(`[info] ListOfferings action completed, found ${offerings.length} offerings`);
  return offerings;
}














