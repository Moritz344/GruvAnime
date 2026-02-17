import { Injectable } from '@angular/core';
import { environment } from '../../env/env';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private sessionSubject = new BehaviorSubject<any>(null);
  session$ = this.sessionSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.supabase.auth.onAuthStateChange((event, session: any) => {
      if (session) {
        sessionStorage.setItem("login_status", session.user.role);
      }
      //console.log('Auth event:', event);
      //console.log('Session:', session);
      this.sessionSubject.next(session);
    });

  }

  async detectAuthState() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log("new auth state change:", session)
    });
  }

  async loadUserProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    return data;
  }



  getSession() {
    return this.session$;
  }
  async signUp(email: string, name: string, password: string) {
    console.log("email", email, "password", password);
    const { error } = await this.supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: 'http://localhost:4200',
        data: {
          name: name
        }
      },
    })
    if (error) {
      console.log("Sign Up Error:", error);
    }

  }

  async logIn(email: string, password: string) {
    console.log("email", email, "password", password);
    const { error } = await this.supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      console.log("Login Error:", error);
      return error.message;
    }
    return '';
  }

  async getLoggedInUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  async updateProfile(username: string, email: string) {
    if (username != "") {

      const user = await this.supabase.auth.getUser()
      const user_id = user.data.user?.id;

      const { error } = await this.supabase
        .from('profiles')
        .update({ name: username })
        .eq('id', user_id)

      if (error) {
        console.error("error updating username", error.message)
      }
      console.log("username update");
    }

    if (email != "") {
      const { data, error } = await this.supabase.auth.updateUser({
        email: email
      });
      if (error) {
        console.log("error when updating email", error);
      }
      console.log(data);
      console.log("email update: ");

    }



  }


  async getUserData() {
    let { data: profiles, error } = await this.supabase
      .from('profiles')
      .select('*')

    if (error) {
      console.error(error);
    } else {
      console.log(profiles);
    }


  }

  async logOut() {
    let { error } = await this.supabase.auth.signOut()
    if (error) {
      console.error(error);
    } else {
      console.log("logged out!");
    }

  }

}
