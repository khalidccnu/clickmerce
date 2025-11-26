export enum ENUM_POPUP_TYPES {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  TEXT_AND_IMAGE = 'TEXT_AND_IMAGE',
}

export type TPopupType = `${ENUM_POPUP_TYPES}`;
export const popupTypes: TPopupType[] = Object.values(ENUM_POPUP_TYPES);
