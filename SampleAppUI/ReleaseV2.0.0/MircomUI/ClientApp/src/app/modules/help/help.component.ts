import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  callFromMonitoring: boolean;

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.router.url.indexOf('monitoring') > 0) {
      this.callFromMonitoring = true;
    }
    console.log(this.callFromMonitoring);
  }

}
