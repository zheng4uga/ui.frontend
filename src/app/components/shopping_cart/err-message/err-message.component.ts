import { Component, Input, OnInit } from '@angular/core';
import { ErrMessageService } from '../../../services/err_message/err-message.service';

interface ModelData {
  errors: object
}
@Component({
  selector: 'app-err-message',
  templateUrl: './err-message.component.html',
  styleUrls: ['./err-message.component.css']
})
export class ErrMessageComponent implements OnInit {
  compOneData: any;
  modalCls = '';
  errData: any;
  @Input() data: ModelData;

  showErrorModal = false;
  @Input() name: string;
  headline: any;
  message: any;
  constructor(private errMessageService: ErrMessageService) { }
  ngOnInit(): void {
    this.errMessageService.sharedData$
      .subscribe(sharedData => {
        this.errMessageService = sharedData;
        if (this.data.errors[sharedData]) {
          this.errData = sharedData;
          this.modalCls = 'show';
          this.headline = this.data.errors[sharedData].headline
          this.message = this.data.errors[sharedData].message
        } else {
          this.modalCls = 'show';
          this.headline = this.data.errors['COM-ERR-500'].headline
          this.message = this.data.errors['COM-ERR-500'].message
        }
      });
  }
  closePopup() {
    this.modalCls = '';
  }
}
