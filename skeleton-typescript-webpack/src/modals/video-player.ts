/**
 * Created by jeevz on 07/08/17.
 */
import {autoinject} from 'aurelia-framework';
import {DialogController, DialogService} from 'aurelia-dialog';

@autoinject()
export class VideoPlayer{

  videoData: any;
  dialogController: DialogController;

  constructor(dialogController:DialogController){
    this.dialogController = dialogController;
  }

  activate(model){
    this.videoData = model.listObject;
    console.log('modal',this.videoData);
  }


}
