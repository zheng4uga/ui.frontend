import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingStorageService } from 'src/app/services/storage/shopping-storage.service';
import { OrderReviewComponent } from './order-review.component';

describe('OrderReviewComponent', () => {
  let component: OrderReviewComponent;
  let fixture: ComponentFixture<OrderReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderReviewComponent ],
      providers:[ShoppingStorageService],
      imports:[HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
