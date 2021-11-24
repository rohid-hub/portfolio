/* eslint-disable @next/next/no-img-element */
import React from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { client } from "../../apolloClient";
import { gql } from "@apollo/client";
import Markdown from "../../components/Markdown";
import Head from "next/head";
import Tag from "../../components/Tag";
import PopularTags from "../../components/widgets/PopularTags";
import PopularBlogs from "../../components/widgets/PopularBlogs";

const BlogPage = ({ blog, tags }) => {
  return (
    <main className="">
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content={blog.excerpt || blog.title || ""} />
        <meta
          name="keywords"
          content={blog.tags.map((tag) => tag.name).join(", ")}
        ></meta>
      </Head>
      <div
        className="w-full h-64 md:h-80 lg:h-96 relative"
        style={{ zIndex: -10 }}
      >
        <img
          src={blog.coverPhoto.url}
          alt={`${blog.title} - Cover Photo`}
          className="w-full overflow-hidden object-cover h-full saturate-150"
        />
        <div className="absolute inset-0 bg-white dark:bg-gray-900 backdrop-blur-xl bg-opacity-30 dark:bg-opacity-30"></div>
      </div>
      <div className="grid grid-cols-3 gap-16 container py-16 z-10">
        <article className="col-span-3 md:col-span-2">
          <div className="flex flex-col gap-8">
            <img
              src={blog.coverPhoto.url}
              alt={`${blog.title} - Cover Photo`}
              className="w-full overflow-hidden object-cover -mt-48 lg:-mt-80 rounded-2xl"
              style={{ aspectRatio: "16/9" }}
            />
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold">{blog.title}</h1>
              <p>
                Published on{" "}
                <strong>{new Date(blog.createdAt).toDateString()}</strong>
              </p>
              <ul className="flex flex-row flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <li key={tag.slug}>
                    <Tag tag={tag} size="sm" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Markdown>{blog.body}</Markdown>
        </article>
        <aside className="col-span-3 md:col-span-1 flex flex-col gap-16">
          <PopularTags tags={tags} />
          <PopularBlogs blogs={[blog, blog]} />
        </aside>
      </div>
    </main>
  );
};

export default BlogPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const {
    data: { blogs },
  } = await client.query({
    query: gql`
      query GetData {
        blogs {
          slug
        }
      }
    `,
  });

  const paths = blogs.map((blog) => ({
    params: {
      slug: blog.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const {
    data: { blogs, tags },
  } = await client.query({
    query: gql`
      query GetData {
        blogs(where: { slug: "${params.slug}" }) {
          title
          body
          createdAt
          coverPhoto {
            url
          }
          tags {
            slug
            name
            backgroundColor {
              css
              rgba {
                r
                g
                b
                a
              }
            }
            foregroundColor {
              css
              rgba {
                r
                g
                b
                a
              }
            }
          }
        }
        
        tags {
          slug
          name
          backgroundColor {
            css
            rgba {
              r
              g
              b
              a
            }
          }
          foregroundColor {
            css
            rgba {
              r
              g
              b
              a
            }
          }
        }
      }
    `,
  });
  return {
    props: {
      blog: blogs[0],
      tags,
    },
  };
};
