import type { AppContextDto, PopupTabKey } from "./type";

class AppContext {
  private _popupTabKey: PopupTabKey = "usage";

  toDto(): AppContextDto {
    return {
      popupTabKey: this.popupTabKey,
    };
  }

  get popupTabKey() {
    return this._popupTabKey;
  }

  set popupTabKey(value: PopupTabKey) {
    this._popupTabKey = value;
  }
}

export const appContext = new AppContext();
