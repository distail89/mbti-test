import { serverInfoService } from './services/serverInfoService';
import { handleListOfferingsAction } from './actions/listOfferingsAction';

/**
 * 애플리케이션 엔트리 포인트
 */
async function main() {
  console.log('[info] Application starting...');

  try {
    // 서버 정보 초기화
    await serverInfoService.initialize();

    // 서버 정보 확인
    const serverInfo = serverInfoService.getServerInfo();
    if (serverInfo) {
      console.log('[info] Server info:', {
        id: serverInfo.id,
        name: serverInfo.name,
        host: serverInfo.host,
        port: serverInfo.port,
      });
    }

    // ListOfferings 액션 예시 실행
    // 실제 구현에서는 이벤트 리스너나 API 엔드포인트를 통해 호출됩니다.
    try {
      const offerings = await handleListOfferingsAction();
      console.log('[info] Offerings:', offerings);
    } catch (error) {
      console.error('[error] Failed to handle ListOfferings action:', error);
    }

    // 주기적으로 ListOfferings 액션을 실행하는 예시 (실제로는 필요에 따라)
    // setInterval(async () => {
    //   try {
    //     await handleListOfferingsAction();
    //   } catch (error) {
    //     // 오류 처리
    //   }
    // }, 8000);

  } catch (error) {
    console.error('[error] Application error:', error);
    process.exit(1);
  }
}

// 애플리케이션 실행
if (require.main === module) {
  main().catch((error) => {
    console.error('[error] Unhandled error:', error);
    process.exit(1);
  });
}

export { main };














