document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const preview = document.getElementById('preview');
    const fontSizeSelect = document.getElementById('fontSize');

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

    // 应用字体大小到选中文本
    function applyFontSize(size) {
        const selection = window.getSelection();
        if (!selection.isCollapsed) {
            // 有文本选中的情况
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontSize = `${size}px`;
            range.surroundContents(span);
        } else {
            // 没有选中文本，应用到当前段落
            const currentNode = selection.anchorNode;
            const paragraph = currentNode.nodeType === 1 ? currentNode : currentNode.parentNode;
            if (paragraph.tagName === 'P') {
                paragraph.style.fontSize = `${size}px`;
            }
        }
    }

    // 处理字体大小变化
    fontSizeSelect.addEventListener('change', () => {
        const size = fontSizeSelect.value;
        applyFontSize(size);
    });

    // 处理回车键，自动创建新段落
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const currentNode = range.startContainer;
            const currentParagraph = currentNode.closest('p') || currentNode;
            const currentSize = window.getComputedStyle(currentParagraph).fontSize;
            
            // 插入新段落
            const newP = document.createElement('p');
            newP.style.textIndent = '2em';
            newP.style.fontSize = currentSize; // 继承当前段落的字体大小
            
            // 如果光标在段落末尾，直接添加新段落
            if (range.collapsed && currentNode.textContent.length === range.startOffset) {
                currentParagraph.parentNode.insertBefore(newP, currentParagraph.nextSibling);
            } else {
                // 否则分割当前段落
                const secondHalf = range.extractContents();
                newP.appendChild(secondHalf);
                currentParagraph.parentNode.insertBefore(newP, currentParagraph.nextSibling);
            }
            
            // 将光标移动到新段落
            range.selectNodeContents(newP);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });

    // 初始化编辑器样式
    function initializeEditor() {
        const p = document.createElement('p');
        p.style.fontSize = `${fontSizeSelect.value}px`;
        p.style.textIndent = '2em';
        editor.innerHTML = '';
        editor.appendChild(p);
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

    // 初始禁用下载按钮
    downloadBtn.disabled = true;
}); 