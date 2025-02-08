import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Home",
};

export default async function Page() {
    return <>
        <h1>Welcome to 10mg</h1>
    </>
}