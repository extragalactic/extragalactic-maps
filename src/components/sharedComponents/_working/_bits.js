// =========================================================
//  Working File ...  code left-overs that may prove useful
// =========================================================
//
//
// Spritesheet example code:
//
// sampleSpriteSheet = (texture, samplePosX, samplePosY) => {
//   const tilesDimension = 4;
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//   texture.repeat.set(1 / tilesDimension, 1 / tilesDimension);

//   texture.offset.x = samplePosX / tilesDimension;
//   texture.offset.y = samplePosY / tilesDimension;

//   return texture;
// };

// function testWait() {
//   console.log("starting wait");
//   return new Promise(resolve => {
//     setTimeout(function() {
//       resolve();
//       console.log("wait is done");
//     }, 2000);
//   });
// }
