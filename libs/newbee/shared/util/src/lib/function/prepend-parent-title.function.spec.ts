import { ActivatedRouteSnapshot } from '@angular/router';
import { createMock } from '@golevelup/ts-jest';
import { prependParentTitle } from './prepend-parent-title.function';

describe('prependParentTitle', () => {
  it(`should prepend if there's no error in the parent`, () => {
    const route = createMock<ActivatedRouteSnapshot>({
      parent: createMock<ActivatedRouteSnapshot>({
        title: 'Parent',
      }),
    });
    expect(prependParentTitle(route, 'Child')).toEqual('Child - Parent');
  });

  it(`should not prepend if there's an error in the parent`, () => {
    const route = createMock<ActivatedRouteSnapshot>({
      parent: createMock<ActivatedRouteSnapshot>({
        title: 'Error',
      }),
    });
    expect(prependParentTitle(route, 'Child')).toEqual('Error');
  });
});
