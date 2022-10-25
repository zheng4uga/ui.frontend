import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingStorageService } from 'src/app/services/storage/shopping-storage.service';

import { ProductListViewComponent } from './product-list-view.component';

describe('ProductListViewComponent', () => {
  let component: ProductListViewComponent;
  let fixture: ComponentFixture<ProductListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductListViewComponent ],
      providers:[ShoppingStorageService],
      imports:[HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListViewComponent);
    component = fixture.componentInstance;
    component.cartItems = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
