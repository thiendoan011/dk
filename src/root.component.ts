import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    template: `<router-outlet />`, // Cú pháp self-closing tag mới cho gọn
    standalone: true, // BẮT BUỘC: true
    imports: [RouterOutlet] // Import trực tiếp
})
export class RootComponent {
    // Nếu sau này cần state, hãy dùng Signals
    // readonly isLoading = signal(false);
}