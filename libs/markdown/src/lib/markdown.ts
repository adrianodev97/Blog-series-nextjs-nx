// ts-ignore
import { readFileSync } from "fs";
import matter from "gray-matter";

// ts-ignore
import { join } from "path";

import { serialize } from "next-mdx-remote/serialize";

console.log("test")

export const getParsedFileContentBySlug = (
    fileName: string, 
    postsPath: string
) => {
    const postFilePath = join(postsPath, `${fileName}.mdx`);
    const fileContent = readFileSync(postFilePath);

    const { data, content } = matter(fileContent);

    console.log(data, content)

    return {
        frontMatter: data,
        content
    };
}

export function renderMarkdown(markdownContent: string) {
    return serialize(markdownContent || "");
}
