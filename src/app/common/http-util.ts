import {Http, Request, Headers, RequestOptions, RequestMethod, Response} from "@angular/http";
import {Observable, Subject} from "rxjs";
import {error} from "util";
export class HttpUtils{
  constructor(private http: Http){}

  POST<T>(url: string, data: any): Observable<T>{
    let headers = new Headers();
    headers.append("Content-Type", "application/json" );
    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      headers: headers,
      body: JSON.stringify(data)
    })

    return this.http.request(new Request(options)).map(
      (res: Response) => {
        return res.json() as T
      }
    ).filter(data=>data!=undefined);
  }

  POSTWithToken<T>(url: string, data: any): Observable<T>{
    let headers = this.getHttpHeader();
    let options = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      headers: headers,
      body: JSON.stringify(data)
    })

    return this.http.request(new Request(options)).map(
        (res: Response) => {
          return res.json() as T
        }
    ).filter(data=>data!=undefined);
  }

  getHttpHeader(){
    let headers = new Headers();
    headers.append("Content-Type", "application/json" );
    let token = localStorage.getItem("token");
    console.log(token);
    if(token){
      // headers.append("token", "Token "+token)
      // headers.append("Authorization", "Token "+token);
      console.log(localStorage.getItem("username")+":"+localStorage.getItem("password"))
      headers.append("Authorization", "Basic "+btoa(localStorage.getItem("username")+":"+localStorage.getItem("password")));
    }else{
      headers.append("Authorization", "Basic "+btoa("pjsong:pjsong3101"));
    }
    return headers;
  }

  //localhost:8000/api/data/slotstatus/1/edit/
  PutWithToken<T>(url: string, data: any): Observable<T>{
    let headers = this.getHttpHeader();
    let options = new RequestOptions({
      method: RequestMethod.Put,
      url: url,
      headers: headers,
      body: JSON.stringify(data)
    })

    return this.http.request(new Request(options)).map(
      (res: Response) => {
        return res.json() as T
      }
    ).filter(data=>data!=undefined);
  }

  GetWithToken<T>(url: string){
    return this.http.get(url, new RequestOptions({headers:this.getHttpHeader()})).map(res=>res.json() as T);
  }
}

