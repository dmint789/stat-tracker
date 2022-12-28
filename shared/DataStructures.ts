/**
 * In async storage we have keys for (1) "statCategories", (2) "lastCategoryId", (3) "backupDirectory",
 * and (4) things listed under dataPoints. backupDirectory is the only thing not needed for the export.
 */

// List of data types stored with keys in the format "Stat Category Name_dataPoint"
export const dataPoints = ['statTypes', 'entries'];

interface IBackup {
  categoryId: number;
  request: string;
  data: any;
}

export class BackupData {
  statCategories: IStatCategory[] = [];
  backup: IBackup[] = [];
}

export interface IStatCategory {
  id: number;
  name: string;
  note: string;
  lastEntryId?: number;
  lastStatTypeId?: number;
  totalEntries?: number;
}

export enum StatTypeVariant {
  NON_NUMERIC,
  HIGHER_IS_BETTER,
  LOWER_IS_BETTER,
  MULTIPLE_CHOICE,
  FORMULA,
}

export interface IStatType {
  id: number;
  name: string;
  unit?: string;
  order: number;
  variant: StatTypeVariant;
  choices?: string[]; // MULTIPLE_CHOICE only
  formula?: string; // FORMULA only
  multipleValues?: boolean; // NON_NUMERIC, LOWER_IS_BETTER and HIGHER_IS_BETTER only
  showBest?: boolean; // LOWER_IS_BETTER and HIGHER_IS_BETTER only
  showAvg?: boolean; // LOWER_IS_BETTER and HIGHER_IS_BETTER only
  showSum?: boolean; // LOWER_IS_BETTER and HIGHER_IS_BETTER only
  trackPBs?: boolean; // Except MULTIPLE_CHOICE
  pbs?: {
    month: number;
    year: number;
    allTime: string | number;
  };
}

export interface IEntry {
  id: number;
  stats: IStat[];
  comment: string;
  date: IDate;
}

export interface IStat {
  id: number;
  type: number | null; // ID of stat type or null if not yet chosen
  values: string[] | number[] | null; // Null if stat type is a formula
}

export interface IDate {
  day: number;
  month: number;
  year: number;
  text: string;
}

export interface ISelectOption {
  label: string;
  value: StatTypeVariant;
}
