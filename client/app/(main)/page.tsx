"use client";
import Input from "@/common/Input";

function Home() {
  return (
    <div className="w-fit flex items-center justify-center p-5">
      <Input label="Username" register={() => {}} name="username" />
    </div>
  );
}

export default Home;
