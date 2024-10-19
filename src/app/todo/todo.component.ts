import { Component, OnInit } from '@angular/core';

interface Task {
title: any;
  name: string;
  completed: boolean;
  important: boolean;
  urgent: boolean; 
  addedTime: Date;
  dueDate?: Date; 
  notes?: string; 
  isUrgent: boolean; // Nouvelle propriété pour indiquer si la tâche est urgente
  priority?: number; 
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  newTask: string = '';
  newTaskNotes: string = ''; 
  newTaskDueDate: Date | null = null; 
  tasks: Task[] = [];
  filter: string = 'all'; 
  editingTask: Task | null = null; // Gérer la tâche en cours d'édition
  editingTaskName: string = ''; // Pour stocker le nom de la tâche pendant l'édition

  ngOnInit(): void {
    this.loadTasks();
  }

  saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }

  addTask() {
    if (this.newTask.trim()) {
      const newTaskObj: Task = {
        name: this.newTask,
        completed: false,
        important: false,
        urgent: false,
        addedTime: new Date(),
        dueDate: this.newTaskDueDate || undefined,
        notes: this.newTaskNotes || undefined,
        priority: 1,
        isUrgent: false,
        title: undefined
      };
      this.tasks.push(newTaskObj);
      this.newTask = '';
      this.newTaskNotes = '';
      this.newTaskDueDate = null;
      this.saveTasks();
    }
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t !== task);
    this.saveTasks();
  }

  toggleComplete(task: Task) {
    task.completed = !task.completed;
    this.saveTasks();
  }

  toggleImportant(task: Task) {
    task.important = !task.important;
    this.saveTasks();
  }

  toggleUrgent(task: Task) {
    task.urgent = !task.urgent;
    this.saveTasks();
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.editingTaskName = task.name; // Remplir le champ d'entrée avec le nom de la tâche
  }

  updateTask() {
    if (this.editingTask) {
      this.editingTask.name = this.editingTaskName; // Mettre à jour le nom de la tâche
      this.editingTask = null; // Réinitialiser le mode d'édition
      this.editingTaskName = ''; // Réinitialiser le champ d'entrée
      this.saveTasks(); // Enregistrez les modifications
    }
  }

  filterTasks(): Task[] {
    let filteredTasks = this.tasks;
    if (this.filter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (this.filter === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    }
    return this.sortTasks(filteredTasks); 
  }

  sortTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

  markAsUrgent(task: Task) {
    task.isUrgent = !task.isUrgent; // Bascule l'état de l'urgence
  }
  remainingTasks(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  allCompleted(): boolean {
    return this.tasks.length > 0 && this.tasks.every(t => t.completed);
  }
}
