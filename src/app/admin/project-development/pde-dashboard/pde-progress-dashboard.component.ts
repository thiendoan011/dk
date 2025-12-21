import { Injector, Component, OnInit } from "@angular/core";
import { DefaultComponentBase } from "@app/ultilities/default-component-base";
import { ChartType } from "chart.js";
import 'chart.piecelabel.js';
import { PDEDashboardServiceProxy, PDE_REQUEST_DASHBOARD_ENTITY } from "@shared/service-proxies/service-proxies";
// Pie Chart
@Component({
    selector: "pde-progress-dashboard",
    templateUrl: "./pde-progress-dashboard.component.html",
})
export class PDEProgressDashboardComponent extends DefaultComponentBase implements OnInit {
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

//#region Tiến độ báo giá
    pieChartData1: number[] = [10, 10, 10, 10];
    pieChartLabels1: any[] = ["Hoàn thành: ", "Chưa gửi triển khai", "Đã gửi triển khai, chưa xác nhận", "Đã xác nhận"];
    pieChartType1: ChartType = "pie"; // loại chart
    pieChartLegend1 = true; // ký hiệu ở dưới pie chart
    pieChartColors1: any[] = [
        { backgroundColor: ["#008000", "#A0A0A0", "#FFA500", "#1B00FF"] },
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
            text: "Tiến độ báo giá",
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
            var window_progress = window.open("/app/admin/pde-req-price");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_PRICE_STATUS"] = "A";
            window_progress["reQ_PRICE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_PRICE_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else if(event.active[0]._index == 1){
            var window_progress = window.open("/app/admin/pde-req-price");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_PRICE_STATUS"] = "U";
            window_progress["reQ_PRICE_PROGRESS_EXPECT_MAKER_ID"] = "U";
            window_progress["reQ_PRICE_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_progress = window.open("/app/admin/pde-req-price");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_PRICE_STATUS"] = "U";
            window_progress["reQ_PRICE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_PRICE_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 3){
            var window_progress = window.open("/app/admin/pde-req-price");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_PRICE_STATUS"] = "U";
            window_progress["reQ_PRICE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_PRICE_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else {
            var window_progress = window.open("/app/admin/pde-req-price");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_PRICE_STATUS"] = "";
            window_progress["reQ_PRICE_PROGRESS_EXPECT_MAKER_ID"] = "";
            window_progress["reQ_PRICE_PROGRESS_EXACT_MAKER_ID"] = "";
        }
    }

    SetChart01() {
        //this.pieChartData1 = [3, 6];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "PROGRESS_PRICE";
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
        filter.typE_DASHBOARD = "PROGRESS_PRICE";

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
//#endregion Tiến độ báo giá

//#region Tiến độ làm mẫu
    pieChartData2: number[] = [10, 10, 10, 10];
    pieChartLabels2: any[] = ["Hoàn thành: ", "Chưa gửi triển khai", "Đã gửi triển khai, chưa xác nhận", "Đã xác nhận"];
    pieChartType2: ChartType = "pie";
    pieChartLegend2 = true;
    pieChartColors2: any[] = [
        { backgroundColor: ["#008000", "#A0A0A0", "#FFA500", "#1B00FF"] },
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
            text: "Tiến độ làm mẫu",
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
            var window_progress = window.open("/app/admin/pde-req-template");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TEMPLATE_STATUS"] = "A";
            window_progress["reQ_TEMPLATE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_TEMPLATE_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else if(event.active[0]._index == 1){
            var window_progress = window.open("/app/admin/pde-req-template");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TEMPLATE_STATUS"] = "U";
            window_progress["reQ_TEMPLATE_PROGRESS_EXPECT_MAKER_ID"] = "U";
            window_progress["reQ_TEMPLATE_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_progress = window.open("/app/admin/pde-req-template");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TEMPLATE_STATUS"] = "U";
            window_progress["reQ_TEMPLATE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_TEMPLATE_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 3){
            var window_progress = window.open("/app/admin/pde-req-template");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TEMPLATE_STATUS"] = "U";
            window_progress["reQ_TEMPLATE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_TEMPLATE_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else {
            var window_progress = window.open("/app/admin/pde-req-template");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TEMPLATE_STATUS"] = "";
            window_progress["reQ_TEMPLATE_PROGRESS_EXPECT_MAKER_ID"] = "";
            window_progress["reQ_TEMPLATE_PROGRESS_EXACT_MAKER_ID"] = "";
        }
    }

    SetChart02() {
        //this.pieChartData1 = [3, 6];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "PROGRESS_TEMPLATE";
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
        filter.typE_DASHBOARD = "PROGRESS_TEMPLATE";

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
//#endregion Tiến độ làm mẫu

//#region Tiến độ bảng hardware
    pieChartData3: number[] = [10, 10, 10, 10];
    pieChartLabels3: any[] = ["Hoàn thành: ", "Chưa gửi triển khai", "Đã gửi triển khai, chưa xác nhận", "Đã xác nhận"];
    pieChartType3: ChartType = "pie";
    pieChartLegend3 = true;
    pieChartColors3: any[] = [
        { backgroundColor: ["#008000", "#A0A0A0", "#FFA500", "#1B00FF"] },
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
            text: "Tiến độ bảng hardware",
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
            var window_progress = window.open("/app/admin/pde-req-tablehardware");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TABLEHARDWARE_STATUS"] = "A";
            window_progress["reQ_TABLEHARDWARE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_TABLEHARDWARE_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else if(event.active[0]._index == 1){
            var window_progress = window.open("/app/admin/pde-req-tablehardware");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TABLEHARDWARE_STATUS"] = "U";
            window_progress["reQ_TABLEHARDWARE_PROGRESS_EXPECT_MAKER_ID"] = "U";
            window_progress["reQ_TABLEHARDWARE_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_progress = window.open("/app/admin/pde-req-tablehardware");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TABLEHARDWARE_STATUS"] = "U";
            window_progress["reQ_TABLEHARDWARE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_TABLEHARDWARE_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 3){
            var window_progress = window.open("/app/admin/pde-req-tablehardware");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TABLEHARDWARE_STATUS"] = "U";
            window_progress["reQ_TABLEHARDWARE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_TABLEHARDWARE_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else {
            var window_progress = window.open("/app/admin/pde-req-tablehardware");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TABLEHARDWARE_STATUS"] = "";
            window_progress["reQ_TABLEHARDWARE_PROGRESS_EXPECT_MAKER_ID"] = "";
            window_progress["reQ_TABLEHARDWARE_PROGRESS_EXACT_MAKER_ID"] = "";
        }
    }

    SetChart03() {
        //this.pieChartData1 = [3, 6];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "PROGRESS_TABLEHARDWARE";
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
        filter.typE_DASHBOARD = "PROGRESS_TABLEHARDWARE";

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
//#endregion Tiến độ bảng hardware

//#region Tiến độ bảng màu
    pieChartData4: number[] = [10, 10, 10, 10];
    pieChartLabels4: any[] = ["Hoàn thành: ", "Chưa gửi triển khai", "Đã gửi triển khai, chưa xác nhận", "Đã xác nhận"];
    pieChartType4: ChartType = "pie";
    pieChartLegend4 = true;
    pieChartColors4: any[] = [
        { backgroundColor: ["#008000", "#A0A0A0", "#FFA500", "#1B00FF"] },
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
            text: "Tiến độ bảng màu",
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
            var window_progress = window.open("/app/admin/pde-req-tablecolor");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TABLECOLOR_STATUS"] = "A";
            window_progress["reQ_TABLECOLOR_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_TABLECOLOR_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else if(event.active[0]._index == 1){
            var window_progress = window.open("/app/admin/pde-req-tablecolor");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TABLECOLOR_STATUS"] = "U";
            window_progress["reQ_TABLECOLOR_PROGRESS_EXPECT_MAKER_ID"] = "U";
            window_progress["reQ_TABLECOLOR_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_progress = window.open("/app/admin/pde-req-tablecolor");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TABLECOLOR_STATUS"] = "U";
            window_progress["reQ_TABLECOLOR_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_TABLECOLOR_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 3){
            var window_progress = window.open("/app/admin/pde-req-tablecolor");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TABLECOLOR_STATUS"] = "U";
            window_progress["reQ_TABLECOLOR_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_TABLECOLOR_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else {
            var window_progress = window.open("/app/admin/pde-req-tablecolor");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_TABLECOLOR_STATUS"] = "";
            window_progress["reQ_TABLECOLOR_PROGRESS_EXPECT_MAKER_ID"] = "";
            window_progress["reQ_TABLECOLOR_PROGRESS_EXACT_MAKER_ID"] = "";
        }
    }

    SetChart04() {
        //this.pieChartData1 = [3, 6];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "PROGRESS_TABLECOLOR";
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
        filter.typE_DASHBOARD = "PROGRESS_TABLECOLOR";

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
//#endregion Tiến độ bảng màu

//#region Tiến độ mua hardware
    pieChartData5: number[] = [10, 10, 10, 10];
    pieChartLabels5: any[] = ["Hoàn thành: ", "Chưa gửi triển khai", "Đã gửi triển khai, chưa xác nhận", "Đã xác nhận"];
    pieChartType5: ChartType = "pie";
    pieChartLegend5 = true;
    pieChartColors5: any[] = [
        { backgroundColor: ["#008000", "#A0A0A0", "#FFA500", "#1B00FF"] },
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
            text: "Tiến độ mua hardware",
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
            var window_progress = window.open("/app/admin/pde-req-hardware");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_HARDWARE_STATUS"] = "A";
            window_progress["reQ_HARDWARE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_HARDWARE_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else if(event.active[0]._index == 1){
            var window_progress = window.open("/app/admin/pde-req-hardware");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_HARDWARE_STATUS"] = "U";
            window_progress["reQ_HARDWARE_PROGRESS_EXPECT_MAKER_ID"] = "U";
            window_progress["reQ_HARDWARE_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_progress = window.open("/app/admin/pde-req-hardware");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_HARDWARE_STATUS"] = "U";
            window_progress["reQ_HARDWARE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_HARDWARE_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 3){
            var window_progress = window.open("/app/admin/pde-req-hardware");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_HARDWARE_STATUS"] = "U";
            window_progress["reQ_HARDWARE_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_HARDWARE_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else {
            var window_progress = window.open("/app/admin/pde-req-hardware");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_HARDWARE_STATUS"] = "";
            window_progress["reQ_HARDWARE_PROGRESS_EXPECT_MAKER_ID"] = "";
            window_progress["reQ_HARDWARE_PROGRESS_EXACT_MAKER_ID"] = "";
        }
    }

    SetChart05() {
        //this.pieChartData1 = [3, 6];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "PROGRESS_HARDWARE";
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
        filter.typE_DASHBOARD = "PROGRESS_HARDWARE";

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
//#endregion Tiến độ mua hardware

//#region Tiến độ phiếu chung
    pieChartData6: number[] = [10, 10, 10, 10];
    pieChartLabels6: any[] = ["Hoàn thành: ", "Chưa gửi triển khai", "Đã gửi triển khai, chưa xác nhận", "Đã xác nhận"];
    pieChartType6: ChartType = "pie";
    pieChartLegend6 = true;
    pieChartColors6: any[] = [
        { backgroundColor: ["#008000", "#A0A0A0", "#FFA500", "#1B00FF"] },
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
            text: "Tiến độ phiếu chung",
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
            var window_progress = window.open("/app/admin/pde-req-normal");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_NORMAL_STATUS"] = "A";
            window_progress["reQ_NORMAL_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_NORMAL_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else if(event.active[0]._index == 1){
            var window_progress = window.open("/app/admin/pde-req-normal");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_NORMAL_STATUS"] = "U";
            window_progress["reQ_NORMAL_PROGRESS_EXPECT_MAKER_ID"] = "U";
            window_progress["reQ_NORMAL_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 2){
            var window_progress = window.open("/app/admin/pde-req-normal");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_NORMAL_STATUS"] = "U";
            window_progress["reQ_NORMAL_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_NORMAL_PROGRESS_EXACT_MAKER_ID"] = "U";
        }
        else if(event.active[0]._index == 3){
            var window_progress = window.open("/app/admin/pde-req-normal");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_NORMAL_STATUS"] = "U";
            window_progress["reQ_NORMAL_PROGRESS_EXPECT_MAKER_ID"] = "A";
            window_progress["reQ_NORMAL_PROGRESS_EXACT_MAKER_ID"] = "A";
        }
        else {
            var window_progress = window.open("/app/admin/pde-req-normal");
            window_progress["type_dashboard"] = "progress";
            window_progress["reQ_NORMAL_STATUS"] = "";
            window_progress["reQ_NORMAL_PROGRESS_EXPECT_MAKER_ID"] = "";
            window_progress["reQ_NORMAL_PROGRESS_EXACT_MAKER_ID"] = "";
        }
    }

    SetChart06() {
        //this.pieChartData1 = [3, 6];
        let filter = new PDE_REQUEST_DASHBOARD_ENTITY();
        filter.typE_DASHBOARD = "PROGRESS_NORMAL";
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
        filter.typE_DASHBOARD = "PROGRESS_NORMAL";

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
//#endregion Tiến độ phiếu chung



}
