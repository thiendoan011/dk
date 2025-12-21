import { AfterViewInit, Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import * as _ from 'lodash';
import { ListComponentBase } from '@app/ultilities/list-component-base';
import { PrimengTableHelper } from '@shared/helpers/PrimengTableHelper';

enum ReportType {
    Week,
    Month,
    NextWeek
}

@Component({
    templateUrl: './host-dashboard.component.html',
    styleUrls: ['./host-dashboard.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class HostDashboardComponent extends ListComponentBase<any> implements AfterViewInit {


    primengTableHelperAssetNormal: PrimengTableHelper;
    primengTableHelperAssetDamage: PrimengTableHelper;

    ReportType = ReportType;

    reportType: ReportType;

    constructor(
        injector: Injector,
    ) {
        super(injector);
        
    }

    reloadAssetNormal() {

    }

    reloadAssetDamage() {

    }


    reloadStatistic() {

    }

    ngAfterViewInit(): void {
       
    }

    initAssTypeChart() {
    }

    initStackVerticalChart() {
    }

    weekStatistic() {
    }
    monthStatistic() {
    }
    nextWeekStatistic() {
    }


    getDashboardStatisticsData(): void {
    }


}
