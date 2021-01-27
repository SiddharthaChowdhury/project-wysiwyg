

const url = "https://gist.githubusercontent.com/rominirani/8235702/raw/a50f7c449c41b6dc8eb87d8d393eeff62121b392/employees.json";
const local = "/assets/editorSprites.json";

interface ILoaderEntry {
  [name: string]: string;
}

interface ILoaderFormat {
  json?: ILoaderEntry;
  image?: ILoaderEntry;
}

const payload: ILoaderFormat = {
  // json: {
  //   employee: url,
  //   sprite: local
  // },
  image: {
    sprite : "/assets/editorSpritesheet.png",
    webpImg: "/assets/1.webp",
  }
}

type TypeProgress = (total: number, done: number) => void;
const defaultCall: TypeProgress = (total: number, done: number) => {};

const loader = (progress: TypeProgress = defaultCall) => {
  const {json, image} = payload;
  const jsonKeys = json ? Object.keys(json) : [];
  const imgKeys = image ? Object.keys(image) : [];

  const totalItems: number = jsonKeys.length + imgKeys.length;
  let doneItems: number = 0;

  const jsonMemory: any = {};

  if(jsonKeys.length && json) {
    jsonKeys.forEach((name: string) => {
      console.log(name + " => Initiated")
      fetch(json[name])
      .then(response => response.json())
      .then(data => {

        jsonMemory[name] = data;
        doneItems ++;
        progress(totalItems, doneItems);
        console.log(name + " => Success ", data, jsonMemory);
      }).catch((error: Error) => {

        jsonMemory[name] = null;
        doneItems ++;
        progress(totalItems, doneItems);
        console.log(name + " => Failed ", error)
      });
    })
  }

  const imageMemory: any = {};

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
          // the image is ready
          console.log("THIS, success", this);

          // @ts-ignore
          toDataURL(this.src, function(dataURL){
              console.log("dataURL", dataURL);
          })
      };
      img.onerror = function() {
          // the image has failed
          console.log("THIS, failed", this)
      };
      img.src = image[name];
    });
  }
}

export default loader;
