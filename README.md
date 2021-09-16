# Ветка letafo
## LetAFo - LETovo Account inFO 

Серверная часть | система, которая получает твои имя и фамилию по летовскому логину и паролю.

## Как использовать в своих проектах

Надо отправлять запрос на `letafo-eu.heroku.com` с типом данных `application/json` с данными по шаблону:

```json
{
  "user": "ИМЯ_ПОЛЬЗОВАТЕЛЯ",
  "password": "ПАРОЛЬ"
}
```

и сервер вернёт строку (`text/plain`) типа `Фамилия Имя`.
*Важно: если данные для входа неверны или данные не получилось получить, сервер вернёт строку `ERR`*
