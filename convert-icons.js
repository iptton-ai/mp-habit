// SVG转PNG转换脚本
// 需要安装: npm install sharp
// 运行: node convert-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgFiles = [
  'home.svg',
  'home-active.svg',
  'habit.svg',
  'habit-active.svg',
  'reward.svg',
  'reward-active.svg',
  'record.svg',
  'record-active.svg',
  'settings.svg',
  'settings-active.svg',
  'theme-pink.svg',
  'theme-purple.svg',
  'theme-blue.svg',
  'theme-green.svg',
  'theme-orange.svg',
  'theme-red.svg'
];

async function convertSvgToPng() {
  console.log('开始转换SVG图标为PNG格式...\n');
  
  for (const svgFile of svgFiles) {
    const svgPath = path.join(__dirname, 'images', svgFile);
    const pngFile = svgFile.replace('.svg', '.png');
    const pngPath = path.join(__dirname, 'images', pngFile);
    
    try {
      // 检查SVG文件是否存在
      if (!fs.existsSync(svgPath)) {
        console.log(`❌ SVG文件不存在: ${svgFile}`);
        continue;
      }
      
      // 转换SVG为PNG (64x64像素)
      await sharp(svgPath)
        .resize(64, 64)
        .png()
        .toFile(pngPath);
      
      console.log(`✅ 转换成功: ${svgFile} -> ${pngFile}`);
      
    } catch (error) {
      console.log(`❌ 转换失败: ${svgFile} - ${error.message}`);
    }
  }
  
  console.log('\n🎉 图标转换完成！');
}

// 如果没有安装sharp，提供替代方案
function showAlternativeMethod() {
  console.log('📝 如果无法安装sharp，可以使用以下替代方案：\n');
  
  console.log('方案1: 在线转换工具');
  console.log('- 访问 https://convertio.co/svg-png/');
  console.log('- 上传SVG文件');
  console.log('- 设置尺寸为64x64像素');
  console.log('- 下载PNG文件\n');
  
  console.log('方案2: 使用设计软件');
  console.log('- 用Figma/Sketch/Adobe Illustrator打开SVG');
  console.log('- 导出为PNG格式，尺寸64x64像素\n');
  
  console.log('方案3: 使用浏览器');
  console.log('- 在浏览器中打开SVG文件');
  console.log('- 使用开发者工具截图');
  console.log('- 调整为64x64像素\n');
  
  console.log('SVG文件位置: ./images/');
  svgFiles.forEach(file => {
    console.log(`- ${file}`);
  });
}

// 检查是否安装了sharp
try {
  require('sharp');
  convertSvgToPng();
} catch (error) {
  console.log('⚠️  未安装sharp库，无法自动转换\n');
  console.log('请运行: npm install sharp\n');
  console.log('或者使用以下替代方案：\n');
  showAlternativeMethod();
}

module.exports = { convertSvgToPng, svgFiles };
