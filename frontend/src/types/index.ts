export interface Hall {
  id: number;
  name: string;
  location: string;
  boothCount: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'pending' | 'in_progress' | 'accepted' | 'dismantling' | 'completed';

export interface Project {
  id: number;
  name: string;
  boothNumber: string;
  boothArea: number;
  description: string;
  hallId: number;
  hall?: Hall;
  entryTime: string;
  buildDeadline: string;
  dismantleStartTime: string;
  carpenterNeeded: number;
  electricianNeeded: number;
  decoratorNeeded: number;
  forkliftNeeded: number;
  nightWorkRequired: boolean;
  status: ProjectStatus;
  projectManager: string;
  clientName: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkerType = 'carpenter' | 'electrician' | 'decorator' | 'forklift_driver';

export interface Worker {
  id: number;
  name: string;
  phone: string;
  type: WorkerType;
  idCard: string;
  hasCertificate: boolean;
  certificateNumber: string;
  certificateExpiry: string;
  hasNightWorkPermit: boolean;
  nightWorkPermitExpiry: string;
  isAvailable: boolean;
  skills: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export type ScheduleShift = 'morning' | 'afternoon' | 'night';
export type ScheduleStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Schedule {
  id: number;
  projectId: number;
  project?: Project;
  workerId: number;
  worker?: Worker;
  workDate: string;
  shift: ScheduleShift;
  startTime: string;
  endTime: string;
  workContent: string;
  status: ScheduleStatus;
  needTools: boolean;
  tools: string;
  nightWork: boolean;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export type AcceptanceStatus = 'pending' | 'passed' | 'failed' | 'recheck';

export interface Acceptance {
  id: number;
  projectId: number;
  project?: Project;
  inspectionTime: string;
  inspector: string;
  status: AcceptanceStatus;
  woodworkQuality: string;
  electricalSafety: string;
  decorationQuality: string;
  fireSafety: string;
  overallScore: string;
  issues: string;
  rectificationDeadline: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export type DismantleStatus = 'pending' | 'in_progress' | 'damage_checked' | 'waste_cleared' | 'completed';
export type DepositStatus = 'paid' | 'refunded' | 'deducted' | 'pending';

export interface Dismantle {
  id: number;
  projectId: number;
  project?: Project;
  startTime: string;
  endTime: string;
  status: DismantleStatus;
  depositAmount: number;
  depositStatus: DepositStatus;
  depositRefunded: number;
  damageDeduction: number;
  damageDescription: string;
  wasteCleared: boolean;
  wasteFee: number;
  wasteCompany: string;
  wasteReceiptNo: string;
  inspector: string;
  remark: string;
  createdAt: string;
  updatedAt: string;
}

export interface DamagePhoto {
  id: number;
  dismantleId: number;
  photoUrl: string;
  description: string;
  location: string;
  estimatedCost: number;
  createdAt: string;
}
