import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-monitoring-layout',
  templateUrl: './monitoring-layout.component.html',
  styleUrls: ['./monitoring-layout.component.css']
})
export class MonitoringLayoutComponent implements OnInit {

  isDisableLeftPanelDashboard: boolean;
  isDisableLeftPanelDashboardOnCamera: boolean;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.currentboolMessage.subscribe(message => {
      this.isDisableLeftPanelDashboard = message;
    });
  }

}
