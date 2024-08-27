<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://avatars.githubusercontent.com/u/178942928?v=4" width="50" alt="Consode Logo"></a></p>

## 10MG Frontend 

10mg Pharm is a health tech e-commerce web application designed to facilitate the purchase of drugs and medications online. The platform will support a comprehensive end-to-end e-commerce process, including business onboarding, user and admin account management, product and order management, and a "Buy Now, Pay Later" (BNPL) credit facility. The BNPL facility, which includes credit scoring, voucher issuance, and repayment management, will provide customers with financial flexibility while ensuring secure and compliant transactions.:

## Getting Started
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## NextUI Theme Configuration
This project uses NextUI Component library using TaiwindCSS and 

Color documentation [https://nextui.org/docs/customization/colors](https://nextui.org/docs/customization/colors)

Layout documentation [https://nextui.org/docs/customization/layout](https://nextui.org/docs/customization/layout)


Components documentation [https://nextui.org/docs/components/button](https://nextui.org/docs/components/button)

#### Creating a PR
- Switch to the main branch
- Checkout to a new feature branch using the ticket name assigned on JIRA
e.g if ticket name is TM-001 then that is the branch name
```git checkout -b TM-001```
- See [PULL_REQUEST_TEMPLATE.md](/.github/PULL_REQUEST_TEMPLATE.md) for guide on filling the Pull request template
- If a feature branch exist for the current task you're working on, kindly branch out from that feature branch to create your branch
E.g if we have a feature/epic-name all related ticket that belongs to the epic, their branch should also point to it when submiting PR

#### Commit message
Follow the commit message standared as outline below:
```sh
PATTERN="^(feat|fix|docs|style|refactor|test|chore)(\([a-z]+\))?: .{1,100}$"
```
###### Commit Message flags
* feat - new feature or task implementation
* fix - bug fix
* docs - add update to readme or make some code documentation via comment only
* style
* refactor - minor rework on codebase or implementation improvement that affect one or less files (<= 5 files)
* test - adding test
* chore - major change to existing implementation that affect many files (>=6 files)


e.g 
```
git commit -m 'feat: implement login flow'
```

## 10MG Frontend Engr Team Agreement
This section is dedicated for frontend engineers to align with the codebase team agreement as we prepare to contribute to the 10mg project.

#### Technology Stack and Standard Packages
- Nextjs 14 and above
- Nextjs app directory for routing
- TailwindCSS for styling
- NextUI for UI Component Library

#### Standard Packages
- Tanstack table for datatable rendering and display https://tanstack.com/table/latest
- Axios for http request handling 
https://axios-http.com/docs/intro
- React icon for icon library access to display icons https://react-icons.github.io/react-icons/
- Clsx - utility to manage tailwind class merging and conditional https://www.npmjs.com/package/clsx
- Framer motion for smooth animation 
https://www.framer.com/motion/
- Form handling and error state management
https://www.react-hook-form.com/
- Zod used alongside reach form hook for dynamic and advance validations, you can use this for request response dtos validations as well
https://zod.dev/


## Codebase Agreement

#### Types Organization
- Application types will be organized in a types folder 
All types related to user will be stored in a type declarative file e.g user.d.ts under types folder i,e types/user.d.ts
Global types will follow same as above but stored in a global.d.ts file
There should be a barrel file for easy exporting of all file in a consolidated file
E.g if i have user.d.ts, products.d.ts, orders.d.ts
There should be a index.d.ts file that export all of them
````
export * from “./user.d.ts”
export * from “./product.d.ts”
export * from “./orders.d.ts”
````
This approach should be applicable to utility, providers and components files as well
Pages and Component Organization
Use nextjs component colocation, this means all components should be closer to the pages using them except shared components only.

E.g All components specific to dashboard which is not shared by any other pages should be within dashboard
````
dashboard/
   components/ - this will be components specific to dashboard only and not shared
      dashboard-card.tsx
      dashboard-chart.tsx
   page.tsx
   layout.tsx
   error.tsx
orders/
   components/ - this will be components specific to orders only and not shared
      dashboard-card.tsx
      dashboard-chart.tsx
   page.tsx
   layout.tsx
   error.tsx
global/shared-components/ - this will be shared components
   loading-spinner.tsx
   alert-dialog.tsx
   theme-provider.tsx
````

Component types or interface props should be declared within the component file

```
interface CustomerDetailPageProps {
    params: {
        id: string
    },
    children: ReactNode,
}
export default function CustomerDetailPage({ params, children}: CustomerDetailPageProps) {
    return (<><>) }
````


#### Styling 
- Use TailwindCSS and ensure all pages responsive styling are consider
- Use NextUI component library where applicable
- Use the standard typography to ensure all fontsize are same across codebase

#### API Request
- Axios can be use only
- React Query can be use along side axios to manage loading, refetching of api state and caching


#### Environment Variable and Loading App Configuration
- All env variable will be configure using config.d.ts and expose with config.ts file
- For new env variable added, always remember to add it to the .env.example file for other developers to be aware of new environment variables
