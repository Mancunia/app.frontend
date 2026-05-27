export type periodReq = {
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  active?: boolean;
};

export type periodRes = {
  id: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  year: number;
  month: number;
};

export type AppConfig = {
  autoPeriodCreation: boolean;
};
