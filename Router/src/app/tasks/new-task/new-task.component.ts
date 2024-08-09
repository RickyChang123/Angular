import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TasksService } from '../tasks.service';
import { CanDeactivateFn, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  userId = input.required<string>();
  enteredTitle = signal('');
  enteredSummary = signal('');
  enteredDate = signal('');
  submitted = false;
  private tasksService = inject(TasksService);
  private router = inject(Router);

  onSubmit() {
    this.tasksService.addTask(
      {
        title: this.enteredTitle(),
        summary: this.enteredSummary(),
        date: this.enteredDate(),
      },
      this.userId()
    );
    this.submitted = true;

    this.router.navigate(['/user', this.userId(), 'tasks'], {
      replaceUrl: true, //確保按返回能到其他頁面
    });
  }
}

export const canLeaveEditPage: CanDeactivateFn<NewTaskComponent> = (
  Component
) => {
  if (Component.submitted) {
    return true;
  }
  if (
    Component.enteredTitle() ||
    Component.enteredDate() ||
    Component.enteredSummary()
  ) {
    return window.confirm(
      'DO you really wnt to leave? You will lose the wntered data.'
    );
  }
  return true;
};
