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
        if (selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) {
            // 如果没有选中文本，处理当前段落
            const currentNode = range.startContainer;
            const paragraph = currentNode.nodeType === 1 ? currentNode : currentNode.parentNode;
            if (paragraph.tagName === 'P') {
                updateParagraphStyle(paragraph, style);
            }
        } else {
            // 如果选中了文本，创建新段落
            const content = range.extractContents();
            const newP = document.createElement('p');
            newP.appendChild(content);
            updateParagraphStyle(newP, style);
            range.insertNode(newP);
            
            // 清理选区
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.selectNodeContents(newP);
            selection.addRange(newRange);
        }
    }

    // 更新段落样式
    function updateParagraphStyle(paragraph, style) {
        paragraph.className = style;
        if (style === 'title') {
            paragraph.style.textIndent = '0';
            paragraph.style.textAlign = 'center';
            paragraph.style.fontSize = '32px';
            paragraph.style.fontWeight = 'bold';
            paragraph.style.marginBottom = '1.2em';
        } else {
            paragraph.style.textIndent = '2em';
            paragraph.style.textAlign = 'left';
            paragraph.style.fontSize = '18px';
            paragraph.style.fontWeight = 'normal';
            paragraph.style.marginBottom = '1em';
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
            
            // 创建新段落
            const newP = document.createElement('p');
            updateParagraphStyle(newP, 'normal');
            
            // 插入新段落
            document.execCommand('insertParagraph', false);
            
            // 确保新段落有正确的样式
            const selection = window.getSelection();
            const currentNode = selection.anchorNode;
            const currentParagraph = currentNode.nodeType === 1 ? currentNode : currentNode.parentNode;
            if (currentParagraph.tagName === 'P') {
                updateParagraphStyle(currentParagraph, 'normal');
            }
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