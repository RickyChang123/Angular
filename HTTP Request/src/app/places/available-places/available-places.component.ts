import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false);
  error = signal('');
  // private httpClient = inject(HttpClient);
  private detoryRef = inject(DestroyRef);
  private placeService = inject(PlacesService);

  // constructor(private httpClient: HttpClient){}

  ngOnInit() {
    this.isFetching.set(true);
    //從拿後端的資料
    const subscription = this.placeService.loadAvailablePlaces().subscribe({
      next: (places) => {
        this.places.set(places);
      },
      error: (error: Error) => {
        this.error.set(error.message);
      },
      //為了保證只執行一次
      complete: () => {
        this.isFetching.set(false);
      },
    });

    this.detoryRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  //將資料送到後端
  onSelectPlace(selectPlace: Place) {
    const subscription = this.placeService
      .addPlaceToUserPlaces(selectPlace)
      .subscribe({
        next: (resData) => console.log(resData),
      });

    this.detoryRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
