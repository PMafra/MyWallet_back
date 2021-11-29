# My Wallet - backend

Try it out now at https://projeto-14-my-wallet-front-blue.vercel.app/ <br>
Link to front-end: https://github.com/PMafra/MyWallet_front

An easy to use financial manager. Track your revenues and expenses to learn how you spend your money and know all the time how much you have.

## About

This is an web application with which lots of people can manage their own expenses and revenues. Below are the implemented features:

- Sign-up
- Login
- Logout
- List all financial events for a user
- Add expense
- Add revenue

By using this app any user can learn how they've been using their money and always keep track of your balance.

## Technologies
The following tools and frameworks were used in the construction of the project:<br>
<p>
  <img src="https://img.shields.io/badge/-Nodejs-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-Express-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-PostgreSQL-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/-Jest-purple?style=for-the-badge" />
</p>

## How to run

1. Create a root project folder named MyWallet
```sh
mkdir MyWallet
```
2. Clone the front-end repo
```sh
git clone https://github.com/PMafra/MyWallet_front.git
```
3. Install NPM packages for the front-end repo
```sh
npm install
```
4. Clone the back-end repo as a sibling to the front-end (within the /MyWallet folder)
```sh
git clone https://github.com/PMafra/MyWallet_back.git
```
5. Install NPM packages for the back-end repo
```sh
npm install
```
6. Follow instructions to fully run front-end at https://github.com/PMafra/MyWallet_front

7. Create .env.dev and .env.test files based on .env.example file

7. Display the back-end scripts with
```bash
npx ntl
```
8. Choose one of the three options to run back-end:
* **test** - for test environment
* **start** - for production environment
* **start:dev** - for development environment
