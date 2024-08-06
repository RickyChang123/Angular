import { Component, computed, inject, signal } from '@angular/core';

import { TaskItemComponent } from './task-item/task-item.component';
import { TasksService } from '../tasks.service';
import { TASK_STATUS_OPTIONS, taskStatusOptionsProvider } from '../task.model';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [TaskItemComponent],
  providers: [taskStatusOptionsProvider],
})
export class TasksListComponent {
  private tasksService = inject(TasksService);
  private selectedFilter = signal<string>('all');
  // tasks = this.tasksService.addTask;
  taskStatusOption = inject(TASK_STATUS_OPTIONS);
  tasks = computed(() => {
    switch (this.selectedFilter()) {
      case 'open':
        return this.tasksService
          .allTask()
          .filter((task) => task.status === 'OPEN');

      case 'im-progress':
        return this.tasksService
          .allTask()
          .filter((task) => task.status === 'IN_PROGRESS');

      case 'done':
        return this.tasksService
          .allTask()
          .filter((task) => task.status === 'DONE');
      default:
        return this.tasksService.allTask();
    }
  });

  onChangeTasksFilter(filter: string) {
    this.selectedFilter.set(filter);
  }
}
