import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-advanceorderltc',
  templateUrl: './advanceorderltc.component.html',
  styleUrls: ['./advanceorderltc.component.css']
})
export class AdvanceorderltcComponent {

  @Input() drawerClose: any;
  radioValue='LTC';
}
