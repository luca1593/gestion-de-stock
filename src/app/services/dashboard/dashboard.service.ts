import { DashboardService as ApiDasboardService } from 'src/gs-api/src/services/dashboard.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardRequest, DashboardResponse } from 'src/gs-api/src/models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private dashboardService: ApiDasboardService) { }

  getDashboardData(dashboardRequest: DashboardRequest): Observable<DashboardResponse> {
    return this.dashboardService.getDasboardData(dashboardRequest);
  }
}
