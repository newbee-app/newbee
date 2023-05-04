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
import { SearchableSelectComponent } from '@newbee/newbee/shared/ui';
import { RouteKeyword, SelectOption } from '@newbee/newbee/shared/util';
import { Subject, takeUntil } from 'rxjs';

/**
 * The authenticated version of the navbar.
 */
@Component({
  selector: 'newbee-authenticated-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchableSelectComponent],
  templateUrl: './authenticated-navbar.component.html',
})
export class AuthenticatedNavbarComponent implements OnInit, OnDestroy {
  /**
   * The display name of the logged in user.
   */
  @Input() userDisplayName!: string;

  /**
   * The organizations of the logged in user, as select options.
   */
  @Input() organizations!: SelectOption<string>[];

  /**
   * The selected organization of the logged in user.
   */
  @Input() selectedOrganization: SelectOption<string> | null = null;

  /**
   * An event emitter that tells the parent component when the selected organization has been changed.
   */
  @Output() selectedOrganizationChange =
    new EventEmitter<SelectOption<string> | null>();

  /**
   * An event emitter that tells the parent component when a request has been made to navigate to a link.
   */
  @Output() navigateToLink = new EventEmitter<RouteKeyword>();

  /**
   * An event emitter that tells the parent component when a logout request has been made.
   */
  @Output() logout = new EventEmitter<void>();

  /**
   * The form control representing the select for the organization.
   */
  readonly organizationSelect = new FormControl('');

  /**
   * All of the keywords that represent routes.
   */
  readonly routeKeyword = RouteKeyword;

  /**
   * A subject to unsubscribe from all infinite observables.
   */
  private readonly unsubscribe$ = new Subject<void>();

  /**
   * Sets the organization select to match the `selectedOrganization` input.
   * Sets up the form control so that any changes to it are outputted using the `selectedOrganizationChange` output.
   */
  ngOnInit(): void {
    if (this.selectedOrganization) {
      this.organizationSelect.setValue(this.selectedOrganization.value, {
        emitEvent: false,
      });
    }

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

          this.selectedOrganization = selectedOrganization;
          this.selectedOrganizationChange.emit(selectedOrganization);
        },
      });
  }

  /**
   * Unsubscribe from all infinite observables.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Calls `navigateToLink.emit()` using the given route.
   *
   * @param route The route to navigate to.
   */
  emitNavigateToLink(route: RouteKeyword): void {
    this.navigateToLink.emit(route);
  }

  /**
   * Calls `logout.emit()`.
   */
  emitLogout(): void {
    this.logout.emit();
  }
}
