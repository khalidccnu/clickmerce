import { Paths } from './paths';

const toRecursivelyTraverse = (
  obj: Record<string, any>,
  pathsToRemove: string[] = [],
  pathsToAdd: string[] = [],
): any[] => {
  const holdArr: any[] = [];

  function traverse(item: any) {
    if (Array.isArray(item)) {
      item.forEach((elem) => traverse(elem));
    } else if (typeof item === 'object' && item !== null) {
      for (const key in item) traverse(item[key]);
    } else {
      if (!pathsToRemove.includes(item)) holdArr.push(item);
    }
  }

  traverse(obj);

  pathsToAdd.forEach((pathToAdd) => {
    if (!holdArr.includes(pathToAdd)) holdArr.push(pathToAdd);
  });

  return holdArr;
};

export const UserPaths = toRecursivelyTraverse(Paths.user);
export const AdminPaths = toRecursivelyTraverse(Paths.admin);
export const AuthPaths = toRecursivelyTraverse({ ...Paths.user, ...Paths.admin });
