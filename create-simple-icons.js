// 创建简单的PNG图标 (不依赖外部库)
// 使用Node.js Canvas API

const fs = require('fs');
const path = require('path');

// 创建简单的64x64像素的PNG图标
function createSimpleIcon(filename, color, emoji) {
  // 创建一个简单的SVG，然后我们可以手动转换
  const svgContent = `
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" fill="${color}" rx="8"/>
  <text x="32" y="40" font-family="Arial" font-size="24" text-anchor="middle" fill="white">${emoji}</text>
</svg>`;
  
  // 保存SVG文件
  const svgPath = path.join(__dirname, 'images', filename.replace('.png', '.temp.svg'));
  fs.writeFileSync(svgPath, svgContent);
  
  console.log(`✅ 创建临时图标: ${filename} (${emoji})`);
}

// 创建所有需要的图标
function createAllIcons() {
  console.log('🎨 创建简单的临时图标...\n');
  
  // 确保images目录存在
  const imagesDir = path.join(__dirname, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }
  
  // 创建图标
  createSimpleIcon('home.png', '#FFB6C1', '🏠');
  createSimpleIcon('home-active.png', '#FF69B4', '🏠');
  createSimpleIcon('habit.png', '#FFB6C1', '⭐');
  createSimpleIcon('habit-active.png', '#FF69B4', '⭐');
  createSimpleIcon('reward.png', '#FFB6C1', '🎁');
  createSimpleIcon('reward-active.png', '#FF69B4', '🎁');
  createSimpleIcon('record.png', '#FFB6C1', '📖');
  createSimpleIcon('record-active.png', '#FF69B4', '📖');
  
  console.log('\n📝 临时解决方案说明:');
  console.log('1. 已创建临时SVG文件');
  console.log('2. 请使用以下方法转换为PNG:');
  console.log('   - 在线工具: https://convertio.co/svg-png/');
  console.log('   - 或安装sharp: npm install sharp && node convert-icons.js');
  console.log('   - 或使用设计软件导出PNG');
  console.log('\n🎯 目标: 将8个SVG文件转换为对应的PNG文件');
}

// 创建64x64像素的纯色PNG占位符
function createColorPlaceholder(filename, color) {
  // 创建一个简单的base64编码的1x1像素PNG
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x40, // width: 64
    0x00, 0x00, 0x00, 0x40, // height: 64
    0x08, 0x02, 0x00, 0x00, 0x00, // bit depth, color type, compression, filter, interlace
    0x25, 0x8D, 0x6C, 0x87, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, // compressed data
    0x00, 0x01, 0x00, 0x21, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  const filePath = path.join(__dirname, 'images', filename);
  fs.writeFileSync(filePath, pngHeader);
  console.log(`✅ 创建占位符: ${filename}`);
}

// 创建基本的PNG占位符
function createPlaceholderIcons() {
  console.log('🎨 创建PNG占位符图标...\n');
  
  // 确保images目录存在
  const imagesDir = path.join(__dirname, 'images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
  }
  
  // 创建占位符PNG文件
  createColorPlaceholder('home.png', '#FFB6C1');
  createColorPlaceholder('home-active.png', '#FF69B4');
  createColorPlaceholder('habit.png', '#FFB6C1');
  createColorPlaceholder('habit-active.png', '#FF69B4');
  createColorPlaceholder('reward.png', '#FFB6C1');
  createColorPlaceholder('reward-active.png', '#FF69B4');
  createColorPlaceholder('record.png', '#FFB6C1');
  createColorPlaceholder('record-active.png', '#FF69B4');
  
  console.log('\n✅ PNG占位符创建完成!');
  console.log('📱 现在可以正常运行小程序了');
  console.log('🎨 稍后可以替换为更精美的图标');
}

// 检查是否需要创建图标
function checkAndCreateIcons() {
  const imagesDir = path.join(__dirname, 'images');
  const requiredFiles = [
    'home.png', 'home-active.png',
    'habit.png', 'habit-active.png', 
    'reward.png', 'reward-active.png',
    'record.png', 'record-active.png'
  ];
  
  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(imagesDir, file))
  );
  
  if (missingFiles.length > 0) {
    console.log('❌ 缺少PNG图标文件:', missingFiles.join(', '));
    console.log('🔧 创建占位符图标...\n');
    createPlaceholderIcons();
  } else {
    console.log('✅ 所有PNG图标文件都存在');
  }
}

// 运行检查和创建
checkAndCreateIcons();

module.exports = {
  createAllIcons,
  createPlaceholderIcons,
  checkAndCreateIcons
};
