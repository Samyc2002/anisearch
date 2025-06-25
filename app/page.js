"use client";

import State from "@/components/context/state";
import HomeComponent from "@/components/custom/home";

export default function Home() {
  return (
    <State>
      <HomeComponent />
    </State>
  );
}
