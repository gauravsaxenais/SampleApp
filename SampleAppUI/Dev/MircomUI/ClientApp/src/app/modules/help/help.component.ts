/**
 * Import dependencies
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { version } from '../../../../package.json';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})

/**
 * Create help component
 */
export class HelpComponent implements OnInit {

  /**
   * variables declaration
   */
  callFromMonitoring: boolean;
  version: any;
  constructor(private router: Router) { }

  /**
   * OnInit - set variables of version and callFromMonitoring in initialize method
   */
  ngOnInit() {
    this.version = version;
    if (this.router.url.indexOf('monitoring') > 0) {
      this.callFromMonitoring = true;
    }
  }

}
