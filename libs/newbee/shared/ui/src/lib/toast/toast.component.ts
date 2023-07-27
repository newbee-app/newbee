import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'newbee-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
})
export class ToastComponent {}
