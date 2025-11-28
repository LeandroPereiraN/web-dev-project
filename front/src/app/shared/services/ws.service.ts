import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WsService {
  private authService = inject(AuthService);
  private ws?: WebSocket;

  shouldDashboardReload = signal({
    sellerId: -1,
    reload: false,
  });

  shouldServiceReload = signal({
    serviceId: -1,
    reload: false,
  });

  connected = signal(false);

  connect(user_id?: number) {
    this.ws = new WebSocket(environment.wsUrl + (user_id ? `?user_id=${user_id}` : ''));
    this.ws.onopen = () => {
      this.connected.set(true);
    };

    this.ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      console.log('WS Message:', msg);

      if (msg.data) {
        switch (msg.data.type) {
          case 'SERVICE_UPDATED':
            const serviceId = msg.data.id;

            this.shouldServiceReload.set({
              serviceId,
              reload: true,
            });
            break;
          case 'NEW_CONTACT':
            const sellerId = msg.data.id;

            this.shouldDashboardReload.set({
              sellerId,
              reload: true,
            });
        }
      }
    };

    this.ws.onerror = (error) => {
      console.error('WS Error:', error);
    };
  }

  disconnect() {
    if (this.connected()) {
      this.ws?.close(1000, 'Cliente cerró la conexión');
    }
  }
}
