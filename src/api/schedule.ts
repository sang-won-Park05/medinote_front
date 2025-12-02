// src/api/schedule.ts
// Schedule endpoints client using shared apiClient.

import { apiClient } from "./axios";

export interface ScheduleResponse {
  id: string;
  title: string;
  type: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  memo: string;
  created_at: string;
}

export interface CreateScheduleRequest {
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  memo: string;
}

export type CreateScheduleResponse = ScheduleResponse;

export interface UpdateScheduleRequest {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  memo?: string;
}

export type UpdateScheduleResponse = ScheduleResponse;

export type GetSchedulesResponse = ScheduleResponse[];

export async function getSchedules(): Promise<GetSchedulesResponse> {
  const res = await apiClient.get<GetSchedulesResponse>("/schedule/");
  return res.data;
}

export async function getSchedule(scheduleId: string): Promise<ScheduleResponse> {
  const res = await apiClient.get<ScheduleResponse>(`/schedule/${scheduleId}`);
  return res.data;
}

export async function createSchedule(
  payload: CreateScheduleRequest
): Promise<CreateScheduleResponse> {
  const res = await apiClient.post<CreateScheduleResponse>("/schedule/", payload);
  return res.data;
}

export async function updateSchedule(
  scheduleId: string,
  payload: UpdateScheduleRequest
): Promise<UpdateScheduleResponse> {
  const res = await apiClient.patch<UpdateScheduleResponse>(
    `/schedule/${scheduleId}`,
    payload
  );
  return res.data;
}

export async function deleteSchedule(scheduleId: string): Promise<string> {
  const res = await apiClient.delete<string>(`/schedule/${scheduleId}`);
  return res.data;
}
