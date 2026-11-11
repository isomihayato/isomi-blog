import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import { toString } from 'hast-util-to-string';
import type { Root, Element, RootContent } from 'hast';

export type ArticleHeading = {
  /** 本文の見出し要素に rehype-slug が付ける id と同じ値 */
  id: string;
  /** 目次に表示する見出しの文字列(記号・長音記号などもそのまま) */
  text: string;
  /** 見出しのレベル(## なら 2、### なら 3) */
  depth: number;
};

const HEADING_TAG = /^h([1-6])$/;

// 記事本文の表示(react-markdown + rehype-slug)と同じ処理で Markdown を変換する。
// react-markdown は内部で remark-parse → remark-rehype({ allowDangerousHtml: true }) を使うため、
// ここでも同じ設定にして、見出しの id が本文と必ず一致するようにする。
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug);

/**
 * 記事本文(Markdown)から目次用の見出しを取り出す。
 * コードブロック内の「## 」などは見出しとして扱われない。
 * @param body 記事本文(Markdown)
 * @param depths 目次に含める見出しのレベル(既定は ## と ###)
 */
export function extractArticleHeadings(
  body: string | null | undefined,
  depths: number[] = [2, 3],
): ArticleHeading[] {
  if (!body) return [];

  const tree = processor.runSync(processor.parse(body)) as Root;
  const headings: ArticleHeading[] = [];

  const walk = (nodes: RootContent[]) => {
    nodes.forEach((node) => {
      if (node.type !== 'element') return;
      const element = node as Element;
      const match = HEADING_TAG.exec(element.tagName);
      if (match) {
        // 重複した見出しの連番(-1, -2…)を本文とそろえるため、id は全レベルの見出しに付いたものを使う
        const depth = Number(match[1]);
        const id = element.properties?.id;
        if (depths.includes(depth) && typeof id === 'string') {
          headings.push({ id, text: toString(element).trim(), depth });
        }
        return;
      }
      walk(element.children);
    });
  };
  walk(tree.children);

  return headings;
}
