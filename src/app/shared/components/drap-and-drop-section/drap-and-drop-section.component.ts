import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-drap-and-drop-section',
  standalone: false,
  templateUrl: './drap-and-drop-section.component.html',
  styleUrl: './drap-and-drop-section.component.css',
})
export class DrapAndDropSectionComponent {
  
}
