import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import { selectIsAuth } from '../../redux/slices/auth'
import { useSelector } from 'react-redux'

import { Navigate, useNavigate } from 'react-router-dom'

import axios from '../../axios'

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

export const AddPost = () => {

  const navigate = useNavigate()

  const isAuth = useSelector(selectIsAuth)
  const [isLoading, setIsLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const inputFileRef = React.useRef(null)

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const handleChangeFile = async e => {
    try {

      const formData = new FormData()
      const file = e.target.files[0]

      console.log(e.target.files)

      formData.append('image', file)
      const { data } = await axios.post('/upload', formData)

      setImageUrl(data.url)
    } catch(err) {
      console.warn(err)
      alert('Ошибка при загрузке файла!')
    }
  }


  const onClickRemoveImage = async () => {
    setImageUrl('')
  }

  const onSubmit = async () => {
    try {
      setIsLoading(true)

      const fields = {
        title,
        imageURL: `http://localhost:4444${imageUrl}`,
        tags: tags.split(' '),
        text
      }

      const { data } = await axios.post('/posts', fields)

      const id = data._id

      navigate(`/posts/${id}`)
    } catch (err) {
      console.warn(err)
      alert('Ошибка публикации поста!')
    }
  }

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if(!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button variant="outlined" onClick={() => inputFileRef.current.click()} size="large">
        Загрузить превью
      </Button>
      <input type="file" ref={inputFileRef} onChange={handleChangeFile} hidden/>
      {
        imageUrl && (
          <>
            <Button variant="contained" color="error" onClick={onClickRemoveImage}>
              Удалить пикчу
            </Button>
            <img src={`http://localhost:4444${imageUrl}`} alt="Uploaded" className={styles.image}/>
          </>
        )
      }
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
        value={tags}
        onChange={e => setTags(e.target.value)}
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Опубликовать
        </Button>
        <Button size="large">Отмена</Button>
      </div>
    </Paper>
  );
};
