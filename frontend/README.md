# Aburi Salmon "Waiter" Frontend COMP3900 Project

## Getting Started

We are using React on Next.JS as multi-page server-rendered frontend. Tutorial for React-Next.JS is available [here](https://nextjs.org/learn/basics/getting-started).

## Package manager

We are using `npm` instead of `yarn` for this project. To start this project, run `npm start`.

Note: it is possible to run this project with npm. However, do not push `yarn.lock` (not listed in `.gitignore`).

## To add package for this project

Execute `npm install <package_name>` for dependencies. Add `-D` for devDependency.

## Development

In order to compile and run your frontend on dev environment, run `npm run dev`. This will compile your pages on the `.next` directory.

When deploying to production environment (demo), you'll need to run `npm run build` to compile optimised version of your pages. Afterwards, you can start your frontend using `npm run start`.

## Side notes

- There is no need to include lodash in your script. Next.js includes lodash on their package.
- Hot reload is supported on dev environment.
- Don't remove `next-env.d.ts`
