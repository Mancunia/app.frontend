export type periodReq = {
  startDate: string;
  endDate: string;
  month: string;
  year: string;
  active: true;
};

export type periodRes = {
  id: string;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  year: number;
  month: number;
};
