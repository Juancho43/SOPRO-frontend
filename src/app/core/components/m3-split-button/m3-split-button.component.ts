import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

export interface SplitButtonAction {
  id: string;
  label: string;
  icon?: string;
  description?: string;
}

@Component({
  selector: 'app-m3-split-button',
  standalone: true,
  imports: [CommonModule, MatMenuModule],
  templateUrl: './m3-split-button.component.html',
  styleUrl: './m3-split-button.component.scss',
})
export class M3SplitButtonComponent {
  @Input() primaryLabel: string = 'Acción Principal';
  @Input() primaryIcon: string = 'flag';
  @Input() variant: 'filled' | 'tonal' | 'outlined' | 'elevated' = 'filled';
  @Input() disabled: boolean = false;
  @Input() options: SplitButtonAction[] = [];

  @Output() primaryClick = new EventEmitter<void>();
  @Output() optionSelected = new EventEmitter<SplitButtonAction>();

  onPrimaryClick(event: MouseEvent) {
    if (this.disabled) return;
    this.primaryClick.emit();
  }

  onSelectOption(option: SplitButtonAction) {
    this.optionSelected.emit(option);
  }
}
