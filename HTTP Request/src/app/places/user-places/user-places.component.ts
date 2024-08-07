import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {
  isFetching = signal(false);
  error = signal('');
  private placeService = inject(PlacesService);
  private detoryRef = inject(DestroyRef);
  places = this.placeService.loadedUserPlaces;

  ngOnInit(): void {
    this.isFetching.set(true);
    //拿後端的資料
    const subscription = this.placeService.loadUserPlaces().subscribe({
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

  onRemovePlace(place: Place) {
    const subscription = this.placeService.removeUserPlace(place).subscribe();

    this.detoryRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
