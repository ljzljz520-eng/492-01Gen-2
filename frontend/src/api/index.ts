import request from './request';
import type { Hall, Project, Worker, Schedule, Acceptance, Dismantle, DamagePhoto } from '../types';

export const hallsApi = {
  getAll: () => request.get<Hall[]>('/halls'),
  getOne: (id: number) => request.get<Hall>(`/halls/${id}`),
  create: (data: Partial<Hall>) => request.post<Hall>('/halls', data),
  update: (id: number, data: Partial<Hall>) => request.patch<Hall>(`/halls/${id}`, data),
  remove: (id: number) => request.delete(`/halls/${id}`),
};

export const projectsApi = {
  getAll: (params?: Record<string, any>) => request.get<Project[]>('/projects', { params }),
  getOne: (id: number) => request.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => request.post<Project>('/projects', data),
  update: (id: number, data: Partial<Project>) => request.patch<Project>(`/projects/${id}`, data),
  remove: (id: number) => request.delete(`/projects/${id}`),
};

export const workersApi = {
  getAll: (params?: Record<string, any>) => request.get<Worker[]>('/workers', { params }),
  getOne: (id: number) => request.get<Worker>(`/workers/${id}`),
  create: (data: Partial<Worker>) => request.post<Worker>('/workers', data),
  update: (id: number, data: Partial<Worker>) => request.patch<Worker>(`/workers/${id}`, data),
  remove: (id: number) => request.delete(`/workers/${id}`),
  getAvailable: (type: string) => request.get<Worker[]>(`/workers/available?type=${type}`),
};

export const schedulesApi = {
  getAll: (params?: Record<string, any>) => request.get<Schedule[]>('/schedules', { params }),
  getOne: (id: number) => request.get<Schedule>(`/schedules/${id}`),
  create: (data: Partial<Schedule>) => request.post<Schedule>('/schedules', data),
  update: (id: number, data: Partial<Schedule>) => request.patch<Schedule>(`/schedules/${id}`, data),
  remove: (id: number) => request.delete(`/schedules/${id}`),
  getByProject: (projectId: number) => request.get<Schedule[]>(`/schedules/project/${projectId}`),
};

export const acceptancesApi = {
  getAll: (params?: Record<string, any>) => request.get<Acceptance[]>('/acceptances', { params }),
  getOne: (id: number) => request.get<Acceptance>(`/acceptances/${id}`),
  create: (data: Partial<Acceptance>) => request.post<Acceptance>('/acceptances', data),
  update: (id: number, data: Partial<Acceptance>) => request.patch<Acceptance>(`/acceptances/${id}`, data),
  remove: (id: number) => request.delete(`/acceptances/${id}`),
  getByProject: (projectId: number) => request.get<Acceptance[]>(`/acceptances/project/${projectId}`),
};

export const dismantlesApi = {
  getAll: (params?: Record<string, any>) => request.get<Dismantle[]>('/dismantles', { params }),
  getOne: (id: number) => request.get<Dismantle>(`/dismantles/${id}`),
  create: (data: Partial<Dismantle>) => request.post<Dismantle>('/dismantles', data),
  update: (id: number, data: Partial<Dismantle>) => request.patch<Dismantle>(`/dismantles/${id}`, data),
  remove: (id: number) => request.delete(`/dismantles/${id}`),
  getByProject: (projectId: number) => request.get<Dismantle[]>(`/dismantles/project/${projectId}`),
};

export const damagePhotosApi = {
  getAll: (dismantleId?: number) => request.get<DamagePhoto[]>(`/damage-photos${dismantleId ? `?dismantleId=${dismantleId}` : ''}`),
  getOne: (id: number) => request.get<DamagePhoto>(`/damage-photos/${id}`),
  create: (data: Partial<DamagePhoto>) => request.post<DamagePhoto>('/damage-photos', data),
  update: (id: number, data: Partial<DamagePhoto>) => request.patch<DamagePhoto>(`/damage-photos/${id}`, data),
  remove: (id: number) => request.delete(`/damage-photos/${id}`),
  getByDismantle: (dismantleId: number) => request.get<DamagePhoto[]>(`/damage-photos/dismantle/${dismantleId}`),
};
