// In async storage we have keys for (1) "statCategories", (2) "backupDirectory", and (3) things listed under dataPoints.
// backupDirectory is the only thing not needed for the export.

// List of data types stored with keys in the format "Stat Category Name_dataPoint"
export const dataPoints = ['statTypes', 'entries'];

interface IBackup {
  statCategory: string;
  request: string;
  data: any;
}

export class BackupData {
  statCategories: IStatCategory[] = [];
  backup: IBackup[] = [];
}

export interface IStatCategory {
  name: string;
  note: string;
  lastId?: number;
  totalEntries?: number;
}

export interface IStatType {
  name: string;
  unit: string;
}

export interface IEntry {
  id: number;
  stats: IStat[];
  comment: string;
  date: IDate;
}

export interface IStat {
  name: string;
  value: string;
}

export interface IDate {
  day: number;
  month: number;
  year: number;
  text: string;
}
