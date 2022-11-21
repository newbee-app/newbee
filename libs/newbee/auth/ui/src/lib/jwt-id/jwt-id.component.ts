import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { BaseFormComponentModule } from '../base-form';

@Component({
  selector: 'newbee-jwt-id',
  templateUrl: './jwt-id.component.html',
})
export class JwtIdComponent {
  @Input() jwtId!: string;
  @Input() email!: string;
  @Output() resendLink = new EventEmitter<string>();

  emitResendLink(email: string): void {
    this.resendLink.emit(email);
  }
}

@NgModule({
  imports: [CommonModule, BaseFormComponentModule],
  declarations: [JwtIdComponent],
  exports: [JwtIdComponent],
})
export class JwtIdComponentModule {}
