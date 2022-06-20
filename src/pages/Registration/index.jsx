import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";

import { useForm } from 'react-hook-form'

import { useDispatch, useSelector } from 'react-redux'

import { Navigate } from 'react-router-dom'

import { fetchRegister, selectIsAuth } from '../../redux/slices/auth'

export const Registration = () => {

  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()

  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: '',
      fullName: ''
    }
  })

  const onSubmit = async values => {
    const data = await dispatch(fetchRegister(values))

    console.log(data)

    if(!data.payload) {
      return alert('Не удалось зарегистрироваться')
    }

    if('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }

  }

  if(isAuth) {
    return <Navigate to="/"/>
  }



  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          helperText={errors.fullName?.message}
          label="Полное имя" fullWidth
          {...register('fullName', {required: 'Укажите имя'})}
          error={Boolean(errors.fullName?.message)}
        />
        <TextField
          className={styles.field}
          helperText={errors.email?.message}
          label="E-Mail" fullWidth
          {...register('email', {required: 'Укажите почту'})}
          error={Boolean(errors.email?.message)}
        />
        <TextField
          className={styles.field}
          helperText={errors.password?.message}
          label="Пароль" fullWidth
          {...register('password', {required: 'Укажите пароль'})}
          error={Boolean(errors.password?.message)}
          type="password"
        />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Создать аккаунт
        </Button>
      </form>
    </Paper>
  );
};
