import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appTableNavigation]'
})
export class TableNavigationDirective implements AfterViewInit {
  private selectedRowIndex = 0;
  private selectedCellIndex = 0;
  private table!: HTMLTableElement;
  private navigableCells: HTMLTableCellElement[] = [];
  private observer!: MutationObserver;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.table = this.el.nativeElement.querySelector('table'); 

    if (this.table) {
      this.updateNavigableCells(); 
      this.highlightSelectedCell();

      // Tạo MutationObserver để theo dõi các thay đổi trong bảng
      this.observer = new MutationObserver(() => {
        this.updateNavigableCells();
      });

      // Bắt đầu quan sát bảng, theo dõi việc thêm/xóa node con
      this.observer.observe(this.table, { childList: true }); 
    } else {
      console.error('Không tìm thấy bảng để áp dụng điều hướng.');
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect(); // Ngừng quan sát khi directive bị hủy
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.table) return;

    if (event.key === 'Enter' && event.altKey) { // Kiểm tra Alt + Enter
      // Lấy element đang focus
      const focusedElement = document.activeElement;

      // xác định row
      this.selectedRowIndex = focusedElement.closest('tr').rowIndex;

      // xác định column
      this.selectedCellIndex = focusedElement.closest('td').cellIndex;

      this.updateNavigableCells();
      this.highlightSelectedCell(event);
    } else {
      switch (event.key) {
        case 'ArrowUp':
        this.selectedRowIndex = Math.max(0, this.selectedRowIndex - 1);
        break;
      }
    }

    
  }

  private highlightSelectedCell(event?: KeyboardEvent) {
    if (!this.table) return;
  
    const allCells = this.table.querySelectorAll('td');
    allCells.forEach(cell => cell.classList.remove('selected'));
  
    let targetCell: HTMLTableCellElement | null = this.table.rows[this.selectedRowIndex + 1].cells[this.selectedCellIndex];
  
    if (targetCell) {
      // Xóa target dòng cũ và gán target dòng mới
      const allRows = this.table.querySelectorAll('tr');
      allRows.forEach(row => row.classList.remove('selected'));
      let targetRow: HTMLTableRowElement | null = this.table.rows[this.selectedRowIndex+1];
      targetRow.classList.add('selected');
      
      this.selectedRowIndex = (targetCell.parentNode! as HTMLTableRowElement).rowIndex;
      this.selectedCellIndex = targetCell.cellIndex; // Chỉ cập nhật nếu ô đích ở cột khác
      targetCell.classList.add('selected');

      const focusableElement = targetCell.querySelector('input, textarea');
      if (focusableElement) {
        (focusableElement as HTMLElement).focus();
      }

    } else {
      // Nếu không tìm thấy ô điều hướng được, đặt lại rowIndex về giá trị ban đầu
      this.selectedRowIndex = event && event.key === 'ArrowUp' ? this.selectedRowIndex - 1 : this.selectedRowIndex;
      console.warn('Không tìm thấy ô điều hướng được ở dòng tiếp theo.');
    }
  }

  private updateNavigableCells() {
    const allCells = this.table.querySelectorAll('td');
    this.navigableCells = Array.from(allCells);
  }
}