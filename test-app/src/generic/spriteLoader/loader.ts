
// SPRITE FROM https://www.facetstudios.com/sprite-generator;
export interface ILoaderFormat {
  json?: any;
  image?: any;
}
export interface ILoaderDone extends ILoaderFormat {
  errors?: ILoaderFormat;
}

type TypeProgress = (total: number, done: number) => void;
const defaultCall: TypeProgress = (total: number, done: number) => {};

const loader = (payload: ILoaderFormat, onDone: (done: ILoaderDone) => void, progress: TypeProgress = defaultCall) => {
  const {json, image} = payload;
  const jsonKeys = json ? Object.keys(json) : [];
  const imgKeys = image ? Object.keys(image) : [];

  const totalItems: number = jsonKeys.length + imgKeys.length;
  let doneItems: number = 0;
  let hasErrored: boolean = false;

  const onEmitEvent = () => {
    doneItems ++;
    progress(totalItems, doneItems);
    if(doneItems === totalItems) {
      const errors: ILoaderFormat | undefined = {
        json: jsonError,
        image: imageError
      }

      onDone({
        json: jsonMemory,
        image: imageMemory,
        errors: hasErrored ? errors: undefined
      })
    }
  }

  const jsonMemory: any = {};
  const jsonError: any = {};

  if(jsonKeys.length && json) {
    jsonKeys.forEach((name: string) => {
      console.log(name + " => Initiated")
      fetch(json[name])
      .then(response => response.json())
      .then(data => {

        jsonMemory[name] = data;
        onEmitEvent();
      }).catch((error: Error) => {

        jsonError[name] = error;
        jsonMemory[name] = null;
        hasErrored = true;
        onEmitEvent();
      });
    })
  }

  const imageMemory: any = {};
  const imageError: any = {};

  if( imgKeys.length && image) {
    const toDataURL = (url: string, callback: (result: any) => void) => {
      var xhr = new XMLHttpRequest();
      xhr.open('get', url);
      xhr.responseType = 'blob';
      xhr.onload = function(){
        var fr = new FileReader();

        fr.onload = function(){
          callback(this.result);
        };

        fr.readAsDataURL(xhr.response); // async call
      };

      xhr.send();
    }

    imgKeys.forEach((name: string) => {
      const img = new Image();
      img.onload = function() {
          // @ts-ignore
          toDataURL(this.src, function(dataURL){

            imageMemory[name] = dataURL;
            onEmitEvent();
          })
      };
      img.onerror = function(error: any) {

        imageError[name] = error;
        imageMemory[name] = null;
        hasErrored = true;
        onEmitEvent();
      };

      img.src = image[name];
    });
  }
}

export default loader;
