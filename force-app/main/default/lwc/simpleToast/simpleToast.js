import { LightningElement, api } from 'lwc';
import { subscribe } from 'lightning/empApi';
import userId from "@salesforce/user/Id";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class SimpleToast extends LightningElement {

    @api recordId;
    currUserId = userId;

    connectedCallback() {
        const messageCallback = function (response) {
            var showtToastEvt = JSON.parse(JSON.stringify(response));
            
            if(this.recordId == showtToastEvt.data.payload.Source__c && this.currUserId == showtToastEvt.data.payload.CreatedById) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: showtToastEvt.data.payload.Label__c,
                        message: showtToastEvt.data.payload.Message__c,
                        mode: showtToastEvt.data.payload.Mode__c,
                        variant: showtToastEvt.data.payload.Variant__c
                    })
                );
            }
        };

        subscribe('/event/ShowToast__e', -1, messageCallback.bind(this));
    }
}