document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const textInput = document.getElementById('textInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // 添加实时预览
    textInput.addEventListener('input', generateImage);

    function generateImage() {
        // 基础设置
        const fontSize = 20;  // 更大的字号
        const lineHeight = fontSize * 1.8;  // 更大的行高
        const padding = 50;   // 更大的边距
        const paragraphSpacing = fontSize * 2;  // 更大的段落间距
        const maxWidth = 800; // 更宽的画布
        
        // 设置字体
        ctx.font = `${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`;
        
        // 分割段落并过滤空段落
        let paragraphs = textInput.value
            .split(/\n\s*\n/)
            .filter(p => p.trim())
            .map(p => p.trim());

        // 处理每个段落的换行
        let allLines = [];
        paragraphs.forEach(paragraph => {
            // 添加首行缩进（两个全角空格）
            paragraph = '　　' + paragraph;
            
            let lines = [];
            let currentLine = '';
            let words = paragraph.split('');
            
            for (let word of words) {
                let testLine = currentLine + word;
                let metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth - (padding * 2)) {
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

        // 计算画布尺寸
        const totalLines = allLines.reduce((sum, para) => sum + para.length, 0);
        const totalParagraphSpacing = (allLines.length - 1) * paragraphSpacing;
        const canvasHeight = Math.max(
            totalLines * lineHeight + 
            totalParagraphSpacing + 
            (padding * 2),
            300  // 最小高度
        );

        // 设置画布尺寸
        canvas.width = maxWidth;
        canvas.height = canvasHeight;

        // 绘制背景
        ctx.fillStyle = '#fff9f0';  // 米色背景
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制装饰边框
        ctx.strokeStyle = '#d4c4b7';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

        // 重新设置字体（因为画布重置后需要重新设置）
        ctx.font = `${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`;
        ctx.fillStyle = '#2c3e50';  // 深灰色文字
        
        // 绘制文本
        let currentY = padding + lineHeight;
        
        allLines.forEach((paragraph, paraIndex) => {
            // 绘制段落
            paragraph.forEach((line, lineIndex) => {
                // 计算每行的x位置，实现两端对齐
                let x = padding;
                ctx.fillText(line, x, currentY);
                currentY += lineHeight;
            });
            
            // 添加段落间距
            if (paraIndex < allLines.length - 1) {
                currentY += paragraphSpacing;
            }
        });
    }

    function downloadImage() {
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `text-image-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    }

    generateBtn.addEventListener('click', generateImage);
    downloadBtn.addEventListener('click', downloadImage);
    
    // 初始化空白画布
    generateImage();
}); 