import {autoinject, observable} from 'aurelia-framework';
import {DialogService, DialogController} from 'aurelia-dialog';
import {AmagiService} from './services/amagi_service';
import {serviceResponse} from './interfaces/global_interfaces'
import {groupBy, debounce}  from 'underscore';
import {VideoPlayer} from "./modals/video-player";
const Fuse = require('fuse-js-latest');



interface SearchItem {
  data: any
  label: string
}

@autoinject()
export class Welcome {

  @observable searchQuery: string;

  amagiService:AmagiService;
  groupedData;
  fuse: Fuse<SearchItem>;
  originalResponse;
  dialogService: DialogService;
  dialogController: DialogController;


  fuseOptions = {
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      'aired_at',
      'brand_name',
      'campaign_name',
      'channel_name',
      'city_name',
      'client_name'
    ]
  };

  constructor(amagiService:AmagiService, fuse: Fuse<SearchItem>,  dialogService: DialogService, dialogController: DialogController){
    this.amagiService = amagiService;
    this.fuse = fuse;
    this.dialogService = dialogService;
    this.dialogController = dialogController;
  }

  attached(){
    this.getVideoList();
  }

  async getAmagiResponse(){
    return await this.amagiService.getAmagiVideoList();
  }

  groupResponse(amagiResponse){
    this.groupedData = Object.entries(groupBy(amagiResponse, (amagiResponseObject:serviceResponse) => new Date(amagiResponseObject.aired_at).toDateString()));
  }

  getVideoList(){
    this.getAmagiResponse().then((amagiResponse) => {
      this.originalResponse = amagiResponse;
      this.groupResponse(amagiResponse);
      this.fuse = new Fuse(amagiResponse, this.fuseOptions);
    })
  }

  searchVideo(searchQuery){
    if(!searchQuery){
      this.groupResponse(this.originalResponse);
      return
    }
    const searchResult = this.fuse.search(searchQuery);
    this.groupResponse(searchResult);
  }

  searchQueryChanged(newValue, oldValue) {
    if(newValue != oldValue){
      const debouncedFunction = debounce(() => this.searchVideo(newValue), 1000);
      debouncedFunction();
    }
  }

  private openModal(viewModel, model) {
    return this.dialogService.open({
      viewModel: viewModel,
      model: model
    });
  }

  showVideo(listObject){
    this.openModal(VideoPlayer, {listObject});
  }

}

export class UpperValueConverter {
  toView(value: string): string {
    return value && value.toUpperCase();
  }
}

export class JsonValueConverter {
  toView(value) {
    return JSON.stringify(value, null, "\t");
  }
}
