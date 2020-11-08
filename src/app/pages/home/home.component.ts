import { Component, OnInit, ViewChild } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('inputFile', { static: false }) inputFile: any;

  image = { img: '', display: '', size: 0, name: '', type: '' };
  resizedImage = { img: '', display: '', size: 0, name: '', type: '' };

  constructor() { }

  ngOnInit(): void {
  }

  getImage() {
    this.inputFile.nativeElement.click();
  }

  async fileChangeInsert(event) {
    if (event.target.files && event.target.files[0]) {
      Array.from(event.target.files).forEach((img, index) => {

        let reader = new FileReader();

        reader.onload = async (image: any) => {
          let imagem = new Image();
          imagem.src = image.target.result;

          this.image.img = imagem.src;
          this.image.name = img['name'].split('.')[0];
          this.image.type = img['type'];
          this.resizedImage.name = img['name'].split('.')[0];

          this.checkKbImg(imagem.src, img['name'].split('.')[0]).then((res) => {
            this.image.size = res;
          });


          imagem.onload = () => {

            console.log(imagem.width + 'x' + imagem.height);

            this.image.display = imagem.width + 'x' + imagem.height;

            let nome = event.target.files[index].name.split(".")[0];
            let url = nome.replace(/ /gi, "_");

            this.fn_resize_img(image.target.result, 1200 / 3, 1200 / 3, 0.5, this.image.type, f => {

              this.checkKbImg(f, url.split('.')[0]).then((res) => {
                this.resizedImage.size = res;
              });

              this.resizedImage.img = f;
            });
          }

        }

        reader.readAsDataURL(event.target.files[index]);
      });
    }
  }

  fn_resize_img(img, MAX_WIDTH: number = 1200, MAX_HEIGHT: number = 1200, quality: number = 1, type, callback) {
    var canvas: any = document.createElement("canvas");
    var image = new Image();

    image.onload = () => {
      var width = image.width;
      var height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      this.resizedImage.display = Math.round(width) + 'x' + Math.round(height);
      console.log(width + 'x' + height);

      var dataUrl = canvas.toDataURL(type, quality);
      this.resizedImage.type = type;

      callback(dataUrl);
    }
    image.src = img;
  }

  urltoFile(url, filename, mimeType) {
    return (fetch(url)
      .then((res) => { return res.arrayBuffer(); })
      .then((buf) => { return new File([buf], filename, { type: mimeType }); })
    );
  }

  checkKbImg(img, name) {
    return this.urltoFile(img, name, 'text/plain')
      .then((file) => {
        console.log(file);

        return Math.floor(file.size / 1024);
      });
  }

}
