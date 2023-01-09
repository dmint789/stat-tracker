import { IStatType } from '../shared/DataStructure';
import { checkPBFromScratch } from './EntryFunctions';

export const updateStatType = (state: any, statType: IStatType): IStatType[] => {
  return state.statTypes.map((st) => {
    if (st.id === statType.id) {
      let checkFromScratch = false;

      if (st.trackPBs && !statType.trackPBs && statType.pbs) delete statType.pbs.allTime;
      else if (statType.trackPBs && (!st.trackPBs || statType.higherIsBetter !== st.higherIsBetter))
        checkFromScratch = true;

      if (st.trackYearPBs && !statType.trackYearPBs && statType.pbs) delete statType.pbs.year;
      else if (statType.trackYearPBs && (!st.trackYearPBs || statType.higherIsBetter !== st.higherIsBetter))
        checkFromScratch = true;

      if (st.trackMonthPBs && !statType.trackMonthPBs && statType.pbs) delete statType.pbs.month;
      else if (statType.trackMonthPBs && (!st.trackMonthPBs || statType.higherIsBetter !== st.higherIsBetter))
        checkFromScratch = true;

      if (statType.pbs && Object.keys(statType.pbs).length === 0) delete statType.pbs;
      if (checkFromScratch) checkPBFromScratch(state, statType);

      return statType;
    } else return st;
  });
};

export const updateStatTypesOrder = (
  statTypes: IStatType[],
  statType: IStatType,
  up: boolean,
): IStatType[] => {
  if (statTypes.length < 2) return statTypes;

  return statTypes
    .map((el) => {
      const upCondition = (up && el.id === statType.id) || (!up && el.order === statType.order + 1);
      const downCondition = (!up && el.id === statType.id) || (up && el.order === statType.order - 1);

      if (upCondition || downCondition) {
        return {
          ...el,
          order: el.order + (upCondition ? -1 : 1),
        };
      } else return el;
    })
    .sort((a, b) => a.order - b.order);
};
