import type { AppContextDto } from "./type";

class AppContext {
  private _popupTabIndex = 0;

  toDto(): AppContextDto {
    return {
      popupTabIndex: this._popupTabIndex,
    };
  }

  get popupTabIndex() {
    return this._popupTabIndex;
  }

  set popupTabIndex(value: number) {
    this._popupTabIndex = value;
  }
}

export const appContext = new AppContext();
