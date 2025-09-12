/*
  Generate src/app/favicon.ico from public/pokecheck-favicon.svg
*/
const fs = require('fs');
const path = require('path');
const { favicons } = require('favicons');

const source = path.resolve(__dirname, '../public/pokecheck-favicon.svg');
const outFile = path.resolve(__dirname, '../src/app/favicon.ico');

(async () => {
  try {
    if (!fs.existsSync(source)) {
      console.error('Source SVG not found at', source);
      process.exit(1);
    }

    const configuration = {
      path: '/',
      appName: 'PokéCheck',
      appShortName: 'PokéCheck',
      appDescription: 'PokéCheck favicon',
      background: '#ffffff',
      theme_color: '#3b82f6',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true, // only need favicon.ico
        windows: false,
        yandex: false,
      },
    };

    const response = await favicons(source, configuration);
    const ico = response.images.find((img) => img.name === 'favicon.ico');
    if (!ico) {
      console.error('favicons did not return favicon.ico');
      process.exit(2);
    }
    fs.writeFileSync(outFile, ico.contents);
    console.log('Generated', outFile);
  } catch (err) {
    console.error(err);
    process.exit(3);
  }
})();
