import { compress, debounce, decodeHTML, decompress, encodeHTML, safeName } from '..';

describe('utils', () => {
  test('debounce', async () => {
    let num = 0;
    const increment = debounce(() => (num += 1), 50);
    increment();
    increment();
    increment();
    increment();
    await new Promise((resolve) => {
      setTimeout(() => {
        expect(num).toBe(1);
        resolve('done');
      }, 70);
    });
  });

  test('encodeHTML', () => {
    const html = '<div class="bold">hello & world!</div>';
    const encoded = encodeHTML(html);
    expect(encoded).toBe('&lt;div class=&#34;bold&#34;&gt;hello &amp; world!&lt;/div&gt;');
  });

  test('decodeHTML', () => {
    const encoded = '&lt;div class=&#34;bold&#34;&gt;hello &amp; world!&lt;/div&gt;';
    const decoded = decodeHTML(encoded);
    expect(decoded).toBe('<div class="bold">hello & world!</div>');
  });

  test('safeName', () => {
    const unsafe = 'some unsafe/text?here"';
    const safe = safeName(unsafe);
    expect(safe).toBe('some_unsafe_text_here_');
  });

  test('compress/decompress', () => {
    const str = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      `;
    const compressed = compress(str);
    const decompressed = decompress(compressed);
    expect(decompressed).toBe(str);
    expect(compressed.length).toBeLessThan(str.length);
  });
});
