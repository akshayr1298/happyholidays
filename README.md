
# HappyHolidays

## Table of contents

- [Introduction](#introduction)
- [Demo](#demo)
- [Run](#run)
- [Technology](#technology)
- [Features](#features)
- [License](#license)

## Introduction

A virtual hotel rooms reservation platform  using Node js, Express js, and MongoDb.

NOTE: Please read the RUN section before opening an issue.

## Demo

The application is deployed to AWS and can be accessed through the following link:

[HappyHolidays on AWS](https://happyhotelrent.ml/)

## Run

To run this application, you have to set your own environmental variables. For security reasons, some variables have been hidden from view and used as environmental variables with the help of dotenv package. Below are the variables that you need to set in order to run the application:

- KEY_ID:     This is the razorpay key_Id (string).

- KEY_SECRET:  This is the razorpay key_Secret (string).

After you've set these environmental variables in the .env file at the root of the project, and intsall node modules using  `npm install`

Now you can run `npm start` in the terminal and the application should work.

## Technology

The application is built with:

- Node.js 
- MongoDB
- Express 
- Bootstrap 
- AJAX
- JQuery
- Razorpay

Deployed in AWS EC2 instance with Nginx reverse proxy


# Features

- User can create an account 
- Using this platform user can book hotel rooms which will be listed by different ventors
- User can edit his/her profile page 
- User can view bookig history and user can cancel the booking
- Vendors can register and add rooms
- Vendors can edit and delete rooms
- Vendors can view booking status of the user 
- vendors can view the sales reports on dashboard
- Admin can view all booking status of the user
- Admin can manage vendors and admin 
- Admin can view total sales report of every vendors and he can view weekily sales report


## License

[![License](https://img.shields.io/:License-MIT-blue.svg?style=flat-square)](http://badges.mit-license.org)

- MIT License
- Copyright 2022 © [AKSHAY SHANKAR R PANICKER](https://github.com/akshayr1298)
