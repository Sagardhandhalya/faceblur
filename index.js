window.addEventListener("load", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let model;
  navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
  async function startVideo() {
    model = await blazeface.load();
    navigator.getMedia(
      { video: true },
      async (stm) => {
        video.srcObject = stm;
        video.play();
        drawOnCanvas();
      },
      (err) => console.log(err)
    );
  }
  
  video.addEventListener('play' ,drawOnCanvas )

  function drawOnCanvas() {
    blur();
    setTimeout(() => {
      drawOnCanvas();
    }, 0);
  }
 
  // for(let i = ((y-1)*wi+x)*4; i<((y+h)*wi+x+w)*4; i++)

  function blurLogic(pixelArray) {
    let pd = pixelArray.data;
    let wi = pixelArray.width;
    for (let i = 4; i < pixelArray.data.length - 4; i++) {
      let layerNo = i % 4;
      let pixelNo = i / 4;
      let a = pixelNo / wi;
      let b = pixelNo % wi;

      if (b > x && b < x + w && a > y && a < y + h) {
        if (layerNo === 3) continue;

// 1 1 1 1 1
// 1 1 1 1 1
// 1 1 1 1 1
// 1 1 1 1 1
// 1 1 1 1 1

        
        let temp=0;
        
        for(let j=-2;j<=2;j++)
        {
            for(let k=-2;k<=2;k++)
            {
            temp += pd[i + 4*wi*j+4*k] || pd[i]
        }

    
    }

 
       
        pd[i] = temp/25;
          // (pd[i] +
          //   (pd[i - 4] || pd[i]) +
          //   (pd[i - 8] || pd[i]) +
          //   (pd[i + 4] || pd[i]) +
          //   (pd[i + 8] || pd[i]) +
          //   (pd[i - 4 * wi] || pd[i]) +
          //   (pd[i - 8 * wi] || pd[i]) +
          //   (pd[i + 4 * wi] || pd[i]) +
          //   (pd[i + 8 * wi] || pd[i]) +
          //   (pd[i - 4 * wi - 4] || pd[i]) +
          //   (pd[i - 4 * wi + 4] || pd[i]) +
          //   (pd[i + 4 * wi - 4] || pd[i]) +
          //   (pd[i + 4 * wi + 4] || pd[i])) /
          // 9;
      }
    }
    pixelArray.data = pd;
    return pixelArray;
  }

  async function blur() {
    model
      .estimateFaces(video, false)
      .then((predictions) => {
        const prediction = predictions[0];
        console.log(prediction);
        const start = prediction.topLeft;
        const end = prediction.bottomRight;
        const size = [end[0] - start[0], end[1] - start[1]];
        let devideFactor = canvas.clientWidth /5;
        console.log(canvas.clientWidth);
        ctx.drawImage(video, 0, 0, 640, 480);
        // ctx.fillRect(start[0], start[1], size[0], size[1]);
        x = start[0];
        y = start[1]-90;
        h = size[1]+100;
        w = size[0];
        console.log(x, y, h, w);

        let pixelArray = ctx.getImageData(
          0,
          0,
          canvas.clientWidth,
          canvas.clientHeight
        );
        for (let i = 0; i < 5; i++) {
          pixelArray = blurLogic(pixelArray);
        }
        
        ctx.putImageData(pixelArray, 0, 0);
      })

      .catch((err) => console.log(err));
  }

  startVideo();

});
