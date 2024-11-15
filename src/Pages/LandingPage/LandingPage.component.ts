import { Component } from '@angular/core';
import { Header } from "../../Components/Header/Header.component";

@Component({
  selector: 'LandingPage',
  standalone: true,
  imports: [Header],
  templateUrl: './LandingPage.component.html',
  styleUrl: './LandingPage.component.css'
})
export class LandingPage {

}