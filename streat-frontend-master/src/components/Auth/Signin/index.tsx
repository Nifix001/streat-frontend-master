// Signin.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { getAccessToken } from "@/libs/api/auth";
import { useRouter } from "next/navigation";

import GoogleSigninButton from "../GoogleSigninButton";
import InputGroup from "../../FormElements/InputGroup";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { Checkbox } from "../../ui-elements/checkbox";

export default function Signin() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getAccessToken(data.email, data.password);
      localStorage.setItem("token", res.access_token);
      // localStorage.setItem("user", JSON.stringify(res.user));
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <GoogleSigninButton text="Sign in" />
      Divider
      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign in with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div> */}

      {/* Signin form */}
      <div>
        <form onSubmit={handleSubmit}>
          <InputGroup
            type="email"
            label="Email"
            placeholder="Enter your email"
            name="email"
            value={data.email}
            handleChange={handleChange}
            icon={<EmailIcon />}
            className="mb-4 [&_input]:py-[15px]"
          />
          <InputGroup
            type="password"
            label="Password"
            placeholder="Enter your password"
            name="password"
            value={data.password}
            handleChange={handleChange}
            icon={<PasswordIcon />}
            className="mb-5 [&_input]:py-[15px]"
          />

          <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
            <Checkbox
              label="Remember me"
              name="remember"
              withIcon="check"
              minimal
              radius="md"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData({ ...data, remember: e.target.checked })}
            />

            <Link
              href="/auth/forgot-password"
              className="hover:text-primary dark:text-white dark:hover:text-primary"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mb-4.5">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
            >
              {loading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div>
    </>
  );
}
