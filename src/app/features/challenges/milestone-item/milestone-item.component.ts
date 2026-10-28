import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Milestone } from '../logic/challenge.model';

@Component({
  selector: 'app-milestone-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './milestone-item.component.html',
  styleUrl: './milestone-item.component.scss',
})
export class MilestoneItemComponent {
  @Input({ required: true }) milestone!: Milestone;
  @Output() toggle = new EventEmitter<Milestone>();
  @Output() remove = new EventEmitter<string>();

  get daysRemaining(): number {
    const due = new Date(this.milestone.dueDate).getTime();
    const now = new Date().setHours(0, 0, 0, 0);
    return Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  }

  get urgencyClass(): 'urgent' | 'warning' | 'overdue' | 'normal' {
    if (this.milestone.isCompleted) return 'normal';
    if (this.daysRemaining < 0) return 'overdue';
    if (this.daysRemaining <= 1) return 'urgent';
    if (this.daysRemaining <= 3) return 'warning';
    return 'normal';
  }

  onToggle(event: MouseEvent) {
    event.stopPropagation();
    this.toggle.emit(this.milestone);
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.remove.emit(this.milestone.id);
  }
}
