import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from './Post.jsx';

function PostPage() {
  const [post, setPost] = useState(null);
  const { postId } = useParams();

  useEffect(() => {
    fetch(`https://backend-green-butterfly-9917.fly.dev/posts/${postId}`, {
      mode: 'cors',
    })
      .then((response) => response.json())
      .then((response) => {
        setPost(response.post);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [postId]);

  function renderPost() {
    if (post) {
      return (
        <Post
          title={post.title}
          timestamp={post.timestamp}
          text={post.text}
          isPublished={post.isPublished}
          postId={postId}
          setPost={(p) => setPost(p)}
          isHome={false}
        />
      );
    }

    return <h2>Loading Post...</h2>;
  }

  return <div>{renderPost()}</div>;
}

export default PostPage;
