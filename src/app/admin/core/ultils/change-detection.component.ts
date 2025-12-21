import { ComponentBase } from "@app/ultilities/component-base";
import { Injector, ChangeDetectorRef, ElementRef, ApplicationRef, NgZone } from "@angular/core";
import { FormControl } from "@angular/forms";
import * as moment from "moment";

export class ChangeDetectionComponent extends ComponentBase {
	cdr: ChangeDetectorRef;
	ref: ElementRef;
	appRef: ApplicationRef;
	constructor(
		injector: Injector,
	) {
		super(injector);
		this.cdr = injector.get(ChangeDetectorRef);
		this.ref = injector.get(ElementRef);
		this.appRef = injector.get(ApplicationRef);
	}

	static stopAllUpdateView: boolean;

	stopAutoUpdateView() {
		this.cdr.detach();
	}

	autoUpdateView() {
		this.cdr.reattach();
	}

	doNothing() {
	}

	updateView(updateAll = true, stopAllUpdateView = false) {

		if (ChangeDetectionComponent.stopAllUpdateView) {
			return;
		}

		ChangeDetectionComponent.stopAllUpdateView = stopAllUpdateView;

		//  let oldFunct = FormControl.prototype.updateValueAndValidity;
		//   FormControl.prototype.updateValueAndValidity = this.doNothing;

		if (updateAll) {
			this.cdr.detectChanges();
		}

		ChangeDetectionComponent.stopAllUpdateView = false;

		//  FormControl.prototype.updateValueAndValidity = oldFunct;
		// this.cdr.markForCheck();
		// setTimeout(() => {
		//     $(this.ref.nativeElement).find('textarea').each(function () {
		//         window.parent['auto_grow'](this);
		//     })
		// })
	}

	updateParentView() {
		var par = this.cdr['_view'].parent;
		if (par && par.component && par.component.updateView) {
			par.component.updateView();
		}
	}

	static encodeHTML(str) {
		return str.replace(/[\u00A0-\u9999<>&](?!#)/gim, function (i) {
			return '&#' + i.charCodeAt(0) + ';';
		});
	}

	setupValidationMessage() {

		this.ref.nativeElement.querySelectorAll('input[required], textarea[required],input[pattern],money-input[required]>input,date-control>input, input[hidden][required]~input').forEach(x => {
			var self = this;
			x['focusout'] = function () {
				if (self['isShowError']) {
					self.updateView();
				}
			}
		});

		document.querySelectorAll('select2-custom[required],all-code-select[required]').forEach(x => {
			var self = this;
			$(x).on('select2:select', function (e) {
				if (self['isShowError']) {
					self.updateView();
				}
			});
		});



		this.ref.nativeElement.querySelectorAll('input,textarea').forEach(x => {
			x = x.parentElement;
			x['isParent'] = true;
			$(x).mouseenter(function () {
				let value = $(this).find('input,textarea')[0];
				let val = value.value;
				let oldData = $(value).attr('old-data');
				if (oldData == val && $(".ui-tooltip").length>0) {
					return;
				}

				// $(".ui-tooltip").remove();
				$(value).attr('old-data', val as any);
				var textContent = '';
				textContent = ChangeDetectionComponent.encodeHTML(val);

				if (textContent.split(",").length > 1) {
					var parsed = moment(textContent, "DD/MM/YYYY, hh:mm:ss a", true);
					textContent = parsed.isValid() ? parsed.format("DD/MM/YYYY") : textContent;

				} else {
					var parsed = moment(textContent, "YYYY/MM/DD", true);

					if (parsed.isValid()) {
						var t = textContent = parsed.isValid() ? parsed.format("DD/MM/YYYY") : textContent;
					}
					textContent = parsed.isValid() ? parsed.format("DD/MM/YYYY") : textContent;
				}

				var colWidth = $(value).width();
				if (colWidth / textContent.length < 10) {
					$(this).tooltip({ disabled: true })
					$(this).tooltip({
						disabled: false,
						items: "div, input, textarea",
						content: textContent,
						close: function (event, ui) {
							$(".ui-tooltip").remove();
						},
						hide: false,
						tooltipClass: "custom_tooltip"
					});
				}
				else {
					$(this).tooltip({ disabled: true })
				}
			})

			
			$(x).mouseleave(function () {
				$(".ui-tooltip").remove();
				// $(this).tooltip({ disabled: true })
			});

			$("input[type=number]").on("keypress", function(event) {
				// var keycode = evt.charCode || evt.keyCode;
				var txtVal = $(this).val();
				if(txtVal.toString().length==15){
				event.preventDefault();
				return false;
				}
				return true;
			});
		})
	}

	excelMapping(x) {
        let r: any = { ...x };
        r.toJSON = function () {
            let data = {};
            let scope = this;
            Object.keys(this).filter(x => x != "toJSON").forEach(function (k) {
                if (k) {
                    data[k] = scope[k];
                }
            })
            return data;
        };
        return r;
    }
}
