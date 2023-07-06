export class SQText {
    text: string;
    iconType: string;
    textColor:string|null = null;
    cssSuffix: string;
    constructor(text: string, iconType: string, cssSuffix: string, textColor: string|null = null) {
        this.text = text;
        this.iconType = iconType;
        this.textColor = textColor;
        this.cssSuffix = cssSuffix;
    }
}
export enum SQMessageType{
    SELF,
    PEER_REQ,
    PEER_RES,
    SERVER
  }

  export enum SQIconType{
    SELF="SELF",
    PEER="PEER",    
    SERVER="SRVR"
  }