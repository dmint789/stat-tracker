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

export interface IMultiValuePB {
  best: number;
  avg?: number;
  sum?: number;
}

// export interface IMultiValueWorst {
//   worst: number;
//   avg?: number;
//   sum?: number;
// }

export interface IStatType {
  id: number;
  name: string;
  unit?: string;
  order: number; // goes from 1 to statTypes.length with no gaps
  variant: StatTypeVariant;
  // default?: string | number;
  higherIsBetter?: boolean; // NUMBER only
  // choices?: string[]; // MULTIPLE_CHOICE only
  // formula?: string; // FORMULA only
  multipleValues?: boolean; // TEXT and NUMBER only
  showBest?: boolean; // NUMBER only
  showAvg?: boolean; // NUMBER only
  showSum?: boolean; // NUMBER only
  trackPBs?: boolean; // TEXT (manual) and NUMBER only
  // trackWorst?: boolean; // NUMBER only
  // If this is unset and trackPBs is on, that means there aren't any pbs yet for this stat type
  pbs?: {
    allTime: {
      entryId: IMultiValuePB;
      result: IMultiValuePB;
    };
    // Only tracks the PB for the most recent year
    // year: {
    //   entryId: IMultiValuePB;
    //   result: IMultiValuePB;
    // };
    // Only tracks the PB for the most recent month
    // month: {
    //   entryId: IMultiValuePB;
    //   result: IMultiValuePB
    // };
  };
  // worsts?: {
  //   allTime: {
  //     entryId: IMultiValueWorst;
  //     result: IMultiValueWorst;
  //   }
  // }
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
  values: string[] | number[] | null; // Null if stat type is a formula
  multiValueStats?: IMultiValueStat;
  // hadPB?: boolean;
}

export interface IDate {
  day: number;
  month: number; // 1 - 12
  year: number;
}

export interface ISelectOption {
  label: string;
  value: StatTypeVariant;
}
