import { NgModule,ModuleWithProviders  } from '@angular/core';
import { SocketService } from './socket.service';
@NgModule({
})
export class SocketModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SocketModule,
      providers: [ SocketService]
    }
  }
}