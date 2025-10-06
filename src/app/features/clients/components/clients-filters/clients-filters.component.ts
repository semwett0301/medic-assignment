import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { RadioComponent, RadioOption } from '../../../../shared/ui/radio/radio.component';

@Component({
  selector: 'app-clients-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, CardComponent, RadioComponent],
  templateUrl: './clients-filters.component.html',
  styleUrl: './clients-filters.component.scss'
})
export class ClientsFiltersComponent {
  @Input() searchTerm: string = '';
  @Input() activeFilter: boolean | null = null;

  @Output() searchChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<boolean | null>();

  // Radio options for status filter
  statusFilterOptions: RadioOption[] = [
    { value: null, label: 'All Clients' },
    { value: true, label: 'Active Only' },
    { value: false, label: 'Inactive Only' }
  ];

  onSearchChange(term: string): void {
    this.searchChange.emit(term);
  }

  onFilterChange(isActive: boolean | null): void {
    this.filterChange.emit(isActive);
  }
}
