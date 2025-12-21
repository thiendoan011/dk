import { Directive, HostListener, ElementRef, OnInit, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appTextareaAutoresize]'
})
export class TextareaAutoresizeDirective implements OnInit, AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  @HostListener(':input') onInput() {
    this.resize();
  }
  @HostListener('mouseenter') mouseenter() {
    this.resize();
  }

  ngOnInit() {
    if (this.elementRef.nativeElement.scrollHeight) {
      setTimeout(() => this.resize());
    }
    
  }

  ngAfterViewInit(): void{
    if (this.elementRef.nativeElement.scrollHeight) {
      setTimeout(() => this.resize());
    }
  }

  resize() {
    this.elementRef.nativeElement.style.height = '0';
    this.elementRef.nativeElement.style.height = (parseInt(this.elementRef.nativeElement.scrollHeight)*1.05 ) + 'px';
  }
}