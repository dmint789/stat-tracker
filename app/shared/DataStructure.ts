/**
 * In async storage there are keys for (1) "statCategories", (2) "lastCategoryId", (3) "backupDirectory",
 * and (4) things listed under dataPoints. backupDirectory is the only thing not needed for the export.
 *
 * List of data types stored in async storage with keys in the format "<StatCategoryId>_dataPoint"
 * In exports these are stored as:
 * dataPoint: {
 *   "StatCategoryId": [...],
 *   "StatCategoryId": [...],
 *   ...
 * }
 */
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
  TEXT,
  NUMBER,
  MULTIPLE_CHOICE,
  FORMULA,
}

export interface IMultiValuePBsWorsts {
  best: number; // best for pbs and worst for worsts
  avg?: number;
  sum?: number;
}

export interface IPBsWorsts {
  allTime?: {
    entryId: IMultiValuePBsWorsts;
    result: IMultiValuePBsWorsts;
  };
  // Only tracks the PB for the most recent year
  year?: {
    entryId: IMultiValuePBsWorsts;
    result: IMultiValuePBsWorsts;
  };
  // Only tracks the PB for the most recent month
  month?: {
    entryId: IMultiValuePBsWorsts;
    result: IMultiValuePBsWorsts;
  };
}

export interface IChoice {
  id: number;
  label: string;
  // color: SelectColor;
}

export interface IStatType {
  id: number;
  name: string;
  unit?: string;
  order: number; // goes from 1 to statTypes.length with no gaps
  variant: StatTypeVariant;
  // for MULTIPLE_CHOICE this is the id of the default choice
  defaultValue?: string | number;
  higherIsBetter?: boolean; // NUMBER only
  choices?: IChoice[]; // MULTIPLE_CHOICE only
  // formula?: string; // FORMULA only
  multipleValues?: boolean; // TEXT and NUMBER only
  showBest?: boolean; // NUMBER only
  showAvg?: boolean; // NUMBER only
  showSum?: boolean; // NUMBER only
  trackPBs?: boolean; // TEXT (manual) and NUMBER only
  trackMonthPBs?: boolean; // NUMBER only
  trackYearPBs?: boolean; // NUMBER only
  // trackWorst?: boolean; // NUMBER only
  // If this is unset and trackPBs is on, that means there aren't any pbs yet for this stat type
  pbs?: IPBsWorsts;
  // worsts?: IPBsWorsts;
}

export interface IEntry {
  id: number;
  stats: IStat[];
  comment: string;
  date?: IDate;
}

export interface IMultiValueStat {
  low: number; // lowest value
  high: number; // highest value
  avg: number;
  sum: number;
}

export interface IStat {
  id: number;
  type: number | null; // ID of stat type or null if not yet chosen
  values?: string[] | number[]; // unset if stat type is a formula
  multiValueStats?: IMultiValueStat;
  // hadPB?: boolean;
}

export interface IDate {
  day: number;
  month: number; // 1 - 12
  year: number;
}

export type SelectColor = 'red' | 'gray';

export interface ISelectOption {
  label: string;
  value: number;
  color?: SelectColor; // default is red
}
