document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    function generateImage() {
        const text = textInput.value;
        const fontSize = 16;
        const lineHeight = fontSize * 1.5;
        const padding = 20;
        
        // 设置画布大小
        ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        
        // 计算文本宽度和行数
        const maxWidth = 600;
        const words = text.split('');
        let lines = [];
        let currentLine = '';
        
        for (let word of words) {
            const testLine = currentLine + word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth - padding * 2) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        
        // 设置画布尺寸
        canvas.width = maxWidth;
        canvas.height = lines.length * lineHeight + padding * 2;
        
        // 绘制背景
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制文本
        ctx.fillStyle = '#333';
        ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        
        lines.forEach((line, index) => {
            ctx.fillText(line, padding, padding + (index + 1) * lineHeight);
        });
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'text-image.png';
        link.href = canvas.toDataURL();
        link.click();
    }

    generateBtn.addEventListener('click', generateImage);
    downloadBtn.addEventListener('click', downloadImage);
}); 