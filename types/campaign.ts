export type CampaignStatus = 'Active' | 'Pending' | 'Completed';

export interface Campaign {
  id: number;
  title: string;
  beneficiary: string;
  raised: number;
  goal: number;
  donors: number;
  endDate: string;
  status: CampaignStatus;
}