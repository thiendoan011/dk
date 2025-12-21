import { Component, ViewEncapsulation, ViewChild, ElementRef, AfterContentChecked, AfterViewInit, Output, EventEmitter, ChangeDetectorRef, OnInit, NgZone, Input } from "@angular/core";
import { LocalizationService } from "abp-ng2-module/dist/src/localization/localization.service";
import { EditTableState } from "./editable-state.component";
import { NgForm, FormControl } from "@angular/forms";
import * as moment from 'moment';
import { Paginator2Component } from "../p-paginator2/p-paginator2.component";

@Component({
    selector: "editable-table",
    templateUrl: "./editable-table.component.html",
    styleUrls: ["./editable-table.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class EditableTableComponent<T extends Object> implements OnInit, AfterViewInit, AfterContentChecked {
    constructor(
        private cdr: ChangeDetectorRef,
        private ref: ElementRef,
        private localization: LocalizationService,
        private ngZone: NgZone
    ) {
        // this.itemsPerPage = this.defaultRecordsCountPerPage;
        this.tableState = new EditTableState();
        this.tableState.currentPage = 0;
        this.idCheckbox = this.generateUUID();
        this.tableState.editTables.push(this);
    }

    @Input() editTableName: string;
    @Input() ngForm: NgForm;
    @Input() id: string;
    @Input() get requiredFields(): string[] {
        return this._requiredFields;
    }
    @Output() onSort: EventEmitter<any> = new EventEmitter<any>();
    @Output() onSelectRow: EventEmitter<T> = new EventEmitter<T>();

    @ViewChild('paginator') paginator: Paginator2Component;
    @ViewChild('table') table: ElementRef;

    _tableId: string;
    @Input() set tableId(value: string) {
        this._tableId = value;
    }
    get tableId(): string {
        return this._tableId;
    }

    _tableState: EditTableState;
    isLoading: boolean;
    validations: any = [];
    _requiredFields: string[] = [];
    idCheckbox: string;

    get tableState() {
        return this._tableState;
    }
    public get dataInPage(): T[] {
        return this.tableState.pageData;
    }
    public get isCheckAll() {
        return this.tableState.isCheckAll;
    }
    public get currentPage() {
        return this.tableState.currentPage;
    }
    public get allData(): T[] {
        return this.tableState.allData;
    }
    public set allData(value: T[]) {
        this.tableState.allData = value;
    }
    public get currentItem() {
        return this.tableState.currentItem;
    }

    set tableState(value) {
        this._tableState = value;
        if (this._tableState && this._tableState.editTables.indexOf(this) == -1) {
            this._tableState.editTables.push(this);
        }
    }

    set requiredFields(val: string[]) {
        this._requiredFields = val;
        if ($(this.table.nativeElement).find('>thead>tr>th').length > 0) {
            if (!this.tableState.isInitRequiredField) {
                this.initRequiredFieldsHeader();
            }
        }
        if (this._requiredFields) {
            this._requiredFields.forEach(x => {
                this.validations.push({
                    message: this.l('ValidationRequired'),
                    field: x,
                    checkValid: (context) => {
                        let key = Object.keys(context).find(a => a.toLocaleLowerCase() == x.toLocaleLowerCase());
                        if (!key) {
                            return false;
                        }
                        if (this.isNull(context[key])) {
                            return false;
                        }
                        return true;
                    }
                })
            })
        }
    }

    isNull(value) {
        if (value === 0) {
            return false;
        }
        return !value;
    }

    ngOnInit(): void {
        
        let oldUpdateVali = FormControl.prototype.updateValueAndValidity;
        let scope = this;
        FormControl.prototype.updateValueAndValidity = function (opts) {
            if (scope.ngForm) {
                let controls = Object.values(scope.ngForm.controls);
                if (controls.indexOf(this) >= 0) {
                    return;
                }
            }
            oldUpdateVali.call(this, opts);
        }
    }

    ngAfterViewInit(): void {
        
        var table = this.table.nativeElement;
        var scope = this;
        this.paginator.rows = this.tableState.defaultRecordsCountPerPage;
        $(table).find('thead>tr>th[sortfield]').each(function () {
            $(this).click(function () {
                scope.onClickSortColumn(this);
            });
        });

        if (!this.tableState.allData.length) {
            $(this.table.nativeElement).parent().addClass('no-data');
        }
        else {
            $(this.table.nativeElement).parent().removeClass('no-data');
        }
    }

    ngAfterContentChecked(): void {
        
        $(this.table.nativeElement).find('tbody tr textarea:not([rows])').attr('rows', 1);
        let colIndexToWidth = {};

        $(this.table.nativeElement).find('thead>tr>th').each(function () {
            let index = $(this).index();
            let width = $(this).width();
            colIndexToWidth[index] = width;
        })
        $(this.table.nativeElement).find('tbody>tr').each(function (indexRow, valueRow) {
            $(valueRow).find('td').each(function (indexCol, valueCol) {
                // let span = document.createElement('span');
                // $(span).text($(value).text());
                // $(value).append(span);
                if ($(valueCol).find(':input').length == 0) {

                    var colWidth = colIndexToWidth[indexCol];

                    let content = $(valueCol).contents().filter(function () {
                        return this.nodeType === 3;
                    }).text();

                    if (colWidth / content.length < 10) {

                        let hiddenElement = $("<span class='overflow-text'></span>");
                        $(valueCol).append(hiddenElement);
                        hiddenElement.append($(valueCol).contents().filter(function () {
                            return this.nodeType === 3;
                        }))

                    }
                }
            });
        });
        setTimeout(() => {
            // Prevent drag drop input value
            $("input, textarea").attr("ondrop", "return false;");
            if (this.requiredFields.length > 0) {
                if (!this.tableState.isInitRequiredField) {
                    this.initRequiredFieldsHeader();
                }
            }
            if (!$(this.table.nativeElement).find('tbody>tr>td>span.mobile-header').length) {
                this.resetResponsiveLayout();
            }

            var is_ctrl_pressed = false;
            $(this.ref.nativeElement).find('td input.label, td .label>input').on('keydown', function (e) {
                var code = e.which;
                if ((code > 47 && code < 59) || (code > 95 && code < 106) || (is_ctrl_pressed && (code == 67))) {
                    return true;
                } else if (code == 17) {
                    is_ctrl_pressed = true;
                } else {
                    return false;
                }
            });
            $(this.ref.nativeElement).find('td input.label, td .label>input').on('keyup', function (e) {
                if (e.which == 17) {
                    is_ctrl_pressed = false;
                }
            });


            var scope = this;
            $(this.ref.nativeElement).find('input,select,textarea').on('focusout', function () {
                var td = $(this).closest('td');
                if (td.hasClass('error')) {
                    td.removeClass('error');
                }
            })

            var scope = this;

            $(this.table.nativeElement).find('tbody>tr>td input[type="number"]').focusout(function (evt) {

            })


  
            this.initInputTooltip();

            $(this.table.nativeElement).find('tbody>tr').each(function (indexRow, valueRow) {
                $(valueRow).find('td').each(function (indexCol, valueCol) {
                    if ($(valueCol).find(':input').length == 0) {
                        var textContent = scope.encodeHTML($(valueCol).find('>span.overflow-text')
                            .text());
                        // textContent = scope.decodeHtml(textContent);
                        var colWidth = colIndexToWidth[indexCol];
                        var parsed = moment(textContent, "DD/MM/YYYY", true);
                        textContent = parsed.isValid() ? parsed.format("DD/MM/YYYY") : textContent;

                        if (colWidth / textContent.length < 10) {
                            $(valueCol).tooltip({
                                items: "td, span",
                                content: textContent,
                                close: function (event, ui) {
                                    $(".ui-tooltip").remove();
                                },
                                hide: false,

                                tooltipClass: "custom_tooltip"
                            });

                            // $(value).css({ "overflow": "hidden", "table-layout": "fixed", "white-space": "nowrap" });

                        }

                    }
                });
            });
            $(this.table.nativeElement).each(function () {
				if(this['is-init-resize']){
					return;
				}
				this['is-init-resize'] = true;
				$(this).find('th').each(function (index, value) {
					let w = $(this).width();
					$(this).css('width', w);
				});
				($(this) as any).colResizable({
					fixed: false,
					liveDrag: true,
					resizeMode: 'overflow',
                    hoverCursor: 'e-resize',
                    dragCursor: 'e-resize'
				});
			});
        });
    }

    getValidationMessage() {
        this.tableState.showErrorOnPage = true;
        this.checkShowErrorOnPage();
        let validationMessages = [];
        for (let i = 0; i < this.tableState.allData.length; i++) {
            let item = this.tableState.allData[i];
            validationMessages = [];
            this.validations.forEach(v => {
                if (!v.checkValid(item)) {
                    let elem = $(this.table.nativeElement).find(`>thead>tr>th[sortField="${v.field}"]>span`);
                    if (elem.length) {
                        var headerText = elem.text();
                        if (headerText) {
                            validationMessages.push(headerText + ' ' + v.message);
                        }
                    }
                }
            });
            if (validationMessages.length > 0) {
                return this.l('Line') + ' ' + (i + 1) + ': ' + validationMessages.join('<br>');
            }
        }
        return undefined;
    }

    checkShowErrorOnPage() {
        if (!this.tableState.showErrorOnPage) {
            return;
        }
        for (let i = 0; i < this.dataInPage.length; i++) {
            let item = this.dataInPage[i];
            this.validations.forEach(v => {
                if (!v.checkValid(item)) {
                    let indexTh = $(this.table.nativeElement).find(`>thead>tr>th[sortField="${v.field}"]`).index();
                    $($($(this.table.nativeElement).find('>tbody>tr')[i]).find('>td')[indexTh]).addClass('error');
                }
            });
        }
    }

    updateView() {
        this.cdr.detectChanges();
    }

    /** Tạo random id */
    generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); //use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    l(key: string, ...args: any[]): string {
        args.unshift(key);
        args.unshift(this.tableState.localizationSourceName);
        return this.ls.apply(this, args);
    }

    ls(sourcename: string, key: string, ...args: any[]): string {
        let localizedText = this.localization.localize(key, sourcename);

        if (!localizedText) {
            localizedText = key;
        }

        if (!args || !args.length) {
            return localizedText;
        }

        args.unshift(localizedText);
        return abp.utils.formatString.apply(this, args);
    }

    updateParentView(preventChildUpdateView = false) {
        var par = this.cdr['_view'].parent;
        if (par && par.component && par.component.updateView) {
            par.component.updateView(true, preventChildUpdateView);
        }
    }

    initRequiredFieldsHeader() {
        if (this.requiredFields.length == 0 || $(this.table.nativeElement).find('>thead>tr>th').length == 0) {
            return;
        }
        this.requiredFields.forEach(x => {
            $(this.table.nativeElement).find(`>thead>tr>th[sortField="${x}"]`).addClass('required');
        });
        this.tableState.isInitRequiredField = true;
    }

    decodeHtml(text) {
        return text.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    }

    initInputTooltip() {
        $(".ui-tooltip").remove();

        let scope = this;

        $(this.table.nativeElement).find('tbody>tr>td').each(function (index, value) {
            if ($(value).find(':input').length == 0) {
                var textContent = '';
                textContent = scope.encodeHTML($(value)
                        .clone()
                        .children()
                        .remove()
                        .end()
                        .text().trim());
                textContent = scope.decodeHtml(textContent);

                var colWidth = $(value).width();
                if (colWidth / textContent.length < 10) {

                    if (textContent.split(",").length > 1) {
                        var parsed = moment(textContent, "DD/MM/YYYY, hh:mm:ss a", true);
                        textContent = parsed.isValid() ? parsed.format("DD/MM/YYYY") : textContent;

                    } else {
                        var parsed = moment(textContent, "yyyy/MM/dd", true);

                        if (parsed.isValid()) {
                            var t = textContent = parsed.isValid() ? parsed.format("DD/MM/YYYY") : textContent;
                        }
                        textContent = parsed.isValid() ? parsed.format("DD/MM/YYYY") : textContent;
                    }

                    $(value).tooltip({
                        items: "td, span",
                        content: textContent,
                        close: function (event, ui) {
                            $(".ui-tooltip").remove();
                        },
                        hide: false,

                        tooltipClass: "custom_tooltip"
                    });
                }
            }
            else {
                var textContent = '';
                textContent = scope.encodeHTML($(value).find(':input:first')[0].value);
                var colWidth = $(value).width();
                if (colWidth / textContent.length < 10) {
                    $(value).tooltip({
                        items: "td, input",
                        content: textContent,
                        close: function (event, ui) {
                            $(".ui-tooltip").remove();
                        },
                        hide: false,

                        tooltipClass: "custom_tooltip"
                    });
                }
            }

            $("input[type=number]").on("keypress", function(event) {
                // var keycode = evt.charCode || evt.keyCode;
                var txtVal = $(this).val();
                if(txtVal.toString().length==15){
                event.preventDefault();
                return false;
                }
                return true;
                });
        });
    }

    resetTableToClonePageRow() {
        let pageSize = Math.min(this.tableState.defaultRecordsCountPerPage, this.tableState.allData.length);
        let page = this.tableState.currentPage;

        for (var i = page; i < page + pageSize; i++) {
            if (this.tableState.allData[i]) {
                let toJson = this.tableState.allData[i]['toJSON']
                this.tableState.allData[i] = { ...this.tableState.allData[i] };
                this.tableState.allData[i]['toJSON'] = toJson;
            }

        }

    }

    onClickSortColumn(thElement) {
        var table = this.table.nativeElement;
        $(table).find('thead>tr>th[sortfield]').each(function () {
            if (this != thElement) {
                $(this).removeClass('sort-desc').removeClass('sort-asc')
            }
        });



        var sortField = $(thElement).attr('sortfield');
        if ($(thElement).hasClass('sort-asc')) {

            $(thElement).removeClass('sort-asc');
            $(thElement).addClass('sort-desc');

            this.tableState.allData.sort(EditableTableComponent.sortDesc(sortField));
            this.resetNoAndPage();

            this.changePage(this.tableState.currentPage);

            this.onSort.emit('desc');
        }
        else {

            $(thElement).removeClass('sort-desc');
            $(thElement).addClass('sort-asc');
            this.tableState.allData.sort(EditableTableComponent.sortAsc(sortField));
            this.resetNoAndPage();

            this.changePage(this.tableState.currentPage);

            this.onSort.emit('asc');
        }

        // this.updateParentView();
    }

    static sortDesc(sortField) {
        return function (x1, x2) {
            if (!x1[sortField] && x1[sortField] != 0) {
                return -1;
            }

            if (!x2[sortField] && x2[sortField] != 0) {
                return 1;
            }
            if (typeof (x1[sortField]) == "string" && typeof (x2[sortField]) == "string") {

                if (x1[sortField].localeCompare(x2[sortField]) >= 0) {
                    return -1;
                }
            } else {
                if (x1[sortField] >= x2[sortField]) {
                    return -1;
                }
            }

            return 1;
        }
    }

    static sortAsc(sortField) {
        return function (x1, x2) {
            if (!x1[sortField] && x1[sortField] != 0) {
                return 1;
            }

            if (!x2[sortField] && x2[sortField] != 0) {
                return -1;
            }
            if (typeof (x1[sortField]) == "string" && typeof (x2[sortField]) == "string") {

                if (x1[sortField].localeCompare(x2[sortField]) > 0) {
                    return 1;
                }
            } else {
                if (x1[sortField] > x2[sortField]) {
                    return 1;
                }
            }


            return -1;
        }
    }

    name(fieldName: string, index: number): string {
        return `${fieldName}-${index}-${this.editTableName}`;
    }

    encodeHTML(str) {
        return str.replace(/[\u00A0-\u9999<>&](?!#)/gim, function (i) {
            return '&#' + i.charCodeAt(0) + ';';
        });
    }

    setList(list: any[], page = 0) {
        this.tableState.allData = list;
        this.resetNoAndPage();
        this.changePage(page);
        this.updateParentView();

        if (list.length > 0 && $(this.table.nativeElement).find('table>tbody>tr.selectable').length == 0) {
            let trs = $(this.table.nativeElement).find('tbody>tr');
            this.selectRow({ currentTarget: trs[0] }, list[0]);
        }
    }

    resetNoAndPage() {
        for (var i = 0; i < this.tableState.allData.length; i++) {
            var item = this.tableState.allData[i] as any;
            item.no = i + 1;
            item.page = ~~(i / this.paginator.rows);
        }

        if (!this.tableState.allData.length) {
            $(this.table.nativeElement).parent().addClass('no-data');
        }
        else {
            $(this.table.nativeElement).parent().removeClass('no-data');
        }
    }

    pushItem(item: any) {
        this.tableState.allData.push(item);
        item.no = this.tableState.allData.length;
        item.page = ~~((this.tableState.allData.length - 1) / this.paginator.rows);
        if (!this.tableState.pageData) {
            this.tableState.pageData = this.tableState.allData.filter(x => (x as any).page == this.tableState.currentPage);
        }
        else if (item.page == this.tableState.currentPage) {
            this.tableState.pageData.push(item);
        }
        $(this.table.nativeElement).parent().removeClass('no-data');
    }

    addNewItem(): T {
        let obj = {} as T;
        obj['toJSON'] = function () {
            let data = {};
            let scope = this;
            Object.keys(this).filter(x => x != "toJSON").forEach(function (k) {
                if (k) {
                    data[k] = scope[k];
                }
            })
            return data;
        }
        this.pushItem(obj);
        this.updateParentView();
        return obj;
    }

    getAllCheckedItem(): T[] {
        return this.tableState.allData.filter(x => x['isChecked']);
    }

    removeAllCheckedItem() {
        let newData = this.allData.filter(x => !x['isChecked']);
        this.allData = newData;
        this.resetNoAndPage();
        this.resetTableToClonePageRow();
        let pageSize = Math.min(this.tableState.defaultRecordsCountPerPage, this.tableState.allData.length);

        if (Math.ceil(this.tableState.allData.length / pageSize) < (this.currentPage + 1)) {
            this.changePage(this.currentPage - 1);
            return;
        }
        this.changePage(this.currentPage);
    }
    removeAllCheckedItemWithoutCondition(field:string, condition:string) {
        let newData = this.allData.filter(x => !x['isChecked'] || x[field] == condition); // giữ lại uncheck hoặc condition
        this.allData = newData;
        this.resetNoAndPage();
        this.resetTableToClonePageRow();
        let pageSize = Math.min(this.tableState.defaultRecordsCountPerPage, this.tableState.allData.length);

        if (Math.ceil(this.tableState.allData.length / pageSize) < (this.currentPage + 1)) {
            this.changePage(this.currentPage - 1);
            return;
        }
        this.changePage(this.currentPage);
    }
    removeAllItemWithCondition(field:string, condition:string) {
        let newData = this.allData.filter(x => x[field] !== condition);
        this.allData = newData;
        this.resetNoAndPage();
        this.resetTableToClonePageRow();
        let pageSize = Math.min(this.tableState.defaultRecordsCountPerPage, this.tableState.allData.length);

        if (Math.ceil(this.tableState.allData.length / pageSize) < (this.currentPage + 1)) {
            this.changePage(this.currentPage - 1);
            return;
        }
        this.changePage(this.currentPage);
    }
    /** parent view updated */
    changePage(page, force: boolean = true, updateView = false, updateInput = true) {
        if (!force && this.tableState.currentPage == page) {
            return;
        }
        // console.time('EditTable Change Page');

        this.tableState.currentPage = page;
        if (this.tableState.pageData) {
            this.tableState.pageData.length = 0;
        }
        let pageSize = this.tableState.defaultRecordsCountPerPage;
        this.tableState.pageData = this.tableState.allData.slice(page * pageSize, page * pageSize + pageSize);
        if (this.ngForm && !updateView) {
            if (updateInput) {
                this.updateInputField();
            }
            this.tableState.editTables.filter(x => x).forEach(x => {
                setTimeout(() => {
                    x.cdr.detectChanges();
                })
            });
        }
        else {
            setTimeout(() => {
                this.updateParentView();
            })
        }
        this.checkShowErrorOnPage();
        //console.timeEnd('EditTable Change Page');
        this.updateParentView();
    }

    onSelectRecordChange(pageSize) {
        console.time('record-per-page ' + pageSize);

        this.tableState.defaultRecordsCountPerPage = pageSize;
        this.tableState.editTables.forEach(x => {
            x.paginator.rows = pageSize;
        });
        this.resetNoAndPage();
        this.changePage(0, true, true, false);
        // this.updateParentView();
        console.timeEnd('record-per-page ' + pageSize);
    }

    reloadPage() {
        this.changePage(this.tableState.currentPage);
    }

    checkAll(isCheckAll): void {
        $(this.table.nativeElement).find('input[type="checkbox"]').prop('checked', isCheckAll);
        this.tableState.allData.forEach(x => {
            (x as any).isChecked = isCheckAll;
        });
    }

    selectRow(event, item: any): void {
        // set ui selected
        var indexOfRow = $(event.currentTarget).index();
        this.tableState.editTables.forEach(x => {
            $(x.ref.nativeElement).find('table>tbody>tr.selectable').removeClass('selected');
            $(x.ref.nativeElement).find('table>tbody>tr:nth-child(' + (indexOfRow + 1) + ')').addClass('selected');
        })
        if (this.tableState.currentItem && (this.tableState.currentItem != item)) {
            this.tableState.currentItem['editableIsSelected'] = false;
            item['editableIsSelected'] = true;
            this.tableState.currentItem = item;
        }
        this.onSelectRow.emit(item);
    }

    // Dùng cho việc press key up, down khi nhập liệu
    nextRow(event, item: any): void {
        /*
        // set ui selected
        var indexOfRow = item.no;
        this.tableState.editTables.forEach(x => {
            $(x.ref.nativeElement).find('table>tbody>tr.selectable').removeClass('selected');
            $(x.ref.nativeElement).find('table>tbody>tr:nth-child(' + (indexOfRow+1) + ')').addClass('selected');
        })
        // if (this.tableState.currentItem && (this.tableState.currentItem != item)) {
        //     this.tableState.currentItem['editableIsSelected'] = false;
        //     item['editableIsSelected'] = true;
        //     this.tableState.currentItem = item;
        // }
        this.tableState.currentItem['editableIsSelected'] = false;
        item['editableIsSelected'] = false;
        this.onSelectRow.emit(item);
        */
        $(document).ready(function() {
            $("tr[tabindex=0]").focus();    
            document.onkeydown = checkKey;
        });
        
        function checkKey(e) {
            var event = window.event ? window.event : e;
            if(event.keyCode == 40){ //down
              var idx:any = $("tr:focus").attr("tabindex");
              idx++;
              if(idx > 4){
                idx = 0;
              }
              $("tr[tabindex="+idx+"]").focus();
            }
            if(event.keyCode == 38){ //up
              var idx:any = $("tr:focus").attr("tabindex");
              idx--;
              if(idx < 0){
                idx = 4;
              }
              $("tr[tabindex="+idx+"]").focus();      
            }
        }
    }

    

    doNothing() {
    }

    getSum(fieldName) {
        let val = 0;
        this.allData.forEach(x => {
            val += (x[fieldName] || 0);
        })
        return val;
    }

    getSumPercent(fieldName) {
        let val = 0;
        this.allData.forEach(x => {
            val += (this.getNumberFromString(x[fieldName]) || 0);
        })
        return val;
    }

    getNumberFromString(str: string): number{
        return parseInt(str.replace(/\D/g, ""));
    }

    getSumByFunct(funct) {
        let val = 0;
        this.allData.forEach(x => {
            val += (funct(x) || 0);
        })
        return val;
    }

    updateInputField() {
        if (!this.ngForm) {
            return;
        }
        console.time('updateInputField');
        let editName = this.editTableName;

        this.tableState.editTables.forEach(x => {
            let trs = $(x.ref.nativeElement).find('table>tbody>tr:not(.sub-total)');

            if (trs.length == 0) {
                return;
            }

            if (this.dataInPage.length > trs.length) {
                this.updateParentView();
                return;
            }

            let len = Math.min(this.paginator.rows, trs.length);
            for (let i = this.dataInPage.length; i < len; i++) {
                trs[i].style.display = 'none';
            }
            len = Math.min(this.dataInPage.length, trs.length);
            for (let i = 0; i < len; i++) {
                trs[i].style.display = '';
            }
        })

        // let oldUpdateField = FormControl.prototype.updateValueAndValidity;
        // FormControl.prototype.updateValueAndValidity = this.doNothing;

        Object.entries(this.ngForm.controls).forEach(x => {

            let key = x[0];
            let control = x[1];

            control.updateValueAndValidity = this.doNothing;

            let keywords = key.split('-');
            if (keywords.length != 3) {
                return;
            }
            let fieldKey = keywords[0];
            let index = parseInt(keywords[1]);
            let tableName = keywords[2];
            if (this.dataInPage[index]) {
                control.setValue(this.dataInPage[index][fieldKey]);
            }
        })

        setTimeout(() => {
            this.initInputTooltip();
        })
        console.timeEnd('updateInputField');
    }

    resetResponsiveLayout() {
        var tbody = $(this.table.nativeElement).find('>tbody')[0];
        if (tbody.getElementsByTagName('tr').length) {

            var thead = this.table.nativeElement.getElementsByTagName('thead')[0];
            var columns = thead.getElementsByTagName('th');

            var trs = $(this.table.nativeElement).find('>tbody>tr:not(.sub-total)');

            trs.each(function () {
                let tr = this;

                var tds = tr.getElementsByTagName('td');
                for (var inh = 0; inh < columns.length; inh++) {
                    var th = columns[inh];
                    var spans = th.getElementsByTagName('span');
                    var text = '';
                    if (spans.length) {
                        text = spans[0].textContent;
                    }
                    else {
                        text = th.innerText;
                    }

                    if (spans.length && !tds[inh].style.width) {
                        tds[inh].style.width = spans[0].style.width;
                    }

                    if (spans.length && !tds[inh].style['max-width']) {
                        tds[inh].style['max-width'] = spans[0].style['max-width'];
                    }

                    var mobileSpan = tds[inh].getElementsByClassName('mo-header');

                    if (mobileSpan.length) {
                        mobileSpan[0].innerText = text;
                    }
                }
            })
        }
    }

    /**
     * Hàm Common xử lý điều hướng bằng phím Enter
     * - Enter: Xuống dòng dưới
     * - Shift + Enter: Lên dòng trên
     */
    onEnterMoveDown(event: KeyboardEvent, prefixId: string, currentIndex: number) {
        // 1. Ngăn chặn hành vi mặc định (xuống dòng trong textarea hoặc submit form)
        event.preventDefault();

        // 2. Xác định hướng: Shift nhấn -> Lên (-1), Không nhấn -> Xuống (+1)
        const direction = event.shiftKey ? -1 : 1;
        const nextIndex = currentIndex + direction;

        // 3. Kiểm tra biên (Boundary check)
        // Không cho phép index < 0 hoặc vượt quá số lượng dòng đang hiển thị trên trang
        if (nextIndex < 0 || nextIndex >= this.dataInPage.length) {
            return;
        }

        // 4. Tìm phần tử DOM tiếp theo dựa trên ID
        const nextElementId = prefixId + '_' + nextIndex;
        const nextElement = document.getElementById(nextElementId);

        if (nextElement) {
            // Xử lý focus
            if (nextElement.tagName !== 'INPUT' && nextElement.tagName !== 'TEXTAREA') {
                // Nếu là component (như money-input), tìm input bên trong
                const inputInside = nextElement.querySelector('input');
                if (inputInside) {
                    inputInside.focus();
                    inputInside.select(); // Bôi đen toàn bộ text
                }
            } else {
                // Nếu là input/textarea thường
                nextElement.focus();
                (nextElement as HTMLInputElement).select(); // Bôi đen toàn bộ text
            }
        }
    }

}
