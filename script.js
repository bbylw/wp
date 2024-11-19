document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const preview = document.getElementById('preview');

    // 处理编辑器的粘贴事件，确保粘贴的是纯文本
    editor.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });

    // 处理回车键，自动创建新段落
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.execCommand('insertParagraph', false);
            // 为新段落添加缩进
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const newP = range.startContainer.parentElement;
            if (newP.tagName === 'P') {
                newP.style.textIndent = '2em';
            }
        }
    });

    // 确保每个段落都有缩进
    const ensureParagraphStyle = () => {
        const paragraphs = editor.getElementsByTagName('p');
        for (let p of paragraphs) {
            p.style.textIndent = '2em';
        }
    };

    // 初始化编辑器样式
    editor.innerHTML = '<p>在这里输入文字...</p>';
    ensureParagraphStyle();

    // 生成图片
    async function generateImage() {
        // 确保所有段落都有正确的样式
        ensureParagraphStyle();
        
        try {
            const canvas = await html2canvas(editor, {
                backgroundColor: '#fff9f0',
                scale: 2, // 提高清晰度
                useCORS: true,
                logging: false
            });
            
            preview.style.display = 'block';
            preview.innerHTML = '';
            preview.appendChild(canvas);
        } catch (error) {
            console.error('生成图片失败:', error);
        }
    }

    // 下载图片
    function downloadImage() {
        const canvas = preview.querySelector('canvas');
        if (!canvas) return;

        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        link.download = `text-image-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    }

    generateBtn.addEventListener('click', generateImage);
    downloadBtn.addEventListener('click', downloadImage);

    // 清除编辑器初始内容
    editor.addEventListener('focus', function() {
        if (this.innerHTML === '<p>在这里输入文字...</p>') {
            this.innerHTML = '<p></p>';
        }
    });
}); 