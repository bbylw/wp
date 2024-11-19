document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const preview = document.getElementById('preview');

    // 检查 html2canvas 是否正确加载
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas 未能正确加载');
        alert('页面资源加载失败，请刷新页面重试');
        return;
    }

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
        // 显示加载状态
        generateBtn.disabled = true;
        generateBtn.textContent = '生成中...';
        
        // 确保所有段落都有正确的样式
        ensureParagraphStyle();
        
        try {
            // 创建一个临时容器，复制编辑器内容
            const tempContainer = document.createElement('div');
            tempContainer.style.width = editor.offsetWidth + 'px';
            tempContainer.style.padding = '40px';
            tempContainer.style.background = '#fff9f0';
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.innerHTML = editor.innerHTML;
            document.body.appendChild(tempContainer);

            const canvas = await html2canvas(tempContainer, {
                backgroundColor: '#fff9f0',
                scale: 2, // 提高清晰度
                useCORS: true,
                logging: true, // 启用日志以便调试
                width: editor.offsetWidth,
                height: Math.max(editor.offsetHeight, tempContainer.offsetHeight),
                windowWidth: editor.offsetWidth,
                windowHeight: Math.max(editor.offsetHeight, tempContainer.offsetHeight)
            });
            
            // 清理临时容器
            document.body.removeChild(tempContainer);
            
            // 显示预览
            preview.style.display = 'block';
            preview.innerHTML = '';
            preview.appendChild(canvas);
            
            // 启用下载按钮
            downloadBtn.disabled = false;
        } catch (error) {
            console.error('生成图片失败:', error);
            alert('生成图片失败，请重试');
        } finally {
            // 恢复按钮状态
            generateBtn.disabled = false;
            generateBtn.textContent = '生成图片';
        }
    }

    // 下载图片
    function downloadImage() {
        const canvas = preview.querySelector('canvas');
        if (!canvas) {
            alert('请先生成图片');
            return;
        }

        try {
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.download = `text-image-${timestamp}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('下载图片失败:', error);
            alert('下载图片失败，请重试');
        }
    }

    generateBtn.addEventListener('click', generateImage);
    downloadBtn.addEventListener('click', downloadImage);

    // 清除编辑器初始内容
    editor.addEventListener('focus', function() {
        if (this.innerHTML === '<p>在这里输入文字...</p>') {
            this.innerHTML = '<p></p>';
        }
    });

    // 初始禁用下载按钮
    downloadBtn.disabled = true;
}); 