const Jimp = require('jimp');

async function removeWhite() {
  const imagePath = '../public/favicon.png';
  const image = await Jimp.read(imagePath);
  
  const tolerance = 240; 

  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const red = this.bitmap.data[idx + 0];
    const green = this.bitmap.data[idx + 1];
    const blue = this.bitmap.data[idx + 2];

    if (red > tolerance && green > tolerance && blue > tolerance) {
      this.bitmap.data[idx + 3] = 0; // Set alpha to 0 (transparent)
    }
  });

  await image.writeAsync(imagePath);
  console.log("Image background removed successfully.");
}

removeWhite().catch(console.error);
