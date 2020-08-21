/**
 * Import dependencies
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localStorage.service';

@Component({
  selector: 'app-monitoring-left-panel',
  templateUrl: './monitoring-left-panel.component.html',
  styleUrls: ['./monitoring-left-panel.component.css']
})
export class MonitoringLeftPanelComponent implements OnInit {

  userName: string;
  constructor(private router: Router, private local: LocalStorageService) { }

  ngOnInit() {
    this.userName = this.local.getUser();
  }
}
