import React from "react";
import Button from "@mui/material/Button";

import { Link } from 'react-router-dom'

import { selectIsAuth, logout } from '../../redux/slices/auth'

import { useSelector, useDispatch } from 'react-redux'

import styles from "./Header.module.scss";
import Container from "@mui/material/Container";

export const Header = () => {

  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)


  const onClickLogout = () => {
    if(window.confirm('Вы действительно хотите выйти?')) {
      dispatch(logout())
      window.localStorage.removeItem('token')
    }
  }

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>MY BLOG, DONT ARCHAKOV BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {
              isAuth ?
              (<>
                <Link to="/add-post">
                  <Button variant="outlined">Написать статью</Button>
                </Link>
                <Button variant="contained" onClick={onClickLogout}>Выйти</Button>
              </>)
              :
              (<>
                <Link to="/login">
                  <Button variant="outlined">Войти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Создать аккаунт</Button>
                </Link>
              </>)
            }

          </div>
        </div>
      </Container>
    </div>
  );
};
