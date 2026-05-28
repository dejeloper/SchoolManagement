import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiResult, User, CreateUserDto, UpdateUserDto} from '../interfaces/models';
import {ApiService} from '../api.service';

@Injectable({providedIn: 'root'})
export class UserService {
  private readonly path = '/users';

  constructor(private api: ApiService) { }

  getAll(): Observable<ApiResult<User[]>> {
    return this.api.get<User[]>(this.path);
  }

  getById(id: number): Observable<ApiResult<User>> {
    return this.api.get<User>(`${this.path}/${id}`);
  }

  create(dto: CreateUserDto): Observable<ApiResult<User>> {
    return this.api.post<User>(this.path, dto);
  }

  update(id: number, dto: UpdateUserDto): Observable<ApiResult<User>> {
    return this.api.put<User>(`${this.path}/${id}`, dto);
  }

  delete(id: number): Observable<ApiResult<null>> {
    return this.api.delete<null>(`${this.path}/${id}`);
  }
}
