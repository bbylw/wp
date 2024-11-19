document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // 添加实时预览
    textInput.addEventListener('input', generateImage);

    function generateImage() {
        const text = textInput.value;
        const fontSize = 18; // 增大字号
        const lineHeight = fontSize * 1.6; // 增加行高
        const padding = 40; // 增加内边距
        const paragraphSpacing = lineHeight * 1.5; // 增加段落间距
        
        // 设置画布大小
        ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        
        // 按段落分割文本，处理多种换行符情况
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
        
        // 计算每个段落的行
        const maxWidth = 600;
        let allLines = [];
        
        paragraphs.forEach(paragraph => {
            // 段落首行缩进
            const indent = '　　'; // 使用全角空格缩进
            paragraph = indent + paragraph.trim();
            
            const words = paragraph.split('');
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
            
            allLines.push(lines);
        });
        
        // 计算总高度
        const totalLines = allLines.reduce((sum, para) => sum + para.length, 0);
        const totalParagraphSpacing = (allLines.length - 1) * paragraphSpacing;
        
        // 设置画布尺寸
        canvas.width = maxWidth;
        canvas.height = totalLines * lineHeight + totalParagraphSpacing + padding * 3;
        
        // 绘制背景
        ctx.fillStyle = '#fff9f0'; // 米白色背景
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 添加边框
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        ctx.strokeRect(padding/2, padding/2, canvas.width - padding, canvas.height - padding);
        
        // 绘制文本
        ctx.fillStyle = '#2c3e50'; // 更深的文字颜色
        ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        
        let currentY = padding + lineHeight;
        
        allLines.forEach((paragraph, paraIndex) => {
            paragraph.forEach((line) => {
                ctx.fillText(line, padding, currentY);
                currentY += lineHeight;
            });
            
            // 段落间距
            if (paraIndex < allLines.length - 1) {
                currentY += paragraphSpacing;
            }
        });
    }

    function downloadImage() {
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `text-image-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    generateBtn.addEventListener('click', generateImage);
    downloadBtn.addEventListener('click', downloadImage);
    
    // 初始生成空白画布
    generateImage();
}); 