// Markdown のコードブロック(```言語名)にシンタックスハイライトを付ける rehype プラグイン。
//
// rehype-highlight は使わない。rehype-highlight は既定の言語セット(common: 約37言語)を
// 必ず読み込むため、記事詳細の JS が gzip で約67kB 増えてしまう。
// ここでは lowlight に、このブログで使う言語だけを登録している。
// 言語を追加するときは languages に足す。
// ```js / ```ts / ```sh / ```html などの別名は、各言語の定義に含まれている。
import { createLowlight } from 'lowlight';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import ini from 'highlight.js/lib/languages/ini';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import plaintext from 'highlight.js/lib/languages/plaintext';
import python from 'highlight.js/lib/languages/python';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import type { Element, ElementContent, Root, RootContent } from 'hast';

const lowlight = createLowlight({
  bash,
  css,
  diff,
  dockerfile,
  ini,
  javascript,
  json,
  markdown,
  php,
  plaintext,
  python,
  scss,
  shell,
  sql,
  typescript,
  xml,
  yaml,
});

type Node = Root | RootContent | ElementContent;

// 要素の中のテキストをつなげて返す
function toText(node: Node): string {
  if (node.type === 'text') return node.value;
  if ('children' in node) {
    return (node.children as Node[]).map(toText).join('');
  }
  return '';
}

// class="language-xxx" から言語名を取り出す
function languageOf(code: Element): string | undefined {
  const className = code.properties?.className;
  const classes = Array.isArray(className) ? className : [];
  for (const c of classes) {
    const name = String(c);
    if (name.startsWith('language-')) return name.slice('language-'.length);
  }
  return undefined;
}

function highlightCode(code: Element) {
  const lang = languageOf(code);
  // 言語の指定がない、または登録していない言語は、色を付けずにそのまま表示する
  if (!lang || !lowlight.registered(lang)) return;

  const result = lowlight.highlight(lang, toText(code));
  const className = code.properties.className;
  code.properties.className = [
    ...(Array.isArray(className) ? className : []),
    'hljs',
  ];
  code.children = result.children as ElementContent[];
}

function walk(node: Node) {
  if (!('children' in node)) return;
  for (const child of node.children as Node[]) {
    if (child.type !== 'element') continue;
    if (child.tagName === 'pre') {
      for (const code of child.children) {
        if (code.type === 'element' && code.tagName === 'code') {
          highlightCode(code);
        }
      }
      continue;
    }
    walk(child);
  }
}

export default function rehypeCodeHighlight() {
  return (tree: Root) => {
    walk(tree);
  };
}
