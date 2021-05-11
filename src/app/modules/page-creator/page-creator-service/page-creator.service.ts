import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { from, observable, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ElementValues } from '../../elementTools/interfaces/ElementValues';

export interface Image {
  _id: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class PageCreatorService {
  private apiUrl = `${environment.apiUrl}api/service-provider`;
  public currentPageId: string;
  public preview: boolean = false;
  public clickedComponent: string;
  public pageType: string;
  public canLeave: boolean = false;
  public unfilledFields = { components: [], services: [], bookingInfo: [] }

  constructor(
    public lStorage: Storage,
    private http: HttpClient,
  ) { }

  save(key: string, token: any) {
    this.lStorage.set(key, token);
  }

  get(key) {
    return this.lStorage.ready().then(() => {
      return this.lStorage.get(key).then(
        (val) => {
          return val;
        },
        (error) => {
        }
      );
    });
  }

  saveComponent(component: ElementValues, grandParentId: string, parentId: string, parent: string): Observable<any> {
    if (parent == "service") return this.saveItem(component, parentId)
    const componentGroup = parent == "page" ? "addComponent" : "addServiceChildComponent";
    const params = parent == "page" ? `${parentId}/${this.pageType}` : `${this.currentPageId}/${grandParentId}/${parentId}/${this.pageType}`;
    return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`, component, {
      headers: { hideLoadingIndicator: "true" },
    });
  }

  saveServiceComponent(component: ElementValues, parentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/addServiceComponent/${parentId}/${this.pageType}`, component, {
      headers: { hideLoadingIndicator: "true" },
    });
  }

  saveInputField(component: ElementValues, grandParentId: string, parentId: string, parent: string) {
    return this.http.post(`${this.apiUrl}/saveInputField/${this.currentPageId}/${grandParentId}/${parentId}/${this.pageType}`, component, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  editInputField(inputField: ElementValues, grandParentId: string, parentId: string, parent: string) {
    return this.http.put(`${this.apiUrl}/editInputField/${this.currentPageId}/${grandParentId}/${parentId}/${this.pageType}`, inputField, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  saveItem(component: ElementValues, parentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/saveItem/${this.currentPageId}/${parentId}/${this.pageType}`, component, {
      headers: { hideLoadingIndicator: "true" },
    });
  }

  editComponent(component: ElementValues, grandParentId: string, parentId: string, parent: string): Observable<any> {
    if (parent == "service") {
      return this.editServiceInfo(component, parentId, component._id)
    }
    const componentGroup = parent == "page" ? "editComponent" : "editChildComponent";
    const params = parent == "page" ? `${parentId}/${this.pageType}` : `${this.currentPageId}/${grandParentId}/${parentId}/${this.pageType}`;
    return this.http.put(`${this.apiUrl}/${componentGroup}/${params}`, component, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  editServiceInfo(component: ElementValues, serviceId: string, infoId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/editServiceInfo/${this.currentPageId}/${serviceId}/${infoId}/${this.pageType}`, component, {
      headers: { hideLoadingIndicator: "true" },
    });
  }

  deleteInputField(grandParentId: string, parentId: string, childId: string, images: any, parent: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/deleteInputField/${this.currentPageId}/${grandParentId}/${parentId}/${childId}/${this.pageType}`, { images: images }, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  deleteComponent(grandParentId: string, parentId: string, childId: string, images: any, parent: string): Observable<any> {
    if (parent == "service") return this.deleteItem(parentId, childId)
    const componentGroup = parent == "page" ? "deleteComponent" : "deleteItemChild";
    const params = parent == "page" ? `${parentId}/${childId}/${this.pageType}` : `${this.currentPageId}/${grandParentId}/${parentId}/${childId}/${this.pageType}`;
    return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`, { images: images }, {
      headers: { hideLoadingIndicator: "true" },
    })
  }
  deleteItem(itemListId: string, itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteItem/${this.currentPageId}/${itemListId}/${itemId}/${this.pageType}`, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  deleteServiceComponent(pageId: string, serviceId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteServiceComponent/${pageId}/${serviceId}/${this.pageType}`, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  uploadImage(grandParentId: string, parentId: string, childId: string, parent: string, blobData): Observable<any> {
    const formData = new FormData();
    formData.append('image', blobData);

    const componentGroup = parent == "page" ? "addComponentImage" : "addItemChildComponentImage";
    const params = parent == "page" ? `${parentId}/${childId}/${this.pageType}` : `${this.currentPageId}/${grandParentId}/${parentId}/${childId}/${this.pageType}`;

    return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`, formData, {
      headers: { hideLoadingIndicator: "", containsFiles: "" },
    });
  }

  uploadImageFile(grandParentId: string, parentId: string, childId: string, parent: string, file: File) {
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append('image', file, `myimage.${ext}`);

    const componentGroup = parent == "page" ? "addComponentImage" : "addItemChildComponentImage";
    const params = parent == "page" ? `${parentId}/${childId}/${this.pageType}` : `${this.currentPageId}/${grandParentId}/${parentId}/${childId}/${this.pageType}`;

    return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`, formData, {
      headers: { hideLoadingIndicator: "", containsFiles: "" },
    });
  }

  deleteImage(grandParentId: string, parentId: string, parent: string, componentId: string, imageUrl: string, imageId: string) {

    const componentGroup = parent == "page" ? "deleteImage" : "deleteItemImage";
    const params = parent == "page" ? `${parentId}/${this.pageType}` : `${this.currentPageId}/${grandParentId}/${parentId}/${this.pageType}`;

    return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`,
      { imageUrl: imageUrl, componentId: componentId, imageId: imageId }, {
      headers: { hideLoadingIndicator: "" },
    });
  }

  getItemUpdatedData(serviceId: string, itemId: string) {
    return this.http.get(`${this.apiUrl}/getItemUpdatedData/${this.currentPageId}/${serviceId}/${itemId}/${this.pageType}`, {
      headers: { hideLoadingIndicator: "" }
    })
  }

  getUpdatedItemListData(itemListId, hideLoading = true,) {
    return this.http.get(`${this.apiUrl}/getUpdatedItemListData/${this.currentPageId}/${itemListId}/${this.pageType}`,
      hideLoading ? { headers: { hideLoadingIndicator: "" } } : {})
  }


  deletePage(id: string = null, type: string = null) {
    const pageId = id ? id : this.currentPageId
    const pageType = type ? type : this.pageType
    return this.http.delete(`${this.apiUrl}/deletePage/${pageId}/${pageType}`);
  }


  createPage(pageType, hostTouristSpot = null) {
    return this.http.post(`${this.apiUrl}/createPage/${pageType}`, hostTouristSpot)
  }

  retrievePage(id, pageType) {
    return this.http.get(`${this.apiUrl}/retrievePage/${id}/${pageType}`)
  }


  retrieveAllTouristSpotsPage() {
    return this.http.get(`${this.apiUrl}/retrieveAllTouristSpotsPage`);
  }

  getDefaultCategories() {
    return this.http.get(`${this.apiUrl}/getDefaultCategories/${this.pageType}`)
  }

  submitPage(notificationData = null) {
    return this.http.post(`${this.apiUrl}/submitPage/${this.currentPageId}/${this.pageType}`, { notificationData: notificationData })
  }

  applyStyle(styles: any, style: string) {
    let type = style.split("-")[0];

    styles = styles.filter(stl => stl.split("-")[0] != type);

    if (!styles.includes(style)) {
      styles.push(style)
    }
    return styles;
  }

  editServiceSettings(data:any) {
    data["pageId"] = this.currentPageId
    return this.http.post(`${this.apiUrl}/editServiceSettings`, data, { headers: { hideLoadingIndicator: "true" } })
  }

  checkIfHasValue(data, onService = false) {
    let items = [];
    this.unfilledFields = { components: [], services: [], bookingInfo: [] }
    if (data.length == 0) return false
    data.forEach(item => {
      switch (item.type) {

        case "text":
          if (item.data.text) {
            items.push(item.data);
          } else {
            this.addUnfilledField(onService, "Text")
          }
          break;
        case "photo":
          if (item.data.length > 0) {
            items.push(item.data);
          } else {
            this.addUnfilledField(onService, "Photo")
          }
          break;
        case "bullet-form-text":
          if (item.data.list.length > 0 && item.data.label) {
            items.push(item.data);
          } else {
            this.addUnfilledField(onService, "List")
          }
          break;
        case "labelled-text":
          if (item.data.label && item.data.text) {
            items.push(item.data);
          } else {
            this.addUnfilledField(onService, "Labelled Text")
          }
          break;
        case "text-input":
          if (item.data.label) {
            items.push(item.data);
          } else {
            this.unfilledFields.bookingInfo.push("Text Input")
          }
          break;
        case "date-input":
          if (item.data.label) {
            items.push(item.data);
          } else {
            this.unfilledFields.bookingInfo.push("Date Input")
          }
          break;
        case "number-input":
          if (item.data.label) {
            items.push(item.data);
          } else {
            this.unfilledFields.bookingInfo.push("Number Input")
          }
          break;
        case "choices-input":
          if (item.data.label) {
            items.push(item.data);
          } else {
            this.unfilledFields.bookingInfo.push("Choices Input")
          }
          break;
        default:
          break;
      }
    });
    return items.length == data.length;
  }

  addUnfilledField(onService, type) {
    if (onService) {
      this.unfilledFields.services.push(type)
    } else {
      this.unfilledFields.components.push(type)
    }

  }
}