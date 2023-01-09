import { isNewerOrSameDate, isOlderOrSameDate } from '../shared/GlobalFunctions';
import {
  IMultiValuePBsWorsts,
  IEntry,
  IStatType,
  IStat,
  StatTypeVariant,
  IPBsWorsts,
  IDate,
} from '../shared/DataStructure';

const verbose = __DEV__ ? 2 : 0;

const getTimeKeys = (statType: IStatType): string[] => {
  const keys = [];

  if (statType.trackPBs) keys.push('allTime');
  if (statType.trackYearPBs) keys.push('year');
  if (statType.trackMonthPBs) keys.push('month');

  return keys;
};

const getPBDate = (entries: IEntry[], entryId: number): IDate => {
  return (
    entries.find((el) => el.id === entryId)?.date || {
      year: 0,
      month: 0,
      day: 0,
    }
  );
};

export const addEditEntry = (entries: IEntry[], entry: IEntry, newEntry = false): IEntry[] => {
  if (verbose) {
    console.log(`${newEntry ? 'Adding' : 'Editing'} entry:`);
    console.log(JSON.stringify(entry, null, 2));
  }

  let newEntries: IEntry[] = [];
  let inserted = false;

  if (entries.length > 0) {
    if (newEntry) {
      if (!isNewerOrSameDate(entry.date, entries[0].date)) {
        for (let e of entries) {
          if (!inserted && isNewerOrSameDate(entry.date, e.date)) {
            if (verbose) console.log('Adding entry in the middle');
            newEntries.push(entry);
            inserted = true;
          }
          newEntries.push(e);
        }

        // If it's to become the very last element in the array of entries
        if (!inserted) {
          if (verbose) console.log('Adding entry at the bottom');
          newEntries.push(entry);
        }
      } else {
        if (verbose) console.log('Adding entry at the top');
        newEntries = [entry, ...entries];
      }
    } else {
      let differentDate = true;
      const uneditedEntry = entries.find((el) => el.id === entry.id);

      if (!!uneditedEntry.date === !!entry.date) {
        differentDate =
          !!uneditedEntry.date &&
          (uneditedEntry.date.day !== entry.date.day ||
            uneditedEntry.date.month !== entry.date.month ||
            uneditedEntry.date.year !== entry.date.year);
      }

      if (differentDate) {
        for (let e of entries) {
          if (!inserted && isNewerOrSameDate(entry.date, e.date)) {
            if (verbose) console.log('Reordering the entry');
            newEntries.push(entry);
            inserted = true;
          }
          if (e.id !== entry.id) {
            newEntries.push(e);
          }
        }

        // If it's to become the very last element in the array of entries
        if (!inserted) {
          if (verbose) console.log('Reordering it to the bottom');
          newEntries.push(entry);
        }
      } else {
        if (verbose) console.log('Date is the same, not reordering');
        newEntries = entries.map((el) => (el.id === entry.id ? entry : el));
      }
    }
  } else {
    if (verbose) console.log('Adding first entry');
    // When there are no entries in the array
    newEntries.push(entry);
  }

  return newEntries;
};

// The return value is whether or not the PB got updated
export const updateStatTypePB = (
  state: any,
  statType: IStatType,
  entry: IEntry,
  singleUpdate = true,
): boolean => {
  if (verbose) console.log(`Checking if entry ${entry.id} has the PB for stat type ${statType.name}`);

  let pbUpdated = false;
  const stat = entry.stats.find((el: IStat) => el.type === statType.id);

  if (stat) {
    for (let timeKey of getTimeKeys(statType)) {
      let pbs = {} as IMultiValuePBsWorsts; // for overwriting the keys of statType.pbs[timeKey].result if PB is better

      if (!statType.multipleValues) {
        pbs.best = stat.values[0] as number;
      } else {
        pbs.best = statType.higherIsBetter ? stat.multiValueStats.high : stat.multiValueStats.low;
        pbs.avg = stat.multiValueStats.avg;
        pbs.sum = stat.multiValueStats.sum;
      }

      // If adding PB for the first time
      if (!statType.pbs || !statType.pbs[timeKey]) {
        if (!statType.pbs) statType.pbs = {} as IPBsWorsts;

        statType.pbs[timeKey] = {
          entryId: { best: entry.id },
          result: pbs,
        };

        if (statType.multipleValues) {
          statType.pbs[timeKey].entryId.avg = entry.id;
          statType.pbs[timeKey].entryId.sum = entry.id;
        }

        pbUpdated = true;
      } else {
        Object.keys(statType.pbs[timeKey].entryId).forEach((key) => {
          let fitsTimeFrame = false;
          let isNewPB = false;
          let pbDate;

          if (timeKey === 'allTime') fitsTimeFrame = true;
          else {
            pbDate = getPBDate(state.entries, statType.pbs[timeKey].entryId[key]);

            if (entry.date.year >= pbDate.year) {
              if (timeKey === 'year') fitsTimeFrame = true;
              else if (entry.date.year > pbDate.year || entry.date.month >= pbDate.month)
                fitsTimeFrame = true;
            }
          }

          if (fitsTimeFrame) {
            if (statType.pbs[timeKey].entryId[key] === null) isNewPB = true;
            else if (statType.higherIsBetter && pbs[key] > statType.pbs[timeKey].result[key]) isNewPB = true;
            else if (!statType.higherIsBetter && pbs[key] < statType.pbs[timeKey].result[key]) isNewPB = true;
            else {
              if (!pbDate) pbDate = getPBDate(state.entries, statType.pbs[timeKey].entryId[key]);

              if (pbs[key] === statType.pbs[timeKey].result[key]) {
                if (singleUpdate && !isNewerOrSameDate(entry.date, pbDate)) isNewPB = true;
                else if (!singleUpdate && isOlderOrSameDate(entry.date, pbDate)) isNewPB = true;
              } else if (timeKey !== 'allTime') {
                isNewPB =
                  entry.date.year > pbDate.year || (timeKey === 'month' && entry.date.month > pbDate.month);
              }
            }
          }

          if (fitsTimeFrame && isNewPB) {
            statType.pbs[timeKey].entryId[key] = entry.id;
            statType.pbs[timeKey].result[key] = pbs[key];

            pbUpdated = true;
          }
        });
      }
    }
  }

  return pbUpdated;
};

export const checkPBFromScratch = (state: any, statType: IStatType, prevPBid = null as number): boolean => {
  if (verbose) {
    console.log(`Checking PB from scratch for stat type:`);
    console.log(JSON.stringify(statType, null, 2));
  }

  const tempStatType = { ...statType, pbs: {} as IPBsWorsts };
  const keys = getTimeKeys(statType);
  let checkNeeded = prevPBid === null;

  if (statType.trackPBs && statType.pbs?.allTime) {
    tempStatType.pbs.allTime = {
      entryId: { ...statType.pbs.allTime.entryId },
      result: { ...statType.pbs.allTime.result },
    };
  }
  if (statType.trackYearPBs && statType.pbs?.year) {
    tempStatType.pbs.year = {
      entryId: { ...statType.pbs.year.entryId },
      result: { ...statType.pbs.year.result },
    };
  }
  if (statType.trackMonthPBs && statType.pbs?.month) {
    tempStatType.pbs.month = {
      entryId: { ...statType.pbs.month.entryId },
      result: { ...statType.pbs.month.result },
    };
  }

  if (prevPBid !== null) {
    keys.forEach((key) => {
      Object.keys(tempStatType.pbs[key].entryId).forEach((key2) => {
        if (statType.pbs[key].entryId[key2] === prevPBid) {
          checkNeeded = true;
          tempStatType.pbs[key].entryId[key2] = null;
          tempStatType.pbs[key].result[key2] = null;
        }
      });
    });
  }

  if (checkNeeded) {
    const newestEntry = state.entries.find((e) => e.stats.find((st) => st.type === tempStatType.id));

    if (newestEntry) {
      if (verbose) console.log('Doing check from scratch');

      for (let e of state.entries) {
        if (!statType.trackPBs) {
          if (!statType.trackYearPBs) {
            // If we got here, we are only tracking month PBs
            if (e.date.year < newestEntry.date.year || e.date.month < newestEntry.date.month) break;
          } else if (e.date.year < newestEntry.date.year) break;
        }

        updateStatTypePB(state, tempStatType, e, false);
      }
    } else if (verbose) console.log('Not doing check from scratch');
  } else if (verbose) console.log('Not doing check from scratch');

  let pbUpdated = false;

  if (prevPBid !== null) {
    keys.forEach((key) => {
      // If this or .avg or .sum is null, that means no entries are left with this stat type
      if (tempStatType.pbs[key].entryId.best === null) {
        if (verbose) console.log(`No entries left for stat type ${statType.name}`);

        pbUpdated = true;
        delete statType.pbs[key];
        if (Object.keys(statType.pbs).length === 0) delete statType.pbs;
      } else if (
        !!Object.keys(tempStatType.pbs[key].entryId).find(
          (key2) =>
            tempStatType.pbs[key].entryId[key2] !== statType.pbs[key]?.entryId[key2] ||
            tempStatType.pbs[key].result[key2] !== statType.pbs[key].result[key2],
        )
      ) {
        pbUpdated = true;
        statType.pbs[key] = tempStatType.pbs[key];
      }
    });
  } else {
    if (tempStatType.pbs && Object.keys(tempStatType.pbs).length > 0) statType.pbs = tempStatType.pbs;
    pbUpdated = true;
  }

  if (verbose) {
    console.log('Stat type after PB check from scratch:');
    console.log(JSON.stringify(statType, null, 2));
  }

  return pbUpdated;
};

export const updatePBs = (state: any, entry: IEntry, mode: 'add' | 'edit' | 'delete') => {
  let PBsUpdated = false;

  for (let statType of state.statTypes) {
    if (
      (statType.trackPBs || statType.trackMonthPBs || statType.trackYearPBs) &&
      statType.variant === StatTypeVariant.NUMBER
    ) {
      if (verbose) console.log(`Updating PB for stat type ${statType.name}`);

      let pbUpdated = false;

      // Update PB if it could have gotten better or it's a tie, but happened earlier
      if (mode !== 'delete') {
        pbUpdated = updateStatTypePB(state, statType, entry, true);
      }
      // Update PB if it could have gotten worse
      if (mode !== 'add' && statType.pbs) {
        pbUpdated = checkPBFromScratch(state, statType, entry.id) || pbUpdated;
      }

      PBsUpdated = pbUpdated || PBsUpdated;

      if (verbose) {
        if (pbUpdated) console.log('PB updated to: ', JSON.stringify(statType.pbs, null, 2));
        else console.log('PB not updated');
      }
    }
  }

  return PBsUpdated;
};
