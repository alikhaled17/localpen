import { languageIsEnabled, processors } from '../languages';
import { Language, LanguageSpecs, Pen, Compiler, Compilers, Processors } from '../models';

export const getAllCompilers = (
  languages: Array<LanguageSpecs | Processors>,
  config: Pen,
  baseUrl: string,
) =>
  languages
    .filter(
      (language) =>
        processors.includes(language as Processors) ||
        languageIsEnabled((language as LanguageSpecs).name, config),
    )
    .reduce((compilers, language) => {
      if (language.compiler && !compilers[language.name]) {
        if (typeof language.compiler === 'string') {
          const compiler = languages.find((lang) => lang.name === (language.compiler as Language))
            ?.compiler as Compiler;
          compilers[language.name] = {
            ...compiler,
            url: baseUrl + compiler?.url,
          } as Compiler;
        } else {
          compilers[language.name] = {
            ...language.compiler,
            url: baseUrl + language.compiler?.url,
          } as Compiler;
        }
      }
      return compilers;
    }, {} as Compilers);
