/**
 * In async storage we have keys for (1) "statCategories", (2) "lastCategoryId", (3) "backupDirectory",
 * and (4) things listed under dataPoints. backupDirectory is the only thing not needed for the export.
 */

// List of data types stored with keys in the format "<StatCategoryId>_dataPoint"
export const dataPoints = ['statTypes', 'entries'];

export interface IBackupData {
  statCategories: IStatCategory[];
  lastCategoryId: number;
  statTypes: object; // object with keys <StatCategoryId>
  entries: object; // object with keys <StatCategoryId>
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

export interface IMultiValueStat {
  best: number;
  avg: number;
  sum: number;
}

export interface IStatType {
  id: number;
  name: string;
  unit?: string;
  order: number; // goes from 1 to statTypes.length with no gaps
  variant: StatTypeVariant;
  // choices?: string[]; // MULTIPLE_CHOICE only
  // formula?: string; // FORMULA only
  multipleValues?: boolean; // NON_NUMERIC, LOWER_IS_BETTER and HIGHER_IS_BETTER only
  showBest?: boolean; // LOWER_IS_BETTER and HIGHER_IS_BETTER only
  showAvg?: boolean; // LOWER_IS_BETTER and HIGHER_IS_BETTER only
  showSum?: boolean; // LOWER_IS_BETTER and HIGHER_IS_BETTER only
  trackPBs?: boolean; // LOWER_IS_BETTER and HIGHER_IS_BETTER only
  // trackWorst?: boolean; // LOWER_IS_BETTER and HIGHER_IS_BETTER only
  // If this is unset that means there aren't any pbs yet for this stat type
  pbs?: {
    allTime: {
      entryId: number | IMultiValueStat;
      result: number | IMultiValueStat;
    };
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
  multiValueStats?: IMultiValueStat;
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
