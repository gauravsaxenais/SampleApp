import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { TranslateService } from '@ngx-translate/core';
import { WidgetType, ChangeType, ActionType } from 'src/app/shared/enums';
import { Action } from 'rxjs/internal/scheduler/Action';

@Injectable()
export class UtilsService {
  constructor(
    private local: LocalStorageService,
    private translate: TranslateService
  ) { }


  /**
   * // TODO: IsJsonString
   * Check the valid json format for string
   */
  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * checks if word exists in array
   * @param array
   * @param word
   */
  isInArray(array, word) {
    return array.indexOf(word.toLowerCase()) > -1;
  }

  /**
   * get or set language
   */
  getSetLanguage() {
    let localLanguage = this.local.getLanguage();
    if (!localLanguage) {
      localLanguage = 'en';
    }
    this.translate.use(localLanguage);
  }

  getDashboardMaxColItem(itemType): number {
    let returnValue = 2;

    if (itemType === WidgetType.Map) {
      returnValue = 5;
    } else if (itemType === WidgetType.AccessPoint) {
      returnValue = 3;
    } else if (itemType === WidgetType.Camera) {
      returnValue = 1;
    } else if (itemType === WidgetType.Chart) {
      returnValue = 3;
    } else if (itemType === WidgetType.System) {
      returnValue = 3;
    }
    return returnValue;
  }

  getDashboardMaxRowItem(itemType): number {
    let returnValue = 3;

    if (itemType === WidgetType.Map) {
      returnValue = 3;
    } else if (itemType === WidgetType.AccessPoint) {
      returnValue = 2;
    } else if (itemType === WidgetType.Camera) {
      returnValue = 1;
    } else if (itemType === WidgetType.Chart) {
      returnValue = 3;
    } else if (itemType === WidgetType.System) {
      returnValue = 3;
    }
    return returnValue;
  }

  getChangeTypeByAction(actionType): ChangeType {
    let returnValue = null;

    if (actionType === ActionType.Create) {
      returnValue = ChangeType.Added;
    } else if (actionType === ActionType.Update) {
      returnValue = ChangeType.Modified;
    } else if (actionType === ActionType.Delete) {
      returnValue = ChangeType.Removed;
    }
    return returnValue;
  }

  getDistinctCameraNames(cameraItems: any) {
    const result = [];
    const map = new Map();
    for (const item of cameraItems) {
      if (item.name && !map.has(item.name)) {
        map.set(item.name, true);    // set any value to Map
        result.push({
          channelGuid: item.channelGuid,
          name: item.name
        });
      }
    }
    return result;
  }


}
