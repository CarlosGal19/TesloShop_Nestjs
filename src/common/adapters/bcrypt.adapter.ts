import { Injectable } from '@nestjs/common';
import { IHashAdapter } from '../interfaces/hash-adapter.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptAdapter implements IHashAdapter {
  private readonly salt: number = 10;

  public async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.salt);
  }

  public async compare(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
