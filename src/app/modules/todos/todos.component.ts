import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../amplify/data/resource';

const client = generateClient<Schema>();

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
  todos: any[] = [];
  users: any[] = [];
  ads: any [] = [];
  
  ngOnInit(): void {
    this.listUsers();
    this.listTodos();
    
  }

  ngAfterViewInit(): void {
    this.listUsers();
    this.listTodos();
    this.listAds();
  }

  listTodos() {
    try {
      client.models.Todo.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.todos = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  listAds() {
    try {
      client.models.Ads.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.ads = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  listUsers() {
    try {
      client.models.User.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.users = items;
        },
      });
    } catch (error) {
      console.error('error fetching todos', error);
    }
  }

  createTodo() {
    try {
      client.models.Todo.create({
        content: window.prompt('Todo content'),
      });
      this.listTodos();
    } catch (error) {
      console.error('error creating todos', error);
    }
  }


 async createUser() {
    try {
      console.log(client.models)
     await client.models?.User?.create({
        name: window.prompt('User name'),
        email: 'teste@email.com'
      }, {
        authMode: 'userPool'
      });
      this.listUsers();
    } catch (error) {
      console.error('error creating todos', error);
    }
     
  }

  deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  deleteUser(id: string) {
    client.models.User.delete({ id })
  }

  deleteAds(id: string) {
    client.models.Ads.delete({ id })
  }
}
