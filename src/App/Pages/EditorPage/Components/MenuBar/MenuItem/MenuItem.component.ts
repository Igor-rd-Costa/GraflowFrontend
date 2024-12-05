import { Component, Input } from '@angular/core';

@Component({
  selector: 'MenuItem',
  standalone: true,
  imports: [],
  templateUrl: './MenuItem.component.html',
  styleUrl: './MenuItem.component.css'
})
export class MenuItem {
  @Input() icon: string|null = null;
  @Input({required: true}) heading: string = "";
}
