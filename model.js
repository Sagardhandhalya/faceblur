async function main() {
    // Load the model.
    const video= document.getElementById("video")

    const model = await blazeface.load();
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    
    // Pass in an image or video to the model. The model returns an array of
    // bounding boxes, probabilities, and landmarks, one for each detected face.
   
        navigator.getUserMedia(
            {video:true},
            stm => {
                
                video.srcObject = stm
                video.play()
                
            },
            err => console.log(err)
        )
    video.onplay(async ()=>{
        const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
        const predictions = await model.estimateFaces(document.querySelector("video"), returnTensors);
      
        if (predictions.length > 0) {
          /*
          `predictions` is an array of objects describing each detected face, for example:
      
          [
            {
              topLeft: [232.28, 145.26],
              bottomRight: [449.75, 308.36],
              probability: [0.998],
              landmarks: [
                [295.13, 177.64], // right eye
                [382.32, 175.56], // left eye
                [341.18, 205.03], // nose
                [345.12, 250.61], // mouth
                [252.76, 211.37], // right ear
                [431.20, 204.93] // left ear
              ]
            }
          ]
          */
      
          for (let i = 0; i < predictions.length; i++) {
            const start = predictions[i].topLeft;
            const end = predictions[i].bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]];
      
            // Render a rectangle over each detected face.
            ctx.fillRect(start[0], start[1], size[0], size[1]);
          }
        }
    })
    
  }
  
  main();


  // for(let i = 4; i<pixelArray.data.length-4; i++)
  // {
  //     let layerNo = i%4;
  //     let pixelNo = i/4;
  //     let a = pixelNo/500;
  //     let b = pixelNo%500;

  //     if( b > x && b <x+w && a>y && a< y+h  )
  //     {
  //         if(layerNo === 3) continue;

  //             pd[i] = (
  //                 pd[i] * 2 + (pd[i - 4] || pd[i])
  //                 + (pd[i + 4] || pd[i])
  //                 +(pd[i- 4*wi] || pd[i])
  //                 + (pd[i+4*wi] || pd[i])
  //                 + (pd[i- 4*wi -4 ] || pd[i])
  //                 + (pd[i- 4*wi + 4 ] || pd[i])
  //                 + (pd[i+ 4*wi -4 ] || pd[i])
  //                 + (pd[i+ 4*wi + 4 ] || pd[i])
  //             )/10;
              
  //     }

  // }