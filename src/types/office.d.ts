// Office.js type definitions for Outlook plugin
declare namespace Office {
  export enum HostType {
    Outlook = 'Outlook'
  }

  export interface InitInfo {
    host: string;
    platform: string;
  }

  export function onReady(callback: (info: InitInfo) => void): void;
}