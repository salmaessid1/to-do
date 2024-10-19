import { Component, OnInit } from '@angular/core';

interface Task {
  name: string;
  completed: boolean;
  important: boolean;
  urgent: boolean; // Nouvelle propriété pour les tâches urgentes
  addedTime: Date;
  dueDate?: Date; // Date d'échéance
  notes?: string; // Notes sur la tâche
  priority?: number; // Priorité de la tâche
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  newTask: string = '';
  newTaskNotes: string = ''; // Notes pour la nouvelle tâche
  newTaskDueDate: Date | null = null; // Date d'échéance pour la nouvelle tâche
  tasks: Task[] = [];
  filter: string = 'all'; // Filtrer les tâches (all, completed, active)
  editingTask: Task | null = null;

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
        dueDate: this.newTaskDueDate || undefined, // Ajout de la date d'échéance
        notes: this.newTaskNotes || undefined, // Ajout des notes
        priority: 1 // Par défaut, priorité de 1
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
  }

  updateTask(task: Task) {
    this.editingTask = null;
    this.saveTasks();
  }

  filterTasks(): Task[] {
    let filteredTasks = this.tasks;
    if (this.filter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (this.filter === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    }
    return this.sortTasks(filteredTasks); // Tri des tâches après filtrage
  }

  // Fonction pour trier les tâches par priorité
  sortTasks(tasks: Task[]): Task[] {
    return tasks.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

  remainingTasks(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  allCompleted(): boolean {
    return this.tasks.length > 0 && this.tasks.every(t => t.completed);
  }

  // Ajouter une fonction pour marquer une tâche comme urgente
  markAsUrgent(task: Task) {
    task.urgent = !task.urgent;
    this.saveTasks();
  }

  // Ajouter une fonction pour définir un rappel (simple exemple)
  setReminder(task: Task, minutes: number) {
    const reminderTime = new Date(task.addedTime);
    reminderTime.setMinutes(reminderTime.getMinutes() + minutes);
    // Logique pour gérer la notification par email
    console.log(`Reminder set for ${task.name} in ${minutes} minutes!`);
  }

  
}
