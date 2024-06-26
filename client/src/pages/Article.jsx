import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import articleContent from "./article-content";
//components
import Articles from "../components/Articles";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";
//pages
import Notfound from "./Notfound";

const Article = () => {
  const { name } = useParams();
  const [articlesInfo, setArticlesInfo] = useState({ comments: [] });

  const article = articleContent.find((article) => article.name === name);

  console.log({ name });

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/articles/${name}`);
      const body = await result.json();
      console.log({ body });
      setArticlesInfo(body);
    };
    if (name) fetchData();
  }, [name]);

  if (!article) return <Notfound />;
  const otherArticles = articleContent.filter(
    (article) => article.name !== name
  );

  return (
    <>
      <h1 className="sm:text-4xl text-2xl font-bold my-6 text-gray-900">
        {article.title}
      </h1>
      {article.content.map((paragraph, index) => (
        <p className="mx-auto leading-relaxed text-base mb-4" key={index}>
          {paragraph}
        </p>
      ))}
      <CommentsList comments={articlesInfo.comments} />
      <AddCommentForm articleName={name} setArticlesInfo={setArticlesInfo} />
      <h1 className="sm:text-2xl text-xl font-bold my-4 text-gray-900">
        Other Articles
      </h1>
      <div className="flex flex-wrap -m-4">
        <Articles articles={otherArticles} />
      </div>
    </>
  );
};

export default Article;
