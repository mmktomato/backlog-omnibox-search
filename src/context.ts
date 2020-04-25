import type { AppContextDto, PopupTabKey } from "./type";

class AppContext {
  private _popupTabKey: PopupTabKey = "usage";
  private _isAquiringToken: boolean = false;

  toDto(): AppContextDto {
    return {
      popupTabKey: this.popupTabKey,
      isAquiringToken: this.isAquiringToken,
    };
  }

  get popupTabKey() { return this._popupTabKey; }
  set popupTabKey(value: PopupTabKey) { this._popupTabKey = value; }

  get isAquiringToken() { return this._isAquiringToken; }
  set isAquiringToken(value: boolean) { this._isAquiringToken = value; }
}

export const appContext = new AppContext();
