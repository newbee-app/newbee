import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorAlertComponent } from '@newbee/newbee/shared/ui';
import { SlugInputDirectiveModule } from '@newbee/newbee/shared/util';

@Component({
  selector: 'newbee-edit-team',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErrorAlertComponent,
    SlugInputDirectiveModule,
  ],
  templateUrl: './edit-team.component.html',
})
export class EditTeamComponent {}
