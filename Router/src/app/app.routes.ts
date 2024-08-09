import { CanMatchFn, RedirectCommand, Router, Routes } from '@angular/router';
import { NoTaskComponent } from './tasks/no-task/no-task.component';
import { TasksComponent } from './tasks/tasks.component';
import {
  resolveTitle,
  resolveUserName,
  UserTasksComponent,
} from './users/user-tasks/user-tasks.component';
import {
  canLeaveEditPage,
  NewTaskComponent,
} from './tasks/new-task/new-task.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { Component, inject } from '@angular/core';

// const dummyCanMatch: CanMatchFn = (route, segments) => {
//   const router = inject(Router);
//   const shouldGetAccess = Math.random();
//   if (shouldGetAccess < 0.5) {
//     return true;
//   }
//   return new RedirectCommand(router.parseUrl('/unautorized'));
// };

export const routes: Routes = [
  {
    path: '',
    component: NoTaskComponent,
    title: 'No task',
  },
  {
    path: 'user/:userId', //dynamic path :name
    component: UserTasksComponent,
    children: [
      {
        path: 'tasks', // ../users/<uid>/tasks
        component: TasksComponent,
      },
      {
        path: 'tasks/new',
        component: NewTaskComponent,
        canDeactivate: [canLeaveEditPage],
      },
    ],
    // canMatch: [dummyCanMatch],
    data: { message: 'Hello' }, //靜態數據

    resolve: {
      //動態數據
      userName: resolveUserName,
    },
    title: resolveTitle,
  },
  {
    path: '**', //到無效路徑
    component: NotFoundComponent,
  },
];
