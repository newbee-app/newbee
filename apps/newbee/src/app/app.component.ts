import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Message } from '@newbee/api-interfaces';

@Component({
  selector: 'newbee-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');
  constructor(private http: HttpClient) {}
}
