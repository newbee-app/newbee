import { Portal } from '@angular/cdk/portal';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { v4 } from 'uuid';

/**
 * A global service for keeping track of portals, for use with tooltips and dropdowns.
 * This is necessary to avoid the phenomenon of tooltips and dropdowns getting clipped by parent elements.
 */
@Injectable({ providedIn: 'root' })
export class PortalService implements OnDestroy {
  /**
   * The inner map to keep track of all of the elements (wrapped as a portal) to move up to the app component's template.
   */
  private _portals = new Map<string, Portal<unknown>>();

  /**
   * The Subject that emits the current value of `_portals` whenever it's changed, so that the app component can subscribe to it.
   */
  portals$ = new Subject<Portal<unknown>[]>();

  /**
   * The method that UI components should call to add portals.
   *
   * @param portal The portal to add to the service.
   *
   * @returns The auto-generated ID for the portal.
   */
  addPortal(portal: Portal<unknown>): string {
    let id = v4();
    if (this._portals.has(id)) {
      id = v4();
    }

    this._portals.set(id, portal);
    this.portals$.next([...this._portals.values()]);
    return id;
  }

  /**
   * The method that UI components should call to delete portals.
   *
   * @param id The unique ID of the portal to delete.
   */
  deletePortal(id: string): void {
    const didDelete = this._portals.delete(id);
    if (didDelete) {
      this.portals$.next([...this._portals.values()]);
    }
  }

  /**
   * Complete all infinite observables.
   */
  ngOnDestroy(): void {
    this.portals$.complete();
  }
}
