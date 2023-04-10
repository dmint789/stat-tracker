import * as ScopedStorage from 'react-native-scoped-storage';
import { IStatCategory } from '../DataStructure';

export const getData = async (categoryId: number, request: string): Promise<any> => {
  return null;
};

export const setData = async (categoryId: number, request: string, data: any) => {};

export const deleteData = async (categoryId: number, request: string) => {};

export const getStatCategories = async (): Promise<IStatCategory[]> => {
  return null;
};

export const setStatCategories = async (statCategories: IStatCategory[]) => {};

export const deleteStatCategory = async (category: IStatCategory, newStatCategories: IStatCategory[]) => {};

export const getLastCategoryId = async (): Promise<number> => {
  return 999999;
};

export const setLastCategoryId = async (id: number) => {};

export const importData = async (
  statCategories: IStatCategory[],
  lastCategoryId: number,
): Promise<{ message: string; error: string }> => {
  return { error: 'Mock Error', message: 'Mock Message' };
};

export const exportData = async (): Promise<{ message: string; error: string }> => {
  return { error: 'Mock Error', message: 'Mock Message' };
};

const getBackupDir = async (): Promise<ScopedStorage.FileType> => {
  return { uri: '/Mock/URI' } as ScopedStorage.FileType;
};
