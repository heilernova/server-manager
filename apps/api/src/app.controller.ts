import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@api/common/config/config.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly _config: ConfigService) {}

  @Get()
  getHello() {
    return {
      name: 'Server manager by Novah.dev',
      version: this._config.version,
      env: this._config.nodeEnv,
      panel: 'https://smpanel.novah.dev',
      urls: [
        'https://www.novah.dev',
        'https://smpanel.novah.dev'
      ]
    }
  }
}
