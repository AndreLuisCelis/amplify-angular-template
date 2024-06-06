import { EditAdsInterface } from "./ads.interface";

export interface PayloadCreateAds {
    fileName: string;
    data: EditAdsInterface;
    imgBase64: string | ArrayBuffer;
    result: string | ArrayBuffer;
  }