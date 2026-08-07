// utils/textFormatter.js

/**
 * 解析文本，识别换行符、###标题、**加粗**和-列表项
 * @param {string} text - 原始文本
 * @returns {Array} 解析后的结构化数据
 */
export function parseFormattedText(text) {
  if (!text) return [];

  // 按换行符分割文本，并过滤空行
  const lines = text.split(/\n/).filter(line => line.trim() !== '');
  
  return lines.map(line => {
    // 判断并解析标题 (###)
    if (line.startsWith('###')) {
      return {
        type: 'title',
        content: line.replace(/^###\s*/, '').trim()
      };
    }
    
    // 判断并解析无序列表项 (-)
    if (line.startsWith('-')) {
      const listContent = line.replace(/^-\s*/, '').trim();
      return {
        type: 'list-item',
        content: parseInlineFormatting(listContent)
      };
    }

    // 处理普通段落，解析其中的加粗标记
    return {
      type: 'paragraph',
      content: parseInlineFormatting(line.trim())
    };
  });
}

/**
 * 解析行内格式，处理**加粗**
 */
function parseInlineFormatting(text) {
  const segments = [];
  let currentIndex = 0;
  let boldMatch;
  
  const boldRegex = /\*\*(.*?)\*\*/g;

  while ((boldMatch = boldRegex.exec(text)) !== null) {
    // 添加**之前的普通文本
    if (boldMatch.index > currentIndex) {
      segments.push({
        type: 'normal',
        content: text.substring(currentIndex, boldMatch.index)
      });
    }

    // 添加加粗文本
    segments.push({
      type: 'bold',
      content: boldMatch[1]
    });

    currentIndex = boldMatch.index + boldMatch[0].length;
  }

  // 添加最后一个**之后的普通文本
  if (currentIndex < text.length) {
    segments.push({
      type: 'normal',
      content: text.substring(currentIndex)
    });
  }

  // 如果没有匹配到任何加粗标记，返回整个文本作为普通段落
  if (segments.length === 0) {
    segments.push({
      type: 'normal',
      content: text
    });
  }

  return segments;
}