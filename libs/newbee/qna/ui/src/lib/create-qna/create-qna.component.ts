import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'newbee-create-qna',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-qna.component.html',
})
export class CreateQnaComponent {}
