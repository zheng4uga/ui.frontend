import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {

  title = 'Confirmation Dialog';
  message = 'Are you shore?';
  btnCancelText = 'Cancel';
  btnOkText = 'Ok';
  constructor() { }
  @Output() ok = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  ngOnInit() {
  }

  decline() {
    this.cancel.emit();
  }

  accept() {
    this.ok.emit();
  }

}