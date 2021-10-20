import fs from "fs";

import handlebars from "handlebars";

interface ITemplateVariable {
  [key: string]: string | number;
}

interface IParseMailTemplate {
  file: string;
  variables: ITemplateVariable;
}

class HandlebarsMailTemplate {
  public async parse({ file, variables }: IParseMailTemplate) {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: "utf-8",
    });
    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export { HandlebarsMailTemplate };
