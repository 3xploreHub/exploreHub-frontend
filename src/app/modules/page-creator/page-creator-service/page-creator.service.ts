import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { from, observable, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ElementValues } from '../../interfaces/ElementValues';
import { TouristSpotPage } from '../../interfaces/tourist-spot-page';

export interface Image {
  _id: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class PageCreatorService {
  private apiUrl = `${environment.apiUrl}/service-provider`;
  public currentPageId: string;

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
          console.log("error in getting token form the storage ", error);
        }
      );
    });
  }

  saveComponent(component: ElementValues, grandParentId: string, parentId: string, parent: string): Observable<any> {
    const componentGroup = parent == "page" ? "addComponent" : "addServiceChildComponent";
    const params = parent == "page" ? parentId : `${this.currentPageId}/${grandParentId}/${parentId}`;
    return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`, component, {
      headers: { hideLoadingIndicator: "true" },
    });
  }

  saveServiceComponent(component: ElementValues, parentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/addServiceComponent/${parentId}`, component, {
      headers: { hideLoadingIndicator: "true" },
    });
  }

  saveItemComponent(component: ElementValues, parentId: string, parent: string): Observable<any> {
    const componentGroup = parent == "page" ? "addComponent" : "addChildComponent";
    const params = parent == "page" ? parentId : `${this.currentPageId}/${parentId}`;
    return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`, component, {
      headers: { hideLoadingIndicator: "true" },
    });
  }


  editComponent(component: ElementValues, grandParentId: string, parentId: string, parent: string): Observable<any> {
    const componentGroup = parent == "page" ? "editComponent" : "editChildComponent";
    const params = parent == "page" ? parentId : `${this.currentPageId}/${grandParentId}/${parentId}`;
    return this.http.put(`${this.apiUrl}/${componentGroup}/${params}`, component, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  // deleteComponent(parentId: string, compId: string, images:any, parent: string): Observable<any> {
  //   const componentGroup = parent == "page" ? "deleteComponent": "deleteChildComponent";
  //   const params = parent == "page"? `${parentId}/${compId}`: `${this.currentPageId}/${parentId}/${compId}`;
  //   return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`, {images: images}, {
  //     headers: { hideLoadingIndicator: "true" },
  //   })
  // }

  deleteComponent(grandParentId: string, parentId: string, childId: string, images: any, parent: string): Observable<any> {
    const componentGroup = parent == "page" ? "deleteComponent" : "deleteItemChild";
    const params = parent == "page" ? `${parentId}/${childId}` : `${this.currentPageId}/${grandParentId}/${parentId}/${childId}`;
    return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`, { images: images }, {
      headers: { hideLoadingIndicator: "true" },
    })
  }
  deleteItemComponent(itemListId: string, itemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteItemComponent/${this.currentPageId}/${itemListId}/${itemId}`, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  deleteServiceComponent(pageId: string, serviceId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteServiceComponent/${pageId}/${serviceId}`, {
      headers: { hideLoadingIndicator: "true" },
    })
  }

  uploadImage(grandParentId: string, parentId: string, childId: string, parent: string, blobData): Observable<any> {
    const formData = new FormData();
    formData.append('image', blobData);

    const componentGroup = parent == "page" ? "addComponentImage" : "addItemChildComponentImage";
    const params = parent == "page" ? `${parentId}/${childId}` : `${this.currentPageId}/${grandParentId}/${parentId}/${childId}`;

    return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`, formData, {
      headers: { hideLoadingIndicator: "", containsFiles: "" },
    });
  }

  uploadImageFile(grandParentId: string, parentId: string, childId: string, parent: string, file: File) {
    const ext = file.name.split('.').pop();
    const formData = new FormData();
    formData.append('image', file, `myimage.${ext}`);

    const componentGroup = parent == "page" ? "addComponentImage" : "addItemChildComponentImage";
    const params = parent == "page" ? `${parentId}/${childId}` : `${this.currentPageId}/${grandParentId}/${parentId}/${childId}`;

    return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`, formData, {
      headers: { hideLoadingIndicator: "", containsFiles: "" },
    });
  }

  deleteImage(grandParentId: string, parentId: string, parent: string, componentId: string, imageUrl: string, imageId: string) {

    const componentGroup = parent == "page" ? "deleteImage" : "deleteItemImage";
    const params = parent == "page" ? `${parentId}` : `${this.currentPageId}/${grandParentId}/${parentId}`;

    return this.http.post(`${this.apiUrl}/${componentGroup}/${params}`,
      { imageUrl: imageUrl, componentId: componentId, imageId: imageId }, {
      headers: { hideLoadingIndicator: "" },
    });
  }

  getItemUpdatedData(serviceId: string, itemId: string) {
    return this.http.get(`${this.apiUrl}/getItemUpdatedData/${this.currentPageId}/${serviceId}/${itemId}`, {
      headers: { hideLoadingIndicator: "" }
    })
  }

  getUpdatedItemListData(itemListId) {
    return this.http.get(`${this.apiUrl}/getUpdatedItemListData/${this.currentPageId}/${itemListId}`, {
      headers: { hideLoadingIndicator: "" }
    })
  }

  createTouristSpotPage() {
    return this.http.post(`${this.apiUrl}/createTouristSpotPage`, {})
  }

  retrieveToristSpotPage(id) {
    return this.http.get(`${this.apiUrl}/retrieveToristSpotPage/${id}`)
  }

  applyStyle(styles: any, style: string) {
    let type = style.split("-")[0];

    styles = styles.filter(stl => stl.split("-")[0] != type);

    if (!styles.includes(style)) {
      styles.push(style)
    }
    return styles;
  }
}
