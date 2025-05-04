// types.ts
export type Employee = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  department: string;
};

export type Schedule = {
  startTime: string;
  endTime: string;
  duration: string;
  role: string;
};

export type ScheduleDay = {
  date: string;
  schedule?: Schedule;
};


type OvertimeStatus = 'New' | 'Approved' | 'Rejected' | 'Pending';

export interface OvertimeEntry {
  id: number;
  employee: {
    name: string;
    avatar: string;
  };
  date: string;
  hours: number;
  type: string;
  description: string;
  status: OvertimeStatus;
  approvedBy: {
    name: string;
    avatar: string;
  };
}

export interface OvertimeStats {
  employeeCount: number;
  totalHours: number;
  pendingRequests: number;
  rejectedRequests: number;
}

export type Notification = {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'message' | 'notification'
}