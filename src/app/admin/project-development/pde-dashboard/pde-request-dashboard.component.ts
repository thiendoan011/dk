import { Injector, Component, OnInit } from "@angular/core";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { ChartType } from "chart.js";
import 'chart.piecelabel.js';
import { PDEDashboardServiceProxy, PDE_REQUEST_DASHBOARD_ENTITY } from "@shared/service-proxies/service-proxies";
// Pie Chart
@Component({
    selector: "pde-request-dashboard",
    templateUrl: "./pde-request-dashboard.component.html",
})
export class PDERequestDashboardComponent extends DefaultComponentBase implements OnInit {
    constructor(
        injector: Injector,
        private pdeDashboardService: PDEDashboardServiceProxy
    ) {
        super(injector);
        //this.DB_STATUS_ASSET_PIE_1.dashboarD_CHILDEN = [];
    }
    chart: any;
    filterInput: PDE_REQUEST_DASHBOARD_ENTITY = new PDE_REQUEST_DASHBOARD_ENTITY();

    ngOnInit(): void {
        this.unitFilter();
        this.SetChart01();
        this.SetChart02();
        this.SetChart03();
        this.SetChart04();
        this.SetChart05();
        this.SetChart06();
    }
    unitFilter() {
        /*
        this.DB_STATUS_ASSET_BAR_1.useR_LOGIN = this.appSession.user.userName;
        var db1 = new DB_STATUS_ASSET_PIE();
        db1.year = moment().format("YYYY");
        this.DB_STATUS_ASSET_PIE_1.brancH_ID = "";
        this.DB_STATUS_ASSET_PIE_1.useR_LOGIN = this.appSession.user.userName;
        this.DB_STATUS_ASSET_PIE_1.dashboarD_CHILDEN.push(db1);
        */
    }

//#region Phiếu yêu cầu báo giá
    pieChartData1: number[] = [10, 10, 10, 10];
    pieChartLabels1: any[] = [ "Chưa gửi yêu cầu: ", "Chờ tiếp nhận: ", "Tiếp nhận: ", "Từ chối tiếp nhận: " ];
    pieChartType1: ChartType = "pie"; // loại chart
    pieChartLegend1 = true; // ký hiệu ở dưới pie chart
    pieChartColors1: any[] = [
        { backgroundColor: ["#A0A0A0", "#FFA500", "#008000", "#FF0000"] },
    ];
    pieChartOptions1: any = {
        responsive: true,
        maintainAspectRatio: true,
        pieceLabel: {
            render: function (args) {
                const value = args.value;
                return value;
            },
            fontColor: "#FFFFFF",
        },
        title: {
            display: true,
            text: "Phiếu yêu cầu báo giá",
        },
        legend: {
            position: "bottom",
            align: "start",
            fullWidth: false,
            display: true,
            labels: {
                boxWidth: 10,
                fontFamily: "Gerbera",
                fontStyle: "bold"
            },
        },
    };
    pieChartPlugins1 = [
        {
            afterLayout: function (chart) {
                chart.legend.legendItems.forEach((label) => {
                    let value = chart.data.datasets[0].data[label.index];
                    label.text += " " + value;
                    return label;
                });
            },
        },
    ];
    onClickChart1(event){
        if(event.active[0]._index == 0){
            var window_req = window.open("/app/admin/pde-group-product");
            window_req["reQ_PRICE_REQ_STATUS"] = "E";
        }
        else if(event.active[0]._index == 1){
            var window_req = window.open("/app/admin/pde-req-price");
            window_req["reQ_PRICE_REQ_STATUS"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_req = window.open("/app/admin/pde-req-price");
            window_req["reQ_PRICE_REQ_STATUS"] = "A";
        }
        else if(event.active[0]._index == 3){
            var window_req = window.open("/app/admin/pde-req-price");
            window_req["reQ_PRICE_REQ_STATUS"] = "R";
        }
        else {
            var window_req = window.open("/app/admin/pde-req-price");
            window_req["reQ_PRICE_REQ_STATUS"] = "U";
        }
    }

    SetChart01() {
        //this.pieChartData1 = [0, 10, 3, 6];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "REQ_PRICE";
        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData1[0] = res["Index_0"];
            this.pieChartData1[1] = res["Index_1"];
            this.pieChartData1[2] = res["Index_2"];
            this.pieChartData1[3] = res["Index_3"];

            this.pieChartPlugins1 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }

    onSearchChart01() {
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.brancH_ID = this.appSession.user.subbrId;
        filter.deP_ID = this.appSession.user.deP_ID;
        filter.useR_LOGIN = this.appSession.user.userName;
        filter.frM_DATE_CHART_1 = this.filterInput.frM_DATE_CHART_1;
        filter.tO_DATE_CHART_1 = this.filterInput.tO_DATE_CHART_1;
        filter.typE_DASHBOARD = "REQ_PRICE";

        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData1[0] = res["Index_0"];
            this.pieChartData1[1] = res["Index_1"];
            this.pieChartData1[2] = res["Index_2"];
            this.pieChartData1[3] = res["Index_3"];

            this.pieChartPlugins1 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }
//#endregion Phiếu yêu cầu báo giá

//#region Phiếu yêu cầu làm mẫu
    pieChartData2: number[] = [10, 10, 10, 10];
    pieChartLabels2: any[] = [ "Chưa gửi yêu cầu: ", "Chờ tiếp nhận: ", "Tiếp nhận: ", "Từ chối tiếp nhận: " ];
    pieChartType2: ChartType = "pie";
    pieChartLegend2 = true;
    pieChartColors2: any[] = [
        { backgroundColor: ["#A0A0A0", "#FFA500", "#008000", "#FF0000"] },
    ];
    pieChartOptions2: any = {
        responsive: true,
        maintainAspectRatio: true,
        pieceLabel: {
            render: function (args) {
                const value = args.value;
                return value;
            },
            fontColor: "#FFFFFF",
        },
        title: {
            display: true,
            text: "Phiếu yêu cầu làm mẫu",
        },
        legend: {
            position: "bottom",
            align: "start",
            fullWidth: false,
            display: true,
            labels: {
                boxWidth: 10,
                fontFamily: "Gerbera",
                fontStyle: "bold"
            },
        },
    };
    pieChartPlugins2 = [
        {
            afterLayout: function (chart) {
                chart.legend.legendItems.forEach((label) => {
                    let value = chart.data.datasets[0].data[label.index];
                    label.text += " " + value;
                    return label;
                });
            },
        },
    ];
    onClickChart2(event){
        if(event.active[0]._index == 0){
            var window_req = window.open("/app/admin/pde-group-product");
            window_req["reQ_TEMPLATE_REQ_STATUS"] = "E";
        }
        else if(event.active[0]._index == 1){
            var window_req = window.open("/app/admin/pde-req-template");
            window_req["reQ_TEMPLATE_REQ_STATUS"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_req = window.open("/app/admin/pde-req-template");
            window_req["reQ_TEMPLATE_REQ_STATUS"] = "A";
        }
        else if(event.active[0]._index == 3){
            var window_req = window.open("/app/admin/pde-req-template");
            window_req["reQ_TEMPLATE_REQ_STATUS"] = "R";
        }
        else {
            var window_req = window.open("/app/admin/pde-req-template");
            window_req["reQ_TEMPLATE_REQ_STATUS"] = "U";
        }
    }
    SetChart02() {
        //this.pieChartData2 = [2, 9, 4, 6];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "REQ_TEMPLATE";
        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData2[0] = res["Index_0"];
            this.pieChartData2[1] = res["Index_1"];
            this.pieChartData2[2] = res["Index_2"];
            this.pieChartData2[3] = res["Index_3"];

            this.pieChartPlugins2 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }
    onSearchChart02() {
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.brancH_ID = this.appSession.user.subbrId;
        filter.deP_ID = this.appSession.user.deP_ID;
        filter.useR_LOGIN = this.appSession.user.userName;
        filter.frM_DATE_CHART_2 = this.filterInput.frM_DATE_CHART_2;
        filter.tO_DATE_CHART_2 = this.filterInput.tO_DATE_CHART_2;
        filter.typE_DASHBOARD = "REQ_TEMPLATE";
        
        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData2[0] = res["Index_0"];
            this.pieChartData2[1] = res["Index_1"];
            this.pieChartData2[2] = res["Index_2"];
            this.pieChartData2[3] = res["Index_3"];

            this.pieChartPlugins2 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }
//#endregion Phiếu yêu cầu làm mẫu

//#region Phiếu yêu cầu bảng hardware
    pieChartData3: number[] = [10, 10, 10, 10];
    pieChartLabels3: any[] = [ "Chưa gửi yêu cầu: ", "Chờ tiếp nhận: ", "Tiếp nhận: ", "Từ chối tiếp nhận: " ];
    pieChartType3: ChartType = "pie";
    pieChartLegend3 = true;
    pieChartColors3: any[] = [
        { backgroundColor: ["#A0A0A0", "#FFA500", "#008000", "#FF0000"] },
    ];
    pieChartOptions3: any = {
        responsive: true,
        maintainAspectRatio: true,
        pieceLabel: {
            render: function (args) {
                const value = args.value;
                return value;
            },
            fontColor: "#FFFFFF",
        },
        title: {
            display: true,
            text: "Phiếu yêu cầu bảng hardware",
        },
        legend: {
            position: "bottom",
            align: "start",
            fullWidth: false,
            display: true,
            labels: {
                boxWidth: 10,
                fontFamily: "Gerbera",
                fontStyle: "bold"
            },
        },
    };
    pieChartPlugins3 = [
        {
            afterLayout: function (chart) {
                chart.legend.legendItems.forEach((label) => {
                    let value = chart.data.datasets[0].data[label.index];
                    label.text += " " + value;
                    return label;
                });
            },
        },
    ];
    onClickChart3(event){
        if(event.active[0]._index == 0){
            var window_req = window.open("/app/admin/pde-group-product");
            window_req["reQ_TABLEHARDWARE_REQ_STATUS"] = "E";
        }
        else if(event.active[0]._index == 1){
            var window_req = window.open("/app/admin/pde-req-tablehardware");
            window_req["reQ_TABLEHARDWARE_REQ_STATUS"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_req = window.open("/app/admin/pde-req-tablehardware");
            window_req["reQ_TABLEHARDWARE_REQ_STATUS"] = "A";
        }
        else if(event.active[0]._index == 3){
            var window_req = window.open("/app/admin/pde-req-tablehardware");
            window_req["reQ_TABLEHARDWARE_REQ_STATUS"] = "R";
        }
        else {
            var window_req = window.open("/app/admin/pde-req-tablehardware");
            window_req["reQ_TABLEHARDWARE_REQ_STATUS"] = "U";
        }
    }
    SetChart03() {
        //this.pieChartData3 = [3, 7, 3, 5];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "REQ_TABLEHARDWARE";
        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData3[0] = res["Index_0"];
            this.pieChartData3[1] = res["Index_1"];
            this.pieChartData3[2] = res["Index_2"];
            this.pieChartData3[3] = res["Index_3"];

            this.pieChartPlugins3 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }
    onSearchChart03() {
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.brancH_ID = this.appSession.user.subbrId;
        filter.deP_ID = this.appSession.user.deP_ID;
        filter.useR_LOGIN = this.appSession.user.userName;
        filter.frM_DATE_CHART_3 = this.filterInput.frM_DATE_CHART_3;
        filter.tO_DATE_CHART_3 = this.filterInput.tO_DATE_CHART_3;
        filter.typE_DASHBOARD = "REQ_TABLEHARDWARE";
        
        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData3[0] = res["Index_0"];
            this.pieChartData3[1] = res["Index_1"];
            this.pieChartData3[2] = res["Index_2"];
            this.pieChartData3[3] = res["Index_3"];

            this.pieChartPlugins3 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }
//#endregion Phiếu yêu cầu bảng hardware

//#region Phiếu yêu cầu bảng màu
    pieChartData4: number[] = [10, 10, 10, 10];
    pieChartLabels4: any[] = [ "Chưa gửi yêu cầu: ", "Chờ tiếp nhận: ", "Tiếp nhận: ", "Từ chối tiếp nhận: " ];
    pieChartType4: ChartType = "pie";
    pieChartLegend4 = true;
    pieChartColors4: any[] = [
        { backgroundColor: ["#A0A0A0", "#FFA500", "#008000", "#FF0000"] },
    ];
    pieChartOptions4: any = {
        responsive: true,
        maintainAspectRatio: true,
        pieceLabel: {
            render: function (args) {
                const value = args.value;
                return value;
            },
            fontColor: "#FFFFFF",
        },
        title: {
            display: true,
            text: "Phiếu yêu cầu bảng màu",
        },
        legend: {
            position: "bottom",
            align: "start",
            fullWidth: false,
            display: true,
            labels: {
                boxWidth: 10,
                fontFamily: "Gerbera",
                fontStyle: "bold"
            },
        },
    };
    pieChartPlugins4 = [
        {
            afterLayout: function (chart) {
                chart.legend.legendItems.forEach((label) => {
                    let value = chart.data.datasets[0].data[label.index];
                    label.text += " " + value;
                    return label;
                });
            },
        },
    ];
    onClickChart4(event){
        if(event.active[0]._index == 0){
            var window_req = window.open("/app/admin/pde-group-product");
            window_req["reQ_TABLECOLOR_REQ_STATUS"] = "E";
        }
        else if(event.active[0]._index == 1){
            var window_req = window.open("/app/admin/pde-req-tablecolor");
            window_req["reQ_TABLECOLOR_REQ_STATUS"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_req = window.open("/app/admin/pde-req-tablecolor");
            window_req["reQ_TABLECOLOR_REQ_STATUS"] = "A";
        }
        else if(event.active[0]._index == 3){
            var window_req = window.open("/app/admin/pde-req-tablecolor");
            window_req["reQ_TABLECOLOR_REQ_STATUS"] = "R";
        }
        else {
            var window_req = window.open("/app/admin/pde-req-tablecolor");
            window_req["reQ_TABLECOLOR_REQ_STATUS"] = "U";
        }
    }
    SetChart04() {
        //this.pieChartData4 = [2, 0, 7, 5];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "REQ_TABLECOLOR";
        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData4[0] = res["Index_0"];
            this.pieChartData4[1] = res["Index_1"];
            this.pieChartData4[2] = res["Index_2"];
            this.pieChartData4[3] = res["Index_3"];

            this.pieChartPlugins4 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }
    onSearchChart04() {
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.brancH_ID = this.appSession.user.subbrId;
        filter.deP_ID = this.appSession.user.deP_ID;
        filter.useR_LOGIN = this.appSession.user.userName;
        filter.frM_DATE_CHART_4 = this.filterInput.frM_DATE_CHART_4;
        filter.tO_DATE_CHART_4 = this.filterInput.tO_DATE_CHART_4;
        filter.typE_DASHBOARD = "REQ_TABLECOLOR";
        
        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData4[0] = res["Index_0"];
            this.pieChartData4[1] = res["Index_1"];
            this.pieChartData4[2] = res["Index_2"];
            this.pieChartData4[3] = res["Index_3"];

            this.pieChartPlugins4 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }
//#endregion Phiếu yêu cầu bảng màu

//#region Phiếu yêu cầu mua hardware
    pieChartData5: number[] = [10, 10, 10, 10];
    pieChartLabels5: any[] = [ "Chưa gửi yêu cầu: ", "Chờ tiếp nhận: ", "Tiếp nhận: ", "Từ chối tiếp nhận: " ];
    pieChartType5: ChartType = "pie";
    pieChartLegend5 = true;
    pieChartColors5: any[] = [
        { backgroundColor: ["#A0A0A0", "#FFA500", "#008000", "#FF0000"] },
    ];
    pieChartOptions5: any = {
        responsive: true,
        maintainAspectRatio: true,
        pieceLabel: {
            render: function (args) {
                const value = args.value;
                return value;
            },
            fontColor: "#FFFFFF",
        },
        title: {
            display: true,
            text: "Phiếu yêu cầu mua hardware",
        },
        legend: {
            position: "bottom",
            align: "start",
            fullWidth: false,
            display: true,
            labels: {
                boxWidth: 10,
                fontFamily: "Gerbera",
                fontStyle: "bold"
            },
        },
    };
    pieChartPlugins5 = [
        {
            afterLayout: function (chart) {
                chart.legend.legendItems.forEach((label) => {
                    let value = chart.data.datasets[0].data[label.index];
                    label.text += " " + value;
                    return label;
                });
            },
        },
    ];
    onClickChart5(event){
        if(event.active[0]._index == 0){
            var window_req = window.open("/app/admin/pde-group-product");
            window_req["reQ_HARDWARE_REQ_STATUS"] = "E";
        }
        else if(event.active[0]._index == 1){
            var window_req = window.open("/app/admin/pde-req-hardware");
            window_req["reQ_HARDWARE_REQ_STATUS"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_req = window.open("/app/admin/pde-req-hardware");
            window_req["reQ_HARDWARE_REQ_STATUS"] = "A";
        }
        else if(event.active[0]._index == 3){
            var window_req = window.open("/app/admin/pde-req-hardware");
            window_req["reQ_HARDWARE_REQ_STATUS"] = "R";
        }
        else {
            var window_req = window.open("/app/admin/pde-req-hardware");
            window_req["reQ_HARDWARE_REQ_STATUS"] = "U";
        }
    }
    SetChart05() {
        //this.pieChartData3 = [3, 7, 3, 5];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "REQ_HARDWARE";
        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData5[0] = res["Index_0"];
            this.pieChartData5[1] = res["Index_1"];
            this.pieChartData5[2] = res["Index_2"];
            this.pieChartData5[3] = res["Index_3"];

            this.pieChartPlugins5 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }
    onSearchChart05() {
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.brancH_ID = this.appSession.user.subbrId;
        filter.deP_ID = this.appSession.user.deP_ID;
        filter.useR_LOGIN = this.appSession.user.userName;
        filter.frM_DATE_CHART_5 = this.filterInput.frM_DATE_CHART_5;
        filter.tO_DATE_CHART_5 = this.filterInput.tO_DATE_CHART_5;
        filter.typE_DASHBOARD = "REQ_HARDWARE";
        
        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData5[0] = res["Index_0"];
            this.pieChartData5[1] = res["Index_1"];
            this.pieChartData5[2] = res["Index_2"];
            this.pieChartData5[3] = res["Index_3"];

            this.pieChartPlugins5 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }
//#endregion Phiếu yêu cầu mua hardware

//#region Phiếu yêu cầu chung
    pieChartData6: number[] = [10, 10, 10, 10];
    pieChartLabels6: any[] = [ "Chưa gửi yêu cầu: ", "Chờ tiếp nhận: ", "Tiếp nhận: ", "Từ chối tiếp nhận: " ];
    pieChartType6: ChartType = "pie";
    pieChartLegend6 = true;
    pieChartColors6: any[] = [
        { backgroundColor: ["#A0A0A0", "#FFA500", "#008000", "#FF0000"] },
    ];
    pieChartOptions6: any = {
        responsive: true,
        maintainAspectRatio: true,
        pieceLabel: {
            render: function (args) {
                const value = args.value;
                return value;
            },
            fontColor: "#FFFFFF",
        },
        title: {
            display: true,
            text: "Phiếu yêu cầu chung",
        },
        legend: {
            position: "bottom",
            align: "start",
            fullWidth: false,
            display: true,
            labels: {
                boxWidth: 10,
                fontFamily: "Gerbera",
                fontStyle: "bold"
            },
        },
    };
    pieChartPlugins6 = [
        {
            afterLayout: function (chart) {
                chart.legend.legendItems.forEach((label) => {
                    let value = chart.data.datasets[0].data[label.index];
                    label.text += " " + value;
                    return label;
                });
            },
        },
    ];
    onClickChart6(event){
        if(event.active[0]._index == 0){
            var window_req = window.open("/app/admin/pde-req-normal-create");
            window_req["reQ_NORMAL_REQ_STATUS"] = "E";
        }
        else if(event.active[0]._index == 1){
            var window_req = window.open("/app/admin/pde-req-normal");
            window_req["reQ_NORMAL_REQ_STATUS"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_req = window.open("/app/admin/pde-req-normal");
            window_req["reQ_NORMAL_REQ_STATUS"] = "A";
        }
        else if(event.active[0]._index == 3){
            var window_req = window.open("/app/admin/pde-req-normal");
            window_req["reQ_NORMAL_REQ_STATUS"] = "R";
        }
        else {
            var window_req = window.open("/app/admin/pde-req-normal");
            window_req["reQ_NORMAL_REQ_STATUS"] = "U";
        }
    }
    SetChart06() {
        //this.pieChartData6 = [2, 0, 7, 5];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "REQ_NORMAL";
        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData6[0] = res["Index_0"];
            this.pieChartData6[1] = res["Index_1"];
            this.pieChartData6[2] = res["Index_2"];
            this.pieChartData6[3] = res["Index_3"];

            this.pieChartPlugins6 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }
    onSearchChart06() {
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.brancH_ID = this.appSession.user.subbrId;
        filter.deP_ID = this.appSession.user.deP_ID;
        filter.useR_LOGIN = this.appSession.user.userName;
        filter.frM_DATE_CHART_6 = this.filterInput.frM_DATE_CHART_6;
        filter.tO_DATE_CHART_6 = this.filterInput.tO_DATE_CHART_6;
        filter.typE_DASHBOARD = "REQ_NORMAL";
        
        this.pdeDashboardService.gET_PDE_REQUEST_DASHBOARD(filter).subscribe((res) => {
            this.pieChartData6[0] = res["Index_0"];
            this.pieChartData6[1] = res["Index_1"];
            this.pieChartData6[2] = res["Index_2"];
            this.pieChartData6[3] = res["Index_3"];

            this.pieChartPlugins6 = [
                {
                    afterLayout: function (chart) {
                        chart.legend.legendItems.forEach((label) => {
                            let value = chart.data.datasets[0].data[label.index];
                            label.text += " " + value;
                            return label;
                        });
                    },
                },
            ];
            this.updateView();
        });
    }
//#endregion Phiếu yêu cầu chung



}
