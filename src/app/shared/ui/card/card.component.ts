import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 16px;
      margin-bottom: 16px;
      border: 1px solid #e9ecef;
    }

    .card-header {
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      margin: -16px -16px 16px -16px;
      padding: 12px 16px;
      border-radius: 8px 8px 0 0;
    }

    .card-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  `]
})
export class CardComponent {
  @Input() variant: 'default' | 'header' = 'default';

  get cardClass(): string {
    return `card ${this.variant === 'header' ? 'card-header' : ''}`;
  }
}
