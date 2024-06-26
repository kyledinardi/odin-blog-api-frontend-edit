import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import styles from '../style/Post.module.css';
import formStyles from '../style/Form.module.css';

function Post({
  title,
  timestamp,
  text,
  isPublished,
  postId,
  setPost,
  isHome,
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const date = new Date(timestamp);
  const navigate = useNavigate();

  function decodeHTMLEntities(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  const decodedTitle = decodeHTMLEntities(title);
  const decodedText = decodeHTMLEntities(text);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);

  async function updatePost(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://backend-green-butterfly-9917.fly.dev/posts/${postId}`,
        {
          method: 'PUT',
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: e.target[0].value,
            isPublished: e.target[1].checked,
            text: e.target[2].value,
          }),
        },
      );

      const responseJson = await response.json();
      setIsEdit(false);
      setPost(responseJson.post);
    } catch (err) {
      throw new Error(err);
    }
  }

  async function deletePost() {
    try {
      const response = await fetch(
        `https://backend-green-butterfly-9917.fly.dev/posts/${postId}`,
        {
          method: 'DELETE',
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      await response.json();
      navigate('/');
    } catch (err) {
      throw new Error(err);
    }
  }

  if (isEdit) {
    return (
      <form onSubmit={(e) => updatePost(e)}>
        <div className={formStyles.fields}>
          <label htmlFor='title'>Title</label>
          <input
            type='text'
            name='title'
            id='title'
            required
            defaultValue={decodedTitle}
          />
          <label htmlFor='isPublished'>Published</label>
          <input
            type='checkbox'
            name='isPublished'
            id='isPublished'
            defaultChecked={isPublished}
          />
        </div>
        <textarea
          name='text'
          id='text'
          cols='30'
          rows='10'
          required
          defaultValue={decodedText}
        ></textarea>
        <button type='button' onClick={() => setIsEdit(!isEdit)}>
          Cancel
        </button>
        <button type='submit'>Update</button>
      </form>
    );
  }

  return (
    <div className={styles.post}>
      <h2 className={styles.title}>{decodedTitle}</h2>
      <p className={styles.timestamp}> {formattedDate}</p>
      <p>{isPublished ? 'Published' : 'Not Published'}</p>
      <p>{decodedText}</p>
      {!isHome && (
        <div>
          <button onClick={() => setIsEdit(true)}>Edit</button>
          <button onClick={() => setIsDeleting(true)}>Delete</button>
        </div>
      )}
      {isDeleting && (
        <div>
          <h3>Are you sure you want to delete this post?</h3>
          <button onClick={() => deletePost()}>Yes</button>
          <button onClick={() => setIsDeleting(false)}>No</button>
        </div>
      )}
    </div>
  );
}

Post.propTypes = {
  title: PropTypes.string,
  timestamp: PropTypes.string,
  text: PropTypes.string,
  isPublished: PropTypes.bool,
  postId: PropTypes.string,
  setPost: PropTypes.func,
  isHome: PropTypes.bool,
};

export default Post;
