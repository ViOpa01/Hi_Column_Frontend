'use strict';
import {
  AfterViewChecked, Component, Input, Output, EventEmitter, OnInit, ViewChild,
  forwardRef, AfterViewInit, ElementRef, HostListener, Renderer2
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MdbCompleterDirective } from '../directives/completer.directive';
import { CompleterData } from '../services/completer-data.service';
import { CompleterService } from '../services/completer.service';
import { CompleterItem } from './completer-item.component';
import { MAX_CHARS, MIN_SEARCH_LENGTH, PAUSE, TEXT_SEARCHING, TEXT_NO_RESULTS } from '../globals';
import { trigger, state, transition, animate, style } from '@angular/animations';

const noop = () => { };

const COMPLETER_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CompleterComponent),
  multi: true
};


@Component({
  selector: 'mdb-autocomplete, mdb-completer',
  templateUrl: './completer.component.html',
  providers: [COMPLETER_CONTROL_VALUE_ACCESSOR],
  animations: [trigger('focusAnimation', [
    state('unfocused', style({ transform: 'scale(1.0, 1.0)', })),
    state('focused', style({ transform: 'scale(1.5, 1.5)' })),
    transition('unfocused => focused', animate('200ms ease-in')),
    transition('focused => unfocused', animate('200ms ease-in'))
  ])]
})
export class CompleterComponent implements OnInit, ControlValueAccessor, AfterViewChecked, AfterViewInit {
  @Input() public dataService: CompleterData;
  @Input() public inputName = '';
  @Input() public inputId = '';
  @Input() public pause = PAUSE;
  @Input() public minSearchLength = MIN_SEARCH_LENGTH;
  @Input() public maxChars = MAX_CHARS;
  @Input() public overrideSuggested = false;
  @Input() public clearSelected = false;
  @Input() public clearUnselected = false;
  @Input() public fillHighlighted = true;
  @Input() public placeholder = '';
  @Input() public matchClass: string;
  @Input() public fieldTabindex: number;
  @Input() public clearButtonTabIndex: number;
  @Input() public autoMatch = false;
  @Input() public disableInput = false;
  @Input() public inputClass: string;
  @Input() public autofocus = false;
  @Input() public openOnFocus = false;
  @Input() public initialValue: any;
  @Input() public autoHighlight = false;
  @Input() public label: string;

  @Input()
  public set datasource(source: CompleterData | string | Array<any>) {
    if (source) {
      if (source instanceof Array) {
        this.dataService = this.completerService.local(source);
      } else if (typeof (source) === 'string') {
        this.dataService = this.completerService.remote(source);
      } else {
        this.dataService = source;
      }
    }
  }

  @Input()
  public set textNoResults(text: string) {
    if (this._textNoResults !== text) {
      this._textNoResults = text;
      this.displayNoResults = this._textNoResults && this._textNoResults !== 'false';
    }
  }

  @Input()
  public set textSearching(text: string) {
    if (this._textSearching !== text) {
      this._textSearching = text;
      this.displaySearching = this._textSearching && this._textSearching !== 'false';
    }
  }

  @Output() public selected = new EventEmitter<CompleterItem>();
  @Output() public highlighted = new EventEmitter<CompleterItem>();
  @Output() public blur = new EventEmitter();
  @Output() public focusEvent = new EventEmitter();
  @Output() public opened = new EventEmitter<boolean>();
  @Output() public keyup: EventEmitter<any> = new EventEmitter();
  @Output() public keydown: EventEmitter<any> = new EventEmitter();

  @ViewChild(MdbCompleterDirective) public completer: MdbCompleterDirective;
  @ViewChild('mdbInput') public mdbInput: ElementRef;
  @ViewChild('labelEl') labelEl: ElementRef;

  public focused = false;

  // Used in sliding-down animation
  state = 'unfocused';

  public searchStr = '';
  public control = new FormControl('');

  displaySearching: any = true;
  displayNoResults: any = true;
  _onTouchedCallback: () => void = noop;
  _onChangeCallback: (_: any) => void = noop;
  _focus = false;
  _open = false;
  _textNoResults = TEXT_NO_RESULTS;
  _textSearching = TEXT_SEARCHING;

  constructor(
    private completerService: CompleterService,
    private renderer: Renderer2,
    private el: ElementRef) { }

  @HostListener('keyup', ['$event']) onkeyup(event: any) {
    if (event.target.value !== '') {
      this.renderer.setStyle(event.target.nextElementSibling, 'visibility', 'visible');
    }
  }

  @HostListener('click', ['$event']) onclick(event: any) {
    if (event.target === this.labelEl.nativeElement) {
      this.renderer.addClass(this.labelEl.nativeElement, 'active');
      this._focus = true;
    }
  }

  @HostListener('focusin') onFocusIn() {
    if (this.labelEl) {
      this.renderer.addClass(this.labelEl.nativeElement, 'active');
    }
  }

  @HostListener('focusout') onFocusOut() {
    if (this.mdbInput.nativeElement.value === '' && this.labelEl) {
      this.renderer.removeClass(this.labelEl.nativeElement, 'active');
    }
  }

  activateClearButton(event: any) {
    this.mdbInput.nativeElement.value = '';
    this.searchStr = '';
    this.renderer.setStyle(event.target, 'visibility', 'hidden');
  }

  triggerClearButtonAnimation(buttonState: string) {
    this.state = buttonState;
  }

  get value(): any { return this.searchStr; }

  set value(v: any) {
    if (v !== this.searchStr) {
      this.searchStr = v;
    }
    // Propagate the change in any case
    this._onChangeCallback(v);
  }

  public ngAfterViewInit() {
    if (this.labelEl) {
      this.renderer.removeClass(this.labelEl.nativeElement, 'active');
    }

    if (this.autofocus) {
      this._focus = true;
    }

    if (this.initialValue || this.searchStr) {
      this.renderer.addClass(this.labelEl.nativeElement, 'active');
    }
  }

  public ngAfterViewChecked(): void {

    if (this._focus) {
      this.mdbInput.nativeElement.focus();
      this._focus = false;
    }

  }

  public onTouched() {
    this._onTouchedCallback();
  }

  public writeValue(value: any) {
    this.searchStr = value;
  }

  public registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  public registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  public ngOnInit() {
    this.completer.selected.subscribe((item: CompleterItem) => {
      this.selected.emit(item);
    });
    this.completer.highlighted.subscribe((item: CompleterItem) => {
      this.highlighted.emit(item);
    });
    this.completer.opened.subscribe((isOpen: boolean) => {
      this._open = isOpen;
      this.opened.emit(isOpen);
    });
    if (this.initialValue) {
      this.searchStr = this.initialValue;
      this.onFocus();
    }
  }

  public onBlur() {
    this.onTouched();
    if (this.searchStr === undefined || this.searchStr === '') {
      this.focused = false;
    }
    this.blur.emit(this);
  }

  public onFocus() {
    setTimeout(() => {
      this.focused = true;
    }, 0);
    this.focusEvent.emit({ focused: true, element: this.el });
  }

  public onChange(value: string) {
    this.value = value;
  }

  public open() {
    this.completer.open();
  }

  public close() {
    this.completer.clear();
  }

  public focus(): void {
    if (this.mdbInput) {
      this.mdbInput.nativeElement.focus();
    } else {
      this._focus = true;
    }
  }

  public isOpen() {
    return this._open;
  }
}
