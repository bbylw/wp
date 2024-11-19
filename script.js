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
        const paragraphSpacing = lineHeight; // 段落间距
        
        // 设置画布大小
        ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        
        // 按段落分割文本
        const paragraphs = text.split(/\n\s*\n/);
        
        // 计算每个段落的行
        const maxWidth = 600;
        let allLines = [];
        
        paragraphs.forEach(paragraph => {
            if (paragraph.trim() === '') return;
            
            const words = paragraph.trim().split('');
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
            if (currentLine) {
                lines.push(currentLine);
            }
            
            allLines.push(lines); // 每个段落的行数组
        });
        
        // 计算总高度（包含段落间距）
        const totalLines = allLines.reduce((sum, para) => sum + para.length, 0);
        const totalParagraphSpacing = (allLines.length - 1) * paragraphSpacing;
        
        // 设置画布尺寸
        canvas.width = maxWidth;
        canvas.height = totalLines * lineHeight + totalParagraphSpacing + padding * 2;
        
        // 绘制背景
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制文本
        ctx.fillStyle = '#333';
        ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        
        let currentY = padding + lineHeight;
        
        allLines.forEach((paragraph, paraIndex) => {
            paragraph.forEach((line) => {
                ctx.fillText(line, padding, currentY);
                currentY += lineHeight;
            });
            
            // 在段落之间添加额外的空间
            if (paraIndex < allLines.length - 1) {
                currentY += paragraphSpacing;
            }
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