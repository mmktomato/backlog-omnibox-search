import type { AppContextDto, PopupTabKey } from "./type";

class AppContext {
  private _popupTabKey: PopupTabKey = "usage";
  private _isAquiringToken: boolean = false;
  private _inputId: number = 0;

  toDto(): AppContextDto {
    return {
      popupTabKey: this.popupTabKey,
    };
  }

  get popupTabKey() { return this._popupTabKey; }
  set popupTabKey(value: PopupTabKey) { this._popupTabKey = value; }

  get isAquiringToken() { return this._isAquiringToken; }
  set isAquiringToken(value: boolean) { this._isAquiringToken = value; }

  get inputId() { return this._inputId; }
  incrementInputId() { return ++this._inputId; }
}

export const appContext = new AppContext();
