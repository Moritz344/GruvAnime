import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DragState {
  public isDragging = signal(false);
  public wasDrag = signal(false);
}
