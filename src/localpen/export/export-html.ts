import { Pen } from '../models';
import { downloadFile } from './utils';

export const exportHTML = (config: Pen, html: string) => {
  const filename = config.title;
  const extension = 'html';
  const content = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
  downloadFile(filename, extension, content);
};
