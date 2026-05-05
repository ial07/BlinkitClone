import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Blinkit Clone API — Frequently Bought Together';
  }
}
