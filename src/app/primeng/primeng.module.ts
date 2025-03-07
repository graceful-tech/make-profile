import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipsModule } from 'primeng/chips';
import { EditorModule } from 'primeng/editor';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { PickListModule } from 'primeng/picklist';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ContextMenuModule } from 'primeng/contextmenu';
import { RatingModule } from 'primeng/rating';
import { FieldsetModule } from 'primeng/fieldset';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password';
import { TabMenuModule } from 'primeng/tabmenu';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SplitterModule } from 'primeng/splitter';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { SidebarModule } from 'primeng/sidebar';
import { SkeletonModule } from 'primeng/skeleton';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    DropdownModule,
    KeyFilterModule
  ],
  exports: [
    InputTextModule,
    TableModule,
    PaginatorModule,
    DropdownModule,
    ButtonModule,
    CheckboxModule,
    DynamicDialogModule,
    MultiSelectModule,
    ChipsModule,
    EditorModule,
    FileUploadModule,
    CalendarModule,
    InputTextareaModule,
    DividerModule,
    AutoCompleteModule,
    MenuModule,
    CardModule,
    TabViewModule,
    PickListModule,
    KeyFilterModule,
    ContextMenuModule,
    RatingModule,
    FieldsetModule,
    BreadcrumbModule,
    ChartModule,
    ConfirmDialogModule,
    TagModule,
    PasswordModule,
    TabMenuModule,
    RadioButtonModule,
    SplitButtonModule,
    SplitterModule,
    TimelineModule,
    ToastModule,
    SidebarModule,
    SkeletonModule,
    AccordionModule
  ]
})
export class PrimengModule { }
