import { LightningElement, api } from 'lwc';
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';
import userId from "@salesforce/user/Id";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class SimpleToast extends LightningElement {
    channelName = '/event/ShowToast__e';
    @api recordId;
    currUserId = userId;

    connectedCallback(){
        console.log("initialized: " + this.recordId);
        console.log("user id: " + this.currUserId);
        const messageCallback = function (response) {
            var eventInfo = JSON.parse(JSON.stringify(response));
            console.log(eventInfo);
            console.log("created by " + eventInfo.data.payload.CreatedById);
            console.log(eventInfo.data.payload.Label__c);
            console.log(eventInfo.data.payload.Message__c);
            console.log(eventInfo.data.payload.Mode__c);
            console.log(eventInfo.data.payload.Variant__c);
            
            if(this.recordId == eventInfo.data.payload.Source__c && this.currUserId == eventInfo.data.payload.CreatedById) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: eventInfo.data.payload.Label__c,
                        message: eventInfo.data.payload.Message__c,
                        mode: eventInfo.data.payload.Mode__c,
                        variant: eventInfo.data.payload.Variant__c
                    })
                );
            }
        };

        subscribe(this.channelName, -1, messageCallback.bind(this)).then((response) => {
            console.log(
                'Subscription request sent to: ',
                JSON.stringify(response.channel)
            );
        });
    }
}