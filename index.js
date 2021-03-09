    window.addEventListener('load' , () => {
        const video= document.getElementById("video")
        const canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d')
        let model ;
          async  function startVideo(){
             model = await blazeface.load();
                navigator.getUserMedia(
                    {video:true},
                    async stm => {
                        
                        video.srcObject = stm
                        video.play()
                        drawOnCanvas()
                    },
                    err => console.log(err)
                )
            }
        
            document.addEventListener('click' ,(e) => console.warn(e) )

        let x = 50;
        let y = 100;
        let h =100;
        let w = 50;
        

            function drawOnCanvas(){
                blur()
                setTimeout(() => {
                    drawOnCanvas()
                },0)
            }
// 1 1 1 1 1
// 1 1 1 1 1
// 1 1 1 1 1
// 1 1 1 1 1 
//   for(let i = ((y-1)*wi+x)*4; i<((y+h)*wi+x+w)*4; i++)
            function blurLogic(pixelArray )
            {
                let pd = pixelArray.data;
                let wi = pixelArray.width;
                for(let i = 4; i<pixelArray.data.length - 4; i++)
                {
                    let layerNo = i%4;
                    let pixelNo = i/4;
                    let a = pixelNo/500;
                    let b = pixelNo%500;
           
                    if( b > x && b <x+w && a>y && a< y+h  )
                    {
                        if(layerNo === 3) continue;

                            pd[i] = (
                                pd[i]  + (pd[i - 4] || pd[i])
                                + (pd[i + 4] || pd[i])
                                +(pd[i- 4*wi] || pd[i])
                                + (pd[i+4*wi] || pd[i])
                                + (pd[i- 4*wi -4 ] || pd[i])
                                + (pd[i- 4*wi + 4 ] || pd[i])
                                + (pd[i+ 4*wi -4 ] || pd[i])
                                + (pd[i+ 4*wi + 4 ] || pd[i])
                            )/9;
                            
                    }

                }
                pixelArray.data = pd;
                return pixelArray;
            }

         async function blur()
            {
            
                model.estimateFaces(video,false).then((prediction)=>{
                const predictions = prediction[0]
                console.log(predictions);
                const start = predictions.topLeft; 
                const end = predictions.bottomRight;
                const size = [end[0] - start[0], end[1] - start[1]];
                ctx.drawImage(video,0,0,canvas.clientWidth , canvas.clientHeight)
                // ctx.fillRect(start[0], start[1], size[0], size[1]);
                    x = start[0]-80;
                    y = start[1]-80;
                    h =  size[1]+80;
                    w = size[0];
                console.log(x,y,h,w);
               
                let pixelArray = ctx.getImageData(0,0,canvas.clientWidth , canvas.clientHeight)
                for(let i=0;i<10;i++)
                {
                    pixelArray = blurLogic(pixelArray)
                }
                // pixelArray =blurLogic(blurLogic(blurLogic(blurLogic(pixelArray))))
                ctx.putImageData(pixelArray,0,0)
                   
                })
                
                .catch((err) => console.log(err))
            }

            startVideo()
            
    })
