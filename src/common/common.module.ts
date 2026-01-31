import { Module } from '@nestjs/common';
import { BcryptAdapter } from './adapters/bcrypt.adapter';

@Module({
  providers: [{ provide: 'IHashAdapter', useClass: BcryptAdapter }],
  exports: ['IHashAdapter'],
})
export class CommonModule {}
