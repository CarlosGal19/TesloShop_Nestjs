import { Module } from '@nestjs/common';
import { WsGatewayService } from './ws_gateway.service';
import { WsGatewayGateway } from './ws_gateway.gateway';

@Module({
  providers: [WsGatewayGateway, WsGatewayService],
})
export class WsGatewayModule {}
