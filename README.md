
this project is a standard reactjs + vite project utilizing tailwindcss for formatting and a firebase backend and auth system

basic guides online will help you start a reactjs project with vite
https://vite.dev/guide/ 
and make sure the template is react

next, you'll want to add tailwindcss to your react project
https://stackoverflow.com/questions/70631152/how-to-add-tailwind-css-to-an-exisiting-react-project 
this is pretty much how to do it, first response

after that, you'll need to add the connection to firebase
https://firebase.google.com/docs/web/setup
firebase is a google service that will help you do things like authorizing login and databasing
you can also host small webapps for free, which is what I do most of the time

once everything is set up, run:
    npm run dev
in the console to boot up the react project locally to check your work


*** if you host your project with react, know that vite will change where your index.html file goes
you have to specify that it goes to the DIST folder instead of the default