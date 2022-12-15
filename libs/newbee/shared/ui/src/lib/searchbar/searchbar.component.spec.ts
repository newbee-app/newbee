import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchbarComponent } from './searchbar.component';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;

  const testSearchTerm = 'search';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule],
      declarations: [SearchbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;

    jest.spyOn(component.search, 'emit');
    fixture.detectChanges();
  });

  it('should be defined', () => {
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
  });

  describe('search', () => {
    it('should emit when the searchbar value canges', () => {
      component.searchbar.setValue(testSearchTerm);
      expect(component.search.emit).toBeCalledTimes(1);
      expect(component.search.emit).toBeCalledWith(testSearchTerm);
    });
  });

  describe('clear', () => {
    it('should clear the searchbar', () => {
      component.searchbar.setValue(testSearchTerm);
      expect(component.searchbar.value).toEqual(testSearchTerm);
      component.clear();
      expect(component.searchbar.value).toEqual('');
    });
  });
});
