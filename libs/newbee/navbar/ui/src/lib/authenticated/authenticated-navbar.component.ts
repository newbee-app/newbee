import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouteKeyword } from '@newbee/newbee/navbar/util';
import { SearchableSelectComponent } from '@newbee/newbee/shared/ui';
import { SelectOption } from '@newbee/newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'newbee-authenticated-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchableSelectComponent],
  templateUrl: './authenticated-navbar.component.html',
})
export class AuthenticatedNavbarComponent implements OnInit, OnDestroy {
  @Input() userDisplayName!: string;

  @Input() organizations!: SelectOption<string>[];

  @Input() selectedOrganization!: SelectOption<string>;

  @Output() selectedOrganizationChange = new EventEmitter<
    SelectOption<string>
  >();

  @Output() navigateToLink = new EventEmitter<RouteKeyword>();

  @Output() logout = new EventEmitter<void>();

  organizationSelect = new FormControl('');

  readonly routeKeyword = RouteKeyword;

  private readonly unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.organizationSelect.setValue(this.selectedOrganization.value, {
      emitEvent: false,
    });

    this.organizationSelect.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (value) => {
          const selectedOrganization = this.organizations.find(
            (option) => option.value === value
          );
          if (!selectedOrganization) {
            return;
          }

          this.selectedOrganizationChange.emit(selectedOrganization);
        },
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  emitNavigateToLink(route: RouteKeyword): void {
    this.navigateToLink.emit(route);
  }

  emitLogout(): void {
    this.logout.emit();
  }
}
