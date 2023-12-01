import { TestBed } from '@angular/core/testing';
import {
  initialHttpState,
  initialOrganizationState,
} from '@newbee/newbee/shared/data-access';
import { testHttpScreenError1 } from '@newbee/newbee/shared/util';
import { Keyword, testOrganizationRelation1 } from '@newbee/shared/util';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { hot } from 'jest-marbles';
import { selectOrgAndScreenError } from './organization.selector';

describe('OrganizationSelector', () => {
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
    });

    store = TestBed.inject(MockStore);
  });

  describe('selectOrgAndScreenError', () => {
    it('should select org and screen error', () => {
      store.setState({
        [Keyword.Organization]: {
          ...initialOrganizationState,
          selectedOrganization: testOrganizationRelation1,
        },
        [Keyword.Http]: {
          ...initialHttpState,
          screenError: testHttpScreenError1,
        },
      });
      const expected$ = hot('a', {
        a: {
          selectedOrganization: testOrganizationRelation1,
          screenError: testHttpScreenError1,
        },
      });
      expect(store.select(selectOrgAndScreenError)).toBeObservable(expected$);
    });
  });
});
