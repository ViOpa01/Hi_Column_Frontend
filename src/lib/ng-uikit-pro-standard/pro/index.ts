import { ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AutocompleteModule } from './autocomplete/ng2-completer.module';
import { CardsModule } from './cards/cards.module';
import { FileInputModule } from './file-input/module/mdb-uploader.module';
import { MaterialChipsModule } from './tags/chips.module';
import { ProgressBars } from './progressbars';
import { TabsModule } from './tabs-pills/tabset.module';
import { SelectModule } from './material-select/select.module';
import { DatepickerModule } from './date-picker/datepicker.module';
import { TimePickerModule } from './time-picker/timepicker.module';

import { SidenavModule } from './sidenav/sidenav.module';
import { ChartSimpleModule } from './easy-charts/chart-simple.module';
import { AccordionModule } from './accordion';
import { StickyContentModule } from './sticky-content/sticky-content.module';
import { SmoothscrollModule } from './smoothscroll';
import { CharCounterModule } from './inputs/char-counter.module';
import { ScrollSpyModule } from './scroll-spy/scroll-spy.module';
import { AutoFormatModule } from './auto-format/auto-format.module';
import { RangeModule } from './range/range.module';

export {
  RangeModule, MdbRangeInputComponent
} from './range/index';

export {
  AutoFormatModule, MdbDateFormatDirective, MdbCreditCardDirective, MdbCvvDirective
} from './auto-format/index';

export {
  ScrollSpyModule, ScrollSpyDirective, ScrollSpyWindowDirective, ScrollSpyElementDirective, ScrollSpyLinkDirective, ScrollSpyService
} from './scroll-spy';

export {
  AutocompleteModule, CompleterComponent, CompleterListItemComponent, CompleterService, LocalDataFactoryProvider,
  RemoteDataFactoryProvider, MdbCompleterDirective, MdbDropdownDirective, MdbInputCompleteDirective, MdbListDirective, MdbRowDirective
} from './autocomplete';

export {
  CardsModule, CardRotatingComponent, CardRevealComponent
} from './cards';

export {

  ProgressbarComponent, ProgressbarConfigComponent, ProgressbarModule, ProgressBars, ProgressDirective,
  ProgressSpinnerComponent, BarComponent
} from './progressbars';

export {
  MaterialChipsComponent, MaterialChipsModule
} from './tags';

export {
  TabDirective, TabHeadingDirective, TabsetComponent, TabsetConfig, TabsModule, NgTranscludeDirective
} from './tabs-pills';

export {
  MDBSpinningPreloader
} from './preloader/preloader.service';

export {
  SelectModule, Diacritics, Option, OptionList, IOption, SELECT_VALUE_ACCESSOR, SelectComponent, SelectDropdownComponent
} from './material-select';

export {
  MDBDatePickerComponent, DatepickerModule, IMyCalendarDay, IMyCalendarViewChanged, IMyDate, IMyDateModel, IMyDateRange,
  IMyDayLabels, IMyInputAutoFill, IMyInputFieldChanged, IMyInputFocusBlur, IMyLocales, IMyMarkedDate, IMyMarkedDates,
  IMyMonth, IMyMonthLabels, IMyOptions, IMyWeek, IMyWeekday, InputAutoFillDirective, MYDP_VALUE_ACCESSOR, UtilService,
  LocaleService, FocusDirective
} from './date-picker';

export {
  TimePickerModule, ClockPickerComponent
} from './time-picker';

export {
  SidenavComponent, SidenavModule
} from './sidenav';

export {
  ChartSimpleModule, EasyPieChartComponent, SimpleChartComponent
} from './easy-charts';

export {
  SBItemComponent, SBItemBodyComponent, SBItemHeadComponent, SqueezeBoxComponent, AccordionModule
} from './accordion';

export {
  MdbStickyDirective, StickyContentModule
} from './sticky-content';

export {
  SmoothscrollModule, PageScrollDirective, PageScrollConfig, PageScrollingViews, PageScrollInstance, PageScrollService,
  PageScrollTarget, PageScrollUtilService, EasingLogic
} from './smoothscroll';

export {
  CharCounterDirective, CharCounterModule
} from './inputs';

export {
  MDBFileDropDirective, MDBFileSelectDirective, FileInputModule, MDBUploaderService, UploadFile, UploadOutput,
  UploadInput, humanizeBytes
} from './file-input';

const MODULES = [
  AutocompleteModule,
  CardsModule,
  FileInputModule,
  MaterialChipsModule,
  ProgressBars,
  TabsModule,
  SelectModule,
  DatepickerModule,
  TimePickerModule,

  SidenavModule,
  ChartSimpleModule,
  AccordionModule,
  StickyContentModule,
  SmoothscrollModule,
  CharCounterModule,
  ScrollSpyModule,
  AutoFormatModule,
  RangeModule
];

@NgModule({
  imports: [
    AutocompleteModule,
    CardsModule.forRoot(),
    MaterialChipsModule,
    ProgressBars.forRoot(),
    TabsModule.forRoot(),
    SelectModule,
    DatepickerModule,
    TimePickerModule,

    SidenavModule,
    ChartSimpleModule,
    AccordionModule,
    StickyContentModule,
    SmoothscrollModule.forRoot(),
    CharCounterModule.forRoot(),
    ScrollSpyModule,
    AutoFormatModule,
    RangeModule
  ],
  exports: [MODULES],
  providers: [
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class MDBRootModulePro {
}

@NgModule({ exports: MODULES })
export class MDBBootstrapModulePro {
  public static forRoot(): ModuleWithProviders {
    return { ngModule: MDBRootModulePro };
  }
}
