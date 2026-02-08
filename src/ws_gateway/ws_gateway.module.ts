import { Module } from '@nestjs/common';
import { WsGatewayService } from './ws_gateway.service';
import { WsGatewayGateway } from './ws_gateway.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [WsGatewayGateway, WsGatewayService],
  imports: [AuthModule],
})
export class WsGatewayModule {}
