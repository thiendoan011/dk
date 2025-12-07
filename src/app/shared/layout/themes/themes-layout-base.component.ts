import { Component, OnInit, inject } from '@angular/core';
import { AppUiCustomizationService } from '@shared/common/ui/app-ui-customization.service';
import { AppComponentBase } from '@shared/common/app-component-base';
import { Injector } from '@angular/core';

@Component({
    template: '',
    standalone: true
})
export class ThemesLayoutBaseComponent extends AppComponentBase implements OnInit {
    // Inject service trực tiếp
    protected readonly uiCustomization = inject(AppUiCustomizationService);

    constructor(
        injector: Injector
    ) {
        super(injector);
    }

    ngOnInit(): void {
        // Logic chung cho tất cả layout (nếu có)
    }
}