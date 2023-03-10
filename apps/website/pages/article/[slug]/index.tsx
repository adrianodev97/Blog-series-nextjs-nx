import { readdirSync } from "fs";
import { GetStaticPaths, GetStaticProps } from "next";
import { join } from "path";
import { ParsedUrlQuery } from "querystring";
import { getParsedFileContentBySlug, renderMarkdown } from "@website/markdown";
import { MDXRemote } from "next-mdx-remote";
// import { Youtube } from "../../../../../libs/shared/mdx-elements/src/lib/youtube/youtube";
// import { CustomLink } from "../../../../../libs/shared/mdx-elements/src/lib/custom-link/custom-link";
import dynamic from "next/dynamic";


export interface ArticleProps extends ParsedUrlQuery{
  slug: string;
}

const mdxElements = {
  // Youtube,
  // a: CustomLink,

  Youtube: dynamic(async () => { 
    const components = await import("@website/shared/mdx-elements");
    return components.Youtube;
  }),

  // Youtube: dynamic( 
  //   () => import("@website/shared/mdx-elements/youtube/youtube")
  // ),
}

const POSTS_PATH = join(process.cwd(), "_articles" /*process.env.articleMarkdownPath*/);

export function Article({ frontMatter, html }) {
  return (
    <div className="m-6">
      <article className="prose prose-lg"> 
        <h1>{ frontMatter.title }</h1>
        <div>by { frontMatter.author.name }</div>
      </article>
      <hr />
      <MDXRemote {...html} components={mdxElements}/>
    </div>
  );
};

// ts-ignore
export const getStaticProps: GetStaticProps<{[key: string]: any}> = async ({ 
  params, 
} : {
  params: ArticleProps;
}) => {

  // 1. parse the content of our markdown and separate it into frontmatter and content
  const articleMarkdownContent = getParsedFileContentBySlug(
    params.slug, 
    POSTS_PATH
  );


  // 2. convert markdown content => HTML
  const renderHTML = await renderMarkdown(articleMarkdownContent.content);


  return {
    props: {
      frontMatter: articleMarkdownContent.frontMatter,
      html: renderHTML,
    },
  };
};


export const getStaticPaths: GetStaticPaths<ArticleProps> = async () => {

  const paths = readdirSync(POSTS_PATH)
    .map((path) => path.replace(/\.mdx?$/, ''))
    .map((slug) => ({params: { slug }}));

  return {
    paths,
    fallback: false,
  };
};

export default Article;


