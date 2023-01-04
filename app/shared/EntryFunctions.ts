import { isNewerOrSameDate } from '../shared/GlobalFunctions';
import { IMultiValuePB, IEntry, IStatType, IStat, StatTypeVariant } from '../shared/DataStructure';

export const addEditEntry = (entries: IEntry[], entry: IEntry, newEntry = false): IEntry[] => {
  if (__DEV__) {
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
            if (__DEV__) console.log('Adding entry in the middle');
            newEntries.push(entry);
            inserted = true;
          }
          newEntries.push(e);
        }

        // If it's to become the very last element in the array of entries
        if (!inserted) {
          if (__DEV__) console.log('Adding entry at the bottom');
          newEntries.push(entry);
        }
      } else {
        if (__DEV__) console.log('Adding entry at the top');
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
            if (__DEV__) console.log('Reordering the entry');
            newEntries.push(entry);
            inserted = true;
          }
          if (e.id !== entry.id) {
            newEntries.push(e);
          }
        }

        // If it's to become the very last element in the array of entries
        if (!inserted) {
          if (__DEV__) console.log('Reordering it to the bottom');
          newEntries.push(entry);
        }
      } else {
        if (__DEV__) console.log('Date is the same, not reordering');
        newEntries = entries.map((el) => (el.id === entry.id ? entry : el));
      }
    }
  } else {
    if (__DEV__) console.log('Adding first entry');
    // When there are no entries in the array
    newEntries.push(entry);
  }

  return newEntries;
};

// The return value is whether or not the PB got updated
export const updateStatTypePB = (state: any, statType: IStatType, entry: IEntry): boolean => {
  if (__DEV__) console.log(`Checking if entry ${entry.id} has the PB for stat type ${statType.name}`);

  let pbUpdated = false;
  const stat = entry.stats.find((el: IStat) => el.type === statType.id);

  if (stat) {
    let pbs = {} as IMultiValuePB; // for overwriting the keys of statType.pbs.allTime.result if PB is better

    if (!statType.multipleValues) {
      pbs.best = stat.values[0] as number;
    } else {
      pbs.best = statType.higherIsBetter ? stat.multiValueStats.high : stat.multiValueStats.low;
      pbs.avg = stat.multiValueStats.avg;
      pbs.sum = stat.multiValueStats.sum;
    }

    // If adding PB for the first time
    if (!statType.pbs) {
      statType.pbs = {
        allTime: {
          entryId: { best: entry.id },
          result: pbs,
        },
      };

      if (statType.multipleValues) {
        statType.pbs.allTime.entryId.avg = entry.id;
        statType.pbs.allTime.entryId.sum = entry.id;
      }

      pbUpdated = true;
    } else {
      Object.keys(statType.pbs.allTime.entryId).forEach((key) => {
        if (
          statType.pbs.allTime.entryId[key] === null ||
          (pbs[key] > statType.pbs.allTime.result[key] && statType.higherIsBetter) ||
          (pbs[key] < statType.pbs.allTime.result[key] && !statType.higherIsBetter) ||
          (pbs[key] === statType.pbs.allTime.result[key] &&
            !isNewerOrSameDate(
              entry.date,
              state.entries.find((el) => el.id === statType.pbs.allTime.entryId[key]).date,
            ))
        ) {
          statType.pbs.allTime.entryId[key] = entry.id;
          statType.pbs.allTime.result[key] = pbs[key];

          pbUpdated = true;
        }
      });
    }
  }

  return pbUpdated;
};

export const checkPBFromScratch = (state: any, statType: IStatType) => {
  if (__DEV__) console.log(`Checking PB from scratch for stat type ${statType.name}`);

  for (let i = state.entries.length - 1; i >= 0; i--) {
    updateStatTypePB(state, statType, state.entries[i]);
  }
};

export const updatePBs = (state: any, entry: IEntry, mode: 'add' | 'edit' | 'delete') => {
  let PBsUpdated = false;

  for (let statType of state.statTypes) {
    if (statType.trackPBs && statType.variant === StatTypeVariant.NUMBER) {
      if (__DEV__) console.log(`Updating PB for stat type ${statType.name}`);

      let pbUpdated = false;

      // Update PB if it could have gotten better or it's a tie, but happened earlier
      if (mode !== 'delete') {
        pbUpdated = updateStatTypePB(state, statType, entry) || pbUpdated;
      }

      // Update PB if it could have gotten worse
      // Skip checking PB if it was already updated and the stat type only has single values
      if (mode !== 'add' && (!pbUpdated || statType.multipleValues)) {
        if (statType.pbs) {
          let isPrevPB = false;
          const tempStatType: IStatType = {
            ...statType,
            pbs: {
              allTime: {
                entryId: { ...statType.pbs.allTime.entryId },
                result: { ...statType.pbs.allTime.result },
              },
            },
          };

          // Check that the entry held the PB for the stat type before
          Object.keys(statType.pbs.allTime.entryId).forEach((key) => {
            if (statType.pbs.allTime.entryId[key] === entry.id) {
              isPrevPB = true;
              tempStatType.pbs.allTime.entryId[key] = null;
              tempStatType.pbs.allTime.result[key] = null;
            }
          });

          if (isPrevPB) {
            checkPBFromScratch(state, tempStatType);

            // If this is null, that means no entries are left with this stat type
            if (tempStatType.pbs.allTime.entryId.best === null) {
              pbUpdated = true;
              delete statType.pbs;
            } else {
              if (
                !!Object.keys(tempStatType.pbs.allTime.entryId).find(
                  (key) =>
                    tempStatType.pbs.allTime.entryId[key] !== statType.pbs.allTime.entryId[key] ||
                    tempStatType.pbs.allTime.result[key] !== statType.pbs.allTime.result[key],
                )
              ) {
                pbUpdated = true;
                statType.pbs = tempStatType.pbs;
              }
            }
          }
        } else {
          console.error('Stat type has no PB, which cannot be the case!');
        }
      }

      PBsUpdated = pbUpdated || PBsUpdated;

      if (__DEV__) {
        if (pbUpdated) console.log('PB updated to: ', JSON.stringify(statType.pbs, null, 2));
        else console.log('PB not updated');
      }
    }
  }

  return PBsUpdated;
};
