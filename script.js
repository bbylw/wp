document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const preview = document.getElementById('preview');
    const titleBtn = document.getElementById('titleBtn');
    const normalBtn = document.getElementById('normalBtn');

    // 检查 html2canvas 加载
    if (typeof html2canvas === 'undefined') {
        console.error('html2canvas 未能正确加载');
        alert('页面资源加载失败，请刷新页面重试');
        return;
    }

    // 处理粘贴事件
    editor.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    });

    // 设置段落样式
    function setParagraphStyle(style) {
        const selection = window.getSelection();
        const currentNode = selection.anchorNode;
        const paragraph = currentNode.nodeType === 1 ? currentNode : currentNode.parentNode;
        
        if (paragraph.tagName === 'P') {
            // 移除所有样式类
            paragraph.classList.remove('title', 'normal');
            // 添加新样式类
            paragraph.classList.add(style);
        }
    }

    // 标题按钮点击事件
    titleBtn.addEventListener('click', () => {
        setParagraphStyle('title');
        titleBtn.classList.add('active');
        normalBtn.classList.remove('active');
    });

    // 正文按钮点击事件
    normalBtn.addEventListener('click', () => {
        setParagraphStyle('normal');
        normalBtn.classList.add('active');
        titleBtn.classList.remove('active');
    });

    // 处理回车键
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const currentNode = range.startContainer;
            const currentParagraph = currentNode.closest('p') || currentNode;
            
            // 创建新段落
            const newP = document.createElement('p');
            newP.classList.add('normal'); // 默认使用正文样式
            newP.style.textIndent = '2em';
            
            if (range.collapsed && currentNode.textContent.length === range.startOffset) {
                currentParagraph.parentNode.insertBefore(newP, currentParagraph.nextSibling);
            } else {
                const secondHalf = range.extractContents();
                newP.appendChild(secondHalf);
                currentParagraph.parentNode.insertBefore(newP, currentParagraph.nextSibling);
            }
            
            // 移动光标到新段落
            range.selectNodeContents(newP);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            
            // 更新按钮状态
            normalBtn.classList.add('active');
            titleBtn.classList.remove('active');
        }
    });

    // 初始化编辑器
    function initializeEditor() {
        const p = document.createElement('p');
        p.classList.add('normal');
        p.style.textIndent = '2em';
        editor.innerHTML = '';
        editor.appendChild(p);
        normalBtn.classList.add('active');
    }

    // 生成图片
    async function generateImage() {
        generateBtn.disabled = true;
        generateBtn.textContent = '生成中...';
        
        try {
            // 创建临时容器并复制内容
            const tempContainer = document.createElement('div');
            tempContainer.style.width = editor.offsetWidth + 'px';
            tempContainer.style.padding = '40px';
            tempContainer.style.background = '#fff9f0';
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            
            // 复制编辑器内容，保留样式
            tempContainer.innerHTML = editor.innerHTML;
            document.body.appendChild(tempContainer);

            // 计算实际内容高度
            const actualHeight = tempContainer.offsetHeight;

            const canvas = await html2canvas(tempContainer, {
                backgroundColor: '#fff9f0',
                scale: 2,
                useCORS: true,
                logging: true,
                width: editor.offsetWidth,
                height: actualHeight,
                windowWidth: editor.offsetWidth,
                windowHeight: actualHeight
            });
            
            document.body.removeChild(tempContainer);
            
            preview.style.display = 'block';
            preview.innerHTML = '';
            preview.appendChild(canvas);
            
            downloadBtn.disabled = false;
        } catch (error) {
            console.error('生成图片失败:', error);
            alert('生成图片失败，请重试');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = '生成图片';
        }
    }

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
            initializeEditor();
        }
    });

    // 初始化
    normalBtn.classList.add('active');
}); 